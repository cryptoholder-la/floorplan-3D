import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
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
  TrendingUp,
  HomeIcon,
  Building,
  Building2,
  Trees,
  Car,
  Sofa,
  Bed,
  Utensils,
  Bath,
  Tv,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Palette,
  Music,
  Heart,
  Baby,
  Dog,
  Cat
} from 'lucide-react';
import { generateCNCPattern } from '@/lib/drill-patterns-library';
import { AVAILABLE_PATTERNS, PatternId } from '@/lib/drill-patterns-library';
import { Status } from '@/types';

// Residential use case configurations
const RESIDENTIAL_USE_CASES = [
  {
    id: 'modern-kitchen',
    name: 'Modern Kitchen Design',
    description: 'Contemporary kitchen with island and smart appliances',
    difficulty: 'Intermediate',
    estimatedTime: '35-50 min',
    features: ['Kitchen island', 'Smart appliances', 'Pantry storage', 'Breakfast nook'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['blum_clip_53', 'blum_nexis_155'],
      drawers: ['blum_tandem_56', 'blum_movento_550'],
      accessories: ['pull_out_pantries', 'spice_racks', 'utensil_dividers']
    }
  },
  {
    id: 'master-suite',
    name: 'Master Suite Retreat',
    description: 'Luxurious bedroom with walk-in closet and en-suite bathroom',
    difficulty: 'Advanced',
    estimatedTime: '45-60 min',
    features: ['Walk-in closet', 'En-suite bathroom', 'Sitting area', 'Storage solutions'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['salice_invisible_180', 'hafele_metall_110'],
      drawers: ['hettich_innotech_450', 'grass_dynapro'],
      accessories: ['wardrobe_systems', 'vanity_storage', 'jewelry_drawers']
    }
  },
  {
    id: 'family-living',
    name: 'Family Living Room',
    description: 'Spacious living area with entertainment center and storage',
    difficulty: 'Beginner',
    estimatedTime: '25-35 min',
    features: ['Entertainment center', 'Built-in storage', 'Reading nook', 'Play area'],
    floorplanComplexity: 'Low',
    hardwareSpecs: {
      hinges: ['blum_clip_53'],
      drawers: ['blum_tandem_56'],
      accessories: ['media_cabinets', 'bookshelves', 'toy_storage']
    }
  },
  {
    id: 'home-office',
    name: 'Productive Home Office',
    description: 'Ergonomic workspace with ample storage and organization',
    difficulty: 'Intermediate',
    estimatedTime: '30-40 min',
    features: ['Built-in desk', 'File storage', 'Bookshelves', 'Technology integration'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['hettich_wingline_l_107'],
      drawers: ['hettich_quadra_450'],
      accessories: ['file_drawers', 'cable_management', 'monitor_arms']
    }
  },
  {
    id: 'kids-bedroom',
    name: 'Kids Bedroom',
    description: 'Fun and functional bedroom with study area and play space',
    difficulty: 'Beginner',
    estimatedTime: '20-30 min',
    features: ['Study area', 'Toy storage', 'Closet system', 'Play space'],
    floorplanComplexity: 'Low',
    hardwareSpecs: {
      hinges: ['blum_clip_53'],
      drawers: ['blum_tandem_56'],
      accessories: ['toy_organizers', 'study_desk', 'closet_systems']
    }
  },
  {
    id: 'guest-suite',
    name: 'Guest Suite',
    description: 'Comfortable guest room with private bathroom and amenities',
    difficulty: 'Intermediate',
    estimatedTime: '25-35 min',
    features: ['Private bathroom', 'Closet space', 'Sitting area', 'Amenities'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['salice_invisible_180'],
      drawers: ['grass_dynapro'],
      accessories: ['guest_closets', 'vanity_storage', 'linen_cabinets']
    }
  }
];

