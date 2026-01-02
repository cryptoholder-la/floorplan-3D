'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Upload,
  Package,
  Search,
  Filter,
  Eye,
  Settings,
  Zap,
  Grid,
  List,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function DWGAssetsPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const dwgAssets = [
    {
      id: 'dwg-001',
      name: 'Kitchen Cabinet Set 24"',
      category: 'kitchen',
      size: '2.4 MB',
      date: '2024-01-15',
      status: 'verified',
      downloads: 156
    },
    {
      id: 'dwg-002',
      name: 'Wall Cabinet Assembly',
      category: 'wall',
      size: '1.8 MB',
      date: '2024-01-14',
      status: 'pending',
      downloads: 89
    },
    {
      id: 'dwg-003',
      name: 'Custom Drawer System',
      category: 'custom',
      size: '3.1 MB',
      date: '2024-01-13',
      status: 'verified',
      downloads: 234
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredAssets = dwgAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-8 h-8" />
          DWG Asset Library
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional CAD drawings, blueprints, and technical specifications
        </p>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{dwgAssets.length}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {dwgAssets.filter(a => a.status === 'verified').length}
            </div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {dwgAssets.reduce((sum, a) => sum + a.downloads, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Downloads</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">7.3MB</div>
            <div className="text-sm text-muted-foreground">Library Size</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Asset Library</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search DWG assets..."
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

            {/* Assets Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">{asset.category}</span>
                        </div>
                        <div className={getStatusColor(asset.status)}>
                          {getStatusIcon(asset.status)}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{asset.name}</h4>
                      
                      <div className="space-y-1 text-sm text-muted-foreground mb-3">
                        <div>Size: {asset.size}</div>
                        <div>Date: {asset.date}</div>
                        <div>Downloads: {asset.downloads}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.category} • {asset.size} • {asset.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(asset.status)}>
                        {getStatusIcon(asset.status)}
                      </div>
                      <span className="text-sm text-muted-foreground">{asset.downloads} downloads</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium">No assets found</p>
                <p className="text-sm text-slate-600">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload DWG Files
                </CardTitle>
                <CardDescription>
                  Upload and validate CAD drawings for the asset library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Upload Center</p>
                  <p className="text-sm text-slate-600">Drag and drop DWG files here or click to browse</p>
                  <Button className="mt-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Asset Management
                </CardTitle>
                <CardDescription>
                  Organize, categorize, and maintain the DWG asset library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Asset Management</p>
                  <p className="text-sm text-slate-600">Advanced management tools coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Library Settings
                </CardTitle>
                <CardDescription>
                  Configure DWG library preferences and validation rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">Settings Panel</p>
                  <p className="text-sm text-slate-600">Library configuration options coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}