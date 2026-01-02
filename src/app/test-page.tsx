'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Zap, 
  Package,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  FileText
} from 'lucide-react';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('components');
  const [testResults, setTestResults] = useState([
    { id: 1, name: 'Cabinet Viewer', status: 'passed', time: '0.3s' },
    { id: 2, name: '3D Renderer', status: 'passed', time: '1.2s' },
    { id: 3, name: 'CNC Export', status: 'failed', time: '2.1s' },
    { id: 4, name: 'Material Calculator', status: 'passed', time: '0.1s' }
  ]);

  const runTests = () => {
    setTestResults(testResults.map(test => ({
      ...test,
      status: Math.random() > 0.2 ? 'passed' : 'failed',
      time: `${(Math.random() * 2).toFixed(1)}s`
    })));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <TestTube className="w-4 h-4 text-gray-500" />;
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="w-8 h-8" />
          Testing Suite
        </h1>
        <p className="text-muted-foreground text-lg">
          Component testing, performance validation, and system diagnostics
        </p>
      </div>

      {/* Test Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <TestTube className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{testResults.length}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {((passedTests / testResults.length) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Component Tests</h3>
              <div className="flex gap-2">
                <Button onClick={runTests} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run Tests
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-muted-foreground">Execution time: {test.time}</div>
                        </div>
                      </div>
                      <Badge variant={test.status === 'passed' ? 'default' : 'destructive'}>
                        {test.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Performance Testing</p>
                  <p className="text-sm text-slate-600">Load testing and benchmarks coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Integration Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Integration Testing</p>
                  <p className="text-sm text-slate-600">Cross-component integration tests coming soon</p>
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
                  Test Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="w-6 h-6 mb-2" />
                      <span>Export Test Results</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Package className="w-6 h-6 mb-2" />
                      <span>Component Coverage</span>
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