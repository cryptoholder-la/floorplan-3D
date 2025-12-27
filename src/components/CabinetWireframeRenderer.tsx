"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Settings,
  Eye,
  EyeOff,
  Box,
  Wrench
} from 'lucide-react';
import { WireframeAsset, CabinetPart, CabinetAccessory } from '../types/wireframe';

interface CabinetWireframeRendererProps {
  asset: WireframeAsset;
  className?: string;
  width?: number;
  height?: number;
}

export default function CabinetWireframeRenderer({ 
  asset, 
  className = "",
  width = 600,
  height = 400 
}: CabinetWireframeRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number | null>(null);
  
  const [showWireframe, setShowWireframe] = useState(true);
  const [showSolid, setShowSolid] = useState(false);
  const [showAccessories, setShowAccessories] = useState(true);
  const [opacity, setOpacity] = useState([0.8]);
  const [cameraDistance, setCameraDistance] = useState([1000]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.set(500, 400, 500);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(2000, 20, 0xe0e0e0, 0xf0f0f0);
    scene.add(gridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    mountRef.current.appendChild(renderer.domElement);

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
      controls.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing cabinet objects
    const objectsToRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((child) => {
      if (child.userData.isCabinet) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

    if (!asset.dimensions) return;

    // Create cabinet group
    const cabinetGroup = new THREE.Group();
    cabinetGroup.userData.isCabinet = true;

    const scale = 0.001; // Convert mm to meters
    const cabinetWidth = asset.dimensions.width * scale;
    const cabinetHeight = asset.dimensions.height * scale;
    const cabinetDepth = asset.dimensions.depth * scale;

    // Create cabinet parts
    if (asset.parts) {
      asset.parts.forEach((part: CabinetPart) => {
        const partWidth = part.dimensions.width * scale;
        const partHeight = part.dimensions.height * scale;
        const partThickness = part.dimensions.thickness * scale;

        const geometry = new THREE.BoxGeometry(partWidth, partHeight, partThickness);
        
        let material: THREE.Material;
        if (showSolid) {
          material = new THREE.MeshPhongMaterial({
            color: part.color || 0xd4a574,
            opacity: opacity[0],
            transparent: true,
            side: THREE.DoubleSide
          });
        } else {
          material = new THREE.MeshBasicMaterial({
            color: part.color || 0x4a5568,
            wireframe: true,
            opacity: opacity[0],
            transparent: true
          });
        }

        const mesh = new THREE.Mesh(geometry, material);
        
        // Position the part
        if (part.position) {
          mesh.position.set(
            part.position.x * scale - cabinetWidth / 2,
            part.position.y * scale,
            part.position.z * scale - cabinetDepth / 2
          );
        }

        mesh.userData.isCabinet = true;
        mesh.userData.partType = part.type;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cabinetGroup.add(mesh);
      });
    }

    // Create accessories
    if (asset.accessories && showAccessories) {
      asset.accessories.forEach((accessory: CabinetAccessory) => {
        const accWidth = accessory.dimensions.width * scale;
        const accHeight = accessory.dimensions.height * scale;
        const accDepth = accessory.dimensions.depth * scale;

        const geometry = new THREE.BoxGeometry(accWidth, accHeight, accDepth);
        const material = new THREE.MeshPhongMaterial({
          color: accessory.color || 0xc0c0c0,
          opacity: opacity[0],
          transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Position the accessory
        mesh.position.set(
          accessory.position.x * scale - cabinetWidth / 2,
          accessory.position.y * scale,
          accessory.position.z * scale - cabinetDepth / 2
        );

        mesh.userData.isCabinet = true;
        mesh.userData.isAccessory = true;
        mesh.userData.accessoryType = accessory.type;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cabinetGroup.add(mesh);
      });
    }

    // Center the cabinet
    cabinetGroup.position.set(0, cabinetHeight / 2, 0);
    sceneRef.current.add(cabinetGroup);

  }, [asset, showWireframe, showSolid, showAccessories, opacity]);

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      const distance = cameraDistance[0];
      cameraRef.current.position.set(distance, distance * 0.8, distance);
      controlsRef.current.update();
    }
  }, [cameraDistance]);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(1000, 800, 1000);
      controlsRef.current.reset();
      setCameraDistance([1000]);
    }
  };

  const zoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      const currentDistance = cameraDistance[0];
      const newDistance = Math.max(200, currentDistance * 0.8);
      setCameraDistance([newDistance]);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      const currentDistance = cameraDistance[0];
      const newDistance = Math.min(3000, currentDistance * 1.2);
      setCameraDistance([newDistance]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                {asset.name}
              </CardTitle>
              <CardDescription>
                {asset.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {asset.parts && (
                <Badge variant="outline">
                  {asset.parts.length} parts
                </Badge>
              )}
              {asset.accessories && (
                <Badge variant="outline">
                  {asset.accessories.length} accessories
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 3D Viewport */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <div 
              ref={mountRef} 
              style={{ width: `${width}px`, height: `${height}px` }}
              className="bg-gradient-to-br from-slate-50 to-slate-100"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetCamera}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCameraDistance([1000])}>
                <Maximize2 className="w-4 h-4" />
                Fit
              </Button>
            </div>

            {/* Render Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Display Settings
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wireframe</span>
                  <Switch 
                    checked={showWireframe} 
                    onCheckedChange={setShowWireframe}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Solid Fill</span>
                  <Switch 
                    checked={showSolid} 
                    onCheckedChange={setShowSolid}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <Wrench className="w-4 h-4" />
                    Accessories
                  </span>
                  <Switch 
                    checked={showAccessories} 
                    onCheckedChange={setShowAccessories}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visibility
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opacity</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(opacity[0] * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Camera Distance</span>
                    <span className="text-xs text-muted-foreground">
                      {cameraDistance[0]}mm
                    </span>
                  </div>
                  <Slider
                    value={cameraDistance}
                    onValueChange={setCameraDistance}
                    max={3000}
                    min={200}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions Display */}
            {asset.dimensions && (
              <div className="bg-muted rounded-lg p-3">
                <h4 className="font-semibold mb-2">Dimensions</h4>
                <div className="text-sm text-muted-foreground">
                  {asset.dimensions.width} × {asset.dimensions.height} × {asset.dimensions.depth} mm
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
