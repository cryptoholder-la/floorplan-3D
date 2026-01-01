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
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Brain,
  LightbulbIcon,
  Rocket,
  Star,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond
} from 'lucide-react';
import { generateCNCPattern } from '@/lib/drill-patterns-library';
import { AVAILABLE_PATTERNS, PatternId } from '@/lib/drill-patterns-library';
import { Status } from '@/types';

// Educational use case configurations
const EDUCATIONAL_USE_CASES = [
  {
    id: 'classroom-design',
    name: 'Modern Classroom Design',
    description: 'Interactive learning space with flexible seating and technology integration',
    difficulty: 'Intermediate',
    estimatedTime: '35-50 min',
    features: ['Flexible seating', 'Smart boards', 'Storage solutions', 'Collaborative zones'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['blum_clip_53', 'hettich_wingline_l_107'],
      drawers: ['blum_tandem_56', 'hettich_innotech_450'],
      accessories: ['storage_cabinets', 'tech_integration', 'flexible_furniture']
    }
  },
  {
    id: 'library-layout',
    name: 'Library & Study Center',
    description: 'Comprehensive library with individual study areas and collaborative spaces',
    difficulty: 'Advanced',
    estimatedTime: '45-65 min',
    features: ['Study carrels', 'Group rooms', 'Book storage', 'Tech stations'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['salice_invisible_180', 'hafele_metall_110'],
      drawers: ['grass_dynapro', 'blum_movento_550'],
      accessories: ['bookshelves', 'study_cabinets', 'tech_stations']
    }
  },
  {
    id: 'science-lab',
    name: 'Science Laboratory',
    description: 'Fully equipped science lab with safety features and specialized storage',
    difficulty: 'Professional',
    estimatedTime: '60-90 min',
    features: ['Lab stations', 'Safety equipment', 'Chemical storage', 'Prep areas'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['lab_safety_hinges'],
      drawers: ['lab_storage_drawers'],
      accessories: ['fume_hoods', 'safety_cabinets', 'equipment_storage']
    }
  },
  {
    id: 'art-studio',
    name: 'Art & Design Studio',
    description: 'Creative space with easels, storage, and specialized lighting',
    difficulty: 'Intermediate',
    estimatedTime: '30-45 min',
    features: ['Easel areas', 'Art storage', 'Lighting systems', 'Display spaces'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['blum_clip_53'],
      drawers: ['blum_tandem_56'],
      accessories: ['art_storage', 'display_systems', 'lighting_rigs']
    }
  },
  {
    id: 'music-room',
    name: 'Music Practice Room',
    description: 'Acoustic-treated space for music practice and instrument storage',
    difficulty: 'Advanced',
    estimatedTime: '40-60 min',
    features: ['Acoustic treatment', 'Instrument storage', 'Practice areas', 'Recording setup'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['acoustic_hinges'],
      drawers: ['instrument_drawers'],
      accessories: ['acoustic_panels', 'instrument_racks', 'recording_equipment']
    }
  },
  {
    id: 'computer-lab',
    name: 'Computer Lab',
    description: 'Technology-focused learning space with workstations and server area',
    difficulty: 'Intermediate',
    estimatedTime: '35-55 min',
    features: ['Workstations', 'Server room', 'Cable management', 'Collaborative areas'],
    floorplanComplexity: 'Medium',
    hardwareSpecs: {
      hinges: ['tech_cabinet_hinges'],
      drawers: ['server_rack_drawers'],
      accessories: ['cable_management', 'workstation_desks', 'server_racks']
    }
  }
];

