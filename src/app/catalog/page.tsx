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
  Database,
  FileText,
  Folder
} from 'lucide-react';

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const catalogStats = [
    { name: 'Total Items', value: '1,247', icon: <Package className="w-5 h-5" />, color: 'text-blue-500' },
    { name: 'Categories', value: '18', icon: <Folder className="w-5 h-5" />, color: 'text-green-500' },
    { name: 'Active Users', value: '342', icon: <Zap className="w-5 h-5" />, color: 'text-purple-500' },
    { name: 'Downloads', value: '5.2K', icon: <Download className="w-5 h-5" />, color: 'text-orange-500' }
  ];

  const recentCatalogs = [
    {
      id: 'cat-001',
      name: 'Kitchen Cabinet Collection 2024',
      items: 156,
      lastUpdated: '2024-01-15',
      status: 'active',
      downloads: 234
    },
    {
      id: 'cat-002',
      name: 'Hardware Components Library',
      items: 89,
      lastUpdated: '2024-01-14',
      status: 'active',
      downloads: 156
    },
    {
      id: 'cat-003',
      name: 'Material Finishes Catalog',
      items: 67,
      lastUpdated: '2024-01-13',
      status: 'updating',
      downloads: 89
    }
  ];

  const catalogCategories = [
    { id: 'cabinets', name: 'Cabinets', count: 456, icon: <Package className="w-4 h-4" /> },
    { id: 'hardware', name: 'Hardware', count: 234, icon: <Settings className="w-4 h-4" /> },
    { id: 'materials', name: 'Materials', count: 189, icon: <Database className="w-4 h-4" /> },
    { id: 'finishes', name: 'Finishes', count: 156, icon: <Star className="w-4 h-4" /> },
    { id: 'accessories', name: 'Accessories', count: 123, icon: <Package className="w-4 h-4" /> },
    { id: 'tools', name: 'Tools', count: 89, icon: <Settings className="w-4 h-4" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'updating': return 'text-blue-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'updating': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'inactive': return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="w-8 h-8" />
          Catalog Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive catalog system for components, materials, and assemblies
        </p>
      </div>

      {/* Catalog Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {catalogStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`${stat.color} w-8 h-8 mx-auto mb-2`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search catalog items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
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

            {/* Categories Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Catalog Categories
                </CardTitle>
                <CardDescription>
                  Browse catalog items by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">{category.count} items</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          Browse Category
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Category Management
                </CardTitle>
                <CardDescription>
                  Manage catalog categories and subcategories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Category Manager</p>
                  <p className="text-sm text-slate-600">Advanced category management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Catalogs
                </CardTitle>
                <CardDescription>
                  Recently updated and active catalogs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCatalogs.map((catalog) => (
                    <div key={catalog.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(catalog.status)}>
                          {getStatusIcon(catalog.status)}
                        </div>
                        <div>
                          <div className="font-medium">{catalog.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {catalog.items} items • Updated: {catalog.lastUpdated} • {catalog.downloads} downloads
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{catalog.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Catalog Management
                </CardTitle>
                <CardDescription>
                  Advanced catalog administration and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Import Catalog</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Database Sync</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Configuration</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Item Manager</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Validation</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Zap className="w-6 h-6 mb-2" />
                    <span>Performance</span>
                  </Button>
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
                  Export Catalog
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
                    <Database className="w-6 h-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    <span>Export Items</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Backup Catalog</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Custom Export</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Preview Export</span>
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
