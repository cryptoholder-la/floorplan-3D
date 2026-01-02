'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Settings,
  Box,
  Package,
  Ruler,
  Zap,
  ShoppingCart,
  TrendingUp,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { Cabinet, CabinetType } from '@/types/domain/cabinet.types';
import { CabinetWidth, CabinetDepth, CabinetHeight, Difficulty, Status } from '@/types/core/base.types';

interface ProfessionalQuickAddProps {
  className?: string;
  onItemsAdded?: (cabinets: Cabinet[]) => void;
  maxItems?: number;
}

const PROFESSIONAL_CABINET_CATALOG: Cabinet[] = [
  {
    id: 'quick-base-18',
    name: 'Quick Base Cabinet 18"',
    type: 'base' as CabinetType,
    dimensions: { width: 18 as CabinetWidth, height: 34.5 as CabinetHeight, depth: 24 as CabinetDepth },
    parts: [],
    hardware: [],
    materials: [],
    configuration: {
      style: 'shaker',
      construction: 'frameless',
      joinery: 'butt-joint',
      finishing: {
        interior: {
          material: 'Melamine',
          color: 'White',
          sheen: 'matte',
          texture: 'smooth'
        },
        exterior: {
          material: 'Birch veneer',
          color: 'Natural',
          sheen: 'satin',
          texture: 'grained'
        },
        edgeBanding: {
          enabled: true,
          material: 'PVC',
          thickness: 0.4,
          color: '#d4a574',
          grainDirection: 'horizontal',
          application: 'hot-melt'
        },
        protectiveCoating: {
          type: 'polyurethane',
          sheen: 'satin',
          coats: 2,
          application: 'spray'
        }
      },
      hardware: {
        hinges: {
          type: 'concealed',
          brand: 'Blum',
          model: 'Compact 33',
          finish: 'satin-nickel',
          quantity: 2,
          features: ['Soft-close']
        },
        handles: {
          type: 'bar-pull',
          brand: 'Top Knobs',
          model: 'TK-321',
          finish: 'satin-nickel',
          quantity: 2,
          spacing: 128,
          features: ['Ergonomic design']
        },
        drawerSlides: {
          type: 'side-mount',
          brand: 'Blum',
          model: 'Movento',
          finish: 'satin-nickel',
          quantity: 0,
          features: ['Soft-close']
        },
        shelfSupports: {
          type: 'pin',
          brand: 'Blum',
          model: 'Shelf Pin',
          finish: 'satin-nickel',
          quantity: 4,
          spacing: 32
        }
      },
      customizations: {
        modifications: [],
        specialFeatures: [],
        customParts: [],
        uniqueRequirements: []
      }
    },
    estimatedCost: 195.00,
    estimatedTime: 3.5,
    difficulty: 'easy' as Difficulty,
    status: 'available' as Status,
    notes: 'Quick assembly base cabinet with standard hardware',
    tags: ['quick', 'base', 'easy', 'standard'],
    metadata: {
      roomType: 'kitchen',
      installationType: 'floor-mounted',
      weightCapacity: 35,
      doorStyle: 'full-overlay',
      finishType: 'stain',
      assemblyRequired: true,
      customFeatures: ['Quick assembly']
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'quick-wall-30',
    name: 'Quick Wall Cabinet 30"',
    type: 'wall' as CabinetType,
    dimensions: { width: 30 as CabinetWidth, height: 15 as CabinetHeight, depth: 12 as CabinetDepth },
    parts: [],
    hardware: [],
    materials: [],
    configuration: {
      style: 'shaker',
      construction: 'frameless',
      joinery: 'butt-joint',
      finishing: {
        interior: {
          material: 'Melamine',
          color: 'White',
          sheen: 'matte',
          texture: 'smooth'
        },
        exterior: {
          material: 'Birch veneer',
          color: 'Natural',
          sheen: 'satin',
          texture: 'grained'
        },
        edgeBanding: {
          enabled: true,
          material: 'PVC',
          thickness: 0.4,
          color: '#d4a574',
          grainDirection: 'horizontal',
          application: 'hot-melt'
        },
        protectiveCoating: {
          type: 'polyurethane',
          sheen: 'satin',
          coats: 2,
          application: 'spray'
        }
      },
      hardware: {
        hinges: {
          type: 'concealed',
          brand: 'Blum',
          model: 'Compact 33',
          finish: 'satin-nickel',
          quantity: 2,
          features: ['Soft-close']
        },
        handles: {
          type: 'bar-pull',
          brand: 'Top Knobs',
          model: 'TK-321',
          finish: 'satin-nickel',
          quantity: 1,
          spacing: 288,
          features: ['Ergonomic design']
        },
        drawerSlides: {
          type: 'side-mount',
          brand: 'Blum',
          model: 'Movento',
          finish: 'satin-nickel',
          quantity: 0,
          features: ['Soft-close']
        },
        shelfSupports: {
          type: 'pin',
          brand: 'Blum',
          model: 'Shelf Pin',
          finish: 'satin-nickel',
          quantity: 2,
          spacing: 32
        }
      },
      customizations: {
        modifications: [],
        specialFeatures: [],
        customParts: [],
        uniqueRequirements: []
      }
    },
    estimatedCost: 165.00,
    estimatedTime: 2.5,
    difficulty: 'easy' as Difficulty,
    status: 'available' as Status,
    notes: 'Quick assembly wall cabinet with standard hardware',
    tags: ['quick', 'wall', 'easy', 'standard'],
    metadata: {
      roomType: 'kitchen',
      installationType: 'wall-mounted',
      weightCapacity: 15,
      doorStyle: 'full-overlay',
      finishType: 'stain',
      assemblyRequired: true,
      customFeatures: ['Quick assembly']
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'quick-tall-24',
    name: 'Quick Tall Cabinet 24"',
    type: 'tall' as CabinetType,
    dimensions: { width: 24 as CabinetWidth, height: 84 as CabinetHeight, depth: 24 as CabinetDepth },
    parts: [],
    hardware: [],
    materials: [],
    configuration: {
      style: 'shaker',
      construction: 'frameless',
      joinery: 'butt-joint',
      finishing: {
        interior: {
          material: 'Melamine',
          color: 'White',
          sheen: 'matte',
          texture: 'smooth'
        },
        exterior: {
          material: 'Birch veneer',
          color: 'Natural',
          sheen: 'satin',
          texture: 'grained'
        },
        edgeBanding: {
          enabled: true,
          material: 'PVC',
          thickness: 0.4,
          color: '#d4a574',
          grainDirection: 'horizontal',
          application: 'hot-melt'
        },
        protectiveCoating: {
          type: 'polyurethane',
          sheen: 'satin',
          coats: 2,
          application: 'spray'
        }
      },
      hardware: {
        hinges: {
          type: 'concealed',
          brand: 'Blum',
          model: 'Compact 33',
          finish: 'satin-nickel',
          quantity: 2,
          features: ['Soft-close']
        },
        handles: {
          type: 'bar-pull',
          brand: 'Top Knobs',
          model: 'TK-321',
          finish: 'satin-nickel',
          quantity: 2,
          spacing: 128,
          features: ['Ergonomic design']
        },
        drawerSlides: {
          type: 'side-mount',
          brand: 'Blum',
          model: 'Movento',
          finish: 'satin-nickel',
          quantity: 0,
          features: ['Soft-close']
        },
        shelfSupports: {
          type: 'pin',
          brand: 'Blum',
          model: 'Shelf Pin',
          finish: 'satin-nickel',
          quantity: 8,
          spacing: 32
        }
      },
      customizations: {
        modifications: [],
        specialFeatures: [],
        customParts: [],
        uniqueRequirements: []
      }
    },
    estimatedCost: 385.00,
    estimatedTime: 5.5,
    difficulty: 'intermediate' as Difficulty,
    status: 'available' as Status,
    notes: 'Quick assembly tall cabinet with adjustable shelves',
    tags: ['quick', 'tall', 'intermediate', 'adjustable'],
    metadata: {
      roomType: 'kitchen',
      installationType: 'floor-mounted',
      weightCapacity: 50,
      doorStyle: 'full-overlay',
      finishType: 'stain',
      assemblyRequired: true,
      customFeatures: ['Quick assembly']
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export default function ProfessionalQuickAdd({ 
  className = "", 
  onItemsAdded,
  maxItems = 10
}: ProfessionalQuickAddProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedItems, setAddedItems] = useState<Cabinet[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'difficulty'>('name');
  const [showOnlyInStock, setShowOnlyInStock] = useState(true);

  const categories = [
    { id: 'all', name: 'All Types' },
    { id: 'base', name: 'Base Cabinets' },
    { id: 'wall', name: 'Wall Cabinets' },
    { id: 'tall', name: 'Tall Cabinets' }
  ];

  const filteredItems = useMemo(() => {
    return PROFESSIONAL_CABINET_CATALOG.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
      const matchesStock = !showOnlyInStock || item.status === 'available';
      const notAlreadyAdded = !addedItems.find(added => added.id === item.id);
      return matchesSearch && matchesCategory && matchesStock && notAlreadyAdded;
    }).sort((a, b) => {
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
  }, [searchTerm, selectedCategory, sortBy, showOnlyInStock, addedItems]);

  const handleAddItem = (item: Cabinet) => {
    if (addedItems.length >= maxItems) {
      alert(`Maximum ${maxItems} items allowed`);
      return;
    }
    
    const newItems = [...addedItems, item];
    setAddedItems(newItems);
    onItemsAdded?.(newItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = addedItems.filter(item => item.id !== itemId);
    setAddedItems(newItems);
    onItemsAdded?.(newItems);
  };

  const handleClearAll = () => {
    setAddedItems([]);
    onItemsAdded?.([]);
  };

  const handleExportList = () => {
    const exportData = {
      items: addedItems,
      totalCost: addedItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0),
      totalTime: addedItems.reduce((sum, item) => sum + (item.estimatedTime || 0), 0),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cabinet_list_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCabinetPreview = (cabinet: Cabinet) => {
    return (
      <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative border-2 border-dashed border-slate-300">
        <div className="text-center">
          <Box className="w-12 h-12 mx-auto mb-2 text-slate-400" />
          <p className="text-xs font-medium text-slate-600 truncate px-2">{cabinet.name}</p>
          <p className="text-xs text-slate-500">{cabinet.type}</p>
        </div>
        
        <div className="absolute bottom-2 right-2 text-xs bg-white/80 px-2 py-1 rounded">
          {cabinet.dimensions.width}"W × {cabinet.dimensions.height}"H
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge variant={cabinet.difficulty === 'advanced' ? 'destructive' : cabinet.difficulty === 'intermediate' ? 'default' : 'secondary'} className="text-xs">
            {cabinet.difficulty}
          </Badge>
        </div>
      </div>
    );
  };

  const totalCost = addedItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const totalTime = addedItems.reduce((sum, item) => sum + (item.estimatedTime || 0), 0);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Professional Quick Add
          </CardTitle>
          <CardDescription>
            Intelligent cabinet selection with real-time inventory and cost optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="catalog" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="summary">Summary ({addedItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="mt-6">
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
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
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
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={showOnlyInStock}
                      onChange={(e) => setShowOnlyInStock(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="inStock" className="text-sm">In Stock Only</label>
                  </div>
                </div>

                {/* Available Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Ruler className="w-4 h-4" />
                              {item.dimensions.width}"W × {item.dimensions.height}"H × {item.dimensions.depth}"D
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddItem(item)}
                            disabled={addedItems.length >= maxItems}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {renderCabinetPreview(item)}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <span className="text-sm font-semibold text-green-600">${item.estimatedCost?.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-lg font-medium">No items found</p>
                    <p className="text-sm text-slate-600">
                      {searchTerm ? 'Try adjusting your search terms' : 'All available items have been added'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-6">
              {addedItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{addedItems.length}</div>
                        <div className="text-sm text-muted-foreground">Items Selected</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{totalTime}h</div>
                        <div className="text-sm text-muted-foreground">Est. Time</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClearAll}>
                      Clear All
                    </Button>
                    <Button variant="outline" onClick={handleExportList}>
                      <Download className="w-4 h-4 mr-2" />
                      Export List
                    </Button>
                  </div>

                  {/* Added Items List */}
                  <div className="space-y-2">
                    {addedItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {item.dimensions.width}"W × {item.dimensions.height}"H × {item.dimensions.depth}"D • 
                              ${item.estimatedCost?.toFixed(2)} • 
                              {item.estimatedTime}h
                            </div>
                            <div className="flex gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleRemoveItem(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No items selected</p>
                  <p className="text-sm text-slate-600">Add items from the catalog to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}