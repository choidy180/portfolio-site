'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import './css/aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStop0;
uniform vec3  uColorStop1;
uniform vec3  uColorStop2;
uniform vec2  uResolution;
uniform float uBlend;

out vec4 fragColor;

/* noise utils */
vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m *= m; m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* color ramp */
struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors, factor, outColor) { \
  int idx = 0; \
  for (int i = 0; i < 2; i++) { \
    ColorStop c = colors[i]; \
    bool ok = c.position <= factor; \
    idx = int(mix(float(idx), float(i), float(ok))); \
  } \
  ColorStop c0 = colors[idx]; \
  ColorStop c1 = colors[idx + 1]; \
  float range = c1.position - c0.position; \
  float t = (factor - c0.position) / range; \
  outColor = mix(c0.color, c1.color, clamp(t, 0.0, 1.0)); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStop0, 0.0);
  colors[1] = ColorStop(uColorStop1, 0.5);
  colors[2] = ColorStop(uColorStop2, 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];  // 3개 권장
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export default function Aurora(props: AuroraProps) {
  const {
    colorStops = ['#5227FF', '#7cff67', '#5227FF'],
    amplitude = 1.0,
    blend = 0.5,
  } = props;

  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    // 1) 캔버스 만들고 Renderer에 전달 (gl 말고 canvas + webgl:2)
    const canvasEl = document.createElement('canvas');
    const renderer = new Renderer({
      canvas: canvasEl,
      webgl: 2,                // ★ WebGL2 요청
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    const gl = renderer.gl;

    // WebGL2 확인 (안되면 조용히 종료)
    if (!(gl instanceof WebGL2RenderingContext)) {
      console.error('WebGL2 not supported: Aurora shader needs WebGL2 (#version 300 es).');
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    canvasEl.style.backgroundColor = 'transparent';
    ctn.appendChild(canvasEl);

    const geometry = new Triangle(gl as any);

    const toVec3 = (hex: string) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b] as [number, number, number];
    };
    const [s0, s1, s2] = (props.colorStops ?? colorStops).slice(0, 3);
    const col0 = toVec3(s0 || colorStops[0]);
    const col1 = toVec3(s1 || colorStops[1]);
    const col2 = toVec3(s2 || colorStops[2]);

    const program = new Program(gl as any, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:        { value: 0 },
        uAmplitude:   { value: amplitude },
        uBlend:       { value: blend },
        uResolution:  { value: [ctn.clientWidth, ctn.clientHeight] as [number, number] },
        uColorStop0:  { value: col0 },
        uColorStop1:  { value: col1 },
        uColorStop2:  { value: col2 },
      },
    });

    const mesh = new Mesh(gl as any, { geometry, program });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(ctn.clientWidth * dpr));
      const h = Math.max(1, Math.floor(ctn.clientHeight * dpr));
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h] as [number, number];
      canvasEl.style.width = '100%';
      canvasEl.style.height = '100%';
    };
    window.addEventListener('resize', resize);
    resize();

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);

      const { time, speed = 1.0, amplitude: amp = amplitude, blend: bl = blend } = propsRef.current;
      program.uniforms.uTime.value = (time ?? t * 0.001) * speed * 0.5;
      program.uniforms.uAmplitude.value = amp;
      program.uniforms.uBlend.value = bl;

      // 색상 업데이트
      const stops = propsRef.current.colorStops ?? colorStops;
      const a = toVec3(stops[0] || colorStops[0]);
      const b = toVec3(stops[1] || colorStops[1]);
      const c = toVec3(stops[2] || colorStops[2]);
      program.uniforms.uColorStop0.value = a;
      program.uniforms.uColorStop1.value = b;
      program.uniforms.uColorStop2.value = c;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (canvasEl.parentNode === ctn) ctn.removeChild(canvasEl);
      (gl as any).getExtension?.('WEBGL_lose_context')?.loseContext?.();
    };
  }, [amplitude, blend, colorStops]);

  return <div ref={ctnRef} className="aurora-container" />;
}
