"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Download, 
  Eye, 
  Folder,
  Box,
  Grid3x3,
  Settings,
  Package,
  Zap,
  Database,
  Filter,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

interface CatalogItem {
  id: string;
  name: string;
  type: string;
  category: string;
  subcategory: string;
  defaultHeight?: number;
  snapToWall?: boolean;
  thumbnail?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  properties?: Record<string, any>;
}

interface CatalogCategory {
  id: string;
  name: string;
  subcategories: Record<string, string[]>;
  itemCount: number;
}

interface CatalogConfig {
  enableCategoryFiltering: boolean;
  autoGenerateThumbnails: boolean;
  enableSmartPlacement: boolean;
  defaultPlacementHeight: number;
  categories: Record<string, Record<string, string[]>>;
}

interface CatalogManagerProps {
  className?: string;
}

const CATALOG_CONFIG: CatalogConfig = {
  enableCategoryFiltering: true,
  autoGenerateThumbnails: true,
  enableSmartPlacement: true,
  defaultPlacementHeight: 0.5,
  categories: {
    cabinets: {
      base: ['kitchenCabinet', 'kitchenCabinetDrawer', 'kitchenCabinetCornerInner', 'kitchenCabinetCornerRound'],
      wall: ['kitchenCabinetUpper', 'kitchenCabinetUpperDouble', 'kitchenCabinetUpperLow', 'kitchenCabinetUpperCorner'],
      specialty: ['kitchenBar', 'kitchenBarEnd']
    },
    appliances: {
      major: ['kitchenFridge', 'kitchenFridgeLarge', 'kitchenFridgeSmall', 'kitchenFridgeBuiltIn', 'kitchenStove', 'kitchenStoveElectric'],
      small: ['kitchenBlender', 'kitchenCoffeeMachine', 'kitchenMicrowave', 'toaster'],
      ventilation: ['hoodLarge', 'hoodModern'],
      laundry: ['washer', 'dryer', 'washerDryerStacked']
    },
    furniture: {
      seating: ['chair', 'chairDesk', 'chairRounded', 'chairCushion', 'stoolBar', 'stoolBarSquare'],
      tables: ['table', 'tableRound', 'tableGlass', 'tableCross', 'tableCrossCloth', 'tableCloth', 'tableCoffee', 'tableCoffeeGlass', 'tableCoffeeSquare', 'tableCoffeeGlassSquare'],
      storage: ['trashcan']
    },
    architectural: {
      walls: ['wall', 'wallHalf', 'wallCorner', 'wallCornerRound'],
      openings: ['doorway', 'doorwayFront', 'doorwayOpen', 'wallDoorway', 'wallDoorwayWide', 'wallWindow', 'wallWindowSlide'],
      flooring: ['floorFull', 'floorHalf', 'floorCorner', 'floorCornerRound'],
      fixtures: ['ceilingFan']
    }
  }
};

const ITEM_PROPERTIES: Record<string, any> = {
  kitchenCabinet: { 
    type: 'base_cabinet', 
    defaultHeight: 0.9, 
    snapToWall: true,
    category: 'cabinets'
  },
  kitchenFridge: { 
    type: 'appliance', 
    defaultHeight: 1.8, 
    snapToWall: true,
    category: 'appliances'
  },
  kitchenStove: { 
    type: 'appliance', 
    defaultHeight: 0.85, 
    snapToWall: true,
    category: 'appliances'
  },
  chair: { 
    type: 'furniture', 
    defaultHeight: 0.45, 
    snapToWall: false,
    category: 'furniture'
  },
  table: { 
    type: 'furniture', 
    defaultHeight: 0.75, 
    snapToWall: false,
    category: 'furniture'
  },
  wall: { 
    type: 'architectural', 
    defaultHeight: 2.4, 
    snapToWall: false,
    category: 'architectural'
  },
  doorway: { 
    type: 'architectural', 
    defaultHeight: 2.1, 
    snapToWall: false,
    category: 'architectural'
  }
};

