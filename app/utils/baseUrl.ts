// utils/baseUrl.ts
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }

  // ✅ In Vercel/production — prefer internal fetches
  if (process.env.VERCEL) {
    return ''; // relative path allows Next.js to handle it internally (no network hop)
  }

  // ✅ In local dev (SSR needs full URL)
  return 'http://localhost:3000';
}
