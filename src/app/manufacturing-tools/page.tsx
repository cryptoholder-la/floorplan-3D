'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Zap, 
  Package,
  Truck,
  Calculator,
  FileText,
  Download,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function ManufacturingToolsPage() {
  const [activeTab, setActiveTab] = useState('cnc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const manufacturingJobs = [
    {
      id: 'job-001',
      name: 'Kitchen Cabinet Set - 24"',
      status: 'processing',
      progress: 65,
      estimatedTime: '4h 30m',
      materials: 'Birch Plywood',
      quantity: 12
    },
    {
      id: 'job-002', 
      name: 'Wall Cabinet Assembly',
      status: 'queued',
      progress: 0,
      estimatedTime: '2h 15m',
      materials: 'MDF',
      quantity: 8
    },
    {
      id: 'job-003',
      name: 'Custom Drawer Boxes',
      status: 'completed',
      progress: 100,
      estimatedTime: '1h 45m',
      materials: 'Pine',
      quantity: 24
    }
  ];

  const handleStartJob = (jobId: string) => {
    setSelectedJob(jobId);
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedJob(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-600';
      case 'queued': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'queued': return <AlertTriangle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Manufacturing Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced CNC manufacturing, workflow management, and production optimization
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-muted-foreground">Efficiency Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">6.5h</div>
            <div className="text-sm text-muted-foreground">Avg. Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">12%</div>
            <div className="text-sm text-muted-foreground">Yield Improvement</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cnc">CNC Control</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="cnc" className="mt-6">
          <div className="space-y-6">
            {/* CNC Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  CNC Control Panel
                </CardTitle>
                <CardDescription>
                  Real-time CNC machine control and monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Machine Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">CNC Router - Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Laser Cutter - Warming Up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">3D Printer - Offline</span>
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
                        <span className="font-medium">Cutting Cabinet Panels</span>
                        <Badge variant="outline">65%</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Estimated completion: 1h 45m
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Queue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Manufacturing Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {manufacturingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(job.status)}>
                          {getStatusIcon(job.status)}
                        </div>
                        <div>
                          <div className="font-medium">{job.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.materials} • {job.quantity} units • {job.estimatedTime}
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
                        <Button 
                          size="sm" 
                          onClick={() => handleStartJob(job.id)}
                          disabled={isProcessing}
                        >
                          {selectedJob === job.id ? 'Processing...' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Production Workflow
                </CardTitle>
                <CardDescription>
                  End-to-end manufacturing workflow management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Workflow Management</p>
                  <p className="text-sm text-slate-600">Advanced workflow automation coming soon</p>
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
                  Production Optimization
                </CardTitle>
                <CardDescription>
                  AI-powered material optimization and cost reduction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Optimization Engine</p>
                  <p className="text-sm text-slate-600">Advanced optimization algorithms coming soon</p>
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
                  Manufacturing Reports
                </CardTitle>
                <CardDescription>
                  Comprehensive production analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="w-6 h-6 mb-2" />
                      <span>Production Report</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calculator className="w-6 h-6 mb-2" />
                      <span>Cost Analysis</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <TrendingUp className="w-6 h-6 mb-2" />
                      <span>Efficiency Metrics</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}