'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Eye, 
  Filter,
  Grid,
  List,
  Package,
  Settings,
  Upload,
  FileText,
  Database,
  XCircle,
  Cube,
  Ruler,
  Palette,
  Star,
  TrendingUp,
  Zap,
  Calculator,
  Layers,
  Move,
  Maximize2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface EnhancedCabinetItem {
  id: string;
  name: string;
  type: 'base' | 'wall' | 'tall' | 'specialty' | 'vanity';
  manufacturer: string;
  price: number;
  rating: number;
  reviews: number;
  specifications: {
    width: number;
    height: number;
    depth: number;
    material: string;
    finish: string;
    doorStyle?: string;
    hardware?: string;
    construction?: string;
  };
  category: string;
  inStock: boolean;
  leadTime: string;
  features: string[];
  compatibility: string[];
  lastUpdated: string;
}

export default function EnhancedCabinetCatalogPlugin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<EnhancedCabinetItem | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'date'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categories = [
    { id: 'all', name: 'All Cabinets', count: 156 },
    { id: 'base', name: 'Base Cabinets', count: 48 },
    { id: 'wall', name: 'Wall Cabinets', count: 36 },
    { id: 'tall', name: 'Tall Cabinets', count: 24 },
    { id: 'specialty', name: 'Specialty', count: 18 },
    { id: 'vanity', name: 'Vanities', count: 30 }
  ];

  const enhancedCabinetItems: EnhancedCabinetItem[] = [
    {
      id: '1',
      name: 'Premium Base Cabinet 24"',
      type: 'base',
      manufacturer: 'Mid Continent',
      price: 345.00,
      rating: 4.8,
      reviews: 124,
      specifications: {
        width: 24,
        height: 34.5,
        depth: 24,
        material: 'Birch Plywood',
        finish: 'Natural Maple',
        doorStyle: 'Shaker',
        hardware: 'Soft-close hinges',
        construction: 'Dovetail joints'
      },
      category: 'base',
      inStock: true,
      leadTime: '2-3 weeks',
      features: ['Soft-close', 'Full extension', 'Adjustable shelves', 'Dovetail construction'],
      compatibility: ['Standard countertop', 'Undermount sink', 'Pull-out faucets'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Wall Cabinet with Glass Door 30"',
      type: 'wall',
      manufacturer: 'Mid Continent',
      price: 289.00,
      rating: 4.6,
      reviews: 89,
      specifications: {
        width: 30,
        height: 12,
        depth: 12,
        material: 'Maple',
        finish: 'Cherry',
        doorStyle: 'Glass Panel',
        hardware: 'Brushed nickel',
        construction: 'Mortise and tenon'
      },
      category: 'wall',
      inStock: true,
      leadTime: '1-2 weeks',
      features: ['Glass door', 'Interior lighting', 'Adjustable shelves', 'Soft-close'],
      compatibility: ['Standard wall mounting', 'LED lighting', 'Glass shelves'],
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Deluxe Tall Pantry Cabinet 24"',
      type: 'tall',
      manufacturer: 'Mid Continent',
      price: 525.00,
      rating: 4.9,
      reviews: 67,
      specifications: {
        width: 24,
        height: 84,
        depth: 24,
        material: 'Oak',
        finish: 'Natural Oak',
        doorStyle: 'Raised Panel',
        hardware: 'Antique brass',
        construction: 'Dovetail joints'
      },
      category: 'tall',
      inStock: false,
      leadTime: '4-6 weeks',
      features: ['Pull-out shelves', 'Spice rack', 'Roll-out trays', 'Soft-close'],
      compatibility: ['Standard pantry organization', 'Custom inserts', 'Pull-out systems'],
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      name: 'Corner Base Cabinet 36"',
      type: 'specialty',
      manufacturer: 'Mid Continent',
      price: 485.00,
      rating: 4.7,
      reviews: 45,
      specifications: {
        width: 36,
        height: 34.5,
        depth: 24,
        material: 'Plywood',
        finish: 'White Painted',
        doorStyle: 'Lazy Susan',
        hardware: 'Soft-close',
        construction: 'Butt joints'
      },
      category: 'specialty',
      inStock: true,
      leadTime: '3-4 weeks',
      features: ['Lazy Susan', 'Soft-close', 'Adjustable shelves', 'Corner optimization'],
      compatibility: ['Lazy Susan systems', 'Corner organizers', 'Custom inserts'],
      lastUpdated: '2024-01-12'
    }
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = enhancedCabinetItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'rating': return b.rating - a.rating;
        case 'date': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [enhancedCabinetItems, searchTerm, selectedCategory, priceRange, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStockStatus = (inStock: boolean, leadTime: string) => {
    if (inStock) return { color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" />, text: 'In Stock' };
    return { color: 'text-orange-600', icon: <Clock className="w-4 h-4" />, text: leadTime };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Cube className="w-8 h-8" />
          Enhanced Cabinet Catalog
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional cabinet catalog with advanced filtering, ratings, and detailed specifications
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{enhancedCabinetItems.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-yellow-600">4.7</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {enhancedCabinetItems.filter(item => item.inStock).length}
            </div>
            <div className="text-sm text-muted-foreground">In Stock</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">23%</div>
            <div className="text-sm text-muted-foreground">New Items</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search and Filter Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search cabinets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="date">Date Updated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">View Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Cabinet Items ({filteredAndSortedItems.length})
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedItems.map(item => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant={item.inStock ? 'default' : 'secondary'}>
                          {item.type}
                        </Badge>
                        <Badge variant="outline">{item.manufacturer}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                          <Cube className="w-12 h-12 text-blue-500" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(item.rating)}
                            <span className="text-sm text-muted-foreground">({item.reviews})</span>
                          </div>
                        </div>
                        
                        <p className="text-2xl font-bold text-green-600">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Ruler className="w-4 h-4" />
                          {item.specifications.width}"W × {item.specifications.height}"H × {item.specifications.depth}"D
                        </div>
                        
                        <div className={`flex items-center gap-1 text-sm ${getStockStatus(item.inStock, item.leadTime).color}`}>
                          {getStockStatus(item.inStock, item.leadTime).icon}
                          <span>{getStockStatus(item.inStock, item.leadTime).text}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Package className="w-4 h-4 mr-1" />
                            Add to Project
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedItems.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant={item.inStock ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                          <Badge variant="outline">{item.manufacturer}</Badge>
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                            <span className="text-sm text-muted-foreground">({item.reviews})</span>
                          </div>
                        </div>
                        
                        <p className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Ruler className="w-4 h-4" />
                            {item.specifications.width}"W × {item.specifications.height}"H × {item.specifications.depth}"D
                          </div>
                          <div className={`flex items-center gap-1 ${getStockStatus(item.inStock, item.leadTime).color}`}>
                            {getStockStatus(item.inStock, item.leadTime).icon}
                            <span>{getStockStatus(item.inStock, item.leadTime).text}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {item.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <Package className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Item View */}
      {selectedItem && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedItem.name} - Detailed Specifications
              </div>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                <XCircle className="w-4 h-4 mr-1" />
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Physical Specifications
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(selectedItem.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Product Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Manufacturer:</span>
                        <span className="font-medium">{selectedItem.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedItem.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center gap-1">
                          {renderStars(selectedItem.rating)}
                          <span className="font-medium">({selectedItem.reviews})</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">{selectedItem.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedItem.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility" className="mt-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Compatibility Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedItem.compatibility.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Add to Current Project
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Spec Sheet
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View 3D Model
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Cost
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Quote
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Share Item
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Bottom Statistics and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Catalog Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{enhancedCabinetItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Categories:</span>
                <span className="font-semibold">{categories.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span>In Stock:</span>
                <span className="font-semibold">{enhancedCabinetItems.filter(item => item.inStock).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Rating:</span>
                <span className="font-semibold">4.7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import/Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import Catalog
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Current View
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Sync with Database
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catalog Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Configure Filters
              </Button>
              <Button variant="outline" className="w-full">
                <Palette className="w-4 h-4 mr-2" />
                Finish Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}