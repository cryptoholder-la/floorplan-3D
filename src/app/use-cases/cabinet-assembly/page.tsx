"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Box
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/lib/cnc-types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  type PatternId
} from '@/lib/drill-patterns-library';

const ASSEMBLY_USE_CASES = [
  {
    id: 'standard-box',
    title: 'Standard Box Assembly',
    description: 'Complete cabinet box with side joints and back panel',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    jointType: 'dowel_side_joints' as PatternId,
    backPanelType: 'back_panel_nailer' as PatternId,
    notes: 'Most common cabinet construction method'
  },
  {
    id: 'frameless-cabinet',
    title: 'Frameless Cabinet',
    description: 'European frameless construction with optimized doweling',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    jointType: 'dowel_side_joints' as PatternId,
    backPanelType: 'back_panel_nailer' as PatternId,
    notes: 'Frameless European cabinet style'
  },
  {
    id: 'face-frame-cabinet',
    title: 'Face Frame Cabinet',
    description: 'Traditional face frame construction with reinforced joints',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    jointType: 'dowel_side_joints' as PatternId,
    backPanelType: 'back_panel_nailer' as PatternId,
    notes: 'American style face frame construction'
  },
  {
    id: 'tall-pantry',
    title: 'Tall Pantry Cabinet',
    description: 'Extra tall pantry with additional reinforcement',
    cabinetWidth: 900,
    cabinetHeight: 2000,
    cabinetDepth: 570,
    thickness: 18,
    jointType: 'dowel_side_joints' as PatternId,
    backPanelType: 'back_panel_nailer' as PatternId,
    notes: 'Heavy-duty construction for tall cabinets'
  },
  {
    id: 'custom-assembly',
    title: 'Custom Assembly',
    description: 'Configure for your specific cabinet dimensions',
    cabinetWidth: 500,
    cabinetHeight: 700,
    cabinetDepth: 450,
    thickness: 18,
    jointType: 'dowel_side_joints' as PatternId,
    backPanelType: 'back_panel_nailer' as PatternId,
    notes: 'Custom dimensions for special applications'
  }
];

