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

const PULL_USE_CASES = [
  {
    id: 'standard-knobs',
    title: 'Standard Cabinet Knobs',
    description: 'Traditional knob placement for cabinet doors and drawers',
    doorWidth: 600,
    doorHeight: 800,
    drawerWidth: 600,
    drawerDepth: 570,
    thickness: 18,
    pullType: 'knob_center' as PatternId,
    spacing: 'standard',
    notes: 'Classic centered knob placement'
  },
  {
    id: 'modern-handles',
    title: 'Modern Cabinet Handles',
    description: 'Contemporary handle placement for modern cabinets',
    doorWidth: 600,
    doorHeight: 800,
    drawerWidth: 600,
    drawerDepth: 570,
    thickness: 18,
    pullType: 'handle_horizontal' as PatternId,
    spacing: 'standard',
    notes: 'Horizontal handle placement'
  },
  {
    id: 'vertical-handles',
    title: 'Vertical Handle Systems',
    description: 'Vertical handles for tall doors and drawers',
    doorWidth: 600,
    doorHeight: 800,
    drawerWidth: 600,
    drawerDepth: 570,
    thickness: 18,
    pullType: 'handle_vertical' as PatternId,
    spacing: 'standard',
    notes: 'Vertical handle orientation'
  },
  {
    id: 'mixed-pulls',
    title: 'Mixed Pull Systems',
    description: 'Combination of knobs and handles for varied cabinet styles',
    doorWidth: 600,
    doorHeight: 800,
    drawerWidth: 600,
    drawerDepth: 570,
    thickness: 18,
    pullType: 'mixed_system' as PatternId,
    spacing: 'custom',
    notes: 'Doors with knobs, drawers with handles'
  }
];

const PULL_TYPES = {
  knob_center: {
    id: "knob_center",
    label: "Centered Knob",
    brand: "Universal",
    series: "Standard",
    pattern: "pull_knob",
    holeDiameter: 8,
    holeDepth: 12,
    applications: ["doors", "drawers", "universal"],
    features: ["centered", "simple", "versatile"]
  },
  handle_horizontal: {
    id: "handle_horizontal",
    label: "Horizontal Handle",
    brand: "Universal",
    series: "Modern",
    pattern: "pull_handle",
    holeDiameter: 4,
    holeDepth: 12,
    holeSpacing: 128,
    applications: ["doors", "drawers", "modern"],
    features: ["horizontal", "modern", "clean"]
  },
  handle_vertical: {
    id: "handle_vertical",
    label: "Vertical Handle",
    brand: "Universal",
    series: "Contemporary",
    pattern: "pull_handle",
    holeDiameter: 4,
    holeDepth: 12,
    holeSpacing: 96,
    applications: ["tall-doors", "drawers", "contemporary"],
    features: ["vertical", "tall", "elegant"]
  },
  edge_pull: {
    id: "edge_pull",
    label: "Edge Pull System",
    brand: "Specialty",
    series: "Minimalist",
    pattern: "pull_edge",
    holeDiameter: 6,
    holeDepth: 15,
    applications: ["modern", "minimalist", "handleless"],
    features: ["minimalist", "edge-mount", "clean"]
  },
  mixed_system: {
    id: "mixed_system",
    label: "Mixed Pull System",
    brand: "Universal",
    series: "Flexible",
    pattern: "pull_mixed",
    holeDiameter: 8,
    holeDepth: 12,
    applications: ["mixed", "flexible", "custom"],
    features: ["flexible", "mixed", "customizable"]
  }
};

