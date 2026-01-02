'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Wrench, 
  Target,
  Package,
  Eye,
  Download,
  Upload,
  Settings,
  Grid,
  List,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ruler,
  Layers,
  Calculator,
  FileText,
  Database,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function DrillingPage() {
  const [activeTab, setActiveTab] = useState('patterns');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const drillingPatterns = [
    {
      id: 'pattern-001',
      name: 'Standard Cabinet Holes',
      type: 'cabinet',
      holes: 24,
      diameter: '3mm',
      spacing: '32mm',
      lastUsed: '2024-01-15',
      status: 'active'
    },
    {
      id: 'pattern-002',
      name: 'Drawer Pull Template',
      type: 'drawer',
      holes: 2,
      diameter: '5mm',
      spacing: '128mm',
      lastUsed: '2024-01-14',
      status: 'active'
    },
    {
      id: 'pattern-003',
      name: 'Hinge Mounting Pattern',
      type: 'hardware',
      holes: 6,
      diameter: '2.5mm',
      spacing: '35mm',
      lastUsed: '2024-01-13',
      status: 'draft'
    }
  ];

  const drillingJobs = [
    {
      id: 'job-001',
      name: 'Kitchen Cabinet Set',
      status: 'completed',
      progress: 100,
      holes: 156,
      time: '45 min',
      accuracy: '99.2%'
    },
    {
      id: 'job-002',
      name: 'Wall Cabinet Assembly',
      status: 'in-progress',
      progress: 65,
      holes: 89,
      time: '28 min',
      accuracy: '98.7%'
    },
    {
      id: 'job-003',
      name: 'Custom Drawer Boxes',
      status: 'queued',
      progress: 0,
      holes: 48,
      time: '15 min',
      accuracy: 'N/A'
    }
  ];

  const bitInventory = [
    { id: 'bit-001', type: 'Forstner', size: '3mm', quantity: 12, condition: 'good' },
    { id: 'bit-002', type: 'Forstner', size: '5mm', quantity: 8, condition: 'good' },
    { id: 'bit-003', type: 'Spade', size: '2.5mm', quantity: 15, condition: 'worn' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'queued': return 'text-gray-600';
      case 'draft': return 'text-orange-600';
      case 'active': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'queued': return <AlertTriangle className="w-4 h-4" />;
      case 'draft': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStartJob = (jobId: string) => {
    setIsRunning(true);
    // Simulate drilling process
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Wrench className="w-8 h-8" />
          Drilling Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced drilling patterns, CNC control, and precision hole placement
        </p>
      </div>

      {/* Drilling Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{drillingPatterns.length}</div>
            <div className="text-sm text-muted-foreground">Patterns</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {drillingJobs.filter(job => job.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Jobs</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">98.9%</div>
            <div className="text-sm text-muted-foreground">Avg. Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">29 min</div>
            <div className="text-sm text-muted-foreground">Avg. Time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="cnc">CNC Control</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Drilling Patterns</h3>
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
                {drillingPatterns.map((pattern) => (
                  <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={getStatusColor(pattern.status)}>
                          {getStatusIcon(pattern.status)}
                        </div>
                        <Badge variant="outline">{pattern.type}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{pattern.name}</h4>
                      
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <div>Holes: {pattern.holes}</div>
                        <div>Diameter: {pattern.diameter}</div>
                        <div>Spacing: {pattern.spacing}</div>
                        <div>Last Used: {pattern.lastUsed}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Target className="w-3 h-3 mr-1" />
                          Use Pattern
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {drillingPatterns.map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(pattern.status)}>
                        {getStatusIcon(pattern.status)}
                      </div>
                      <div>
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pattern.holes} holes • {pattern.diameter} • {pattern.spacing} • {pattern.lastUsed}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pattern.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm">
                        <Target className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Drilling Jobs
                </CardTitle>
                <CardDescription>
                  Active and completed drilling jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drillingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(job.status)}>
                          {getStatusIcon(job.status)}
                        </div>
                        <div>
                          <div className="font-medium">{job.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.holes} holes • {job.time} • Accuracy: {job.accuracy}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{job.progress}%</div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStartJob(job.id)}
                            disabled={isRunning || job.status === 'completed'}
                          >
                            {isRunning && selectedPattern === job.id ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cnc" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  CNC Control Panel
                </CardTitle>
                <CardDescription>
                  Real-time CNC drilling machine control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Machine Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">CNC Drill - Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Spindle - Warming Up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">Vacuum - Offline</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Start Job
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Operation</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Drilling Cabinet Holes</span>
                        <Badge variant="outline">65%</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Estimated completion: 15 min
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Bit Inventory
                </CardTitle>
                <CardDescription>
                  Track and manage drilling bit inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bitInventory.map((bit) => (
                    <div key={bit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{bit.type} Bit</div>
                          <div className="text-sm text-muted-foreground">
                            {bit.size} • {bit.condition}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={bit.quantity > 10 ? 'default' : 'secondary'}>
                          {bit.quantity} in stock
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

        <TabsContent value="export" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
                <CardDescription>
                  Export drilling patterns and job data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Export Patterns</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export Jobs</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Pattern</span>
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
