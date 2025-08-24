"use client";

import styled from "styled-components";

type LatestCommit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
} | null;

type LatestRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string;
} | null;

export type RepoDetailPro = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  homepage: string | null;
  primaryLanguage: string | null;
  topics: string[];
  languages: Record<string, number>;
  languagePercent: Record<string, number>;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  sizeKB: number;
  license: string | null;
  visibility: string;
  archived: boolean;
  fork: boolean;
  latestCommit: LatestCommit;
  latestRelease: LatestRelease;
};

const Card = styled.a`
  display: block;
  padding: 14px 16px;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: #0f0f10;
  transition: transform .12s ease, border-color .12s ease;
  &:hover { transform: translateY(-1px); border-color: #3a3a3a; }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 6px;
  display:flex; gap:8px; align-items:center; flex-wrap:wrap;
`;

const Desc = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: #c9c9c9;
  min-height: 1.4em;
  margin-bottom: 10px;
`;

const Meta = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap;
  font-size: 12px; color: #a9a9a9;
  margin-bottom: 10px;
`;

const Pill = styled.span`
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  padding: 2px 8px;
`;

const LangBar = styled.div`
  width: 100%;
  height: 8px;
  background: #1a1a1a;
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 6px;
  display:flex;
`;

const LangSeg = styled.div<{ w: number }>`
  width: ${p => p.w}%;
  height: 100%;
`;

const Small = styled.small`
  color:#9a9a9a;
`;

function languageSegments(percent: Record<string, number>) {
  // 상위 4개만 보여주고 나머지는 Other
  const entries = Object.entries(percent).sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, 4);
  const rest = entries.slice(4);
  const restPct = rest.reduce((a, [, v]) => a + v, 0);
  if (restPct > 0) top.push(["Other", +restPct.toFixed(2)]);
  return top;
}

export default function RepoCardPro({ repo }: { repo: RepoDetailPro }) {
  const segs = languageSegments(repo.languagePercent);

  return (
    <Card href={repo.url} target="_blank" rel="noreferrer">
      <Title>
        {repo.name}
        {repo.archived && <Pill>archived</Pill>}
        {repo.visibility !== "public" && <Pill>{repo.visibility}</Pill>}
        {repo.fork && <Pill>fork</Pill>}
      </Title>

      <Desc>{repo.description || "\u00A0"}</Desc>

      {/* 언어 비율 바 */}
      {segs.length > 0 && (
        <>
          <LangBar>
            {segs.map(([name, pct], i) => (
              <LangSeg key={name + i} w={pct} title={`${name} ${pct}%`} />
            ))}
          </LangBar>
          <Small>
            {segs.map(([name, pct]) => `${name} ${pct}%`).join(" · ")}
          </Small>
        </>
      )}

      <Meta style={{ marginTop: 8 }}>
        {repo.primaryLanguage && <Pill>{repo.primaryLanguage}</Pill>}
        <Pill>★ {repo.stars}</Pill>
        <Pill>⑂ {repo.forks}</Pill>
        <Pill>👀 {repo.watchers}</Pill>
        <Pill>issues {repo.openIssues}</Pill>
        {repo.license && <Pill>{repo.license}</Pill>}
        {repo.homepage && <Pill>site</Pill>}
        {repo.topics?.slice(0, 4).map((t) => <Pill key={t}>#{t}</Pill>)}
        <span style={{ marginLeft: "auto" }}>
          <small>Updated {new Date(repo.updatedAt).toLocaleString()}</small>
        </span>
      </Meta>

      {/* 최신 커밋/릴리즈(옵션) */}
      {(repo.latestCommit || repo.latestRelease) && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#bdbdbd" }}>
          {repo.latestCommit && (
            <div style={{ marginBottom: 4 }}>
              <b>Latest commit:</b>{" "}
              <a href={repo.latestCommit.html_url} target="_blank" rel="noreferrer">
                {repo.latestCommit.message?.split("\n")[0] ?? repo.latestCommit.sha.slice(0, 7)}
              </a>{" "}
              <Small>({new Date(repo.latestCommit.date).toLocaleString()})</Small>
            </div>
          )}
          {repo.latestRelease && (
            <div>
              <b>Latest release:</b>{" "}
              <a href={repo.latestRelease.html_url} target="_blank" rel="noreferrer">
                {repo.latestRelease.tag_name}
              </a>{" "}
              <Small>({new Date(repo.latestRelease.published_at).toLocaleString()})</Small>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
