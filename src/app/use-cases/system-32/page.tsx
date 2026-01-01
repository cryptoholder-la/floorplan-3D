import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Badge } from '@/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Grid3x3, 
  Settings, 
  Download, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
  Layers
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

const SYSTEM32_USE_CASES = [
  {
    id: 'standard-shelving',
    title: 'Standard Adjustable Shelving',
    description: '32mm system for standard kitchen cabinet adjustable shelves',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    patternType: 'system32_row' as PatternId,
    rowConfig: 'double' as const,
    holeSpacing: 32,
    notes: 'Most common 32mm system setup'
  },
  {
    id: 'fixed-shelving',
    title: 'Fixed Shelving System',
    description: 'Fixed shelf positions with construction holes',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    patternType: 'system32_row' as PatternId,
    rowConfig: 'double' as const,
    holeSpacing: 32,
    notes: 'For permanent shelf installations'
  },
  {
    id: 'pantry-system',
    title: 'Pantry Storage System',
    description: 'Dense 32mm grid for pantry and storage cabinets',
    cabinetWidth: 900,
    cabinetHeight: 2000,
    cabinetDepth: 570,
    thickness: 18,
    patternType: 'system32_row' as PatternId,
    rowConfig: 'double' as const,
    holeSpacing: 32,
    notes: 'High-density storage configuration'
  },
  {
    id: 'single-row',
    title: 'Single Row System',
    description: 'Single 32mm row for basic shelving needs',
    cabinetWidth: 400,
    cabinetHeight: 600,
    cabinetDepth: 350,
    thickness: 18,
    patternType: 'system32_row' as PatternId,
    rowConfig: 'single' as const,
    holeSpacing: 32,
    notes: 'Simplified setup for basic cabinets'
  },
  {
    id: 'custom-spacing',
    title: 'Custom Spacing System',
    description: 'Non-standard spacing for special applications',
    cabinetWidth: 500,
    cabinetHeight: 1000,
    cabinetDepth: 450,
    thickness: 18,
    patternType: 'system32_row' as PatternId,
    rowConfig: 'double' as const,
    holeSpacing: 32,
    notes: 'Custom dimensions and spacing'
  }
];

