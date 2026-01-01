"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Switch } from '@/ui/switch';
import { Slider } from '@/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { 
  Search, 
  Download, 
  Eye, 
  Folder,
  Box,
  Grid3x3,
  Settings,
  Layers,
  FileText,
  Code,
  Package,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';
import CabinetWireframeRenderer from './CabinetWireframeRenderer';
import FloorplanConverter from './FloorplanConverter';
import { generateWireframeExport, downloadFile, ExportOptions } from '../lib/wireframe-exporter';
import { WireframeAsset, CabinetPart, CabinetAccessory } from '../types/wireframe';

interface WireframeViewerProps {
  className?: string;
}

const WIREFRAME_ASSETS: WireframeAsset[] = [
  {
    id: 'kitchen-cabinet-base',
    name: 'Kitchen Base Cabinet',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'kitchen',
    type: 'cabinet',
    description: 'Standard kitchen base cabinet with customizable dimensions',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial',
    dimensions: { width: 600, height: 720, depth: 560 },
    parts: [
      {
        id: 'base-left-side',
        name: 'Left Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 720, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'base-right-side',
        name: 'Right Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 720, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 582, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'base-bottom',
        name: 'Bottom Panel',
        type: 'panel',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'base-back',
        name: 'Back Panel',
        type: 'panel',
        dimensions: { width: 600, height: 720, thickness: 6 },
        material: 'MDF',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#f5f5dc'
      },
      {
        id: 'base-door-left',
        name: 'Left Door',
        type: 'door',
        dimensions: { width: 295, height: 715, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 2.5, z: 18 },
        color: '#d4a574'
      },
      {
        id: 'base-door-right',
        name: 'Right Door',
        type: 'door',
        dimensions: { width: 295, height: 715, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 313, y: 2.5, z: 18 },
        color: '#d4a574'
      },
      {
        id: 'base-shelf',
        name: 'Adjustable Shelf',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 350, z: 0 },
        color: '#d4a574'
      }
    ],
    accessories: [
      {
        id: 'handle-left',
        name: 'Door Handle',
        type: 'handle',
        position: { x: 180, y: 360, z: 542 },
        dimensions: { width: 160, height: 20, depth: 25 },
        material: 'Stainless Steel',
        color: '#c0c0c0',
        quantity: 2
      },
      {
        id: 'hinge-left',
        name: 'Door Hinge',
        type: 'hinge',
        position: { x: 20, y: 100, z: 542 },
        dimensions: { width: 40, height: 35, depth: 15 },
        material: 'Steel',
        color: '#808080',
        quantity: 4
      }
    ],
    renderSettings: {
      opacity: 0.8,
      color: '#4a5568',
      showWireframe: true,
      showSolid: false
    }
  },
  {
    id: 'kitchen-cabinet-wall',
    name: 'Kitchen Wall Cabinet',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'kitchen',
    type: 'cabinet',
    description: 'Wall-mounted kitchen cabinet with adjustable height',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial',
    dimensions: { width: 600, height: 700, depth: 320 },
    parts: [
      {
        id: 'wall-left-side',
        name: 'Left Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 700, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'wall-right-side',
        name: 'Right Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 700, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 582, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'wall-bottom',
        name: 'Bottom Panel',
        type: 'panel',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'wall-top',
        name: 'Top Panel',
        type: 'panel',
        dimensions: { width: 600, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 0, y: 682, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'wall-back',
        name: 'Back Panel',
        type: 'panel',
        dimensions: { width: 600, height: 700, thickness: 6 },
        material: 'MDF',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#f5f5dc'
      },
      {
        id: 'wall-door',
        name: 'Door',
        type: 'door',
        dimensions: { width: 594, height: 682, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 3, y: 9, z: 18 },
        color: '#d4a574'
      },
      {
        id: 'wall-shelf',
        name: 'Fixed Shelf',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 350, z: 0 },
        color: '#d4a574'
      }
    ],
    accessories: [
      {
        id: 'wall-handle',
        name: 'Door Handle',
        type: 'handle',
        position: { x: 200, y: 340, z: 302 },
        dimensions: { width: 200, height: 20, depth: 25 },
        material: 'Stainless Steel',
        color: '#c0c0c0',
        quantity: 1
      },
      {
        id: 'wall-hinge',
        name: 'Door Hinge',
        type: 'hinge',
        position: { x: 20, y: 100, z: 302 },
        dimensions: { width: 40, height: 35, depth: 15 },
        material: 'Steel',
        color: '#808080',
        quantity: 2
      }
    ],
    renderSettings: {
      opacity: 0.8,
      color: '#4a5568',
      showWireframe: true,
      showSolid: false
    }
  },
  {
    id: 'kitchen-pantry',
    name: 'Kitchen Pantry Cabinet',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'kitchen',
    type: 'cabinet',
    description: 'Tall pantry cabinet with adjustable shelves',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial',
    dimensions: { width: 600, height: 2100, depth: 560 },
    parts: [
      {
        id: 'pantry-left-side',
        name: 'Left Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 2100, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-right-side',
        name: 'Right Side Panel',
        type: 'panel',
        dimensions: { width: 18, height: 2100, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 582, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-bottom',
        name: 'Bottom Panel',
        type: 'panel',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 0, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-top',
        name: 'Top Panel',
        type: 'panel',
        dimensions: { width: 600, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 0, y: 2082, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-back',
        name: 'Back Panel',
        type: 'panel',
        dimensions: { width: 600, height: 2100, thickness: 6 },
        material: 'MDF',
        quantity: 1,
        position: { x: 0, y: 0, z: 0 },
        color: '#f5f5dc'
      },
      {
        id: 'pantry-door-left',
        name: 'Left Door',
        type: 'door',
        dimensions: { width: 295, height: 2082, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 9, z: 18 },
        color: '#d4a574'
      },
      {
        id: 'pantry-door-right',
        name: 'Right Door',
        type: 'door',
        dimensions: { width: 295, height: 2082, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 313, y: 9, z: 18 },
        color: '#d4a574'
      },
      {
        id: 'pantry-shelf-1',
        name: 'Shelf 1',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 400, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-shelf-2',
        name: 'Shelf 2',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 800, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-shelf-3',
        name: 'Shelf 3',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 1200, z: 0 },
        color: '#d4a574'
      },
      {
        id: 'pantry-shelf-4',
        name: 'Shelf 4',
        type: 'shelf',
        dimensions: { width: 564, height: 18, thickness: 18 },
        material: 'Plywood',
        quantity: 1,
        position: { x: 18, y: 1600, z: 0 },
        color: '#d4a574'
      }
    ],
    accessories: [
      {
        id: 'pantry-handle-left',
        name: 'Door Handle',
        type: 'handle',
        position: { x: 180, y: 1040, z: 542 },
        dimensions: { width: 160, height: 20, depth: 25 },
        material: 'Stainless Steel',
        color: '#c0c0c0',
        quantity: 2
      },
      {
        id: 'pantry-hinge',
        name: 'Door Hinge',
        type: 'hinge',
        position: { x: 20, y: 200, z: 542 },
        dimensions: { width: 40, height: 35, depth: 15 },
        material: 'Steel',
        color: '#808080',
        quantity: 6
      }
    ],
    renderSettings: {
      opacity: 0.8,
      color: '#4a5568',
      showWireframe: true,
      showSolid: false
    }
  },
  {
    id: 'kitchen-island',
    name: 'Kitchen Island',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'kitchen',
    type: 'kitchen',
    description: 'Freestanding kitchen island with storage',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'furniture',
    type: 'furniture',
    description: 'Standard dining table with wireframe preview',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  },
  {
    id: 'dining-chair',
    name: 'Dining Chair',
    path: '/assets/js/core/catalog/KitchenCatalog.js',
    category: 'furniture',
    type: 'furniture',
    description: 'Dining chair with wireframe visualization',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  },
  {
    id: 'floorplan-wall',
    name: 'Floorplan Wall',
    path: '/assets/js/sceneManager.js',
    category: 'floorplan',
    type: 'floorplan',
    description: 'Basic wall structure for floorplan layout',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  },
  {
    id: 'floorplan-door',
    name: 'Floorplan Door',
    path: '/assets/js/sceneManager.js',
    category: 'floorplan',
    type: 'floorplan',
    description: 'Door opening for floorplan walls',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  },
  {
    id: 'floorplan-window',
    name: 'Floorplan Window',
    path: '/assets/js/sceneManager.js',
    category: 'floorplan',
    type: 'floorplan',
    description: 'Window opening for floorplan walls',
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial'
  }
];

