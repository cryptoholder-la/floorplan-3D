'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Scissors, 
  Calculator,
  FileText,
  Download,
  Upload,
  Settings,
  Zap,
  Grid,
  List,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ruler,
  Layers,
  Eye,
  Database
} from 'lucide-react';

export default function CutlistPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const cutlistProjects = [
    {
      id: 'project-001',
      name: 'Kitchen Cabinet Set - 24"',
      status: 'completed',
      pieces: 24,
      material: 'Birch Plywood',
      totalArea: '48 sq ft',
      waste: '12%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'project-002',
      name: 'Wall Cabinet Assembly',
      status: 'in-progress',
      pieces: 18,
      material: 'Maple',
      totalArea: '32 sq ft',
      waste: '8%',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'project-003',
      name: 'Custom Drawer Boxes',
      status: 'pending',
      pieces: 36,
      material: 'Pine',
      totalArea: '28 sq ft',
      waste: '15%',
      lastUpdated: '2024-01-13'
    }
  ];

  const materialInventory = [
    { id: 'mat-001', name: 'Birch Plywood', thickness: '3/4"', quantity: 12, unit: 'sheets', location: 'Warehouse A' },
    { id: 'mat-002', name: 'Maple', thickness: '1/2"', quantity: 8, unit: 'sheets', location: 'Warehouse B' },
    { id: 'mat-003', name: 'Pine', thickness: '1/4"', quantity: 15, unit: 'sheets', location: 'Warehouse A' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Scissors className="w-8 h-8" />
          Cutlist Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced cutlist generation, optimization, and material management
        </p>
      </div>

      {/* Cutlist Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{cutlistProjects.length}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {cutlistProjects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">11%</div>
            <div className="text-sm text-muted-foreground">Avg. Waste</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">2.3s</div>
            <div className="text-sm text-muted-foreground">Optimization Time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Projects
                  </CardTitle>
                  <CardDescription>
                    Latest cutlist projects and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cutlistProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                          </div>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.pieces} pieces • {project.material}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{project.waste} waste</div>
                          <div className="text-xs text-muted-foreground">{project.lastUpdated}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Material Inventory
                  </CardTitle>
                  <CardDescription>
                    Current material stock levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materialInventory.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.thickness} • {material.location}
                          </div>
                        </div>
                        <Badge variant={material.quantity > 10 ? 'default' : 'secondary'}>
                          {material.quantity} {material.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Cutlist Projects</h3>
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
                {cutlistProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                        </div>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{project.name}</h4>
                      
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <div>Pieces: {project.pieces}</div>
                        <div>Material: {project.material}</div>
                        <div>Total Area: {project.totalArea}</div>
                        <div>Waste: {project.waste}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
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
                {cutlistProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                      </div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.pieces} pieces • {project.material} • {project.totalArea} • {project.waste} waste
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

        <TabsContent value="materials" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Material Management
                </CardTitle>
                <CardDescription>
                  Track and manage material inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materialInventory.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Layers className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.thickness} • {material.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={material.quantity > 10 ? 'default' : 'secondary'}>
                          {material.quantity} {material.unit}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Cutlist Optimization
                </CardTitle>
                <CardDescription>
                  Advanced algorithms for material optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Optimization Engine</p>
                  <p className="text-sm text-slate-600">Advanced cutlist optimization coming soon</p>
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
                  Export cutlists in various formats
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
                    <span>Export Cutlist</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Cutlist</span>
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
