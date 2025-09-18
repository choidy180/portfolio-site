'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import data from '@/json/projects.json'; // 로컬 JSON 직접 import
import TextType from '@/components/textType';
import Image from 'next/image';
import Prism from '@/components/prism';

/**
 * Projects Page (with Search + Infinite Scroll)
 * - Next.js (App Router) client component
 * - styled-components, tab-size: 2
 * - Title + search bar on top
 * - Category list (sidebar) to filter
 * - Card grid; click opens modal
 * - Data imported directly from local JSON file
 */

// ========= Types =========
export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  link?: string;
  img?: string;
};

interface CardTitleProps {
  variant?: string;
}

export default function ProjectsPage() {
  // Raw data (local import)
  const [allProjects] = useState<Project[]>(data.projects as Project[]);

  // UI state
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // README fetch state
  const [readmeHtml, setReadmeHtml] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeErr, setReadmeErr] = useState<string | null>(null);

  // Modal state
  const [active, setActive] = useState<Project | null>(null);

  // === Helper: GitHub README HTML의 상대경로(img/a)를 절대경로로 보정 ===
  function rewriteGitHubHtml(html: string, owner?: string, repo?: string) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (owner && repo) {
        const imgBase = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;
        const linkBase = `https://github.com/${owner}/${repo}/blob/HEAD/`;

        // 이미지 src 보정
        doc.querySelectorAll<HTMLImageElement>('img[src]').forEach((img) => {
          const src = img.getAttribute('src')!;
          if (!src || /^https?:\/\//i.test(src) || src.startsWith('data:')) return;
          img.src = new URL(src, imgBase).toString();
          img.referrerPolicy = 'no-referrer';
        });

        // 링크 href 보정
        doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
          const href = a.getAttribute('href')!;
          if (!href || href.startsWith('#') || /^https?:\/\//i.test(href)) return;
          a.href = new URL(href, linkBase).toString();
          a.target = '_blank';
          a.rel = 'noreferrer noopener';
        });
      }
      return doc.body.innerHTML;
    } catch {
      return html; // 파서 실패 시 원본 유지
    }
  }

  // active 변경될 때 해당 id로 README HTML 요청
  useEffect(() => {
    let aborted = false;

    async function load() {
      if (!active?.id) {
        setReadmeHtml(null);
        setReadmeErr(null);
        setReadmeLoading(false);
        return;
      }
      try {
        setReadmeLoading(true);
        setReadmeErr(null);
        setReadmeHtml(null);

        const res = await fetch(
          `/api/github/readme-by-id?id=${encodeURIComponent(active.id)}&format=html`
        );
        const ct = res.headers.get('content-type') || '';

        if (!res.ok) {
          const msg = ct.includes('application/json')
            ? (await res.json())?.message ?? `HTTP ${res.status}`
            : await res.text();
          if (!aborted) setReadmeErr(typeof msg === 'string' ? msg : `HTTP ${res.status}`);
          return;
        }

        // 서버가 JSON({ id, owner, repo, html })로 내려주는 경우
        if (ct.includes('application/json')) {
          const j = await res.json();
          const owner = j.owner as string | undefined;
          const repo = j.repo as string | undefined;
          const rawHtml = (j.html ?? j.readme ?? '') as string;
          const fixed = rewriteGitHubHtml(rawHtml, owner, repo);
          if (!aborted) setReadmeHtml(fixed);
          return;
        }

        // 서버가 순수 HTML(text/html)로 내려주는 경우
        const html = await res.text();
        const fixed = rewriteGitHubHtml(html /* owner/repo 정보 없으면 리라이트 스킵 */, undefined, undefined);
        if (!aborted) setReadmeHtml(fixed);
      } catch (e: any) {
        if (!aborted) setReadmeErr(e?.message || 'failed to load README');
      } finally {
        if (!aborted) setReadmeLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
    };
  }, [active]);

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Build categories
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of allProjects) map.set(p.category, (map.get(p.category) || 0) + 1);
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allProjects]);

  // Filtered list
  const filtered = useMemo(() => {
    const byCat = selectedCat === 'All' ? allProjects : allProjects.filter((p) => p.category === selectedCat);
    if (!debouncedQuery) return byCat;
    return byCat.filter((p) => {
      const hay = [p.title, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase();
      return hay.includes(debouncedQuery);
    });
  }, [allProjects, selectedCat, debouncedQuery]);

  // ===== Infinite Scroll =====
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
  }, [selectedCat, debouncedQuery]);

  const visible = useMemo(() => filtered.slice(0, PAGE_SIZE * page), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, sentinelRef.current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <PageRoot>
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0.5}
        glow={1}
      />
      <Header>
        <Title>
          <TextType
            text={['Thank you for coming :)']}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </Title>
        <Sub>프로젝트를 검색하거나, 클릭하여 상세 정보를 확인하세요.</Sub>
        <SearchBar>
          <SearchInput
            type="search"
            placeholder="프로젝트의 이름또는 설명, 태그를 검색해보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
          />
        </SearchBar>
      </Header>

      <Layout>
        <Sidebar aria-label="category filters">
          <CatList role="list">
            <CatItem role="listitem">
              <CatButton
                type="button"
                $active={selectedCat === 'All'}
                onClick={() => setSelectedCat('All')}
                aria-pressed={selectedCat === 'All'}
              >
                All <Count>&nbsp;&nbsp;&nbsp;{allProjects.length}</Count>
              </CatButton>
            </CatItem>
            {categories.map(([name, count]) => (
              <CatItem key={name} role="listitem">
                <CatButton
                  type="button"
                  $active={selectedCat === name}
                  onClick={() => setSelectedCat(name)}
                  aria-pressed={selectedCat === name}
                >
                  {name} <Count>&nbsp;&nbsp;&nbsp;{count}</Count>
                </CatButton>
              </CatItem>
            ))}
          </CatList>
        </Sidebar>

        <Content>
          <Grid role="list" aria-label="project list">
            {visible.map((p) => (
              <Card key={p.id} role="listitem">
                <CardBody
                  onClick={() => setActive(p)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActive(p);
                    }
                  }}
                >
                  <TitleBox>
                    <Image src={p.img!} width={70} height={28} alt={p.title} />
                    <CardTitle variant={p.id}>{p.title}</CardTitle>
                  </TitleBox>
                  <CardDesc>{p.description}</CardDesc>
                  {p.tags && p.tags.length > 0 && (
                    <TagRow>
                      {p.tags.map((t, i) => (
                        <Tag key={t + i}>#{t}</Tag>
                      ))}
                    </TagRow>
                  )}
                </CardBody>
              </Card>
            ))}
          </Grid>

          <Sentinel ref={sentinelRef} aria-hidden="true" />

          {filtered.length === 0 && <Empty>검색어/카테고리에 해당하는 프로젝트가 없습니다.</Empty>}
        </Content>
      </Layout>

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <ModalBody>
            <ModalTitle>{active.title}</ModalTitle>
            <ModalDesc>{active.description}</ModalDesc>
            <MetaRow>
              <MetaBadge>{active.category}</MetaBadge>
              {active.tags?.map((t) => (
                <MetaBadge key={t}>{t}</MetaBadge>
              ))}
            </MetaRow>
            {active.link && <ModalLink onClick={() => window.open(`${active.link}`)}>Visit Project →</ModalLink>}

            {/* --- README 영역 --- */}
            {readmeLoading && <ReadmeLoading>README 불러오는 중…</ReadmeLoading>}
            {readmeErr && <ErrorBox>README 로드 실패: {readmeErr}</ErrorBox>}
            {readmeHtml && (
              <ReadmeBox
                className="readme-body"
                // Github HTML을 프록시로 그대로 받기 때문에 HTML 렌더
                dangerouslySetInnerHTML={{ __html: readmeHtml }}
              />
            )}
          </ModalBody>
        )}
      </Modal>
    </PageRoot>
  );
}

