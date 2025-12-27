"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRight, 
  Upload, 
  Download, 
  Settings,
  Layers,
  Box,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { WireframeAsset } from './WireframeViewer';
import { convertFloorplanCabinetsToWireframes, ConversionSettings, filterCabinetsByType } from '@/lib/floorplan-to-wireframe-converter';
import { Cabinet } from '@/lib/floorplan-types';

interface FloorplanConverterProps {
  className?: string;
  onAssetsGenerated?: (assets: WireframeAsset[]) => void;
}

// Mock floorplan data for demonstration
const mockFloorplanCabinets: Cabinet[] = [
  {
    id: 'cabinet-1',
    type: 'base',
    position: { x: 0, y: 0 },
    angle: 0,
    width: 600,
    depth: 560,
    height: 720,
    color: '#8B4513',
    mountHeight: 720
  },
  {
    id: 'cabinet-2',
    type: 'wall',
    position: { x: 600, y: 0 },
    angle: 0,
    width: 400,
    depth: 320,
    height: 700,
    color: '#A0522D',
    mountHeight: 1400
  },
  {
    id: 'cabinet-3',
    type: 'tall',
    position: { x: 1000, y: 0 },
    angle: 0,
    width: 600,
    depth: 560,
    height: 2100,
    color: '#8B4513'
  }
];

export default function FloorplanConverter({ className = "", onAssetsGenerated }: FloorplanConverterProps) {
  const [cabinets, setCabinets] = useState<Cabinet[]>(mockFloorplanCabinets);
  const [convertedAssets, setConvertedAssets] = useState<WireframeAsset[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Cabinet['type'][]>(['base', 'wall', 'tall']);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    includeAccessories: true,
    includeHardware: true,
    materialDefaults: {
      panels: 'Plywood',
      doors: 'Plywood',
      shelves: 'Plywood',
      back: 'MDF'
    },
    hardwareDefaults: {
      handles: 'Stainless Steel',
      hinges: 'Steel',
      knobs: 'Brushed Nickel'
    }
  });

  const cabinetTypes: Cabinet['type'][] = ['base', 'wall', 'tall', 'db', 'sb', 'lsb', 'corner', 'island'];

  const handleTypeToggle = (type: Cabinet['type']) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleConvert = async () => {
    if (selectedTypes.length === 0) {
      toast.error('Please select at least one cabinet type to convert');
      return;
    }

    setIsConverting(true);
    
    try {
      // Filter cabinets by selected types
      const filteredCabinets = filterCabinetsByType(cabinets, selectedTypes);
      
      if (filteredCabinets.length === 0) {
        toast.warning('No cabinets found for selected types');
        return;
      }

      // Convert to wireframes
      const assets = convertFloorplanCabinetsToWireframes(filteredCabinets, conversionSettings);
      
      setConvertedAssets(assets);
      onAssetsGenerated?.(assets);
      
      toast.success(`Converted ${filteredCabinets.length} cabinets to ${assets.length} wireframe assets`);
    } catch (error) {
      console.error('Conversion failed:', error);
      toast.error('Failed to convert cabinets');
    } finally {
      setIsConverting(false);
    }
  };

  const handleAddToWireframeViewer = () => {
    if (convertedAssets.length > 0) {
      // This would typically update the parent component's state
      onAssetsGenerated?.(convertedAssets);
      toast.success(`Added ${convertedAssets.length} assets to wireframe viewer`);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Floorplan to Wireframe Converter
          </CardTitle>
          <CardDescription>
            Convert floorplan cabinet data to detailed wireframe assets with parts and accessories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cabinet Type Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold">Select Cabinet Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cabinetTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Switch
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label 
                    htmlFor={`type-${type}`} 
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Settings */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Conversion Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include Accessories</span>
                  <Switch
                    checked={conversionSettings.includeAccessories}
                    onCheckedChange={(checked) =>
                      setConversionSettings(prev => ({ ...prev, includeAccessories: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include Hardware</span>
                  <Switch
                    checked={conversionSettings.includeHardware}
                    onCheckedChange={(checked) =>
                      setConversionSettings(prev => ({ ...prev, includeHardware: checked }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm">Panel Material</label>
                  <Select 
                    value={conversionSettings.materialDefaults.panels}
                    onValueChange={(value) =>
                      setConversionSettings(prev => ({
                        ...prev,
                        materialDefaults: { ...prev.materialDefaults, panels: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plywood">Plywood</SelectItem>
                      <SelectItem value="MDF">MDF</SelectItem>
                      <SelectItem value="Particle Board">Particle Board</SelectItem>
                      <SelectItem value="Solid Wood">Solid Wood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Handle Material</label>
                  <Select 
                    value={conversionSettings.hardwareDefaults.handles}
                    onValueChange={(value) =>
                      setConversionSettings(prev => ({
                        ...prev,
                        hardwareDefaults: { ...prev.hardwareDefaults, handles: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                      <SelectItem value="Brushed Nickel">Brushed Nickel</SelectItem>
                      <SelectItem value="Chrome">Chrome</SelectItem>
                      <SelectItem value="Brass">Brass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Current Floorplan Cabinets */}
          <div className="space-y-3">
            <h4 className="font-semibold">Current Floorplan Cabinets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cabinets.map((cabinet) => (
                <div 
                  key={cabinet.id}
                  className={`p-3 border rounded-lg ${
                    selectedTypes.includes(cabinet.type) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{cabinet.type}</span>
                    <Badge 
                      variant={selectedTypes.includes(cabinet.type) ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {selectedTypes.includes(cabinet.type) ? 'Selected' : 'Not Selected'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Dimensions: {cabinet.width}×{cabinet.height}×{cabinet.depth}mm</div>
                    <div>Position: ({cabinet.position.x}, {cabinet.position.y})</div>
                    {cabinet.mountHeight && (
                      <div>Mount Height: {cabinet.mountHeight}mm</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleConvert}
              disabled={isConverting || selectedTypes.length === 0}
              className="flex items-center gap-2"
            >
              {isConverting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Convert to Wireframes
                </>
              )}
            </Button>
            
            {convertedAssets.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleAddToWireframeViewer}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Add to Wireframe Viewer ({convertedAssets.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Converted Assets Preview */}
      {convertedAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Converted Assets
            </CardTitle>
            <CardDescription>
              {convertedAssets.length} wireframe assets generated from floorplan data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedAssets.map((asset) => (
                <div key={asset.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{asset.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Category: {asset.category}</div>
                    {asset.dimensions && (
                      <div>Dimensions: {asset.dimensions.width}×{asset.dimensions.height}×{asset.dimensions.depth}mm</div>
                    )}
                    {asset.parts && (
                      <div>Parts: {asset.parts.length}</div>
                    )}
                    {asset.accessories && (
                      <div>Accessories: {asset.accessories.length}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
