'use client';

import MagicBento from '@/components/magic-bento';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #060010;
`

/* ========== Page ========== */
export default function Page() {
  return (
    <Container>
      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="132, 0, 255"
      />
    </Container>
  );
}
