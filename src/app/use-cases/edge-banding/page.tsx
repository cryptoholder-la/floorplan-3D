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

const EDGEBANDING_USE_CASES = [
  {
    id: 'standard-edgeband',
    title: 'Standard Edge Banding',
    description: 'Common edge banding for standard cabinet panels',
    panelWidth: 600,
    panelHeight: 800,
    thickness: 18,
    bandingType: 'standard_pvc' as PatternId,
    bandingWidth: 22,
    notes: 'Standard PVC edge banding for melamine panels'
  },
  {
    id: 'thick-edgeband',
    title: 'Thick Edge Banding',
    description: '2-3mm thick edge banding for premium finishes',
    panelWidth: 600,
    panelHeight: 800,
    thickness: 18,
    bandingType: 'thick_abs' as PatternId,
    bandingWidth: 22,
    notes: 'Thick ABS edge banding for high-end applications'
  },
  {
    id: 'solid-wood',
    title: 'Solid Wood Edge',
    description: 'Solid wood edge banding for premium furniture',
    panelWidth: 600,
    panelHeight: 800,
    thickness: 18,
    bandingType: 'solid_wood' as PatternId,
    bandingWidth: 22,
    notes: 'Solid wood edge strips for furniture grade'
  },
  {
    id: 'metal-edge',
    title: 'Metal Edge Banding',
    description: 'Aluminum or steel edge banding for commercial use',
    panelWidth: 600,
    panelHeight: 800,
    thickness: 18,
    bandingType: 'metal_edge' as PatternId,
    bandingWidth: 22,
    notes: 'Metal edge banding for commercial and institutional'
  }
];

const EDGEBANDING_TYPES = {
  standard_pvc: {
    id: "standard_pvc",
    label: "Standard PVC Edge Banding",
    brand: "Various",
    series: "Standard",
    pattern: "edgeband_standard",
    bandingWidth: 22,
    bandingThickness: 0.6,
    applications: ["kitchen", "furniture", "economy"],
    features: ["economical", "standard", "versatile"]
  },
  thick_abs: {
    id: "thick_abs",
    label: "Thick ABS Edge Banding",
    brand: "Premium",
    series: "Thick",
    pattern: "edgeband_thick",
    bandingWidth: 22,
    bandingThickness: 2,
    applications: ["premium", "commercial", "high-end"],
    features: ["durable", "thick", "premium"]
  },
  solid_wood: {
    id: "solid_wood",
    label: "Solid Wood Edge Banding",
    brand: "Woodworking",
    series: "Natural",
    pattern: "edgeband_wood",
    bandingWidth: 22,
    bandingThickness: 3,
    applications: ["furniture", "premium", "custom"],
    features: ["natural", "premium", "customizable"]
  },
  metal_edge: {
    id: "metal_edge",
    label: "Metal Edge Banding",
    brand: "Industrial",
    series: "Metal",
    pattern: "edgeband_metal",
    bandingWidth: 22,
    bandingThickness: 1.5,
    applications: ["commercial", "institutional", "industrial"],
    features: ["durable", "metal", "heavy-duty"]
  },
  laser_edge: {
    id: "laser_edge",
    label: "Laser Edge Banding",
    brand: "High-Tech",
    series: "Laser",
    pattern: "edgeband_laser",
    bandingWidth: 22,
    bandingThickness: 0.5,
    applications: ["premium", "modern", "seamless"],
    features: ["seamless", "modern", "premium"]
  }
};

