"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  Download, 
  Upload, 
  Box, 
  Move, 
  Maximize2, 
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw as ResetCamera
} from 'lucide-react';
import { toast } from 'sonner';
import { Material } from '@/types';

interface Wall {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness?: number;
  height?: number;
}

interface Demo3DEditorProps {
  width?: number;
  height?: number;
  className?: string;
}

const CONFIG = {
  SCALE: {
    PIXELS_PER_METER: 20,
    WALL_HEIGHT: 2.7,
    WALL_THICKNESS: 0.2,
  },
  COLORS: {
    BACKGROUND: '#1e293b',
    WALL_3D: 0xe2e8f0,
    HIGHLIGHT: '#facc15',
  },
};

export default function Demo3DEditor({ 
  width = 800, 
  height = 600, 
  className = "" 
}: Demo3DEditorProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number | null>(null);
  
  const [walls, setWalls] = useState<Wall[]>([
    { id: '1', start: { x: 0, y: 0 }, end: { x: 400, y: 0 } },
    { id: '2', start: { x: 400, y: 0 }, end: { x: 400, y: 300 } },
    { id: '3', start: { x: 400, y: 300 }, end: { x: 0, y: 300 } },
    { id: '4', start: { x: 0, y: 300 }, end: { x: 0, y: 0 } },
  ]);
  const [isWireframe, setIsWireframe] = useState(false);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.COLORS.BACKGROUND);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.bias = -0.001;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    scene.add(ambientLight, directionalLight, floor);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear existing walls
    const existingWalls = sceneRef.current.children.filter(
      child => child.userData?.isWall
    );
    existingWalls.forEach(wall => sceneRef.current!.remove(wall));

    // Create new walls
    walls.forEach(wall => {
      const length = Math.hypot(
        wall.end.x - wall.start.x,
        wall.end.y - wall.start.y
      );
      
      const geometry = new THREE.BoxGeometry(
        length / CONFIG.SCALE.PIXELS_PER_METER,
        wall.height || CONFIG.SCALE.WALL_HEIGHT,
        wall.thickness || CONFIG.SCALE.WALL_THICKNESS
      );
      
      const material = new THREE.MeshStandardMaterial({
        color: CONFIG.COLORS.WALL_3D,
        roughness: 0.5,
        metalness: 0.1,
        wireframe: isWireframe
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.isWall = true;
      
      // Position wall
      const centerX = (wall.start.x + wall.end.x) / 2;
      const centerY = (wall.start.y + wall.end.y) / 2;
      mesh.position.set(
        centerX / CONFIG.SCALE.PIXELS_PER_METER - 10,
        (wall.height || CONFIG.SCALE.WALL_HEIGHT) / 2,
        centerY / CONFIG.SCALE.PIXELS_PER_METER - 7.5
      );
      
      // Rotate wall
      const angle = Math.atan2(
        wall.end.y - wall.start.y,
        wall.end.x - wall.start.x
      );
      mesh.rotation.y = -angle;
      
      sceneRef.current.add(mesh);
    });
  }, [walls, isWireframe]);

  const handleExportGLTF = () => {
    if (!sceneRef.current) return;
    
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `floorplan-3d-${Date.now()}.gltf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('3D model exported successfully!');
      },
      (error) => {
        console.error('Export error:', error);
        toast.error('Failed to export 3D model');
      }
    );
  };

  const handleAddWall = () => {
    const newWall: Wall = {
      id: `wall-${Date.now()}`,
      start: { x: Math.random() * 200, y: Math.random() * 200 },
      end: { x: Math.random() * 200 + 200, y: Math.random() * 200 + 200 },
    };
    setWalls(prev => [...prev, newWall]);
    toast.success('Wall added!');
  };

  const handleRemoveWall = () => {
    if (walls.length > 0) {
      setWalls(prev => prev.slice(0, -1));
      toast.success('Wall removed!');
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(10, 10, 10);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      toast.success('Camera reset!');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">3D Demo Editor</h3>
            <Badge variant="secondary">Three.js</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWireframe(!isWireframe)}
            >
              {isWireframe ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {isWireframe ? 'Solid' : 'Wireframe'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Stats
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCamera}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Camera
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddWall}
            >
              <Box className="w-4 h-4 mr-2" />
              Add Wall
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveWall}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Wall
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleExportGLTF}
            >
              <Download className="w-4 h-4 mr-2" />
              Export GLTF
            </Button>
          </div>
        </div>
        
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Walls</p>
              <p className="text-lg font-semibold">{walls.length}</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Mode</p>
              <p className="text-lg font-semibold">{isWireframe ? 'Wireframe' : 'Solid'}</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Renderer</p>
              <p className="text-lg font-semibold">WebGL</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Scale</p>
              <p className="text-lg font-semibold">1:{CONFIG.SCALE.PIXELS_PER_METER}</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mountRef} 
          className="border rounded-lg overflow-hidden bg-slate-900"
          style={{ width, height }}
        />
      </Card>
    </div>
  );
}
