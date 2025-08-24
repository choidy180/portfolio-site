// components/github/SimpleRepoList.tsx
// 서버 컴포넌트: 사용자 레포 목록을 GitHub API에서 불러와 렌더
// - 기본 정보: 이름, Updated 날짜
// - 사용된 언어: languages_url로 상위 언어 표시
// - 공개 레포는 토큰 없이도 동작. 토큰 있으면 레이트리밋 여유↑

import styled from "styled-components";

const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN; // .env.local (선택)

type LangMap = Record<string, number>;

type Repo = {
  id: number;
  name: string;
  full_name: string;      // owner/repo
  html_url: string;
  description: string | null;
  updated_at: string;
  languages_url: string;
};

function ghHeaders(withAuth = true): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "simple-repo-list",
  };
  if (withAuth && TOKEN) h.Authorization = `token ${TOKEN}`;
  return h;
}

// 401/403 → 무토큰 재시도
async function fetchJson<T = any>(url: string): Promise<T> {
  let r = await fetch(url, { headers: ghHeaders(true), cache: "no-store" });
  if (!r.ok && (r.status === 401 || r.status === 403)) {
    r = await fetch(url, { headers: ghHeaders(false), cache: "no-store" });
  }
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`${r.status} ${r.statusText} – ${body}`);
  }
  return r.json();
}

async function fetchAllRepos(user: string): Promise<Repo[]> {
  const perPage = 100;
  let page = 1;
  const out: Repo[] = [];
  while (true) {
    const url = new URL(`${GITHUB_API}/users/${encodeURIComponent(user)}/repos`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("type", "owner");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    const chunk = await fetchJson<Repo[]>(url.toString());
    out.push(...chunk);
    if (chunk.length < perPage) break;
    page++;
  }
  return out;
}

async function fetchLanguages(url: string): Promise<LangMap> {
  return fetchJson<LangMap>(url);
}

// 간단 동시성 맵퍼 (limit 병렬)
async function pMap<T, R>(items: T[], limit: number, fn: (item: T, idx: number) => Promise<R>) {
  const ret: R[] = Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) break;
      ret[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return ret;
}

/* ============ styled ============ */
const Wrap = styled.div`
  width: min(980px, 92vw);
  margin: 24px auto;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 20px;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Card = styled.a`
  display: block;
  padding: 14px;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  background: #0f0f10;
  text-decoration: none;
  color: inherit;
  transition: transform .12s ease, border-color .12s ease;
  &:hover { transform: translateY(-1px); border-color: #3a3a3a; }
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #4ade80;
`;

const Desc = styled.p`
  margin: 6px 0 8px;
  font-size: 13px;
  line-height: 1.4;
  color: #c9c9c9;
  min-height: 1.4em;
`;

const Meta = styled.div`
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  font-size: 12px;
  color: #bbb;
`;

export default async function SimpleRepoList({
  user,
  show = 20,              // 최대 표시 개수
  topLangs = 3,           // 표시할 상위 언어 수
  linkTo = "github",      // "github" | "internal"
}: {
  user: string;
  show?: number;
  topLangs?: number;
  linkTo?: "github" | "internal";
}) {
  // 1) 레포 목록
  const repos = (await fetchAllRepos(user)).slice(0, show);

  // 2) 각 레포의 언어 맵 → 상위 언어 이름 배열
  const languagesTop = await pMap(repos, 6, async (r) => {
    const map = await fetchLanguages(r.languages_url).catch(() => ({} as LangMap));
    const top = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topLangs)
      .map(([name]) => name);
    return top;
  });

  return (
    <Wrap>
      <Title>GitHub Repositories – {user}</Title>
      <Grid>
        {repos.map((r, i) => {
          const href = linkTo === "internal"
            ? `/${["github", user, r.name].map(encodeURIComponent).join("/")}`
            : r.html_url;

          return (
            <Card key={r.id} href={href} rel="noreferrer" {...(linkTo === "github" ? { target: "_blank" } : {})}>
              <Name>{r.name}</Name>
              <Desc>{r.description ?? " "}</Desc>
              <Meta>
                <Badge>Updated {new Date(r.updated_at).toLocaleString()}</Badge>
                {languagesTop[i].length > 0 && (
                  <Badge>{languagesTop[i].join(" · ")}</Badge>
                )}
              </Meta>
            </Card>
          );
        })}
      </Grid>
    </Wrap>
  );
}
