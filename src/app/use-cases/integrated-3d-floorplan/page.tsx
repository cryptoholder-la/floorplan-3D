import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Move3D, 
  Eye, 
  Settings, 
  Zap, 
  Layers,
  Grid3x3,
  Camera,
  Lightbulb,
  Home,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import EnhancedFloorPlan3DViewer from '@/components/EnhancedFloorPlan3DViewer';
import { generateCNCPattern } from '@/lib/drill-patterns-library';
import { AVAILABLE_PATTERNS, PatternId } from '@/lib/drill-patterns-library';

// Professional use case configurations
const PROFESSIONAL_USE_CASES = [
  {
    id: 'luxury-kitchen',
    name: 'Luxury Kitchen Design',
    description: 'High-end kitchen with premium hardware and precision tolerances',
    difficulty: 'Professional',
    estimatedTime: '45-60 min',
    features: ['Blum NEXIS hinges', 'Soft-close drawers', 'Integrated lighting', 'Custom finishes'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['blum_nexis_155', 'blum_nexis_165'],
      drawers: ['blum_tandem_56', 'blum_movento_550'],
      lighting: ['led_under_cabinet', 'led_inside_drawers']
    }
  },
  {
    id: 'commercial-grade',
    name: 'Commercial Grade Cabinetry',
    description: 'Heavy-duty commercial systems with industrial specifications',
    difficulty: 'Professional',
    estimatedTime: '60-90 min',
    features: ['Heavy-duty hardware', 'Commercial finishes', 'Enhanced durability', 'ADA compliance'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['hettich_wingline_l_107', 'grass_tiomos_770'],
      drawers: ['hettich_innotech_450', 'grass_dynapro'],
      lighting: ['commercial_led_strip']
    }
  },
  {
    id: 'custom-vanity',
    name: 'Custom Bathroom Vanity',
    description: 'Bespoke vanity with specialized hardware and moisture resistance',
    difficulty: 'Professional',
    estimatedTime: '30-45 min',
    features: ['Moisture-resistant', 'Custom hardware', 'Integrated storage', 'Premium finishes'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['salice_invisible_180', 'hafele_metall_110'],
      drawers: ['hettich_quadra_450', 'blum_tandem_56'],
      lighting: ['vanity_led_mirror']
    }
  }
];

// Advanced use case configurations
const ADVANCED_USE_CASES = [
  {
    id: 'smart-cabinet',
    name: 'Smart Cabinet System',
    description: 'IoT-enabled cabinets with automation and connectivity',
    difficulty: 'Advanced',
    estimatedTime: '90-120 min',
    features: ['Motorized doors', 'Smart sensors', 'App control', 'Automated lighting'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['motorized_hinge_system'],
      drawers: ['electric_drawer_slides'],
      automation: ['motion_sensors', 'touch_controls', 'app_integration']
    }
  },
  {
    id: 'modular-system',
    name: 'Modular Cabinet System',
    description: 'Flexible modular design with reconfigurable components',
    difficulty: 'Advanced',
    estimatedTime: '75-105 min',
    features: ['Modular construction', 'Quick-connect hardware', 'Flexible layouts', 'Tool-free assembly'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['modular_hinge_system'],
      drawers: ['modular_drawer_system'],
      connectors: ['quick_connect_clips', 'modular_brackets']
    }
  }
];

