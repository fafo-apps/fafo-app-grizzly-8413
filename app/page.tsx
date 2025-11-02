import Link from 'next/link';
import Image from 'next/image';
import { getBaseUrl } from '@/app/utils/baseUrl';

async function getPosts() {
  const res = await fetch(`${getBaseUrl()}/api/posts`, { cache: 'no-store' });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.posts as any[];
}

function formatDate(d?: string | null) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Your UK Travel Stories</h1>
        <p className="text-zinc-600">Add entries from London, Edinburgh, the Lake District, and more.</p>
      </div>

      {posts.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600">
          No posts yet. Click "New Post" to add your first story.
        </div>
      )}

      <ul className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="overflow-hidden rounded-xl border border-zinc-200 bg-white hover:shadow-sm transition-shadow">
            <Link href={`/posts/${post.slug}`} className="block">
              {post.cover_image_url ? (
                <div className="relative h-40 w-full">
                  <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-40 w-full bg-zinc-100" />
              )}
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-medium leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-sm text-zinc-600">{post.city ? `${post.city}, ` : ''}{post.country} • {formatDate(post.visited_on)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