// Commercial use case configurations
const COMMERCIAL_USE_CASES = [
  {
    id: 'office-layout',
    name: 'Modern Office Layout',
    description: 'Open-plan office with collaborative spaces and private offices',
    difficulty: 'Advanced',
    estimatedTime: '60-90 min',
    features: ['Open workspace', 'Meeting rooms', 'Break area', 'Storage systems'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['commercial_heavy_duty'],
      drawers: ['commercial_ball_bearing'],
      accessories: ['file_cabinets', 'storage_lockers', 'conference_tables']
    }
  },
  {
    id: 'retail-store',
    name: 'Retail Store Design',
    description: 'Optimized retail space with display areas and storage',
    difficulty: 'Professional',
    estimatedTime: '75-120 min',
    features: ['Display areas', 'Storage rooms', 'Checkout counters', 'Customer flow'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['retail_display_hinges'],
      drawers: ['retail_storage_drawers'],
      accessories: ['display_cases', 'storage_racks', 'checkout_counters']
    }
  },
  {
    id: 'restaurant-kitchen',
    name: 'Commercial Restaurant Kitchen',
    description: 'Professional kitchen with workflow optimization and storage',
    difficulty: 'Professional',
    estimatedTime: '90-150 min',
    features: ['Cooking stations', 'Prep areas', 'Storage solutions', 'Safety compliance'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['commercial_stainless'],
      drawers: ['commercial_heavy_duty'],
      accessories: ['food_storage', 'prep_tables', 'dishwashing_stations']
    }
  },
  {
    id: 'medical-office',
    name: 'Medical Office Suite',
    description: 'Healthcare facility with patient rooms and treatment areas',
    difficulty: 'Advanced',
    estimatedTime: '70-100 min',
    features: ['Patient rooms', 'Treatment areas', 'Storage', 'Waiting room'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['medical_grade_hinges'],
      drawers: ['medical_storage_drawers'],
      accessories: ['medical_cabinets', 'treatment_rooms', 'record_storage']
    }
  },
  {
    id: 'fitness-center',
    name: 'Fitness Center Layout',
    description: 'Gym and fitness facility with equipment placement and amenities',
    difficulty: 'Intermediate',
    estimatedTime: '50-80 min',
    features: ['Workout areas', 'Locker rooms', 'Reception', 'Storage'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['heavy_duty_hinges'],
      drawers: ['industrial_drawers'],
      accessories: ['lockers', 'equipment_storage', 'reception_desk']
    }
  },
  {
    id: 'co-working-space',
    name: 'Co-working Space',
    description: 'Flexible workspace with hot desks and private offices',
    difficulty: 'Intermediate',
    estimatedTime: '55-85 min',
    features: ['Hot desks', 'Private offices', 'Meeting rooms', 'Common areas'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['modern_office_hinges'],
      drawers: ['office_drawers'],
      accessories: ['desk_systems', 'storage_lockers', 'meeting_furniture']
    }
  }
];