// ========= Modal Component =========
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => prev?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ModalPanel ref={ref} tabIndex={-1}>
        <CloseBar>
          <CloseButton type="button" onClick={onClose} aria-label="close">
            ✕
          </CloseButton>
        </CloseBar>
        {children}
      </ModalPanel>
    </Overlay>
  );
}

const PageRoot = styled.main`
  tab-size: 2;
  min-height: 100vh;
  background: #2b2b2b;
  color: #e5e7eb;
  padding: 48px 20px 72px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
`;

const Header = styled.header`
  max-width: 1160px;
  margin: 0 auto 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const Title = styled.h1`
  width: 100%;
  text-align: center;
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
  color: #ffffff;
  height: 3rem;
  overflow-y: hidden !important;
  font-family: 'GongGothicMedium';

  div {
    overflow-y: hidden;
  }
  h1 {
    overflow-y: hidden !important;
  }
  span {
    overflow-y: hidden;
  }
`;

const Sub = styled.p`
  width: 100%;
  text-align: center;
  font-family: 'GongGothicMedium';
  margin: 0;
  margin-top: 1rem;
  font-size: 1.4rem;
  color: #ededed;
`;

const SearchBar = styled.div`
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #141414;
  color: #e5e7eb;
  border: 1px solid #141414;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  &::placeholder {
    color: #aeaeae;
  }
