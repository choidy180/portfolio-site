'use client';

import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Image from 'next/image';

/** ===== Global ===== */
const Global = createGlobalStyle`
  :root {
    --red: #e4002b;
    --red-dark: #b3001f;
    --black: #0a0a0a;
    --white: #ffffff;
    --gray: #c9c9c9;
    --accent: #00ff9c;
    --accent-pink: #ff3d87;
    --card-w: 1100px;
  }
  html, body {
    padding: 0;
    margin: 0;
    background: var(--black);
    color: var(--white);
    font-family: Inter, Pretendard, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  }
  * { box-sizing: border-box; }
`;

/** ===== Layout ===== */
const Stage = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
`;

/* 레드 배경 + 원형 그래디언트 */
const RedBackdrop = styled.div`
  position: absolute;
  inset: -20% -10%;
  background:
    radial-gradient(1200px 600px at 65% 60%, #bf001f 0%, #9f001a 40%, #7f0014 60%, #4a000b 85%, #1d0003 100%),
    var(--red);
  opacity: .92;
  mix-blend-mode: normal;
`;

/* 검정 하프톤/패턴 느낌 */
const DotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(transparent 60%, rgba(0,0,0,.3) 61%),
    radial-gradient(transparent 60%, rgba(0,0,0,.25) 61%);
  background-size: 12px 12px, 18px 18px;
  background-position: 0 0, 6px 6px;
  mask-image: radial-gradient(1000px 600px at 60% 55%, #000 30%, transparent 80%);
  pointer-events: none;
`;

/** ===== Card (주요 패널) ===== */
const Card = styled.section`
  width: min(92vw, var(--card-w));
  aspect-ratio: 16 / 9;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

/* 흰색 큰 리본 패널 */
const Ribbon = styled.div`
  position: absolute;
  top: 8%;
  left: -3%;
  width: 78%;
  height: 22%;
  background: var(--white);
  color: var(--black);
  transform: skew(-12deg);
  box-shadow: 8px 12px 0 #00000070;
  display: flex;
  align-items: center;
  padding-left: 46px;
  border: 4px solid #000;
`;

/* 검정 작은 리본(하단) */
const RibbonBlack = styled(Ribbon)`
  top: 28%;
  left: -2%;
  width: 64%;
  height: 16%;
  background: var(--black);
  color: var(--white);
  border: 4px solid #fff;
  box-shadow: 8px 12px 0 #ffffff40;
`;

/* 레벨/경험치 라벨 */
const Label = styled.div`
  transform: skew(12deg); /* 부모의 skew 보정 */
  display: flex;
  gap: 22px;
  align-items: baseline;

  .lv {
    font-size: 56px;
    font-weight: 900;
    letter-spacing: -1px;
  }
  .info {
    display: grid;
    gap: 6px;
    font-weight: 800;
    font-size: 14px;
    letter-spacing: .5px;
  }
  .tag {
    padding: 4px 8px;
    background: var(--black);
    color: var(--white);
    border: 2px solid var(--black);
    font-size: 12px;
    font-weight: 900;
    align-self: start;
    margin-left: 12px;
  }
`;

/** ===== Progress Bar ===== */
const BarWrap = styled.div`
  transform: skew(12deg);
  width: clamp(280px, 42vw, 520px);
  display: grid;
  gap: 8px;
  .row {
    display: grid;
    grid-template-columns: 72px 1fr auto;
    align-items: center;
    gap: 10px;
    font-weight: 900;
  }
`;

const Bar = styled.div<{ value: number; color: string }>`
  height: 14px;
  border: 3px solid #000;
  background: #111;
  position: relative;
  overflow: hidden;
  &::after{
    content:'';
    position:absolute; inset:0;
    width:${p => Math.max(0, Math.min(100, p.value))}%;
    background: ${p => p.color};
    box-shadow: inset -6px 0 0 rgba(0,0,0,.2);
  }
`;

/** ===== 오른쪽 캐릭터 영역 ===== */
const CharWrap = styled.div`
  position: absolute;
  right: -4%;
  bottom: -6%;
  width: 46%;
  height: 92%;
  display: grid;
  place-items: end;
  filter: drop-shadow(0 20px 0 rgba(0,0,0,.35));
  pointer-events: none;
`;

/* 빨간 톤 실루엣을 위한 multiply 레드 플레이트 */
const RedPlate = styled.div`
  position: absolute;
  inset: 6% -6% -6% -6%;
  background: linear-gradient(180deg, var(--red) 0%, var(--red-dark) 100%);
  clip-path: polygon(16% 0, 100% 0, 100% 88%, 84% 100%, 0 100%, 0 12%);
  border: 6px solid #000;
`;

/** ===== 좌측 스탯 블록 ===== */
const StatBlock = styled.div`
  position: absolute;
  left: 4%;
  bottom: 6%;
  width: 38%;
  display: grid;
  gap: 8px;
  transform: rotate(-2deg);
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background: #000;
  border: 4px solid #fff;
  padding: 10px 14px;
  font-weight: 900;
  letter-spacing: .5px;
  text-transform: uppercase;
  box-shadow: 6px 8px 0 #ffffff50;
  .name { font-size: 18px; }
  .val { font-size: 22px; }
`;

/** ===== 좌상단 미니 HUD ===== */
const HUD = styled.div`
  position: absolute;
  top: -14px;
  right: 4%;
  transform: rotate(2deg);
  display: flex;
  gap: 8px;
  .chip {
    background: #000;
    border: 3px solid #fff;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: .6px;
    text-transform: uppercase;
    box-shadow: 4px 6px 0 #ffffff40;
  }
`;

/** ===== 작은 떠다니는 토막 텍스트 ===== */
const FloatNote = styled.div`
  position: absolute;
  left: 6%;
  top: 6%;
  transform: rotate(-6deg);
  background: #000;
  border: 4px solid #fff;
  padding: 8px 12px;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .8px;
  text-transform: uppercase;
  box-shadow: 6px 8px 0 #ffffff50;
`;

/** ===== 깜빡이는 커서 애니메이션 ===== */
const blink = keyframes`
  0%, 49% { opacity: 0; }
  50%, 100% { opacity: 1; }
`;
const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background: var(--white);
  margin-left: 6px;
  animation: ${blink} 1s infinite steps(1);
  vertical-align: middle;
`;

/** ===== 페이지 ===== */
export default function Page() {
  // 데모 데이터
  const level = 10;
  const nextExp = 498;
  const hp = { cur: 144, max: 144 };
  const sp = { cur: 53, max: 53 };
  const confidant = 4;
  const atk = 84;
  const def = 68;
  const totalExp = 3107;

  return (
    <>
      <Global />
      <Stage>
        <RedBackdrop />
        <DotGrid />

        <Card>
          <HUD>
            <div className="chip">모드: 어둠</div>
            <div className="chip">프로스난</div>
          </HUD>

          <FloatNote>
            로드고 대장 <Cursor />
          </FloatNote>

          {/* 상단 흰 리본 */}
          <Ribbon>
            <Label>
              <div className="lv">Lv.{level}</div>
              <div className="info">
                <div>NEXT EXP {nextExp}</div>
                <BarWrap>
                  <div className="row">
                    <span>HP</span>
                    <Bar value={(hp.cur / hp.max) * 100} color={'var(--accent)'} />
                    <small>{hp.cur}/{hp.max}</small>
                  </div>
                  <div className="row">
                    <span>SP</span>
                    <Bar value={(sp.cur / sp.max) * 100} color={'var(--accent-pink)'} />
                    <small>{sp.cur}/{sp.max}</small>
                  </div>
                </BarWrap>
              </div>
              <div className="tag">TOTAL EXP {totalExp}</div>
            </Label>
          </Ribbon>

          {/* 중간 검정 리본 */}
          <RibbonBlack>
            <Label>
              <div className="lv">관계</div>
              <div className="info">
                <div>콤피던트 Lv.{confidant}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[...Array(10)].map((_, i) => (
                    <Star key={i} active={i < confidant} />
                  ))}
                </div>
              </div>
              <div className="tag">STATUS</div>
            </Label>
          </RibbonBlack>

          {/* 좌측 스탯 */}
          <StatBlock>
            <StatRow>
              <span className="name">공격력</span>
              <span className="val">{atk}</span>
            </StatRow>
            <StatRow>
              <span className="name">방어력</span>
              <span className="val">{def}</span>
            </StatRow>
          </StatBlock>

          {/* 우측 캐릭터 영역 */}
          <CharWrap>
            <RedPlate />
            {/* 데모 캐릭터 이미지 (원본 대신 대체). 필요한 이미지로 교체 가능 */}
            <div style={{ position: 'relative', width: '88%', height: '88%', zIndex: 2, mixBlendMode: 'multiply' }}>
              <Image
                src="/persona-silhouette.png"
                alt="character"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </CharWrap>
        </Card>
      </Stage>
    </>
  );
}

/** ===== 작은 별 아이콘 ===== */
const StarWrap = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  background: ${p => (p.$active ? '#fff' : 'transparent')};
  box-shadow: ${p => (p.$active ? '0 0 0 2px #000 inset' : 'none')};
  clip-path: polygon(
    50% 0%,
    63% 38%,
    100% 38%,
    69% 59%,
    82% 100%,
    50% 74%,
    18% 100%,
    31% 59%,
    0% 38%,
    37% 38%
  );
`;

function Star({ active }: { active: boolean }) {
  return <StarWrap $active={active} />;
}

