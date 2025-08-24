"use client";

import { useState } from "react";

// ⚠️ 클라이언트에서 바로 GitHub API 호출하려면 NEXT_PUBLIC_ 접두사 필수
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

function ghHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  return headers;
}

export default function TestGithubRepos() {
  const [repos, setRepos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.github.com/users/choidy180/repos", {
        headers: ghHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const json = await res.json();
      setRepos(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, color: "#fff", background: "#000" }}>
      <button
        onClick={handleClick}
        style={{ padding: "8px 16px", border: "1px solid #555", marginBottom: 16 }}
      >
        {loading ? "불러오는 중..." : "깃허브 레포 불러오기"}
      </button>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {repos.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {repos.map((repo) => (
            <li
              key={repo.id}
              style={{
                border: "1px solid #333",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 600, color: "#4ade80", textDecoration: "none" }}
              >
                {repo.name}
              </a>
              <p style={{ margin: "4px 0", fontSize: 14, color: "#aaa" }}>
                {repo.description || "No description"}
              </p>
              <small style={{ fontSize: 12, color: "#888" }}>
                ★ {repo.stargazers_count} | Forks: {repo.forks_count} | Lang:{" "}
                {repo.language || "N/A"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
