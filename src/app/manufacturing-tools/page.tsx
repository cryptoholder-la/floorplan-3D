import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CNCManufacturingPanel from '@/components/CNCManufacturingPanel';
import CNCSimulator from '@/components/CNCSimulator';
import GCodeGenerator from '@/components/GCodeGenerator';
import CutListPanel from '@/components/CutListPanel';
import CutlistGenerator from '@/components/CutlistGenerator';
import NestingOptimizer from '@/components/NestingOptimizer';
import ToolpathVisualization from '@/components/ToolpathVisualization';
import FloorplanManufacturingPanel from '@/components/FloorplanManufacturingPanel';
import { Cpu, Zap, Scissors, Layers, Printer, Settings, Play } from 'lucide-react';

export default function ManufacturingToolsPage() {
  const [activeTab, setActiveTab] = useState('cnc');

  return (
    <MainLayout 
      title="Manufacturing Tools" 
      subtitle="Complete manufacturing and production toolkit"
    >
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="cnc" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              CNC Panel
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Simulator
            </TabsTrigger>
            <TabsTrigger value="gcode" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              G-Code
            </TabsTrigger>
            <TabsTrigger value="cutlist" className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Cut List
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="nesting" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Nesting
            </TabsTrigger>
            <TabsTrigger value="toolpath" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Toolpath
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cnc" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CNC Manufacturing Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CNCManufacturingPanel />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Floorplan Manufacturing</CardTitle>
                </CardHeader>
                <CardContent>
                  <FloorplanManufacturingPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CNC Simulator</CardTitle>
              </CardHeader>
              <CardContent>
                <CNCSimulator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gcode" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>G-Code Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <GCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cutlist" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cut List Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CutListPanel />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cutlist Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <CutlistGenerator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nesting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nesting Optimizer</CardTitle>
              </CardHeader>
              <CardContent>
                <NestingOptimizer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toolpath" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Toolpath Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <ToolpathVisualization />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
