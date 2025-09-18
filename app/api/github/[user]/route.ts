// app/api/github/[user]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const UA = process.env.GITHUB_APP_NAME ?? 'nextjs-app';
const TOKEN = process.env.GITHUB_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ user: string }> }   // ✅ Promise 타입
) {
  const { user } = await params;                       // ✅ 반드시 await

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': UA,
  };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

  const gh = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(user)}/repos?per_page=30`,
    { headers, next: { revalidate: 60 } }
  );

  if (!gh.ok) {
    const err = await gh.json().catch(() => ({}));
    return NextResponse.json(
      { error: 'github_error', status: gh.status, message: err?.message ?? gh.statusText },
      { status: gh.status }
    );
  }

  const repos = await gh.json();
  return NextResponse.json(
    { ok: true, user, repos },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
  );
}
