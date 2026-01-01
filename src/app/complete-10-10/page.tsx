import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button-simple';
import { Badge } from '@/ui/badge-simple';
import { completeTenTenSystem, AgentTask, CabinetItem } from '@/lib/10_10-complete';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Settings, 
  Eye, 
  Box, 
  Wrench,
  Home,
  Package,
  FileText,
  Upload,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  Layers,
  Target,
  Ruler,
  Grid,
  Layout,
  Database,
  Cpu,
  Hammer,
  FileText as FileTextIcon
} from 'lucide-react';

// Import complete 10_10 components
import { CompletePhoto2Plan } from '@/components/CompletePhoto2Plan';
import { CompleteInventoryManager } from '@/components/CompleteInventoryManager';
import { CompleteDrillingPatterns } from '@/components/CompleteDrillingPatterns';
import { CompleteTemplateMaker } from '@/components/CompleteTemplateMaker';
import { Status } from '@/types';

export default function CompleteTenTenPage() {
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [cabinets, setCabinets] = useState<CabinetItem[]>([]);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Initialize complete 10_10 system
  useEffect(() => {
    completeTenTenSystem.init();
    
    // Subscribe to agent updates
    const unsubscribe = completeTenTenSystem.agents.subscribe((tasks) => {
      setAgentTasks(tasks);
    });

    // Load initial data
    loadInitialData();
    updateSystemStatus();

    return unsubscribe;
  }, []);

  const loadInitialData = () => {
    // Create sample cabinets from the complete inventory
    const templates = completeTenTenSystem.cabinets.getTemplates();
    const sampleCabinets = templates.slice(0, 5).map(template => 
      completeTenTenSystem.cabinets.createCabinet(template)
    );
    
    setCabinets(sampleCabinets);
    
    // Add sample agent tasks
    completeTenTenSystem.agents.addTask({
      type: 'nkba_check',
      agent: 'nkba',
      payload: { cabinets: sampleCabinets }
    });
    
    completeTenTenSystem.agents.addTask({
      type: 'optimization',
      agent: 'optimization',
      payload: { target: 'material_usage' }
    });
    
    completeTenTenSystem.agents.addTask({
      type: 'design_validation',
      agent: 'validation',
      payload: { source: 'complete_system' }
    });
  };

  const updateSystemStatus = () => {
    const status = completeTenTenSystem.getStatus();
    setSystemStatus(status);
  };

  const handleAddCabinet = (templateId: string) => {
    try {
      const newCabinet = completeTenTenSystem.cabinets.createCabinet(templateId);
      setCabinets(prev => [...prev, newCabinet]);
      
      completeTenTenSystem.agents.addTask({
        type: 'cabinet_added',
        agent: 'inventory',
        payload: { cabinet: newCabinet }
      });
    } catch (error) {
      console.error('Failed to create cabinet:', error);
    }
  };

  const activeTasks = agentTasks.filter(t => t.status === 'running');
  const recentTasks = agentTasks.slice(-10).reverse();

  const modules = [
    {
      id: 'dashboard',
      title: 'System Dashboard',
      icon: Activity,
      description: 'Complete system overview and monitoring',
      component: null
    },
    {
      id: 'photo2plan',
      title: 'Photo2Plan Scanner',
      icon: Camera,
      description: 'AI-powered floorplan scanning from images',
      component: CompletePhoto2Plan
    },
    {
      id: 'inventory',
      title: 'Inventory Manager',
      icon: Database,
      description: 'Complete cabinet inventory management',
      component: CompleteInventoryManager
    },
    {
      id: 'drilling',
      title: 'Drilling Patterns',
      icon: Target,
      description: '32mm system drilling patterns',
      component: CompleteDrillingPatterns
    },
    {
      id: 'templates',
      title: 'Template Maker',
      icon: Layout,
      description: 'Custom cabinet template creation',
      component: CompleteTemplateMaker
    }
  ];

  const renderSystemDashboard = () => (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.agents?.active || 0}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.cabinets?.total || 0}</div>
                <div className="text-sm text-gray-600">Total Cabinets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.drilling?.presets || 0}</div>
                <div className="text-sm text-gray-600">Drilling Presets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Layers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.templates?.parts || 0}</div>
                <div className="text-sm text-gray-600">Template Parts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent System Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Agent System Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant={isSystemRunning ? "outline" : "default"}
                onClick={() => setIsSystemRunning(!isSystemRunning)}
              >
                {isSystemRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSystemRunning ? 'Pause System' : 'Start System'}
              </Button>
              <Button onClick={updateSystemStatus} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    {task.status === 'running' && <Clock className="w-4 h-4 text-yellow-500" />}
                    {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {task.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                    {task.status === 'queued' && <Clock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{task.type}</div>
                    <div className="text-sm text-gray-500">{task.agent}</div>
                  </div>
                  {task.duration && (
                    <div className="text-sm text-gray-500">
                      {task.duration.toFixed(0)}ms
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={() => handleAddCabinet('Base_D24_Standard')} className="h-auto p-4 flex flex-col items-center">
              <Box className="w-8 h-8 mb-2" />
              <span>Add Base Cabinet</span>
            </Button>
            <Button onClick={() => handleAddCabinet('Wall_H30_D12_Standard')} variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Layers className="w-8 h-8 mb-2" />
              <span>Add Wall Cabinet</span>
            </Button>
            <Button onClick={() => setActiveModule('photo2plan')} variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Camera className="w-8 h-8 mb-2" />
              <span>Scan Floorplan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveModule = () => {
    const module = modules.find(m => m.id === activeModule);
    if (!module || !module.component) return null;
    
    const Component = module.component;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Complete 10_10 Design System
          </h1>
          <p className="text-gray-400">
            Full migration of all 10_10 abilities with advanced AI integration
          </p>
        </div>

        {/* Module Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {modules.map(module => (
            <Button
              key={module.id}
              variant={activeModule === module ? 'default' : 'outline'}
              onClick={() => setActiveModule(module.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <module.icon className="w-4 h-4" />
              {module.title}
            </Button>
          ))}
        </div>

        {/* Module Content */}
        <div className="space-y-6">
          {activeModule === 'dashboard' && renderSystemDashboard()}
          {activeModule !== 'dashboard' && renderActiveModule()}
        </div>

        {/* System Status Bar */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={isSystemRunning ? "default" : "secondary"}>
                System: {isSystemRunning ? 'Running' : 'Paused'}
              </Badge>
              <Badge variant="outline">
                Agents: {activeTasks.length} active
              </Badge>
              <Badge variant="outline">
                Cabinets: {cabinets.length}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              Complete 10_10 Design System v3.0 • Full Migration • AI Integration Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
