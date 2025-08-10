import styled from 'styled-components';

const SectionWrapper = styled.section`
    padding: 4rem 2rem;
    border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 1.5rem;
`;

const Content = styled.div`
    font-size: 1rem;
    line-height: 1.6;
`;

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
    return (
        <SectionWrapper>
            <Title>{title}</Title>
            <Content>{children}</Content>
        </SectionWrapper>
    );
}
