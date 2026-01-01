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
  DoorOpen, 
  Settings, 
  Download, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Archive,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/types/domain/cnc.types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  getPatternsByBrand,
  HARDWARE_BRANDS,
  type PatternId
} from '@/lib/drill-patterns-library';

const HINGE_USE_CASES = [
  {
    id: 'standard-kitchen',
    title: 'Standard Kitchen Cabinet',
    description: 'Typical kitchen cabinet doors with Blum ClipTop hinges',
    doorWidth: 600,
    doorHeight: 800,
    thickness: 18,
    hingeType: 'blum_cliptop_hinge_100' as PatternId,
    overlay: 'full',
    notes: 'Most common kitchen cabinet setup'
  },
  {
    id: 'wide-opening',
    title: 'Wide Opening Cabinet',
    description: 'Cabinets requiring 155° opening for full access',
    doorWidth: 600,
    doorHeight: 800,
    thickness: 18,
    hingeType: 'blum_cliptop_hinge_155' as PatternId,
    overlay: 'full',
    notes: 'For corner cabinets or full access requirements'
  },
  {
    id: 'premium-hettich',
    title: 'Premium Hettich System',
    description: 'High-end cabinets with Hettich Sensys hinges',
    doorWidth: 600,
    doorHeight: 800,
    thickness: 18,
    hingeType: 'hettich_sensys_8645_110' as PatternId,
    overlay: 'full',
    notes: 'Premium European cabinet systems'
  },
  {
    id: 'custom-door',
    title: 'Custom Door Size',
    description: 'Configure for your specific door dimensions',
    doorWidth: 500,
    doorHeight: 700,
    thickness: 18,
    hingeType: 'blum_cliptop_hinge_100' as PatternId,
    overlay: 'partial',
    notes: 'Custom dimensions for special applications'
  }
];

