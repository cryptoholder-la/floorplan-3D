'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  PenTool, 
  Move,
  Package,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Grid,
  List,
  Layers,
  Box,
  Ruler,
  MousePointer,
  Square,
  Circle,
  Triangle,
  Star,
  TrendingUp,
  FileText,
  Database
} from 'lucide-react';

export default function DesignToolsPage() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const designTools = [
    { id: 'select', name: 'Select Tool', icon: <MousePointer className="w-4 h-4" />, description: 'Select and move objects' },
    { id: 'pen', name: 'Pen Tool', icon: <PenTool className="w-4 h-4" />, description: 'Draw custom shapes' },
    { id: 'line', name: 'Line Tool', icon: <Ruler className="w-4 h-4" />, description: 'Draw straight lines' },
    { id: 'rectangle', name: 'Rectangle Tool', icon: <Square className="w-4 h-4" />, description: 'Draw rectangles' },
    { id: 'circle', name: 'Circle Tool', icon: <Circle className="w-4 h-4" />, description: 'Draw circles' },
    { id: 'triangle', name: 'Triangle Tool', icon: <Triangle className="w-4 h-4" />, description: 'Draw triangles' },
    { id: 'cabinet', name: 'Cabinet Tool', icon: <Box className="w-4 h-4" />, description: 'Add cabinet components' },
    { id: 'hardware', name: 'Hardware Tool', icon: <Settings className="w-4 h-4" />, description: 'Add hardware components' }
  ];

  const recentProjects = [
    {
      id: 'proj-001',
      name: 'Kitchen Design v2',
      type: 'Kitchen',
      lastModified: '2024-01-15',
      status: 'in-progress',
      tools: ['cabinet', 'rectangle', 'hardware']
    },
    {
      id: 'proj-002',
      name: 'Bathroom Layout',
      type: 'Bathroom',
      lastModified: '2024-01-14',
      status: 'completed',
      tools: ['rectangle', 'circle', 'select']
    },
    {
      id: 'proj-003',
      name: 'Office Space',
      type: 'Office',
      lastModified: '2024-01-13',
      status: 'draft',
      tools: ['rectangle', 'line', 'select']
    }
  ];

  const designTemplates = [
    {
      id: 'template-001',
      name: 'Modern Kitchen',
      category: 'Kitchen',
      complexity: 'intermediate',
      components: 24,
      preview: '/templates/kitchen-modern.jpg'
    },
    {
      id: 'template-002',
      name: 'Compact Bathroom',
      category: 'Bathroom',
      complexity: 'easy',
      components: 12,
      preview: '/templates/bathroom-compact.jpg'
    },
    {
      id: 'template-003',
      name: 'Home Office',
      category: 'Office',
      complexity: 'advanced',
      components: 18,
      preview: '/templates/office-home.jpg'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'draft': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'in-progress': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'draft': return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Palette className="w-8 h-8" />
          Design Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional design workspace with advanced drawing and modeling tools
        </p>
      </div>

      {/* Design Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <PenTool className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{designTools.length}</div>
            <div className="text-sm text-muted-foreground">Design Tools</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-yellow-600">{recentProjects.length}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{designTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Tool Usage</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-6">
          <div className="space-y-6">
            {/* Design Tools Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design Tools
                </CardTitle>
                <CardDescription>
                  Select and configure design tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
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

            {/* Design Canvas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Design Canvas
                </CardTitle>
                <CardDescription>
                  Interactive design workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <Palette className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium text-slate-600">Design Canvas</p>
                    <p className="text-sm text-slate-500">Interactive design workspace</p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <Grid className="w-3 h-3 mr-1" />
                        Grid
                      </Button>
                      <Button size="sm" variant="outline">
                        <Layers className="w-3 h-3 mr-1" />
                        Layers
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
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
                  Configure selected tool properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Selected: {designTools.find(t => t.id === selectedTool)?.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {designTools.find(t => t.id === selectedTool)?.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Stroke Width:</span>
                        <span>2px</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span>#000000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opacity:</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                        </div>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{project.name}</h4>
                      
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <div>Last Modified: {project.lastModified}</div>
                        <div>Tools Used: {project.tools.length}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                      </div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.type} • {project.lastModified} • {project.tools.length} tools
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{project.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Design Templates
                </CardTitle>
                <CardDescription>
                  Pre-designed templates for quick start
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-3 flex items-center justify-center border-2 border-dashed border-blue-300">
                          <Star className="w-8 h-8 text-blue-500" />
                        </div>
                        
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div>Category: {template.category}</div>
                          <div>Complexity: {template.complexity}</div>
                          <div>Components: {template.components}</div>
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

        <TabsContent value="components" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Component Library
                </CardTitle>
                <CardDescription>
                  Reusable design components and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Component Library</p>
                  <p className="text-sm text-slate-600">Reusable components coming soon</p>
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
                  Export designs in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Export as PDF</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export Design</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Design</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Custom Export</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Preview</span>
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