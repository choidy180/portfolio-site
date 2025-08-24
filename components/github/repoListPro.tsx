"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import RepoCardPro, { RepoDetailPro } from "./repoCardPro";

const Wrap = styled.div`
  width: min(980px, 92vw);
  margin: 32px auto;
  color: #eee;
`;

const Head = styled.div`
  display: flex; gap: 12px; align-items: center;
  margin-bottom: 16px; flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 20px; margin: 0;
`;

const Controls = styled.div`
  display: flex; gap: 8px; margin-left: auto; flex-wrap: wrap;
`;

const Input = styled.input`
  background:#0f0f10; border:1px solid #2a2a2a; color:#fff;
  padding:8px 10px; border-radius:10px; min-width: 220px;
`;

const Toggle = styled.label`
  display:flex; align-items:center; gap:6px; font-size:13px; color:#bbb;
  input { accent-color:#22c55e; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Badge = styled.span`
  font-size: 12px; color:#bbb;
`;

export default function RepoListPro({ user = "choidy180" }: { user?: string }) {
  const [data, setData] = useState<RepoDetailPro[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [withCommit, setWithCommit] = useState(false);
  const [withRelease, setWithRelease] = useState(false);

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true); setErr(null);
      try {
        const params = new URLSearchParams({ user });
        if (withCommit) params.append("include", "commit");
        if (withRelease) params.append("include", "release");
        const res = await fetch(`/api/github/repos?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
        const json = (await res.json()) as RepoDetailPro[];
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [user, withCommit, withRelease]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return data;
    return data.filter((r) => {
      const hay = [
        r.name, r.fullName, r.description ?? "", r.primaryLanguage ?? "",
        ...(r.topics ?? []), ...Object.keys(r.languages ?? {}),
      ].join(" ").toLowerCase();
      return hay.includes(keyword);
    });
  }, [data, q]);

  return (
    <Wrap>
      <Head>
        <Title>GitHub Repositories – {user}</Title>
        <Controls>
          <Input placeholder="검색 (이름/언어/토픽)" value={q} onChange={(e) => setQ(e.target.value)} />
          <Toggle><input type="checkbox" checked={withCommit} onChange={e => setWithCommit(e.target.checked)} /> 최신 커밋</Toggle>
          <Toggle><input type="checkbox" checked={withRelease} onChange={e => setWithRelease(e.target.checked)} /> 최신 릴리즈</Toggle>
        </Controls>
      </Head>

      {loading && <Badge>불러오는 중…</Badge>}
      {err && <Badge style={{ color:"#ff8a8a" }}>에러: {err}</Badge>}
      {!loading && !err && filtered.length === 0 && <Badge>결과 없음</Badge>}

      <Grid>
        {filtered.map((repo) => <RepoCardPro key={repo.id} repo={repo} />)}
      </Grid>
    </Wrap>
  );
}
