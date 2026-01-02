'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Grid, 
  Package,
  Eye,
  Download,
  Upload,
  Zap,
  Layers,
  Box,
  Move,
  RotateCw,
  Maximize2,
  Palette
} from 'lucide-react';

export default function FloorplanOptionsPage() {
  const [activeTab, setActiveTab] = useState('designer');
  const [selectedTool, setSelectedTool] = useState<string>('select');

  const designTools = [
    { id: 'select', name: 'Select Tool', icon: <Move className="w-4 h-4" /> },
    { id: 'wall', name: 'Wall Tool', icon: <Grid className="w-4 h-4" /> },
    { id: 'cabinet', name: 'Cabinet Tool', icon: <Box className="w-4 h-4" /> },
    { id: 'door', name: 'Door Tool', icon: <Package className="w-4 h-4" /> },
    { id: 'window', name: 'Window Tool', icon: <Eye className="w-4 h-4" /> },
    { id: 'rotate', name: 'Rotate Tool', icon: <RotateCcw className="w-4 h-4" /> }
  ];

  const floorplanTemplates = [
    {
      id: 'kitchen-1',
      name: 'Modern Kitchen Layout',
      dimensions: '12x10 ft',
      cabinets: 12,
      difficulty: 'intermediate',
      preview: '/assets/floorplans/kitchen-1.jpg'
    },
    {
      id: 'bathroom-1',
      name: 'Compact Bathroom',
      dimensions: '8x6 ft',
      cabinets: 6,
      difficulty: 'easy',
      preview: '/assets/floorplans/bathroom-1.jpg'
    },
    {
      id: 'garage-1',
      name: 'Garage Workshop',
      dimensions: '20x15 ft',
      cabinets: 18,
      difficulty: 'advanced',
      preview: '/assets/floorplans/garage-1.jpg'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Floorplan Options
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced floorplan design tools and cabinet layout optimization
        </p>
      </div>

      {/* Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Grid className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{designTools.length}</div>
            <div className="text-sm text-muted-foreground">Design Tools</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Box className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {floorplanTemplates.reduce((sum, t) => sum + t.cabinets, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cabinets</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Layers className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{floorplanTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">3D</div>
            <div className="text-sm text-muted-foreground">View Modes</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="designer">Floorplan Designer</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="library">Component Library</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="mt-6">
          <div className="space-y-6">
            {/* Design Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Design Tools
                </CardTitle>
                <CardDescription>
                  Select and configure floorplan design tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {designTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? 'default' : 'outline'}
                      className="h-16 flex-col"
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      {tool.icon}
                      <span className="text-xs mt-1">{tool.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Canvas Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Design Canvas
                </CardTitle>
                <CardDescription>
                  Interactive floorplan design workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <Grid className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium text-slate-600">Floorplan Canvas</p>
                    <p className="text-sm text-slate-500">Interactive design workspace</p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Maximize2 className="w-3 h-3 mr-1" />
                        Fullscreen
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Properties Panel
                </CardTitle>
                <CardDescription>
                  Configure selected object properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Selected: {designTools.find(t => t.id === selectedTool)?.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Position:</span>
                        <span>X: 0, Y: 0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rotation:</span>
                        <span>0°</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scale:</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Floorplan Templates
                </CardTitle>
                <CardDescription>
                  Pre-designed floorplan layouts for quick start
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floorplanTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 flex items-center justify-center border-2 border-dashed border-slate-300">
                          <Eye className="w-8 h-8 text-slate-400" />
                        </div>
                        
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div>Dimensions: {template.dimensions}</div>
                          <div>Cabinets: {template.cabinets}</div>
                          <div>Difficulty: {template.difficulty}</div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Use Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Component Library
                </CardTitle>
                <CardDescription>
                  Cabinet and fixture components for floorplan design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Box className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Component Library</p>
                  <p className="text-sm text-slate-600">Cabinet and fixture components coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
                <CardDescription>
                  Export floorplan designs in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="w-6 h-6 mb-2" />
                    <span>Export as DWG</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export as PDF</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Export as 3D</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Grid className="w-6 h-6 mb-2" />
                    <span>Export as Image</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Palette className="w-6 h-6 mb-2" />
                    <span>Export Materials</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Share Project</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}