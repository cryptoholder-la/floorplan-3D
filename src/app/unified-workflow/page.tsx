import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-simple';
import { Badge } from '@/components/ui/badge-simple';
import { completeTenTenSystem, selfLearningSystem } from '@/lib/unified-workflow';
import { UnifiedWorkflow } from '@/components/10_10/UnifiedWorkflow';
import { CompletePhoto2Plan } from '@/components/10_10/CompletePhoto2Plan';
import { CompleteInventoryManager } from '@/components/10_10/CompleteInventoryManager';
import { CompleteDrillingPatterns } from '@/components/10_10/CompleteDrillingPatterns';
import { CompleteTemplateMaker } from '@/components/10_10/CompleteTemplateMaker';
import {
  Brain,
  Zap,
  Activity,
  Layers,
  Camera,
  Package,
  Target,
  Drill,
  FileText,
  Settings,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Bot,
  BarChart3,
  Eye,
  Grid
} from 'lucide-react';

export default function UnifiedWorkflowPage() {
  const [activeView, setActiveView] = useState<'unified' | 'modules' | 'analytics'>('unified');
  const [systemStats, setSystemStats] = useState<any>(null);
  const [learningStats, setLearningStats] = useState<any>(null);
  const [userId] = useState('user_' + Date.now());

  useEffect(() => {
    loadSystemStats();
    loadLearningStats();
  }, []);

  const loadSystemStats = () => {
    const stats = completeTenTenSystem.getStatus();
    setSystemStats(stats);
  };

  const loadLearningStats = () => {
    const insights = selfLearningSystem.getLearningInsights(userId);
    setLearningStats(insights);
  };

  const modules = [
    {
      id: 'photo2plan',
      name: 'Photo2Plan Scanner',
      icon: Camera,
      description: 'AI-powered floorplan scanning from images',
      color: 'bg-blue-500',
      stats: {
        scans: learningStats?.totalActions || 0,
        success: Math.round((learningStats?.successRate || 0) * 100),
        avgTime: Math.round((learningStats?.averageDuration || 0) / 1000)
      }
    },
    {
      id: 'inventory',
      name: 'Inventory Manager',
      icon: Package,
      description: 'Complete cabinet inventory management',
      color: 'bg-green-500',
      stats: {
        cabinets: systemStats?.cabinets?.total || 0,
        templates: systemStats?.cabinets?.templates || 0,
        categories: 6
      }
    },
    {
      id: 'drilling',
      name: 'Drilling Patterns',
      icon: Drill,
      description: '32mm system drilling patterns',
      color: 'bg-orange-500',
      stats: {
        presets: systemStats?.drilling?.presets || 0,
        patterns: 5,
        holes: 'Unlimited'
      }
    },
    {
      id: 'templates',
      name: 'Template Maker',
      icon: Layers,
      description: 'Custom cabinet template creation',
      color: 'bg-purple-500',
      stats: {
        parts: systemStats?.templates?.parts || 0,
        templates: learningStats?.preferences?.length || 0,
        custom: 'Unlimited'
      }
    },
    {
      id: 'cnc',
      name: 'CNC Generator',
      icon: FileText,
      description: 'Manufacturing cutlist generation',
      color: 'bg-red-500',
      stats: {
        cutlists: 0,
        formats: ['JSON', 'CSV', 'DXF'],
        optimization: 'Advanced'
      }
    }
  ];

  const renderUnifiedView = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-600">Integrated Modules</div>
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
                <div className="text-2xl font-bold">{systemStats?.agents?.active || 0}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round((learningStats?.successRate || 0) * 100)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round((learningStats?.averageDuration || 0) / 1000)}s</div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unified Workflow Component */}
      <UnifiedWorkflow />
    </div>
  );

  const renderModulesView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">{module.name}</div>
                  <div className="text-sm text-gray-600">{module.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-bold">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      // Navigate to specific module
                      window.location.href = `/complete-10-10#${module.id}`;
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open Module
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Quick action for module
                      console.log(`Quick action for ${module.id}`);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Learning Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learningStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {learningStats.totalActions}
                    </div>
                    <div className="text-sm text-gray-600">Total Actions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(learningStats.successRate * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div>
                  <div className="font-medium mb-2">Top Preferences</div>
                  <div className="space-y-2">
                    {learningStats.preferences?.slice(0, 5).map((pref: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{pref.category}</span>
                        <Badge variant="outline">{pref.frequency} uses</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No learning data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {systemStats.agents?.total || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Agents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {systemStats.cabinets?.total || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Cabinets</div>
                  </div>
                </div>

                <div>
                  <div className="font-medium mb-2">Module Status</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm">Photo2Plan Scanner</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm">Inventory Manager</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm">Drilling Patterns</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm">Template Maker</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm">CNC Generator</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No system data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            Unified Workflow System
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Self-Learning
            </Badge>
          </h1>
          <p className="text-gray-400">
            Complete integration of all 5 modules with intelligent automation and learning capabilities
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeView === 'unified' ? 'default' : 'outline'}
            onClick={() => setActiveView('unified')}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Unified Workflow
          </Button>
          <Button
            variant={activeView === 'modules' ? 'default' : 'outline'}
            onClick={() => setActiveView('modules')}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            Individual Modules
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveView('analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'unified' && renderUnifiedView()}
          {activeView === 'modules' && renderModulesView()}
          {activeView === 'analytics' && renderAnalyticsView()}
        </div>

        {/* Status Bar */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="default">
                  <Bot className="w-3 h-3 mr-1" />
                  AI System: Active
                </Badge>
                <Badge variant="outline">
                  <Brain className="w-3 h-3 mr-1" />
                  Self-Learning: Enabled
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  User: {userId.slice(-8)}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Unified Workflow System v2.0 • 5 Modules Integrated • Intelligent Automation Active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
