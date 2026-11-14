"use client";

import { useEffect, useRef, type ReactNode } from "react";

const fragmentShader = `
  precision highp float;
  uniform vec2 uResolution;
  uniform vec2 uDirection;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }
  void main() {
    vec2 p = gl_FragCoord.xy / uResolution.y;
    vec2 lightPosition = p * 1.55 + uDirection * 0.38;
    lightPosition += vec2(uTime * 0.11, uTime * -0.07);
    float wash = noise(lightPosition);
    float shadow = 0.5 + 0.5 * sin(p.x * 2.1 + p.y * 1.35
      + wash * 0.8 + uTime * 0.35 + dot(uDirection, vec2(0.8, -0.6)));
    float fibers = noise(p * vec2(105.0, 7.0));
    float grain = hash(floor(gl_FragCoord.xy));
    float opacity = min(0.084, 0.008 + wash * 0.036 + shadow * 0.026
      + fibers * 0.008 + grain * 0.006);
    gl_FragColor = vec4(0.23, 0.21, 0.17, opacity);
  }
`;

export default function LivingPaper({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;

    const configure = async () => {
      const currentGeneration = ++generation;
      dispose?.();
      dispose = undefined;
      if (motion.matches) return;

      try {
        const THREE = await import("three");
        if (generation !== currentGeneration) return;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
        renderer.setClearColor(0x000000, 0);
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
          uResolution: { value: new THREE.Vector2() },
          uDirection: { value: new THREE.Vector2() },
          uTime: { value: 0 },
        };
        const material = new THREE.ShaderMaterial({
          uniforms, fragmentShader,
          vertexShader: "void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",
          transparent: true, depthTest: false, depthWrite: false,
        });
        scene.add(new THREE.Mesh(geometry, material));
        const target = new THREE.Vector2();
        const direction = new THREE.Vector2();
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        let frame = 0;
        let last = 0;
        let elapsed = 0;
        let active = true;

        const resize = () => {
          const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2000000 / (innerWidth * innerHeight)));
          renderer.setPixelRatio(ratio);
          renderer.setSize(innerWidth, innerHeight, false);
          renderer.getDrawingBufferSize(uniforms.uResolution.value);
          renderer.render(scene, camera);
        };
        const pointer = (event: PointerEvent) => {
          if (event.pointerType === "touch" || document.hidden) return;
          target.set(clamp(event.clientX / innerWidth * 2 - 1), clamp(event.clientY / innerHeight * 2 - 1));
        };
        const neutral = () => { target.set(0, 0); };
        const tick = (now: number) => {
          if (!active || document.hidden) return;
          frame = requestAnimationFrame(tick);
          if (last && now - last < 1000 / 30) return;
          const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
          last = now;
          elapsed += dt;
          direction.lerp(target, 1 - Math.exp(-dt * 4));
          uniforms.uDirection.value.copy(direction);
          uniforms.uTime.value = elapsed;
          renderer.render(scene, camera);
        };
        const visibility = () => {
          cancelAnimationFrame(frame);
          last = 0;
          neutral();
          if (active && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          dispose?.();
          dispose = undefined;
        };
        dispose = () => {
          active = false;
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", pointer);
          document.documentElement.removeEventListener("pointerleave", neutral);
          window.removeEventListener("blur", neutral);
          document.removeEventListener("visibilitychange", visibility);
          canvas.removeEventListener("webglcontextlost", contextLost);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", pointer, { passive: true });
        document.documentElement.addEventListener("pointerleave", neutral);
        window.addEventListener("blur", neutral);
        document.addEventListener("visibilitychange", visibility);
        canvas.addEventListener("webglcontextlost", contextLost);
        visibility();
      } catch {
        if (generation !== currentGeneration) return;
        dispose?.();
        dispose = undefined;
      }
    };
    const motionChange = () => { void configure(); };
    void configure();
    motion.addEventListener("change", motionChange);
    return () => {
      generation++;
      motion.removeEventListener("change", motionChange);
      dispose?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="living-paper" aria-hidden="true" />
      <div className="living-content">{children}</div>
    </>
  );
}