// Sample floorplan data for demonstration
const sampleFloorplan = {
  id: 'professional-kitchen',
  name: 'Professional Kitchen Layout',
  walls: [
    { id: 'wall1', start: { x: 0, y: 0 }, end: { x: 6000, y: 0 }, height: 2400, thickness: 120 },
    { id: 'wall2', start: { x: 6000, y: 0 }, end: { x: 6000, y: 4000 }, height: 2400, thickness: 120 },
    { id: 'wall3', start: { x: 6000, y: 4000 }, end: { x: 0, y: 4000 }, height: 2400, thickness: 120 },
    { id: 'wall4', start: { x: 0, y: 4000 }, end: { x: 0, y: 0 }, height: 2400, thickness: 120 }
  ],
  rooms: [
    {
      id: 'kitchen',
      name: 'Kitchen',
      points: [
        { x: 100, y: 100 },
        { x: 5900, y: 100 },
        { x: 5900, y: 3900 },
        { x: 100, y: 3900 }
      ],
      color: 0xe3f2fd
    }
  ],
  cabinets: [
    {
      id: 'base-cabinet-1',
      type: 'base',
      position: { x: 200, y: 200 },
      dimensions: { width: 600, height: 720, depth: 560 },
      angle: 0,
      color: 0x8b4513
    },
    {
      id: 'wall-cabinet-1',
      type: 'wall',
      position: { x: 200, y: 200 },
      dimensions: { width: 600, height: 720, depth: 320 },
      angle: 0,
      mountHeight: 1400,
      color: 0x8b4513
    }
  ],
  doors: [
    {
      id: 'door-1',
      position: { x: 3000, y: 100 },
      dimensions: { width: 800, height: 2000 },
      angle: 0,
      doorType: 'single'
    }
  ],
  windows: [
    {
      id: 'window-1',
      position: { x: 1500, y: 100 },
      dimensions: { width: 1200, height: 1200 },
      angle: 0,
      sillHeight: 800
    }
  ],
  metadata: {
    scaleOption: '1:50' as const,
    unit: 'mm',
    showMeasurements: true,
    defaultWallHeight: 2400
  }
};

