// components/AOSProvider.tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 700,         // 기본 애니메이션 길이(ms)
      easing: 'ease-out',    // 가속도
      once: true,            // 스크롤 위/아래 여러 번 보일 때 한 번만 실행
      offset: 80,            // 트리거 오프셋(px)
      // 접근성: 모션 최소화 설정을 존중
      disable: () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  return <>{children}</>;
}