const SAMPLE_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'kitchenCabinet-001',
    name: 'Base Cabinet 600mm',
    type: 'base_cabinet',
    category: 'cabinets',
    subcategory: 'base',
    defaultHeight: 0.9,
    snapToWall: true,
    dimensions: { width: 0.6, height: 0.9, depth: 0.6 },
    properties: ITEM_PROPERTIES.kitchenCabinet
  },
  {
    id: 'kitchenCabinet-002',
    name: 'Base Cabinet with Drawers',
    type: 'base_cabinet',
    category: 'cabinets',
    subcategory: 'base',
    defaultHeight: 0.9,
    snapToWall: true,
    dimensions: { width: 0.8, height: 0.9, depth: 0.6 },
    properties: ITEM_PROPERTIES.kitchenCabinet
  },
  {
    id: 'kitchenCabinet-003',
    name: 'Wall Cabinet Upper',
    type: 'wall_cabinet',
    category: 'cabinets',
    subcategory: 'wall',
    defaultHeight: 0.7,
    snapToWall: true,
    dimensions: { width: 0.6, height: 0.7, depth: 0.35 },
    properties: ITEM_PROPERTIES.kitchenCabinet
  },
  {
    id: 'kitchenFridge-001',
    name: 'Standard Refrigerator',
    type: 'appliance',
    category: 'appliances',
    subcategory: 'major',
    defaultHeight: 1.8,
    snapToWall: true,
    dimensions: { width: 0.6, height: 1.8, depth: 0.65 },
    properties: ITEM_PROPERTIES.kitchenFridge
  },
  {
    id: 'kitchenStove-001',
    name: 'Electric Stove',
    type: 'appliance',
    category: 'appliances',
    subcategory: 'major',
    defaultHeight: 0.85,
    snapToWall: true,
    dimensions: { width: 0.6, height: 0.85, depth: 0.65 },
    properties: ITEM_PROPERTIES.kitchenStove
  },
  {
    id: 'chair-001',
    name: 'Dining Chair',
    type: 'furniture',
    category: 'furniture',
    subcategory: 'seating',
    defaultHeight: 0.45,
    snapToWall: false,
    dimensions: { width: 0.45, height: 0.45, depth: 0.45 },
    properties: ITEM_PROPERTIES.chair
  },
  {
    id: 'table-001',
    name: 'Dining Table',
    type: 'furniture',
    category: 'furniture',
    subcategory: 'tables',
    defaultHeight: 0.75,
    snapToWall: false,
    dimensions: { width: 1.2, height: 0.75, depth: 0.8 },
    properties: ITEM_PROPERTIES.table
  },
  {
    id: 'wall-001',
    name: 'Standard Wall',
    type: 'architectural',
    category: 'architectural',
    subcategory: 'walls',
    defaultHeight: 2.4,
    snapToWall: false,
    dimensions: { width: 3.0, height: 2.4, depth: 0.12 },
    properties: ITEM_PROPERTIES.wall
  }
];

const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'cabinets',
    name: 'Kitchen Cabinets',
    subcategories: CATALOG_CONFIG.categories.cabinets,
    itemCount: 3
  },
  {
    id: 'appliances',
    name: 'Kitchen Appliances',
    subcategories: CATALOG_CONFIG.categories.appliances,
    itemCount: 2
  },
  {
    id: 'furniture',
    name: 'Furniture',
    subcategories: CATALOG_CONFIG.categories.furniture,
    itemCount: 2
  },
  {
    id: 'architectural',
    name: 'Architectural',
    subcategories: CATALOG_CONFIG.categories.architectural,
    itemCount: 2
  }
];

