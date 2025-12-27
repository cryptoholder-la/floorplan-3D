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
  Plus, 
  Trash2,
  FileText,
  Settings,
  Calculator,
  Scissors,
  Package,
  Eye,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

interface CutListItem {
  id: string;
  name: string;
  material: string;
  thickness: number;
  width: number;
  height: number;
  quantity: number;
  grainDirection?: 'long' | 'cross';
  edgeBanding?: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  drilling?: {
    type: string;
    positions: Array<{ x: number; y: number; diameter: number }>;
  };
  notes?: string;
}

interface PartListItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory: string;
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    thickness: number;
  };
  quantity: number;
  unit: string;
  price?: number;
  supplier?: string;
  partNumber?: string;
}

interface GapConfiguration {
  enabled: boolean;
  type: 'kerf' | 'overlap' | 'spacing';
  value: number;
  material: string;
  tool: {
    diameter: number;
    type: string;
  };
}

interface CutlistGeneratorProps {
  className?: string;
}

const SAMPLE_CUTLIST: CutListItem[] = [
  {
    id: 'side-left-001',
    name: 'Left Side Panel',
    material: 'Plywood',
    thickness: 18,
    width: 600,
    height: 720,
    quantity: 1,
    grainDirection: 'long',
    edgeBanding: {
      top: true,
      bottom: true,
      left: false,
      right: false
    },
    drilling: {
      type: '32mm system',
      positions: [
        { x: 32, y: 32, diameter: 5 },
        { x: 32, y: 372, diameter: 5 },
        { x: 32, y: 688, diameter: 5 }
      ]
    },
    notes: 'Left side of base cabinet'
  },
  {
    id: 'side-right-001',
    name: 'Right Side Panel',
    material: 'Plywood',
    thickness: 18,
    width: 600,
    height: 720,
    quantity: 1,
    grainDirection: 'long',
    edgeBanding: {
      top: true,
      bottom: true,
      left: false,
      right: false
    },
    drilling: {
      type: '32mm system',
      positions: [
        { x: 32, y: 32, diameter: 5 },
        { x: 32, y: 372, diameter: 5 },
        { x: 32, y: 688, diameter: 5 }
      ]
    },
    notes: 'Right side of base cabinet'
  },
  {
    id: 'bottom-001',
    name: 'Bottom Panel',
    material: 'Plywood',
    thickness: 18,
    width: 564,
    height: 300,
    quantity: 1,
    grainDirection: 'cross',
    edgeBanding: {
      top: true,
      bottom: false,
      left: true,
      right: true
    },
    drilling: {
      type: 'dowel joints',
      positions: [
        { x: 32, y: 32, diameter: 8 },
        { x: 532, y: 32, diameter: 8 },
        { x: 32, y: 268, diameter: 8 },
        { x: 532, y: 268, diameter: 8 }
      ]
    },
    notes: 'Bottom panel with dowel joints'
  },
  {
    id: 'top-001',
    name: 'Top Panel',
    material: 'Plywood',
    thickness: 18,
    width: 564,
    height: 300,
    quantity: 1,
    grainDirection: 'cross',
    edgeBanding: {
      top: false,
      bottom: true,
      left: true,
      right: true
    },
    drilling: {
      type: 'dowel joints',
      positions: [
        { x: 32, y: 32, diameter: 8 },
        { x: 532, y: 32, diameter: 8 },
        { x: 32, y: 268, diameter: 8 },
        { x: 532, y: 268, diameter: 8 }
      ]
    },
    notes: 'Top panel with dowel joints'
  },
  {
    id: 'back-001',
    name: 'Back Panel',
    material: 'MDF',
    thickness: 6,
    width: 564,
    height: 720,
    quantity: 1,
    grainDirection: 'cross',
    edgeBanding: {
      top: false,
      bottom: false,
      left: false,
      right: false
    },
    drilling: {
      type: 'back panel nails',
      positions: []
    },
    notes: 'Thin back panel'
  }
];

