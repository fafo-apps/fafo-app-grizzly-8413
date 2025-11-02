// utils/baseUrl.ts
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }

  // ✅ In Vercel/production — prefer internal fetches
  if (process.env.VERCEL) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) return `https://${vercelUrl}`;
  }

  // ✅ In local dev (SSR needs full URL)
  return 'http://localhost:3000';
}
