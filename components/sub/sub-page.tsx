import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  link?: string;
};

export default function SubPage() {
  // Raw data
  const [allProjects, setAllProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query (200ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 프로젝트 불러오기
        const res = await fetch('@/json/projects.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { projects: Project[] };
        if (!cancelled) setAllProjects(data.projects || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load projects');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build categories from all projects
  const categories = useMemo(() => {
    if (!allProjects) return [] as Array<[string, number]>;
    const map = new Map<string, number>();
    for (const p of allProjects) map.set(p.category, (map.get(p.category) || 0) + 1);
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allProjects]);

  // Filtered list by category + debounced query
  const filtered = useMemo(() => {
    const base = allProjects || [];
    const byCat = selectedCat === 'All' ? base : base.filter(p => p.category === selectedCat);
    if (!debouncedQuery) return byCat;
    return byCat.filter(p => {
      const hay = [p.title, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase();
      return hay.includes(debouncedQuery);
    });
  }, [allProjects, selectedCat, debouncedQuery]);

  // ===== Infinite Scroll =====
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [selectedCat, debouncedQuery]);

  const visible = useMemo(() => filtered.slice(0, PAGE_SIZE * page), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // Observe sentinel to load more
  useEffect(() => {
    if (!hasMore) return; // nothing to load
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) setPage(p => p + 1);
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, sentinelRef.current]);

  // Modal state
  const [active, setActive] = useState<Project | null>(null);

  // ESC to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <PageRoot>
      <Header>
        <Title>Projects</Title>
        <Sub>검색/카테고리로 필터링하고, 카드를 클릭해 상세 모달을 확인하세요.</Sub>
        <SearchBar>
          <SearchInput
            type="search"
            placeholder="Search title, description, tags..."
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
                All <Count>{allProjects?.length ?? 0}</Count>
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
                  {name} <Count>{count}</Count>
                </CatButton>
              </CatItem>
            ))}
          </CatList>
        </Sidebar>

        <Content>
          {error && <ErrorBox>데이터 로드 실패: {error}</ErrorBox>}

          {!allProjects && !error && (
            <SkeletonGrid>
              {Array.from({ length: 9 }).map((_, i) => (<SkeletonCard key={i} />))}
            </SkeletonGrid>
          )}

          {allProjects && (
            <>
              <Grid role="list" aria-label="project list">
                {visible.map((p) => (
                  <Card key={p.id} role="listitem">
                    <CardBody onClick={() => setActive(p)} tabIndex={0} onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(p); }
                    }}>
                      <CardTitle>{p.title}</CardTitle>
                      <CardDesc>{p.description}</CardDesc>
                      {p.tags && p.tags.length > 0 && (
                        <TagRow>
                          {p.tags.map((t, i) => (<Tag key={t + i}>#{t}</Tag>))}
                        </TagRow>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </Grid>

              {/* Sentinel for infinite scroll */}
              <Sentinel ref={sentinelRef} aria-hidden="true" />

              {filtered.length === 0 && (
                <Empty>검색어/카테고리에 해당하는 프로젝트가 없습니다.</Empty>
              )}
            </>
          )}
        </Content>
      </Layout>

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <ModalBody>
            <ModalTitle>{active.title}</ModalTitle>
            <ModalDesc>{active.description}</ModalDesc>
            <MetaRow>
              <MetaBadge>{active.category}</MetaBadge>
              {active.tags?.map((t) => (<MetaBadge key={t}>{t}</MetaBadge>))}
            </MetaRow>
            {active.link && (
              <ModalLink href={active.link} onClick={(e) => e.preventDefault()}>
                Visit Project →
              </ModalLink>
            )}
          </ModalBody>
        )}
      </Modal>
    </PageRoot>
  );
}

// ========= Modal Component =========
function Modal(
  { open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }
) {
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
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <ModalPanel ref={ref} tabIndex={-1}>
        <CloseBar>
          <CloseButton type="button" onClick={onClose} aria-label="close">✕</CloseButton>
        </CloseBar>
        {children}
      </ModalPanel>
    </Overlay>
  );
}

// ========= styled (tab-size: 2) =========
const PageRoot = styled.main`
  tab-size: 2;
  min-height: 100vh;
  background: #0b0b0b;
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
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  color: #ffffff;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
`;

const SearchBar = styled.div`
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #0f172a;
  color: #e5e7eb;
  border: 1px solid #1f2937;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  &:focus { border-color: #22d3ee; box-shadow: 0 0 0 2px rgba(34,211,238,.15); }
  &::placeholder { color: #6b7280; }
`;

const Layout = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;

  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 16px;
  align-self: start;
`;

const CatList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
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
  font-size: 14px;
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, transform .06s ease;
  &:hover { border-color: #374151; }
  &:active { transform: translateY(1px); }
`;

const Count = styled.span`
  float: right;
  opacity: .7;
`;

const Content = styled.section``;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const Card = styled.article`
  background: #0f172a;
  border: 1px solid #1f2937;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.button`
  display: block;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 16px 16px 12px;
  color: inherit;
  cursor: pointer;
  &:focus { outline: 2px solid #22d3ee; outline-offset: -2px; }
`;

const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 16px;
  color: #ffffff;
`;

const CardDesc = styled.p`
  margin: 0 0 10px;
  font-size: 13px;
  color: #9ca3af;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #111827;
  border: 1px solid #1f2937;
  color: #cbd5e1;
`;

// Skeletons while loading
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const SkeletonCard = styled.div`
  height: 134px;
  border-radius: 14px;
  background: linear-gradient(90deg, #0f172a 25%, #111827 37%, #0f172a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.6s infinite;
  border: 1px solid #1f2937;
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;

const Sentinel = styled.div`
  height: 1px;
`;

const Empty = styled.div`
  margin-top: 24px;
  text-align: center;
  color: #9ca3af;
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
  border: 1px solid #1f2937;
  border-radius: 16px;
  /* background: radial-gradient(800px 400px at 50% 0%, rgba(34,211,238,.08) 0%, rgba(2,6,23,1) 60%, #020617 100%); */
  background: #141414;
  color: #ffffff;
  box-shadow: 0 10px 40px rgba(0,0,0,.35);
`;

const CloseBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 8px 0 8px;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #e5e7eb;
  cursor: pointer;
  &:hover { background: #0f172a; }
`;

const ModalBody = styled.div`
  padding: 20px 20px 24px;
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

const ModalLink = styled.a`
  display: inline-block;
  font-size: 14px;
  color: #22d3ee;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  &:hover { border-bottom-color: #22d3ee; }
`;