// Healthcare use case configurations
const HEALTHCARE_USE_CASES = [
  {
    id: 'patient-room',
    name: 'Patient Room Suite',
    description: 'Comfortable and functional patient room with medical equipment integration',
    difficulty: 'Professional',
    estimatedTime: '50-75 min',
    features: ['Patient bed area', 'Medical equipment', 'Storage', 'Family space'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['medical_grade_hinges'],
      drawers: ['medical_storage_drawers'],
      accessories: ['medical_cabinets', 'bedside_storage', 'equipment_racks']
    }
  },
  {
    id: 'operating-room',
    name: 'Operating Theater',
    description: 'State-of-the-art surgical suite with sterile workflow and equipment',
    difficulty: 'Expert',
    estimatedTime: '90-150 min',
    features: ['Surgical table', 'Equipment booms', 'Sterile storage', 'Recovery area'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['surgical_hinges'],
      drawers: ['sterile_drawers'],
      accessories: ['surgical_cabinets', 'equipment_booms', 'sterile_storage']
    }
  },
  {
    id: 'emergency-department',
    name: 'Emergency Department',
    description: 'Fast-paced emergency care area with triage and treatment zones',
    difficulty: 'Expert',
    estimatedTime: '80-120 min',
    features: ['Triage area', 'Treatment bays', 'Imaging suite', 'Family waiting'],
    floorplanComplexity: 'Very High',
    hardwareSpecs: {
      hinges: ['emergency_hinges'],
      drawers: ['emergency_drawers'],
      accessories: ['medical_carts', 'treatment_cabinets', 'storage_systems']
    }
  },
  {
    id: 'rehabilitation-center',
    name: 'Rehabilitation Center',
    description: 'Therapeutic space for physical therapy and rehabilitation exercises',
    difficulty: 'Advanced',
    estimatedTime: '55-85 min',
    features: ['Therapy areas', 'Exercise equipment', 'Patient rooms', 'Family spaces'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['rehab_hinges'],
      drawers: ['therapy_drawers'],
      accessories: ['equipment_storage', 'therapy_cabinets', 'patient_furniture']
    }
  },
  {
    id: 'dental-office',
    name: 'Dental Office Suite',
    description: 'Modern dental practice with treatment rooms and sterilization center',
    difficulty: 'Professional',
    estimatedTime: '60-90 min',
    features: ['Treatment rooms', 'Sterilization', 'Waiting area', 'Consultation rooms'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['dental_hinges'],
      drawers: ['dental_drawers'],
      accessories: ['dental_cabinets', 'sterilization_units', 'treatment_furniture']
    }
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Dispensary',
    description: 'Organized medication storage and dispensing area with security features',
    difficulty: 'Advanced',
    estimatedTime: '45-70 min',
    features: ['Medication storage', 'Dispensing area', 'Consultation room', 'Security'],
    floorplanComplexity: 'High',
    hardwareSpecs: {
      hinges: ['security_hinges'],
      drawers: ['medication_drawers'],
      accessories: ['security_cabinets', 'dispensing_counters', 'storage_systems']
    }
  }
];

// Sample floorplan data for demonstration
const sampleFloorplan = {
  id: 'educational-layout',
  name: 'Educational Layout',
  walls: [
    { id: 'wall1', start: { x: 0, y: 0 }, end: { x: 12000, y: 0 }, height: 3000, thickness: 120 },
    { id: 'wall2', start: { x: 12000, y: 0 }, end: { x: 12000, y: 8000 }, height: 3000, thickness: 120 },
    { id: 'wall3', start: { x: 12000, y: 8000 }, end: { x: 0, y: 8000 }, height: 3000, thickness: 120 },
    { id: 'wall4', start: { x: 0, y: 8000 }, end: { x: 0, y: 0 }, height: 3000, thickness: 120 }
  ],
  rooms: [
    {
      id: 'classroom',
      name: 'Main Classroom',
      points: [
        { x: 100, y: 100 },
        { x: 5900, y: 100 },
        { x: 5900, y: 3900 },
        { x: 100, y: 3900 }
      ],
      color: 0xe6f3ff
    },
    {
      id: 'lab',
      name: 'Science Lab',
      points: [
        { x: 6100, y: 100 },
        { x: 11900, y: 100 },
        { x: 11900, y: 3900 },
        { x: 6100, y: 3900 }
      ],
      color: 0xfff0e6
    }
  ],
  cabinets: [
    {
      id: 'storage-cabinet-1',
      type: 'base',
      position: { x: 200, y: 200 },
      dimensions: { width: 800, height: 900, depth: 600 },
      angle: 0,
      color: 0x4a5568
    },
    {
      id: 'lab-cabinet-1',
      type: 'wall',
      position: { x: 6200, y: 200 },
      dimensions: { width: 1000, height: 720, depth: 400 },
      angle: 0,
      mountHeight: 1600,
      color: 0x2d3748
    }
  ],
  doors: [
    {
      id: 'classroom-door',
      position: { x: 3000, y: 100 },
      dimensions: { width: 900, height: 2000 },
      angle: 0,
      doorType: 'single'
    }
  ],
  windows: [
    {
      id: 'window-1',
      position: { x: 1500, y: 100 },
      dimensions: { width: 1800, height: 1400 },
      angle: 0,
      sillHeight: 1000
    }
  ],
  metadata: {
    scaleOption: '1:50' as const,
    unit: 'mm',
    showMeasurements: true,
    defaultWallHeight: 3000
  }
};

