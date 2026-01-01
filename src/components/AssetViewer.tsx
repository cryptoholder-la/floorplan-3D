"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
  AssetCategory, 
  AssetItem, 
  CNCUnit, 
  ASSET_CATEGORIES, 
  WOOD_TEXTURES, 
  CNC_UNITS,
  getAssetByCategory,
  searchAssets
} from '@/lib/asset-manager';
import { 
  Search, 
  Download, 
  Eye, 
  Folder,
  Image,
  Settings,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { capitalize } from "@/lib/utils/string";

interface AssetViewerProps {
  className?: string;
}

export default function AssetViewer({ className = "" }: AssetViewerProps) {
  const [activeCategory, setActiveCategory] = useState('textures');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);

  const filteredAssets = searchQuery 
    ? searchAssets(searchQuery)
    : getAssetByCategory(activeCategory);

  const handleAssetSelect = (asset: AssetItem) => {
    setSelectedAsset(asset);
    toast.success(`Selected: ${asset.name}`);
  };

  const handleDownload = (asset: AssetItem) => {
    // Create download link for asset
    const link = document.createElement('a');
    link.href = asset.path;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded: ${asset.name}`);
  };

  const renderAssetPreview = (asset: AssetItem) => {
    if (asset.type === 'texture') {
      return (
        <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
          <img 
            src={asset.path} 
            alt={asset.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (asset.type === 'cnc-file') {
      return (
        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
        <Folder className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Asset Library
          </CardTitle>
          <CardDescription>
            Browse and manage CNC files, textures, and design assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {ASSET_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.id === 'textures' && <Image className="w-4 h-4" />}
                  {category.id === 'cnc-files' && <Package className="w-4 h-4" />}
                  {category.id === 'dwg-files' && <Folder className="w-4 h-4" />}
                  {category.id === 'drill-patterns' && <Settings className="w-4 h-4" />}
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.itemCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Category Content */}
            {ASSET_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  {/* Asset Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                      <Card 
                        key={asset.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleAssetSelect(asset)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{asset.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {renderAssetPreview(asset)}
                          
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssetSelect(asset);
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
                                handleDownload(asset);
                              }}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredAssets.length === 0 && (
                    <div className="text-center py-12">
                      <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium">No assets found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search terms' : 'No assets available in this category'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Selected Asset Details */}
          {selectedAsset && (
            <Card className="mt-6 border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {selectedAsset.name}
                </CardTitle>
                <CardDescription>
                  Asset details and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold capitalize">{selectedAsset.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-semibold">
                      {selectedAsset.size ? 
                        typeof selectedAsset.size === 'number' ? 
                          `${(selectedAsset.size / 1024).toFixed(1)} KB` : 
                          selectedAsset.size 
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Path</p>
                    <p className="font-mono text-xs truncate">{selectedAsset.path}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => handleDownload(selectedAsset)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Asset
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedAsset(null)}
                  >
                    Close
                  </Button>
                </div>

                {/* Asset Preview */}
                {selectedAsset.type === 'texture' && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Preview</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedAsset.path} 
                        alt={selectedAsset.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
