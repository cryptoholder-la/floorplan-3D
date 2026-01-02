'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  Download, 
  Settings,
  Box,
  RotateCcw,
  Maximize2,
  Search,
  Grid,
  List,
  Package,
  Ruler,
  Zap,
  Layers,
  Filter
} from 'lucide-react';
import { Cabinet, CabinetType } from '@/types/domain/cabinet.types';
import { CabinetWidth, CabinetDepth, CabinetHeight, Difficulty, Status } from '@/types/core/base.types';
import { capitalize } from "@/lib/utils/string";

interface AdvancedCabinetViewerProps {
  className?: string;
  cabinet?: Cabinet;
  onCabinetSelect?: (cabinet: Cabinet) => void;
  viewMode?: '3d' | 'wireframe' | 'both';
}

const PROFESSIONAL_CABINET_COLLECTION: Cabinet[] = [
  {
    id: 'base-cabinet-24-professional',
    name: 'Professional Base Cabinet 24"',
    type: 'base' as CabinetType,
    dimensions: { width: 24 as CabinetWidth, height: 34.5 as CabinetHeight, depth: 24 as CabinetDepth },
    parts: [
      {
        id: 'base-left-side-professional',
        name: 'Left Side Panel - Professional Grade',
        partType: 'side',
        material: {
          id: 'premium-birch-18mm',
          name: 'Premium Birch Plywood',
          type: 'plywood',
          thickness: 18,
          grade: 'A',
          surfaceFinish: 'smooth',
          moistureContent: 7,
          formaldehydeEmission: 'E0',
          fireRating: 'Class-1',
          structuralProperties: {
            modulusOfElasticity: 13500,
            modulusOfRupture: 95,
            compressiveStrength: 50,
            shearStrength: 14,
            hardness: 980,
            density: 710
          },
          workability: {
            easeOfCutting: 9,
            machiningQuality: 9,
            screwHolding: 9,
            glueBonding: 10,
            finishingQuality: 10
          },
          pricePerUnit: 65.75,
          unit: 'sheet'
        },
        dimensions: { width: 18, height: 720, thickness: 18 },
        quantity: 1,
        grainDirection: 'vertical',
        edgeBanding: {
          top: { enabled: true, thickness: 0.6, color: '#8b4513' },
          bottom: { enabled: true, thickness: 0.6, color: '#8b4513' },
          left: { enabled: false, thickness: 0 },
          right: { enabled: false, thickness: 0 }
        },
        machining: {
          drilling: [],
          routing: [],
          cutting: [],
          sanding: [],
          assembly: []
        },
        hardware: [],
        tolerances: [],
        cost: 65.75,
        weight: 14.2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ],
    hardware: [],
    materials: [],
    configuration: {
      style: 'shaker',
      construction: 'frameless',
      joinery: 'mortise-tenon',
      finishing: {
        interior: {
          material: 'Premium Melamine',
          color: 'White',
          sheen: 'matte',
          texture: 'smooth'
        },
        exterior: {
          material: 'Cherry veneer',
          color: 'Natural Cherry',
          sheen: 'satin',
          texture: 'grained'
        },
        edgeBanding: {
          enabled: true,
          material: 'Solid Wood',
          thickness: 0.6,
          color: '#8b4513',
          grainDirection: 'horizontal',
          application: 'hot-melt'
        },
        protectiveCoating: {
          type: 'polyurethane',
          sheen: 'satin',
          coats: 3,
          application: 'spray'
        }
      },
      hardware: {
        hinges: {
          type: 'concealed',
          brand: 'Blum',
          model: 'Compact 33X',
          finish: 'satin-nickel',
          quantity: 2,
          features: ['Soft-close', '3D adjustment', 'Lift-up support']
        },
        handles: {
          type: 'bar-pull',
          brand: 'Top Knobs',
          model: 'TK-Professional',
          finish: 'satin-nickel',
          quantity: 2,
          spacing: 128,
          features: ['Ergonomic design', 'Weight-balanced']
        },
        drawerSlides: {
          type: 'undermount',
          brand: 'Blum',
          model: 'Movento D8',
          finish: 'satin-nickel',
          quantity: 0,
          features: ['Soft-close', 'Push-to-open', 'Load capacity 100kg']
        },
        shelfSupports: {
          type: 'adjustable',
          brand: 'Blum',
          model: 'Shelf Support Pro',
          finish: 'satin-nickel',
          quantity: 8,
          spacing: 32
        }
      },
      customizations: {
        modifications: [],
        specialFeatures: [
          {
            name: 'LED lighting',
            description: 'Integrated LED lighting system for enhanced visibility',
            category: 'lighting' as const,
            cost: 150.00,
            timeImpact: 2,
            requirements: ['Power source access', 'Switch installation']
          },
          {
            name: 'Soft-close everywhere',
            description: 'Soft-close mechanisms on all doors and drawers',
            category: 'accessibility' as const,
            cost: 85.00,
            timeImpact: 1,
            requirements: ['Compatible hardware', 'Proper alignment']
          },
          {
            name: 'Premium materials',
            description: 'High-grade materials throughout the cabinet construction',
            category: 'custom' as const,
            cost: 200.00,
            timeImpact: 0,
            requirements: ['Material availability', 'Skilled craftsmanship']
          }
        ],
        customParts: [],
        uniqueRequirements: []
      }
    },
    estimatedCost: 425.00,
    estimatedTime: 6.5,
    difficulty: 'advanced' as Difficulty,
    status: 'available' as Status,
    notes: 'Professional grade base cabinet with premium materials and advanced hardware',
    tags: ['professional', 'base', 'shaker', 'premium', 'soft-close'],
    metadata: {
      roomType: 'kitchen',
      installationType: 'floor-mounted',
      weightCapacity: 75,
      doorStyle: 'full-overlay',
      finishType: 'stain',
      assemblyRequired: true,
      customFeatures: ['LED lighting', 'Soft-close hardware', 'Premium materials']
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export default function AdvancedCabinetViewer({ 
  className = "", 
  cabinet,
  onCabinetSelect,
  viewMode = '3d'
}: AdvancedCabinetViewerProps) {
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(cabinet || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'difficulty'>('name');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredAndSortedCabinets = useMemo(() => {
    let filtered = PROFESSIONAL_CABINET_COLLECTION.filter(cabinet => {
      const matchesSearch = cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cabinet.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cabinet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || cabinet.type === selectedCategory;
      const matchesDifficulty = filterDifficulty === 'all' || cabinet.difficulty === filterDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.estimatedCost || 0) - (b.estimatedCost || 0);
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'intermediate': 2, 'advanced': 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, filterDifficulty]);

  const handleCabinetSelect = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    onCabinetSelect?.(cabinet);
  };

  const handleView3D = () => {
    if (!selectedCabinet) return;
    console.log('Viewing 3D model for:', selectedCabinet.name);
  };

  const handleExport = () => {
    if (!selectedCabinet) return;
    console.log('Exporting cabinet:', selectedCabinet.name);
  };

  const renderCabinetPreview = (cabinet: Cabinet) => {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative border-2 border-dashed border-slate-300">
        <div className="text-center">
          <Box className="w-16 h-16 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600 truncate px-2">{cabinet.name}</p>
          <p className="text-xs text-slate-500">{cabinet.type} cabinet</p>
        </div>
        
        <div className="absolute bottom-2 right-2 text-xs bg-white/80 px-2 py-1 rounded">
          {cabinet.dimensions.width}"W × {cabinet.dimensions.height}"H × {cabinet.dimensions.depth}"D
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {cabinet.parts.length} parts
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2">
          <Badge variant={cabinet.difficulty === 'advanced' ? 'destructive' : cabinet.difficulty === 'intermediate' ? 'default' : 'secondary'} className="text-xs">
            {cabinet.difficulty}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Professional Cabinet Viewer
          </CardTitle>
          <CardDescription>
            Advanced cabinet browsing with 3D visualization and professional-grade filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="viewer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="mt-6">
              <div className="space-y-4">
                {/* Main 3D Viewer */}
                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  {selectedCabinet ? (
                    <div className="text-center">
                      <Box className="w-24 h-24 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-700">{selectedCabinet.name}</h3>
                      <p className="text-slate-600">Professional 3D visualization</p>
                      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                        <span>View: {viewMode}</span>
                        <span>Type: {selectedCabinet.type}</span>
                        <span>Difficulty: {selectedCabinet.difficulty}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-600">Select a cabinet to view</p>
                      <p className="text-sm text-slate-500">Choose from the Collection tab</p>
                    </div>
                  )}
                </div>

                {/* Viewer Controls */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleView3D} disabled={!selectedCabinet}>
                    <Eye className="w-4 h-4 mr-2" />
                    View 3D
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleExport} disabled={!selectedCabinet}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled={!selectedCabinet}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset View
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled={!selectedCabinet}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>

                {/* Selected Cabinet Details */}
                {selectedCabinet && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded">
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{selectedCabinet.type}</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-muted-foreground">Parts</p>
                      <p className="font-semibold">{selectedCabinet.parts.length}</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-muted-foreground">Difficulty</p>
                      <p className="font-semibold capitalize">{selectedCabinet.difficulty}</p>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-muted-foreground">Est. Cost</p>
                      <p className="font-semibold text-green-600">${selectedCabinet.estimatedCost?.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="collection" className="mt-6">
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cabinets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="base">Base Cabinets</SelectItem>
                      <SelectItem value="wall">Wall Cabinets</SelectItem>
                      <SelectItem value="tall">Tall Cabinets</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-1">
                    <Button
                      variant={displayMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={displayMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Cabinet Collection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedCabinets.map((cabinet) => (
                    <Card 
                      key={cabinet.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedCabinet?.id === cabinet.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleCabinetSelect(cabinet)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm truncate">{cabinet.name}</CardTitle>
                          <Badge variant="outline">{cabinet.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {renderCabinetPreview(cabinet)}
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <span className="font-medium capitalize">{cabinet.difficulty}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Est. Time:</span>
                            <span className="font-medium">{cabinet.estimatedTime}h</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className="font-medium text-green-600">${cabinet.estimatedCost?.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cabinet.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Layers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Cabinet Comparison Tool</p>
                  <p className="text-sm text-slate-600">Select multiple cabinets to compare their specifications</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}