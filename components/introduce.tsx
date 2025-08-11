import styled from "styled-components";
import SplitText from "./splitText";
import { useRef } from "react";
import CardSwap, { Card } from "./cardSwap";
import Image from "next/image";
import DesignImage from '../public/designGreen.png';
import ClientImage from '../public/clientBlue.png';
import ExperienceImage from '../public/experienceWhite.png';
import Ribbons from "./ribbons";
import Aurora from "./aurora";

const Container = styled.div`
    position: relative;
    /* height → min-height 로 */
    min-height: 100vh;
    /* 과도한 세로 패딩 줄이기 (또는 상하만 적용) */
    padding: 10vh 0;

    width: 100vw;
    background-color: #000;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box; /* 박스합계에 패딩/보더 포함 */
    overflow: hidden;
`;

const Title = styled.div`
    padding: 24px 24px 0px 24px;
    color: #FFFFFF;
    font-size: 2rem;
    font-family: 'GongGothicMedium';
    background-color: #1E1E1E;
`

const Content = styled.div`
    /* 고정 너비 대신 반응형 + 최대값 */
    width: min(100%, 1000px);
    /* 패딩도 반응형으로 살짝 줄이기 */
    padding: clamp(24px, 6vw, 64px) clamp(24px, 8vw, 100px);

    color: #fff;

    border-top: 20px solid #1e1e1e;
    border-left: 4px solid #1e1e1e;
    border-right: 4px solid #1e1e1e;
    border-bottom: 20px solid #1e1e1e;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 40px;
    font-family: 'Paperlogy-4Regular';

    box-sizing: border-box; /* ✅ 패딩/보더 포함 */
    margin-top: 6vh;        /* 100px 고정 대신 뷰포트 기준 */
    /* 긴 단어로 인한 가로 스크롤 예방 */
    overflow-wrap: anywhere;

    p {
        font-size: 1.4rem;
        line-height: 1.7rem;
    }
`;

const CardSection = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 400px;
    overflow: hidden;
    z-index: 2;

    h4 {
        padding: 8px 14px 4px 14px;
        font-size: 1.4rem;
        font-weight: 600;
        color: #ffffff;
    }
`

const ColorBox = styled.div.withConfig({shouldForwardProp: (prop) => prop !== "$color",})<{$color?: string;}>`
    width: 100%;
    height: 220px;
    background-color: ${({ $color }) => $color ?? "#e9ecef"};
    border-radius: 12px;
    margin: 14px;

    img {
        object-fit: cover;
    }
`;

const BgBox = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;

`


const Introduce = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <Container>
            <BgBox>
                <Aurora
                    colorStops={["#ff3cac", "#784ba0", "#2b86c5"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </BgBox>
            <Title>
                {/* <DecryptedText
                    text="“ 항상 트렌디하고 편리한 경험을 추구합니다. ”"
                    animateOn="view"
                    revealDirection="center"
                    speed={50}
                    maxIterations={50}
                /> */}
                <SplitText
                    text="“ 항상 트렌디하고 편리한 경험을 추구합니다. ”"
                    className="text-2xl font-semibold text-center"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />
            </Title>
            <Content ref={containerRef}>
                <p>시각적으로 아름답고,<br/>확장 가능하며 편리한 경험을 지향합니다.</p>
                <p>각 프로젝트에서 핵심 사용자 여정을 설계하고, <br/>시스템이 전달해야 할 가치를 명확하고 <br/>효율적으로 드러내기 위해 끊임없이 고민하고 소통해 왔습니다.</p>
                <p>이제 쌓아온 경험을 바탕으로, <br/>프로젝트 고유의 경험을 사용자 친화적으로 확장해 나가겠습니다.</p>
            </Content>
            <CardSection>
                <CardSwap
                    cardDistance={60}
                    verticalDistance={70}
                    delay={2000}
                    pauseOnHover={false}
                    width={500}
                    height={300}
                >
                    <Card>
                        <h4>Client</h4>
                        <ColorBox>
                            <Image
                                width={500}
                                height={300}
                                alt="blueClient"
                                src={ClientImage}
                            />
                        </ColorBox>
                    </Card>
                    <Card>
                        <h4>Experience</h4>
                        <ColorBox>
                            <Image
                                width={500}
                                height={300}
                                alt="blueClient"
                                src={ExperienceImage}
                            />
                        </ColorBox>
                    </Card>
                    <Card>
                        <h4>Design</h4>
                        <ColorBox>
                            <Image
                                width={500}
                                height={300}
                                alt="blueClient"
                                src={DesignImage}
                            />
                        </ColorBox>
                    </Card>
                </CardSwap>
            </CardSection>
            <Ribbons
                baseThickness={30}
                colors={['#4834d4']}
                speedMultiplier={0.5}
                maxAge={500}
                enableFade={false}
                enableShaderEffect={true}
            />
        </Container>
    )
}

export default Introduce;