"use client";

import TargetCursor from "@/components/targetCursor";
import styled from "styled-components";

const Container =styled.div`
    width: 100vw;
    height: 100vh;
    background-color: beige;
`

const TestPage = () => {
    return (
        <Container>
            <TargetCursor 
                spinDuration={2}
                hideDefaultCursor={true}
            />
            
            <h1>Hover over the elements below</h1>
            <button className="cursor-target">Click me!</button>
            <div className="cursor-target">Hover target</div>
        </Container>
    )
}

export default TestPage;