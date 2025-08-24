import { NextRequest } from "next/server";

const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN; // 선택

function jsonHeaders(withAuth = true): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "readme-by-id",
  };
  if (withAuth && TOKEN) (h as any).Authorization = `token ${TOKEN}`;
  return h;
}
function htmlHeaders(withAuth = true): HeadersInit {
  const h: HeadersInit = {
    // README를 깃허브가 렌더한 HTML로 받기
    Accept: "application/vnd.github.html",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "readme-by-id",
  };
  if (withAuth && TOKEN) (h as any).Authorization = `token ${TOKEN}`;
  return h;
}

// 401/403 이면 무토큰 재시도
async function fetchWithFallback(url: string, headers: HeadersInit) {
  let res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok && (res.status === 401 || res.status === 403)) {
    const { Authorization, ...rest } = headers as any;
    res = await fetch(url, { headers: rest as HeadersInit, cache: "no-store" });
  }
  return res;
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id || !/^\d+$/.test(id)) {
      return new Response(
        JSON.stringify({ error: "invalid_id", note: "Query 'id' must be a numeric repository ID" }),
        { status: 400, headers: { "content-type": "application/json; charset=utf-8" } }
      );
    }

    // 1) ID로 owner/name 조회
    const repoRes = await fetchWithFallback(`${GITHUB_API}/repositories/${id}`, jsonHeaders(true));
    if (!repoRes.ok) {
      const body = await repoRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "github_error_on_lookup", status: repoRes.status, detail: body }),
        { status: repoRes.status, headers: { "content-type": "application/json; charset=utf-8" } }
      );
    }
    const repo = await repoRes.json(); // { owner: { login }, name, ... }

    // 2) owner/name으로 README HTML
    const readmeURL = `${GITHUB_API}/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}/readme`;
    const readmeRes = await fetchWithFallback(readmeURL, htmlHeaders(true));
    if (!readmeRes.ok) {
      const body = await readmeRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "github_error_on_readme", status: readmeRes.status, detail: body }),
        { status: readmeRes.status, headers: { "content-type": "application/json; charset=utf-8" } }
      );
    }

    const html = await readmeRes.text();
    return new Response(
      JSON.stringify({ id: Number(id), owner: repo.owner.login, repo: repo.name, html }, null, 2),
      { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "internal_error", detail: e?.message || String(e) }),
      { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }
}
