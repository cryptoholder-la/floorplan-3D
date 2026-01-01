import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';

import { /* from @/ui/card */ } from '@/ui/card';
import { /* from @/ui/button */ } from '@/ui/button';
import { /* from @/ui/badge */ } from '@/ui/badge';
import { /* from @/ui/tabs */ } from '@/ui/tabs';
import { /* from @/ui/select */ } from '@/ui/select';
import { /* from @/lib/drill-patterns-library */ } from '@/lib/drill-patterns-library';
import { /* from @/types */ } from '@/types';

// Merged functions from similar files

// From: educational
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

// From: educational
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

// From: educational
  const renderUseCaseSelection = () => (
    <div className="space-y-6">

// From: educational
  const renderConfiguration = () => (
    <div className="space-y-6">

// From: educational
  const renderVisualization = () => (
    <div className="space-y-6">

// From: residential
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

// From: workshop
export default function WorkshopManufacturingUseCase() {
  const [selectedCategory, setSelectedCategory] = useState<'workshop' | 'manufacturing'>('workshop');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedPatterns, setGeneratedPatterns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'enhanced'>('enhanced');
  const [showDrillPatterns, setShowDrillPatterns] = useState(false);

  const useCases = selectedCategory === 'workshop' ? WORKSHOP_USE_CASES : MANUFACTURING_USE_CASES;
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
          Select {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Use Case
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb] max-w-2xl mx-auto">
          Choose a {selectedCategory.toLowerCase()} scenario to explore with specialized hardware and workflows.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            variant={selectedCategory === 'workshop' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('workshop');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Workshop
          </Button>
          <Button
            variant={selectedCategory === 'manufacturing' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('manufacturing');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Gauge className="w-4 h-4" />
            Manufacturing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card 
            key={useCase.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              selectedUseCase === useCase.id 
                ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                : 'bg-white dark:bg-[#182334]'
            }`}
            onClick={() => setSelectedUseCase(useCase.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  selectedCategory === 'workshop' 
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
                }`}>
                  {selectedCategory === 'workshop' ? (
                    <Wrench className="w-6 h-6" />
                  ) : (
                    <Gauge className="w-6 h-6" />
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
          Set up your {selectedCategory.toLowerCase()} system with specialized hardware and configurations.
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
              <Drill className="w-4 h-4 mr-2" />
              Generate Drill Patterns
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#182334]">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Settings
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
              <span className="text-sm font-medium">Safety Features</span>
              <Button
                variant="outline"
                size="sm"
              >
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Workflow Optimization</span>
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
          {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Visualization
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Interactive floorplan with specialized {selectedCategory.toLowerCase()} features and drill pattern visualization.
        </p>
      </div>

      <Card className="p-6 bg-white dark:bg-[#182334]">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${
              selectedCategory === 'workshop' 
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
            }`}>
              {selectedCategory === 'workshop' ? (
                <Wrench className="w-12 h-12" />
              ) : (
                <Gauge className="w-12 h-12" />
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
              {selectedCategory === 'workshop' ? (
                <Wrench className="w-8 h-8 text-primary" />
              ) : (
                <Gauge className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Workshop & Manufacturing Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Specialized solutions for workshop organization and manufacturing efficiency
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
                  <TrendingUp className="w-4 h-4 text-orange-500" />
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
export default function WorkshopManufacturingUseCase() {
  const [selectedCategory, setSelectedCategory] = useState<'workshop' | 'manufacturing'>('workshop');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedPatterns, setGeneratedPatterns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'enhanced'>('enhanced');
  const [showDrillPatterns, setShowDrillPatterns] = useState(false);

  const useCases = selectedCategory === 'workshop' ? WORKSHOP_USE_CASES : MANUFACTURING_USE_CASES;
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
          Select {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Use Case
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb] max-w-2xl mx-auto">
          Choose a {selectedCategory.toLowerCase()} scenario to explore with specialized hardware and workflows.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            variant={selectedCategory === 'workshop' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('workshop');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Workshop
          </Button>
          <Button
            variant={selectedCategory === 'manufacturing' ? 'default' : 'ghost'}
            onClick={() => {
              setSelectedCategory('manufacturing');
              setSelectedUseCase('');
              setCurrentStep(1);
            }}
            className="flex items-center gap-2"
          >
            <Gauge className="w-4 h-4" />
            Manufacturing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card 
            key={useCase.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              selectedUseCase === useCase.id 
                ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                : 'bg-white dark:bg-[#182334]'
            }`}
            onClick={() => setSelectedUseCase(useCase.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  selectedCategory === 'workshop' 
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
                }`}>
                  {selectedCategory === 'workshop' ? (
                    <Wrench className="w-6 h-6" />
                  ) : (
                    <Gauge className="w-6 h-6" />
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
          Set up your {selectedCategory.toLowerCase()} system with specialized hardware and configurations.
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
              <Drill className="w-4 h-4 mr-2" />
              Generate Drill Patterns
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-[#182334]">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Settings
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
              <span className="text-sm font-medium">Safety Features</span>
              <Button
                variant="outline"
                size="sm"
              >
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Workflow Optimization</span>
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
          {selectedCategory === 'workshop' ? 'Workshop' : 'Manufacturing'} Visualization
        </h3>
        <p className="text-slate-600 dark:text-[#90a7cb]">
          Interactive floorplan with specialized {selectedCategory.toLowerCase()} features and drill pattern visualization.
        </p>
      </div>

      <Card className="p-6 bg-white dark:bg-[#182334]">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${
              selectedCategory === 'workshop' 
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
            }`}>
              {selectedCategory === 'workshop' ? (
                <Wrench className="w-12 h-12" />
              ) : (
                <Gauge className="w-12 h-12" />
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
              {selectedCategory === 'workshop' ? (
                <Wrench className="w-8 h-8 text-primary" />
              ) : (
                <Gauge className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Workshop & Manufacturing Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Specialized solutions for workshop organization and manufacturing efficiency
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
                  <TrendingUp className="w-4 h-4 text-orange-500" />
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
