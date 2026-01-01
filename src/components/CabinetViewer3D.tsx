"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { CabinetDesign } from '@/types';
import * as THREE from 'three';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  RotateCcw, 
  Maximize2, 
  Download,
  Box,
  Settings
} from 'lucide-react';
import { Material } from '@/types';
import { capitalize } from "@/lib/utils/string";

interface CabinetViewer3DProps {
  design: CabinetDesign;
  width?: number;
  height?: number;
  className?: string;
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

  const material = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: '#d4a574',
      roughness: 0.3,
      metalness: 0.1
    }), []
  );

  const doorMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: '#8b4513',
      roughness: 0.4,
      metalness: 0.05
    }), []
  );

  return (
    <group>
      {/* Left Side */}
      <mesh position={[-w/2 + t/2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, d]} />
        <primitive object={material} />
      </mesh>

      {/* Right Side */}
      <mesh position={[w/2 - t/2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, h, d]} />
        <primitive object={material} />
      </mesh>

      {/* Top */}
      <mesh position={[0, h/2 - t/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 2*t, t, d]} />
        <primitive object={material} />
      </mesh>

      {/* Bottom */}
      <mesh position={[0, -h/2 + t/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 2*t, t, d]} />
        <primitive object={material} />
      </mesh>

      {/* Back Panel */}
      {includeBack && (
        <mesh position={[0, 0, -d/2 + t/4]} receiveShadow>
          <boxGeometry args={[w - 2*t, h - 2*t, t/2]} />
          <primitive object={material} />
        </mesh>
      )}

      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, index) => {
        const shelfY = -h/2 + t + (index + 1) * (h - 2*t) / (shelfCount + 1);
        return (
          <mesh 
            key={`shelf-${index}`}
            position={[0, shelfY, 0]} 
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[w - 2*t, t/2, d - t]} />
            <primitive object={material} />
          </mesh>
        );
      })}

      {/* Doors */}
      {Array.from({ length: doorCount }).map((_, index) => {
        const doorWidth = (w - 2*t) / doorCount;
        const doorX = -w/2 + t + (index + 0.5) * doorWidth;
        const doorZ = d/2 + t/2;
        
        return (
          <group key={`door-${index}`} position={[doorX, 0, doorZ]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[doorWidth - 2, h - 2*t, t/2]} />
              <primitive object={doorMaterial} />
            </mesh>
            
            {/* Door Handle */}
            <mesh position={[doorWidth/4 - t, 0, t/4]}>
              <cylinderGeometry args={[t/8, t/8, doorWidth/2]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function CabinetViewer3D({ 
  design, 
  width = 600, 
  height = 400, 
  className = "" 
}: CabinetViewer3DProps) {
  const [resetCamera, setResetCamera] = useState(false);

  const handleResetCamera = () => {
    setResetCamera(true);
    setTimeout(() => setResetCamera(false), 100);
  };

  const handleExport = () => {
    // Export functionality could be added here
    console.log('Exporting cabinet design:', design);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            3D Cabinet Viewer
          </CardTitle>
          <CardDescription>
            Interactive 3D visualization of your cabinet design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleResetCamera}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Camera
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <div className="flex items-center gap-2 px-3 py-1 border rounded-md bg-muted">
                <Settings className="w-4 h-4" />
                <span className="text-sm">
                  {design.dimensions.width}mm × {design.dimensions.height}mm × {design.dimensions.depth}mm
                </span>
              </div>
              
              <Badge variant="secondary">
                {design.style} • {design.material}
              </Badge>
            </div>

            {/* 3D Canvas */}
            <div className="border rounded-lg overflow-hidden bg-slate-100">
              <Canvas
                shadows
                camera={{ position: [2, 2, 2], fov: 50 }}
                style={{ width, height }}
              >
                <PerspectiveCamera makeDefault position={[2, 2, 2]} />
                
                <ambientLight intensity={0.3} />
                <directionalLight
                  position={[5, 10, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                
                <Environment preset="studio" />
                
                <Grid 
                  args={[10, 10]} 
                  cellSize={0.5} 
                  cellThickness={0.5} 
                  cellColor="#6b7280" 
                  sectionSize={2} 
                  sectionThickness={1} 
                  sectionColor="#374151" 
                  fadeDistance={30} 
                  fadeStrength={1} 
                  followCamera={false} 
                  infiniteGrid={true} 
                />
                
                <CabinetModel design={design} />
                
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1}
                  maxDistance={10}
                  target={[0, 0, 0]}
                />
              </Canvas>
            </div>

            {/* Cabinet Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Style</p>
                <p className="font-semibold capitalize">{design.style}</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Doors</p>
                <p className="font-semibold">{design.doorCount}</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Shelves</p>
                <p className="font-semibold">{design.shelfCount}</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="text-muted-foreground">Back Panel</p>
                <p className="font-semibold">{design.includeBack ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
