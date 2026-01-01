import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
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
  Archive, 
  Settings, 
  Download, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
  Grid3x3
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/types/domain/cnc.types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  HARDWARE_BRANDS,
  type PatternId
} from '@/lib/drill-patterns-library';

const DRAWER_USE_CASES = [
  {
    id: 'standard-blum',
    title: 'Standard Blum TANDEM',
    description: 'Most common drawer slide system for kitchen cabinets',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    slideType: 'blum_tandem_box' as PatternId,
    rowConfig: 'single' as const,
    notes: 'Industry standard for kitchen cabinets'
  },
  {
    id: 'premium-blum',
    title: 'Premium Blum MOVENTO',
    description: 'High-end drawer system with soft-close and full extension',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    slideType: 'blum_movento' as PatternId,
    rowConfig: 'single' as const,
    notes: 'Premium option with advanced features'
  },
  {
    id: 'hettich-innotech',
    title: 'Hettich InnoTech Atira',
    description: 'European drawer system with push-to-open technology',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    slideType: 'hettich_innotech_atira' as PatternId,
    rowConfig: 'single' as const,
    notes: 'Advanced features with push-to-open'
  },
  {
    id: 'double-drawer',
    title: 'Double Drawer Stack',
    description: 'Two drawers stacked with shared slide holes',
    cabinetWidth: 600,
    cabinetHeight: 800,
    cabinetDepth: 570,
    thickness: 18,
    slideType: 'blum_tandem_box' as PatternId,
    rowConfig: 'double' as const,
    notes: 'Optimized for double drawer configurations'
  },
  {
    id: 'custom-cabinet',
    title: 'Custom Cabinet Size',
    description: 'Configure for your specific cabinet dimensions',
    cabinetWidth: 500,
    cabinetHeight: 700,
    cabinetDepth: 520,
    thickness: 18,
    slideType: 'blum_tandem_box' as PatternId,
    rowConfig: 'single' as const,
    notes: 'Custom dimensions for special applications'
  }
];

