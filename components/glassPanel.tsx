// components/GlassPanel.tsx
'use client';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

type Size = number | string;
const toCss = (v?: Size) => (typeof v === 'number' ? `${v}px` : v);

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: Size;
    height?: Size;
    maxWidth?: Size;
    maxHeight?: Size;
    padding?: Size;
    /** 흐림(px) */
    blur?: number;
    /** 밝은 유리 투명도(0~1) */
    alpha?: number;
    /** 모서리 라운드(px) */
    radius?: number;
    /** 그림자 강도(0~1) */
    elevation?: number;
    /** 테두리 밝기(0~1) */
    borderAlpha?: number;
    /** 기본 텍스트 색 */
    textColor?: string;
}

const Panel = styled.div<{
    $w?: Size; $h?: Size; $mw?: Size; $mh?: Size; $pad?: Size;
    $blur: number; $alpha: number; $radius: number; $elev: number; $borderAlpha: number; $fg: string;
}>`
    /* 사이즈 */
    width: ${({ $w }) => toCss($w) || 'auto'};
    height: ${({ $h }) => toCss($h) || 'auto'};
    max-width: ${({ $mw }) => toCss($mw) || 'none'};
    max-height: ${({ $mh }) => toCss($mh) || 'none'};
    padding: ${({ $pad }) => toCss($pad) || '20px'};

    position: relative;
    border-radius: ${({ $radius }) => `${$radius}px`};
    overflow: hidden;

    /* 밝은 유리 핵심 */
    --blur: ${({ $blur }) => `${$blur}px`};
    --alpha: ${({ $alpha }) => $alpha};
    backdrop-filter: blur(var(--blur)) saturate(160%);
    -webkit-backdrop-filter: blur(var(--blur)) saturate(160%);
    background: rgba(255, 255, 255, var(--alpha));

    /* 테두리 & 그림자 */
    border: 1px solid rgba(255, 255, 255, ${({ $borderAlpha }) => $borderAlpha});
    box-shadow: 0 12px 32px rgba(0, 0, 0, ${({ $elev }) => 0.25 * $elev});

    /* 텍스트 색 */
    color: ${({ $fg }) => $fg};
    & * { color: inherit; }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.75); }

    /* 상단 하이라이트 */
    &::before {
        content: '';
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.35),
            rgba(255,255,255,0.06)
        );
        mix-blend-mode: screen;
    }

    /* 폴백: backdrop-filter 미지원 */
    @supports not ((backdrop-filter: blur(10px))) {
        background: rgba(255, 255, 255, calc(var(--alpha) + 0.12));
    }

    p {
        line-height:1.8rem;
    }
`;

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
    {
        width,
        height,
        maxWidth,
        maxHeight,
        padding,
        blur = 16,
        alpha = 0.22,
        radius = 16,
        elevation = 1,
        borderAlpha = 0.45,
        textColor = '#fff',
        ...rest
    },
    ref
) {
    return (
        <Panel
            ref={ref}
            $w={width}
            $h={height}
            $mw={maxWidth}
            $mh={maxHeight}
            $pad={padding}
            $blur={blur}
            $alpha={alpha}
            $radius={radius}
            $elev={elevation}
            $borderAlpha={borderAlpha}
            $fg={textColor}
            {...rest}
        />
    );
});

export default GlassPanel;
