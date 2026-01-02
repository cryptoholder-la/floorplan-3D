'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Ruler, 
  Calculator,
  Package,
  TrendingUp,
  FileText,
  Download,
  Eye,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle,
  Layers,
  Move,
  Maximize2
} from 'lucide-react';

export default function AnalysisToolsPage() {
  const [activeTab, setActiveTab] = useState('measurement');
  const [selectedTool, setSelectedTool] = useState<string>('ruler');

  const analysisTools = [
    { 
      id: 'ruler', 
      name: 'Measurement Tool', 
      icon: <Ruler className="w-4 h-4" />,
      description: 'Measure distances and dimensions'
    },
    { 
      id: 'area', 
      name: 'Area Calculator', 
      icon: <Maximize2 className="w-4 h-4" />,
      description: 'Calculate room and surface areas'
    },
    { 
      id: 'volume', 
      name: 'Volume Calculator', 
      icon: <Package className="w-4 h-4" />,
      description: 'Calculate 3D space volumes'
    },
    { 
      id: 'space', 
      name: 'Space Analysis', 
      icon: <Layers className="w-4 h-4" />,
      description: 'Analyze space utilization'
    },
    { 
      id: 'cost', 
      name: 'Cost Estimator', 
      icon: <Calculator className="w-4 h-4" />,
      description: 'Calculate material and labor costs'
    },
    { 
      id: 'move', 
      name: 'Layout Optimizer', 
      icon: <Move className="w-4 h-4" />,
      description: 'Optimize furniture and cabinet placement'
    }
  ];

  const recentAnalyses = [
    {
      id: 'analysis-001',
      name: 'Kitchen Layout Analysis',
      type: 'Space Analysis',
      date: '2024-01-15',
      status: 'completed',
      accuracy: '94%'
    },
    {
      id: 'analysis-002',
      name: 'Material Cost Estimate',
      type: 'Cost Analysis',
      date: '2024-01-14',
      status: 'in-progress',
      accuracy: '87%'
    },
    {
      id: 'analysis-003',
      name: 'Room Dimension Report',
      type: 'Measurement',
      date: '2024-01-13',
      status: 'completed',
      accuracy: '98%'
    }
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
      case 'in-progress': return <Zap className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart className="w-8 h-8" />
          Analysis Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced analysis and measurement tools for floorplan processing and optimization
        </p>
      </div>

      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Ruler className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{analysisTools.length}</div>
            <div className="text-sm text-muted-foreground">Analysis Tools</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {recentAnalyses.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">93%</div>
            <div className="text-sm text-muted-foreground">Avg. Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">1.2s</div>
            <div className="text-sm text-muted-foreground">Avg. Processing</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="measurement">Measurement</TabsTrigger>
          <TabsTrigger value="space">Space Analysis</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="measurement" className="mt-6">
          <div className="space-y-6">
            {/* Measurement Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Measurement Tools
                </CardTitle>
                <CardDescription>
                  Select and configure measurement analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisTools.filter(tool => ['ruler', 'area', 'volume'].includes(tool.id)).map((tool) => (
                    <Card 
                      key={tool.id} 
                      className={`cursor-pointer transition-all ${
                        selectedTool === tool.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {tool.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          Use Tool
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Measurement Canvas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  Measurement Canvas
                </CardTitle>
                <CardDescription>
                  Interactive measurement workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <Ruler className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-lg font-medium text-slate-600">Measurement Workspace</p>
                    <p className="text-sm text-slate-500">Click and drag to measure distances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="space" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Space Analysis Tools
                </CardTitle>
                <CardDescription>
                  Analyze room layouts and optimize space utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisTools.filter(tool => ['space', 'move'].includes(tool.id)).map((tool) => (
                    <Card key={tool.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            {tool.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          Launch Tool
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Space Utilization Report
                </CardTitle>
                <CardDescription>
                  Current space analysis results and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Layers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Space Analysis Results</p>
                  <p className="text-sm text-slate-600">Detailed utilization metrics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Cost Analysis Tools
                </CardTitle>
                <CardDescription>
                  Calculate material costs and project budgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Material Costs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plywood:</span>
                        <span>$450</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hardware:</span>
                        <span>$125</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Finishing:</span>
                        <span>$85</span>
                      </div>
                      <div className="border-t pt-2 font-semibold">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>$660</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Labor Costs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fabrication:</span>
                        <span>$320</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Installation:</span>
                        <span>$180</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Finishing:</span>
                        <span>$95</span>
                      </div>
                      <div className="border-t pt-2 font-semibold">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>$595</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Project Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Materials:</span>
                        <span>$660</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span>$595</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contingency:</span>
                        <span>$125</span>
                      </div>
                      <div className="border-t pt-2 font-semibold">
                        <div className="flex justify-between">
                          <span>Grand Total:</span>
                          <span>$1,380</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Analysis Reports
                </CardTitle>
                <CardDescription>
                  Recent analysis results and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(analysis.status)}>
                          {getStatusIcon(analysis.status)}
                        </div>
                        <div>
                          <div className="font-medium">{analysis.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.type} • {analysis.date} • Accuracy: {analysis.accuracy}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{analysis.status}</Badge>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
                <CardDescription>
                  Export analysis results in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Export as PDF</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Generate Report</span>
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