`;

const Layout = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 16px;
  align-self: start;
`;

const CatList = styled.ul`
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
`;

const CatItem = styled.li``;

const CatButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? '#22d3ee' : '#1f2937')};
  background: ${({ $active }) => ($active ? 'rgba(34,211,238,0.08)' : '#111827')};
  color: ${({ $active }) => ($active ? '#e6fbff' : '#d1d5db')};
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.06s ease;
  &:hover {
    border-color: #374151;
  }
`;

const Count = styled.span`
  float: right;
  opacity: 0.7;
`;

const Content = styled.section`
  width: 100%;
`;

const Grid = styled.div`
  width: 100%;
  gap: 14px;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
`;

const Card = styled.article`
  background: #141414;
  border: 1px solid #141414;
  border-radius: 14px;
  overflow: hidden;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  width: calc(33.3333% - 9.5px);
  height: 220px;
  transition: all ease-in-out 0.15s;
`;

const CardBody = styled.button`
  display: block;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 16px 16px 12px;
  color: inherit;
  cursor: pointer;
  font-family: 'Paperlogy-4Regular';
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;

  img {
    margin-right: 8px;
    object-fit: cover;
  }
`;

const CardTitle = styled.span<CardTitleProps>`
  margin: 0 0 0 0px;
  font-size: 1.1rem;
  background-color: ${({ variant }) =>
    variant === '1036335472'
      ? '#3565AE'
      : variant === '994912091'
      ? '#1DB954'
      : variant === '914358369'
      ? '#1DB954'
      : variant === '289918118'
      ? '#2C1B12'
      : variant === '324815810'
      ? '#253220'
      : variant === '324817627'
      ? '#111C27'
      : variant === '324820828'
      ? '#12351F'
      : variant === '460561609'
      ? '#0B1D2E'
      : variant === '489676567'
      ? '#D9D5CD'
      : variant === '489703202'
      ? '#C6C6C6'
      : variant === '562470127'
      ? '#FFFFFF'
      : variant === '560046328'
      ? '#E24287'
      : variant === '586550881'
      ? 'linear-gradient(90deg, #FEE500 0 50%, #03C75A 50% 100%)'
      : variant === '592823271'
      ? '#f00'
      : variant === '1008661698'
      ? '#01B4E4'
      : '#f00'};
  color: ${({ variant }) =>
    variant === '1036335472'
      ? '#ffffff'
      : variant === '994912091'
      ? '#000000'
      : variant === '914358369'
      ? '#ffffff'
      : variant === '289918118'
      ? '#F4A44E'
      : variant === '324815810'
      ? '#E8E0CF'
      : variant === '324817627'
      ? '#F27822'
      : variant === '324820828'
      ? '#E8E0CF'
      : variant === '460561609'
      ? '#FFFFFF'
      : variant === '489676567'
      ? '#222322'
      : variant === '489703202'
      ? '#060606'
      : variant === '562470127'
      ? '#060606'
      : variant === '560046328'
      ? '#ffffff'
      : variant === '586550881'
      ? '#000000'
      : variant === '592823271'
      ? '#000000'
      : variant === '1008661698'
      ? '#ffffff'
      : '#ffffff'};
  background: ${({ variant }) =>
    variant === '586550881' ? 'linear-gradient(90deg, #FEE500 0 50%, #03C75A 50% 100%)' : 'transparents'};
  width: auto;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-family: 'GongGothicMedium';
