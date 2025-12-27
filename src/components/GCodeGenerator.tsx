"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Download, 
  Play, 
  Settings,
  Code,
  FileText,
  Package,
  Eye,
  Edit,
  Zap,
  Target,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';

interface GCodeCommand {
  id: string;
  type: 'G' | 'M' | 'T' | 'F' | 'S' | 'X' | 'Y' | 'Z' | 'comment';
  value: string;
  description: string;
  parameters?: Record<string, number>;
}

interface CNCOperation {
  id: string;
  name: string;
  type: 'drill' | 'mill' | 'cut' | 'move' | 'toolchange';
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  parameters: {
    feedRate: number;
    spindleSpeed: number;
    depth: number;
    diameter: number;
  };
  gcode: string[];
}

interface CNCFormat {
  id: string;
  name: string;
  software: string;
  extension: string;
  description: string;
  features: string[];
}

interface GCodeGeneratorProps {
  className?: string;
}

const CNC_FORMATS: CNCFormat[] = [
  {
    id: 'cabinet_vision_csv',
    name: 'Cabinet Vision CSV',
    software: 'Cabinet Vision',
    extension: 'csv',
    description: 'Drill pattern CSV for Cabinet Vision software',
    features: ['Part tracking', 'Hardware mapping', 'Sequence numbering']
  },
  {
    id: 'microvellum_csv',
    name: 'Microvellum CSV',
    software: 'Microvellum',
    extension: 'csv',
    description: 'Operations CSV for Microvellum manufacturing',
    features: ['Material info', 'Operation types', 'Notes support']
  },
  {
    id: 'woodwop_mpr',
    name: 'HOMAG WoodWOP',
    software: 'WoodWOP',
    extension: 'mpr',
    description: 'MPR format for HOMAG CNC machines',
    features: ['BOAL operations', 'Tool management', 'Angle control']
  },
  {
    id: 'biesse_cix',
    name: 'Biesseworks CIX',
    software: 'Biesse',
    extension: 'cix',
    description: 'CIX format for Biesse CNC systems',
    features: ['Panel definition', 'Drill operations', 'Tool selection']
  },
  {
    id: 'generic_gcode',
    name: 'Generic G-Code',
    software: 'Generic CNC',
    extension: 'nc',
    description: 'Standard G-code for most CNC machines',
    features: ['Universal format', 'Standard commands', 'Easy editing']
  }
];

const SAMPLE_OPERATIONS: CNCOperation[] = [
  {
    id: 'drill-001',
    name: 'Hinge Cup Hole',
    type: 'drill',
    coordinates: { x: 32, y: 100, z: 0 },
    parameters: {
      feedRate: 1500,
      spindleSpeed: 18000,
      depth: 13,
      diameter: 35
    },
    gcode: ['G0 X32 Y100', 'G1 Z-13 F1500', 'G0 Z5']
  },
  {
    id: 'drill-002',
    name: 'Hinge Cup Hole Top',
    type: 'drill',
    coordinates: { x: 32, y: 620, z: 0 },
    parameters: {
      feedRate: 1500,
      spindleSpeed: 18000,
      depth: 13,
      diameter: 35
    },
    gcode: ['G0 X32 Y620', 'G1 Z-13 F1500', 'G0 Z5']
  },
  {
    id: 'drill-003',
    name: 'Dowel Hole',
    type: 'drill',
    coordinates: { x: 32, y: 32, z: 0 },
    parameters: {
      feedRate: 1200,
      spindleSpeed: 16000,
      depth: 16,
      diameter: 8
    },
    gcode: ['G0 X32 Y32', 'G1 Z-16 F1200', 'G0 Z5']
  },
  {
    id: 'drill-004',
    name: 'Dowel Hole Top',
    type: 'drill',
    coordinates: { x: 32, y: 688, z: 0 },
    parameters: {
      feedRate: 1200,
      spindleSpeed: 16000,
      depth: 16,
      diameter: 8
    },
    gcode: ['G0 X32 Y688', 'G1 Z-16 F1200', 'G0 Z5']
  },
  {
    id: 'drill-005',
    name: 'Shelf Pin Hole',
    type: 'drill',
    coordinates: { x: 32, y: 200, z: 0 },
    parameters: {
      feedRate: 1000,
      spindleSpeed: 15000,
      depth: 12,
      diameter: 5
    },
    gcode: ['G0 X32 Y200', 'G1 Z-12 F1000', 'G0 Z5']
  }
];

