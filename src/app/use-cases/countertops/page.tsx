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
  Grid3x3
} from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/types';
import { 
  AVAILABLE_PATTERNS,
  PATTERN_CATEGORIES,
  generateCNCPattern,
  getPatternsByCategory,
  HARDWARE_BRANDS,
  type PatternId
} from '@/lib/drill-patterns-library';
import { Material } from '@/types';

const COUNTERTOP_USE_CASES = [
  {
    id: 'standard-kitchen',
    title: 'Standard Kitchen Countertop',
    description: 'Typical kitchen countertop with sink and faucet cutouts',
    countertopWidth: 2400,
    countertopDepth: 600,
    thickness: 40,
    countertopType: 'laminate_standard' as PatternId,
    notes: 'Standard laminate countertop with basic fixtures'
  },
  {
    id: 'premium-quartz',
    title: 'Premium Quartz Countertop',
    description: 'High-end quartz countertop with undermount sink',
    countertopWidth: 2400,
    countertopDepth: 650,
    thickness: 30,
    countertopType: 'quartz_premium' as PatternId,
    notes: 'Premium quartz with undermount sink and modern fixtures'
  },
  {
    id: 'butcher-block',
    title: 'Butcher Block Work Surface',
    description: 'Wood butcher block countertop for kitchen islands',
    countertopWidth: 1200,
    countertopDepth: 900,
    thickness: 40,
    countertopType: 'butcher_block' as PatternId,
    notes: 'Solid wood butcher block with traditional fixtures'
  },
  {
    id: 'commercial-workstation',
    title: 'Commercial Workstation',
    description: 'Heavy-duty commercial workstation with multiple fixtures',
    countertopWidth: 1800,
    countertopDepth: 800,
    thickness: 50,
    countertopType: 'commercial_stainless' as PatternId,
    notes: 'Stainless steel commercial workstation'
  }
];

const COUNTERTOP_TYPES = {
  laminate_standard: {
    id: "laminate_standard",
    label: "Standard Laminate Countertop",
    brand: "Formica",
    series: "Standard",
    pattern: "countertop_laminate",
    thickness: 40,
    edgeProfile: "standard",
    applications: ["kitchen", "bathroom", "economy"],
    features: ["economical", "durable", "standard"]
  },
  quartz_premium: {
    id: "quartz_premium",
    label: "Premium Quartz Countertop",
    brand: "Caesarstone",
    series: "Premium",
    pattern: "countertop_quartz",
    thickness: 30,
    edgeProfile: "eased",
    applications: ["kitchen", "premium", "modern"],
    features: ["premium", "durable", "modern"]
  },
  butcher_block: {
    id: "butcher_block",
    label: "Butcher Block Work Surface",
    brand: "John Boos",
    series: "Professional",
    pattern: "countertop_wood",
    thickness: 40,
    edgeProfile: "rounded",
    applications: ["kitchen", "island", "traditional"],
    features: ["natural", "renewable", "traditional"]
  },
  commercial_stainless: {
    id: "commercial_stainless",
    label: "Commercial Stainless Steel",
    brand: "Stainless",
    series: "Commercial",
    pattern: "countertop_stainless",
    thickness: 50,
    edgeProfile: "square",
    applications: ["commercial", "restaurant", "industrial"],
    features: ["heavy-duty", "sanitary", "commercial"]
  },
  solid_surface: {
    id: "solid_surface",
    label: "Solid Surface Countertop",
    brand: "Corian",
    series: "Solid Surface",
    pattern: "countertop_solid",
    thickness: 12,
    edgeProfile: "custom",
    applications: ["healthcare", "commercial", "custom"],
    features: ["seamless", "repairable", "custom"]
  }
};

