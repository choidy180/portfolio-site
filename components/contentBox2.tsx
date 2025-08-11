'use client';
import styled from "styled-components";
import GlassPanel from "./glassPanel";
import CoverflowGallery from "./rolling-gallery";
import { SiNodedotjs, SiPython, SiStackoverflow } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import Orb from "./orb";

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
`;

const Wrapper = styled.div`
  width: 1224px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: 'Paperlogy-4Regular';

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const TopLine = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BottomLine = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 14px;

  img { object-fit: cover; border-radius: 24px; }
  p  { font-size: 1.2rem; }
`;

const ImageBox = styled.div`
  position: relative;
  width: 1224px;
  height: 700px;
  overflow: hidden;  /* ← 세로 스크롤 컷 */

  display: flex;
  justify-content: center;
  align-items: center;
`;

const IMGS: string[] = [
  "/buff2.jpg",
  "/buff1.jpg",
  "/buff3.jpg",
];

const FinalBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  button {
    padding: 8px;
  }
`

const IconBox = styled.div`
  width: auto;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  background-color: #FC8500;
  padding: 8px;
  border-radius: 8px;
`
const Icon = styled.ul`
    list-style: none;
    padding-left: 0;
    padding: 6px 8px;
    border-radius: 6px;
    background-color: #000;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8.5px;
    color: #FFFFFF;
    svg {
        transform: scale(1.2);
    }

`;

const VisitButton = styled.div`
  padding: 8px 20px;
  background-color: #FC8500;
  color: #FFFFFF;
  font-weight: 600;
  border-radius: 12px;
  height: 50px;
  letter-spacing: 1px;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;

  gap: 10px;

  svg {
    transform: scale(1.2);
  }

`

export default function ContentBox2() {
  return (
    <Container>
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={254}
        forceHoverState={false}
      />
      <Wrapper>
        <TopLine>
          <GlassPanel width={500} padding={24} radius={24} blur={10} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>하이버프 재테크 (2020-2021)</h2>
          </GlassPanel>
          <GlassPanel width={700} padding={24} radius={24} blur={10} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>클라이언트 및 시스템 개발</h2>
          </GlassPanel>
        </TopLine>

        <BottomLine>
          <ImageBox>
            <CoverflowGallery
              images={IMGS}
              width={1200}
              height={420}
              gap={36}
              widthBoost={1.3}
            />
          </ImageBox>

          <GlassPanel width={1224} height={300} padding={24} radius={24} blur={14} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'left' }}>
            <p>
              하이버프 AI는 금융 빅데이터를 수집 및 분석하고, CRNN 알고리즘을 활용하여 시세 변동성을 예측한 뒤 예측 그래프를 생성합니다. 또한 실시간으로 시세를 모니터링하여 예측과 다른 상황이 발생하면 리밸런싱을 통해 이익을 실현하고 예측 실패 시 투자 패턴을 개선합니다. 이 AI는 투자의 모든 과정을 대신하여 인간의 실수를 줄이고 시간적, 정신적 스트레스를 없애줍니다.
            </p>
            <p>금융 빅데이터 수집·분석부터 CRNN 기반 변동성 예측·시각화, 실시간 리밸런싱등 여러 시스템개발과 클라이언트 UI,UX 개발에 참여하였고, 투자자의 실수와 스트레스를 줄이는 경험을 구현했습니다.</p>
          </GlassPanel>
        </BottomLine>
        <FinalBox>
          <IconBox>
            <Icon>
              <SiPython color="#3776AB" size={16} />
              <span>PYTHON</span>
            </Icon>

            {/* Node.js */}
            <Icon>
              <SiNodedotjs color="#339933" size={16} />
              <span>NODE.JS</span>
            </Icon>

            {/* Stack Overflow */}
            <Icon>
              <SiStackoverflow color="#F48024" size={16} />
              <span>STACK OVERFLOW</span>
            </Icon>

          </IconBox>
          <VisitButton onClick={()=> window.open(`https://highbuff.com/person/`)}>
            <span>자세히 보기</span> <RiExternalLinkFill />
          </VisitButton>
        </FinalBox>
      </Wrapper>
    </Container>
  );
}
