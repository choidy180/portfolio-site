import styled from "styled-components"

const Container = styled.div`
    position: absolute;
    bottom: 2vh;
    font-size: 1rem;
    user-select: none;
`

interface Number {
    number: number;
}

const PageNumber = (prop:Number) => {
    return (
        <Container className="">― {prop.number} ―</Container>
    )
}

export default PageNumber;