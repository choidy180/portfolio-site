'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import './css/coverflow-gallery.css';

export interface CoverflowProps {
  images: string[];
  width?: number;        // 전체 영역 가로
  height?: number;       // 카드 높이
  gap?: number;          // 카드 간 간격
  radius?: number;       // 모서리
  widthBoost?: number;   // 카드 가로 확대 배율(1 = 기본)
  autoplay?: boolean;
  autoplayDelay?: number;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CoverflowGallery({
  images,
  width = 1180,
  height = 420,
  gap = 28,
  radius = 22,
  widthBoost = 1.25,   // 카드 가로 좀 더 넓게 보이도록
  autoplay = false,
  autoplayDelay = 2500,
}: CoverflowProps) {
  // ❶ 항상 최대 3장만 사용
  const viewImages = useMemo(() => images.slice(0, 3), [images]);
  const slots = viewImages.length; // 1~3

  // 중앙 카드가 오도록 초기 인덱스 보정
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(slots === 3 ? 1 : 0); // 3장이면 가운데(1), 아니면 0
  }, [slots]);

  // ❷ 카드 폭 계산(중앙 정렬은 CSS에서 grid place-items:center 처리)
  const totalGap = gap * Math.max(0, slots - 1);
  const baseCardW = (width - totalGap) / Math.max(1, slots);
  const cardWidth  = Math.round(baseCardW * widthBoost);

  // 배치/각도 튜닝
  const spacing       = 0.68;                     // 낮을수록 더 겹쳐 보임
  const stepX         = (cardWidth + gap) * spacing;
  const anglePer      = 26;                       // 양옆 기울기
  const sideScaleBase = 0.9;

  // 드래그로 좌우 이동
  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const goLeft  = offset.x < -40 || velocity.x < -400;
    const goRight = offset.x >  40 || velocity.x >  400;
    if (goLeft)  setIndex(i => clamp(i + 1, 0, slots - 1));
    if (goRight) setIndex(i => clamp(i - 1, 0, slots - 1));
  };

  // 옵션: 자동 넘김
  useEffect(() => {
    if (!autoplay || slots <= 1) return;
    const t = setInterval(() => setIndex(i => (i + 1) % slots), autoplayDelay);
    return () => clearInterval(t);
  }, [autoplay, autoplayDelay, slots]);

  return (
    // cf-wrap은 CSS에서 display:grid; place-items:center; → 박스 내 가로/세로 중앙
    <div className="cf-wrap" style={{ width, height }}>
      <motion.div
        className="cf-track"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
      >
        {viewImages.map((src, i) => {
          // 중앙으로부터 거리(−1,0,1 범위)
          const dist = i - index;

          const x = dist * stepX;
          const rotateY = Math.max(-32, Math.min(32, -anglePer * dist));
          const scale = dist === 0 ? 1 : sideScaleBase - 0.03 * (Math.abs(dist) - 1);
          const zIndex = 100 - Math.abs(dist);
          const brightness = dist === 0 ? 1 : 0.95 - 0.08 * Math.min(2, Math.abs(dist));

          return (
            <motion.div
              key={src + i}
              className="cf-card"
              style={{ width: cardWidth, height, borderRadius: radius, zIndex }}
              animate={{ x, rotateY, scale, opacity: 1, filter: `brightness(${brightness})` }}
              transition={{ duration: 0.35 }}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`cover-${i}`} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
