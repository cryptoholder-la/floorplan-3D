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
  Archive,
  Grid3x3,
  Ruler,
  Calculator,
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
  HARDWARE_BRANDS,
  type PatternId
} from '@/lib/drill-patterns-library';

const PROFESSIONAL_CABINET_USE_CASES = [
  {
    id: 'custom-frameless',
    title: 'Custom Frameless Cabinet',
    description: 'Professional frameless cabinet with advanced hardware integration',
    cabinetWidth: 900,
    cabinetHeight: 2400,
    cabinetDepth: 560,
    thickness: 18,
    hingeType: 'blum_cliptop_hinge_155' as PatternId,
    drawerType: 'blum_tandem_plus_antic' as PatternId,
    notes: 'High-end frameless with premium hardware'
  },
  {
    id: 'inset-face-frame',
    title: 'Inset Face Frame Cabinet',
    description: 'Traditional inset cabinet with precise tolerances and premium hardware',
    cabinetWidth: 900,
    cabinetHeight: 2400,
    cabinetDepth: 560,
    thickness: 19,
    hingeType: 'salice_invisible_hinge_180' as PatternId,
    drawerType: 'grass_dynapro' as PatternId,
    notes: 'Premium inset with invisible hinges'
  },
  {
    id: 'commercial-grade',
    title: 'Commercial Grade Cabinet',
    description: 'Heavy-duty commercial cabinet with industrial hardware',
    cabinetWidth: 1200,
    cabinetHeight: 2100,
    cabinetDepth: 600,
    thickness: 19,
    hingeType: 'american_heavy_duty_hinge' as PatternId,
    drawerType: 'kv_8400_heavy_duty' as PatternId,
    notes: 'Commercial grade with heavy-duty hardware'
  },
  {
    id: 'luxury-european',
    title: 'Luxury European System',
    description: 'Premium European cabinet with advanced features and finishes',
    cabinetWidth: 900,
    cabinetHeight: 2400,
    cabinetDepth: 580,
    thickness: 18,
    hingeType: 'hettich_sensys_153' as PatternId,
    drawerType: 'hafele_4d_slides' as PatternId,
    notes: 'Luxury European with advanced features'
  }
];

const PROFESSIONAL_CONFIGURATIONS = {
  frameless_standard: {
    id: "frameless_standard",
    label: "Frameless Standard",
    construction: "frameless",
    tolerances: "±1mm",
    backPanel: "1/4\" plywood",
    shelfSupport: "dowel",
    applications: ["modern", "minimalist", "european"],
    features: ["full overlay", "adjustable shelves", "concealed hinges"]
  },
  inset_traditional: {
    id: "inset_traditional",
    label: "Inset Traditional",
    construction: "face_frame",
    tolerances: "±0.5mm",
    backPanel: "1/2\" plywood",
    shelfSupport: "dowel",
    applications: ["traditional", "custom", "high-end"],
    features: ["inset doors", "exposed hinges", "traditional joinery"]
  },
  commercial_heavy: {
    id: "commercial_heavy",
    label: "Commercial Heavy Duty",
    construction: "frameless",
    tolerances: "±2mm",
    backPanel: "3/4\" plywood",
    shelfSupport: "metal_bracket",
    applications: ["commercial", "institutional", "industrial"],
    features: ["heavy duty", "metal hardware", "reinforced construction"]
  },
  luxury_european: {
    id: "luxury_european",
    label: "Luxury European",
    construction: "frameless",
    tolerances: "±0.5mm",
    backPanel: "1/2\" plywood",
    shelfSupport: "integrated",
    applications: ["luxury", "premium", "architectural"],
    features: ["premium hardware", "soft close", "integrated lighting"]
  }
};

export default function ProfessionalCabinetDesignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('custom-frameless');
  const [cabinetWidth, setCabinetWidth] = useState(900);
  const [cabinetHeight, setCabinetHeight] = useState(2400);
  const [cabinetDepth, setCabinetDepth] = useState(560);
  const [thickness, setThickness] = useState(18);
  const [selectedHinge, setSelectedHinge] = useState<PatternId>('blum_cliptop_hinge_155');
  const [selectedDrawer, setSelectedDrawer] = useState<PatternId>('blum_tandem_plus_antic');
  const [selectedConfig, setSelectedConfig] = useState<string>('frameless_standard');
  const [doorCount, setDoorCount] = useState(2);
  const [drawerCount, setDrawerCount] = useState(3);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.15);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = PROFESSIONAL_CABINET_USE_CASES.find(uc => uc.id === selectedUseCase);
  const hingePatterns = getPatternsByCategory(PATTERN_CATEGORIES.HINGE);
  const drawerPatterns = getPatternsByCategory(PATTERN_CATEGORIES.DRAWER);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = PROFESSIONAL_CABINET_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setCabinetWidth(found.cabinetWidth);
        setCabinetHeight(found.cabinetHeight);
        setCabinetDepth(found.cabinetDepth);
        setThickness(found.thickness);
        setSelectedHinge(found.hingeType);
        setSelectedDrawer(found.drawerType);
      }
    }
  }, [searchParams]);

  // Update settings when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setCabinetWidth(currentUseCase.cabinetWidth);
      setCabinetHeight(currentUseCase.cabinetHeight);
      setCabinetDepth(currentUseCase.cabinetDepth);
      setThickness(currentUseCase.thickness);
      setSelectedHinge(currentUseCase.hingeType);
      setSelectedDrawer(currentUseCase.drawerType);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate cabinet patterns
  const handleGeneratePattern = () => {
    const generatedPatterns: DrillPattern[] = [];

    // Generate door patterns
    const doorWidth = cabinetWidth / doorCount - 3; // Account for door spacing
    const doorHeight = cabinetHeight - 100; // Standard top/bottom clearance
    
    for (let i = 0; i < doorCount; i++) {
      const doorPattern = generateCNCPattern(selectedHinge, {
        partType: 'door',
        length: doorHeight,
        width: doorWidth,
        thickness,
        origin: 'bottomLeft',
        face: 'front'
      });
      
      if (doorPattern) {
        generatedPatterns.push(doorPattern);
      }
    }

    // Generate drawer patterns
    const drawerHeight = 180; // Standard drawer height
    const drawerWidth = cabinetWidth - 50; // Clearance for slides
    
    for (let i = 0; i < drawerCount; i++) {
      const drawerPattern = generateCNCPattern(selectedDrawer, {
        partType: 'drawer',
        length: drawerWidth,
        width: cabinetDepth - 25,
        thickness: 18,
        origin: 'bottomLeft',
        face: 'front'
      });
      
      if (drawerPattern) {
        generatedPatterns.push(drawerPattern);
      }
    }

    // Generate cabinet side patterns (System 32)
    const sidePattern = generateCNCPattern('system32_standard_row', {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'interior'
    });

    if (sidePattern) {
      generatedPatterns.push(sidePattern);
    }

    // Generate top/bottom patterns
    const topBottomPattern = generateCNCPattern('system32_standard_row', {
      partType: 'cabinetTopBottom',
      length: cabinetWidth,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'interior'
    });

    if (topBottomPattern) {
      generatedPatterns.push(topBottomPattern);
    }

    if (generatedPatterns.length > 0) {
      setPatterns(generatedPatterns);
      setCurrentStep(3);
      toast.success(`Generated ${generatedPatterns.length} professional patterns`);
    } else {
      toast.error('Failed to generate patterns');
    }
  };

  // Export pattern
  const handleExport = () => {
    if (patterns.length === 0) {
      toast.error('No pattern to export');
      return;
    }

    const data = {
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      hingeType: selectedHinge,
      drawerType: selectedDrawer,
      configuration: selectedConfig,
      doorCount,
      drawerCount,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `professional-cabinet-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('professionalCabinetPattern', JSON.stringify({
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      hingeType: selectedHinge,
      drawerType: selectedDrawer,
      configuration: selectedConfig,
      doorCount,
      drawerCount,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Pattern saved!');
    router.push('/use-cases/advanced-design');
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
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Box className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Professional Cabinet Design
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Advanced cabinet design with professional hardware integration
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <Tabs value={currentStep.toString()} onValueChange={(v) => setCurrentStep(Number(v))}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1">Use Case</TabsTrigger>
                  <TabsTrigger value="2">Settings</TabsTrigger>
                  <TabsTrigger value="3">Pattern</TabsTrigger>
                </TabsList>

                {/* Step 1: Use Case Selection */}
                <TabsContent value="1" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Select Professional Use Case</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PROFESSIONAL_CABINET_USE_CASES.map((useCase) => (
                        <Card
                          key={useCase.id}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedUseCase === useCase.id
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-white/5 hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedUseCase(useCase.id)}
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {useCase.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-[#90a7cb]">
                            {useCase.description}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Step 2: Configuration */}
                <TabsContent value="2" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Cabinet Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <Label>Door Count</Label>
                        <Select value={doorCount.toString()} onValueChange={(v) => setDoorCount(Number(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Door</SelectItem>
                            <SelectItem value="2">2 Doors</SelectItem>
                            <SelectItem value="3">3 Doors</SelectItem>
                            <SelectItem value="4">4 Doors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Drawer Count</Label>
                        <Select value={drawerCount.toString()} onValueChange={(v) => setDrawerCount(Number(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Drawer</SelectItem>
                            <SelectItem value="2">2 Drawers</SelectItem>
                            <SelectItem value="3">3 Drawers</SelectItem>
                            <SelectItem value="4">4 Drawers</SelectItem>
                            <SelectItem value="5">5 Drawers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Professional Configuration */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Professional Configuration</h3>
                    <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PROFESSIONAL_CONFIGURATIONS).map((config) => (
                          <SelectItem key={config.id} value={config.id}>
                            <div className="flex items-center gap-2">
                              <span>{config.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {config.tolerances}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedConfig && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.label}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.construction}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.tolerances}
                            </Badge>
                          </div>
                          <div>Back Panel: {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.backPanel}</div>
                          <div>Shelf Support: {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.shelfSupport}</div>
                          {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.features && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.features.map((feature: string) => (
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

                  {/* Hardware Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Professional Hardware</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Hinge Type</Label>
                        <Select value={selectedHinge} onValueChange={(v: PatternId) => setSelectedHinge(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hingePatterns.filter(p => p.angle >= 110).map((pattern) => (
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
                      </div>
                      <div>
                        <Label>Drawer Type</Label>
                        <Select value={selectedDrawer} onValueChange={(v: PatternId) => setSelectedDrawer(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {drawerPatterns.map((pattern) => (
                              <SelectItem key={pattern.id} value={pattern.id}>
                                <div className="flex items-center gap-2">
                                  <span>{pattern.label}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {pattern.brand}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleGeneratePattern} className="w-full">
                    Generate Professional Patterns
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </TabsContent>

                {/* Step 3: Pattern Preview */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Generated Professional Patterns</h3>
                    
                    {patterns.length > 0 ? (
                      <div className="space-y-4">
                        {/* Cabinet Overview */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Cabinet Overview</h4>
                          <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5 overflow-auto">
                            <svg
                              width={cabinetWidth * previewScale}
                              height={cabinetHeight * previewScale}
                              className="border border-slate-300 dark:border-slate-600"
                            >
                              {/* Cabinet outline */}
                              <rect
                                x="0"
                                y="0"
                                width={cabinetWidth * previewScale}
                                height={cabinetHeight * previewScale}
                                fill="#f8fafc"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              
                              {/* Door outlines */}
                              {Array.from({ length: doorCount }).map((_, i) => {
                                const doorWidth = (cabinetWidth / doorCount - 3) * previewScale;
                                const doorX = i * (cabinetWidth / doorCount) * previewScale;
                                const doorHeight = (cabinetHeight - 100) * previewScale;
                                const doorY = 50 * previewScale;
                                
                                return (
                                  <rect
                                    key={`door-${i}`}
                                    x={doorX}
                                    y={doorY}
                                    width={doorWidth}
                                    height={doorHeight}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="1"
                                    strokeDasharray="3,3"
                                  />
                                );
                              })}
                              
                              {/* Drawer outlines */}
                              {Array.from({ length: drawerCount }).map((_, i) => {
                                const drawerWidth = (cabinetWidth - 50) * previewScale;
                                const drawerX = 25 * previewScale;
                                const drawerHeight = 180 * previewScale;
                                const drawerY = (cabinetHeight - 100 - (i + 1) * 200) * previewScale;
                                
                                return (
                                  <rect
                                    key={`drawer-${i}`}
                                    x={drawerX}
                                    y={drawerY}
                                    width={drawerWidth}
                                    height={drawerHeight}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="1"
                                    strokeDasharray="3,3"
                                  />
                                );
                              })}
                              
                              {/* System 32 holes visualization */}
                              {patterns.slice(-2).flatMap((pattern, index) => 
                                pattern.holes.slice(0, 5).map((hole) => (
                                  <circle
                                    key={`system32-${index}-${hole.id}`}
                                    cx={hole.x * previewScale}
                                    cy={hole.y * previewScale}
                                    r={hole.diameter * previewScale / 2}
                                    fill="#8b5cf6"
                                    opacity="0.6"
                                  />
                                ))
                              )}
                            </svg>
                          </div>
                        </Card>

                        {/* Pattern Details */}
                        <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Pattern Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Configuration:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {PROFESSIONAL_CONFIGURATIONS[selectedConfig as keyof typeof PROFESSIONAL_CONFIGURATIONS]?.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Total Patterns:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {patterns.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Total Holes:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {allHoles.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Cabinet Size:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {cabinetWidth} × {cabinetHeight} × {cabinetDepth}mm
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Hardware:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {AVAILABLE_PATTERNS[selectedHinge]?.label} / {AVAILABLE_PATTERNS[selectedDrawer]?.label}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button onClick={handleExport} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export Patterns
                          </Button>
                          <Button onClick={handleSaveAndContinue} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Save & Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-[#90a7cb]">
                        <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No patterns generated yet</p>
                        <p className="text-sm">Configure your professional settings and generate patterns</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Use Case Info */}
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Professional Use Case
              </h3>
              {currentUseCase && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {currentUseCase.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-[#90a7cb]">
                      {currentUseCase.description}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                    <p>{currentUseCase.notes}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Professional Tips */}
            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Professional Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Precision tolerances of ±0.5mm for high-end cabinetry</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Use premium hardware for luxury applications</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Consider integrated lighting and soft-close features</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <p>Verify all measurements before cutting expensive materials</p>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            {currentStep === 3 && (
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-slate-200 dark:border-white/5">
                <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                  Next Steps
                </h3>
                <div className="space-y-2">
                  <Link href="/use-cases/advanced-design">
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="w-4 h-4 mr-2" />
                      Advanced Design
                    </Button>
                  </Link>
                  <Link href="/use-cases">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Browse All Use Cases
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
