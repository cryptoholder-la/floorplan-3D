'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Package,
  Calculator,
  FileText,
  Download,
  Eye,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analysisResults = [
    {
      id: 'cost-analysis',
      name: 'Material Cost Analysis',
      status: 'completed',
      accuracy: '94%',
      date: '2024-01-15',
      type: 'financial'
    },
    {
      id: 'structural-analysis',
      name: 'Structural Integrity',
      status: 'in-progress',
      accuracy: '87%',
      date: '2024-01-15',
      type: 'engineering'
    },
    {
      id: 'optimization',
      name: 'Design Optimization',
      status: 'pending',
      accuracy: 'N/A',
      date: '2024-01-16',
      type: 'performance'
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
          <BarChart3 className="w-8 h-8" />
          Analysis Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced cabinet analysis, cost optimization, and performance metrics
        </p>
      </div>

      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Active Analyses</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">91%</div>
            <div className="text-sm text-muted-foreground">Avg. Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">2.3s</div>
            <div className="text-sm text-muted-foreground">Avg. Processing</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-muted-foreground">Total Analyses</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Analyses
                </CardTitle>
                <CardDescription>
                  Latest cabinet analysis results and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.map((analysis) => (
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
                      </div>
                    </div>
                  ))}
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
                  Cost Analysis
                </CardTitle>
                <CardDescription>
                  Material cost breakdown and optimization recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Cost Analysis Engine</p>
                  <p className="text-sm text-slate-600">Advanced cost optimization algorithms coming soon</p>
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
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Cabinet performance analysis and structural integrity testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Performance Analysis</p>
                  <p className="text-sm text-slate-600">Structural and performance testing coming soon</p>
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
                  Comprehensive analysis reports and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="w-6 h-6 mb-2" />
                      <span>Export Analysis</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="w-6 h-6 mb-2" />
                      <span>Generate Report</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Settings className="w-6 h-6 mb-2" />
                      <span>Analysis Settings</span>
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
