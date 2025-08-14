'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function ViewportGate({
  minWidth = 1400,
  title = '이 프로젝트는 1400px 이상 화면에서만 볼 수 있어요.',
  desc = '창을 넓히거나 데스크톱/가로화면에서 다시 시도해 주세요.',
  children,
}: {
  minWidth?: number;
  title?: string;
  desc?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [vw, setVw] = useState<number | null>(null);

  // 1) 클라이언트 마운트 표시
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2) 마운트 후에만 폭 체크 & 상태 갱신
  useEffect(() => {
    if (!mounted) return;
    const check = () => {
      const w = window.innerWidth;
      setVw(w);
      setBlocked(w < minWidth);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mounted, minWidth]);

  // 3) 차단 시 스크롤 잠금
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (blocked) html.style.overflow = 'hidden';
    return () => { html.style.overflow = prev; };
  }, [mounted, blocked]);

  const handleClose = () => {
    window.open('', '_self')?.close();
    window.close();
    setTimeout(() => {
      if (history.length > 1) history.back();
      else location.replace('about:blank');
    }, 80);
  };

  return (
    <Root>
      {children}
      {/* 🔒 마운트 전에는 오버레이를 렌더하지 않음 → SSR/CSR 불일치 방지 */}
      {mounted && blocked && (
        <Overlay role="dialog" aria-modal="true">
          <Backdrop />
          <Panel>
            <Badge>NOTICE</Badge>
            <Title>{title}</Title>
            <Desc>{desc}</Desc>
            <BtnRow>
              <PrimaryButton onClick={handleClose}>닫기</PrimaryButton>
              <GhostButton onClick={() => location.reload()}>다시 확인</GhostButton>
            </BtnRow>
            {/* 동적 숫자는 suppressHydrationWarning로 보호(마운트 후 렌더이므로 안전하지만 함께 사용하면 더 확실) */}
            <Hint>
              현재 폭: <code suppressHydrationWarning>{vw ?? ''}</code>px / 기준: <code>{minWidth}</code>px
            </Hint>
          </Panel>
        </Overlay>
      )}
    </Root>
  );
}

/* ===== styled ===== */
/* ===== styled ===== */
/* ===== styled ===== */
const Root = styled.div`
  position: relative;
  min-height: 100vh;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      1200px 600px at 50% 40%,
      rgba(228, 0, 43, 0.25) 0%,
      rgba(10, 10, 10, 0.92) 60%,
      #000 100%
    ),
    #000;
  backdrop-filter: blur(2px);
`;

const Panel = styled.div`
  position: relative;
  z-index: 1;
  width: min(560px, 92vw);
  border: 4px solid #fff;
  background: #000;
  color: #fff;
  clip-path: polygon(6% 0, 100% 0, 100% 86%, 94% 100%, 0 100%, 0 14%);
  padding: 28px 28px 24px;
  box-shadow: 12px 16px 0 rgba(255, 255, 255, 0.25);
  transform: rotate(-1.4deg);
`;

const Badge = styled.span`
  display: inline-block;
  background: #e4002b;
  color: #fff;
  padding: 6px 10px;
  border: 2px solid #000;
  font-weight: 900;
  transform: rotate(2deg);
`;

const Title = styled.h2`
  margin: 14px 0 8px;
  font-size: clamp(20px, 3.2vw, 28px);
  line-height: 1.2;
`;

const Desc = styled.p`
  margin: 0 0 18px;
  opacity: 0.92;
  font-size: 1rem;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const BaseBtn = styled.button`
  all: unset;
  cursor: pointer;
  user-select: none;
  padding: 10px 16px;
  border: 3px solid #fff;
  font-weight: 900;
  clip-path: polygon(0 0, 90% 0, 100% 22%, 100% 100%, 10% 100%, 0 78%);
  transform: skew(-6deg);
  transition: 0.08s;
  &:active {
    transform: skew(-6deg) translateY(1px);
  }
`;

const PrimaryButton = styled(BaseBtn)`
  background: #fff;
  color: #000;
  box-shadow: 8px 10px 0 rgba(255, 255, 255, 0.35);
  &:hover {
    transform: skew(-6deg) translateX(4px);
  }
`;

const GhostButton = styled(BaseBtn)`
  background: #000;
  color: #fff;
  box-shadow: 8px 10px 0 rgba(255, 255, 255, 0.2);
  &:hover {
    transform: skew(-6deg) translateX(4px);
    background: #111;
  }
`;

const Hint = styled.div`
  margin-top: 12px;
  height: 2rem;
  font-size: 1rem;
  opacity: 0.7;
  code {
    background: #111;
    padding: 2px 6px;
    border: 1px solid #333;
    border-radius: 6px;
  }
`;
