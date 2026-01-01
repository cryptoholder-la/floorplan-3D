"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import Demo3DEditor from '@/components/Demo3DEditor';
import DemoInputManager from '@/components/DemoInputManager';
import CabinetViewer3D from '@/components/CabinetViewer3D';
import DesignDashboard from '@/components/DesignDashboard';
import AssetViewer from '@/components/AssetViewer';
import ModelViewer from '@/components/ModelViewer';
import WireframeViewer from '@/components/WireframeViewer';
import NestingOptimizer from '@/components/NestingOptimizer';
import CatalogManager from '@/components/CatalogManager';
import CutlistGenerator from '@/components/CutlistGenerator';
import GCodeGenerator from '@/components/GCodeGenerator';
import CostReport from '@/components/CostReport';
import FileUpload from '@/components/FileUpload';
import { UploadedFile } from '@/components/FileUpload';
import { DEFAULT_CABINET_DESIGN } from '@/types/cabinet.types';
import { 
  Box, 
  Code, 
  FileText, 
  Image, 
  Upload,
  Play,
  Settings,
  Info,
  Activity,
  Calculator,
  Folder,
  Layers,
  Package,
  Database,
  Scissors
} from 'lucide-react';
import { toast } from 'sonner';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('3d-editor');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [cabinetDesign, setCabinetDesign] = useState(DEFAULT_CABINET_DESIGN);

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded to demo!`);
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  const handleCabinetUpdate = (updates: Partial<typeof DEFAULT_CABINET_DESIGN>) => {
    setCabinetDesign(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Demo Showcase</h1>
        <p className="text-muted-foreground">
          Explore the various components and features available in the floorplan application
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-6xl grid-cols-13">
          <TabsTrigger value="3d-editor" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            3D Editor
          </TabsTrigger>
          <TabsTrigger value="cabinet-viewer" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            Cabinet 3D
          </TabsTrigger>
          <TabsTrigger value="cabinet-design" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Cabinet Design
          </TabsTrigger>
          <TabsTrigger value="cost-report" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Cost Report
          </TabsTrigger>
          <TabsTrigger value="asset-viewer" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="model-viewer" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            3D Models
          </TabsTrigger>
          <TabsTrigger value="wireframe-viewer" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Wireframes
          </TabsTrigger>
          <TabsTrigger value="nesting-optimizer" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Nesting
          </TabsTrigger>
          <TabsTrigger value="catalog-manager" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Catalog
          </TabsTrigger>
          <TabsTrigger value="cutlist-generator" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Cutlist
          </TabsTrigger>
          <TabsTrigger value="gcode-generator" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            G-Code
          </TabsTrigger>
          <TabsTrigger value="input-manager" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Input Manager
          </TabsTrigger>
          <TabsTrigger value="file-upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            File Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="3d-editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                3D Floorplan Editor Demo
              </CardTitle>
              <CardDescription>
                Interactive Three.js-based 3D editor with wall creation, camera controls, and GLTF export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Demo3DEditor width={800} height={600} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cabinet-viewer" className="space-y-6">
          <CabinetViewer3D design={cabinetDesign} />
        </TabsContent>

        <TabsContent value="cabinet-design" className="space-y-6">
          <DesignDashboard 
            design={cabinetDesign}
            onUpdateDesign={handleCabinetUpdate}
          />
        </TabsContent>

        <TabsContent value="cost-report" className="space-y-6">
          <CostReport design={cabinetDesign} />
        </TabsContent>

        <TabsContent value="asset-viewer" className="space-y-6">
          <AssetViewer />
        </TabsContent>

        <TabsContent value="model-viewer" className="space-y-6">
          <ModelViewer />
        </TabsContent>

        <TabsContent value="wireframe-viewer" className="space-y-6">
          <WireframeViewer />
        </TabsContent>

        <TabsContent value="nesting-optimizer" className="space-y-6">
          <NestingOptimizer />
        </TabsContent>

        <TabsContent value="catalog-manager" className="space-y-6">
          <CatalogManager />
        </TabsContent>

        <TabsContent value="cutlist-generator" className="space-y-6">
          <CutlistGenerator />
        </TabsContent>

        <TabsContent value="gcode-generator" className="space-y-6">
          <GCodeGenerator />
        </TabsContent>

        <TabsContent value="input-manager" className="space-y-6">
          <DemoInputManager />
        </TabsContent>

        <TabsContent value="file-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Upload Demo
              </CardTitle>
              <CardDescription>
                Test the drag-and-drop file upload functionality with various file types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept="image/*,.pdf,.dxf,.dwg,.json,.txt"
                multiple={true}
                maxFiles={10}
                maxSize={50 * 1024 * 1024}
                onUploadComplete={handleFileUpload}
                onUploadError={handleUploadError}
              />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Uploaded Files:</h4>
                  <div className="grid gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-4 h-4" />
                        ) : file.type.startsWith('text/') ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{file.originalName}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.type} • {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Badge variant="secondary">{file.path}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  3D Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Demo3DEditor</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Three.js-based 3D editor with wall creation and camera controls
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('3d-editor')}>
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Cabinet 3D Viewer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CabinetViewer3D</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Interactive 3D cabinet visualization with React Three Fiber
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('cabinet-viewer')}>
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cabinet Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">DesignDashboard</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete cabinet design interface with templates and controls
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('cabinet-design')}>
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Input Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">DemoInputManager</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Interactive input handling with mouse, keyboard, touch, and gamepad support
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('input-manager')}>
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">FileUpload</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Drag-and-drop file upload with progress tracking and validation
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('file-upload')}>
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Editor Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">FloorPlanBuilder</span>
                  <Badge variant="secondary">Main App</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete floorplan builder with 2D/3D editing and manufacturing
                </p>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                  <Play className="w-4 h-4 mr-2" />
                  Open App
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Utility Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">UI Components</span>
                  <Badge variant="secondary">shadcn/ui</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete set of reusable UI components built with shadcn/ui
                </p>
                <Button variant="outline" size="sm" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  In Development
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About This Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Purpose</h4>
                <p className="text-sm text-muted-foreground">
                  This demo page showcases the various components and features that have been integrated 
                  from the unused files in the CNC cabinet platform. It provides a testing ground for 
                  new functionality before full integration into the main application.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Features Demonstrated</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Three.js 3D editor with wall creation and manipulation</li>
                  <li>• Drag-and-drop file upload with progress tracking</li>
                  <li>• GLTF export functionality for 3D models</li>
                  <li>• Camera controls and viewport management</li>
                  <li>• Component integration and reusability</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technical Stack</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Next.js 15</Badge>
                  <Badge variant="outline">React 19</Badge>
                  <Badge variant="outline">Three.js</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
