'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Box, 
  Grid,
  Plus,
  Eye,
  Zap,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import AdvancedWireframeRenderer from './SimpleWireframeRenderer';
import AdvancedCabinetViewer from './SimpleCabinetViewer';
import SimpleQuickAdd from './SimpleQuickAdd';
import SimpleCabinetDetails from './SimpleCabinetDetails';
import { Cabinet } from '@/types/domain/cabinet.types';

export default function ProfessionalCabinetToolsPage() {
  const [activeTab, setActiveTab] = useState('viewer');
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | undefined>(undefined);

  const handleCabinetSelect = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Professional Cabinet Tools
            </h1>
            <p className="text-muted-foreground text-lg">
              Advanced cabinet design, visualization, and manufacturing tools
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              Certification
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Stats Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-muted-foreground">Professional Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-muted-foreground">Manufacturing Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-muted-foreground">Avg. Lead Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Cabinet Viewer
          </TabsTrigger>
          <TabsTrigger value="wireframe" className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Wireframe Pro
          </TabsTrigger>
          <TabsTrigger value="quickadd" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Quick Add Pro
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            Details Pro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" className="mt-6">
          <AdvancedCabinetViewer 
            cabinet={selectedCabinet}
            onCabinetSelect={handleCabinetSelect}
            viewMode="3d"
          />
        </TabsContent>

        <TabsContent value="wireframe" className="mt-6">
          <AdvancedWireframeRenderer 
            cabinet={selectedCabinet}
            onCabinetSelect={handleCabinetSelect}
          />
        </TabsContent>

        <TabsContent value="quickadd" className="mt-6">
          <SimpleQuickAdd />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <SimpleCabinetDetails cabinetId={selectedCabinet?.id} />
        </TabsContent>
      </Tabs>

      {/* Professional Features Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Professional Features
          </CardTitle>
          <CardDescription>
            Industry-leading cabinet design and manufacturing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900">Advanced 3D Viewer</h4>
              </div>
              <p className="text-sm text-blue-700">
                Professional-grade 3D visualization with real-time rendering, material mapping, and lighting simulation
              </p>
              <div className="mt-3 space-y-1">
                <div className="text-xs text-blue-600">• Real-time ray tracing</div>
                <div className="text-xs text-blue-600">• Material library</div>
                <div className="text-xs text-blue-600">• VR/AR support</div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Grid className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-green-900">Wireframe Generator</h4>
              </div>
              <p className="text-sm text-green-700">
                Professional wireframe generation with CNC-ready output and manufacturing optimization
              </p>
              <div className="mt-3 space-y-1">
                <div className="text-xs text-green-600">• CNC export formats</div>
                <div className="text-xs text-green-600">• Cut list optimization</div>
                <div className="text-xs text-green-600">• Material yield analysis</div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-purple-900">Quick Add Pro</h4>
              </div>
              <p className="text-sm text-purple-700">
                Intelligent cabinet selection with AI-powered recommendations and cost optimization
              </p>
              <div className="mt-3 space-y-1">
                <div className="text-xs text-purple-600">• AI recommendations</div>
                <div className="text-xs text-purple-600">• Cost optimization</div>
                <div className="text-xs text-purple-600">• Inventory integration</div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-orange-900">Details Pro</h4>
              </div>
              <p className="text-sm text-orange-700">
                Comprehensive cabinet specifications with compliance checking and documentation
              </p>
              <div className="mt-3 space-y-1">
                <div className="text-xs text-orange-600">• Compliance checking</div>
                <div className="text-xs text-orange-600">• Auto documentation</div>
                <div className="text-xs text-orange-600">• Certification support</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            System Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">CAD Systems</h4>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-green-700">AutoCAD, SolidWorks, Fusion 360</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">Manufacturing</h4>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-green-700">CNC machines, 3D printers, Laser cutters</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">ERP Systems</h4>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-green-700">SAP, Oracle NetSuite, custom APIs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}