const WIREFRAME_CATEGORIES = [
  { id: 'all', name: 'All Wireframes', count: WIREFRAME_ASSETS.length },
  { id: 'kitchen', name: 'Kitchen Components', count: 3 },
  { id: 'furniture', name: 'Furniture', count: 2 },
  { id: 'floorplan', name: 'Floorplan Elements', count: 3 },
  { id: 'cabinet', name: 'Cabinet Systems', count: 3 },
  { id: 'utility', name: 'Utility Objects', count: 0 }
];

export default function WireframeViewer({ className = "" }: WireframeViewerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<WireframeAsset | null>(null);
  const [wireframeOpacity, setWireframeOpacity] = useState([0.7]);
  const [showGrid, setShowGrid] = useState(true);
  const [wireframeColor, setWireframeColor] = useState('#888888');
  const [exportFormat, setExportFormat] = useState<'json' | 'js' | 'threejs' | 'obj' | 'gcode'>('json');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeParts: true,
    includeAccessories: true,
    includeRenderSettings: true,
    prettyPrint: true
  });
  const [showConverter, setShowConverter] = useState(false);
  const [dynamicAssets, setDynamicAssets] = useState<WireframeAsset[]>([]);

  const filteredAssets = [...WIREFRAME_ASSETS, ...dynamicAssets].filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAssetsGenerated = (assets: WireframeAsset[]) => {
    setDynamicAssets(prev => [...prev, ...assets]);
    setShowConverter(false);
    toast.success(`Added ${assets.length} new wireframe assets`);
  };

  const handleAssetSelect = (asset: WireframeAsset) => {
    setSelectedAsset(asset);
    toast.success(`Selected: ${asset.name}`);
  };

  const handleDownload = (asset: WireframeAsset) => {
    try {
      const options = {
        ...exportOptions,
        format: exportFormat
      };
      
      const exported = generateWireframeExport(asset, options);
      downloadFile(exported.content, exported.filename, exported.mimeType);
      
      toast.success(`Downloaded: ${asset.name} (${exportFormat.toUpperCase()})`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export ${asset.name}`);
    }
  };

  const renderWireframePreview = (asset: WireframeAsset) => {
    return (
      <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative">
        <div 
          className="w-16 h-16 border-2 border-dashed border-slate-400"
          style={{ 
            borderColor: asset.renderSettings?.color || wireframeColor,
            opacity: (asset.renderSettings?.opacity || wireframeOpacity[0]) / 100
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {asset.geometry}
          </Badge>
        </div>
        {asset.parts && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-xs">
              {asset.parts.length} parts
            </Badge>
          </div>
        )}
        {asset.accessories && asset.accessories.length > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="text-xs">
              {asset.accessories.length} accessories
            </Badge>
          </div>
        )}
        {showGrid && (
          <div className="absolute inset-0 border border-slate-300 opacity-30 rounded-lg" />
        )}
      </div>
    );
  };

  const renderPartsList = (asset: WireframeAsset) => {
    if (!asset.parts) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Parts List</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {asset.parts.map((part) => (
            <div key={part.id} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: part.color || '#d4a574' }}
                />
                <span className="font-medium">{part.name}</span>
              </div>
              <div className="text-muted-foreground">
                {part.quantity}x {part.dimensions.width}×{part.dimensions.height}×{part.dimensions.thickness}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAccessoriesList = (asset: WireframeAsset) => {
    if (!asset.accessories || asset.accessories.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Accessories</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {asset.accessories.map((accessory) => (
            <div key={accessory.id} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: accessory.color || '#c0c0c0' }}
                />
                <span className="font-medium">{accessory.name}</span>
              </div>
              <div className="text-muted-foreground">
                {accessory.quantity}x {accessory.material}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Wireframe Assets
          </CardTitle>
          <CardDescription>
            Browse and preview wireframe models and 3D framework components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search wireframe assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowConverter(!showConverter)}
            >
              <Layers className="w-4 h-4 mr-1" />
              {showConverter ? 'Hide' : 'Show'} Converter
            </Button>
            <Button variant="outline" size="sm">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Floorplan Converter */}
          {showConverter && (
            <FloorplanConverter onAssetsGenerated={handleAssetsGenerated} />
          )}

          {/* Export Settings */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="js">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        JavaScript
                      </div>
                    </SelectItem>
                    <SelectItem value="threejs">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Three.js
                      </div>
                    </SelectItem>
                    <SelectItem value="obj">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        OBJ
                      </div>
                    </SelectItem>
                    <SelectItem value="gcode">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        G-Code
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Include Parts</label>
                <Switch
                  checked={exportOptions.includeParts}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev: ExportOptions) => ({ ...prev, includeParts: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Include Accessories</label>
                <Switch
                  checked={exportOptions.includeAccessories}
                  onCheckedChange={(checked) => 
                    setExportOptions((prev: ExportOptions) => ({ ...prev, includeAccessories: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pretty Print</label>
                <Switch
                  checked={exportOptions.prettyPrint}
                  onCheckedChange={(checked) => 
                    setExportOptions((prev: ExportOptions) => ({ ...prev, prettyPrint: checked }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Wireframe Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Opacity</label>
                <Slider
                  value={wireframeOpacity}
                  onValueChange={setWireframeOpacity}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{wireframeOpacity[0]}%</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={wireframeColor}
                  onChange={(e) => setWireframeColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Show Grid</label>
                <Switch
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {WIREFRAME_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-6">
              {/* Wireframe Asset Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <Card 
                    key={asset.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm truncate">{asset.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      {asset.description && (
                        <CardDescription className="text-xs truncate">
                          {asset.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Wireframe Preview */}
                      {renderWireframePreview(asset)}
                      
                      {/* Parts and Accessories Info */}
                      {(asset.parts || asset.accessories) && (
                        <div className="mt-3 space-y-2">
                          {renderPartsList(asset)}
                          {renderAccessoriesList(asset)}
                        </div>
                      )}
                      
                      {/* Dimensions Info */}
                      {asset.dimensions && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Dimensions: {asset.dimensions.width}×{asset.dimensions.height}×{asset.dimensions.depth}mm
                        </div>
                      )}
                      
                      {/* Action Buttons */}
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
                  <Layers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium">No wireframe assets found</p>
                  <p className="text-sm text-slate-600">
                    {searchQuery ? 'Try adjusting your search terms' : 'No wireframe assets available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Selected Asset Details */}
          {selectedAsset && (
            <Card className="mt-6 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {selectedAsset.name}
                </CardTitle>
                <CardDescription>
                  Wireframe asset details and preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold capitalize">{selectedAsset.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Geometry</p>
                    <p className="font-semibold">{selectedAsset.geometry}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Material</p>
                    <p className="font-semibold">{selectedAsset.material}</p>
                  </div>
                </div>

                {/* Dimensions */}
                {selectedAsset.dimensions && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Dimensions</h4>
                    <div className="text-sm">
                      <span className="font-mono">
                        {selectedAsset.dimensions.width} × {selectedAsset.dimensions.height} × {selectedAsset.dimensions.depth} mm
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Volume: {(selectedAsset.dimensions.width * selectedAsset.dimensions.height * selectedAsset.dimensions.depth / 1000000).toFixed(2)} m³
                    </div>
                  </div>
                )}

                {/* Render Settings */}
                {selectedAsset.renderSettings && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Render Settings</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Color</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: selectedAsset.renderSettings.color }}
                          />
                          <span className="font-mono text-xs">{selectedAsset.renderSettings.color}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opacity</p>
                        <p className="font-semibold">{Math.round(selectedAsset.renderSettings.opacity * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wireframe</p>
                        <p className="font-semibold">{selectedAsset.renderSettings.showWireframe ? 'On' : 'Off'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Solid Fill</p>
                        <p className="font-semibold">{selectedAsset.renderSettings.showSolid ? 'On' : 'Off'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAsset.description && (
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedAsset.description}</p>
                  </div>
                )}

                {/* Parts Summary */}
                {selectedAsset.parts && selectedAsset.parts.length > 0 && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Parts Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Parts:</span>
                        <span className="font-semibold">{selectedAsset.parts.length}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(
                          selectedAsset.parts.reduce((acc, part) => {
                            acc[part.type] = (acc[part.type] || 0) + part.quantity;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize">{type}:</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accessories Summary */}
                {selectedAsset.accessories && selectedAsset.accessories.length > 0 && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Accessories Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Accessories:</span>
                        <span className="font-semibold">{selectedAsset.accessories.length}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(
                          selectedAsset.accessories.reduce((acc, accessory) => {
                            acc[accessory.type] = (acc[accessory.type] || 0) + accessory.quantity;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize">{type}:</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D Preview */}
                {(selectedAsset.type === 'cabinet' || selectedAsset.parts) && (
                  <div>
                    <h4 className="font-semibold mb-2">3D Preview</h4>
                    <CabinetWireframeRenderer 
                      asset={selectedAsset}
                      width={600}
                      height={400}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(selectedAsset)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Asset
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedAsset(null)}
                  >
                    Close Details
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
