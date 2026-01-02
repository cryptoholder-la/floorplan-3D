'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drill, Grid3x3, Settings, Download, Eye, Ruler } from 'lucide-react';
import { hardwareStore, DrillingPattern, HardwareItem } from '@/data/hardwareData';

export default function DrillingPage() {
  const [selectedPattern, setSelectedPattern] = useState<DrillingPattern | null>(null);
  const [selectedHardware, setSelectedHardware] = useState<HardwareItem | null>(null);
  const [customPattern, setCustomPattern] = useState({
    name: '',
    spacing: 32,
    holeDiameter: 5,
    edgeDistance: 37
  });
  const [generatedPattern, setGeneratedPattern] = useState<any>(null);

  const patterns = hardwareStore.getAllDrillingPatterns();
  const hardware = hardwareStore.getAllHardware();

  const generatePattern = () => {
    if (!selectedPattern) return;
    
    const panelWidth = 600;
    const panelHeight = 720;
    
    const xPositions: number[] = [];
    const yPositions: number[] = [];
    
    // Generate X positions
    let x = selectedPattern.edgeDistance;
    while (x <= panelWidth - selectedPattern.edgeDistance) {
      xPositions.push(x);
      x += selectedPattern.spacing;
    }
    
    // Generate Y positions
    let y = selectedPattern.edgeDistance;
    while (y <= panelHeight - selectedPattern.edgeDistance) {
      yPositions.push(y);
      y += selectedPattern.spacing;
    }
    
    const pattern = {
      ...selectedPattern,
      panelSize: { width: panelWidth, height: panelHeight },
      positions: xPositions.map(x => 
        yPositions.map(y => ({ x, y }))
      ).flat(),
      totalHoles: xPositions.length * yPositions.length
    };
    
    setGeneratedPattern(pattern);
  };

  const generateHardwarePattern = () => {
    if (!selectedHardware) return;
    
    const pattern = {
      hardware: selectedHardware,
      drilling: selectedHardware.drilling,
      panelSize: { width: 600, height: 720 },
      positions: [
        { x: selectedHardware.drilling.edgeDistance, y: 100 },
        { x: selectedHardware.drilling.edgeDistance + selectedHardware.drilling.spacing, y: 100 }
      ],
      totalHoles: 2
    };
    
    setGeneratedPattern(pattern);
  };

  const exportPattern = () => {
    if (!generatedPattern) return;
    
    const dataStr = JSON.stringify(generatedPattern, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `drilling-pattern-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">32mm Drilling System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3x3 className="w-5 h-5" />
              Drilling Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={(value) => {
                const pattern = hardwareStore.getDrillingPattern(value);
                setSelectedPattern(pattern);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern..." />
                </SelectTrigger>
                <SelectContent>
                  {patterns.map(pattern => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPattern && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Type:</strong> {selectedPattern.type}
                  </div>
                  <div className="text-sm">
                    <strong>Spacing:</strong> {selectedPattern.spacing}mm
                  </div>
                  <div className="text-sm">
                    <strong>Hole Diameter:</strong> {selectedPattern.holeDiameter}mm
                  </div>
                  <div className="text-sm">
                    <strong>Edge Distance:</strong> {selectedPattern.edgeDistance}mm
                  </div>
                  <Button onClick={generatePattern} className="w-full">
                    Generate Pattern
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Hardware-Specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={(value) => {
                const hw = hardwareStore.getHardware(value);
                setSelectedHardware(hw);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hardware..." />
                </SelectTrigger>
                <SelectContent>
                  {hardware.map(hw => (
                    <SelectItem key={hw.id} value={hw.id}>
                      {hw.manufacturer} - {hw.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedHardware && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Type:</strong> {selectedHardware.type}
                  </div>
                  <div className="text-sm">
                    <strong>Pattern:</strong> {selectedHardware.drilling.holePattern}
                  </div>
                  <div className="text-sm">
                    <strong>Hole Diameter:</strong> {selectedHardware.drilling.holeDiameter}mm
                  </div>
                  <div className="text-sm">
                    <strong>Spacing:</strong> {selectedHardware.drilling.spacing}mm
                  </div>
                  <Button onClick={generateHardwarePattern} className="w-full">
                    Generate Hardware Pattern
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Custom Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pattern Name</label>
                <Input
                  value={customPattern.name}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Custom pattern name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spacing (mm)</label>
                <Input
                  type="number"
                  value={customPattern.spacing}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, spacing: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hole Diameter (mm)</label>
                <Input
                  type="number"
                  value={customPattern.holeDiameter}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, holeDiameter: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Edge Distance (mm)</label>
                <Input
                  type="number"
                  value={customPattern.edgeDistance}
                  onChange={(e) => setCustomPattern(prev => ({ ...prev, edgeDistance: Number(e.target.value) }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {generatedPattern && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Generated Pattern Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Pattern Visualization</h4>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50" style={{ width: '400px', height: '480px' }}>
                  <svg width="400" height="480" viewBox="0 0 400 480">
                    {/* Panel outline */}
                    <rect x="20" y="20" width="360" height="440" fill="white" stroke="black" strokeWidth="2" />
                    
                    {/* Drilling holes */}
                    {generatedPattern.positions?.map((pos: any, index: number) => (
                      <circle
                        key={index}
                        cx={20 + (pos.x / 600) * 360}
                        cy={20 + (pos.y / 720) * 440}
                        r={Math.max(2, (generatedPattern.holeDiameter || 5) / 4)}
                        fill="red"
                        stroke="darkred"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Pattern Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pattern Type:</span>
                    <Badge>{generatedPattern.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Holes:</span>
                    <span className="font-semibold">{generatedPattern.totalHoles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Panel Size:</span>
                    <span>{generatedPattern.panelSize?.width} x {generatedPattern.panelSize?.height}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hole Diameter:</span>
                    <span>{generatedPattern.holeDiameter}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spacing:</span>
                    <span>{generatedPattern.spacing}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Distance:</span>
                    <span>{generatedPattern.edgeDistance}mm</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button onClick={exportPattern} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Pattern
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Drill className="w-4 h-4 mr-2" />
                    Generate CNC Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>32mm System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Standard:</strong> European cabinet construction</p>
              <p><strong>Spacing:</strong> 32mm between holes</p>
              <p><strong>Edge Distance:</strong> 37mm standard</p>
              <p><strong>Applications:</strong> Hinges, slides, supports</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hardware Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Blum:</strong> Full compatibility</p>
              <p><strong>Hettich:</strong> 32mm system</p>
              <p><strong>Grass:</strong> Compatible patterns</p>
              <p><strong>Custom:</strong> Pattern generator</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CNC Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>G-Code:</strong> Auto-generated</p>
              <p><strong>Toolpaths:</strong> Optimized</p>
              <p><strong>Speeds:</strong> Material-specific</p>
              <p><strong>Depth:</strong> Configurable</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}