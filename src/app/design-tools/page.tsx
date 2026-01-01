'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UnifiedKitchenDesigner from '@/components/UnifiedKitchenDesigner';
import FloorplanApp from '@/components/FloorplanApp';
import FloorPlanBuilder from '@/components/FloorPlanBuilder';
import FloorPlan2DEditor from '@/components/FloorPlan2DEditor';
import FloorplanViewer3D from '@/components/FloorplanViewer3D';
import ViewModeSelector from '@/components/ViewModeSelector';
import SimpleCabinetCatalog from '@/components/SimpleCabinetCatalog';
import Model3DBrowser from '@/components/Model3DBrowser';
import ModelImportExport from '@/components/ModelImportExport';
import MaterialBrowser from '@/components/MaterialBrowser';
import WorkflowAssistant from '@/components/WorkflowAssistant';
import SmartPlacement from '@/components/SmartPlacement';
import CountertopPlanner from '@/components/CountertopPlanner';
import Demo3DEditor from '@/components/Demo3DEditor';
import DemoInputManager from '@/components/DemoInputManager';
import DesignDashboard from '@/components/DesignDashboard';
import CostEstimator from '@/components/CostEstimator';
import NestingOptimizer from '@/components/NestingOptimizer';
import IntegratedKitchenDesignApp from '@/components/IntegratedKitchenDesignApp';
import IntegratedKitchenDesignSystem from '@/components/IntegratedKitchenDesignSystem';
import FormBuilder from '@/components/FormBuilder';
import { Grid3x3, Home, Eye, Layers, Settings, Zap, Package, Utensils, Calculator, DollarSign, FileText, Box, Upload, Palette, Target, Ruler } from 'lucide-react';
import { FloorPlan, Point, Wall, Room, Door, Window, Cabinet } from '@/lib/floorplan-types';
import { ViewMode } from '@/lib/view-modes';

