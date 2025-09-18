'use client';
import styled, { createGlobalStyle } from 'styled-components';
// 기존 import 유지

const GlobalStyle = createGlobalStyle`
  html, body { height: 100%; margin: 0; }
  /* 선택: 부드러운 스크롤 */
  html { scroll-behavior: smooth; }
`;

/** 스크롤 영역(트랙) */
export const SnapContainer = styled.main`
  height: 100vh;                 /* 뷰포트 높이 */
  overflow-y: auto;              /* 내부 스크롤 */
  scroll-snap-type: y mandatory; /* 세로 스냅 */
  -webkit-overflow-scrolling: touch;
`;

/** 한 화면 섹션 */
export const Section = styled.section`
  position: relative;
  height: 100vh;                 /* 한 섹션이 한 화면 */
  scroll-snap-align: start;      /* 시작점에서 스냅 */
  scroll-snap-stop: always;      /* 빠르게 스크롤해도 한 섹션씩 멈춤 */
  overflow: hidden;              /* 내부가 커도 한 화면로 보이게 */
`;

export const SectionSide = styled.section`
  position: relative;
  min-height: 100vh;                 /* 한 섹션이 한 화면 */
  scroll-snap-align: start;      /* 시작점에서 스냅 */
  scroll-snap-stop: always;      /* 빠르게 스크롤해도 한 섹션씩 멈춤 */
  overflow: hidden;              /* 내부가 커도 한 화면로 보이게 */
`;

export default GlobalStyle;
