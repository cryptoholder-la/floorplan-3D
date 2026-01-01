import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Badge } from '@/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Progress } from '@/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Settings, 
  Download, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
  Box,
  DoorOpen,
  Archive,
  Grid3x3,
  Wrench,
  Play,
  FileText,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/types/cnc.types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  type PatternId
} from '@/lib/drill-patterns-library';

const COMPLETE_WORKFLOW_STEPS = [
  {
    id: 'hinges',
    title: 'Door Hinges',
    description: 'Configure hinge drilling for cabinet doors',
    icon: DoorOpen,
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    href: '/use-cases/kitchen-doors',
    estimatedTime: '5-10 min',
    patterns: [] as DrillPattern[]
  },
  {
    id: 'drawers',
    title: 'Drawer Slides',
    description: 'Set up drawer slide drilling for cabinet sides',
    icon: Archive,
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    href: '/use-cases/drawer-slides',
    estimatedTime: '10-15 min',
    patterns: [] as DrillPattern[]
  },
  {
    id: 'system32',
    title: 'System 32 Shelving',
    description: 'Configure 32mm system drilling for adjustable shelves',
    icon: Grid3x3,
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    href: '/use-cases/system-32',
    estimatedTime: '8-12 min',
    patterns: [] as DrillPattern[]
  },
  {
    id: 'assembly',
    title: 'Cabinet Assembly',
    description: 'Create dowel joint patterns for cabinet construction',
    icon: Package,
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    href: '/use-cases/cabinet-assembly',
    estimatedTime: '15-20 min',
    patterns: [] as DrillPattern[]
  }
];

const CABINET_PRESETS = [
  {
    id: 'standard-kitchen',
    title: 'Standard Kitchen Cabinet',
    description: '600×800×570mm - Most common kitchen cabinet size',
    width: 600,
    height: 800,
    depth: 570,
    thickness: 18,
    components: ['doors', 'drawers', 'shelves', 'assembly']
  },
  {
    id: 'base-cabinet',
    title: 'Base Cabinet',
    description: '900×720×570mm - Standard kitchen base cabinet',
    width: 900,
    height: 720,
    depth: 570,
    thickness: 18,
    components: ['doors', 'drawers', 'shelves', 'assembly']
  },
  {
    id: 'wall-cabinet',
    title: 'Wall Cabinet',
    description: '600×700×320mm - Standard wall cabinet',
    width: 600,
    height: 700,
    depth: 320,
    thickness: 18,
    components: ['doors', 'shelves', 'assembly']
  },
  {
    id: 'pantry-cabinet',
    title: 'Pantry Cabinet',
    description: '900×2000×570mm - Full height pantry storage',
    width: 900,
    height: 2000,
    depth: 570,
    thickness: 18,
    components: ['doors', 'drawers', 'shelves', 'assembly']
  },
  {
    id: 'custom-cabinet',
    title: 'Custom Cabinet',
    description: 'Configure your own cabinet dimensions',
    width: 600,
    height: 800,
    depth: 570,
    thickness: 18,
    components: ['doors', 'drawers', 'shelves', 'assembly']
  }
];