`;

const CardDesc = styled.p`
  margin: 10px 0 0 0px;
  font-size: 1rem;
  color: #d4d4d4;
  line-height: 1.4rem;
  margin-top: 20px;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 20px;
`;

const Tag = styled.span`
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 999px;
  background: #111827;
  border: 1px solid #fcfcfc;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
`;

// Skeletons while loading
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonCard = styled.div`
  height: 134px;
  border-radius: 14px;
  background: linear-gradient(90deg, #0f172a 25%, #111827 37%, #0f172a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.6s infinite;
  border: 1px solid #1f2937;
  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

const Sentinel = styled.div`
  height: 1px;
`;

const Empty = styled.div`
  margin-top: 24px;
  text-align: center;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: 'GongGothicMedium';
`;

const ErrorBox = styled.div`
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #7f1d1d;
  background: #1f0b0b;
  color: #fecaca;
`;

// ===== Modal styles =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
`;

const ModalPanel = styled.div`
  width: min(720px, 92vw);
  border: 1px solid #141414;
  border-radius: 16px;
  background-color: #141414;
  color: #e5e7eb;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  position: relative;
`;

const CloseBar = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px 0 8px;
  z-index: 10;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #e5e7eb;
  cursor: pointer;
  &:hover {
    background: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 20px 20px 24px;
  max-height: 80vh;
  overflow: auto; /* 긴 README 스크롤 */
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 22px;
  color: #fff;
`;

const ModalDesc = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  color: #cbd5e1;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const MetaBadge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #0b1220;
  border: 1px solid #1f2937;
  color: #d1fae5;
`;

const ModalLink = styled.span`
  display: inline-block;
  font-size: 14px;
  color: #22d3ee;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  &:hover {
    border-bottom-color: #22d3ee;
  }
`;

const ReadmeLoading = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #cbd5e1;
`;

const ReadmeBox = styled.article`
  /* 모달 본문 여백 */
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px dashed #334155;

  /* 가독성 */
  line-height: 1.7;
  color: #e5e7eb;
  font-size: 15px;

  /* 기본 요소 */
  h1,
  h2,
  h3,
  h4 {
    margin: 18px 0 10px;
    line-height: 1.35;
    font-weight: 700;
    color: #fff;
  }
  h1 {
    font-size: 1.6rem;
  }
  h2 {
    font-size: 1.35rem;
  }
  h3 {
    font-size: 1.2rem;
  }
  p {
    margin: 10px 0;
  }
  a {
    color: #22d3ee;
    text-decoration: underline;
  }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
    font-size: 0.92em;
    padding: 2px 6px;
    background: #0b1220;
    border: 1px solid #1f2937;
    border-radius: 6px;
    color: #e2e8f0;
  }
  pre {
    margin: 12px 0;
    padding: 12px 14px;
    background: #0b1220;
    border: 1px solid #1f2937;
    border-radius: 10px;
    overflow: auto;
  }
  pre code {
    padding: 0;
    border: 0;
    background: transparent;
  }
  ul,
  ol {
    padding-left: 1.25rem;
  }
  blockquote {
    margin: 12px 0;
    padding: 8px 12px;
    border-left: 3px solid #334155;
    background: #0b1220;
    color: #cbd5e1;
    border-radius: 6px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 14px;
  }
  th,
  td {
    border: 1px solid #1f2937;
    padding: 8px 10px;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #1f2937;
    display: block;
    margin: 10px 0;
  }
`;
