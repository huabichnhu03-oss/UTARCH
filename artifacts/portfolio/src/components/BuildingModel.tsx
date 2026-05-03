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

function Building() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const blueprintBlue = "#0a3d8f";
  const wireBlue = "#1a5dc8";
  const accentWhite = "#e8f0ff";
  const accentOrange = "#ff6b2b";

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
        <meshStandardMaterial color={blueprintBlue} transparent opacity={0.82} roughness={0.3} metalness={0.6} />
        <Edges color={wireBlue} threshold={15} />
      </mesh>

      <mesh position={[-0.72, -0.55, 0]} castShadow>
        <boxGeometry args={[0.58, 1.6, 0.75]} />
        <meshStandardMaterial color={blueprintBlue} transparent opacity={0.75} roughness={0.35} metalness={0.5} />
        <Edges color={wireBlue} threshold={15} />
      </mesh>

      {floors.map((floor) => (
        <mesh key={floor.index} position={[0, floor.y, 0]}>
          <boxGeometry args={[1.28 * floor.scale, 0.04, 0.96 * floor.scale]} />
          <meshStandardMaterial color={accentWhite} transparent opacity={0.55} roughness={0.1} metalness={0.8} />
        </mesh>
      ))}

      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.4]} />
        <meshStandardMaterial color={wireBlue} roughness={0.2} metalness={0.7} />
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
              color={row === 4 && col === 1 ? accentOrange : accentWhite}
              transparent
              opacity={row === 4 && col === 1 ? 0.95 : 0.35}
              roughness={0.05}
              metalness={0.9}
              emissive={row === 4 && col === 1 ? accentOrange : accentWhite}
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
        <meshStandardMaterial color={wireBlue} roughness={0.4} metalness={0.5} />
        <Edges color={accentWhite} threshold={15} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#020e24" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function BlueprintFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#020e24]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a3a6e" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#020e24" />
        <rect width="100%" height="100%" fill="url(#bp-grid)" />
      </svg>
      <div className="relative flex flex-col items-center gap-3">
        <svg viewBox="0 0 120 200" width="80" height="133" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="60" height="140" fill="#0a3d8f" stroke="#1a5dc8" strokeWidth="1.5" />
          <rect x="10" y="80" width="30" height="80" fill="#0a3d8f" stroke="#1a5dc8" strokeWidth="1.5" />
          {[30, 50, 70, 90, 110, 130, 140, 150].map((y, i) => (
            <line key={i} x1="30" y1={y} x2="90" y2={y} stroke="#1a5dc8" strokeWidth="0.8" />
          ))}
          {[35, 50, 65].map((x) =>
            [35, 55, 75, 95, 115].map((y, j) => (
              <rect key={`${x}-${j}`} x={x} y={y} width="10" height="14" fill="#e8f0ff" opacity="0.25" />
            ))
          )}
          <rect x="50" y="8" width="20" height="14" fill="#1a5dc8" stroke="#e8f0ff" strokeWidth="1" />
          <line x1="60" y1="2" x2="60" y2="8" stroke="#e8f0ff" strokeWidth="1.5" />
          <rect x="20" y="150" width="80" height="10" fill="#1a5dc8" stroke="#e8f0ff" strokeWidth="0.8" />
        </svg>
        <span className="mono text-[10px] text-blue-300/60 uppercase tracking-widest">HERO_ELEVATION.DWG</span>
      </div>
    </div>
  );
}

interface ErrorBoundaryState { hasError: boolean }

class CanvasErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <BlueprintFallback />;
    return this.props.children;
  }
}

export function BuildingModel() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === null) {
    return <div className="absolute inset-0 bg-[#020e24]" />;
  }

  if (!webglSupported) {
    return <BlueprintFallback />;
  }

  return (
    <div className="absolute inset-0 bg-[#020e24]">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [2.5, 1.5, 3.5], fov: 42 }}
          shadows
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        >
          <ambientLight intensity={0.4} color="#c8d8ff" />
          <directionalLight position={[4, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
          <directionalLight position={[-3, 2, -4]} intensity={0.5} color="#3366cc" />
          <pointLight position={[0, 3, 2]} intensity={0.6} color="#88aaff" />
          <pointLight position={[1, -1, 2]} intensity={0.3} color="#ff6b2b" />
          <Building />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="mono text-[10px] text-blue-300/60 uppercase tracking-widest">drag to rotate</span>
        </div>
      </CanvasErrorBoundary>
    </div>
  );
}
