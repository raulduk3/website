"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type BackgroundState = "loading" | "running" | "paused" | "static";

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
    p += uDirection * 0.045;
    float drift = noise(p * 2.4 + vec2(uTime * 0.018, uTime * -0.012));
    float fibers = noise(p * vec2(105.0, 7.0) + drift * 0.35);
    float grain = hash(floor(gl_FragCoord.xy));
    float opacity = 0.005 + drift * 0.020 + fibers * 0.005 + grain * 0.006;
    gl_FragColor = vec4(0.23, 0.21, 0.17, opacity);
  }
`;

export default function LivingPaper({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const togglePlayback = useRef<(() => void) | null>(null);
  const [background, setBackground] = useState<BackgroundState>("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;
    let paused = false;

    const configure = async () => {
      const currentGeneration = ++generation;
      dispose?.();
      dispose = undefined;
      togglePlayback.current = null;
      setBackground("loading");
      if (motion.matches) {
        setBackground("static");
        return;
      }

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
          if (event.pointerType === "touch" || paused || document.hidden) return;
          target.set(clamp(event.clientX / innerWidth * 2 - 1), clamp(event.clientY / innerHeight * 2 - 1));
        };
        const neutral = () => { target.set(0, 0); };
        const tick = (now: number) => {
          if (!active || paused || document.hidden) return;
          frame = requestAnimationFrame(tick);
          if (last && now - last < 1000 / 30) return;
          const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
          last = now;
          elapsed += dt;
          direction.lerp(target, 1 - Math.exp(-dt * 3));
          uniforms.uDirection.value.copy(direction);
          uniforms.uTime.value = elapsed;
          renderer.render(scene, camera);
        };
        const updatePlayback = () => {
          cancelAnimationFrame(frame);
          last = 0;
          if (active && !paused && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const visibility = () => {
          neutral();
          updatePlayback();
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          dispose?.();
          dispose = undefined;
          togglePlayback.current = null;
          setBackground("static");
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
        togglePlayback.current = () => {
          paused = !paused;
          setBackground(paused ? "paused" : "running");
          updatePlayback();
        };
        setBackground(paused ? "paused" : "running");
        updatePlayback();
      } catch {
        if (generation !== currentGeneration) return;
        dispose?.();
        dispose = undefined;
        togglePlayback.current = null;
        setBackground("static");
      }
    };
    const motionChange = () => { void configure(); };
    void configure();
    motion.addEventListener("change", motionChange);
    return () => {
      generation++;
      motion.removeEventListener("change", motionChange);
      togglePlayback.current = null;
      dispose?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="living-paper" aria-hidden="true" />
      <div className="living-content">{children}</div>
      <div className="background-control">
        {(background === "running" || background === "paused") && (
          <button type="button" onClick={() => togglePlayback.current?.()}>
            {background === "paused" ? "Resume background" : "Pause background"}
          </button>
        )}
      </div>
    </>
  );
}