export default function CatalogManager({ className = "" }: CatalogManagerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [enableSmartPlacement, setEnableSmartPlacement] = useState(CATALOG_CONFIG.enableSmartPlacement);
  const [autoGenerateThumbnails, setAutoGenerateThumbnails] = useState(CATALOG_CONFIG.autoGenerateThumbnails);
  const [meshQuality, setMeshQuality] = useState([32]);
  const [maxConcurrentLoads, setMaxConcurrentLoads] = useState([4]);

  const filteredItems = SAMPLE_CATALOG_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSubcategory = activeSubcategory === 'all' || item.subcategory === activeSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const currentCategory = CATALOG_CATEGORIES.find(cat => cat.id === activeCategory);
  const availableSubcategories = currentCategory?.subcategories || {};

  const handleItemSelect = (item: CatalogItem) => {
    setSelectedItem(item);
    toast.success(`Selected: ${item.name}`);
  };

  const handleExport = () => {
    const catalogData = {
      config: CATALOG_CONFIG,
      items: SAMPLE_CATALOG_ITEMS,
      categories: CATALOG_CATEGORIES,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(catalogData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalog-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Catalog data exported');
  };

  const renderCatalogItem = (item: CatalogItem) => {
    return (
      <Card 
        key={item.id} 
        className="cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => handleItemSelect(item)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate">{item.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {item.category} / {item.subcategory}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Item Preview */}
          <div className="w-full h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-3">
            <Package className="w-8 h-8 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          
          {/* Item Properties */}
          <div className="space-y-2">
            {item.dimensions && (
              <div className="text-xs text-muted-foreground">
                {item.dimensions.width}m × {item.dimensions.height}m × {item.dimensions.depth}m
              </div>
            )}
            {item.defaultHeight && (
              <div className="text-xs">
                <span className="font-medium">Default Height:</span> {item.defaultHeight}m
              </div>
            )}
            {item.snapToWall && (
              <Badge variant="secondary" className="text-xs">
                Snap to Wall
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleItemSelect(item);
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Added ${item.name} to scene`);
              }}
            >
              <Box className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Catalog Manager
          </CardTitle>
          <CardDescription>
            Advanced catalog system for kitchen components, furniture, and architectural elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <span>All Items</span>
                <Badge variant="secondary" className="ml-auto">
                  {SAMPLE_CATALOG_ITEMS.length}
                </Badge>
              </TabsTrigger>
              {CATALOG_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.itemCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-6">
              {/* Subcategory Filter */}
              {activeCategory !== 'all' && Object.keys(availableSubcategories).length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Subcategories</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={activeSubcategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveSubcategory('all')}
                    >
                      All
                    </Button>
                    {Object.entries(availableSubcategories).map(([key, items]) => (
                      <Button
                        key={key}
                        variant={activeSubcategory === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveSubcategory(key)}
                      >
                        {key} ({items.length})
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Catalog Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map(renderCatalogItem)}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No catalog items found</p>
                  <p className="text-sm text-slate-600">
                    {searchQuery ? 'Try adjusting your search terms' : 'No items available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Selected Item Details */}
          {selectedItem && (
            <Card className="mt-6 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {selectedItem.name}
                </CardTitle>
                <CardDescription>
                  Catalog item details and properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold">{selectedItem.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subcategory</p>
                    <p className="font-semibold capitalize">{selectedItem.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Snap to Wall</p>
                    <p className="font-semibold">{selectedItem.snapToWall ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {selectedItem.dimensions && (
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="text-sm">
                      {selectedItem.dimensions.width}m × {selectedItem.dimensions.height}m × {selectedItem.dimensions.depth}m
                    </p>
                  </div>
                )}

                {selectedItem.properties && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Item Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {Object.entries(selectedItem.properties).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-muted-foreground capitalize">{key}</p>
                          <p className="font-semibold">{JSON.stringify(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="default"
                    onClick={() => toast.success(`Added ${selectedItem.name} to scene`)}
                  >
                    <Box className="w-4 h-4 mr-2" />
                    Add to Scene
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Catalog Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Catalog Settings
              </CardTitle>
              <CardDescription>
                Configure catalog behavior and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Smart Placement</label>
                    <Switch
                      checked={enableSmartPlacement}
                      onCheckedChange={setEnableSmartPlacement}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto Generate Thumbnails</label>
                    <Switch
                      checked={autoGenerateThumbnails}
                      onCheckedChange={setAutoGenerateThumbnails}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mesh Quality (Segments)</label>
                    <Slider
                      value={meshQuality}
                      onValueChange={setMeshQuality}
                      max={64}
                      min={8}
                      step={4}
                    />
                    <span className="text-xs text-muted-foreground">{meshQuality[0]} segments</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Concurrent Loads</label>
                    <Slider
                      value={maxConcurrentLoads}
                      onValueChange={setMaxConcurrentLoads}
                      max={8}
                      min={1}
                      step={1}
                    />
                    <span className="text-xs text-muted-foreground">{maxConcurrentLoads[0]} concurrent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Controls */}
          <div className="flex gap-2 mt-6">
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Catalog
            </Button>
            <Button variant="outline" onClick={() => toast.info('Import functionality coming soon')}>
              <Database className="w-4 h-4 mr-2" />
              Import Catalog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
