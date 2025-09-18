// app/api/github/readme-by-id/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const UA = process.env.GITHUB_APP_NAME ?? 'nextjs-readme-by-id';
const TOKEN = (process.env.GITHUB_TOKEN || '').trim();

function json(body: unknown, init?: number | ResponseInit) {
  const opts = typeof init === 'number' ? { status: init } : (init ?? {});
  return new NextResponse(JSON.stringify(body), {
    ...opts,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(opts as ResponseInit).headers,
    },
  });
}

// 토큰 스킴 자동판별
function buildAuthHeader(token: string): string | null {
  if (!token) return null;
  // Fine-grained token
  if (token.startsWith('github_pat_')) return `Bearer ${token}`;
  // Classic PAT (ghp_, gho_, ghu_, ghs_, ghr_)
  if (/^gh[opusr]_/.test(token)) return `token ${token}`;
  // 기본값: token
  return `token ${token}`;
}

async function gh(path: string, init?: RequestInit) {
  const url = `${GITHUB_API}${path}`;

  const headers: Record<string, string> = {
    'User-Agent': UA,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(init?.headers as any),
  };

  const auth = buildAuthHeader(TOKEN);
  if (auth) headers['Authorization'] = auth;

  // 1차 요청
  let res = await fetch(url, { ...init, headers });

  // 401 → Bad credentials 시 Authorization 제거하고 1회 무인증 재시도
  if (res.status === 401 && headers['Authorization']) {
    const { Authorization, ...rest } = headers;
    res = await fetch(url, { ...init, headers: rest });
  }

  return res;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return json({ error: 'missing_params', note: 'Required query: id' }, 400);

  try {
    // 1) id → owner/repo
    const repoRes = await gh(`/repositories/${encodeURIComponent(id)}`);
    if (!repoRes.ok) {
      const err = await repoRes.json().catch(() => ({}));
      return json(
        { error: 'github_error', status: repoRes.status, message: err?.message ?? 'repo lookup failed' },
        repoRes.status
      );
    }
    const repo = (await repoRes.json()) as { owner: { login: string }; name: string };

    // 2) README (HTML)
    const readmeRes = await gh(
      `/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}/readme`,
      { headers: { Accept: 'application/vnd.github.html' } }
    );

    if (!readmeRes.ok) {
      // 깃허브 에러 메시지 최대한 노출
      const text = await readmeRes.text().catch(() => '');
      let message = text;
      try {
        const j = JSON.parse(text);
        message = j?.message ?? text;
      } catch {}
      return json(
        { error: 'github_error', status: readmeRes.status, message: message || 'readme not found' },
        readmeRes.status
      );
    }

    const html = await readmeRes.text();
    return json(
      { ok: true, id, owner: repo.owner.login, repo: repo.name, html },
      { status: 200, headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate=600' } }
    );
  } catch (e: any) {
    return json({ error: 'unknown_error', message: e?.message ?? String(e) }, 500);
  }
}
