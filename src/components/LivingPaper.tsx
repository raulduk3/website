"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type MotionEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

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
    // Grain stays anchored: no sparkling or frame-to-frame random noise.
    float grain = hash(floor(gl_FragCoord.xy));
    float opacity = 0.005 + drift * 0.020 + fibers * 0.005 + grain * 0.006;
    gl_FragColor = vec4(0.23, 0.21, 0.17, opacity);
  }
`;

export default function LivingPaper({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [offerTilt, setOfferTilt] = useState(false);
  const [tiltStatus, setTiltStatus] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;

    const configure = async () => {
      const currentGeneration = ++generation;
      dispose?.();
      dispose = undefined;
      setOfferTilt(false);
      content.style.transform = "";
      if (motion.matches) return;

      try {
        // Keep the reading content server-rendered; load WebGL after hydration.
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
        const clamp = (n: number) => Math.max(-1, Math.min(1, n));
        let baseline: { beta: number; gamma: number } | null = null;
        let frame = 0;
        let last = 0;
        let elapsed = 0;
        let running = true;

        const resize = () => {
          // Limit fill rate on high-density and large displays.
          const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2000000 / (innerWidth * innerHeight)));
          renderer.setPixelRatio(ratio);
          renderer.setSize(innerWidth, innerHeight, false);
          renderer.getDrawingBufferSize(uniforms.uResolution.value);
        };
        const pointer = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          target.set(clamp(event.clientX / innerWidth * 2 - 1), clamp(event.clientY / innerHeight * 2 - 1));
        };
        const neutral = () => { target.set(0, 0); };
        const orientation = (event: DeviceOrientationEvent) => {
          if (event.beta === null || event.gamma === null || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
          if (!baseline) baseline = { beta: event.beta, gamma: event.gamma };
          const angle = (screen.orientation?.angle ?? 0) * Math.PI / 180;
          const x = clamp((event.gamma - baseline.gamma) / 25);
          const y = clamp((event.beta - baseline.beta) / 25);
          target.set(clamp(x * Math.cos(angle) + y * Math.sin(angle)), clamp(y * Math.cos(angle) - x * Math.sin(angle)));
        };
        const resetOrientation = () => { baseline = null; neutral(); };
        const tick = (now: number) => {
          if (!running || document.hidden) return;
          frame = requestAnimationFrame(tick);
          if (last && now - last < 1000 / 30) return;
          const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
          last = now;
          elapsed += dt;
          direction.lerp(target, 1 - Math.exp(-dt * 3));
          uniforms.uDirection.value.copy(direction);
          uniforms.uTime.value = elapsed;
          // Move the complete reading block as one plane, with less than half a degree of tilt.
          content.style.transform = `perspective(1400px) translate(${(direction.x * 2.5).toFixed(3)}px, ${(direction.y * 2.5).toFixed(3)}px) rotateX(${(-direction.y * 0.45).toFixed(3)}deg) rotateY(${(direction.x * 0.45).toFixed(3)}deg)`;
          renderer.render(scene, camera);
        };
        const visibility = () => {
          cancelAnimationFrame(frame);
          last = 0;
          resetOrientation();
          if (!document.hidden && running) frame = requestAnimationFrame(tick);
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          running = false;
          cancelAnimationFrame(frame);
          content.style.transform = "";
          setOfferTilt(false);
        };
        dispose = () => {
          running = false;
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", pointer);
          document.documentElement.removeEventListener("pointerleave", neutral);
          window.removeEventListener("blur", neutral);
          window.removeEventListener("deviceorientation", orientation);
          window.removeEventListener("orientationchange", resetOrientation);
          document.removeEventListener("visibilitychange", visibility);
          canvas.removeEventListener("webglcontextlost", contextLost);
          renderer.clear();
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          content.style.transform = "";
        };
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", pointer, { passive: true });
        document.documentElement.addEventListener("pointerleave", neutral);
        window.addEventListener("blur", neutral);
        window.addEventListener("deviceorientation", orientation, { passive: true });
        window.addEventListener("orientationchange", resetOrientation);
        document.addEventListener("visibilitychange", visibility);
        canvas.addEventListener("webglcontextlost", contextLost);
        const sensor = window.DeviceOrientationEvent as MotionEventConstructor | undefined;
        setOfferTilt(Boolean(sensor?.requestPermission && matchMedia("(pointer: coarse)").matches));
        if (!document.hidden) frame = requestAnimationFrame(tick);
      } catch {
        // A plain paper background remains fully usable without WebGL.
        dispose?.();
        dispose = undefined;
      }
    };
    void configure();
    motion.addEventListener("change", configure);
    return () => {
      generation++;
      motion.removeEventListener("change", configure);
      dispose?.();
    };
  }, []);

  const enableTilt = async () => {
    try {
      const sensor = window.DeviceOrientationEvent as MotionEventConstructor;
      const permission = await sensor.requestPermission?.();
      setTiltStatus(permission === "granted" ? "Tilt enabled" : "Tilt stays off");
    } catch {
      setTiltStatus("Tilt unavailable");
    }
    setOfferTilt(false);
  };

  return (
    <>
      <canvas ref={canvasRef} className="living-paper" aria-hidden="true" />
      <div ref={contentRef} className="living-content">{children}</div>
      <div className="tilt-control">
        {offerTilt && <button type="button" onClick={enableTilt}>Enable gentle tilt</button>}
        <span role="status" className="sr-only">{tiltStatus}</span>
      </div>
    </>
  );
}
