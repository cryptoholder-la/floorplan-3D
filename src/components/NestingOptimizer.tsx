"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Download, 
  Eye, 
  Folder,
  Box,
  Grid3x3,
  Settings,
  Package,
  Zap,
  Layers,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface NestingPart {
  id: string;
  name: string;
  width_mm: number;
  height_mm: number;
  thickness_mm: number;
  quantity: number;
  material?: string;
  rotation?: number;
}

interface NestingSheet {
  id: string;
  width_mm: number;
  height_mm: number;
  margin_mm: number;
  gap_mm: number;
  parts: NestingPart[];
  utilization: number;
  wastePercentage: number;
  placements?: any[];
}

interface WorkflowStep {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'done';
}

interface NestingOptimizerProps {
  className?: string;
}

const SAMPLE_PARTS: NestingPart[] = [
  {
    id: 'side-panel-left',
    name: 'Side Panel Left',
    width_mm: 600,
    height_mm: 720,
    thickness_mm: 18,
    quantity: 1,
    material: 'Plywood'
  },
  {
    id: 'side-panel-right',
    name: 'Side Panel Right',
    width_mm: 600,
    height_mm: 720,
    thickness_mm: 18,
    quantity: 1,
    material: 'Plywood'
  },
  {
    id: 'top-panel',
    name: 'Top Panel',
    width_mm: 564,
    height_mm: 300,
    thickness_mm: 18,
    quantity: 1,
    material: 'Plywood'
  },
  {
    id: 'bottom-panel',
    name: 'Bottom Panel',
    width_mm: 564,
    height_mm: 300,
    thickness_mm: 18,
    quantity: 1,
    material: 'Plywood'
  },
  {
    id: 'shelf-1',
    name: 'Shelf 1',
    width_mm: 564,
    height_mm: 20,
    thickness_mm: 18,
    quantity: 2,
    material: 'Plywood'
  },
  {
    id: 'back-panel',
    name: 'Back Panel',
    width_mm: 564,
    height_mm: 720,
    thickness_mm: 6,
    quantity: 1,
    material: 'MDF'
  }
];

const DEFAULT_SHEET = {
  width_mm: 2440,
  height_mm: 1220,
  margin_mm: 10,
  gap_mm: 6
};

