import { useState, useEffect } from 'react';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge-simple';
import { Play, Pause, RotateCcw, Download, Settings, Eye, Box, Wrench } from 'lucide-react';

export function KitchenDesignerCore() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [cabinets, setCabinets] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate Three.js scene initialization
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw a simple placeholder for the 3D scene
        ctx.fillStyle = '#1a2230';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        // Draw placeholder text
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('3D Kitchen Scene', canvas.width / 2, canvas.height / 2);
        ctx.font = '12px Inter';
        ctx.fillText('Three.js + WASD Controls', canvas.width / 2, canvas.height / 2 + 25);
      }
    }
  }, []);

  const tools = [
    { id: 'select', icon: Eye, label: 'Select' },
    { id: 'cabinet', icon: Box, label: 'Cabinet' },
    { id: 'appliance', icon: Wrench, label: 'Appliance' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleAddCabinet = () => {
    const newCabinet = {
      id: `cabinet_${Date.now()}`,
      type: 'base',
      width: 600,
      height: 720,
      depth: 305,
      position: { x: Math.random() * 400, y: 0, z: Math.random() * 400 }
    };
    setCabinets(prev => [...prev, newCabinet]);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5" />
              Kitchen Designer Core
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Three.js</Badge>
              <Badge variant="outline">WASD + Mouse</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset View
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <div className="flex-1" />
            
            <Button onClick={handleAddCabinet} size="sm">
              Add Cabinet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main 3D View */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full border border-gray-700 rounded-lg"
            />
            
            {/* Tool Palette */}
            <div className="absolute top-4 left-4 bg-black/80 border border-gray-600 rounded-lg p-2">
              <div className="grid grid-cols-2 gap-1">
                {tools.map(tool => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <tool.icon className="w-3 h-3" />
                    {tool.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Scene Info */}
            <div className="absolute top-4 right-4 bg-black/80 border border-gray-600 rounded-lg p-3 text-xs text-gray-300">
              <div>Objects: {cabinets.length}</div>
              <div>Tool: {selectedTool}</div>
              <div>FPS: 60</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabinet Properties */}
      {cabinets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scene Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cabinets.map(cabinet => (
                <div key={cabinet.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="text-sm">
                    <div className="font-medium">{cabinet.type} Cabinet</div>
                    <div className="text-gray-400">
                      {cabinet.width} × {cabinet.height} × {cabinet.depth}mm
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
