"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      city: formData.get('city') || null,
      visited_on: formData.get('visited_on') || null,
      cover_image_url: formData.get('cover_image_url') || null,
      excerpt: formData.get('excerpt') || null,
      content: formData.get('content') || null,
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create');
      router.push(`/posts/${data.post.slug}`);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New Post</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" required placeholder="Day in London: Borough Market & Thames Walk" className="w-full rounded-md border border-zinc-300 px-3 py-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input name="city" placeholder="London" className="w-full rounded-md border border-zinc-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Visited on</label>
            <input type="date" name="visited_on" className="w-full rounded-md border border-zinc-300 px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Cover image URL</label>
          <input name="cover_image_url" placeholder="https://images.unsplash.com/photo-..." className="w-full rounded-md border border-zinc-300 px-3 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Excerpt</label>
          <input name="excerpt" placeholder="A perfect rainy day wandering the South Bank and cozy pubs." className="w-full rounded-md border border-zinc-300 px-3 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Story</label>
          <textarea name="content" required rows={10} placeholder={`We started at Borough Market for breakfast...`}
            className="w-full rounded-md border border-zinc-300 px-3 py-2" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50">
            {loading ? 'Publishing…' : 'Publish Post'}
          </button>
          <button type="button" className="text-sm text-zinc-700 hover:underline" onClick={() => history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
