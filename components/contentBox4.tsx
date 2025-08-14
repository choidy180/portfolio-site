'use client';
import styled from "styled-components";
import GlassPanel from "./glassPanel";
import CoverflowGallery from "./rolling-gallery";
import { SiNextdotjs, SiNodedotjs, SiPython, SiStackoverflow, SiStyledcomponents, SiTailwindcss } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import Orb from "./orb";
import { FaDatabase } from "react-icons/fa";
import Iridescence from "./Iridescence";
import Beams from "./beams";

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
  "/story2.jpg",
  "/story1.jpg",
  "/story3.jpg",
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
  background-color: white;
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
  background-color: white;
  color: black;
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

const SubP = styled.p`
  width: 100%;
  margin-top: 20px;
`

export default function ContentBox4() {
  return (
    <Container>
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
      <Wrapper>
        <TopLine>
          <GlassPanel width={500} padding={24} radius={24} blur={10} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>스토리체인 {'(2022~2024)'}</h2>
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

          <GlassPanel width={1224} height={400} padding={24} radius={24} blur={14} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'left' }}>
            <p>스토리체인은 불편했던 스토리 가치 측정 행위와 그에 이르는 합의과정을 조금 더 쉽고 신뢰도 있게 기록 할 수 있는 해결책을 제공합니다. 스토리체인의 퍼블릭 블록체인은 참여자의 계약의 공증효과를 제공하고 저장하는 역할을 하며 이때 퍼블릭 블록체인의 데이터 연산과 신뢰를 담보하는 데 쓰이는 토큰은 스토리 창작자, 프로듀서,일반독자 간 조건별 이행 약속을 지킬 수 있게 해주는 신뢰 매개체로써 스토리체인 웹 애플리케이션 서비스의 효용을 극대화 해주는 역할을 합니다. 스토리체인은 대표적인 유저군을 3가지로 나누고 그에 따른 문제점과 대응책을 제시합니다.</p>
            <SubP className="sub">기존에 php로 개발되었던 서비스를 REACT로 교체하고 성능최적화 및 서비스 개발, 유지보수를 담당하였습니다.</SubP>
          </GlassPanel>
        </BottomLine>
        <FinalBox>
          <IconBox>
            <Icon>
                <SiNextdotjs color="#000000" size={16} />
                <span>NEXT.JS</span>
            </Icon>

            {/* styled-components */}
            <Icon>
                <SiStyledcomponents color="#DB7093" size={16} />
                <span>STYLED-COMPONENTS</span>
            </Icon>

            {/* Zustand */}
            <Icon>
                <FaDatabase color="#FFCC00" size={16} />
                <span>ZUSTAND</span>
            </Icon>
            <Icon>
                <SiTailwindcss color="#06B6D4" size={16} />
                <span>TAILWIND CSS</span>
            </Icon>

          </IconBox>
          <VisitButton onClick={()=> window.open(`https://storicha.in/intro?tab_idx=9`)}>
            <span>자세히 보기</span> <RiExternalLinkFill />
          </VisitButton>
        </FinalBox>
      </Wrapper>
    </Container>
  );
}