export default function KitchenDoorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-kitchen');
  const [doorWidth, setDoorWidth] = useState(600);
  const [doorHeight, setDoorHeight] = useState(800);
  const [thickness, setThickness] = useState(18);
  const [selectedHinge, setSelectedHinge] = useState<PatternId>('blum_cliptop_hinge_100');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [overlay, setOverlay] = useState<'full' | 'partial' | 'inset'>('full');
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = HINGE_USE_CASES.find(uc => uc.id === selectedUseCase);
  const hingePatterns = getPatternsByCategory(PATTERN_CATEGORIES.HINGE);
  const filteredHingePatterns = selectedBrand === 'all' 
    ? hingePatterns 
    : hingePatterns.filter(pattern => pattern.brand === selectedBrand);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = HINGE_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setDoorWidth(found.doorWidth);
        setDoorHeight(found.doorHeight);
        setThickness(found.thickness);
        setSelectedHinge(found.hingeType);
        setOverlay(found.overlay as any);
      }
    }
  }, [searchParams]);

  // Update dimensions when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setDoorWidth(currentUseCase.doorWidth);
      setDoorHeight(currentUseCase.doorHeight);
      setThickness(currentUseCase.thickness);
      setSelectedHinge(currentUseCase.hingeType);
      setOverlay(currentUseCase.overlay as any);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate hinge pattern
  const handleGeneratePattern = () => {
    const pattern = generateCNCPattern(selectedHinge, {
      partType: 'door',
      length: doorHeight,
      width: doorWidth,
      thickness,
      origin: 'bottomLeft',
      face: 'front'
    });

    if (!pattern) {
      toast.error('Failed to generate hinge pattern');
      return;
    }

    setPatterns([pattern]);
    setCurrentStep(3);
    toast.success(`Generated ${AVAILABLE_PATTERNS[selectedHinge]?.label} pattern`);
  };

  // Export pattern
  const handleExport = () => {
    if (patterns.length === 0) {
      toast.error('No pattern to export');
      return;
    }

    const data = {
      useCase: selectedUseCase,
      doorWidth,
      doorHeight,
      thickness,
      hingeType: selectedHinge,
      overlay,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitchen-door-hinges-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('kitchenDoorPattern', JSON.stringify({
      useCase: selectedUseCase,
      doorWidth,
      doorHeight,
      thickness,
      hingeType: selectedHinge,
      overlay,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Pattern saved!');
    router.push('/use-cases/drawer-slides');
  };

  const allHoles = patterns.flatMap((p) => p.holes);

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
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DoorOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Kitchen Cabinet Door Hinges
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure hinge drilling patterns for cabinet doors
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
                  <span className="font-medium">Generate Pattern</span>
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
                    Select Cabinet Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HINGE_USE_CASES.map((useCase) => (
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
                            {useCase.doorWidth} × {useCase.doorHeight} mm
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {AVAILABLE_PATTERNS[useCase.hingeType]?.label}
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
                    Door Configuration
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Door Dimensions */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Door Dimensions</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Width (mm)</Label>
                          <Input type="number" value={doorWidth} onChange={(e) => setDoorWidth(Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>Height (mm)</Label>
                          <Input type="number" value={doorHeight} onChange={(e) => setDoorHeight(Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>Thickness (mm)</Label>
                          <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                        </div>
                      </div>
                    </div>

                    {/* Hinge Selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Hinge Type</h3>
                      
                      {/* Brand Filter */}
                      <div className="mb-3">
                        <Label className="text-sm font-medium">Brand</Label>
                        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Brands</SelectItem>
                            {HARDWARE_BRANDS.filter(brand => 
                              hingePatterns.some(pattern => pattern.brand === brand)
                            ).map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Hinge Selection */}
                      <Select value={selectedHinge} onValueChange={(v: PatternId) => setSelectedHinge(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredHingePatterns.map((pattern) => (
                            <SelectItem key={pattern.id} value={pattern.id}>
                              <div className="flex items-center gap-2">
                                <span>{pattern.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {pattern.angle}°
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedHinge && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                          <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                            <div className="font-medium text-slate-900 dark:text-white mb-1">
                              {AVAILABLE_PATTERNS[selectedHinge]?.label}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {AVAILABLE_PATTERNS[selectedHinge]?.brand}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {AVAILABLE_PATTERNS[selectedHinge]?.angle}°
                              </Badge>
                              {AVAILABLE_PATTERNS[selectedHinge]?.applications && (
                                <Badge variant="outline" className="text-xs">
                                  {AVAILABLE_PATTERNS[selectedHinge]?.applications[0]}
                                </Badge>
                              )}
                            </div>
                            <div>{AVAILABLE_PATTERNS[selectedHinge]?.description}</div>
                            <div className="mt-2">
                              Cup Diameter: {AVAILABLE_PATTERNS[selectedHinge]?.cupDiameter}mm | 
                              Cup Depth: {AVAILABLE_PATTERNS[selectedHinge]?.cupDepth}mm
                            </div>
                            {AVAILABLE_PATTERNS[selectedHinge]?.features && (
                              <div className="mt-2">
                                <div className="text-xs font-medium mb-1">Features:</div>
                                <div className="flex flex-wrap gap-1">
                                  {AVAILABLE_PATTERNS[selectedHinge]?.features.map((feature: string) => (
                                    <Badge key={feature} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overlay Type */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Door Overlay</h3>
                      <Select value={overlay} onValueChange={(v: 'full' | 'partial' | 'inset') => setOverlay(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Overlay</SelectItem>
                          <SelectItem value="partial">Partial Overlay</SelectItem>
                          <SelectItem value="inset">Inset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleGeneratePattern}>
                      Generate Pattern
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
                      Generated Pattern
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

                  <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto mb-4">
                    <svg
                      width={doorWidth * previewScale}
                      height={doorHeight * previewScale}
                      className="border-2 border-white/20 bg-amber-100/10 mx-auto"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={doorWidth * previewScale}
                        height={doorHeight * previewScale}
                        fill="#E8D4B8"
                        opacity={0.3}
                      />
                      {patterns.map((pattern) => (
                        <g key={pattern.id}>
                          {pattern.holes.map((hole, hIndex) => (
                            <g key={hole.id}>
                              <circle
                                cx={hole.x * previewScale}
                                cy={hole.y * previewScale}
                                r={(hole.diameter / 2) * previewScale}
                                fill="#3b82f6"
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
                      ))}
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{allHoles.length}</div>
                      <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Total Holes</div>
                    </Card>
                    <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{doorWidth}</div>
                      <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Width (mm)</div>
                    </Card>
                    <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{doorHeight}</div>
                      <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Height (mm)</div>
                    </Card>
                    <Card className="p-3 bg-slate-50 dark:bg-[#151c28]">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{thickness}</div>
                      <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Thickness (mm)</div>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Configuration
                    </Button>
                    <Link href="/use-cases/drawer-slides">
                      <Button>
                        Next: Drawer Slides
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
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Door Size:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {doorWidth} × {doorHeight} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Hinge:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {AVAILABLE_PATTERNS[selectedHinge]?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Overlay:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {overlay}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                Quick Tips
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Standard kitchen doors use 2-3 hinges depending on height</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Hinge cups are typically placed 100mm from top/bottom edges</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>35mm cup diameter is standard for most European hinges</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Verify door thickness matches hinge specifications</span>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            {currentStep === 3 && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Next Steps
                </h3>
                <div className="space-y-2">
                  <Link href="/use-cases/drawer-slides">
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Configure Drawer Slides
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
