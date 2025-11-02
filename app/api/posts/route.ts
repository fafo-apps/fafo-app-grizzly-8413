import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET() {
  try {
    const schema = process.env.SUPABASE_SCHEMA || 'app_19';
    const { rows } = await pool.query(
      `SELECT id, title, slug, excerpt, city, country, visited_on, cover_image_url, created_at
       FROM ${schema}.posts
       WHERE is_published = TRUE
       ORDER BY visited_on DESC NULLS LAST, created_at DESC`
    );
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error('GET /api/posts error', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const schema = process.env.SUPABASE_SCHEMA || 'app_19';
    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      city,
      country = 'United Kingdom',
      visited_on,
      cover_image_url,
      is_published = true,
    } = body ?? {};

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    let base = slugify(title);
    if (!base) base = slugify(`${city || 'post'}-${Date.now()}`);
    let slug = base;

    const insert = async (trySlug: string) => {
      const { rows } = await pool.query(
        `INSERT INTO ${schema}.posts (title, slug, excerpt, content, city, country, visited_on, cover_image_url, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, title, slug, excerpt, city, country, visited_on, cover_image_url, created_at`,
        [title, trySlug, excerpt ?? null, content, city ?? null, country, visited_on ?? null, cover_image_url ?? null, is_published]
      );
      return rows[0];
    };

    try {
      const created = await insert(slug);
      return NextResponse.json({ post: created }, { status: 201 });
    } catch (e: any) {
      if (e?.code === '23505') {
        const uniqueSlug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
        const created = await insert(uniqueSlug);
        return NextResponse.json({ post: created }, { status: 201 });
      }
      console.error('POST /api/posts error', e);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
  } catch (err) {
    console.error('POST /api/posts parse error', err);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