export default function System32Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-shelving');
  const [cabinetWidth, setCabinetWidth] = useState(600);
  const [cabinetHeight, setCabinetHeight] = useState(800);
  const [cabinetDepth, setCabinetDepth] = useState(570);
  const [thickness, setThickness] = useState(18);
  const [selectedPattern, setSelectedPattern] = useState<PatternId>('system32_row');
  const [rowConfig, setRowConfig] = useState<'single' | 'double'>('double');
  const [holeSpacing, setHoleSpacing] = useState(32);
  const [firstHoleFromBottom, setFirstHoleFromBottom] = useState(37);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.3);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<'side' | 'shelf'>('side');

  const currentUseCase = SYSTEM32_USE_CASES.find(uc => uc.id === selectedUseCase);
  const system32Patterns = getPatternsByCategory(PATTERN_CATEGORIES.SYSTEM32);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = SYSTEM32_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setCabinetWidth(found.cabinetWidth);
        setCabinetHeight(found.cabinetHeight);
        setCabinetDepth(found.cabinetDepth);
        setThickness(found.thickness);
        setSelectedPattern(found.patternType);
        setRowConfig(found.rowConfig);
        setHoleSpacing(found.holeSpacing);
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
      setSelectedPattern(currentUseCase.patternType);
      setRowConfig(currentUseCase.rowConfig);
      setHoleSpacing(currentUseCase.holeSpacing);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate System 32 patterns
  const handleGeneratePatterns = () => {
    // Generate patterns for cabinet sides
    const leftSidePattern = generateCNCPattern(selectedPattern, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'inside',
      rowConfig
    });

    const rightSidePattern = generateCNCPattern(selectedPattern, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomRight',
      face: 'inside',
      rowConfig
    });

    // Generate patterns for fixed shelves
    const shelfPatterns = [];
    const shelfCount = Math.floor((cabinetHeight - 100) / 200); // Approximate shelf positions
    
    for (let i = 0; i < shelfCount; i++) {
      const shelfY = 100 + (i * 200); // Start 100mm from bottom, space every 200mm
      
      const shelfPattern = generateCNCPattern(selectedPattern, {
        partType: 'fixedShelf',
        length: cabinetWidth - 36, // Account for side thickness
        width: cabinetDepth,
        thickness,
        origin: 'bottomLeft',
        face: 'top',
        rowConfig: 'single'
      });
      
      if (shelfPattern) {
        shelfPattern.name = `Fixed Shelf ${i + 1}`;
        shelfPatterns.push(shelfPattern);
      }
    }

    if (!leftSidePattern || !rightSidePattern) {
      toast.error('Failed to generate System 32 patterns');
      return;
    }

    // Update pattern names
    leftSidePattern.name = 'System 32 - Left Side';
    rightSidePattern.name = 'System 32 - Right Side';

    const allPatterns = [leftSidePattern, rightSidePattern, ...shelfPatterns];
    setPatterns(allPatterns);
    setCurrentStep(3);
    toast.success(`Generated System 32 patterns: ${allPatterns.length} parts`);
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
      patternType: selectedPattern,
      rowConfig,
      holeSpacing,
      firstHoleFromBottom,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system32-patterns-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Patterns exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('system32Patterns', JSON.stringify({
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      patternType: selectedPattern,
      rowConfig,
      holeSpacing,
      firstHoleFromBottom,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Patterns saved!');
    router.push('/use-cases/cabinet-assembly');
  };

  const allHoles = patterns.flatMap((p) => p.holes);
  const currentPattern = selectedPart === 'side' ? patterns[0] : patterns.find(p => p.name.includes('Shelf'));

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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Grid3x3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  System 32 Shelving
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure 32mm system drilling for adjustable shelving
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
                    Select Shelving System
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SYSTEM32_USE_CASES.map((useCase) => (
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
                            {useCase.rowConfig} row
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {useCase.holeSpacing}mm spacing
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
                    System 32 Configuration
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
                        <Label>Side Thickness (mm)</Label>
                        <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                      </div>
                    </div>

                    {/* System 32 Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">System 32 Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Row Configuration</Label>
                          <Select value={rowConfig} onValueChange={(v: 'single' | 'double') => setRowConfig(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Row</SelectItem>
                              <SelectItem value="double">Double Row (Standard)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Hole Spacing (mm)</Label>
                          <Input type="number" value={holeSpacing} onChange={(e) => setHoleSpacing(Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>First Hole from Bottom (mm)</Label>
                          <Input type="number" value={firstHoleFromBottom} onChange={(e) => setFirstHoleFromBottom(Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>Pattern Type</Label>
                          <Select value={selectedPattern} onValueChange={(v: PatternId) => setSelectedPattern(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {system32Patterns.map((pattern) => (
                                <SelectItem key={pattern.id} value={pattern.id}>
                                  {pattern.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            System 32 Information
                          </div>
                          <div>• 32mm spacing is the European standard for adjustable shelving</div>
                          <div>• Double row provides maximum flexibility for shelf positioning</div>
                          <div>• First hole typically 37mm from bottom edge</div>
                          <div>• Standard 5mm holes for shelf support pins</div>
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
                      Generate Patterns
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
                      Generated System 32 Patterns
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
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={selectedPart === 'side' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('side')}
                    >
                      Cabinet Sides
                    </Button>
                    <Button
                      variant={selectedPart === 'shelf' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPart('shelf')}
                      disabled={patterns.filter(p => p.name.includes('Shelf')).length === 0}
                    >
                      Fixed Shelves ({patterns.filter(p => p.name.includes('Shelf')).length})
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
                                  fill="#8b5cf6"
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
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">
                            {selectedPart === 'side' ? 'Side Holes' : 'Shelf Holes'}
                          </div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{allHoles.length}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Holes</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{holeSpacing}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Spacing (mm)</div>
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
                    <Link href="/use-cases/cabinet-assembly">
                      <Button>
                        Next: Cabinet Assembly
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
                Current Configuration
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
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Row Config:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {rowConfig}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Hole Spacing:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {holeSpacing}mm
                  </span>
                </div>
              </div>
            </Card>

            {/* System 32 Tips */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                System 32 Guidelines
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>32mm spacing ensures compatibility with European hardware</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Double rows allow shelves to be positioned at any 32mm increment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>First hole 37mm from bottom provides clearance for base</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>5mm holes accommodate standard shelf support pins</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Leave 64mm minimum between rows for structural integrity</span>
                </div>
              </div>
            </Card>

            {/* Pattern Summary */}
            {currentStep === 3 && patterns.length > 0 && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Pattern Summary
                </h3>
                <div className="space-y-3">
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
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Next Steps
                </h3>
                <div className="space-y-2">
                  <Link href="/use-cases/cabinet-assembly">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Configure Cabinet Assembly
                    </Button>
                  </Link>
                  <Link href="/use-cases/complete-cabinet">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Complete Cabinet Workflow
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
