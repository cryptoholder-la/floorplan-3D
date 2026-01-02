'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  Activity,
  Layers,
  Target,
  Settings,
  Play,
  Pause,
  RotateCcw,
  BarChart,
  Eye,
  EyeOff,
  Plus,
  Grid,
  Package,
  Camera,
  FileText,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Database,
  Sync,
  Cpu,
  Globe,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'error';
  progress: number;
  startTime: string;
  endTime?: string;
  type: 'import' | 'export' | 'sync' | 'analysis' | 'generation';
  itemsProcessed?: number;
  totalItems?: number;
}

interface Integration {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataCount?: number;
}

export default function IntegrationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  useEffect(() => {
    // Mock data
    setWorkflows([
      {
        id: '1',
        name: 'Cabinet Catalog Import',
        status: 'completed',
        progress: 100,
        startTime: '2026-01-01T10:00:00Z',
        endTime: '2026-01-01T10:15:00Z',
        type: 'import',
        itemsProcessed: 285,
        totalItems: 285
      },
      {
        id: '2',
        name: 'Hardware Sync',
        status: 'active',
        progress: 65,
        startTime: '2026-01-01T10:30:00Z',
        type: 'sync',
        itemsProcessed: 130,
        totalItems: 200
      },
      {
        id: '3',
        name: 'Cutlist Generation',
        status: 'paused',
        progress: 35,
        startTime: '2026-01-01T11:00:00Z',
        type: 'generation',
        itemsProcessed: 7,
        totalItems: 20
      }
    ]);

    setIntegrations([
      {
        id: '1',
        name: 'Local Database',
        type: 'database',
        status: 'connected',
        lastSync: '2026-01-01T12:00:00Z',
        dataCount: 1250
      },
      {
        id: '2',
        name: 'Blum API',
        type: 'api',
        status: 'connected',
        lastSync: '2026-01-01T11:30:00Z',
        dataCount: 450
      },
      {
        id: '3',
        name: 'Cloud Storage',
        type: 'cloud',
        status: 'error',
        lastSync: '2025-12-31T23:00:00Z'
      }
    ]);
  }, []);

  const startWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'active', progress: 0, startTime: new Date().toISOString() }
        : w
    ));
  };

  const pauseWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'paused' }
        : w
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Master Integration System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Active Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map(workflow => (
                <div 
                  key={workflow.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedWorkflow === workflow.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <Badge variant="outline">{workflow.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workflow.status)}
                      <span className="text-sm text-gray-600">{workflow.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${workflow.progress}%` }}
                          />
                        </div>
                        <span>{workflow.progress}%</span>
                      </div>
                    </div>
                    
                    {workflow.itemsProcessed && (
                      <div className="flex justify-between text-sm">
                        <span>Items:</span>
                        <span>{workflow.itemsProcessed} / {workflow.totalItems}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Started:</span>
                      <span>{new Date(workflow.startTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {workflow.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => pauseWorkflow(workflow.id)}>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {workflow.status === 'paused' && (
                      <Button size="sm" onClick={() => startWorkflow(workflow.id)}>
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restart
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
              <Layers className="w-5 h-5" />
              System Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map(integration => (
                <div key={integration.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' :
                        integration.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <h4 className="font-semibold">{integration.name}</h4>
                      <Badge variant="outline">{integration.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === 'connected' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : integration.status === 'error' ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span>{new Date(integration.lastSync).toLocaleString()}</span>
                    </div>
                    
                    {integration.dataCount && (
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-semibold">{integration.dataCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Sync className="w-4 h-4 mr-1" />
                      Sync Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Full Sync
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Integration Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Workflows:</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Connected Systems:</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span>Total Records:</span>
                <span className="font-semibold">1,700</span>
              </div>
              <div className="flex justify-between">
                <span>Sync Status:</span>
                <span className="font-semibold text-green-600">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database:</span>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services:</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cloud Sync:</span>
                <Badge className="bg-red-500">Error</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup:</span>
                <span className="text-sm">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