export default function DrawerSlidesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-blum');
  const [cabinetWidth, setCabinetWidth] = useState(600);
  const [cabinetHeight, setCabinetHeight] = useState(800);
  const [cabinetDepth, setCabinetDepth] = useState(570);
  const [thickness, setThickness] = useState(18);
  const [selectedSlide, setSelectedSlide] = useState<PatternId>('blum_tandem_box');
  const [rowConfig, setRowConfig] = useState<'single' | 'double'>('single');
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');

  const currentUseCase = DRAWER_USE_CASES.find(uc => uc.id === selectedUseCase);
  const drawerPatterns = getPatternsByCategory(PATTERN_CATEGORIES.DRAWER);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = DRAWER_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setCabinetWidth(found.cabinetWidth);
        setCabinetHeight(found.cabinetHeight);
        setCabinetDepth(found.cabinetDepth);
        setThickness(found.thickness);
        setSelectedSlide(found.slideType);
        setRowConfig(found.rowConfig);
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
      setSelectedSlide(currentUseCase.slideType);
      setRowConfig(currentUseCase.rowConfig);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate drawer slide patterns for both sides
  const handleGeneratePatterns = () => {
    const leftPattern = generateCNCPattern(selectedSlide, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'inside',
      rowConfig
    });

    const rightPattern = generateCNCPattern(selectedSlide, {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomRight',
      face: 'inside',
      rowConfig
    });

    if (!leftPattern || !rightPattern) {
      toast.error('Failed to generate drawer slide patterns');
      return;
    }

    // Update pattern names to indicate left/right
    leftPattern.name = `${AVAILABLE_PATTERNS[selectedSlide]?.label} - Left Side`;
    rightPattern.name = `${AVAILABLE_PATTERNS[selectedSlide]?.label} - Right Side`;

    setPatterns([leftPattern, rightPattern]);
    setCurrentStep(3);
    toast.success(`Generated ${AVAILABLE_PATTERNS[selectedSlide]?.label} patterns for both sides`);
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
      slideType: selectedSlide,
      rowConfig,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drawer-slides-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Patterns exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('drawerSlidePatterns', JSON.stringify({
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      slideType: selectedSlide,
      rowConfig,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Patterns saved!');
    router.push('/use-cases/system-32');
  };

  const allHoles = patterns.flatMap((p) => p.holes);
  const currentPattern = selectedSide === 'left' ? patterns[0] : patterns[1];

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
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Archive className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Drawer Slide Configuration
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure drawer slide drilling patterns for cabinet sides
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
                    Select Drawer System
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DRAWER_USE_CASES.map((useCase) => (
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
                            {AVAILABLE_PATTERNS[useCase.slideType]?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {useCase.rowConfig} row
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
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Step 2: Configuration */}
              <TabsContent value="2">
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                    Cabinet Configuration
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

                    {/* Slide Selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Drawer Slide Type</h3>
                      <Select value={selectedSlide} onValueChange={(v: PatternId) => setSelectedSlide(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {drawerPatterns.map((pattern) => (
                            <SelectItem key={pattern.id} value={pattern.id}>
                              {pattern.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedSlide && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                          <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                            <div className="font-medium text-slate-900 dark:text-white mb-1">
                              {AVAILABLE_PATTERNS[selectedSlide]?.label}
                            </div>
                            <div>{AVAILABLE_PATTERNS[selectedSlide]?.description}</div>
                            <div className="mt-2">
                              Front Setback: {AVAILABLE_PATTERNS[selectedSlide]?.refRowFromFront}mm | 
                              Hole Spacing: {AVAILABLE_PATTERNS[selectedSlide]?.rearHoleOffset}mm
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Row Configuration */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Row Configuration</h3>
                      <Select value={rowConfig} onValueChange={(v: 'single' | 'double') => setRowConfig(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Row (Standard)</SelectItem>
                          <SelectItem value="double">Double Row (Double Stacked Drawers)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-2 text-sm text-slate-500 dark:text-[#90a7cb]">
                        {rowConfig === 'single' 
                          ? 'Single row of holes for standard drawer configurations'
                          : 'Double rows for stacked drawer configurations'
                        }
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
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Step 3: Pattern Preview */}
              <TabsContent value="3">
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Generated Patterns
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

                  {/* Side Selection */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={selectedSide === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSide('left')}
                    >
                      Left Side
                    </Button>
                    <Button
                      variant={selectedSide === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSide('right')}
                    >
                      Right Side
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSide(selectedSide === 'left' ? 'right' : 'left')}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {currentPattern && (
                    <>
                      <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto mb-4">
                        <svg
                          width={cabinetDepth * previewScale}
                          height={cabinetHeight * previewScale}
                          className="border-2 border-white/20 bg-amber-100/10 mx-auto"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={cabinetDepth * previewScale}
                            height={cabinetHeight * previewScale}
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
                                  fill="#10b981"
                                  opacity={0.6}
                                  stroke="white"
                                  strokeWidth={1}
                                />
                                <text
                                  x={hole.x * previewScale}
                                  y={hole.y * previewScale}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize={10}
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
                          min="0.2"
                          max="0.8"
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
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Side Holes</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{allHoles.length}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Holes</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{cabinetDepth}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Depth (mm)</div>
                        </Card>
                        <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{cabinetHeight}</div>
                          <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Height (mm)</div>
                        </Card>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Configuration
                    </Button>
                    <Link href="/use-cases/system-32">
                      <Button>
                        Next: System 32
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
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Slide Type:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {AVAILABLE_PATTERNS[selectedSlide]?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Row Config:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {rowConfig}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                Installation Tips
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Standard setback is 37mm from cabinet front</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Hole spacing varies by slide type (typically 224-280mm)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use 5mm drill bit for most drawer slide mounting holes</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Verify cabinet depth matches slide length requirements</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Double row only needed for stacked drawer configurations</span>
                </div>
              </div>
            </Card>

            {/* Pattern Summary */}
            {currentStep === 3 && patterns.length > 0 && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
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
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Next Steps
                </h3>
                <div className="space-y-2">
                  <Link href="/use-cases/system-32">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Configure System 32 Shelving
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
