import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button-simple';
import { Badge } from '@/ui/badge-simple';
import { selfLearningSystem, WorkflowPattern, IntelligentRecommendation, LearningData } from '@/lib/unified-workflow';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Layers,
  Camera,
  Package,
  Settings as Drill,
  FileText,
  ChevronRight,
  Star,
  BarChart,
  User,
  Bot,
  Star as Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export function UnifiedWorkflow() {
  const [userId] = useState('user_' + Date.now());
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflowResults, setWorkflowResults] = useState<any>(null);
  const [showLearning, setShowLearning] = useState(true);
  const [recommendations, setRecommendations] = useState<IntelligentRecommendation[]>([]);
  const [learningInsights, setLearningInsights] = useState<any>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  useEffect(() => {
    loadUserState();
  }, [userId]);

  const loadUserState = () => {
    const userRecommendations = selfLearningSystem.getRecommendations(userId);
    const insights = selfLearningSystem.getLearningInsights(userId);
    
    setRecommendations(userRecommendations);
    setLearningInsights(insights);
  };

  const executeWorkflow = async (workflowId: string) => {
    setIsExecuting(true);
    setActiveWorkflow(workflowId);
    setExecutionLog([]);
    setWorkflowResults(null);

    try {
      const log = (message: string) => {
        setExecutionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
      };

      log(`🚀 Starting workflow: ${workflowId}`);
      
      const results = await selfLearningSystem.executeWorkflow(workflowId, userId, {
        logExecution: true
      });
      
      log(`✅ Workflow completed successfully`);
      setWorkflowResults(results);
      
      // Reload recommendations and insights
      loadUserState();
      
    } catch (error) {
      setExecutionLog(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsExecuting(false);
      setActiveWorkflow(null);
    }
  };

  const executeQuickAction = async (action: string, module: string) => {
    await selfLearningSystem.recordLearningData({
      userId,
      sessionId: `quick_${Date.now()}`,
      module,
      action,
      data: { quickAction: true },
      outcome: 'success',
      duration: 1000,
      context: { type: 'quick_action' }
    });
    
    loadUserState();
  };

  const workflowPatterns = selfLearningSystem.getWorkflowPatterns();

  const renderWorkflowCard = (workflow: WorkflowPattern) => (
    <Card key={workflow.id} className={`relative ${workflow.isRecommended ? 'border-blue-200 dark:border-blue-800' : ''}`}>
      {workflow.isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {workflow.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{Math.round(workflow.successRate * 100)}% success</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{Math.round(workflow.averageDuration / 1000)}s</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-purple-500" />
              <span>{workflow.usageCount} uses</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Workflow Steps:</div>
            <div className="space-y-1">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.action.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500">
                      {step.module} • {Math.round(step.estimatedDuration / 1000)}s
                    </div>
                  </div>
                  {getModuleIcon(step.module)}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => executeWorkflow(workflow.id)}
            disabled={isExecuting}
            className="w-full"
          >
            {isExecuting && activeWorkflow === workflow.id ? (
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
  );

  const getModuleIcon = (module: string) => {
    const icons = {
      photo2plan: <Camera className="w-4 h-4 text-blue-500" />,
      inventory: <Package className="w-4 h-4 text-green-500" />,
      drilling: <Settings className="w-4 h-4 text-orange-500" />,
      templates: <Layers className="w-4 h-4 text-purple-500" />,
      cnc: <FileText className="w-4 h-4 text-red-500" />
    };
    return icons[module as keyof typeof icons] || <Settings className="w-4 h-4 text-gray-500" />;
  };

  const renderRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Intelligent Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recommendations yet</p>
              <p className="text-sm">Start using workflows to get personalized suggestions</p>
            </div>
          ) : (
            recommendations.map(rec => (
              <div key={rec.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                    rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-gray-100 dark:bg-gray-900'
                  }`}>
                    {rec.type === 'workflow' && <Target className="w-4 h-4" />}
                    {rec.type === 'cabinet' && <Package className="w-4 h-4" />}
                    {rec.type === 'pattern' && <Settings className="w-4 h-4" />}
                    {rec.type === 'template' && <Layers className="w-4 h-4" />}
                    {rec.type === 'setting' && <Settings className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{rec.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{rec.description}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        {Math.round(rec.confidence * 100)}% confidence
                      </Badge>
                      <span className="text-gray-500">{rec.reasoning}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderLearningInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {learningInsights ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {learningInsights.totalActions}
                </div>
                <div className="text-sm text-gray-600">Total Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(learningInsights.successRate * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(learningInsights.averageDuration / 1000)}s
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {learningInsights.preferences.length}
                </div>
                <div className="text-sm text-gray-600">Preferences</div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Most Used Workflows</div>
              <div className="space-y-1">
                {learningInsights.workflowUsage.slice(0, 3).map(workflow => (
                  <div key={workflow.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">{workflow.name}</span>
                    <Badge variant="outline">{workflow.usageCount} uses</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No learning data yet</p>
            <p className="text-sm">Start using workflows to build your learning profile</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => executeQuickAction('quick_scan', 'photo2plan')}
            className="h-auto p-3 flex flex-col items-center"
          >
            <Camera className="w-6 h-6 mb-2" />
            <span className="text-xs">Quick Scan</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => executeQuickAction('add_cabinet', 'inventory')}
            className="h-auto p-3 flex flex-col items-center"
          >
            <Package className="w-6 h-6 mb-2" />
            <span className="text-xs">Add Cabinet</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => executeQuickAction('generate_pattern', 'drilling')}
            className="h-auto p-3 flex flex-col items-center"
          >
            <Settings className="w-6 h-6 mb-2" />
            <span className="text-xs">Drilling</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => executeQuickAction('create_template', 'templates')}
            className="h-auto p-3 flex flex-col items-center"
          >
            <Layers className="w-6 h-6 mb-2" />
            <span className="text-xs">Template</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderExecutionLog = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Execution Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {executionLog.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No execution log yet</p>
            </div>
          ) : (
            executionLog.map((log, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded font-mono">
                {log}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Unified Workflow System
          </h1>
          <p className="text-gray-600">
            Self-learning workflow orchestration with intelligent recommendations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLearning(!showLearning)}
          >
            {showLearning ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showLearning ? 'Hide' : 'Show'} Learning
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadUserState}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {renderQuickActions()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Available Workflows
            </h2>
            <div className="space-y-4">
              {workflowPatterns.map(renderWorkflowCard)}
            </div>
          </div>
        </div>

        {/* Learning Panel */}
        <div className="space-y-6">
          {showLearning && renderRecommendations()}
          {showLearning && renderLearningInsights()}
          {isExecuting && renderExecutionLog()}
        </div>
      </div>

      {/* Results Display */}
      {workflowResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Workflow Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(workflowResults, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={isExecuting ? "default" : "secondary"}>
                <Bot className="w-3 h-3 mr-1" />
                AI: {isExecuting ? 'Learning' : 'Ready'}
              </Badge>
              <Badge variant="outline">
                <Sparkles className="w-3 h-3 mr-1" />
                {recommendations.length} recommendations
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Self-Learning Workflow System v2.0 • Intelligent Automation Active
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
