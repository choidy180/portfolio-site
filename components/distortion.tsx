'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { StaticImageData } from 'next/image';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string | StaticImageData; // ← string | StaticImageData 지원
  className?: string;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageAspectRef = useRef<number>(1);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 기본 three 구성요소
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    // 유니폼
    const uniforms: {
      time: { value: number };
      resolution: { value: THREE.Vector4 };
      uTexture: { value: THREE.Texture | null };
      uDataTexture: { value: THREE.DataTexture | null };
    } = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null },
      uDataTexture: { value: null },
    };

    // 데이터 텍스처 초기화
    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
      // G/B/A 채널은 0으로 둬도 무방
    }

    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    // 지오메트리/머티리얼/메시
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // 리사이즈 핸들러 (먼저 정의해서 안전하게 사용)
    const handleResize = () => {
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const containerAspect = width / height;
      const imageAspect = imageAspectRef.current;

      renderer.setSize(width, height);

      // 이미지가 컨테이너를 꽉 채우도록 스케일 계산
      const scale = Math.max(containerAspect / imageAspect, 1);
      plane.scale.set(imageAspect * scale, scale, 1);

      // 직교 카메라 투영 갱신
      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    // 텍스처 로드 (string | StaticImageData 모두 지원)
    const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      src,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        // 이미지 비율 보관
        // HTMLImageElement | ImageBitmap 둘 다 width/height 접근 가능
        const w = (texture.image as any).width ?? texture.source.data.width;
        const h = (texture.image as any).height ?? texture.source.data.height;
        imageAspectRef.current = w / h;

        uniforms.uTexture.value = texture;
        handleResize();
      },
      undefined,
      (err) => {
        // 로드 실패해도 앱이 죽지 않도록 방어
        // eslint-disable-next-line no-console
        console.error('Texture load error:', err);
      }
    );

    // 마우스 상태
    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      mouseState.x = x;
      mouseState.y = y;
      mouseState.prevX = x;
      mouseState.prevY = y;
    };

    const handleMouseLeave = () => {
      dataTexture.needsUpdate = true;
      mouseState.x = 0;
      mouseState.y = 0;
      mouseState.prevX = 0;
      mouseState.prevY = 0;
      mouseState.vX = 0;
      mouseState.vY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // 초기 사이즈 세팅
    handleResize();

    // 애니메이션 루프
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;

      const buf = dataTexture.image.data as Float32Array;

      // 점탄성 감쇠
      for (let i = 0; i < size * size; i++) {
        buf[i * 4] *= relaxation;
        buf[i * 4 + 1] *= relaxation;
      }

      // 마우스 영향
      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = gridMouseX - i;
          const dy = gridMouseY - j;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(Math.max(distSq, 0.0001)), 10);
            buf[index] += strength * 100 * mouseState.vX * power;
            buf[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      // 정리
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      if (uniforms.uTexture.value) {
        uniforms.uTexture.value.dispose();
      }
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return <div ref={containerRef} className={`distortion-container ${className}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}/>;
};

export default GridDistortion;
