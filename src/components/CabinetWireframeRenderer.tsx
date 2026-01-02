"use client";

import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Box, 
  Grid,
  Settings,
  Download,
  Maximize2,
  Move
} from 'lucide-react';
import { WireframeAsset } from '@/types/wireframe';

interface CabinetWireframeRendererProps {
  asset: WireframeAsset;
  className?: string;
}

export default function CabinetWireframeRenderer({ asset, className = "" }: CabinetWireframeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderSettings, setRenderSettings] = useState({
    showWireframe: true,
    showSolid: false,
    showGrid: true,
    showDimensions: true,
    opacity: 0.8,
    zoom: 1.0,
    rotation: { x: 0, y: 0, z: 0 },
    wireframeColor: '#888888',
    backgroundColor: '#f8f9fa'
  });

  useEffect(() => {
    if (canvasRef.current && asset) {
      renderWireframe();
    }
  }, [asset, renderSettings]);

  const renderWireframe = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = renderSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up drawing context
    ctx.strokeStyle = renderSettings.wireframeColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = renderSettings.opacity;

    // Draw grid if enabled
    if (renderSettings.showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw wireframe based on asset dimensions
    if (asset.dimensions) {
      drawCabinetWireframe(ctx, asset, canvas.width, canvas.height);
    }

    // Draw dimensions if enabled
    if (renderSettings.showDimensions && asset.dimensions) {
      drawDimensions(ctx, asset, canvas.width, canvas.height);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    const gridSize = 20;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = renderSettings.opacity;
    ctx.strokeStyle = renderSettings.wireframeColor;
    ctx.lineWidth = 1;
  };

  const drawCabinetWireframe = (ctx: CanvasRenderingContext2D, asset: WireframeAsset, canvasWidth: number, canvasHeight: number) => {
    if (!asset.dimensions) return;

    const { width, height, depth } = asset.dimensions;
    const scale = Math.min(canvasWidth, canvasHeight) / Math.max(width, height, depth) * 0.8 * renderSettings.zoom;
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Calculate scaled dimensions
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const scaledDepth = depth * scale;

    // Apply rotation transformations
    const rotX = renderSettings.rotation.x * Math.PI / 180;
    const rotY = renderSettings.rotation.y * Math.PI / 180;

    // Draw cabinet box (isometric view)
    ctx.beginPath();

    // Front face
    const frontX1 = centerX - scaledWidth / 2;
    const frontY1 = centerY + scaledHeight / 2;
    const frontX2 = centerX + scaledWidth / 2;
    const frontY2 = centerY - scaledHeight / 2;

    // Back face (offset for depth)
    const backOffsetX = scaledDepth * Math.cos(rotY) * 0.5;
    const backOffsetY = scaledDepth * Math.sin(rotX) * 0.3;

    const backX1 = frontX1 + backOffsetX;
    const backY1 = frontY1 - backOffsetY;
    const backX2 = frontX2 + backOffsetX;
    const backY2 = frontY2 - backOffsetY;

    // Draw front face
    ctx.rect(frontX1, frontY1, scaledWidth, -scaledHeight);
    ctx.stroke();

    // Draw back face
    ctx.rect(backX1, backY1, scaledWidth, -scaledHeight);
    ctx.stroke();

    // Connect corners
    ctx.beginPath();
    ctx.moveTo(frontX1, frontY1);
    ctx.lineTo(backX1, backY1);
    ctx.moveTo(frontX2, frontY1);
    ctx.lineTo(backX2, backY1);
    ctx.moveTo(frontX1, frontY2);
    ctx.lineTo(backX1, backY2);
    ctx.moveTo(frontX2, frontY2);
    ctx.lineTo(backX2, backY2);
    ctx.stroke();

    // Draw parts if available
    if (asset.parts) {
      drawParts(ctx, asset.parts, centerX, centerY, scale, rotX, rotY);
    }
  };

  const drawParts = (
    ctx: CanvasRenderingContext2D, 
    parts: any[], 
    centerX: number, 
    centerY: number, 
    scale: number,
    rotX: number,
    rotY: number
  ) => {
    parts.forEach(part => {
      ctx.strokeStyle = part.color || '#d4a574';
      ctx.lineWidth = 0.5;
      
      const { width, height, thickness } = part.dimensions;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      const scaledThickness = thickness * scale;

      // Simple representation of parts
      ctx.beginPath();
      ctx.rect(
        centerX - scaledWidth / 2,
        centerY + scaledHeight / 2,
        scaledWidth,
        -scaledHeight
      );
      ctx.stroke();
    });

    // Reset to main wireframe color
    ctx.strokeStyle = renderSettings.wireframeColor;
    ctx.lineWidth = 1;
  };

  const drawDimensions = (ctx: CanvasRenderingContext2D, asset: WireframeAsset, canvasWidth: number, canvasHeight: number) => {
    if (!asset.dimensions) return;

    ctx.fillStyle = '#333333';
    ctx.font = '12px monospace';
    ctx.globalAlpha = 1.0;

    const { width, height, depth } = asset.dimensions;
    
    // Draw dimension labels
    ctx.fillText(`${width}mm`, 10, canvasHeight - 10);
    ctx.fillText(`${height}mm`, 10, 20);
    ctx.fillText(`${depth}mm`, canvasWidth - 60, canvasHeight - 10);

    ctx.globalAlpha = renderSettings.opacity;
  };

  const handleReset = () => {
    setRenderSettings(prev => ({
      ...prev,
      zoom: 1.0,
      rotation: { x: 0, y: 0, z: 0 }
    }));
  };

  const handleZoomIn = () => {
    setRenderSettings(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3.0)
    }));
  };

  const handleZoomOut = () => {
    setRenderSettings(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.3)
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Render Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            Wireframe Renderer
          </CardTitle>
          <CardDescription>
            Interactive 3D wireframe visualization of {asset.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Actions */}
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Badge variant="secondary" className="ml-auto">
              {(renderSettings.zoom * 100).toFixed(0)}%
            </Badge>
          </div>

          {/* Canvas */}
          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-full"
              style={{ backgroundColor: renderSettings.backgroundColor }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Render Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Render Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Switch
                checked={renderSettings.showWireframe}
                onCheckedChange={(checked) =>
                  setRenderSettings(prev => ({ ...prev, showWireframe: checked }))
                }
              />
              <label className="text-sm font-medium">Show Wireframe</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={renderSettings.showSolid}
                onCheckedChange={(checked) =>
                  setRenderSettings(prev => ({ ...prev, showSolid: checked }))
                }
              />
              <label className="text-sm font-medium">Show Solid</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={renderSettings.showGrid}
                onCheckedChange={(checked) =>
                  setRenderSettings(prev => ({ ...prev, showGrid: checked }))
                }
              />
              <label className="text-sm font-medium">Show Grid</label>
            </div>
            
            <div className="space-y-2">
              <Switch
                checked={renderSettings.showDimensions}
                onCheckedChange={(checked) =>
                  setRenderSettings(prev => ({ ...prev, showDimensions: checked }))
                }
              />
              <label className="text-sm font-medium">Show Dimensions</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opacity</label>
            <Slider
              value={[renderSettings.opacity * 100]}
              onValueChange={(value) =>
                setRenderSettings(prev => ({ ...prev, opacity: value[0] / 100 }))
              }
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <span className="text-xs text-gray-600">{(renderSettings.opacity * 100).toFixed(0)}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wireframe Color</label>
            <input
              type="color"
              value={renderSettings.wireframeColor}
              onChange={(e) =>
                setRenderSettings(prev => ({ ...prev, wireframeColor: e.target.value }))
              }
              className="w-full h-8 rounded"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