const FIXTURE_TYPES = {
  sink_top_mount: {
    id: "sink_top_mount",
    label: "Top Mount Sink",
    cutoutType: "rectangular",
    width: 560,
    depth: 470,
    radius: 15,
    faucetHoles: 3,
    faucetSpacing: 102
  },
  sink_undermount: {
    id: "sink_undermount",
    label: "Undermount Sink",
    cutoutType: "rectangular",
    width: 560,
    depth: 470,
    radius: 15,
    faucetHoles: 1,
    faucetSpacing: 0
  },
  sink_farmhouse: {
    id: "sink_farmhouse",
    label: "Farmhouse Sink",
    cutoutType: "rectangular",
    width: 860,
    depth: 560,
    radius: 20,
    faucetHoles: 3,
    faucetSpacing: 102
  },
  cooktop_gas: {
    id: "cooktop_gas",
    label: "Gas Cooktop",
    cutoutType: "rectangular",
    width: 760,
    depth: 500,
    radius: 10,
    faucetHoles: 0,
    faucetSpacing: 0
  },
  cooktop_induction: {
    id: "cooktop_induction",
    label: "Induction Cooktop",
    cutoutType: "rectangular",
    width: 760,
    depth: 500,
    radius: 10,
    faucetHoles: 0,
    faucetSpacing: 0
  }
};