export default function IntegratedFloorplanUseCase() {
  const [selectedLevel, setSelectedLevel] = useState<'professional' | 'advanced'>('professional');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedPatterns, setGeneratedPatterns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'enhanced'>('enhanced');
  const [professionalMode, setProfessionalMode] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showDrillPatterns, setShowDrillPatterns] = useState(false);

  const useCases = selectedLevel === 'professional' ? PROFESSIONAL_USE_CASES : ADVANCED_USE_CASES;
  const selectedUseCaseData = useCases.find(uc => uc.id === selectedUseCase);

  useEffect(() => {
    if (selectedUseCaseData) {
      setProfessionalMode(selectedLevel === 'professional');
      setAdvancedMode(selectedLevel === 'advanced');
    }
  }, [selectedUseCaseData, selectedLevel]);

  const generateUseCasePatterns = () => {
    if (!selectedUseCaseData) return;

    const patterns = [];
    
    // Generate hinge patterns
    selectedUseCaseData.hardwareSpecs.hinges?.forEach((hingeId: string) => {
      try {
        const pattern = generateCNCPattern(hingeId as PatternId, {
          doorWidth: 600,
          doorHeight: 720,
          overlay: 20,
          hingeCount: 2
        });
        patterns.push({
          type: 'hinge',
          id: hingeId,
          pattern,
          category: 'door-hardware'
        });
      } catch (error) {
        console.warn(`Failed to generate pattern for ${hingeId}:`, error);
      }
    });

    // Generate drawer patterns
    selectedUseCaseData.hardwareSpecs.drawers?.forEach((drawerId: string) => {
      try {
        const pattern = generateCNCPattern(drawerId as PatternId, {
          cabinetWidth: 600,
          cabinetHeight: 720,
          drawerCount: 3,
          sideThickness: 19
        });
        patterns.push({
          type: 'drawer',
          id: drawerId,
          pattern,
          category: 'drawer-hardware'
        });
      } catch (error) {
        console.warn(`Failed to generate pattern for ${drawerId}:`, error);
      }
    });

    setGeneratedPatterns(patterns);
    setShowDrillPatterns(true);
  };

  const renderUseCaseSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Select {selectedLevel === 'professional' ? 'Professional' : 'Advanced'} Use Case
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb] max-w-2xl mx-auto">
          Choose a {selectedLevel.toLowerCase()} cabinet design scenario to explore with enhanced 3D visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card 
            key={useCase.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              selectedUseCase === useCase.id 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'bg-white dark:bg-[#182334]'
            }`}
            onClick={() => setSelectedUseCase(useCase.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  selectedLevel === 'professional' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {useCase.name}
                  </h4>
                  <Badge className={`text-xs mt-1 ${
                    selectedLevel === 'professional'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {useCase.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-[#90a7cb] mb-4">
              {useCase.description}
            </p>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {useCase.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {useCase.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{useCase.features.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#90a7cb]">
                <span>⏱ {useCase.estimatedTime}</span>
                <span>📊 {useCase.floorplanComplexity}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Configure {selectedUseCaseData?.name}
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Set up your {selectedLevel.toLowerCase()} cabinet system with enhanced 3D visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-[#182334]">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Hardware Configuration
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hinge System</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select hinge system" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUseCaseData?.hardwareSpecs.hinges?.map((hinge: string) => (
                    <SelectItem key={hinge} value={hinge}>
                      {hinge.replace(/_/g, ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Drawer System</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select drawer system" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUseCaseData?.hardwareSpecs.drawers?.map((drawer: string) => (
                    <SelectItem key={drawer} value={drawer}>
                      {drawer.replace(/_/g, ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateUseCasePatterns} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Generate Drill Patterns
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#182334]">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            3D View Settings
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Professional Mode</span>
              <Button
                variant={professionalMode ? "default" : "outline"}
                size="sm"
                onClick={() => setProfessionalMode(!professionalMode)}
              >
                {professionalMode ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Advanced Mode</span>
              <Button
                variant={advancedMode ? "default" : "outline"}
                size="sm"
                onClick={() => setAdvancedMode(!advancedMode)}
              >
                {advancedMode ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Drill Patterns</span>
              <Button
                variant={showDrillPatterns ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDrillPatterns(!showDrillPatterns)}
              >
                {showDrillPatterns ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const render3DVisualization = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Enhanced 3D Visualization
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Interactive 3D floorplan with {selectedLevel} features and drill pattern visualization.
        </p>
      </div>

      <EnhancedFloorPlan3DViewer
        floorPlan={sampleFloorplan}
        width={1200}
        height={800}
        showDrillPatterns={showDrillPatterns}
        drillPatterns={generatedPatterns}
        selectedUseCase={selectedUseCaseData?.name}
        professionalMode={professionalMode}
        advancedMode={advancedMode}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Move3D className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Integrated 3D Floorplan Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Professional and advanced cabinet design with enhanced 3D visualization
              </p>
            </div>
          </div>

          {/* Level Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedLevel === 'professional' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedLevel('professional');
                setSelectedUseCase('');
                setCurrentStep(1);
              }}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Professional Level
            </Button>
            <Button
              variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedLevel('advanced');
                setSelectedUseCase('');
                setCurrentStep(1);
              }}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Advanced Level
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Use Case
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="3" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              3D View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="mt-6">
            {renderUseCaseSelection()}
          </TabsContent>

          <TabsContent value="2" className="mt-6">
            {selectedUseCase ? renderConfiguration() : (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h3 className="text-lg font-semibold mb-2">Select a Use Case First</h3>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Please select a {selectedLevel.toLowerCase()} use case to continue with configuration.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="3" className="mt-6">
            {selectedUseCase ? render3DVisualization() : (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h3 className="text-lg font-semibold mb-2">Complete Configuration First</h3>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Please complete the configuration step before viewing the 3D visualization.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Status Bar */}
        {selectedUseCase && (
          <Card className="p-4 mt-6 bg-white dark:bg-[#182334]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Use Case: {selectedUseCaseData?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Level: {selectedLevel}</span>
                </div>
                {generatedPatterns.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Patterns: {generatedPatterns.length}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
