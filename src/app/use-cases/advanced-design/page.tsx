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
  Box,
  Zap,
  Target,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/types/cnc.types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  HARDWARE_BRANDS,
  type PatternId
} from '@/lib/drill-patterns-library';

const ADVANCED_CABINET_USE_CASES = [
  {
    id: 'complex-corner-unit',
    title: 'Complex Corner Unit',
    description: 'Advanced corner cabinet with specialized hardware and custom joinery',
    cabinetWidth: 900,
    cabinetHeight: 2400,
    cabinetDepth: 900,
    thickness: 18,
    hingeType: 'hettich_wingline_l_107' as PatternId,
    drawerType: 'hafele_matrix' as PatternId,
    notes: 'Corner unit with blind corner solutions and specialized hardware'
  },
  {
    id: 'multi-material-composite',
    title: 'Multi-Material Composite',
    description: 'Hybrid cabinet combining multiple materials and advanced construction techniques',
    cabinetWidth: 1200,
    cabinetHeight: 2400,
    cabinetDepth: 600,
    thickness: 19,
    hingeType: 'grass_tiomos_153' as PatternId,
    drawerType: 'accuride_3832_75lb' as PatternId,
    notes: 'Advanced composite construction with mixed materials'
  },
  {
    id: 'automated-system',
    title: 'Automated Cabinet System',
    description: 'Smart cabinet with electronic components, lighting, and automated features',
    cabinetWidth: 1000,
    cabinetHeight: 2400,
    cabinetDepth: 580,
    thickness: 18,
    hingeType: 'blum_nexis_107' as PatternId,
    drawerType: 'blum_movento_plus' as PatternId,
    notes: 'Integrated automation and smart features'
  },
  {
    id: 'architectural-custom',
    title: 'Architectural Custom Design',
    description: 'Bespoke architectural cabinet with custom dimensions and specialized requirements',
    cabinetWidth: 1500,
    cabinetHeight: 3000,
    cabinetDepth: 650,
    thickness: 20,
    hingeType: 'salice_invisible_hinge_180' as PatternId,
    drawerType: 'knape_vogt_5300' as PatternId,
    notes: 'Custom architectural specifications and specialized construction'
  }
];

const ADVANCED_FEATURES = {
  blind_corner: {
    id: "blind_corner",
    label: "Blind Corner Solution",
    type: "hardware",
    complexity: "high",
    applications: ["corner_cabinets", "max_storage", "accessibility"],
    features: ["pivot mechanisms", "full access", "space optimization"]
  },
  soft_close_automation: {
    id: "soft_close_automation",
    label: "Soft Close Automation",
    type: "electronic",
    complexity: "medium",
    applications: ["luxury", "quiet_operation", "user_experience"],
    features: ["dampening", "automatic_close", "adjustable_force"]
  },
  integrated_lighting: {
    id: "integrated_lighting",
    label: "Integrated Lighting System",
    type: "electrical",
    complexity: "medium",
    applications: ["modern", "task_lighting", "ambiance"],
    features: ["LED strips", "motion sensors", "dimmable"]
  },
  modular_system: {
    id: "modular_system",
    label: "Modular Construction",
    type: "construction",
    complexity: "high",
    applications: ["flexible", "reconfigurable", "commercial"],
    features: ["interchangeable", "tool_free", "expandable"]
  },
  smart_sensors: {
    id: "smart_sensors",
    label: "Smart Sensor Integration",
    type: "electronic",
    complexity: "high",
    applications: ["smart_home", "iot", "automation"],
    features: ["proximity", "weight_sensing", "connectivity"]
  }
};

