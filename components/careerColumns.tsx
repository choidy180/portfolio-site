'use client';

import styled from 'styled-components';
import {
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiCss3,
  SiDiscord,
  SiFigma,
  SiFirebase,
  SiHtml5,
  SiJavascript,
  SiMariadb,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiStackoverflow,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript
} from 'react-icons/si';
import { BiLogoVisualStudio } from 'react-icons/bi';
import LightRays from './lightRays';
import SplashCursor from './splash-cursor';
import { FaBirthdayCake, FaEnvelope, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

const Container = styled.section`
  position: relative;
  z-index: 1;
  min-width: 100vw;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 2rem;
  overflow: hidden;
`;

const Grid = styled.div`
  max-width: 1200px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  gap: 4rem;
  justify-content: space-between;
  flex-wrap: wrap;
  z-index: 3;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin-bottom: 1.5rem;
  user-select: none;
`;

const Entry = styled.div`
  margin-bottom: 1.5rem;
`;

const Year = styled.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
  user-select: none;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const ListRow = styled.ul`
  list-style: none;
  padding-left: 0;
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 8px;
  flex-wrap: wrap;
`;

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

const Item = styled.li`
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.3rem;
  display: flex;
  user-select: none;
  font-size: 1;
  display: flex;
  justify-content: start;
  align-items: center;

  div {
    flex-shrink: 0;
    width: 120px;
    transform: scaleX(0.9);
    margin-left: -4px;
    font-weight: 600;

    span {
      background-color: #000000;
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
`;

const AboutContainer = styled.section`
  position: relative;
  width: 100%;
  max-width: 1080px;
  margin: 48px auto;
  padding: 0 24px;
  color: white;
  z-index: 10;
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const AboutIcon = styled.span`
  display: inline-block;
  font-size: 24px;
  color: #ffffff;
  transform: translateY(-2px);
  margin-right: 8px;
`;

const AboutTitle = styled.h2`
  display: inline-block;
  font-weight: 900;
  font-size: 44px;
  letter-spacing: 1px;
`;

const AboutDivider = styled.hr`
  width: 160px;
  height: 1px;
  border: 0;
  background: #ffffff;
  margin: 10px auto 0;
`;

const AboutGrid = styled.ul`
  list-style: none;
  margin: 36px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 36px;
  column-gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const AboutCard = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const AboutIconWrap = styled.div`
  flex: none;
  width: 28px;
  height: 28px;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  margin-top: 2px;
`;

const AboutText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AboutLabel = styled.div`
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
`;

const AboutValue = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-size: 1.2rem;
  color: #ffffff;
`;

export default function CareerColumns() {
  const aboutItems = [
    { icon: <FaUser />, label: "이름", value: "김민석" },
    { icon: <FaBirthdayCake />, label: "생년월일", value: "94.07.04" },
    { icon: <FaMapMarkerAlt />, label: "위치", value: "서울특별시 서초구" },
    { icon: <FaPhone />, label: "연락처", value: "010-2573-7653" },
    { icon: <FaEnvelope />, label: "이메일", value: "choidy180@gmail.com" },
    { icon: <FaGraduationCap />, label: "학력", value: "동서대학교\n컴퓨터공학부\n빅데이터전공 복수전공" },
  ];
  return (
    <Container>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0px',
          left: '0px'
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <AboutContainer>
        <AboutHeader>
          <AboutTitle>ABOUT ME</AboutTitle>
          <AboutDivider />
        </AboutHeader>

        <AboutGrid>
          {aboutItems.map((item, index) => (
            <AboutCard key={index}>
              <AboutIconWrap>{item.icon}</AboutIconWrap>
              <AboutText>
                <AboutLabel>{item.label}</AboutLabel>
                <AboutValue>{item.value}</AboutValue>
              </AboutText>
            </AboutCard>
          ))}
        </AboutGrid>
      </AboutContainer>
      <Grid>
        <Column>
          <Title>경험 및 경력</Title>
          <Entry>
            <Year>2022~2025</Year>
            <List>
              <Item>(주)스코웍스</Item>
            </List>
            <Item>IP Studio 서비스 개발</Item>
            <Item>스토리체인 개발</Item>
          </Entry>
          <Entry>
            <Year>2021 - 2022</Year>
            <List>
              <Item>블루바이저시스템즈</Item>
            </List>
            <Item>하이버프 시스템</Item>
            <Item>인공지능 면접 통합 솔루션</Item>
          </Entry>
          <Entry>
            <Year>2019 - 2022</Year>
            <List>
              <Item>동서대학교 빅데이터 복수 전공</Item>
              <Item>동서대학교 컴퓨터 공학 전공</Item>
            </List>
          </Entry>
        </Column>

        <Column>
          <Title>대내외 활동</Title>
          <Entry>
            <List>
              <Item>
                <div>2019-2022</div>
                <span>동서대 DN 연구실 연구원</span>
              </Item>
              <Item>
                <div>2022</div>
                <span>동서대 온라인 졸업 전시회 제작</span>
              </Item>
              <Item>
                <div>2021</div>
                <span>레드닷 디자인 어워드 위너</span>
              </Item>
              <Item>
                <div>2020</div>
                <span>
                  KOSPO 웹서비스 정보보안
                  <br />
                  경진대회 준우승
                </span>
              </Item>
              <Item>
                <div>2019</div>
                <span>부산 청년일자리 해커톤 준우승</span>
              </Item>
            </List>
          </Entry>
        </Column>

        <Column>
          <Title>Skill & Tools</Title>
          <Entry>
            <Year>Front-End</Year>
            <ListRow>
              <Item>
                <Icon>
                  <SiHtml5 color="#E34F26" size={16} />
                  <span>HTML5</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiCss3 color="#1572B6" size={16} />
                  <span>CSS3</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiJavascript color="#F7DF1E" size={16} />
                  <span>JAVSCRIPT</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiTypescript color="#3178C6" size={16} />
                  <span>TYPESCRIPT</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiReact color="#61DAFB" size={16} />
                  <span>REACT</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiNextdotjs color="#FFFFFF" size={16} />
                  <span>Next.JS</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiStyledcomponents color="#DB7093" size={16} />
                  <span>Styled-components</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiTailwindcss color="#06B6D4" size={16} />
                  <span>Tailwind CSS</span>
                </Icon>
              </Item>
            </ListRow>
          </Entry>
          <Entry>
            <Year>Back-End</Year>
            <ListRow>
              <Item>
                <Icon>
                  <SiNodedotjs color="#339933" size={16} />
                  <span>Node.js</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiPython color="#3776AB" size={16} />
                  <span>Python</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiMysql color="#4479A1" size={16} />
                  <span>MySQL</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiFirebase color="#FFCA28" size={16} />
                  <span>Firebase</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiMariadb color="#003545" size={16} />
                  <span>MariaDB</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiMongodb color="#47A248" size={16} />
                  <span>MongoDB</span>
                </Icon>
              </Item>
            </ListRow>
          </Entry>
          <Entry>
            <Year>Tools</Year>
            <ListRow>
              <Item>
                <Icon>
                  <BiLogoVisualStudio color="#007ACC" size={16} />
                  <span>VS Code</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiOpenai color="#00A67E" size={16} />
                  <span>ChatGPT</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiDiscord color="#5865F2" size={16} />
                  <span>Discord</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiFigma color="#F24E1E" size={16} />
                  <span>Figma</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiStackoverflow color="#F48024" size={16} />
                  <span>Stack Overflow</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiAdobepremierepro color="#9999FF" size={16} />
                  <span>Premiere Pro</span>
                </Icon>
              </Item>
              <Item>
                <Icon>
                  <SiAdobephotoshop color="#31A8FF" size={16} />
                  <span>Photoshop</span>
                </Icon>
              </Item>
            </ListRow>
          </Entry>
        </Column>
      </Grid>
      <SplashCursor SPLAT_RADIUS={0.1} />
    </Container>
  );
}