export default function CountertopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-kitchen');
  const [countertopWidth, setCountertopWidth] = useState(2400);
  const [countertopDepth, setCountertopDepth] = useState(600);
  const [thickness, setThickness] = useState(40);
  const [selectedCountertop, setSelectedCountertop] = useState<PatternId>('laminate_standard');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSink, setSelectedSink] = useState<string>('sink_top_mount');
  const [sinkPosition, setSinkPosition] = useState<'center' | 'left' | 'right'>('center');
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.15);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = COUNTERTOP_USE_CASES.find(uc => uc.id === selectedUseCase);
  const countertopPatterns = Object.values(COUNTERTOP_TYPES);
  const filteredCountertopPatterns = selectedBrand === 'all' 
    ? countertopPatterns 
    : countertopPatterns.filter(pattern => pattern.brand === selectedBrand);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = COUNTERTOP_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setCountertopWidth(found.countertopWidth);
        setCountertopDepth(found.countertopDepth);
        setThickness(found.thickness);
        setSelectedCountertop(found.countertopType);
      }
    }
  }, [searchParams]);

  // Update settings when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setCountertopWidth(currentUseCase.countertopWidth);
      setCountertopDepth(currentUseCase.countertopDepth);
      setThickness(currentUseCase.thickness);
      setSelectedCountertop(currentUseCase.countertopType);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate countertop patterns
  const handleGeneratePattern = () => {
    // Generate main countertop pattern
    const mainPattern = generateCNCPattern(selectedCountertop, {
      partType: 'countertop',
      length: countertopWidth,
      width: countertopDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'top'
    });

    // Generate sink cutout pattern
    const sinkConfig = FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES];
    let sinkX = 0;
    
    if (sinkPosition === 'center') {
      sinkX = (countertopWidth - sinkConfig.width) / 2;
    } else if (sinkPosition === 'left') {
      sinkX = 300; // Standard offset from left edge
    } else {
      sinkX = countertopWidth - sinkConfig.width - 300; // Standard offset from right edge
    }

    const sinkY = (countertopDepth - sinkConfig.depth) / 2; // Center front-to-back

    if (mainPattern) {
      // Add sink cutout holes to the main pattern
      const sinkHoles = [
        {
          id: 'sink-cutout-tl',
          x: sinkX,
          y: sinkY,
          diameter: sinkConfig.radius * 2,
          depth: thickness,
          type: 'through' as const
        },
        {
          id: 'sink-cutout-tr',
          x: sinkX + sinkConfig.width,
          y: sinkY,
          diameter: sinkConfig.radius * 2,
          depth: thickness,
          type: 'through' as const
        },
        {
          id: 'sink-cutout-bl',
          x: sinkX,
          y: sinkY + sinkConfig.depth,
          diameter: sinkConfig.radius * 2,
          depth: thickness,
          type: 'through' as const
        },
        {
          id: 'sink-cutout-br',
          x: sinkX + sinkConfig.width,
          y: sinkY + sinkConfig.depth,
          diameter: sinkConfig.radius * 2,
          depth: thickness,
          type: 'through' as const
        }
      ];

      // Add faucet holes if applicable
      if (sinkConfig.faucetHoles > 0) {
        const faucetY = sinkY - 50; // Standard setback from sink edge
        const faucetCenterX = sinkX + sinkConfig.width / 2;
        
        if (sinkConfig.faucetHoles === 1) {
          sinkHoles.push({
            id: 'faucet-center',
            x: faucetCenterX,
            y: faucetY,
            diameter: 35,
            depth: thickness,
            type: 'through' as const
          });
        } else if (sinkConfig.faucetHoles === 3) {
          sinkHoles.push({
            id: 'faucet-left',
            x: faucetCenterX - sinkConfig.faucetSpacing / 2,
            y: faucetY,
            diameter: 35,
            depth: thickness,
            type: 'through' as const
          });
          sinkHoles.push({
            id: 'faucet-center',
            x: faucetCenterX,
            y: faucetY,
            diameter: 35,
            depth: thickness,
            type: 'through' as const
          });
          sinkHoles.push({
            id: 'faucet-right',
            x: faucetCenterX + sinkConfig.faucetSpacing / 2,
            y: faucetY,
            diameter: 35,
            depth: thickness,
            type: 'through' as const
          });
        }
      }

      const combinedPattern = {
        ...mainPattern,
        holes: [...mainPattern.holes, ...sinkHoles]
      };

      setPatterns([combinedPattern]);
      setCurrentStep(3);
      toast.success(`Generated ${COUNTERTOP_TYPES[selectedCountertop]?.label} with ${sinkConfig.label}`);
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
      countertopWidth,
      countertopDepth,
      thickness,
      countertopType: selectedCountertop,
      sinkType: selectedSink,
      sinkPosition,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `countertop-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('countertopPattern', JSON.stringify({
      useCase: selectedUseCase,
      countertopWidth,
      countertopDepth,
      thickness,
      countertopType: selectedCountertop,
      sinkType: selectedSink,
      sinkPosition,
      patterns,
      timestamp: Date.now()
    }));
    toast.success('Pattern saved!');
    router.push('/use-cases/complete-cabinet');
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
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <Package className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Countertops & Work Surfaces
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure cutting patterns for countertops and work surfaces
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
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Select Use Case</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {COUNTERTOP_USE_CASES.map((useCase) => (
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
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Countertop Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Countertop Width (mm)</Label>
                        <Input type="number" value={countertopWidth} onChange={(e) => setCountertopWidth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Countertop Depth (mm)</Label>
                        <Input type="number" value={countertopDepth} onChange={(e) => setCountertopDepth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Thickness (mm)</Label>
                        <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Sink Position</Label>
                        <Select value={sinkPosition} onValueChange={(v: 'center' | 'left' | 'right') => setSinkPosition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Countertop Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Countertop Material</h3>
                    
                    {/* Brand Filter */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Brand</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {['Formica', 'Caesarstone', 'John Boos', 'Stainless', 'Corian'].map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Countertop Selection */}
                    <Select value={selectedCountertop} onValueChange={(v: PatternId) => setSelectedCountertop(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCountertopPatterns.map((countertop) => (
                          <SelectItem key={countertop.id} value={countertop.id}>
                            <div className="flex items-center gap-2">
                              <span>{countertop.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {countertop.thickness}mm
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCountertop && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            {COUNTERTOP_TYPES[selectedCountertop]?.label}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {COUNTERTOP_TYPES[selectedCountertop]?.brand}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {COUNTERTOP_TYPES[selectedCountertop]?.thickness}mm
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {COUNTERTOP_TYPES[selectedCountertop]?.edgeProfile}
                            </Badge>
                          </div>
                          {COUNTERTOP_TYPES[selectedCountertop]?.features && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {COUNTERTOP_TYPES[selectedCountertop]?.features.map((feature: string) => (
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

                  {/* Sink/Fixture Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Sink or Fixture Type</h3>
                    <Select value={selectedSink} onValueChange={setSelectedSink}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FIXTURE_TYPES).map((fixture) => (
                          <SelectItem key={fixture.id} value={fixture.id}>
                            <div className="flex items-center gap-2">
                              <span>{fixture.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {fixture.width}×{fixture.depth}mm
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedSink && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.label}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.width}mm
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.depth}mm
                            </Badge>
                            {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.faucetHoles > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.faucetHoles} faucet holes
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleGeneratePattern} className="w-full">
                    Generate Countertop Pattern
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </TabsContent>

                {/* Step 3: Pattern Preview */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Generated Pattern</h3>
                    
                    {patterns.length > 0 ? (
                      <div className="space-y-4">
                        {/* Main Countertop Pattern */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Countertop with Cutouts</h4>
                          <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5 overflow-auto">
                            <svg
                              width={countertopWidth * previewScale}
                              height={countertopDepth * previewScale}
                              className="border border-slate-300 dark:border-slate-600"
                            >
                              {/* Countertop outline */}
                              <rect
                                x="0"
                                y="0"
                                width={countertopWidth * previewScale}
                                height={countertopDepth * previewScale}
                                fill="#e2e8f0"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              
                              {/* Sink cutout visualization */}
                              {(() => {
                                const sinkConfig = FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES];
                                let sinkX = 0;
                                
                                if (sinkPosition === 'center') {
                                  sinkX = (countertopWidth - sinkConfig.width) / 2;
                                } else if (sinkPosition === 'left') {
                                  sinkX = 300;
                                } else {
                                  sinkX = countertopWidth - sinkConfig.width - 300;
                                }
                                
                                const sinkY = (countertopDepth - sinkConfig.depth) / 2;
                                
                                return (
                                  <g>
                                    {/* Sink cutout rectangle */}
                                    <rect
                                      x={sinkX * previewScale}
                                      y={sinkY * previewScale}
                                      width={sinkConfig.width * previewScale}
                                      height={sinkConfig.depth * previewScale}
                                      fill="#ffffff"
                                      stroke="#ef4444"
                                      strokeWidth="2"
                                      strokeDasharray="5,5"
                                    />
                                    
                                    {/* Sink corner radii visualization */}
                                    <circle
                                      cx={sinkX * previewScale}
                                      cy={sinkY * previewScale}
                                      r={sinkConfig.radius * previewScale}
                                      fill="none"
                                      stroke="#ef4444"
                                      strokeWidth="1"
                                    />
                                    <circle
                                      cx={(sinkX + sinkConfig.width) * previewScale}
                                      cy={sinkY * previewScale}
                                      r={sinkConfig.radius * previewScale}
                                      fill="none"
                                      stroke="#ef4444"
                                      strokeWidth="1"
                                    />
                                    <circle
                                      cx={sinkX * previewScale}
                                      cy={(sinkY + sinkConfig.depth) * previewScale}
                                      r={sinkConfig.radius * previewScale}
                                      fill="none"
                                      stroke="#ef4444"
                                      strokeWidth="1"
                                    />
                                    <circle
                                      cx={(sinkX + sinkConfig.width) * previewScale}
                                      cy={(sinkY + sinkConfig.depth) * previewScale}
                                      r={sinkConfig.radius * previewScale}
                                      fill="none"
                                      stroke="#ef4444"
                                      strokeWidth="1"
                                    />
                                  </g>
                                );
                              })()}
                              
                              {/* Drilling holes */}
                              {patterns[0]?.holes.map((hole) => (
                                <circle
                                  key={hole.id}
                                  cx={hole.x * previewScale}
                                  cy={hole.y * previewScale}
                                  r={hole.diameter * previewScale / 2}
                                  fill="#3b82f6"
                                  opacity="0.8"
                                />
                              ))}
                            </svg>
                          </div>
                        </Card>

                        {/* Pattern Details */}
                        <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Pattern Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Countertop Type:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {COUNTERTOP_TYPES[selectedCountertop]?.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Sink/Fixture:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {FIXTURE_TYPES[selectedSink as keyof typeof FIXTURE_TYPES]?.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Total Holes:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {allHoles.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Countertop Size:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {countertopWidth} × {countertopDepth}mm
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Thickness:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {thickness}mm
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button onClick={handleExport} variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export Pattern
                          </Button>
                          <Button onClick={handleSaveAndContinue} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Save & Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-[#90a7cb]">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No patterns generated yet</p>
                        <p className="text-sm">Configure your settings and generate patterns</p>
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
                Use Case Details
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
            <Card className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Professional Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Standard countertop depth is 600mm for residential</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Allow 300mm minimum clearance around fixtures</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Consider overhang for seating areas</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <p>Verify plumbing and electrical locations</p>
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
                  <Link href="/use-cases/complete-cabinet">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Complete Cabinet Workflow
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
