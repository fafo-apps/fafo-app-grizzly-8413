import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, slug, excerpt, content, city, country, visited_on, cover_image_url, created_at, updated_at
       FROM posts WHERE slug = $1 AND is_published = TRUE LIMIT 1`,
      [params.slug]
    );
    const post = rows[0];
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('GET /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const { title, excerpt, content, city, country, visited_on, cover_image_url, is_published } = body ?? {};

    const { rows } = await pool.query(
      `UPDATE posts SET
        title = COALESCE($1, title),
        excerpt = COALESCE($2, excerpt),
        content = COALESCE($3, content),
        city = COALESCE($4, city),
        country = COALESCE($5, country),
        visited_on = COALESCE($6, visited_on),
        cover_image_url = COALESCE($7, cover_image_url),
        is_published = COALESCE($8, is_published),
        updated_at = now()
       WHERE slug = $9
       RETURNING id, title, slug, excerpt, content, city, country, visited_on, cover_image_url, created_at, updated_at`,
      [title ?? null, excerpt ?? null, content ?? null, city ?? null, country ?? null, visited_on ?? null, cover_image_url ?? null, is_published ?? null, params.slug]
    );

    const post = rows[0];
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('PUT /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { rowCount } = await pool.query(`DELETE FROM posts WHERE slug = $1`, [params.slug]);
    if (!rowCount) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('DELETE /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
