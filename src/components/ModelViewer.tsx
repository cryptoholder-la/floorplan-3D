"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
  Search, 
  Download, 
  Eye, 
  Folder,
  Box,
  RotateCw,
  ZoomIn,
  Grid3x3
} from 'lucide-react';
import { toast } from 'sonner';
import { capitalize } from "@/lib/utils/string";

interface Model3D {
  id: string;
  name: string;
  path: string;
  size: number;
  category: string;
  description?: string;
}

interface ModelViewerProps {
  className?: string;
}

const SAMPLE_MODELS: Model3D[] = [
  {
    id: 'base-cabinet-300mm',
    name: 'Base Cabinet 300mm',
    path: '/assets/models/glb/BC-MB.glb',
    size: 295288,
    category: 'base-cabinet',
    description: 'Standard base cabinet with 300mm width'
  },
  {
    id: 'base-cabinet-600mm',
    name: 'Base Cabinet 600mm', 
    path: '/assets/models/glb/BC-RC.glb',
    size: 179512,
    category: 'base-cabinet',
    description: 'Standard base cabinet with 600mm width'
  },
  {
    id: 'wall-cabinet-2dr',
    name: 'Wall Cabinet 2-Door',
    path: '/assets/models/glb/BSC-2DH-PD.glb',
    size: 1013976,
    category: 'wall-cabinet',
    description: 'Wall cabinet with 2 doors and drawers'
  },
  {
    id: 'desk-office',
    name: 'Office Desk',
    path: '/assets/models/glb/DESK-BF.glb',
    size: 622404,
    category: 'furniture',
    description: 'Modern office desk design'
  },
  {
    id: 'hutch-2dr',
    name: 'Storage Hutch',
    path: '/assets/models/glb/HUTCH-DM-2HD-PD.glb',
    size: 854916,
    category: 'furniture',
    description: '2-door storage hutch with drawers'
  },
  {
    id: 'filing-cabinet-4dr',
    name: 'Filing Cabinet 4-Drawer',
    path: '/assets/models/glb/FILING-4DR.glb',
    size: 1318028,
    category: 'furniture',
    description: '4-drawer filing cabinet'
  },
  {
    id: 'workstation-desk',
    name: 'Workstation Desk',
    path: '/assets/models/glb/DESK-ECUL24C24E.glb',
    size: 466392,
    category: 'furniture',
    description: 'Ergonomic workstation desk'
  },
  {
    id: 'wardrobe-2dr',
    name: 'Wardrobe 2-Door',
    path: '/assets/models/glb/ARD-1DOL-1CR.glb',
    size: 885120,
    category: 'furniture',
    description: '2-door wardrobe with hanging rail'
  }
];

const MODEL_CATEGORIES = [
  { id: 'all', name: 'All Models', count: SAMPLE_MODELS.length },
  { id: 'base-cabinet', name: 'Base Cabinets', count: 2 },
  { id: 'wall-cabinet', name: 'Wall Cabinets', count: 1 },
  { id: 'furniture', name: 'Furniture', count: 5 }
];

export default function ModelViewer({ className = "" }: ModelViewerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  const filteredModels = SAMPLE_MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || model.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModelSelect = (model: Model3D) => {
    setSelectedModel(model);
    toast.success(`Selected: ${model.name}`);
  };

  const handleDownload = (model: Model3D) => {
    const link = document.createElement('a');
    link.href = model.path;
    link.download = `${model.name}.glb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded: ${model.name}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            3D Model Library
          </CardTitle>
          <CardDescription>
            Browse and preview 3D furniture and cabinet models (GLB format)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search 3D models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {MODEL_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-6">
              {/* Model Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModels.map((model) => (
                  <Card 
                    key={model.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => handleModelSelect(model)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm truncate">{model.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {model.category}
                        </Badge>
                      </div>
                      {model.description && (
                        <CardDescription className="text-xs truncate">
                          {model.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* 3D Model Preview */}
                      <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-colors">
                        <Box className="w-12 h-12 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(model.size)}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModelSelect(model);
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
                            handleDownload(model);
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

              {filteredModels.length === 0 && (
                <div className="text-center py-12">
                  <Box className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No models found</p>
                  <p className="text-sm text-slate-600">
                    {searchQuery ? 'Try adjusting your search terms' : 'No models available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Selected Model Details */}
          {selectedModel && (
            <Card className="mt-6 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {selectedModel.name}
                </CardTitle>
                <CardDescription>
                  3D model details and preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{selectedModel.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">File Size</p>
                    <p className="font-semibold">{formatFileSize(selectedModel.size)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Format</p>
                    <p className="font-semibold">GLB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Path</p>
                    <p className="font-mono text-xs truncate">{selectedModel.path}</p>
                  </div>
                </div>

                {selectedModel.description && (
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedModel.description}</p>
                  </div>
                )}

                {/* 3D Preview Controls */}
                <div className="bg-slate-100 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">3D Preview</h4>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <RotateCw className="w-4 h-4 mr-2" />
                      Rotate
                    </Button>
                    <Button variant="outline" size="sm">
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Zoom
                    </Button>
                    <Button variant="outline" size="sm">
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Grid
                    </Button>
                  </div>
                  <div className="mt-4 w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                    <Box className="w-16 h-16 text-slate-500" />
                    <p className="text-sm text-slate-600 mt-2">3D model preview would render here</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="default"
                    onClick={() => handleDownload(selectedModel)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download GLB File
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedModel(null)}
                  >
                    Close Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
