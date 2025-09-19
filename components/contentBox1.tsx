'use client';
import styled from "styled-components";
import DarkVeil from "./darkveil";
import GlassPanel from "./glassPanel";
import CoverflowGallery from "./rolling-gallery";
import { SiLinux, SiReact, SiStackoverflow, SiStyledcomponents } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import GridDistortion from "./distortion";
import ImageBg from '@/public/splash-image.jpg'
import { useState } from "react";

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  /* background-color: #000; */
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
  user-select: none;
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
  p  { font-size: 1.2rem; user-select: none; }
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
  "/interview2.jpg",
  "/interview.jpg",
  "/interview3.jpg",
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
  background-color: #6366F1;
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
    user-select: none;
    svg {
        transform: scale(1.2);
    }

`;

const VisitButton = styled.div`
  padding: 8px 20px;
  background-color: #6366F1;
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

const GridBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`

const RightBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const Button = styled.button`
    padding: 10px 20px !important;
    font-size: 16px;
    background: #6366F1;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    height: 50px;
    font-size: 1rem;
    font-weight: 600;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalBox = styled.div`
    background: white;
    padding: 0 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 1000px;
    max-height: calc(100vh - 40px);
    text-align: center;
`;

const CloseButton = styled.button`
    margin-top: 20px;
    padding: 8px 16px;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
`;

export default function ContentBox1() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Container>
      <GridBox>
      {/* <DarkVeil /> */}
        <GridDistortion
          imageSrc={ImageBg}
          grid={10}
          mouse={0.25}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        />
      </GridBox>
      <Wrapper>
        <TopLine>
          <GlassPanel width={500} padding={24} radius={24} blur={4} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>하이버프 인터뷰 (2020-2021)</h2>
          </GlassPanel>
          <GlassPanel width={700} padding={24} radius={24} blur={4} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'center' }}>
            <h2>클라이언트 및 솔루션 전반 개발</h2>
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

          <GlassPanel width={1224} height={130} padding={24} radius={24} blur={4} alpha={0.0001} elevation={1} borderAlpha={1} textColor="#fff" style={{ textAlign: 'left' }}>
            <p>
              AI 기반 면접 코칭 프로그램을 기획·개발했습니다. 인터뷰를 녹화해 즉시 피드백을 제공하고,
              기업별 요구 역량을 선택해 맞춤 연습을 진행할 수 있으며, 원어민과 대화하듯 스피킹 연습도 지원합니다.
              이를 통해 지원자의 답변 완성도와 실제 면접 성과를 체계적으로 높였습니다.
            </p>
          </GlassPanel>
        </BottomLine>
        <FinalBox>
          <IconBox>
            <Icon>
              <SiReact color='#61DAFB' size={16}/>
              <span>REACT</span>
            </Icon>
            <Icon>
              <SiStackoverflow color="#F48024" size={16} />
              <span>STACK OVERFLOW</span>
            </Icon>

            <Icon>
              <SiLinux color="#FCC624" size={16} />
              <span>LINUX</span>
            </Icon>

            <Icon>
              <SiStyledcomponents color="#DB7093" size={16} />
              <span>STYLED-COMPONENTS</span>
            </Icon>
          </IconBox>
          <RightBox>
            {/* <VisitButton onClick={() => setIsOpen(true)}>
              <span>READ ME</span> <RiExternalLinkFill />
            </VisitButton> */}
            <VisitButton onClick={()=> window.open(`https://interview.highbuff.com/`)}>
              <span>자세히 보기</span> <RiExternalLinkFill />
            </VisitButton>
          </RightBox>
        </FinalBox>
      </Wrapper>
      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => setIsOpen(false)}>닫기</CloseButton>
                <h2>모달 제목</h2>
                <p>여기에 내용이 들어갑니다.</p>
            </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}
