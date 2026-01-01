import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CostEstimator from '@/components/CostEstimator';
import CostReport from '@/components/CostReport';
import SpecBookUI from '@/components/SpecBookUI';
import CNCManufacturingPanel from '@/components/CNCManufacturingPanel';
import CNCSimulator from '@/components/CNCSimulator';
import GCodeGenerator from '@/components/GCodeGenerator';
import CutlistGenerator from '@/components/CutlistGenerator';
import CutListPanel from '@/components/CutListPanel';
import ErrorReporter from '@/components/ErrorReporter';
import FilterPanel from '@/components/FilterPanel';
import TemplateSelector from '@/components/TemplateSelector';
import QuickAddCabinet from '@/components/QuickAddCabinet';
import { DollarSign, FileText, Calculator, TrendingUp, Cpu, AlertTriangle, Filter, Layers, Plus } from 'lucide-react';

export default function AnalysisToolsPage() {
  const [activeTab, setActiveTab] = useState('estimator');
  const [costData, setCostData] = useState<any>(null);

  const handleCostUpdate = (data: any) => {
    setCostData(data);
  };

  return (
    <MainLayout 
      title="Analysis Tools" 
      subtitle="Cost analysis and specification tools"
    >
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="estimator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Cost Estimator
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cost Report
            </TabsTrigger>
            <TabsTrigger value="specbook" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Spec Book
            </TabsTrigger>
            <TabsTrigger value="cnc" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              CNC Tools
            </TabsTrigger>
            <TabsTrigger value="cutlist" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Cutlist
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estimator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Estimator</CardTitle>
              </CardHeader>
              <CardContent>
                <CostEstimator 
                  cutlist={[
                    {
                      id: 'panel-1',
                      name: 'Side Panel',
                      width: 600,
                      height: 720,
                      thickness: 18,
                      quantity: 2,
                      material: 'Plywood'
                    }
                  ]}
                  estimatedTime={120}
                  onCostUpdate={handleCostUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Report</CardTitle>
              </CardHeader>
              <CardContent>
                <CostReport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specbook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specification Book</CardTitle>
              </CardHeader>
              <CardContent>
                <SpecBookUI 
                  project={{
                    name: 'Sample Project',
                    description: 'Sample cabinet project',
                    created: new Date(),
                    specifications: {}
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cnc" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CNC Manufacturing Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CNCManufacturingPanel 
                    data={{
                      parts: [],
                      settings: {}
                    }}
                    onOperation={(op) => console.log('CNC operation:', op)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>CNC Simulator</CardTitle>
                </CardHeader>
                <CardContent>
                  <CNCSimulator 
                    parts={[]}
                    settings={{}}
                    isSimulating={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cutlist" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cutlist Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <CutlistGenerator 
                    parts={[]}
                    onGenerate={() => console.log('Cutlist generated')}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cut List Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CutListPanel 
                    cutlist={[]}
                    onUpdate={() => console.log('Cutlist updated')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Error Reporter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorReporter 
                    errors={[]}
                    onReport={() => console.log('Error reported')}
                    onClear={() => console.log('Errors cleared')}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Filter Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterPanel 
                    data={[]}
                    onFilter={() => console.log('Filters applied')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Selector</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplateSelector 
                    templates={[]}
                    onSelect={() => console.log('Template selected')}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Add Cabinet</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickAddCabinet 
                    onAdd={() => console.log('Cabinet added')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Material Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Material Usage</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Plywood:</span>
                          <span className="font-medium">24 sheets</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hardwood:</span>
                          <span className="font-medium">12 boards</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hardware:</span>
                          <span className="font-medium">48 sets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Production Time</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cutting:</span>
                          <span className="font-medium">8 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assembly:</span>
                          <span className="font-medium">12 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Finishing:</span>
                          <span className="font-medium">6 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-medium text-green-600">26 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