export default function CabinetAssemblyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-box');
  const [cabinetWidth, setCabinetWidth] = useState(600);
  const [cabinetHeight, setCabinetHeight] = useState(800);
  const [cabinetDepth, setCabinetDepth] = useState(570);
  const [thickness, setThickness] = useState(18);
  const [selectedJoint, setSelectedJoint] = useState<PatternId>('dowel_side_joints');
  const [selectedBackPanel, setSelectedBackPanel] = useState<PatternId>('back_panel_nailer');
  const [dowelSize, setDowelSize] = useState(8);
  const [dowelLength, setDowelLength] = useState(32);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.3);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<'side' | 'top' | 'bottom' | 'back'>('side');

  const currentUseCase = ASSEMBLY_USE_CASES.find(uc => uc.id === selectedUseCase);
  const dowelPatterns = getPatternsByCategory(PATTERN_CATEGORIES.DOWEL);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = ASSEMBLY_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setCabinetWidth(found.cabinetWidth);
        setCabinetHeight(found.cabinetHeight);
        setCabinetDepth(found.cabinetDepth);
        setThickness(found.thickness);
        setSelectedJoint(found.jointType);
        setSelectedBackPanel(found.backPanelType);
      }
    }
  }, [searchParams]);

  // Update dimensions when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setCabinetWidth(currentUseCase.cabinetWidth);
      setCabinetHeight(currentUseCase.cabinetHeight);
      setCabinetDepth(currentUseCase.cabinetDepth);
      setThickness(currentUseCase.thickness);
      setSelectedJoint(currentUseCase.jointType);
      setSelectedBackPanel(currentUseCase.backPanelType);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate assembly patterns
  const handleGeneratePatterns = () => {
    const allPatterns = [];

    // Generate patterns for cabinet sides
    const leftSidePattern = generateCNCPattern(selectedJoint, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'inside'
    });

    const rightSidePattern = generateCNCPattern(selectedJoint, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomRight',
      face: 'inside'
    });

    // Generate patterns for top and bottom
    const topPattern = generateCNCPattern(selectedJoint, {
      partType: 'cabinetTopBottom',
      length: cabinetWidth - 36, // Account for side thickness
      width: cabinetDepth,
      thickness,
      origin: 'topLeft',
      face: 'inside'
    });

    const bottomPattern = generateCNCPattern(selectedJoint, {
      partType: 'cabinetTopBottom',
      length: cabinetWidth - 36,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'inside'
    });

    // Generate back panel nailer patterns
    const leftNailerPattern = generateCNCPattern(selectedBackPanel, {
      partType: 'nailerStrip',
      length: cabinetHeight,
      width: 80,
      thickness,
      origin: 'bottomLeft',
      face: 'front'
    });

    const rightNailerPattern = generateCNCPattern(selectedBackPanel, {
      partType: 'nailerStrip',
      length: cabinetHeight,
      width: 80,
      thickness,
      origin: 'bottomRight',
      face: 'front'
    });

    // Generate fixed shelf patterns (optional)
    const shelfCount = Math.floor((cabinetHeight - 200) / 400); // Approximate shelf positions
    const shelfPatterns = [];
    
    for (let i = 0; i < shelfCount; i++) {
      const shelfY = 200 + (i * 400); // Start 200mm from bottom, space every 400mm
      
      const shelfPattern = generateCNCPattern(selectedJoint, {
        partType: 'fixedShelf',
        length: cabinetWidth - 36,
        width: cabinetDepth - 16, // Account for back panel
        thickness,
        origin: 'bottomLeft',
        face: 'top'
      });
      
      if (shelfPattern) {
        shelfPattern.name = `Fixed Shelf ${i + 1}`;
        shelfPatterns.push(shelfPattern);
      }
    }

    if (!leftSidePattern || !rightSidePattern || !topPattern || !bottomPattern) {
      toast.error('Failed to generate assembly patterns');
      return;
    }

    // Update pattern names
    leftSidePattern.name = 'Cabinet Side - Left';
    rightSidePattern.name = 'Cabinet Side - Right';
    topPattern.name = 'Cabinet Top';
    bottomPattern.name = 'Cabinet Bottom';
    
    if (leftNailerPattern) leftNailerPattern.name = 'Back Nailer - Left';
    if (rightNailerPattern) rightNailerPattern.name = 'Back Nailer - Right';

    allPatterns.push(
      leftSidePattern, 
      rightSidePattern, 
      topPattern, 
      bottomPattern,
      ...(leftNailerPattern ? [leftNailerPattern] : []),
      ...(rightNailerPattern ? [rightNailerPattern] : []),
      ...shelfPatterns
    );

    setPatterns(allPatterns);
    setCurrentStep(3);
    toast.success(`Generated cabinet assembly patterns: ${allPatterns.length} parts`);
  };

  // Export patterns
  const handleExport = () => {
    if (patterns.length === 0) {
      toast.error('No patterns to export');
      return;
    }

    const data = {
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      jointType: selectedJoint,
      backPanelType: selectedBackPanel,
      dowelSize,
      dowelLength,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cabinet-assembly-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Patterns exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('cabinetAssemblyPatterns', JSON.stringify({
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      jointType: selectedJoint,
      backPanelType: selectedBackPanel,
      dowelSize,
      dowelLength,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Patterns saved!');
    router.push('/use-cases/complete-cabinet');
  };

  const allHoles = patterns.flatMap((p) => p.holes);
  
  const getCurrentPattern = () => {
    switch (selectedPart) {
      case 'side': return patterns.find(p => p.name.includes('Side - Left'));
      case 'top': return patterns.find(p => p.name.includes('Top'));
      case 'bottom': return patterns.find(p => p.name.includes('Bottom'));
      case 'back': return patterns.find(p => p.name.includes('Nailer'));
      default: return patterns[0];
    }
  };

  const currentPattern = getCurrentPattern();

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
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Cabinet Assembly Joints
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure dowel joint patterns for cabinet construction
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    1
                  </div>
                  <span className="font-medium">Select Use Case</span>
                </div>
                <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    2
                  </div>
                  <span className="font-medium">Configure Settings</span>
                </div>
                <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3 ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    3
                  </div>
                  <span className="font-medium">Generate Patterns</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep.toString()} className="space-y-6">
              {/* Step 1: Use Case Selection */}
              <TabsContent value="1">
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                    Select Assembly Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ASSEMBLY_USE_CASES.map((useCase) => (
                      <div
                        key={useCase.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedUseCase === useCase.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-slate-50 dark:bg-[#151c28] border-slate-200 dark:border-white/10 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedUseCase(useCase.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {useCase.title}
                          </h3>
                          {selectedUseCase === useCase.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-[#90a7cb] mb-3">
                          {useCase.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {useCase.cabinetWidth} × {useCase.cabinetHeight} × {useCase.cabinetDepth} mm
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {AVAILABLE_PATTERNS[useCase.jointType]?.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#90a7cb]">
                          💡 {useCase.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setCurrentStep(2)}>
                      Continue to Configuration
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Step 2: Configuration */}
              <TabsContent value="2">
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                    Cabinet Assembly Configuration
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Cabinet Dimensions */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Cabinet Dimensions</h3>
                      <div className="grid grid-cols-3 gap-4">
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
                      </div>
                      <div className="mt-3">
                        <Label>Panel Thickness (mm)</Label>
                        <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                      </div>
                    </div>

                    {/* Joint Configuration */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Joint Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Side Joint Type</Label>
                          <Select value={selectedJoint} onValueChange={(v: PatternId) => setSelectedJoint(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dowelPatterns.filter(p => p.id.includes('side')).map((pattern) => (
                                <SelectItem key={pattern.id} value={pattern.id}>
                                  {pattern.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Back Panel Type</Label>
                          <Select value={selectedBackPanel} onValueChange={(v: PatternId) => setSelectedBackPanel(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dowelPatterns.filter(p => p.id.includes('back')).map((pattern) => (
                                <SelectItem key={pattern.id} value={pattern.id}>
                                  {pattern.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Dowel Size (mm)</Label>
                          <Select value={dowelSize.toString()} onValueChange={(v) => setDowelSize(Number(v))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6mm</SelectItem>
                              <SelectItem value="8">8mm (Standard)</SelectItem>
                              <SelectItem value="10">10mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Dowel Length (mm)</Label>
                          <Select value={dowelLength.toString()} onValueChange={(v) => setDowelLength(Number(v))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">25mm</SelectItem>
                              <SelectItem value="32">32mm (Standard)</SelectItem>
                              <SelectItem value="40">40mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            Assembly Information
                          </div>
                          <div>• 8mm dowels are standard for 18mm panels</div>
                          <div>• 32mm length provides strong joint for 18mm material</div>
                          <div>• Back panel nailers provide mounting surface for back panels</div>
                          <div>• All joints include proper edge setbacks for clean assembly</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleGeneratePatterns}>
                      Generate Assembly Patterns
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Step 3: Pattern Preview */}
              <TabsContent value="3">
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Generated Assembly Patterns
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" onClick={handleSaveAndContinue}>
                        <Save className="w-4 h-4 mr-2" />
                        Save & Continue
                      </Button>
                    </div>
                  </div>

                  {/* Part Selection */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={selectedPart === 'side' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('side')}
                    >
                      Cabinet Sides
                    </Button>
                    <Button
                      variant={selectedPart === 'top' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('top')}
                    >
                      Top Panel
                    </Button>
                    <Button
                      variant={selectedPart === 'bottom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('bottom')}
                    >
                      Bottom Panel
                    </Button>
                    <Button
                      variant={selectedPart === 'back' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('back')}
                      disabled={patterns.filter(p => p.name.includes('Nailer')).length === 0}
                    >
                      Back Nailers
                    </Button>
                  </div>

                  {currentPattern && (
                    <>
                      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto mb-4">
                        <svg
                          width={
                            selectedPart === 'side' 
                              ? cabinetDepth * previewScale 
                              : (cabinetWidth - 36) * previewScale
                          }
                          height={
                            selectedPart === 'side' 
                              ? cabinetHeight * previewScale 
                              : cabinetDepth * previewScale
                          }
                          className="border-2 border-white/20 bg-amber-100/10 mx-auto"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={
                              selectedPart === 'side' 
                                ? cabinetDepth * previewScale 
                                : (cabinetWidth - 36) * previewScale
                            }
                            height={
                              selectedPart === 'side' 
                                ? cabinetHeight * previewScale 
                                : cabinetDepth * previewScale
                            }
                            fill="#E8D4B8"
                            opacity={0.3}
                          />
                          <g>
                            {currentPattern.holes.map((hole, hIndex) => (
                              <g key={hole.id}>
                                <circle
                                  cx={hole.x * previewScale}
                                  cy={hole.y * previewScale}
                                  r={(hole.diameter / 2) * previewScale}
                                  fill="#f97316"
                                  opacity={0.6}
                                  stroke="white"
                                  strokeWidth={1}
                                />
                                <text
                                  x={hole.x * previewScale}
                                  y={hole.y * previewScale}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize={8}
                                  fill="white"
                                  fontWeight="bold"
                                >
                                  {hIndex + 1}
                                </text>
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
                          max="0.6"
                          step="0.1"
                          value={previewScale}
                          onChange={(e) => setPreviewScale(Number(e.target.value))}
                          className="w-48"
                        />
                        <span className="text-sm">{(previewScale * 100).toFixed(0)}%</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{currentPattern.holes.length}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Current Part Holes</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{allHoles.length}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Holes</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{dowelSize}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Dowel Size (mm)</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{patterns.length}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Parts</div>
                        </Card>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Configuration
                    </Button>
                    <Link href="/use-cases/complete-cabinet">
                      <Button>
                        Next: Complete Cabinet
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Configuration */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Assembly Configuration
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Use Case:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentUseCase?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Cabinet Size:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {cabinetWidth} × {cabinetHeight} × {cabinetDepth} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Joint Type:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {AVAILABLE_PATTERNS[selectedJoint]?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Dowel Size:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {dowelSize}mm × {dowelLength}mm
                  </span>
                </div>
              </div>
            </Card>

            {/* Assembly Tips */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                Assembly Guidelines
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>8mm dowels provide optimal strength for 18mm panels</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>32mm length ensures penetration into both panels</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Back panel nailers create secure back panel mounting</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Use wood glue with dowels for maximum joint strength</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Test fit joints before applying glue</span>
                </div>
              </div>
            </Card>

            {/* Pattern Summary */}
            {currentStep === 3 && patterns.length > 0 && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Assembly Parts
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {patterns.map((pattern, index) => (
                    <div key={pattern.id} className="p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {pattern.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-[#90a7cb]">
                        {pattern.holes.length} holes
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Next Steps */}
            {currentStep === 3 && (
              <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Complete Workflow
                </h3>
                <div className="space-y-2">
                  <Link href="/use-cases/complete-cabinet">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Complete Cabinet Workflow
                    </Button>
                  </Link>
                  <Link href="/drill-configurator">
                    <Button variant="outline" className="w-full justify-start">
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
