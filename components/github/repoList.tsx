// components/github/RepoList.tsx
// 서버 컴포넌트: GitHub 레포 목록 + 언어 비율/토픽/메타 렌더
// 모든 스타일은 styled-components로 구성

import styled from "styled-components";

type LangMap = Record<string, number>;

const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN; // .env.local (선택)

function ghHeaders(withAuth = true): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "repo-list-component",
  };
  if (withAuth && TOKEN) h.Authorization = `token ${TOKEN}`;
  return h;
}

// 401/403 → 무토큰 재시도
async function fetchJsonWithFallback<T = any>(url: string): Promise<T> {
  let res = await fetch(url, { headers: ghHeaders(true), cache: "no-store" });
  if (!res.ok && (res.status === 401 || res.status === 403)) {
    res = await fetch(url, { headers: ghHeaders(false), cache: "no-store" });
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} – ${body}`);
  }
  return res.json();
}

type RepoLite = {
  id: number;
  name: string;
  full_name: string;          // owner/repo
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  homepage: string | null;
  default_branch: string;
  language: string | null;    // primary
  topics?: string[];
  license: { key: string; name: string } | null;
  visibility?: string;
  archived: boolean;
  fork: boolean;
  size: number;               // KB
  updated_at: string;
  pushed_at: string;
  languages_url: string;
};

function toPercent(map: LangMap): Record<string, number> {
  const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(map)) out[k] = +((v / total) * 100).toFixed(2);
  return out;
}

// 언어명 → HSL 색상 (안겹치게)
function hueFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

// 간단 동시성 제한 map
async function pMap<T, R>(items: T[], limit: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const ret: R[] = [];
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

async function fetchAllRepos(user: string): Promise<RepoLite[]> {
  const perPage = 100;
  let page = 1;
  const acc: RepoLite[] = [];
  while (true) {
    const url = new URL(`${GITHUB_API}/users/${encodeURIComponent(user)}/repos`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("type", "owner");   // 필요시 all
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    const chunk = await fetchJsonWithFallback<RepoLite[]>(url.toString());
    acc.push(...chunk);
    if (chunk.length < perPage) break;
    page++;
  }
  return acc;
}

async function fetchLanguages(url: string): Promise<LangMap> {
  return fetchJsonWithFallback<LangMap>(url);
}

/* ===== styled-components ===== */
const Wrap = styled.div`
  width: min(980px, 92vw);
  margin: 24px auto;
  color: #fff;
`;

const Heading = styled.h1`
  font-size: 20px;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.a`
  display: block;
  padding: 14px;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  background: #0f0f10;
  text-decoration: none;
  color: inherit;
  transition: transform 0.12s ease, border-color 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #3a3a3a;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleLink = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #4ade80;
`;

const Desc = styled.p`
  color: #c9c9c9;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 6px;
  min-height: 1.4em;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px;
`;

const Pill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  font-size: 12px;
  color: #bbb;
`;

const LangBar = styled.div`
  width: 100%;
  height: 8px;
  background: #111;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
  display: flex;
`;

const LangSeg = styled.div<{ $w: number; $hue: number }>`
  width: ${(p) => p.$w}%;
  height: 100%;
  background: hsl(${(p) => p.$hue}, 70%, 50%);
`;

export default async function RepoList({
  user,
  linkTo = "internal",
}: {
  user: string;
  linkTo?: "internal" | "github";
}) {
  const repos = await fetchAllRepos(user);

  const detailed = await pMap(repos, 6, async (r) => {
    const languages = await fetchLanguages(r.languages_url).catch(() => ({} as LangMap));
    const languagePercent = toPercent(languages);

    const entries = Object.entries(languagePercent).sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 4);
    const restPct = entries.slice(4).reduce((a, [, v]) => a + v, 0);
    if (restPct > 0) top.push(["Other", +restPct.toFixed(2)]);

    return { r, languagePercent, top };
  });

  detailed.sort((a, b) => +new Date(b.r.updated_at) - +new Date(a.r.updated_at));

  return (
    <Wrap>
      <Heading>GitHub Repositories – {user}</Heading>

      <Grid>
        {detailed.map(({ r, top }) => {
          const href =
            linkTo === "internal"
              ? `/${["github", user, r.name].map(encodeURIComponent).join("/")}`
              : r.html_url;

          return (
            <Card
              key={r.id}
              href={href}
              rel="noreferrer"
              {...(linkTo === "github" ? { target: "_blank" } : {})}
            >
              <TitleRow>
                <TitleLink>{r.name}</TitleLink>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.archived && <Pill>archived</Pill>}
                  {r.visibility && r.visibility !== "public" && <Pill>{r.visibility}</Pill>}
                  {r.fork && <Pill>fork</Pill>}
                </div>
              </TitleRow>

              <Desc>{r.description ?? " "}</Desc>

              {top.length > 0 && (
                <>
                  <LangBar title="Language distribution">
                    {top.map(([name, pct]) => (
                      <LangSeg key={name} $w={pct} $hue={hueFromString(name)} title={`${name} ${pct}%`} />
                    ))}
                  </LangBar>
                  <div style={{ marginTop: 6, color: "#bbb", fontSize: 12 }}>
                    {top.map(([n, p]) => `${n} ${p}%`).join(" · ")}
                  </div>
                </>
              )}

              <MetaRow>
                {r.language && <Pill>{r.language}</Pill>}
                <Pill>★ {r.stargazers_count}</Pill>
                <Pill>⑂ {r.forks_count}</Pill>
                <Pill>issues {r.open_issues_count}</Pill>
                {r.license?.name && <Pill>{r.license.name}</Pill>}
                {r.topics?.slice(0, 4).map((t) => (
                  <Pill key={t}>#{t}</Pill>
                ))}
                <span style={{ marginLeft: "auto", color: "#9aa" }}>
                  <small>Updated {new Date(r.updated_at).toLocaleString()}</small>
                </span>
              </MetaRow>
            </Card>
          );
        })}
      </Grid>
    </Wrap>
  );
}
