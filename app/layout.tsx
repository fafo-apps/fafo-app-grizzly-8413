import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Trip Blog",
  description: "Your travel stories from the United Kingdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900`}>
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">UK Trip Blog</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/new" className="rounded-full bg-black text-white px-3 py-1.5 hover:bg-zinc-800">New Post</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-4xl px-4 py-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} UK Trip Blog
        </footer>
      </body>
    </html>
  );
}