export default function PullsAndHandlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [selectedUseCase, setSelectedUseCase] = useState<string>('standard-knobs');
  const [doorWidth, setDoorWidth] = useState(600);
  const [doorHeight, setDoorHeight] = useState(800);
  const [drawerWidth, setDrawerWidth] = useState(600);
  const [drawerDepth, setDrawerDepth] = useState(570);
  const [thickness, setThickness] = useState(18);
  const [selectedPull, setSelectedPull] = useState<PatternId>('knob_center');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [spacing, setSpacing] = useState<'standard' | 'custom'>('standard');
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [previewScale, setPreviewScale] = useState(0.4);
  const [currentStep, setCurrentStep] = useState(1);

  const currentUseCase = PULL_USE_CASES.find(uc => uc.id === selectedUseCase);
  const pullPatterns = Object.values(PULL_TYPES);
  const filteredPullPatterns = selectedBrand === 'all' 
    ? pullPatterns 
    : pullPatterns.filter(pattern => pattern.brand === selectedBrand);

  // Initialize from use case or URL params
  useEffect(() => {
    const useCase = searchParams?.get('useCase');
    if (useCase) {
      setSelectedUseCase(useCase);
      const found = PULL_USE_CASES.find(uc => uc.id === useCase);
      if (found) {
        setDoorWidth(found.doorWidth);
        setDoorHeight(found.doorHeight);
        setDrawerWidth(found.drawerWidth);
        setDrawerDepth(found.drawerDepth);
        setThickness(found.thickness);
        setSelectedPull(found.pullType);
        setSpacing(found.spacing as any);
      }
    }
  }, [searchParams]);

  // Update settings when use case changes
  useEffect(() => {
    if (currentUseCase) {
      setDoorWidth(currentUseCase.doorWidth);
      setDoorHeight(currentUseCase.doorHeight);
      setDrawerWidth(currentUseCase.drawerWidth);
      setDrawerDepth(currentUseCase.drawerDepth);
      setThickness(currentUseCase.thickness);
      setSelectedPull(currentUseCase.pullType);
      setSpacing(currentUseCase.spacing as any);
    }
  }, [selectedUseCase, currentUseCase]);

  // Generate pull patterns
  const handleGeneratePattern = () => {
    const doorPattern = generateCNCPattern(selectedPull, {
      partType: 'door',
      length: doorHeight,
      width: doorWidth,
      thickness,
      origin: 'bottomLeft',
      face: 'front'
    });

    const drawerPattern = generateCNCPattern(selectedPull, {
      partType: 'drawer',
      length: drawerWidth,
      width: drawerDepth,
      thickness,
      origin: 'bottomLeft',
      face: 'front'
    });

    if (doorPattern && drawerPattern) {
      setPatterns([doorPattern, drawerPattern]);
      setCurrentStep(3);
      toast.success(`Generated ${PULL_TYPES[selectedPull]?.label} patterns`);
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
      doorWidth,
      doorHeight,
      drawerWidth,
      drawerDepth,
      thickness,
      pullType: selectedPull,
      spacing,
      patterns,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulls-handles-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Pattern exported successfully');
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    localStorage.setItem('pullsHandlesPattern', JSON.stringify({
      useCase: selectedUseCase,
      doorWidth,
      doorHeight,
      drawerWidth,
      drawerDepth,
      thickness,
      pullType: selectedPull,
      spacing,
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Cabinet Pulls & Handles
                </h1>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Configure drilling patterns for cabinet knobs and handles
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
                      {PULL_USE_CASES.map((useCase) => (
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
                        <Label>Door Width (mm)</Label>
                        <Input type="number" value={doorWidth} onChange={(e) => setDoorWidth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Door Height (mm)</Label>
                        <Input type="number" value={doorHeight} onChange={(e) => setDoorHeight(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Drawer Width (mm)</Label>
                        <Input type="number" value={drawerWidth} onChange={(e) => setDrawerWidth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Drawer Depth (mm)</Label>
                        <Input type="number" value={drawerDepth} onChange={(e) => setDrawerDepth(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Thickness (mm)</Label>
                        <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Spacing Type</Label>
                        <Select value={spacing} onValueChange={(v: 'standard' | 'custom') => setSpacing(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Spacing</SelectItem>
                            <SelectItem value="custom">Custom Spacing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Pull Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Pull Type</h3>
                    
                    {/* Brand Filter */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Brand</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {['Universal', 'Specialty'].map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pull Selection */}
                    <Select value={selectedPull} onValueChange={(v: PatternId) => setSelectedPull(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPullPatterns.map((pull) => (
                          <SelectItem key={pull.id} value={pull.id}>
                            <div className="flex items-center gap-2">
                              <span>{pull.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {pull.series}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPull && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-[#90a7cb]">
                          <div className="font-medium text-slate-900 dark:text-white mb-1">
                            {PULL_TYPES[selectedPull]?.label}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {PULL_TYPES[selectedPull]?.brand}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {PULL_TYPES[selectedPull]?.series}
                            </Badge>
                            {PULL_TYPES[selectedPull]?.applications && (
                              <Badge variant="outline" className="text-xs">
                                {PULL_TYPES[selectedPull]?.applications[0]}
                              </Badge>
                            )}
                          </div>
                          <div>Hole Diameter: {PULL_TYPES[selectedPull]?.holeDiameter}mm</div>
                          {PULL_TYPES[selectedPull]?.holeSpacing && (
                            <div>Hole Spacing: {PULL_TYPES[selectedPull]?.holeSpacing}mm</div>
                          )}
                          {PULL_TYPES[selectedPull]?.features && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {PULL_TYPES[selectedPull]?.features.map((feature: string) => (
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
                    Generate Pull Patterns
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </TabsContent>

                {/* Step 3: Pattern Preview */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Generated Patterns</h3>
                    
                    {patterns.length > 0 ? (
                      <div className="space-y-4">
                        {/* Door Pattern */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Door Pattern</h4>
                          <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5">
                            <svg
                              width={doorWidth * previewScale}
                              height={doorHeight * previewScale}
                              className="border border-slate-300 dark:border-slate-600"
                            >
                              {/* Door outline */}
                              <rect
                                x="0"
                                y="0"
                                width={doorWidth * previewScale}
                                height={doorHeight * previewScale}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                              />
                              
                              {/* Pull holes */}
                              {patterns[0]?.holes.map((hole) => (
                                <circle
                                  key={hole.id}
                                  cx={hole.x * previewScale}
                                  cy={hole.y * previewScale}
                                  r={hole.diameter * previewScale / 2}
                                  fill="#ef4444"
                                  opacity="0.7"
                                />
                              ))}
                            </svg>
                          </div>
                        </Card>

                        {/* Drawer Pattern */}
                        <Card className="p-4 bg-slate-50 dark:bg-[#151c28]">
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Drawer Pattern</h4>
                          <div className="bg-white dark:bg-[#182334] rounded-lg p-4 border border-slate-200 dark:border-white/5">
                            <svg
                              width={drawerWidth * previewScale}
                              height={drawerDepth * previewScale}
                              className="border border-slate-300 dark:border-slate-600"
                            >
                              {/* Drawer outline */}
                              <rect
                                x="0"
                                y="0"
                                width={drawerWidth * previewScale}
                                height={drawerDepth * previewScale}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                              />
                              
                              {/* Pull holes */}
                              {patterns[1]?.holes.map((hole) => (
                                <circle
                                  key={hole.id}
                                  cx={hole.x * previewScale}
                                  cy={hole.y * previewScale}
                                  r={hole.diameter * previewScale / 2}
                                  fill="#ef4444"
                                  opacity="0.7"
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
                              <span className="text-slate-600 dark:text-[#90a7cb]">Pull Type:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {PULL_TYPES[selectedPull]?.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Total Holes:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {allHoles.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-[#90a7cb]">Hole Diameter:</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {PULL_TYPES[selectedPull]?.holeDiameter}mm
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
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Professional Tips
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-[#90a7cb]">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Standard knob placement is centered on door height</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Handle spacing typically follows 128mm standard</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <p>Consider ergonomics for pull placement</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <p>Test pull placement on sample material first</p>
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