export default function DesignToolsPage() {
  const [activeTab, setActiveTab] = useState('unified');
  const [viewMode, setViewMode] = useState<ViewMode>('perspective');
  const [selectedCabinet, setSelectedCabinet] = useState<any>(null);

  const handleCabinetSelect = (cabinet: any) => {
    setSelectedCabinet(cabinet);
    console.log('Selected cabinet:', cabinet);
  };

  const handleAddToProject = (cabinet: any) => {
    console.log('Added to project:', cabinet);
    // Add cabinet to current project/floorplan
  };

  return (
    <MainLayout 
      title="Design Tools" 
      subtitle="Complete design and visualization toolkit"
    >
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="unified" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Unified
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Kitchen
            </TabsTrigger>
            <TabsTrigger value="floorplan" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Floorplan
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              2D Editor
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              3D Viewer
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              3D Models
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import/Export
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="placement" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Smart Placement
            </TabsTrigger>
            <TabsTrigger value="countertop" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Countertop
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="integrated" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Integrated
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cost
            </TabsTrigger>
            <TabsTrigger value="nesting" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Nesting
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Forms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Unified Kitchen Designer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <UnifiedKitchenDesigner />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kitchen" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrated Kitchen Design App</CardTitle>
                </CardHeader>
                <CardContent>
                  <IntegratedKitchenDesignApp />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integrated Kitchen Design System</CardTitle>
                </CardHeader>
                <CardContent>
                  <IntegratedKitchenDesignSystem />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="floorplan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Floorplan Application</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <FloorplanApp />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Floorplan Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <FloorPlanBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2d" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>2D Floorplan Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <FloorPlan2DEditor 
                  floorPlan={{
                    id: 'sample-floorplan',
                    name: 'Sample Floorplan',
                    walls: [
                      { id: 'wall1', start: { x: 0, y: 0 }, end: { x: 6000, y: 0 }, height: 2400, thickness: 120 },
                      { id: 'wall2', start: { x: 6000, y: 0 }, end: { x: 6000, y: 4000 }, height: 2400, thickness: 120 }
                    ],
                    rooms: [
                      {
                        id: 'room1',
                        name: 'Living Room',
                        points: [
                          { x: 100, y: 100 },
                          { x: 5900, y: 100 },
                          { x: 5900, y: 3900 },
                          { x: 100, y: 3900 }
                        ],
                        color: '#e3f2fd'
                      }
                    ],
                    cabinets: [],
                    doors: [
                      { id: 'door1', position: { x: 3000, y: 100 }, width: 900, height: 2000, angle: 0, doorType: 'single' as const, sillHeight: 120 }
                    ],
                    windows: [],
                    models3D: [],
                    photos: [],
                    measurements: [],
                    metadata: { 
                      createdAt: new Date().toISOString(), 
                      updatedAt: new Date().toISOString(), 
                      scale: 50, 
                      scaleOption: '1:50' as const, 
                      unit: 'mm', 
                      showMeasurements: true,
                      defaultWallHeight: 2400,
                      upperCabinetHeight: 700,
                      finishedFloorOffset: 0
                    }
                  }}
                  onFloorPlanChange={(floorPlan) => console.log('Floorplan updated:', floorPlan)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="3d" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Floorplan Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <FloorplanViewer3D 
                    floorplan2D={[
                      // Sample walls converted to Floorplan2DElement
                      {
                        id: 'wall1',
                        type: 'wall' as const,
                        position: { x: 0, y: 0 },
                        dimensions: { 
                          width: 6000,
                          height: 2400,
                          depth: 120
                        },
                        rotation: 0,
                        properties: { thickness: 120 }
                      },
                      {
                        id: 'wall2', 
                        type: 'wall' as const,
                        position: { x: 6000, y: 0 },
                        dimensions: { 
                          width: 4000,
                          height: 2400,
                          depth: 120
                        },
                        rotation: 90,
                        properties: { thickness: 120 }
                      }
                    ]}
                    viewMode={viewMode}
                    onElementSelect={(element) => console.log('Selected:', element)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Floorplan 3D Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ViewModeSelector 
                    currentViewMode={viewMode}
                    onViewModeChange={setViewMode}
                    className="mb-4"
                  />
                  <FloorplanViewer3D 
                    floorplan2D={[
                      // Sample walls converted to Floorplan2DElement
                      {
                        id: 'wall1',
                        type: 'wall' as const,
                        position: { x: 0, y: 0 },
                        dimensions: { 
                          width: 6000,
                          height: 2400,
                          depth: 120
                        },
                        rotation: 0,
                        properties: { thickness: 120 }
                      },
                      {
                        id: 'wall2', 
                        type: 'wall' as const,
                        position: { x: 6000, y: 0 },
                        dimensions: { 
                          width: 4000,
                          height: 2400,
                          depth: 120
                        },
                        rotation: 90,
                        properties: { thickness: 120 }
                      },
                      // Sample door
                      {
                        id: 'door1',
                        type: 'door' as const,
                        position: { x: 3000, y: 100 },
                        dimensions: { width: 900, height: 2000 },
                        rotation: 0,
                        properties: { doorType: 'single', sillHeight: 120 }
                      }
                    ]}
                    viewMode={viewMode}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="catalog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Cabinet Catalog
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCabinet && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-semibold text-blue-800 mb-2">Selected Cabinet</h4>
                    <div className="text-sm text-blue-700">
                      <p><strong>Name:</strong> {selectedCabinet.name}</p>
                      <p><strong>Type:</strong> {selectedCabinet.type}</p>
                      <p><strong>Dimensions:</strong> {selectedCabinet.dimensions.width} × {selectedCabinet.dimensions.height} × {selectedCabinet.dimensions.depth}mm</p>
                      {selectedCabinet.price && <p><strong>Price:</strong> ${selectedCabinet.price}</p>}
                    </div>
                  </div>
                )}
                <SimpleCabinetCatalog 
                  onCabinetSelect={handleCabinetSelect}
                  onAddToProject={handleAddToProject}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  3D Model Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Model3DBrowser 
                  onModelSelect={(model) => console.log('Selected 3D model:', model)}
                  onModelAdd={(model) => console.log('Added 3D model to project:', model)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Material Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialBrowser 
                  onMaterialSelect={(material) => console.log('Selected material:', material)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <ModelImportExport 
              onModelImported={(model) => console.log('Imported model:', model)}
            />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <WorkflowAssistant 
              onStepComplete={(stepId, data) => console.log('Workflow step completed:', stepId, data)}
              onWorkflowComplete={(workflowId) => console.log('Workflow completed:', workflowId)}
            />
          </TabsContent>

          <TabsContent value="placement" className="space-y-6">
            <SmartPlacement 
              onPlacementSelect={(suggestion) => console.log('Placement selected:', suggestion)}
              onLayoutGenerate={(layout) => console.log('Layout generated:', layout)}
              roomDimensions={{ width: 5000, height: 2400, depth: 4000 }}
            />
          </TabsContent>

          <TabsContent value="countertop" className="space-y-6">
            <CountertopPlanner 
              onPlanUpdate={(plan) => console.log('Countertop plan updated:', plan)}
            />
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Demo Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Demo3DEditor />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Demo Input Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <DemoInputManager />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Design System</CardTitle>
              </CardHeader>
              <CardContent>
                <IntegratedKitchenDesignSystem />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <DesignDashboard 
                  design={{
                    id: 'sample-cabinet',
                    dimensions: { width: 914, height: 610, depth: 305, thickness: 18 },
                    style: 'euro',
                    doorStyle: 'shaker',
                    material: 'plywood',
                    doorCount: 2,
                    shelfCount: 1,
                    includeBack: true
                  }}
                  onUpdateDesign={(updates) => console.log('Design updated:', updates)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cost" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Estimation</CardTitle>
              </CardHeader>
              <CardContent>
                <CostEstimator
                  cutlist={[
                    {
                      id: 'side-panel-left',
                      name: 'Side Panel Left',
                      width: 600,
                      height: 720,
                      thickness: 18,
                      quantity: 1,
                      material: 'Plywood',
                      materialCost: 25.50
                    },
                    {
                      id: 'side-panel-right',
                      name: 'Side Panel Right',
                      width: 600,
                      height: 720,
                      thickness: 18,
                      quantity: 1,
                      material: 'Plywood',
                      materialCost: 25.50
                    }
                  ]}
                  estimatedTime={120}
                  profitMargin={0.2}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nesting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CNC Nesting Optimizer</CardTitle>
              </CardHeader>
              <CardContent>
                <NestingOptimizer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Builder</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <FormBuilder
                    onSave={(template) => console.log('Form saved:', template)}
                    onPreview={(template) => console.log('Form preview:', template)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