// Sample floorplan data for demonstration
const sampleFloorplan = {
  id: 'residential-layout',
  name: 'Residential Layout',
  walls: [
    { id: 'wall1', start: { x: 0, y: 0 }, end: { x: 10000, y: 0 }, height: 2800, thickness: 120 },
    { id: 'wall2', start: { x: 10000, y: 0 }, end: { x: 10000, y: 8000 }, height: 2800, thickness: 120 },
    { id: 'wall3', start: { x: 10000, y: 8000 }, end: { x: 0, y: 8000 }, height: 2800, thickness: 120 },
    { id: 'wall4', start: { x: 0, y: 8000 }, end: { x: 0, y: 0 }, height: 2800, thickness: 120 }
  ],
  rooms: [
    {
      id: 'living-room',
      name: 'Living Room',
      points: [
        { x: 100, y: 100 },
        { x: 4900, y: 100 },
        { x: 4900, y: 3900 },
        { x: 100, y: 3900 }
      ],
      color: 0xe8f5e8
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      points: [
        { x: 5100, y: 100 },
        { x: 9900, y: 100 },
        { x: 9900, y: 3900 },
        { x: 5100, y: 3900 }
      ],
      color: 0xfff5e6
    }
  ],
  cabinets: [
    {
      id: 'kitchen-cabinet-1',
      type: 'base',
      position: { x: 5200, y: 200 },
      dimensions: { width: 600, height: 720, depth: 560 },
      angle: 0,
      color: 0x8b4513
    },
    {
      id: 'living-cabinet-1',
      type: 'wall',
      position: { x: 200, y: 200 },
      dimensions: { width: 800, height: 720, depth: 320 },
      angle: 0,
      mountHeight: 1400,
      color: 0x654321
    }
  ],
  doors: [
    {
      id: 'front-door',
      position: { x: 2500, y: 100 },
      dimensions: { width: 900, height: 2000 },
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
    defaultWallHeight: 2800
  }
};

export default function ResidentialCommercialUseCase() {
  const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial'>('residential');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedPatterns, setGeneratedPatterns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'enhanced'>('enhanced');
  const [showDrillPatterns, setShowDrillPatterns] = useState(false);

  const useCases = selectedCategory === 'residential' ? RESIDENTIAL_USE_CASES : COMMERCIAL_USE_CASES;
  const selectedUseCaseData = useCases.find(uc => uc.id === selectedUseCase);

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
          Select {selectedCategory === 'residential' ? 'Residential' : 'Commercial'} Use Case
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb] max-w-2xl mx-auto">
          Choose a {selectedCategory.toLowerCase()} scenario to explore with specialized design solutions and hardware.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            variant={selectedCategory === 'residential' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('residential');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Residential
          </Button>
          <Button
            variant={selectedCategory === 'commercial' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('commercial');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Commercial
          </Button>
        </div>
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
                  selectedCategory === 'residential' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {selectedCategory === 'residential' ? (
                    <HomeIcon className="w-6 h-6" />
                  ) : (
                    <Building className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {useCase.name}
                  </h4>
                  <Badge className={`text-xs mt-1 ${
                    useCase.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    useCase.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    useCase.difficulty === 'Advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
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
          Set up your {selectedCategory.toLowerCase()} space with specialized hardware and configurations.
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
              <Package className="w-4 h-4 mr-2" />
              Generate Drill Patterns
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#182334]">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            {selectedCategory === 'residential' ? (
              <HomeIcon className="w-4 h-4" />
            ) : (
              <Building className="w-4 h-4" />
            )}
            {selectedCategory === 'residential' ? 'Residential' : 'Commercial'} Settings
          </h4>
          
          <div className="space-y-4">
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

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCategory === 'residential' ? 'Comfort Features' : 'Business Features'}
              </span>
              <Button
                variant="outline"
                size="sm"
              >
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCategory === 'residential' ? 'Lifestyle Integration' : 'Workflow Optimization'}
              </span>
              <Button
                variant="outline"
                size="sm"
              >
                Optimize
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderVisualization = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {selectedCategory === 'residential' ? 'Residential' : 'Commercial'} Visualization
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Interactive floorplan with specialized {selectedCategory.toLowerCase()} features and drill pattern visualization.
        </p>
      </div>

      <Card className="p-6 bg-white dark:bg-[#182334]">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${
              selectedCategory === 'residential' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {selectedCategory === 'residential' ? (
                <HomeIcon className="w-12 h-12" />
              ) : (
                <Building className="w-12 h-12" />
              )}
            </div>
            <h4 className="text-lg font-semibold mb-2">
              {selectedUseCaseData?.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedUseCaseData?.description}
            </p>
            
            {showDrillPatterns && generatedPatterns.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium mb-2">Generated Drill Patterns:</h5>
                <div className="space-y-2">
                  {generatedPatterns.map((pattern, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {pattern.type}: {pattern.id} ({pattern.pattern.points?.length || 0} points)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              {selectedCategory === 'residential' ? (
                <HomeIcon className="w-8 h-8 text-primary" />
              ) : (
                <Building className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Residential & Commercial Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Specialized solutions for residential comfort and commercial efficiency
              </p>
            </div>
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
              Visualization
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
                  Please select a {selectedCategory.toLowerCase()} use case to continue with configuration.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="3" className="mt-6">
            {selectedUseCase ? renderVisualization() : (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <h3 className="text-lg font-semibold mb-2">Complete Configuration First</h3>
                <p className="text-slate-600 dark:text-[#90a7cb]">
                  Please complete the configuration step before viewing the visualization.
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
                  <span className="text-sm font-medium">Category: {selectedCategory}</span>
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
