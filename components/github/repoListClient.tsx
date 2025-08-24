"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

type RepoItem = {
    id: number;
    name: string;
    url: string;
    description: string | null;
    updatedAt: string;
    languagesTop: string[];
};

const Wrap = styled.div`
    width: min(980px, 92vw);
    margin: 24px auto;
    color: #fff;
`;
const Head = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
`;
const Title = styled.h1`
    font-size: 20px;
    margin: 0;
`;
const Small = styled.small`
    color: #9aa;
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
    font-weight: 700;
    font-size: 16px;
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
const ErrorBox = styled.div`
    padding: 12px;
    border: 1px solid #3a1f1f;
    background: #190f0f;
    color: #ff8a8a;
    border-radius: 12px;
    margin-bottom: 12px;
`;
const Btn = styled.button`
    padding: 8px 12px;
    border: 1px solid #2a2a2a;
    background: #111;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    &:hover { border-color: #3a3a3a; }
`;
const Skeleton = styled.div`
    height: 96px;
    border: 1px solid #1b1b1b;
    border-radius: 12px;
    background: linear-gradient(90deg, #0f0f10 25%, #141414 50%, #0f0f10 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;

export default function RepoListClient({
    user,
    limit = 20,
    top = 3,
    linkTo = "github",
    timeoutMs = 12000,
}: {
    user: string;
    limit?: number;
    top?: number;
    linkTo?: "github" | "internal";
    timeoutMs?: number;
}) {
    const [repos, setRepos] = useState<RepoItem[] | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const abortRef = useRef<AbortController | null>(null);

    const endpoint = useMemo(() => {
        const p = new URLSearchParams({ user, limit: String(limit), top: String(top), timeoutMs: String(timeoutMs) });
        return `/api/github/repos?${p.toString()}`;
    }, [user, limit, top, timeoutMs]);

    const load = async () => {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(endpoint, { signal: ctrl.signal, cache: "no-store" });
            if (!res.ok) {
                let msg = "";
                try { msg = (await res.json()).error; } catch { /* noop */ }
                throw new Error(msg || `HTTP ${res.status}`);
            }
            const json = await res.json();
            setRepos(json.repos as RepoItem[]);
        } catch (e: any) {
            if (e?.name === "AbortError") return; // 중단 시 조용히
            setErr(e?.message || "네트워크 오류");
            setRepos(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        return () => abortRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    return (
        <Wrap>
            <Head>
                <Title>GitHub Repositories – {user}</Title>
                <Small>
                    {loading ? "불러오는 중…" : repos ? `${repos.length} repos` : "0 repos"}
                </Small>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <Btn onClick={load} disabled={loading}>{loading ? "로딩…" : "다시 불러오기"}</Btn>
                </div>
            </Head>

            {err && (
                <ErrorBox>
                    ❌ {err} <span style={{ opacity: .8 }}>(토큰/네트워크/레이트리밋 확인)</span>
                </ErrorBox>
            )}

            {loading && (
                <Grid>
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
                </Grid>
            )}

            {!loading && repos && (
                <Grid>
                    {repos.map((r) => {
                        const href = linkTo === "internal"
                            ? `/${["github", user, r.name].map(encodeURIComponent).join("/")}`
                            : r.url;

                        return (
                            <Card key={r.id} href={href} target={linkTo === "github" ? "_blank" : undefined} rel="noreferrer">
                                <Name>{r.name}</Name>
                                <Desc>{r.description ?? " "}</Desc>
                                <Meta>
                                    <Badge>Updated {new Date(r.updatedAt).toLocaleString()}</Badge>
                                    {r.languagesTop.length > 0 && <Badge>{r.languagesTop.join(" · ")}</Badge>}
                                </Meta>
                            </Card>
                        );
                    })}
                </Grid>
            )}
        </Wrap>
    );
}