export default function AdvancedCabinetDesignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('complex-corner-unit');
  const [cabinetWidth, setCabinetWidth] = useState(900);
  const [cabinetHeight, setCabinetHeight] = useState(2400);
  const [cabinetDepth, setCabinetDepth] = useState(900);
  const [thickness, setThickness] = useState(18);
  const [selectedHinge, setSelectedHinge] = useState<PatternId>('hettich_wingline_l_107');
  const [selectedDrawer, setSelectedDrawer] = useState<PatternId>('hafele_matrix');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [materialType, setMaterialType] = useState<string>('plywood_birch');
  const [constructionMethod, setConstructionMethod] = useState<string>('advanced_dowel');
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.12);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = ADVANCED_CABINET_USE_CASES.find(uc => uc.id === selectedUseCase);
  const hingePatterns = getPatternsByCategory(PATTERN_CATEGORIES.HINGE);
  const drawerPatterns = getPatternsByCategory(PATTERN_CATEGORIES.DRAWER);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = ADVANCED_CABINET_USE_CASES.find(uc => uc.id === useCase);
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

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Generate advanced cabinet patterns
  const handleGeneratePattern = () => {
    const generatedPatterns: DrillPattern[] = [];

    // Generate specialized door patterns for advanced configurations
    const doorPattern = generateCNCPattern(selectedHinge, {
      partType: 'door',
      length: cabinetHeight - 150,
      width: cabinetWidth - 50,
      thickness,
      origin: 'bottomLeft',
      face: 'front'
    });
    
    if (doorPattern) {
      generatedPatterns.push(doorPattern);
    }

    // Generate advanced drawer patterns
    const drawerPattern = generateCNCPattern(selectedDrawer, {
      partType: 'drawer',
      length: cabinetWidth - 100,
      width: cabinetDepth - 50,
      thickness: 19,
      origin: 'bottomLeft',
      face: 'front'
    });
    
    if (drawerPattern) {
      generatedPatterns.push(drawerPattern);
    }

    // Generate advanced system 32 patterns for complex configurations
    const sidePattern = generateCNCPattern('system32_double_row', {
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

    // Generate advanced dowel patterns for complex joinery
    const dowelPattern = generateCNCPattern('dowel_heavy_duty', {
      partType: 'cabinetSide',
      length: cabinetHeight,
      width: cabinetDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'interior'
    });

    if (dowelPattern) {
      generatedPatterns.push(dowelPattern);
    }

    // Generate patterns for selected advanced features
    selectedFeatures.forEach(featureId => {
      const feature = ADVANCED_FEATURES[featureId as keyof typeof ADVANCED_FEATURES];
      if (feature.type === 'hardware') {
        const featurePattern = generateCNCPattern('custom_hardware', {
          partType: 'custom',
          length: 100,
          width: 100,
          thickness: 10,
          origin: 'bottomLeft',
          face: 'custom'
        });
        if (featurePattern) {
          generatedPatterns.push(featurePattern);
        }
      }
    });

    if (generatedPatterns.length > 0) {
      setPatterns(generatedPatterns);
      setCurrentStep(3);
      toast.success(`Generated ${generatedPatterns.length} advanced patterns with ${selectedFeatures.length} features`);
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
      selectedFeatures,
      materialType,
      constructionMethod,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-cabinet-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Advanced pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('advancedCabinetPattern', JSON.stringify({
      useCase: selectedUseCase,
      cabinetWidth,
      cabinetHeight,
      cabinetDepth,
      thickness,
      hingeType: selectedHinge,
      drawerType: selectedDrawer,
      selectedFeatures,
      materialType,
      constructionMethod,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Advanced pattern saved!');
    router.push('/use-cases');
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Advanced Cabinet Design
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Complex cabinet systems with advanced features and automation
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
                  <span className="font-medium">Advanced Settings</span>
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
                  <TabsTrigger value="2">Advanced</TabsTrigger>
                  <TabsTrigger value="3">Pattern</TabsTrigger>
                </TabsList>

                {/* Step 1: Use Case Selection */}
                <TabsContent value="1" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Select Advanced Use Case</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ADVANCED_CABINET_USE_CASES.map((useCase) => (
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

                {/* Step 2: Advanced Configuration */}
                <TabsContent value="2" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Advanced Cabinet Dimensions</h3>
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
                    </div>
                  </div>

                  {/* Advanced Features Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Advanced Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.values(ADVANCED_FEATURES).map((feature) => (
                        <Card
                          key={feature.id}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedFeatures.includes(feature.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-white/5 hover:border-slate-300'
                          }`}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {feature.label}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {feature.complexity}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {feature.features.slice(0, 2).map((feat) => (
                              <Badge key={feat} variant="secondary" className="text-xs">
                                {feat}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-[#90a7cb]">
                            {feature.applications.join(', ')}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Material and Construction */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Material & Construction</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Material Type</Label>
                        <Select value={materialType} onValueChange={setMaterialType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plywood_birch">Birch Plywood</SelectItem>
                            <SelectItem value="plywood_oak">Oak Plywood</SelectItem>
                            <SelectItem value="mdf_hdf">MDF/HDF</SelectItem>
                            <SelectItem value="particleboard">Particleboard</SelectItem>
                            <SelectItem value="solid_wood">Solid Wood</SelectItem>
                            <SelectItem value="composite">Composite Material</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Construction Method</Label>
                        <Select value={constructionMethod} onValueChange={setConstructionMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advanced_dowel">Advanced Dowel</SelectItem>
                            <SelectItem value="cam_lock">Cam Lock</SelectItem>
                            <SelectItem value="mortise_tenon">Mortise & Tenon</SelectItem>
                            <SelectItem value="confirmat_screw">Confirmat Screw</SelectItem>
                            <SelectItem value="hybrid">Hybrid Method</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Hardware Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Advanced Hardware Systems</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Premium Hinge System</Label>
                        <Select value={selectedHinge} onValueChange={(v: PatternId) => setSelectedHinge(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hingePatterns.filter(p => p.angle >= 107).map((pattern) => (
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
                        <Label>Advanced Drawer System</Label>
                        <Select value={selectedDrawer} onValueChange={(v: PatternId) => setSelectedDrawer(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {drawerPatterns.filter(p => p.brand === 'Blum' || p.brand === 'Häfele' || p.brand === 'Grass').map((pattern) => (
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
                    Generate Advanced Patterns
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </TabsContent>

                {/* Step 3: Pattern Preview */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Generated Advanced Patterns</h3>
                    
                    {patterns.length > 0 ? (
                      <div className="space-y-4">
                        {/* Advanced Cabinet Overview */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Advanced Cabinet System</h4>
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
                              
                              {/* Advanced feature zones */}
                              {selectedFeatures.includes('blind_corner') && (
                                <g>
                                  <rect
                                    x={(cabinetWidth - 400) * previewScale}
                                    y="0"
                                    width={400 * previewScale}
                                    height={cabinetHeight * previewScale}
                                    fill="#fef3c7"
                                    stroke="#f59e0b"
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                    opacity="0.5"
                                  />
                                  <text
                                    x={(cabinetWidth - 200) * previewScale}
                                    y={cabinetHeight * previewScale / 2}
                                    textAnchor="middle"
                                    className="text-xs fill-amber-700"
                                  >
                                    Blind Corner
                                  </text>
                                </g>
                              )}
                              
                              {selectedFeatures.includes('integrated_lighting') && (
                                <g>
                                  <rect
                                    x="0"
                                    y={(cabinetHeight - 100) * previewScale}
                                    width={cabinetWidth * previewScale}
                                    height={100 * previewScale}
                                    fill="#fef3c7"
                                    stroke="#f59e0b"
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                    opacity="0.5"
                                  />
                                  <text
                                    x={cabinetWidth * previewScale / 2}
                                    y={(cabinetHeight - 50) * previewScale}
                                    textAnchor="middle"
                                    className="text-xs fill-amber-700"
                                  >
                                    Lighting Zone
                                  </text>
                                </g>
                              )}
                              
                              {/* Advanced drilling patterns */}
                              {patterns.map((pattern, patternIndex) => 
                                pattern.holes.slice(0, 8).map((hole) => (
                                  <circle
                                    key={`advanced-${patternIndex}-${hole.id}`}
                                    cx={hole.x * previewScale}
                                    cy={hole.y * previewScale}
                                    r={hole.diameter * previewScale / 2}
                                    fill={patternIndex === 0 ? "#3b82f6" : patternIndex === 1 ? "#10b981" : "#8b5cf6"}
                                    opacity="0.7"
                                  />
                                ))
                              )}
                            </svg>
                          </div>
                        </Card>

                        {/* Advanced Pattern Details */}
                        <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Advanced Pattern Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Use Case:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {currentUseCase?.title}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Advanced Features:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {selectedFeatures.length} selected
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
                              <span className="text-slate-600 dark:text-[#90a7cb]">Material:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {materialType.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Construction:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {constructionMethod.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Selected Features Display */}
                          {selectedFeatures.length > 0 && (
                            <div className="mt-4">
                              <div className="text-xs font-medium mb-2">Selected Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedFeatures.map((featureId) => (
                                  <Badge key={featureId} variant="outline" className="text-xs">
                                    {ADVANCED_FEATURES[featureId as keyof typeof ADVANCED_FEATURES]?.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button onClick={handleExport} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export Advanced Patterns
                          </Button>
                          <Button onClick={handleSaveAndContinue} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Save & Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-[#90a7cb]">
                        <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No advanced patterns generated yet</p>
                        <p className="text-sm">Configure your advanced settings and features to generate patterns</p>
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
                Advanced Use Case
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

            {/* Advanced Tips */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Advanced Design Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Consider weight distribution for automated systems</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Plan electrical routing for integrated lighting</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Allow for maintenance access in complex systems</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <p>Test automation systems before final installation</p>
                </div>
              </div>
            </Card>

            {/* Complexity Analysis */}
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Complexity Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Overall Complexity</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    High
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Skill Level Required</span>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    Expert
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-[#90a7cb]">Estimated Time</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    45-90 min
                  </span>
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
                  <Link href="/use-cases/professional-design">
                    <Button variant="outline" className="w-full justify-start">
                      <Box className="w-4 h-4 mr-2" />
                      Professional Design
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
