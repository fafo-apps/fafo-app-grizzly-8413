import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '@/app/utils/baseUrl';

async function getPost(slug: string) {
  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load post');
  const data = await res.json();
  return data.post as any;
}

function formatDate(d?: string | null) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="prose prose-zinc max-w-none">
      {post.cover_image_url && (
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mb-6 text-zinc-600">{post.city ? `${post.city}, ` : ''}{post.country} • {formatDate(post.visited_on)}</p>
      <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
      <div className="mt-10">
        <Link href="/" className="text-sm text-zinc-700 hover:underline">← Back to all posts</Link>
      </div>
    </article>
  );
}
