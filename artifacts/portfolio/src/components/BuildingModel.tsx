import { useRef, useMemo, Component, type ReactNode, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import * as THREE from "three";

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!ctx) return false;
    const gl = ctx as WebGLRenderingContext;
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
      if (vendor === "0xffff" || vendor.includes("SwiftShader")) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function hslComponentsToHex(hsl: string): string {
  const parts = hsl.trim().match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/);
  if (!parts) return "#C0392B";
  const h = parseFloat(parts[1]) / 360;
  const s = parseFloat(parts[2]) / 100;
  const l = parseFloat(parts[3]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darkenHex(hex: string, factor = 0.55): string {
  const clean = hex.replace("#", "");
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function usePrimaryColor(): string {
  const [color, setColor] = useState("#C0392B");

  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--c-primary")
        .trim();
      if (raw) setColor(hslComponentsToHex(raw));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);

  return color;
}

function Building({ primaryColor }: { primaryColor: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const darkColor = darkenHex(primaryColor, 0.55);
  const accentWhite = "#fff8f8";

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const floors = useMemo(() => {
    const result = [];
    const totalFloors = 8;
    const floorHeight = 0.18;
    const baseY = -1.2;
    for (let i = 0; i < totalFloors; i++) {
      const scale = 1 - i * 0.035;
      const y = baseY + i * (floorHeight + 0.04);
      result.push({ scale, y, index: i });
    }
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[1.2, 2.6, 0.9]} />
        <meshStandardMaterial color={darkColor} transparent opacity={0.82} roughness={0.3} metalness={0.6} />
        <Edges color={primaryColor} threshold={15} />
      </mesh>

      <mesh position={[-0.72, -0.55, 0]} castShadow>
        <boxGeometry args={[0.58, 1.6, 0.75]} />
        <meshStandardMaterial color={darkColor} transparent opacity={0.75} roughness={0.35} metalness={0.5} />
        <Edges color={primaryColor} threshold={15} />
      </mesh>

      {floors.map((floor) => (
        <mesh key={floor.index} position={[0, floor.y, 0]}>
          <boxGeometry args={[1.28 * floor.scale, 0.04, 0.96 * floor.scale]} />
          <meshStandardMaterial color={accentWhite} transparent opacity={0.55} roughness={0.1} metalness={0.8} />
        </mesh>
      ))}

      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.4]} />
        <meshStandardMaterial color={primaryColor} roughness={0.2} metalness={0.7} />
        <Edges color={accentWhite} threshold={15} />
      </mesh>

      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.015, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={accentWhite} roughness={0.1} metalness={0.9} />
      </mesh>

      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2, 3, 4].map((row) => (
          <mesh key={`w-${col}-${row}`} position={[-0.36 + col * 0.24, -0.8 + row * 0.42, 0.456]}>
            <boxGeometry args={[0.14, 0.22, 0.01]} />
            <meshStandardMaterial
              color={row === 4 && col === 1 ? primaryColor : accentWhite}
              transparent
              opacity={row === 4 && col === 1 ? 0.95 : 0.35}
              roughness={0.05}
              metalness={0.9}
              emissive={row === 4 && col === 1 ? primaryColor : accentWhite}
              emissiveIntensity={row === 4 && col === 1 ? 0.6 : 0.08}
            />
          </mesh>
        ))
      )}

      {[0, 1].map((col) =>
        [0, 1, 2].map((row) => (
          <mesh key={`sw-${col}-${row}`} position={[-0.5 + col * 0.22, -0.8 + row * 0.42, 0.382]}>
            <boxGeometry args={[0.12, 0.18, 0.01]} />
            <meshStandardMaterial color={accentWhite} transparent opacity={0.25} roughness={0.05} metalness={0.9} emissive={accentWhite} emissiveIntensity={0.06} />
          </mesh>
        ))
      )}

      <mesh position={[0, -1.44, 0]}>
        <boxGeometry args={[1.6, 0.14, 1.2]} />
        <meshStandardMaterial color={primaryColor} roughness={0.4} metalness={0.5} />
        <Edges color={accentWhite} threshold={15} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#0a0202" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function BlueprintFallback({ primaryColor }: { primaryColor: string }) {
  const darkColor = darkenHex(primaryColor, 0.55);
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: darkenHex(primaryColor, 0.1) }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={darkColor} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={darkenHex(primaryColor, 0.1)} />
        <rect width="100%" height="100%" fill="url(#bp-grid)" />
      </svg>
      <div className="relative flex flex-col items-center gap-3">
        <svg viewBox="0 0 120 200" width="80" height="133" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="60" height="140" fill={darkColor} stroke={primaryColor} strokeWidth="1.5" />
          <rect x="10" y="80" width="30" height="80" fill={darkColor} stroke={primaryColor} strokeWidth="1.5" />
          {[30, 50, 70, 90, 110, 130, 140, 150].map((y, i) => (
            <line key={i} x1="30" y1={y} x2="90" y2={y} stroke={primaryColor} strokeWidth="0.8" />
          ))}
          {[35, 50, 65].map((x) =>
            [35, 55, 75, 95, 115].map((y, j) => (
              <rect key={`${x}-${j}`} x={x} y={y} width="10" height="14" fill="#fff8f8" opacity="0.25" />
            ))
          )}
          <rect x="50" y="8" width="20" height="14" fill={primaryColor} stroke="#fff8f8" strokeWidth="1" />
          <line x1="60" y1="2" x2="60" y2="8" stroke="#fff8f8" strokeWidth="1.5" />
          <rect x="20" y="150" width="80" height="10" fill={primaryColor} stroke="#fff8f8" strokeWidth="0.8" />
        </svg>
        <span className="mono text-[10px] uppercase tracking-widest" style={{ color: `${primaryColor}99` }}>HERO_ELEVATION.DWG</span>
      </div>
    </div>
  );
}

interface ErrorBoundaryState { hasError: boolean }

class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function BuildingModel() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const primaryColor = usePrimaryColor();

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === null) {
    return <div className="absolute inset-0" style={{ backgroundColor: darkenHex(primaryColor, 0.1) }} />;
  }

  if (!webglSupported) {
    return <BlueprintFallback primaryColor={primaryColor} />;
  }

  return (
    <div className="absolute inset-0" style={{ backgroundColor: darkenHex(primaryColor, 0.1) }}>
      <CanvasErrorBoundary fallback={<BlueprintFallback primaryColor={primaryColor} />}>
        <Canvas
          camera={{ position: [2.5, 1.5, 3.5], fov: 42 }}
          shadows
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        >
          <ambientLight intensity={0.4} color="#ffeaea" />
          <directionalLight position={[4, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
          <directionalLight position={[-3, 2, -4]} intensity={0.5} color={primaryColor} />
          <pointLight position={[0, 3, 2]} intensity={0.6} color="#ffcccc" />
          <pointLight position={[1, -1, 2]} intensity={0.3} color={primaryColor} />
          <Building primaryColor={primaryColor} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="mono text-[10px] uppercase tracking-widest" style={{ color: `${primaryColor}99` }}>drag to rotate</span>
        </div>
      </CanvasErrorBoundary>
    </div>
  );
}
