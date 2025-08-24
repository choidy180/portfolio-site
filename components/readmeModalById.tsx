"use client";
import { useEffect, useState } from "react";

export default function ReadmeModalById({ repoId }: { repoId: number }) {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true); setErr(null); setHtml(null);
    try {
      const res = await fetch(`/api/github/readme-by-id?id=${repoId}`, { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setHtml(j.html as string);
    } catch (e: any) {
      setErr(e?.message || "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) load(); /* 모달 열릴 때마다 로드 */ }, [open, repoId]);

  return (
    <>
      <button onClick={() => setOpen(true)}>README 열기(ID: {repoId})</button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(960px, 92vw)", maxHeight: "86vh", background: "#0f0f10", color: "#e5e7eb", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, borderBottom: "1px solid #1b1b1b" }}>
              <strong>README</strong>
              <div style={{ marginLeft: "auto" }} />
              <button onClick={() => setOpen(false)} style={{ padding: "6px 10px" }}>닫기</button>
            </div>
            <div style={{ padding: 16 }}>
              {loading && <div>불러오는 중…</div>}
              {err && <div style={{ color: "#ff8a8a" }}>❌ {err}</div>}
              {!loading && !err && html && (
                <article
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={{ lineHeight: 1.6 }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