export default function CompleteCabinetPage() {
  const router = useRouter();
  
  // State management
  const [selectedPreset, setSelectedPreset] = useState<string>('standard-kitchen');
  const [cabinetWidth, setCabinetWidth] = useState(600);
  const [cabinetHeight, setCabinetHeight] = useState(800);
  const [cabinetDepth, setCabinetDepth] = useState(570);
  const [thickness, setThickness] = useState(18);
  const [workflowSteps, setWorkflowSteps] = useState(COMPLETE_WORKFLOW_STEPS);
  const [allPatterns, setAllPatterns] = useState<DrillPattern[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.2);

  const currentPreset = CABINET_PRESETS.find(p => p.id === selectedPreset);
  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / workflowSteps.length) * 100;

  // Load saved patterns from localStorage
  useEffect(() => {
    const loadSavedPatterns = () => {
      const updatedSteps = [...workflowSteps];
      
      // Check for saved door patterns
      const doorPatterns = localStorage.getItem('kitchenDoorPattern');
      if (doorPatterns) {
        const parsed = JSON.parse(doorPatterns);
        updatedSteps[0].status = 'completed';
        updatedSteps[0].patterns = parsed.patterns || [];
      }

      // Check for saved drawer patterns
      const drawerPatterns = localStorage.getItem('drawerSlidePatterns');
      if (drawerPatterns) {
        const parsed = JSON.parse(drawerPatterns);
        updatedSteps[1].status = 'completed';
        updatedSteps[1].patterns = parsed.patterns || [];
      }

      // Check for saved system32 patterns
      const system32Patterns = localStorage.getItem('system32Patterns');
      if (system32Patterns) {
        const parsed = JSON.parse(system32Patterns);
        updatedSteps[2].status = 'completed';
        updatedSteps[2].patterns = parsed.patterns || [];
      }

      // Check for saved assembly patterns
      const assemblyPatterns = localStorage.getItem('cabinetAssemblyPatterns');
      if (assemblyPatterns) {
        const parsed = JSON.parse(assemblyPatterns);
        updatedSteps[3].status = 'completed';
        updatedSteps[3].patterns = parsed.patterns || [];
      }

      setWorkflowSteps(updatedSteps);
      
      // Collect all patterns
      const allPatterns = updatedSteps.flatMap(step => step.patterns);
      setAllPatterns(allPatterns);
    };

    loadSavedPatterns();
  }, []);

  // Update dimensions when preset changes
  useEffect(() => {
    if (currentPreset) {
      setCabinetWidth(currentPreset.width);
      setCabinetHeight(currentPreset.height);
      setCabinetDepth(currentPreset.depth);
      setThickness(currentPreset.thickness);
    }
  }, [selectedPreset, currentPreset]);

  // Generate complete cabinet workflow
  const handleGenerateCompleteWorkflow = async () => {
    setIsGenerating(true);
    
    try {
      const allGeneratedPatterns: DrillPattern[] = [];

      // Generate door hinge patterns
      const hingePattern = generateCNCPattern('blum_cliptop_hinge_100' as PatternId, {
        partType: 'door',
        length: cabinetHeight,
        width: cabinetWidth,
        thickness,
        origin: 'bottomLeft',
        face: 'front'
      });
      
      if (hingePattern) {
        hingePattern.name = 'Cabinet Door - Hinge Pattern';
        allGeneratedPatterns.push(hingePattern);
      }

      // Generate drawer slide patterns
      const leftDrawerPattern = generateCNCPattern('blum_tandem_box' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomLeft',
        face: 'inside',
        rowConfig: 'single'
      });

      const rightDrawerPattern = generateCNCPattern('blum_tandem_box' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomRight',
        face: 'inside',
        rowConfig: 'single'
      });

      if (leftDrawerPattern && rightDrawerPattern) {
        leftDrawerPattern.name = 'Cabinet Side - Left (Drawer Slides)';
        rightDrawerPattern.name = 'Cabinet Side - Right (Drawer Slides)';
        allGeneratedPatterns.push(leftDrawerPattern, rightDrawerPattern);
      }

      // Generate system 32 patterns
      const leftSystem32Pattern = generateCNCPattern('system32_row' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomLeft',
        face: 'inside',
        rowConfig: 'double'
      });

      const rightSystem32Pattern = generateCNCPattern('system32_row' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomRight',
        face: 'inside',
        rowConfig: 'double'
      });

      if (leftSystem32Pattern && rightSystem32Pattern) {
        leftSystem32Pattern.name = 'Cabinet Side - Left (System 32)';
        rightSystem32Pattern.name = 'Cabinet Side - Right (System 32)';
        allGeneratedPatterns.push(leftSystem32Pattern, rightSystem32Pattern);
      }

      // Generate assembly patterns
      const leftSidePattern = generateCNCPattern('dowel_side_joints' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomLeft',
        face: 'inside'
      });

      const rightSidePattern = generateCNCPattern('dowel_side_joints' as PatternId, {
        partType: 'cabinetSide',
        length: cabinetHeight,
        width: cabinetDepth,
        thickness,
        origin: 'bottomRight',
        face: 'inside'
      });

      const topPattern = generateCNCPattern('dowel_side_joints' as PatternId, {
        partType: 'cabinetTopBottom',
        length: cabinetWidth - 36,
        width: cabinetDepth,
        thickness,
        origin: 'topLeft',
        face: 'inside'
      });

      const bottomPattern = generateCNCPattern('dowel_side_joints' as PatternId, {
        partType: 'cabinetTopBottom',
        length: cabinetWidth - 36,
        width: cabinetDepth,
        thickness,
        origin: 'bottomLeft',
        face: 'inside'
      });

      if (leftSidePattern && rightSidePattern && topPattern && bottomPattern) {
        leftSidePattern.name = 'Cabinet Side - Left (Assembly)';
        rightSidePattern.name = 'Cabinet Side - Right (Assembly)';
        topPattern.name = 'Cabinet Top (Assembly)';
        bottomPattern.name = 'Cabinet Bottom (Assembly)';
        allGeneratedPatterns.push(leftSidePattern, rightSidePattern, topPattern, bottomPattern);
      }

      setAllPatterns(allGeneratedPatterns);
      
      // Update workflow steps to completed
      const updatedSteps = workflowSteps.map(step => ({
        ...step,
        status: 'completed' as const
      }));
      setWorkflowSteps(updatedSteps);

      toast.success(`Generated complete cabinet workflow: ${allGeneratedPatterns.length} patterns`);
    } catch (error) {
      toast.error('Failed to generate complete workflow');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export complete workflow
  const handleExportCompleteWorkflow = () => {
    if (allPatterns.length === 0) {
      toast.error('No patterns to export');
      return;
    }

    const workflowData = {
      cabinet: {
        preset: selectedPreset,
        width: cabinetWidth,
        height: cabinetHeight,
        depth: cabinetDepth,
        thickness
      },
      workflow: {
        steps: workflowSteps.map(step => ({
          id: step.id,
          title: step.title,
          status: step.status,
          patternsCount: step.patterns.length
        })),
        completedSteps,
        totalSteps: workflowSteps.length
      },
      patterns: allPatterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-cabinet-workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Complete workflow exported successfully');
  };

  // Navigate to specific step
  const handleNavigateToStep = (stepIndex: number) => {
    const step = workflowSteps[stepIndex];
    router.push(step.href);
  };

  const allHoles = allPatterns.flatMap((p) => p.holes);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/use-cases">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Use Cases
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Package className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Complete Cabinet Workflow
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  End-to-end cabinet drilling pattern generation
                </p>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Workflow Progress
              </h2>
              <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
                {completedSteps}/{workflowSteps.length} Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    step.status === 'completed'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : step.status === 'in-progress'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-slate-50 dark:bg-[#151c28] border-slate-200 dark:border-white/10'
                  }`}
                  onClick={() => handleNavigateToStep(index)}
                >
                  <step.icon className={`w-6 h-6 mx-auto mb-2 ${
                    step.status === 'completed'
                      ? 'text-green-600 dark:text-green-400'
                      : step.status === 'in-progress'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`} />
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#90a7cb]">
                    {step.estimatedTime}
                  </div>
                  {step.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1 text-green-600 dark:text-green-400" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabinet Configuration */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                Cabinet Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Cabinet Preset</Label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CABINET_PRESETS.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentPreset && (
                    <p className="text-sm text-slate-500 dark:text-[#90a7cb] mt-1">
                      {currentPreset.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Width (mm)</Label>
                    <Input type="number" value={cabinetWidth} onChange={(e) => setCabinetWidth(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Height (mm)</Label>
                    <Input type="number" value={cabinetHeight} onChange={(e) => setCabinetHeight(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Depth (mm)</Label>
                    <Input type="number" value={cabinetDepth} onChange={(e) => setCabinetDepth(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Thickness (mm)</Label>
                    <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateCompleteWorkflow} 
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Workflow...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Complete Workflow
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportCompleteWorkflow}
                    disabled={allPatterns.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>

            {/* Workflow Steps Detail */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                Workflow Steps
              </h2>
              
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border ${
                      step.status === 'completed'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-slate-50 dark:bg-[#151c28] border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <step.icon className={`w-5 h-5 ${
                          step.status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-slate-400 dark:text-slate-600'
                        }`} />
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-[#90a7cb]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {step.patterns.length} patterns
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-[#90a7cb]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {step.estimatedTime}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigateToStep(index)}
                      >
                        {step.status === 'completed' ? 'Review' : 'Configure'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pattern Preview */}
            {allPatterns.length > 0 && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                  Complete Cabinet Preview
                </h2>
                
                <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto mb-4">
                  <svg
                    width={cabinetWidth * previewScale}
                    height={cabinetHeight * previewScale}
                    className="border-2 border-white/20 bg-amber-100/10 mx-auto"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={cabinetWidth * previewScale}
                      height={cabinetHeight * previewScale}
                      fill="#E8D4B8"
                      opacity={0.3}
                    />
                    <g>
                      {allPatterns.slice(0, 50).map((hole, hIndex) => ( // Limit to 50 holes for performance
                        <g key={hole.id}>
                          <circle
                            cx={hole.x * previewScale}
                            cy={hole.y * previewScale}
                            r={(hole.diameter / 2) * previewScale}
                            fill={
                              hole.type === 'through'
                                ? '#ef4444'
                                : hole.type === 'countersink'
                                  ? '#f59e0b'
                                  : '#3b82f6'
                            }
                            opacity={0.6}
                            stroke="white"
                            strokeWidth={1}
                          />
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Label>Scale:</Label>
                  <Input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    value={previewScale}
                    onChange={(e) => setPreviewScale(Number(e.target.value))}
                    className="w-48"
                  />
                  <span className="text-sm">{(previewScale * 100).toFixed(0)}%</span>
                  <Badge variant="secondary">
                    Showing {Math.min(allHoles.length, 50)} of {allHoles.length} holes
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{allPatterns.length}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Parts</div>
                  </Card>
                  <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{allHoles.length}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Holes</div>
                  </Card>
                  <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{cabinetWidth}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Width (mm)</div>
                  </Card>
                  <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{cabinetHeight}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Height (mm)</div>
                  </Card>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {workflowSteps.map((step, index) => (
                  <Link key={step.id} href={step.href}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <step.icon className="w-4 h-4 mr-2" />
                      {step.title}
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" />
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Cabinet Summary */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-5 h-5" />
                Cabinet Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Type:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentPreset?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Dimensions:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {cabinetWidth} × {cabinetHeight} × {cabinetDepth} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Progress:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Patterns:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {allPatterns.length} parts
                  </span>
                </div>
              </div>
            </Card>

            {/* Workflow Tips */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                Workflow Tips
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete steps in order for best results</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Save patterns after each step to prevent data loss</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Review all patterns before exporting for manufacturing</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Verify cabinet dimensions match your requirements</span>
                </div>
              </div>
            </Card>

            {/* Export Options */}
            {allPatterns.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Export Options
                </h3>
                <div className="space-y-2">
                  <Button onClick={handleExportCompleteWorkflow} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Complete Workflow
                  </Button>
                  <Link href="/drill-configurator">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Custom Pattern Design
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
