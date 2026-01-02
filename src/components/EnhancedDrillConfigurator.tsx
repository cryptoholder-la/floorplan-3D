'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Input } from '@/ui/input';
import { Progress } from '@/ui/progress';

interface DrillConfiguratorProps {
  className?: string;
}

interface DrillHole {
  id: string;
  x: number;
  y: number;
  diameter: number;
  depth: number;
  type: 'through' | 'counterbore' | 'tap';
}

interface DrillPattern {
  id: string;
  name: string;
  holes: DrillHole[];
  description: string;
}

export default function EnhancedDrillConfigurator({ className = '' }: DrillConfiguratorProps) {
  const [activeTab, setActiveTab] = useState('design');
  const [patterns, setPatterns] = useState<DrillPattern[]>([
    {
      id: '1',
      name: 'Standard Grid',
      holes: [
        { id: '1', x: 10, y: 10, diameter: 6, depth: 12, type: 'through' },
        { id: '2', x: 30, y: 10, diameter: 6, depth: 12, type: 'through' },
        { id: '3', x: 50, y: 10, diameter: 6, depth: 12, type: 'through' },
        { id: '4', x: 10, y: 30, diameter: 6, depth: 12, type: 'through' },
        { id: '5', x: 30, y: 30, diameter: 6, depth: 12, type: 'through' },
        { id: '6', x: 50, y: 30, diameter: 6, depth: 12, type: 'through' }
      ],
      description: 'Standard 6mm grid pattern for general drilling'
    },
    {
      id: '2',
      name: 'Custom Pattern',
      holes: [],
      description: 'Create your own custom drilling pattern'
    }
  ]);

  const [selectedPattern, setSelectedPattern] = useState<DrillPattern | null>(null);
  const [newHole, setNewHole] = useState<Partial<DrillHole>>({
    x: 25,
    y: 25,
    diameter: 6,
    depth: 12,
    type: 'through'
  });

  const addHole = () => {
    if (selectedPattern && selectedPattern.id === '2') {
      const hole: DrillHole = {
        id: Date.now().toString(),
        x: newHole.x || 25,
        y: newHole.y || 25,
        diameter: newHole.diameter || 6,
        depth: newHole.depth || 12,
        type: newHole.type || 'through'
      };
      
      setSelectedPattern({
        ...selectedPattern,
        holes: [...selectedPattern.holes, hole]
      });
    }
  };

  const removeHole = (holeId: string) => {
    if (selectedPattern) {
      setSelectedPattern({
        ...selectedPattern,
        holes: selectedPattern.holes.filter(h => h.id !== holeId)
      });
    }
  };

  const generateGCode = () => {
    if (!selectedPattern || selectedPattern.holes.length === 0) return '';
    
    const gCode = [
      'G21 ; Set units to millimeters',
      'G90 ; Absolute positioning',
      'G0 X0 Y0 ; Rapid move to origin',
      ''
    ];

    selectedPattern.holes.forEach((hole, index) => {
      gCode.push(`G1 Z${hole.depth} ; Move to drill depth`);
      gCode.push(`G0 X${hole.x} Y${hole.y} ; Move to hole position`);
      gCode.push(`M3 S${Math.min(hole.diameter * 100, 2000)} ; Start spindle`);
      gCode.push(`G1 Z0 ; Drill to surface`);
      gCode.push(`G0 X0 Y0 ; Return to origin`);
    });

    return gCode.join('\n');
  };

  const exportPattern = () => {
    if (!selectedPattern) return;
    
    const patternData = {
      ...selectedPattern,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(patternData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drill-pattern-${selectedPattern.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Drill Configurator</CardTitle>
          <p className="text-sm text-gray-600">
            Create and manage drilling patterns for CNC manufacturing
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="gcode">G-Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Pattern</h3>
                  <div className="space-y-2">
                    {patterns.map(pattern => (
                      <div
                        key={pattern.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPattern?.id === pattern.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPattern(pattern)}
                      >
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-sm text-gray-600">{pattern.description}</div>
                        {pattern.id === '2' && (
                          <Badge variant="secondary" className="mt-2">
                            {pattern.holes.length} holes
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pattern Settings</h3>
                  {selectedPattern && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">X Position</label>
                          <Input
                            type="number"
                            value={newHole.x}
                            onChange={(e) => setNewHole({ ...newHole, x: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Y Position</label>
                          <Input
                            type="number"
                            value={newHole.y}
                            onChange={(e) => setNewHole({ ...newHole, y: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Diameter (mm)</label>
                          <Input
                            type="number"
                            value={newHole.diameter}
                            onChange={(e) => setNewHole({ ...newHole, diameter: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Depth (mm)</label>
                          <Input
                            type="number"
                            value={newHole.depth}
                            onChange={(e) => setNewHole({ ...newHole, depth: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Hole Type</label>
                          <select
                            value={newHole.type}
                            onChange={(e) => setNewHole({ ...newHole, type: e.target.value as DrillHole['type'] })}
                            className="w-full p-2 border border rounded-md"
                          >
                            <option value="through">Through Hole</option>
                            <option value="counterbore">Counterbore</option>
                            <option value="tap">Tap Hole</option>
                          </select>
                        </div>
                      </div>
                      
                      {selectedPattern.id === '2' && (
                        <div className="flex gap-2">
                          <Button onClick={addHole} className="flex-1">
                            Add Hole
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6">
              {selectedPattern && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pattern Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <svg width="400" height="300" className="w-full h-full">
                      {selectedPattern.holes.map((hole, index) => (
                        <g key={hole.id}>
                          <circle
                            cx={hole.x * 4}
                            cy={hole.y * 4}
                            r={hole.diameter * 2}
                            fill={hole.type === 'through' ? '#3b82f6' : '#ef4444'}
                            stroke="#1f2937"
                            strokeWidth="1"
                          />
                          <text
                            x={hole.x * 4}
                            y={hole.y * 4 - 5}
                            fontSize="10"
                            fill="#374151"
                          >
                            {index + 1}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Pattern Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Holes:</span> {selectedPattern.holes.length}
                      </div>
                      <div>
                        <span className="font-medium">Pattern Type:</span> {selectedPattern.name}
                      </div>
                      <div>
                        <span className="font-medium">Coverage Area:</span> {Math.max(...selectedPattern.holes.map(h => h.x)) * Math.max(...selectedPattern.holes.map(h => h.y))} mm²
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="gcode" className="space-y-6">
              {selectedPattern && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Generated G-Code</h3>
                    <div className="flex gap-2">
                      <Button onClick={generateGCode} variant="outline">
                        Generate G-Code
                      </Button>
                      <Button onClick={exportPattern} variant="outline">
                        Export Pattern
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-900 text-gray-100">
                    <pre className="text-sm overflow-x-auto">
                      {generateGCode()}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
