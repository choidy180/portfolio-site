'use client';
import React, { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';
import './css/ribbons.css';

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: number[]; // [r,g,b,a] 0~1
}

const Ribbons: React.FC<RibbonsProps> = ({
  colors = ['#ff9346', '#7cff67', '#ffee51', '#5227FF'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({ dpr, alpha: true, antialias: true });
    const gl = renderer.gl;

    // 배경
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    // 캔버스 레이어
    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '1',
    } as CSSStyleDeclaration);
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: Array<{
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }> = [];

    // GLSL
    const vertex = `
      precision highp float;
      attribute vec3 position, next, prev;
      attribute vec2 uv;
      attribute float side;

      uniform vec2 uResolution;
      uniform float uDPR, uThickness, uTime, uEnableShaderEffect, uEffectAmplitude;

      varying vec2 vUV;

      vec4 getPosition() {
        vec4 current = vec4(position, 1.0);
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 nextScreen = next.xy * aspect;
        vec2 prevScreen = prev.xy * aspect;
        vec2 tangent = normalize(nextScreen - prevScreen);
        vec2 normal = vec2(-tangent.y, tangent.x);
        normal /= aspect;
        normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
        float dist = length(nextScreen - prevScreen);
        normal *= smoothstep(0.0, 0.02, dist);
        float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
        float pixelWidth = current.w * pixelWidthRatio;
        normal *= pixelWidth * uThickness;
        current.xy -= normal * side;

        if (uEnableShaderEffect > 0.5) {
          current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
        }
        return current;
      }

      void main() {
        vUV = uv;
        gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity, uEnableFade;
      varying vec2 vUV;

      void main() {
        float fadeFactor = 1.0;
        if (uEnableFade > 0.5) {
          fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
        }
        gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    // uResolution/uDPR 갱신
    function applySizeUniforms() {
      if(!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      lines.forEach((line) => {
        const prog = line.polyline.mesh.program;
        if (prog.uniforms.uResolution) prog.uniforms.uResolution.value = [w, h];
        if (prog.uniforms.uDPR) prog.uniforms.uDPR.value = dpr;
        line.polyline.resize();
      });
    }

    // 라인 생성
    const center = (colors.length - 1) / 2;
    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.05;
      const friction = baseFriction + (Math.random() - 0.5) * 0.05;
      const thickness = baseThickness + (Math.random() - 0.5) * 3;
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.1,
        0
      );

      const points: Vec3[] = Array.from({ length: pointCount }, () => new Vec3());

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
          uResolution: { value: [1, 1] },
          uDPR: { value: dpr },
        },
      });
      polyline.mesh.setParent(scene);

      lines.push({
        spring,
        friction,
        mouseVelocity: new Vec3(),
        mouseOffset,
        points,
        polyline,
      });
    });

    applySizeUniforms();

    // ResizeObserver (레이아웃 변화 대응)
    const ro = new ResizeObserver(applySizeUniforms);
    ro.observe(container);

    // 입력 리스너: window에 등록 (container는 pointer-events:none)
    const mouse = new Vec3();

    function updateMouseFromClient(clientX: number, clientY: number) {
      if(!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouse.set((x / w) * 2 - 1, (y / h) * -2 + 1, 0);
    }

    function onMouseMove(e: MouseEvent) {
      updateMouseFromClient(e.clientX, e.clientY);
    }
    function onTouch(e: TouchEvent) {
      if (!e.changedTouches.length) return;
      const t = e.changedTouches[0];
      updateMouseFromClient(t.clientX, t.clientY);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    // 초기 위치를 중앙으로 세팅: 첫 프레임부터 보이게
    (() => {
      const rect = container.getBoundingClientRect();
      updateMouseFromClient(rect.left + rect.width / 2, rect.top + rect.height / 2);
    })();

    // 루프
    const tmp = new Vec3();
    let frameId = 0;
    let lastTime = performance.now();

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      lines.forEach((line) => {
        tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);

        for (let i = 1; i < line.points.length; i++) {
          if (Number.isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / (line.points.length - 1);
            const alpha = Math.min(1, (dt * (speedMultiplier ?? 1)) / segmentDelay);
            line.points[i].lerp(line.points[i - 1], alpha);
          } else {
            line.points[i].lerp(line.points[i - 1], 0.9);
          }
        }

        const prog = line.polyline.mesh.program;
        if (prog.uniforms.uTime) prog.uniforms.uTime.value = now * 0.001;
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    };
    tick();

    // cleanup
    return () => {
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(frameId);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext?.();
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor,
  ]);

  return <div ref={containerRef} className="ribbons-container" />;
};

export default Ribbons;