export default function EdgeBandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-edgeband');
  const [panelWidth, setPanelWidth] = useState(600);
  const [panelHeight, setPanelHeight] = useState(800);
  const [thickness, setThickness] = useState(18);
  const [selectedBanding, setSelectedBanding] = useState<PatternId>('standard_pvc');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [bandingWidth, setBandingWidth] = useState(22);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = EDGEBANDING_USE_CASES.find(uc => uc.id === selectedUseCase);
  const bandingPatterns = Object.values(EDGEBANDING_TYPES);
  const filteredBandingPatterns = selectedBrand === 'all' 
    ? bandingPatterns 
    : bandingPatterns.filter(pattern => pattern.brand === selectedBrand);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = EDGEBANDING_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setPanelWidth(found.panelWidth);
        setPanelHeight(found.panelHeight);
        setThickness(found.thickness);
        setSelectedBanding(found.bandingType);
        setBandingWidth(found.bandingWidth);
      }
    }
  }, [searchParams]);

  // Update settings when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setPanelWidth(currentUseCase.panelWidth);
      setPanelHeight(currentUseCase.panelHeight);
      setThickness(currentUseCase.thickness);
      setSelectedBanding(currentUseCase.bandingType);
      setBandingWidth(currentUseCase.bandingWidth);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate edge banding patterns
  const handleGeneratePattern = () => {
    // Generate edge banding for all four edges
    const topPattern = generateCNCPattern(selectedBanding, {
      partType: 'panel',
      length: panelWidth,
      width: bandingWidth,
      thickness,
      origin: 'topLeft',
      face: 'edge'
    });

    const bottomPattern = generateCNCPattern(selectedBanding, {
      partType: 'panel',
      length: panelWidth,
      width: bandingWidth,
      thickness,
      origin: 'bottomLeft',
      face: 'edge'
    });

    const leftPattern = generateCNCPattern(selectedBanding, {
      partType: 'panel',
      length: panelHeight,
      width: bandingWidth,
      thickness,
      origin: 'topLeft',
      face: 'edge'
    });

    const rightPattern = generateCNCPattern(selectedBanding, {
      partType: 'panel',
      length: panelHeight,
      width: bandingWidth,
      thickness,
      origin: 'topRight',
      face: 'edge'
    });

    if (topPattern && bottomPattern && leftPattern && rightPattern) {
      setPatterns([topPattern, bottomPattern, leftPattern, rightPattern]);
      setCurrentStep(3);
      toast.success(`Generated ${EDGEBANDING_TYPES[selectedBanding]?.label} patterns`);
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
      panelWidth,
      panelHeight,
      thickness,
      bandingType: selectedBanding,
      bandingWidth,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edge-banding-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('edgeBandingPattern', JSON.stringify({
      useCase: selectedUseCase,
      panelWidth,
      panelHeight,
      thickness,
      bandingType: selectedBanding,
      bandingWidth,
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
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Edge Banding & Finishing
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure edge banding patterns for cabinet panels
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
                      {EDGEBANDING_USE_CASES.map((useCase) => (
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
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Panel Dimensions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Panel Width (mm)</Label>
                        <Input type="number" value={panelWidth} onChange={(e) => setPanelWidth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Panel Height (mm)</Label>
                        <Input type="number" value={panelHeight} onChange={(e) => setPanelHeight(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Thickness (mm)</Label>
                        <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Banding Width (mm)</Label>
                        <Input type="number" value={bandingWidth} onChange={(e) => setBandingWidth(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  {/* Edge Banding Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Edge Banding Type</h3>
                    
                    {/* Brand Filter */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Brand</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {['Various', 'Premium', 'Woodworking', 'Industrial', 'High-Tech'].map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Edge Banding Selection */}
                    <Select value={selectedBanding} onValueChange={(v: PatternId) => setSelectedBanding(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBandingPatterns.map((banding) => (
                          <SelectItem key={banding.id} value={banding.id}>
                            <div className="flex items-center gap-2">
                              <span>{banding.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {banding.series}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedBanding && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            {EDGEBANDING_TYPES[selectedBanding]?.label}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {EDGEBANDING_TYPES[selectedBanding]?.brand}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {EDGEBANDING_TYPES[selectedBanding]?.bandingThickness}mm
                            </Badge>
                            {EDGEBANDING_TYPES[selectedBanding]?.applications && (
                              <Badge variant="outline" className="text-xs">
                                {EDGEBANDING_TYPES[selectedBanding]?.applications[0]}
                              </Badge>
                            )}
                          </div>
                          <div>Banding Width: {EDGEBANDING_TYPES[selectedBanding]?.bandingWidth}mm</div>
                          <div>Banding Thickness: {EDGEBANDING_TYPES[selectedBanding]?.bandingThickness}mm</div>
                          {EDGEBANDING_TYPES[selectedBanding]?.features && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {EDGEBANDING_TYPES[selectedBanding]?.features.map((feature: string) => (
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

                  <Button onClick={handleGeneratePattern} className="w-full">
                    Generate Edge Banding Patterns
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </TabsContent>

                {/* Step 3: Pattern Preview */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Generated Patterns</h3>
                    
                    {patterns.length > 0 ? (
                      <div className="space-y-4">
                        {/* Main Panel with All Edges */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Complete Panel with Edge Banding</h4>
                          <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5">
                            <svg
                              width={panelWidth * previewScale}
                              height={panelHeight * previewScale}
                              className="border border-slate-300 dark:border-slate-600"
                            >
                              {/* Panel outline */}
                              <rect
                                x="0"
                                y="0"
                                width={panelWidth * previewScale}
                                height={panelHeight * previewScale}
                                fill="#f8fafc"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              
                              {/* Edge banding visualization */}
                              {/* Top edge */}
                              <rect
                                x="0"
                                y="0"
                                width={panelWidth * previewScale}
                                height={bandingWidth * previewScale}
                                fill="#94a3b8"
                                opacity="0.7"
                              />
                              
                              {/* Bottom edge */}
                              <rect
                                x="0"
                                y={(panelHeight - bandingWidth) * previewScale}
                                width={panelWidth * previewScale}
                                height={bandingWidth * previewScale}
                                fill="#94a3b8"
                                opacity="0.7"
                              />
                              
                              {/* Left edge */}
                              <rect
                                x="0"
                                y="0"
                                width={bandingWidth * previewScale}
                                height={panelHeight * previewScale}
                                fill="#94a3b8"
                                opacity="0.7"
                              />
                              
                              {/* Right edge */}
                              <rect
                                x={(panelWidth - bandingWidth) * previewScale}
                                y="0"
                                width={bandingWidth * previewScale}
                                height={panelHeight * previewScale}
                                fill="#94a3b8"
                                opacity="0.7"
                              />
                              
                              {/* Mounting holes for all edges */}
                              {patterns.map((pattern, edgeIndex) => (
                                pattern.holes.map((hole) => (
                                  <circle
                                    key={`${edgeIndex}-${hole.id}`}
                                    cx={hole.x * previewScale}
                                    cy={hole.y * previewScale}
                                    r={hole.diameter * previewScale / 2}
                                    fill="#ef4444"
                                    opacity="0.8"
                                  />
                                ))
                              ))}
                            </svg>
                          </div>
                        </Card>

                        {/* Individual Edge Patterns */}
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">Top Edge</h4>
                            <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5">
                              <svg
                                width={panelWidth * previewScale * 0.8}
                                height={bandingWidth * previewScale * 2}
                                className="border border-slate-300 dark:border-slate-600"
                              >
                                <rect
                                  x="0"
                                  y="0"
                                  width={panelWidth * previewScale * 0.8}
                                  height={bandingWidth * previewScale * 2}
                                  fill="#94a3b8"
                                  opacity="0.7"
                                />
                                {patterns[0]?.holes.map((hole) => (
                                  <circle
                                    key={hole.id}
                                    cx={hole.x * previewScale * 0.8}
                                    cy={hole.y * previewScale * 2}
                                    r={hole.diameter * previewScale}
                                    fill="#ef4444"
                                    opacity="0.8"
                                  />
                                ))}
                              </svg>
                            </div>
                          </Card>

                          <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">Left Edge</h4>
                            <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5">
                              <svg
                                width={bandingWidth * previewScale * 2}
                                height={panelHeight * previewScale * 0.8}
                                className="border border-slate-300 dark:border-slate-600"
                              >
                                <rect
                                  x="0"
                                  y="0"
                                  width={bandingWidth * previewScale * 2}
                                  height={panelHeight * previewScale * 0.8}
                                  fill="#94a3b8"
                                  opacity="0.7"
                                />
                                {patterns[2]?.holes.map((hole) => (
                                  <circle
                                    key={hole.id}
                                    cx={hole.x * previewScale * 2}
                                    cy={hole.y * previewScale * 0.8}
                                    r={hole.diameter * previewScale}
                                    fill="#ef4444"
                                    opacity="0.8"
                                  />
                                ))}
                              </svg>
                            </div>
                          </Card>
                        </div>

                        {/* Pattern Details */}
                        <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Pattern Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Edge Banding Type:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {EDGEBANDING_TYPES[selectedBanding]?.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Total Holes:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {allHoles.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Banding Thickness:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {EDGEBANDING_TYPES[selectedBanding]?.bandingThickness}mm
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Panel Size:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {panelWidth} × {panelHeight}mm
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
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Professional Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Standard edge banding width is 22mm for 18mm panels</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Consider material thickness for proper edge banding selection</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Test edge banding on scrap material first</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <p>Different materials require different adhesives</p>
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