export default function NestingOptimizer({ className = "" }: NestingOptimizerProps) {
  const [activeTab, setActiveTab] = useState('parts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState<NestingPart | null>(null);
  const [sheetConfig, setSheetConfig] = useState(DEFAULT_SHEET);
  const [enableRotation, setEnableRotation] = useState(true);
  const [optimizeForMaterial, setOptimizeForMaterial] = useState(true);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);

  const filteredParts = SAMPLE_PARTS.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateNesting = (parts: NestingPart[], sheet: typeof DEFAULT_SHEET): NestingSheet => {
    const margin = sheet.margin_mm;
    const gap = sheet.gap_mm;
    const usableWidth = sheet.width_mm - margin * 2;
    const usableHeight = sheet.height_mm - margin * 2;

    let totalArea = 0;
    let placedParts: any[] = [];

    // Simple grid-based nesting algorithm
    parts.forEach(part => {
      for (let i = 0; i < part.quantity; i++) {
        const partWidth = enableRotation ? Math.min(part.width_mm, part.height_mm) : part.width_mm;
        const partHeight = enableRotation ? Math.max(part.width_mm, part.height_mm) : part.height_mm;
        
        const cols = Math.max(0, Math.floor((usableWidth + gap) / (partWidth + gap)));
        const rows = Math.max(0, Math.floor((usableHeight + gap) / (partHeight + gap)));
        
        if (cols > 0 && rows > 0) {
          const x = margin + (i % cols) * (partWidth + gap);
          const y = margin + Math.floor(i / cols) * (partHeight + gap);
          
          placedParts.push({
            partId: part.id,
            x_mm: x,
            y_mm: y,
            width_mm: partWidth,
            height_mm: partHeight,
            rotation: enableRotation && (part.width_mm > part.height_mm) ? 90 : 0
          });
          
          totalArea += partWidth * partHeight;
        }
      }
    });

    const sheetArea = usableWidth * usableHeight;
    const utilization = (totalArea / sheetArea) * 100;
    const wastePercentage = 100 - utilization;

    return {
      id: 'sheet-1',
      width_mm: sheet.width_mm,
      height_mm: sheet.height_mm,
      margin_mm: sheet.margin_mm,
      gap_mm: sheet.gap_mm,
      parts: parts,
      utilization,
      wastePercentage,
      placements: placedParts
    };
  };

  const generateWorkflow = (input: any, holes: any[], nestingModel: any) => {
    const hasPartDims = !!input && Number(input.length) > 0 && Number(input.width) > 0;
    const hasHardware = !!input?.hardwareType;
    const hasDrilling = Array.isArray(holes) && holes.length > 0;
    const hasNesting = !!nestingModel && Array.isArray(nestingModel.placements) && nestingModel.placements.length > 0;

    const steps: WorkflowStep[] = [
      {
        id: "design",
        label: "1. Part + hardware",
        detail: hasPartDims ? `${Math.round(input.length)} × ${Math.round(input.width)} × ${Math.round(input.thickness)} mm` : "Set part size + type",
        status: hasPartDims && hasHardware ? "done" : hasPartDims ? "active" : "pending"
      },
      {
        id: "drilling",
        label: "2. Drill pattern",
        detail: hasDrilling ? `${holes.length} holes generated` : "Pick hardware pattern",
        status: hasDrilling ? "done" : hasHardware ? "active" : "pending"
      },
      {
        id: "nesting",
        label: "3. Sheet nesting",
        detail: hasNesting ? `${nestingModel.placements.length} parts / sheet` : "Auto layout on sheet",
        status: hasNesting ? "done" : hasDrilling ? "active" : "pending"
      },
      {
        id: "export",
        label: "4. SQL / CNC export",
        detail: "Use JSON + SQL block on right",
        status: hasNesting ? "active" : "pending"
      }
    ];

    return steps;
  };

  const handleOptimize = () => {
    if (filteredParts.length === 0) {
      toast.error('No parts to optimize');
      return;
    }

    const nestingResult = calculateNesting(filteredParts, sheetConfig);
    const workflowSteps = generateWorkflow(
      { length: 600, width: 300, thickness: 18, hardwareType: 'euro' },
      [],
      nestingResult
    );
    
    setWorkflow(workflowSteps);
    toast.success(`Nesting optimized: ${nestingResult.utilization.toFixed(1)}% utilization`);
  };

  const handleExport = () => {
    const nestingData = {
      sheet: sheetConfig,
      parts: filteredParts,
      workflow: workflow,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(nestingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nesting-optimization.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Nesting data exported');
  };

  const renderNestingPreview = (sheet: NestingSheet) => {
    const scale = 0.04; // Scale for preview
    const sheetW = sheet.width_mm * scale;
    const sheetH = sheet.height_mm * scale;

    return (
      <div className="relative bg-slate-100 rounded-lg" style={{ width: sheetW, height: sheetH }}>
        {/* Sheet background */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 rounded" />
        
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #e2e8f0 0px, transparent 1px, transparent 20px, #e2e8f0 21px), repeating-linear-gradient(90deg, #e2e8f0 0px, transparent 1px, transparent 20px, #e2e8f0 21px)',
          backgroundSize: '21px 21px'
        }} />
        
        {/* Placed parts */}
        {sheet.placements?.map((placement: any, index: number) => (
          <div
            key={index}
            className="absolute bg-blue-200 border border-blue-400 flex items-center justify-center text-xs font-semibold"
            style={{
              left: placement.x_mm * scale,
              top: placement.y_mm * scale,
              width: placement.width_mm * scale,
              height: placement.height_mm * scale,
              transform: `rotate(${placement.rotation || 0}deg)`
            }}
          >
            {placement.partId?.substring(0, 3)}
          </div>
        ))}
        
        {/* Utilization overlay */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {sheet.utilization.toFixed(1)}% used
        </div>
      </div>
    );
  };

  const currentNesting = filteredParts.length > 0 ? calculateNesting(filteredParts, sheetConfig) : null;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            CNC Nesting Optimizer
          </CardTitle>
          <CardDescription>
            Advanced sheet nesting optimization for CNC manufacturing with workflow management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parts" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Parts
              </TabsTrigger>
              <TabsTrigger value="sheet-config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Sheet Config
              </TabsTrigger>
              <TabsTrigger value="nesting" className="flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                Nesting
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Workflow
              </TabsTrigger>
            </TabsList>

            {/* Parts Tab */}
            <TabsContent value="parts" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleOptimize} disabled={filteredParts.length === 0}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Optimize
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParts.map((part) => (
                  <Card 
                    key={part.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPart(part)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{part.name}</CardTitle>
                      <CardDescription>
                        {part.width_mm} × {part.height_mm} × {part.thickness_mm}mm
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{part.width_mm}</p>
                          <p className="text-muted-foreground">Width</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{part.height_mm}</p>
                          <p className="text-muted-foreground">Height</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{part.quantity}</p>
                          <p className="text-muted-foreground">Qty</p>
                        </div>
                      </div>
                      {part.material && (
                        <Badge variant="outline" className="mt-2">
                          {part.material}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sheet Configuration Tab */}
            <TabsContent value="sheet-config" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sheet Dimensions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Width (mm)</label>
                      <Input
                        type="number"
                        value={sheetConfig.width_mm}
                        onChange={(e) => setSheetConfig(prev => ({ ...prev, width_mm: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Height (mm)</label>
                      <Input
                        type="number"
                        value={sheetConfig.height_mm}
                        onChange={(e) => setSheetConfig(prev => ({ ...prev, height_mm: Number(e.target.value) }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nesting Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Margin (mm)</label>
                      <Slider
                        value={[sheetConfig.margin_mm]}
                        onValueChange={([value]) => setSheetConfig(prev => ({ ...prev, margin_mm: value }))}
                        max={50}
                        min={0}
                        step={1}
                      />
                      <span className="text-xs text-muted-foreground">{sheetConfig.margin_mm}mm</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gap (mm)</label>
                      <Slider
                        value={[sheetConfig.gap_mm]}
                        onValueChange={([value]) => setSheetConfig(prev => ({ ...prev, gap_mm: value }))}
                        max={20}
                        min={0}
                        step={1}
                      />
                      <span className="text-xs text-muted-foreground">{sheetConfig.gap_mm}mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Rotation</label>
                      <Switch
                        checked={enableRotation}
                        onCheckedChange={setEnableRotation}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Optimize for Material</label>
                      <Switch
                        checked={optimizeForMaterial}
                        onCheckedChange={setOptimizeForMaterial}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nesting Tab */}
            <TabsContent value="nesting" className="space-y-4">
              {currentNesting ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{currentNesting.utilization.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Material Utilization</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{currentNesting.wastePercentage.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Waste Percentage</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{currentNesting.placements?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Parts Placed</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Nesting Preview</CardTitle>
                      <CardDescription>
                        Visual representation of optimized sheet layout
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center p-4">
                        {renderNestingPreview(currentNesting)}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button onClick={handleOptimize}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Re-optimize
                    </Button>
                    <Button onClick={handleExport} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No nesting calculated</p>
                  <p className="text-sm text-slate-600">Add parts and optimize to see results</p>
                </div>
              )}
            </TabsContent>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-4">
              {workflow.length > 0 ? (
                <div className="space-y-3">
                  {workflow.map((step, index) => (
                    <Card key={step.id} className={
                      step.status === 'done' ? 'border-green-200 bg-green-50' :
                      step.status === 'active' ? 'border-blue-200 bg-blue-50' :
                      'border-gray-200'
                    }>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              step.status === 'done' ? 'bg-green-600' :
                              step.status === 'active' ? 'bg-blue-600' :
                              'bg-gray-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold">{step.label}</p>
                              <p className="text-sm text-muted-foreground">{step.detail}</p>
                            </div>
                          </div>
                          <Badge variant={
                            step.status === 'done' ? 'default' :
                            step.status === 'active' ? 'secondary' :
                            'outline'
                          }>
                            {step.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No workflow active</p>
                  <p className="text-sm text-slate-600">Run optimization to generate workflow</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