export default function EducationalHealthcareUseCase() {
  const [selectedCategory, setSelectedCategory] = useState<'educational' | 'healthcare'>('educational');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedPatterns, setGeneratedPatterns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'enhanced'>('enhanced');
  const [showDrillPatterns, setShowDrillPatterns] = useState(false);

  const useCases = selectedCategory === 'educational' ? EDUCATIONAL_USE_CASES : HEALTHCARE_USE_CASES;
  const selectedUseCaseData = useCases.find(uc => uc.id === selectedUseCase);

  const generateUseCasePatterns = () => {
    if (!selectedUseCaseData) return;

    const patterns = [];
    
    // Generate hinge patterns
    selectedUseCaseData.hardwareSpecs.hinges?.forEach((hingeId: string) => {
      try {
        const pattern = generateCNCPattern(hingeId as PatternId, {
          doorWidth: 800,
          doorHeight: 900,
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
          cabinetWidth: 800,
          cabinetHeight: 900,
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
          Select {selectedCategory === 'educational' ? 'Educational' : 'Healthcare'} Use Case
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb] max-w-2xl mx-auto">
          Choose a {selectedCategory.toLowerCase()} scenario to explore with specialized design solutions and regulatory compliance.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            variant={selectedCategory === 'educational' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('educational');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Educational
          </Button>
          <Button
            variant={selectedCategory === 'healthcare' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('healthcare');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Healthcare
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card 
            key={useCase.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              selectedUseCase === useCase.id 
                ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'bg-white dark:bg-[#182334]'
            }`}
            onClick={() => setSelectedUseCase(useCase.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  selectedCategory === 'educational' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {selectedCategory === 'educational' ? (
                    <GraduationCap className="w-6 h-6" />
                  ) : (
                    <Heart className="w-6 h-6" />
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
                    useCase.difficulty === 'Professional' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
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
          Set up your {selectedCategory.toLowerCase()} facility with specialized hardware and compliance requirements.
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
            {selectedCategory === 'educational' ? (
              <GraduationCap className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
            {selectedCategory === 'educational' ? 'Educational' : 'Healthcare'} Settings
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
                {selectedCategory === 'educational' ? 'Learning Features' : 'Medical Compliance'}
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
                {selectedCategory === 'educational' ? 'Technology Integration' : 'Safety Standards'}
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
          {selectedCategory === 'educational' ? 'Educational' : 'Healthcare'} Visualization
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Interactive floorplan with specialized {selectedCategory.toLowerCase()} features and drill pattern visualization.
        </p>
      </div>

      <Card className="p-6 bg-white dark:bg-[#182334]">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${
              selectedCategory === 'educational' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {selectedCategory === 'educational' ? (
                <GraduationCap className="w-12 h-12" />
              ) : (
                <Heart className="w-12 h-12" />
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
              {selectedCategory === 'educational' ? (
                <GraduationCap className="w-8 h-8 text-primary" />
              ) : (
                <Heart className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Educational & Healthcare Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Specialized solutions for learning environments and healthcare facilities
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
                  <TrendingUp className="w-4 h-4 text-purple-500" />
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