const SAMPLE_PARTLIST: PartListItem[] = [
  {
    id: 'hinge-001',
    name: 'European Hinge',
    description: '35mm overlay hinge for cabinet doors',
    category: 'Hardware',
    subcategory: 'Hinges',
    material: 'Steel',
    dimensions: {
      width: 35,
      height: 25,
      depth: 15,
      thickness: 2
    },
    quantity: 4,
    unit: 'pieces',
    price: 3.25,
    supplier: 'HingeCo',
    partNumber: 'EH-35-01'
  },
  {
    id: 'handle-001',
    name: 'Cabinet Handle',
    description: 'Modern aluminum handle with 128mm spacing',
    category: 'Hardware',
    subcategory: 'Handles',
    material: 'Aluminum',
    dimensions: {
      width: 128,
      height: 25,
      depth: 30,
      thickness: 3
    },
    quantity: 2,
    unit: 'pieces',
    price: 8.50,
    supplier: 'HandleCorp',
    partNumber: 'CH-128-01'
  },
  {
    id: 'shelf-001',
    name: 'Adjustable Shelf',
    description: '18mm thick adjustable shelf with support pins',
    category: 'Components',
    subcategory: 'Shelves',
    material: 'Plywood',
    dimensions: {
      width: 560,
      height: 280,
      depth: 280,
      thickness: 18
    },
    quantity: 2,
    unit: 'pieces',
    price: 12.75,
    supplier: 'WoodSupply',
    partNumber: 'AS-560-01'
  },
  {
    id: 'screw-001',
    name: 'Confirmat Screw',
    description: '5mm x 40mm confirmat screw for cabinet assembly',
    category: 'Hardware',
    subcategory: 'Fasteners',
    material: 'Steel',
    dimensions: {
      width: 5,
      height: 40,
      depth: 5,
      thickness: 1
    },
    quantity: 50,
    unit: 'pieces',
    price: 0.15,
    supplier: 'FastenerCo',
    partNumber: 'CS-5x40-01'
  }
];

const MATERIALS = [
  { name: 'Plywood', thickness: [6, 12, 18, 25] },
  { name: 'MDF', thickness: [6, 12, 18, 25] },
  { name: 'Hardwood', thickness: [12, 18, 25, 32] },
  { name: 'Particle Board', thickness: [12, 18, 25] }
];

const TOOL_TYPES = [
  { name: 'Saw Blade', diameter: 3.2, type: 'kerf' },
  { name: 'Router Bit', diameter: 6.35, type: 'kerf' },
  { name: 'Laser Cutter', diameter: 0.2, type: 'kerf' },
  { name: 'Waterjet', diameter: 1.0, type: 'kerf' }
] as const;

