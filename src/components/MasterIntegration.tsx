import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { masterIntegrationSystem, MasterWorkflow, MasterCapability, IntegratedProject } from '@/lib/master-integration';
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
  Settings as Tool,
  FileText,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Bot,
  ArrowRight,
  Star,
  Star as Sparkles
} from 'lucide-react';

export function MasterIntegration() {
  const [activeView, setActiveView] = useState<'overview' | 'capabilities' | 'workflows' | 'projects'>('overview');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [projects, setProjects] = useState<IntegratedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    const status = masterIntegrationSystem.getSystemStatus();
    const allProjects = masterIntegrationSystem.getAllProjects();
    
    setSystemStatus(status);
    setProjects(Object.values(allProjects));
  };

  const createNewProject = async (type: 'kitchen' | 'bathroom' | 'office' | 'custom') => {
    try {
      const project = await masterIntegrationSystem.createProject(`New ${type} Project`, type);
      loadSystemData();
      setSelectedProject(project.id);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    setExecutingWorkflow(workflowId);
    try {
      const results = await masterIntegrationSystem.executeWorkflow(workflowId, selectedProject || undefined);
      console.log('Workflow completed:', results);
      loadSystemData();
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setExecutingWorkflow(null);
    }
  };

  const capabilities = masterIntegrationSystem.getCapabilities();
  const workflows = masterIntegrationSystem.getWorkflows();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.capabilities?.total || 0}</div>
                <div className="text-sm text-gray-600">Total Capabilities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.workflows?.total || 0}</div>
                <div className="text-sm text-gray-600">Master Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.projects?.total || 0}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{systemStatus?.capabilities?.active || 0}</div>
                <div className="text-sm text-gray-600">Active Modules</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => createNewProject('kitchen')}
              className="h-auto p-4 flex flex-col items-center"
            >
              <Package className="w-6 h-6 mb-2" />
              <span className="text-xs">Kitchen Project</span>
            </Button>
            
            <Button
              onClick={() => createNewProject('bathroom')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center"
            >
              <Tool className="w-6 h-6 mb-2" />
              <span className="text-xs">Bathroom Project</span>
            </Button>
            
            <Button
              onClick={() => createNewProject('office')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center"
            >
              <Grid className="w-6 h-6 mb-2" />
              <span className="text-xs">Office Project</span>
            </Button>
            
            <Button
              onClick={() => createNewProject('custom')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-xs">Custom Project</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCapabilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map(capability => (
          <Card key={capability.id} className={`${
            capability.status === 'active' ? 'border-green-200 dark:border-green-800' :
            capability.status === 'developing' ? 'border-yellow-200 dark:border-yellow-800' :
            'border-gray-200 dark:border-gray-700'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  capability.category === 'ai' ? 'bg-blue-100 dark:bg-blue-900' :
                  capability.category === 'design' ? 'bg-green-100 dark:bg-green-900' :
                  capability.category === 'manufacturing' ? 'bg-orange-100 dark:bg-orange-900' :
                  capability.category === 'visualization' ? 'bg-purple-100 dark:bg-purple-900' :
                  'bg-gray-100 dark:bg-gray-900'
                }`}>
                  {capability.category === 'ai' && <Zap className="w-4 h-4 text-blue-600" />}
                  {capability.category === 'design' && <Layers className="w-4 h-4 text-green-600" />}
                  {capability.category === 'manufacturing' && <Tool className="w-4 h-4 text-orange-600" />}
                  {capability.category === 'visualization' && <Eye className="w-4 h-4 text-purple-600" />}
                  {capability.category === 'integration' && <Zap className="w-4 h-4 text-gray-600" />}
                </div>
                <div>
                  <div className="font-bold">{capability.name}</div>
                  <div className="text-sm text-gray-600">{capability.module}</div>
                </div>
                <Badge variant={capability.status === 'active' ? 'default' : 'secondary'}>
                  {capability.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{capability.description}</p>
                
                <div>
                  <div className="font-medium text-sm mb-2">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {capability.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-sm mb-2">Integrations:</div>
                  <div className="flex flex-wrap gap-1">
                    {capability.integrations.map(integration => (
                      <Badge key={integration} variant="outline" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <Card key={workflow.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {workflow.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{workflow.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{Math.round(workflow.successRate * 100)}% success</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{Math.round(workflow.estimatedDuration / 1000)}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span>{workflow.steps.length} steps</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-sm">Workflow Steps:</div>
                  <div className="space-y-1">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{step.name}</div>
                          <div className="text-xs text-gray-500">
                            {step.module} • {Math.round((step.parameters?.estimatedDuration || 0) / 1000)}s
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {step.module}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => executeWorkflow(workflow.id)}
                  disabled={executingWorkflow === workflow.id}
                  className="w-full"
                >
                  {executingWorkflow === workflow.id ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Workflow
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button onClick={() => createNewProject('custom')}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card 
            key={project.id} 
            className={`cursor-pointer transition-colors ${
              selectedProject === project.id ? 'border-blue-200 dark:border-blue-800' : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedProject(project.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{project.type}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(project.metadata.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-bold">{project.cabinets.length}</div>
                    <div className="text-gray-500">Cabinets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{project.templates.length}</div>
                    <div className="text-gray-500">Templates</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Updated: {new Date(project.metadata.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="w-10 h-10 text-blue-400" />
            Master Integration System
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Complete Integration
            </Badge>
          </h1>
          <p className="text-gray-400">
            Complete integration of all abilities from floorplan 3D, memlayer-main, 10_10 design system, and blueprint-3d-roadmap
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2"
          >
            <BarChart className="w-4 h-4" />
            Overview
          </Button>
          <Button
            variant={activeView === 'capabilities' ? 'default' : 'outline'}
            onClick={() => setActiveView('capabilities')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Capabilities
          </Button>
          <Button
            variant={activeView === 'workflows' ? 'default' : 'outline'}
            onClick={() => setActiveView('workflows')}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Workflows
          </Button>
          <Button
            variant={activeView === 'projects' ? 'default' : 'outline'}
            onClick={() => setActiveView('projects')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Projects
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'capabilities' && renderCapabilities()}
          {activeView === 'workflows' && renderWorkflows()}
          {activeView === 'projects' && renderProjects()}
        </div>

        {/* Status Bar */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="default">
                  <Bot className="w-3 h-3 mr-1" />
                  Master System: Active
                </Badge>
                <Badge variant="outline">
                  <Zap className="w-3 h-3 mr-1" />
                  {systemStatus?.capabilities?.active || 0} Modules
                </Badge>
                <Badge variant="outline">
                  <Target className="w-3 h-3 mr-1" />
                  {systemStatus?.workflows?.total || 0} Workflows
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Master Integration System v1.0 • Complete System Integration • All Modules Active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
