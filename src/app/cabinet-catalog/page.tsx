'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Grid,
  List,
  Star,
  TrendingUp,
  Calculator,
  FileText
} from 'lucide-react';

export default function CabinetCatalogPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cabinetCategories = [
    { id: 'all', name: 'All Cabinets', count: 156 },
    { id: 'base', name: 'Base Cabinets', count: 48 },
    { id: 'wall', name: 'Wall Cabinets', count: 36 },
    { id: 'tall', name: 'Tall Cabinets', count: 24 },
    { id: 'vanity', name: 'Vanities', count: 18 },
    { id: 'custom', name: 'Custom', count: 30 }
  ];

  const cabinetItems = [
    {
      id: 'cabinet-001',
      name: 'Modern Base Cabinet 24"',
      category: 'base',
      price: '$450',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      dimensions: '24" x 34.5" x 24"',
      material: 'Birch Plywood',
      features: ['Soft-close', 'Full extension', 'Adjustable shelves']
    },
    {
      id: 'cabinet-002',
      name: 'Wall Cabinet with Glass Door',
      category: 'wall',
      price: '$320',
      rating: 4.6,
      reviews: 89,
      inStock: true,
      dimensions: '30" x 12" x 12"',
      material: 'Maple',
      features: ['Glass door', 'Interior lighting', 'Adjustable shelves']
    },
    {
      id: 'cabinet-003',
      name: 'Pantry Tall Cabinet',
      category: 'tall',
      price: '$680',
      rating: 4.9,
      reviews: 67,
      inStock: false,
      dimensions: '24" x 84" x 24"',
      material: 'Oak',
      features: ['Pull-out shelves', 'Spice rack', 'Roll-out trays']
    }
  ];

  const filteredItems = cabinetItems.filter(item =>
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-8 h-8" />
          Cabinet Catalog
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional cabinet catalog with detailed specifications and pricing
        </p>
      </div>

      {/* Catalog Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{cabinetItems.length}</div>
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
              {cabinetItems.filter(item => item.inStock).length}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search cabinets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
              </div>
              
              <div className="flex gap-2">
                {cabinetCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Catalog Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <Badge variant="outline" className="mb-2">{item.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{item.price}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(item.rating)}
                            <span className="text-sm text-muted-foreground">({item.reviews})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div><strong>Dimensions:</strong> {item.dimensions}</div>
                        <div><strong>Material:</strong> {item.material}</div>
                        <div><strong>Stock:</strong> {item.inStock ? 
                          <span className="text-green-600">In Stock</span> : 
                          <span className="text-red-600">Out of Stock</span>
                        }</div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {item.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.category}</span>
                          <span>{item.dimensions}</span>
                          <span>{item.material}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                            <span>({item.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{item.price}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium">No cabinets found</p>
                <p className="text-sm text-slate-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Cabinet Specifications
                </CardTitle>
                <CardDescription>
                  Detailed technical specifications and construction details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Specification Database</p>
                  <p className="text-sm text-slate-600">Detailed technical specs coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Pricing Calculator
                </CardTitle>
                <CardDescription>
                  Calculate costs and generate quotes for cabinet projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Base Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Cabinet:</span>
                        <span>$450</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wall Cabinet:</span>
                        <span>$320</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tall Cabinet:</span>
                        <span>$680</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Material Upgrades</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Premium Wood:</span>
                        <span>+25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custom Finish:</span>
                        <span>+15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hardware Upgrade:</span>
                        <span>+10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Volume Discounts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>5-10 units:</span>
                        <span>5% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>11-25 units:</span>
                        <span>10% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>26+ units:</span>
                        <span>15% off</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
                <CardDescription>
                  Export catalog data in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Export as PDF</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export Catalog</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calculator className="w-6 h-6 mb-2" />
                    <span>Price List</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Items</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Custom Export</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Preview</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