const GCODE_COMMANDS: GCodeCommand[] = [
  { id: 'g0', type: 'G', value: '0', description: 'Rapid move', parameters: { x: 0, y: 0, z: 0 } },
  { id: 'g1', type: 'G', value: '1', description: 'Linear interpolation', parameters: { x: 0, y: 0, z: 0 } },
  { id: 'g90', type: 'G', value: '90', description: 'Absolute positioning' },
  { id: 'g21', type: 'G', value: '21', description: 'Metric units' },
  { id: 'm3', type: 'M', value: '3', description: 'Spindle on clockwise', parameters: { s: 0 } },
  { id: 'm5', type: 'M', value: '5', description: 'Spindle off' },
  { id: 'm30', type: 'M', value: '30', description: 'Program end' },
  { id: 'f', type: 'F', value: '1500', description: 'Feed rate', parameters: { rate: 1500 } },
  { id: 's', type: 'S', value: '18000', description: 'Spindle speed', parameters: { rpm: 18000 } }
];

export default function GCodeGenerator({ className = "" }: GCodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState('operations');
  const [selectedFormat, setSelectedFormat] = useState<CNCFormat>(CNC_FORMATS[4]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<CNCOperation | null>(null);
  const [gcodeSettings, setGcodeSettings] = useState({
    safeZ: 5,
    feedRate: 1500,
    spindleSpeed: 18000,
    plungeRate: 500,
    retractRate: 2000,
    enableComments: true,
    enableToolChange: false,
    enableCoolant: false
  });

  const filteredOperations = SAMPLE_OPERATIONS.filter(op =>
    op.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateGCode = (operations: CNCOperation[], format: CNCFormat) => {
    const lines: string[] = [];
    
    if (format.id === 'generic_gcode') {
      // Generic G-code format
      lines.push(`(${format.name} - Generated G-code)`);
      lines.push(`(Part: Cabinet Side Panel)`);
      lines.push(`(Operations: ${operations.length})`);
      lines.push('');
      
      if (gcodeSettings.enableComments) lines.push('(Setup commands)');
      lines.push('G90 G21'); // Absolute positioning, metric units
      lines.push(`G0 Z${gcodeSettings.safeZ}`); // Move to safe Z
      lines.push(`M3 S${gcodeSettings.spindleSpeed}`); // Spindle on
      lines.push('');
      
      operations.forEach((op, index) => {
        if (gcodeSettings.enableComments) {
          lines.push(`(${op.name})`);
        }
        
        op.gcode.forEach(line => {
          if (line.startsWith('G0')) {
            lines.push(line);
          } else if (line.startsWith('G1')) {
            // Update feed rate if needed
            const updatedLine = line.replace(/F\d+/, `F${gcodeSettings.feedRate}`);
            lines.push(updatedLine);
          } else {
            lines.push(line);
          }
        });
        
        if (index < operations.length - 1) {
          lines.push('');
        }
      });
      
      lines.push('');
      if (gcodeSettings.enableComments) lines.push('(End program)');
      lines.push('M5'); // Spindle off
      lines.push('G0 X0 Y0'); // Return to origin
      lines.push('M30'); // Program end
    } else if (format.id === 'cabinet_vision_csv') {
      // Cabinet Vision CSV format
      lines.push('PartID,PartType,Length_mm,Width_mm,Thickness_mm,Origin,Face,Seq,X_mm,Y_mm,Dia_mm,Depth_mm,HardwareID,FeatureType');
      
      operations.forEach((op, index) => {
        const row = [
          'SIDE_PANEL_001',
          'side_panel',
          '720',
          '600',
          '18',
          'bottomLeft',
          'front',
          index + 1,
          op.coordinates.x,
          op.coordinates.y,
          op.parameters.diameter,
          op.parameters.depth,
          'HINGE_001',
          op.type
        ].join(',');
        lines.push(row);
      });
    } else if (format.id === 'microvellum_csv') {
      // Microvellum CSV format
      lines.push('PartName,Material,Thickness_mm,Length_mm,Width_mm,OpType,Seq,X_mm,Y_mm,Dia_mm,Depth_mm,Notes');
      
      operations.forEach((op, index) => {
        const row = [
          'Side Panel',
          '18mm Plywood',
          '18',
          '720',
          '600',
          'DRILL',
          index + 1,
          op.coordinates.x,
          op.coordinates.y,
          op.parameters.diameter,
          op.parameters.depth,
          op.name
        ].join(',');
        lines.push(row);
      });
    } else if (format.id === 'woodwop_mpr') {
      // WoodWOP MPR format
      lines.push('BEGIN MPR');
      lines.push('; WoodWOP-style drill program');
      lines.push('; Part: side_panel 720x600x18 mm');
      lines.push('');
      
      operations.forEach((op, index) => {
        const boLine = [
          'BO',
          index + 1,
          op.coordinates.x,
          op.coordinates.y,
          op.parameters.diameter,
          op.parameters.depth,
          0, // angle
          0, // dir
          0, // tool
          op.type.toUpperCase()
        ].join(';');
        lines.push(boLine);
      });
      
      lines.push('');
      lines.push('END MPR');
    } else if (format.id === 'biesse_cix') {
      // Biesse CIX format
      lines.push('@BEGIN');
      lines.push('@PRJ    "CNC_PART"');
      lines.push('@PANEL  "SIDE_PANEL" 0.0,0.0,720.0,600.0,18.0,0,0,0,0');
      lines.push('');
      
      operations.forEach((op, index) => {
        const drillLine = [
          '@DRILL',
          `"D${index + 1}"`,
          op.coordinates.x,
          op.coordinates.y,
          op.parameters.diameter,
          op.parameters.depth,
          '0', // dir
          '0', // tool
          `"${op.type.toUpperCase()}"`
        ].join(',');
        lines.push(drillLine);
      });
      
      lines.push('');
      lines.push('@END');
    }
    
    return lines.join('\n');
  };

  const exportGCode = () => {
    if (filteredOperations.length === 0) {
      toast.error('No operations to export');
      return;
    }

    const gcode = generateGCode(filteredOperations, selectedFormat);
    
    const blob = new Blob([gcode], { 
      type: selectedFormat.id.includes('csv') ? 'text/csv' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cnc_program.${selectedFormat.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedFormat.name} file`);
  };

  const previewGCode = () => {
    if (filteredOperations.length === 0) {
      toast.error('No operations to preview');
      return;
    }

    const gcode = generateGCode(filteredOperations, selectedFormat);
    const lines = gcode.split('\n').slice(0, 20); // Show first 20 lines
    
    console.log('G-code preview:', lines.join('\n'));
    toast.success('G-code preview logged to console');
  };

  const renderOperation = (operation: CNCOperation) => {
    return (
      <Card 
        key={operation.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedOperation(operation)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate">{operation.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {operation.type}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            X: {operation.coordinates.x}mm, Y: {operation.coordinates.y}mm, Z: {operation.coordinates.z}mm
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-semibold">Feed Rate</p>
              <p>{operation.parameters.feedRate}</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="font-semibold">Spindle</p>
              <p>{operation.parameters.spindleSpeed}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Ø{operation.parameters.diameter}mm
              </Badge>
              <Badge variant="outline" className="text-xs">
                Depth: {operation.parameters.depth}mm
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded font-mono">
              {operation.gcode.slice(0, 2).join(' ')}
              {operation.gcode.length > 2 && '...'}
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOperation(operation);
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
                toast.success(`Added ${operation.name} to program`);
              }}
            >
              <Play className="w-3 h-3 mr-1" />
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
            <Code className="w-5 h-5" />
            G-Code Generator
          </CardTitle>
          <CardDescription>
            Generate CNC G-code and manufacturing files for various CNC systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Format Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Output Format
              </CardTitle>
              <CardDescription>
                Select CNC software format for G-code generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CNC_FORMATS.map((format) => (
                  <Card 
                    key={format.id}
                    className={`cursor-pointer transition-all ${
                      selectedFormat.id === format.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedFormat(format)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{format.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {format.software} • .{format.extension}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        {format.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {format.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {format.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{format.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* G-code Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                G-Code Settings
              </CardTitle>
              <CardDescription>
                Configure G-code generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Safe Z Height (mm)</label>
                  <Input
                    type="number"
                    value={gcodeSettings.safeZ}
                    onChange={(e) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      safeZ: Number(e.target.value) 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feed Rate (mm/min)</label>
                  <Input
                    type="number"
                    value={gcodeSettings.feedRate}
                    onChange={(e) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      feedRate: Number(e.target.value) 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spindle Speed (RPM)</label>
                  <Input
                    type="number"
                    value={gcodeSettings.spindleSpeed}
                    onChange={(e) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      spindleSpeed: Number(e.target.value) 
                    }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Comments</label>
                  <Switch
                    checked={gcodeSettings.enableComments}
                    onCheckedChange={(checked) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      enableComments: checked 
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Tool Change</label>
                  <Switch
                    checked={gcodeSettings.enableToolChange}
                    onCheckedChange={(checked) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      enableToolChange: checked 
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Coolant</label>
                  <Switch
                    checked={gcodeSettings.enableCoolant}
                    onCheckedChange={(checked) => setGcodeSettings(prev => ({ 
                      ...prev, 
                      enableCoolant: checked 
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Actions */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search operations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={previewGCode} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={exportGCode}>
              <Download className="w-4 h-4 mr-2" />
              Export {selectedFormat.name}
            </Button>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="operations" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Operations ({filteredOperations.length})
              </TabsTrigger>
              <TabsTrigger value="gcode" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                G-Code Commands
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Live Preview
              </TabsTrigger>
            </TabsList>

            {/* Operations Tab */}
            <TabsContent value="operations" className="mt-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Operations: {filteredOperations.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Format: {selectedFormat.name} ({selectedFormat.extension})
                    </p>
                  </div>
                  <Badge variant="outline">
                    {filteredOperations.reduce((sum, op) => sum + op.parameters.depth, 0)}mm total depth
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOperations.map(renderOperation)}
              </div>
            </TabsContent>

            {/* G-Code Commands Tab */}
            <TabsContent value="gcode" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GCODE_COMMANDS.map((command) => (
                  <Card key={command.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                          {command.type}{command.value}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {command.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {command.parameters && (
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(command.parameters).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    G-Code Preview
                  </CardTitle>
                  <CardDescription>
                    Live preview of generated {selectedFormat.name} output
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs h-96 overflow-auto">
                    {filteredOperations.length > 0 ? (
                      <pre>{generateGCode(filteredOperations, selectedFormat)}</pre>
                    ) : (
                      <div className="text-slate-500">
                        No operations selected. Add operations to see G-code preview.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Selected Operation Details */}
          {selectedOperation && (
            <Card className="mt-6 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {selectedOperation.name}
                </CardTitle>
                <CardDescription>
                  Operation details and G-code commands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold">{selectedOperation.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diameter</p>
                    <p className="font-semibold">{selectedOperation.parameters.diameter}mm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Depth</p>
                    <p className="font-semibold">{selectedOperation.parameters.depth}mm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Feed Rate</p>
                    <p className="font-semibold">{selectedOperation.parameters.feedRate} mm/min</p>
                  </div>
                </div>
                
                <div className="bg-slate-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">G-Code Commands</h4>
                  <div className="font-mono text-xs space-y-1">
                    {selectedOperation.gcode.map((line, index) => (
                      <div key={index} className="bg-white p-2 rounded border">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedOperation(null)}
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
