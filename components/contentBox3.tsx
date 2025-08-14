'use client';
import styled from "styled-components";
import GlassPanel from "./glassPanel";
import CoverflowGallery from "./rolling-gallery";
import { SiNextdotjs, SiNodedotjs, SiPython, SiStackoverflow, SiStyledcomponents, SiTailwindcss } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import Orb from "./orb";
import { FaDatabase } from "react-icons/fa";
import Iridescence from "./Iridescence";

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
  "/ip2.jpg",
  "/ip.jpg",
  "/ip3.jpg",
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

export default function ContentBox3() {
  return (
    <Container>
      <Iridescence
        color={[0.25, 0.32, 0.45]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <Wrapper>
        <TopLine>
          <GlassPanel width={500} padding={24} radius={24} blur={10} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>IP Studio {'(2024~2025)'}</h2>
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

          <GlassPanel width={1224} height={190} padding={24} radius={24} blur={14} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'left' }}>
            <p>IP Studio는 웹소설, 웹툰, 영화·드라마 대본, 미술·디자인 등 다양한 창작물의 계약·발행 과정을 한곳에서 시각적으로 관리할 수 있는 플랫폼입니다. 창작자는 자신의 IP를 체계적으로 기록·발행하고, 기업·투자자와의 비즈니스 기회를 쉽게 연결할 수 있습니다. 이를 통해 창작물의 저작권 보호와 유통, 사업 확장을 효율적으로 지원하며, 콘텐츠 IP의 가치와 활용도를 극대화합니다.</p>
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
          <VisitButton onClick={()=> window.open(`https://ipstudio.storicha.in/intro`)}>
            <span>자세히 보기</span> <RiExternalLinkFill />
          </VisitButton>
        </FinalBox>
      </Wrapper>
    </Container>
  );
}
