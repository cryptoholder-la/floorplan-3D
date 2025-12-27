import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { CabinetDesign } from '@/lib/cabinetTypes';
import * as THREE from 'three';
import { useMemo } from 'react';

interface CabinetViewer3DProps {
  design: CabinetDesign;
}

function CabinetModel({ design }: { design: CabinetDesign }) {
  const { dimensions, doorCount, shelfCount, includeBack } = design;
  const { width, height, depth, thickness } = dimensions;

  // Convert mm to meters for Three.js (scale down)
  const scale = 0.001;
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  const t = thickness * scale;

  return (
    <group>
      {/* Left Side */}
      <mesh position={[-w/2 + t/2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Right Side */}
      <mesh position={[w/2 - t/2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Top */}
      <mesh position={[0, h/2 - t/2, 0]}>
        <boxGeometry args={[w - 2*t, t, d]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Bottom */}
      <mesh position={[0, -h/2 + t/2, 0]}>
        <boxGeometry args={[w - 2*t, t, d]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Back Panel */}
      {includeBack && (
        <mesh position={[0, 0, -d/2 + t/4]}>
          <boxGeometry args={[w - 2*t, h - 2*t, t/2]} />
          <meshStandardMaterial color="#c9a26a" />
        </mesh>
      )}

      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => {
        const spacing = h / (shelfCount + 1);
        const yPos = -h/2 + spacing * (i + 1);
        return (
          <mesh key={`shelf-${i}`} position={[0, yPos, 0]}>
            <boxGeometry args={[w - 2*t - 0.004, t, d - 0.004]} />
            <meshStandardMaterial color="#d4a574" />
          </mesh>
        );
      })}

      {/* Doors */}
      {Array.from({ length: doorCount }).map((_, i) => {
        const doorWidth = w / doorCount;
        const xPos = -w/2 + doorWidth/2 + (i * doorWidth);
        const doorH = design.style === 'inset' ? h - 0.004 : h - 0.008;
        const zOffset = design.style === 'euro' ? d/2 + t/2 : d/2 + t/4;
        
        return (
          <group key={`door-${i}`}>
            <mesh position={[xPos, 0, zOffset]}>
              <boxGeometry args={[doorWidth - (design.style === 'euro' ? 0.004 : 0.006), doorH, t]} />
              <meshStandardMaterial color="#b8956a" />
            </mesh>
            {/* Door handle */}
            <mesh position={[xPos + doorWidth/3, 0, zOffset + t/2 + 0.01]}>
              <boxGeometry args={[0.02, 0.1, 0.02]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          </group>
        );
      })}

      {/* Dimension Lines */}
      <DimensionLine 
        start={[-w/2, -h/2 - 0.1, d/2]}
        end={[w/2, -h/2 - 0.1, d/2]}
        label={`${width}mm`}
      />
      <DimensionLine 
        start={[w/2 + 0.1, -h/2, d/2]}
        end={[w/2 + 0.1, h/2, d/2]}
        label={`${height}mm`}
      />
      <DimensionLine 
        start={[w/2, -h/2 - 0.1, -d/2]}
        end={[w/2, -h/2 - 0.1, d/2]}
        label={`${depth}mm`}
      />
    </group>
  );
}

function DimensionLine({ start, end, label }: { start: [number, number, number]; end: [number, number, number]; label: string }) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#333333" linewidth={2} />
      </line>
    </group>
  );
}

export default function CabinetViewer3D({ design }: CabinetViewer3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[2, 1.5, 2]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={5}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          castShadow
        />
        <directionalLight 
          position={[-5, 3, -5]} 
          intensity={0.3}
        />
        
        <CabinetModel design={design} />
        
        <Grid 
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#999999"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={8}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      </Canvas>
    </div>
  );
}