export default function CutlistGenerator({ className = "" }: CutlistGeneratorProps) {
  const [activeTab, setActiveTab] = useState('cutlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CutListItem | PartListItem | null>(null);
  const [gapConfig, setGapConfig] = useState<GapConfiguration>({
    enabled: true,
    type: 'kerf',
    value: 0.2,
    material: 'Plywood',
    tool: {
      diameter: 3.2,
      type: 'Saw Blade'
    }
  });

  const filteredCutlist = SAMPLE_CUTLIST.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPartlist = SAMPLE_PARTLIST.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotalArea = (items: CutListItem[]) => {
    return items.reduce((total, item) => {
      return total + (item.width * item.height * item.quantity) / 1000000; // Convert to m²
    }, 0);
  };

  const calculateTotalCost = (items: PartListItem[]) => {
    return items.reduce((total, item) => {
      return total + ((item.price || 0) * item.quantity);
    }, 0);
  };

  const applyGapToDimensions = (width: number, height: number) => {
    if (!gapConfig.enabled) return { width, height };
    
    const gapValue = gapConfig.value;
    
    if (gapConfig.type === 'kerf') {
      // Kerf: subtract half gap from each side
      return {
        width: width - gapValue,
        height: height - gapValue
      };
    } else if (gapConfig.type === 'overlap') {
      // Overlap: add gap to dimensions
      return {
        width: width + gapValue,
        height: height + gapValue
      };
    } else {
      // Spacing: add gap between parts
      return {
        width: width + gapValue / 2,
        height: height + gapValue / 2
      };
    }
  };

  const exportCutlist = () => {
    const cutlistData = {
      gapConfiguration: gapConfig,
      items: filteredCutlist.map(item => ({
        ...item,
        adjustedDimensions: applyGapToDimensions(item.width, item.height)
      })),
      timestamp: new Date().toISOString(),
      totalArea: calculateTotalArea(filteredCutlist)
    };

    const blob = new Blob([JSON.stringify(cutlistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cutlist-with-gaps.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Cutlist exported with gap adjustments');
  };

  const exportPartlist = () => {
    const partlistData = {
      items: filteredPartlist,
      timestamp: new Date().toISOString(),
      totalCost: calculateTotalCost(filteredPartlist)
    };

    const blob = new Blob([JSON.stringify(partlistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'partlist.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Partlist exported');
  };

  const renderCutlistItem = (item: CutListItem) => {
    const adjusted = applyGapToDimensions(item.width, item.height);
    
    return (
      <Card 
        key={item.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedItem(item)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate">{item.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {item.material}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {item.thickness}mm × {item.width}mm × {item.height}mm
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-semibold">Original</p>
              <p>{item.width} × {item.height}</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="font-semibold">Adjusted</p>
              <p>{adjusted.width.toFixed(1)} × {adjusted.height.toFixed(1)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={item.grainDirection === 'long' ? 'default' : 'secondary'} className="text-xs">
                Grain: {item.grainDirection}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Qty: {item.quantity}
              </Badge>
            </div>
            
            {item.edgeBanding && (
              <div className="text-xs text-muted-foreground">
                Edge: {Object.entries(item.edgeBanding)
                  .filter(([_, enabled]) => enabled)
                  .map(([side]) => side)
                  .join(', ')}
              </div>
            )}
            
            {item.drilling && (
              <div className="text-xs text-muted-foreground">
                Drilling: {item.drilling.type} ({item.drilling.positions.length} holes)
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(item);
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
                toast.success(`Added ${item.name} to cutting list`);
              }}
            >
              <Scissors className="w-3 h-3 mr-1" />
              Cut
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPartlistItem = (item: PartListItem) => {
    return (
      <Card 
        key={item.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedItem(item)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate">{item.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>
          {item.description && (
            <CardDescription className="text-xs truncate">
              {item.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-semibold">Dimensions</p>
              <p>{item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="font-semibold">Price</p>
              <p>${item.price?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {item.material}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Qty: {item.quantity} {item.unit}
              </Badge>
            </div>
            
            {item.supplier && (
              <div className="text-xs text-muted-foreground">
                Supplier: {item.supplier}
              </div>
            )}
            
            {item.partNumber && (
              <div className="text-xs text-muted-foreground">
                Part #: {item.partNumber}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(item);
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
                toast.success(`Added ${item.name} to part list`);
              }}
            >
              <Package className="w-3 h-3 mr-1" />
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
            <FileText className="w-5 h-5" />
            Cutlist & Partlist Generator
          </CardTitle>
          <CardDescription>
            Generate cutting lists and part lists with gap compensation for CNC manufacturing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Gap Configuration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Gap Configuration
              </CardTitle>
              <CardDescription>
                Configure gap compensation for cutting operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable Gap Compensation</label>
                    <Switch
                      checked={gapConfig.enabled}
                      onCheckedChange={(enabled) => setGapConfig(prev => ({ ...prev, enabled }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gap Type</label>
                    <div className="flex gap-2">
                      {(['kerf', 'overlap', 'spacing'] as const).map(type => (
                        <Button
                          key={type}
                          variant={gapConfig.type === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGapConfig(prev => ({ ...prev, type }))}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gap Value (mm)</label>
                    <Slider
                      value={[gapConfig.value]}
                      onValueChange={([value]) => setGapConfig(prev => ({ ...prev, value }))}
                      max={2.0}
                      min={0.0}
                      step={0.1}
                    />
                    <span className="text-xs text-muted-foreground">{gapConfig.value}mm</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Material</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={gapConfig.material}
                      onChange={(e) => setGapConfig(prev => ({ ...prev, material: e.target.value }))}
                    >
                      {MATERIALS.map(material => (
                        <option key={material.name} value={material.name}>
                          {material.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tool</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={gapConfig.tool.name}
                      onChange={(e) => {
                        const selectedTool = TOOL_TYPES.find(t => t.name === e.target.value);
                        if (selectedTool) {
                          setGapConfig(prev => ({ ...prev, tool: selectedTool }));
                        }
                      }}
                    >
                      {TOOL_TYPES.map(tool => (
                        <option key={tool.name} value={tool.name}>
                          {tool.name} (Ø{tool.diameter}mm)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">Gap Information:</p>
                    <ul className="space-y-1">
                      <li>• <strong>Kerf:</strong> Material removed by cutting tool</li>
                      <li>• <strong>Overlap:</strong> Parts overlap for stronger joints</li>
                      <li>• <strong>Spacing:</strong> Gaps between parts for assembly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Export */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={activeTab === 'cutlist' ? exportCutlist : exportPartlist}>
              <Download className="w-4 h-4 mr-2" />
              Export {activeTab === 'cutlist' ? 'Cutlist' : 'Partlist'}
            </Button>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cutlist" className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Cutlist ({filteredCutlist.length})
              </TabsTrigger>
              <TabsTrigger value="partlist" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Partlist ({filteredPartlist.length})
              </TabsTrigger>
            </TabsList>

            {/* Cutlist Tab */}
            <TabsContent value="cutlist" className="mt-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Area: {calculateTotalArea(filteredCutlist).toFixed(2)} m²</p>
                    <p className="text-xs text-muted-foreground">
                      {gapConfig.enabled ? `With ${gapConfig.type} compensation (${gapConfig.value}mm)` : 'No gap compensation'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {filteredCutlist.reduce((sum, item) => sum + item.quantity, 0)} pieces
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCutlist.map(renderCutlistItem)}
              </div>
            </TabsContent>

            {/* Partlist Tab */}
            <TabsContent value="partlist" className="mt-6">
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Cost: ${calculateTotalCost(filteredPartlist).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {filteredPartlist.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <Badge variant="outline">
                    {filteredPartlist.length} unique parts
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartlist.map(renderPartlistItem)}
              </div>
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
                  {activeTab === 'cutlist' ? 'Cutting list item' : 'Part list item'} details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {'width' in selectedItem ? (
                  // PartListItem
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-semibold">{'category' in selectedItem ? String(selectedItem.category) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Material</p>
                      <p className="font-semibold">{selectedItem.material}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-semibold">{selectedItem.quantity} {'unit' in selectedItem ? String(selectedItem.unit) : 'pieces'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">{'price' in selectedItem && selectedItem.price ? `$${selectedItem.price.toFixed(2)}` : 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  // CutListItem
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Material</p>
                      <p className="font-semibold">{selectedItem.material}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Thickness</p>
                      <p className="font-semibold">{'thickness' in selectedItem ? `${selectedItem.thickness}mm` : selectedItem.dimensions.thickness}mm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grain Direction</p>
                      <p className="font-semibold">{'grainDirection' in selectedItem ? String(selectedItem.grainDirection) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-semibold">{selectedItem.quantity}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
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
        </CardContent>
      </Card>
    </div>
  );
}
