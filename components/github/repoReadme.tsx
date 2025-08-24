// components/github/RepoReadme.tsx
// - /repos/{owner}/{repo}/readme 호출
// - format="html"이면 GitHub가 렌더한 HTML, "raw"면 원문 Markdown
// - repo 입력은 "owner/repo" 또는 "repo"(기본 owner 사용) 모두 지원

import styled from "styled-components";

const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN; // .env.local (선택)

type Format = "html" | "raw";

function ghHeaders(format: Format, withAuth = true): HeadersInit {
  const accept = format === "html" ? "application/vnd.github.html" : "application/vnd.github.raw";
  const h: HeadersInit = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "readme-viewer",
  };
  if (withAuth && TOKEN) (h as any).Authorization = `token ${TOKEN}`;
  return h;
}

async function fetchReadme(owner: string, repo: string, format: Format) {
  const url = `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  // 토큰 → 401/403이면 무토큰 재시도
  let res = await fetch(url, { headers: ghHeaders(format, true), cache: "no-store" });
  if (!res.ok && (res.status === 401 || res.status === 403)) {
    res = await fetch(url, { headers: ghHeaders(format, false), cache: "no-store" });
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} – ${body}`);
  }
  return res.text(); // html/raw 모두 text
}

const Box = styled.section`
  width: min(980px, 92vw);
  margin: 24px auto;
  color: #e5e7eb;
`;
const Title = styled.h1`
  font-size: 20px; margin: 0 0 12px;
`;
const Markdown = styled.article`
  background:#0f0f10; border:1px solid #2a2a2a; border-radius:14px; padding:18px;
  line-height: 1.6;
  h1,h2,h3,h4,h5 { margin: 1.2em 0 .6em; }
  pre { background:#0b0b0b; padding:12px; border-radius:10px; overflow:auto; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  a { color:#60a5fa; text-decoration: none; } a:hover { text-decoration: underline; }
  table { width:100%; border-collapse: collapse; }
  th, td { border:1px solid #2a2a2a; padding:6px 8px; }
  img { max-width:100%; height:auto; }
`;

export default async function RepoReadme({
  repoParam,            // "poke-next" 또는 "owner/repo"
  defaultOwner = "choidy180",
  format = "html",
}: {
  repoParam: string;
  defaultOwner?: string;
  format?: Format;
}) {
  // 파싱: "owner/repo" 또는 "repo" -> owner는 기본값 사용
  let owner = defaultOwner;
  let repo = repoParam?.trim();
  if (!repo) {
    return (
      <Box>
        <Title>README</Title>
        <div style={{ color: "#ff8a8a" }}>repo 파라미터가 비어있습니다.</div>
      </Box>
    );
  }
  if (repo.includes("/")) {
    const [o, r] = repo.split("/");
    owner = o || defaultOwner;
    repo = r || "";
  }
  if (!repo) {
    return (
      <Box>
        <Title>README</Title>
        <div style={{ color: "#ff8a8a" }}>올바른 repo 값을 입력하세요. 예) poke-next 또는 choidy180/poke-next</div>
      </Box>
    );
  }

  let content: string;
  try {
    content = await fetchReadme(owner, repo, format);
  } catch (e: any) {
    return (
      <Box>
        <Title>{owner}/{repo} – README</Title>
        <div style={{ color: "#ff8a8a", whiteSpace: "pre-wrap" }}>
          불러오기 실패: {e?.message || "Unknown error"}
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <Title>{owner}/{repo} – README</Title>
      {format === "html"
        ? <Markdown dangerouslySetInnerHTML={{ __html: content }} />
        : <Markdown><pre><code>{content}</code></pre></Markdown>}
    </Box>
  );
}
