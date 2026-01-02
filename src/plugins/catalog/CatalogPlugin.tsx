'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  XCircle
} from 'lucide-react';

interface CatalogItem {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  price: number;
  specifications: Record<string, any>;
  image?: string;
  category: string;
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'cabinets', name: 'Cabinets' },
    { id: 'hardware', name: 'Hardware' },
    { id: 'materials', name: 'Materials' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const mockCatalogItems: CatalogItem[] = [
    {
      id: '1',
      name: 'Base Cabinet 24"',
      type: 'base',
      manufacturer: 'Mid Continent',
      price: 245.00,
      specifications: {
        width: 24,
        height: 34.5,
        depth: 24,
        material: 'Plywood',
        finish: 'Maple'
      },
      category: 'cabinets'
    },
    {
      id: '2',
      name: 'Wall Cabinet 30"',
      type: 'wall',
      manufacturer: 'Mid Continent',
      price: 189.00,
      specifications: {
        width: 30,
        height: 12,
        depth: 12,
        material: 'Plywood',
        finish: 'Maple'
      },
      category: 'cabinets'
    },
    {
      id: '3',
      name: 'Blum Soft-Close Hinge',
      type: 'hardware',
      manufacturer: 'Blum',
      price: 12.50,
      specifications: {
        type: 'Soft-close',
        openingAngle: 110,
        material: 'Steel',
        finish: 'Nickel'
      },
      category: 'hardware'
    }
  ];

  const filteredItems = mockCatalogItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Master Catalog</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
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
                placeholder="Search catalog..."
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
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Catalog Items ({filteredItems.length})
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
                {filteredItems.map(item => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge>{item.type}</Badge>
                        <Badge variant="outline">{item.manufacturer}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-2xl font-bold text-green-600">${item.price.toFixed(2)}</p>
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
              <div className="space-y-2">
                {filteredItems.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge>{item.type}</Badge>
                          <Badge variant="outline">{item.manufacturer}</Badge>
                        </div>
                        <p className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</p>
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

      {selectedItem && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedItem.name} - Details
              </div>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                <XCircle className="w-4 h-4 mr-1" />
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Specifications</h4>
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
                <h4 className="font-semibold mb-3">Actions</h4>
                <div className="space-y-2">
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Catalog Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{mockCatalogItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Categories:</span>
                <span className="font-semibold">{categories.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Manufacturers:</span>
                <span className="font-semibold">3</span>
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
                <Package className="w-4 h-4 mr-2" />
                Bulk Operations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
