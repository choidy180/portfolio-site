'use client';

import styled from 'styled-components';
import { SiAdobephotoshop, SiAdobepremierepro, SiCss3, SiDiscord, SiFigma, SiFirebase, SiHtml5, SiJavascript, SiMariadb, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiOpenai, SiPython, SiReact, SiStackoverflow, SiStyledcomponents, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { BiLogoVisualStudio } from 'react-icons/bi';
import DotGrid from './dotGrid';

const Container = styled.section`
    position: relative;
    z-index: 1; // 👈 canvas보다 위에
    min-width: 100vw;
    width: 100%;
    min-height: 100vh;
    background-color: #000;
    color: #fff;
    display: flex;
    justify-content: center;
    padding: 6rem 2rem;
`;

const Grid = styled.div`
    max-width: 1200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    gap: 4rem;
    justify-content: space-between;
    flex-wrap: wrap;

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
    pointer-events: none;
    user-select: none;

    div {
        flex-shrink: 0;
        width: 120px;
        transform: scaleX(0.9);
        margin-left: -4px;
        font-weight: 600;
    }
`;

export default function CareerColumns() {
    return (
        <Container>
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px' }}>
                <DotGrid
                    dotSize={5}
                    gap={15}
                    baseColor="#30336b"
                    activeColor="#5227ff"
                    proximity={100}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1}
                    maxSpeed={5000}
                />
            </div>
            <Grid>
                <Column>
                    <Title>경험 및 경력</Title>
                    <Entry>
                        <Year>2022~2025</Year>
                        <List>
                            <Item>(주)무신사</Item>
                        </List>
                        <Item>29CM 서비스 개발</Item>
                    </Entry>
                    <Entry>
                        <Year>2021 - 2022</Year>
                        <List>
                            <Item>블루바이저시스템즈</Item>
                        </List>
                        <Item>하이버프 시스템(웹사이트 제작)</Item>
                        <Item>인공지능 면접 통합 솔루션(개발 참여)</Item>
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
                            <Item><div>2019-2022</div>동서대 DN 연구실 연구원</Item>
                            <Item><div>2022</div>동서대 온라인 졸업 전시회 제작</Item>
                            <Item><div>2021</div>레드닷 디자인 어워드 위너</Item>
                            <Item><div>2020</div>KOSPO 웹서비스 정보보안<br/>경진대회 준우승</Item>
                            <Item><div>2019</div>부산 청년일자리 해커톤 준우승</Item>
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
                                    <SiHtml5 color='#E34F26' size={16}/>
                                    <span>HTML5</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiCss3 color='#1572B6' size={16}/>
                                    <span>CSS3</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiJavascript color='#F7DF1E' size={16}/>
                                    <span>JAVSCRIPT</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiTypescript color='#3178C6' size={16}/>
                                    <span>TYPESCRIPT</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiReact color='#61DAFB' size={16}/>
                                    <span>REACT</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiNextdotjs color='#FFFFFF' size={16}/>
                                    <span>Next.JS</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiStyledcomponents color='#DB7093' size={16}/>
                                    <span>Styled-components</span>
                                </Icon>
                            </Item>
                            <Item>
                                <Icon>
                                    <SiTailwindcss color='#06B6D4' size={16}/>
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
        </Container>
    );
}
