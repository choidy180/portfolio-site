'use client';

import styled, { keyframes, css } from 'styled-components';

interface ShinyTextProps {
    children: React.ReactNode;
    duration?: number; // animation duration in seconds
    className?: string;
}

const shine = keyframes`
    0% {
        background-position: 100%;
    }
    100% {
        background-position: -100%;
    }
`;

const StyledShiny = styled.h1<{ duration: number }>`
    display: inline-block;
    color: transparent;
    background-image: linear-gradient(
        120deg,
        rgba(255, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.8) 50%,
        rgba(255, 255, 255, 0) 60%
    );
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    ${({ duration }) => css`
        animation: ${shine} ${duration}s linear infinite;
    `}

    // 접근성 대응: prefers-reduced-motion 사용자 설정 감지
    @media (prefers-reduced-motion: reduce) {
        animation: none !important;
    }
`;

export default function ShinyText({
    children,
    duration = 3,
    className,
}: ShinyTextProps) {
    return (
        <StyledShiny duration={duration} className={className}>
            {children}
        </StyledShiny>
    );
}
