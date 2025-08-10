'use client';
import Ballpit from '@/components/ballpit';
import CareerColumns from '@/components/careerColumns';
import ContentBox1 from '@/components/contentBox1';
import FuzzyText from '@/components/fuzzyText';
import Introduce from '@/components/introduce';
import styled from 'styled-components';

const CoverWrapper = styled.div`
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    /* background-image: url('/qhd_wallpaper.png'); */
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
`;

const CenteredBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    width: 100vw;
    height: 100vh;
`;

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;

    color: #fff;

    width: 100vw;
    height: 100vh;

    left: 0;
    top: 0;
`

const Year = styled.div`
    background-color: #000;
    color: #fff;
    font-size: 1.3rem;
    padding: 0.4rem 1rem;
    letter-spacing: 0.2rem;
    margin-top: 4rem;
`;

const Name = styled.div`
    background-color: #000;
    color: #fff;
    padding: 0.3rem 1rem;
    font-size: 2rem;
    letter-spacing: 0.1rem;
    font-family: 'Courier New', monospace;
    margin-top: 2rem;
`;

const JobTitle = styled.div`
    background-color: #000;
    color: #fff;
    padding: 0.2rem 0.8rem;
    font-size: 1.2rem;
    font-family: 'Courier New', monospace;
    margin-top: 0.4rem;
`;

const ConfidentialStamp = styled.img`
    position: absolute;
    bottom: 8%;
    right: 5%;
    width: 150px;
    min-width: 10vw;
    transform: rotate(-10deg);
    opacity: 0.85;
`;

export default function Cover() {
    return (
        <>
            <CoverWrapper>
                <CenteredBox>
                    <Ballpit
                        count={140}
                        gravity={0.1}
                        friction={0.9975}
                        wallBounce={0.95}
                        followCursor={false}
                        ambientColor={16777215}
                    />
                    <ContentBox>
                        <FuzzyText 
                            baseIntensity={0.2} 
                            hoverIntensity={0.5} 
                            enableHover={false}
                        >
                            Portfolio
                        </FuzzyText>
                        <Year>2025</Year>
                        <Name>Kim Min Seok</Name>
                        <JobTitle>Web Developer</JobTitle>

                        <ConfidentialStamp src="/confidential_stamp_only.png" alt="stamp" />
                    </ContentBox>
                </CenteredBox>
            </CoverWrapper>
            <Introduce/>
            <CareerColumns/>
            <ContentBox1/>
        </>
    );
}
