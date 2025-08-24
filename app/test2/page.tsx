// app/test2/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReadmeModalById from "@/components/readmeModalById";

export default function Test2Page() {
  const sp = useSearchParams();

  // 지원하는 쿼리:
  // 1) ?id=<숫자>                          -> 바로 README by id
  // 2) ?id=<repoName>&owner=<owner>        -> repo-id 조회 후 README
  // 3) ?id=<repoName> (owner 기본 choidy180)
  const idParam = sp.get("id") || "";
  const owner = sp.get("owner") || "choidy180";

  const [repoId, setRepoId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setErr(null);
    setRepoId(null);

    // 숫자면 그대로 사용
    if (/^\d+$/.test(idParam)) {
      setRepoId(Number(idParam));
      setReady(true);
      return;
    }

    // 문자열이면 owner + repoName으로 ID 조회
    if (idParam) {
      (async () => {
        try {
          const url = `/api/github/repo-id?user=${encodeURIComponent(owner)}&repo=${encodeURIComponent(idParam)}`;
          const res = await fetch(url, { cache: "no-store" });
          const j = await res.json().catch(() => null);
          if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
          setRepoId(j.id as number);
        } catch (e: any) {
          setErr(e?.message || "레포 ID 조회 실패");
        } finally {
          setReady(true);
        }
      })();
    } else {
      setErr("쿼리로 id를 전달하세요. (?id=123 또는 ?id=repoName&owner=ownerName)");
      setReady(true);
    }
  }, [idParam, owner]);

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", display: "grid", placeItems: "center", gap: 12 }}>
      {!ready && <div>로딩 중…</div>}
      {ready && err && <div style={{ color: "#ff8a8a" }}>❌ {err}</div>}
      {ready && !err && repoId && <ReadmeModalById repoId={repoId} />}
    </main>
  );
}
