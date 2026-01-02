'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Eye, 
  Settings,
  Grid,
  Box,
  Layers,
  FileText,
  Code,
  Package,
  Wrench,
  Search,
  RotateCcw,
  Maximize2,
  Zap,
  Ruler
} from 'lucide-react';
import { Cabinet, CabinetType } from '@/types/domain/cabinet.types';
import { CabinetWidth, CabinetDepth, CabinetHeight, Difficulty, Status } from '@/types/core/base.types';
import { capitalize } from "@/lib/utils/string";

interface AdvancedWireframeRendererProps {
    className?: string;
    cabinet?: Cabinet;
    onCabinetSelect?: (cabinet: Cabinet) => void;
}

const PROFESSIONAL_CABINET_TEMPLATES: Cabinet[] = [
    {
        id: 'kitchen-base-cabinet-24',
        name: 'Professional Base Cabinet 24"',
        type: 'base' as CabinetType,
        dimensions: { width: 24 as CabinetWidth, height: 34.5 as CabinetHeight, depth: 24 as CabinetDepth },
        parts: [
            {
                id: 'base-left-side',
                name: 'Left Side Panel',
                partType: 'side',
                material: {
                    id: 'plywood-18mm',
                    name: 'Birch Plywood',
                    type: 'plywood',
                    thickness: 18,
                    grade: 'A',
                    surfaceFinish: 'smooth',
                    moistureContent: 8,
                    formaldehydeEmission: 'E0',
                    fireRating: 'Class-1',
                    structuralProperties: {
                        modulusOfElasticity: 12000,
                        modulusOfRupture: 85,
                        compressiveStrength: 45,
                        shearStrength: 12,
                        hardness: 900,
                        density: 680
                    },
                    workability: {
                        easeOfCutting: 8,
                        machiningQuality: 9,
                        screwHolding: 8,
                        glueBonding: 9,
                        finishingQuality: 9
                    },
                    pricePerUnit: 45.50,
                    unit: 'sheet'
                },
                dimensions: { width: 18, height: 720, thickness: 18 },
                quantity: 1,
                grainDirection: 'vertical',
                edgeBanding: {
                    top: { enabled: true, thickness: 0.4, color: '#d4a574' },
                    bottom: { enabled: true, thickness: 0.4, color: '#d4a574' },
                    left: { enabled: false, thickness: 0 },
                    right: { enabled: false, thickness: 0 }
                },
                machining: {
                    drilling: [],
                    routing: [],
                    cutting: [],
                    sanding: [],
                    assembly: []
                },
                hardware: [],
                tolerances: [],
                cost: 45.50,
                weight: 12.5,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            }
        ],
        hardware: [],
        materials: [],
        configuration: {
            style: 'shaker',
            construction: 'frameless',
            joinery: 'butt-joint',
            finishing: {
                interior: {
                    material: 'Melamine',
                    color: 'White',
                    sheen: 'matte',
                    texture: 'smooth'
                },
                exterior: {
                    material: 'Birch veneer',
                    color: 'Natural',
                    sheen: 'satin',
                    texture: 'grained'
                },
                edgeBanding: {
                    enabled: true,
                    material: 'PVC',
                    thickness: 0.4,
                    color: '#d4a574',
                    grainDirection: 'horizontal',
                    application: 'hot-melt'
                },
                protectiveCoating: {
                    type: 'polyurethane',
                    sheen: 'satin',
                    coats: 2,
                    application: 'spray'
                }
            },
            hardware: {
                hinges: {
                    type: 'concealed',
                    brand: 'Blum',
                    model: 'Compact 33',
                    finish: 'satin-nickel',
                    quantity: 2,
                    features: ['Soft-close', '3D adjustment']
                },
                handles: {
                    type: 'bar-pull',
                    brand: 'Top Knobs',
                    model: 'TK-321',
                    finish: 'satin-nickel',
                    quantity: 2,
                    spacing: 128,
                    features: ['Ergonomic design']
                },
                drawerSlides: {
                    type: 'side-mount',
                    brand: 'Blum',
                    model: 'Movento',
                    finish: 'satin-nickel',
                    quantity: 0,
                    features: ['Soft-close']
                },
                shelfSupports: {
                    type: 'pin',
                    brand: 'Blum',
                    model: 'Shelf Pin',
                    finish: 'satin-nickel',
                    quantity: 4,
                    spacing: 32
                }
            },
            customizations: {
                modifications: [],
                specialFeatures: [],
                customParts: [],
                uniqueRequirements: []
            }
        },
        estimatedCost: 245.00,
        estimatedTime: 4.5,
        difficulty: 'intermediate' as Difficulty,
        status: 'available' as Status,
        notes: 'Standard kitchen base cabinet with soft-close hinges',
        tags: ['kitchen', 'base', 'shaker', 'frameless'],
        metadata: {
            roomType: 'kitchen',
            installationType: 'floor-mounted',
            weightCapacity: 50,
            doorStyle: 'full-overlay',
            finishType: 'stain',
            assemblyRequired: true,
            customFeatures: ['Soft-close hardware']
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
];

export default function AdvancedWireframeRenderer({
    className = "",
    cabinet,
    onCabinetSelect
}: AdvancedWireframeRendererProps) {
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(cabinet || null);
    const [wireframeOpacity, setWireframeOpacity] = useState(70);
    const [showGrid, setShowGrid] = useState(true);
    const [wireframeColor, setWireframeColor] = useState('#4a5568');
    const [exportFormat, setExportFormat] = useState<'json' | 'js' | 'threejs' | 'obj' | 'gcode'>('json');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'wireframe' | 'solid' | 'both'>('wireframe');
    const [showDimensions, setShowDimensions] = useState(true);
    const [showAnnotations, setShowAnnotations] = useState(true);

    const filteredCabinets = useMemo(() => {
        return PROFESSIONAL_CABINET_TEMPLATES.filter(cabinet => {
            const matchesSearch = cabinet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cabinet.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || cabinet.type === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleCabinetSelect = (cabinet: Cabinet) => {
        setSelectedCabinet(cabinet);
        onCabinetSelect?.(cabinet);
    };

    const handleExport = () => {
        if (!selectedCabinet) {
            console.log('No cabinet selected for export');
            return;
        }

        // Professional export functionality
        const exportData = {
            cabinet: selectedCabinet,
            settings: {
                opacity: wireframeOpacity,
                color: wireframeColor,
                showGrid,
                viewMode,
                showDimensions,
                showAnnotations
            },
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedCabinet.name.replace(/\s+/g, '_')}_wireframe.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleView3D = () => {
        if (!selectedCabinet) return;
        console.log('Viewing 3D model for:', selectedCabinet.name);
    };

    const renderWireframePreview = (cabinet: Cabinet) => {
        return (
            <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative border-2 border-dashed border-slate-300">
                <div className="text-center">
                    <Box className="w-16 h-16 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">{cabinet.name}</p>
                    <p className="text-xs text-slate-500">{cabinet.type} cabinet</p>
                </div>

                {showDimensions && (
                    <div className="absolute bottom-2 right-2 text-xs bg-white/80 px-2 py-1 rounded">
                        {cabinet.dimensions.width}"W × {cabinet.dimensions.height}"H × {cabinet.dimensions.depth}"D
                    </div>
                )}

                {showAnnotations && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                            {cabinet.parts.length} parts
                        </Badge>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Professional Wireframe Renderer
                    </CardTitle>
                    <CardDescription>
                        Advanced cabinet wireframe generation with professional-grade export options
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="viewer" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
                            <TabsTrigger value="templates">Templates</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="viewer" className="mt-6">
                            <div className="space-y-4">
                                {/* Main Wireframe Preview */}
                                <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                                    {selectedCabinet ? (
                                        <div className="text-center">
                                            <Box className="w-24 h-24 mx-auto mb-4 text-slate-400" />
                                            <h3 className="text-lg font-semibold text-slate-700">{selectedCabinet.name}</h3>
                                            <p className="text-slate-600">Professional wireframe visualization</p>
                                            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                                                <span>Opacity: {wireframeOpacity}%</span>
                                                <span>View: {viewMode}</span>
                                                <span>Grid: {showGrid ? 'On' : 'Off'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Box className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                            <p className="text-slate-600">Select a cabinet template to view</p>
                                            <p className="text-sm text-slate-500">Choose from the Templates tab</p>
                                        </div>
                                    )}
                                </div>

                                {/* Control Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" onClick={handleView3D} disabled={!selectedCabinet}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View 3D
                                    </Button>

                                    <Button variant="outline" size="sm" onClick={handleExport} disabled={!selectedCabinet}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export {exportFormat.toUpperCase()}
                                    </Button>

                                    <Button variant="outline" size="sm" disabled={!selectedCabinet}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset View
                                    </Button>

                                    <Button variant="outline" size="sm" disabled={!selectedCabinet}>
                                        <Maximize2 className="w-4 h-4 mr-2" />
                                        Fullscreen
                                    </Button>
                                </div>

                                {/* Cabinet Information */}
                                {selectedCabinet && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="p-3 bg-muted rounded">
                                            <p className="text-muted-foreground">Type</p>
                                            <p className="font-semibold capitalize">{selectedCabinet.type}</p>
                                        </div>
                                        <div className="p-3 bg-muted rounded">
                                            <p className="text-muted-foreground">Parts</p>
                                            <p className="font-semibold">{selectedCabinet.parts.length}</p>
                                        </div>
                                        <div className="p-3 bg-muted rounded">
                                            <p className="text-muted-foreground">Difficulty</p>
                                            <p className="font-semibold capitalize">{selectedCabinet.difficulty}</p>
                                        </div>
                                        <div className="p-3 bg-muted rounded">
                                            <p className="text-muted-foreground">Est. Cost</p>
                                            <p className="font-semibold">${selectedCabinet.estimatedCost?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="templates" className="mt-6">
                            <div className="space-y-4">
                                {/* Search and Filter */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search cabinet templates..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="base">Base Cabinets</SelectItem>
                                            <SelectItem value="wall">Wall Cabinets</SelectItem>
                                            <SelectItem value="tall">Tall Cabinets</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Cabinet Template Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredCabinets.map((cabinet) => (
                                        <Card
                                            key={cabinet.id}
                                            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedCabinet?.id === cabinet.id ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => handleCabinetSelect(cabinet)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-sm truncate">{cabinet.name}</CardTitle>
                                                    <Badge variant="outline">{cabinet.type}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                {renderWireframePreview(cabinet)}

                                                <div className="mt-3 space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Difficulty:</span>
                                                        <span className="font-medium capitalize">{cabinet.difficulty}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Est. Time:</span>
                                                        <span className="font-medium">{cabinet.estimatedTime}h</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Cost:</span>
                                                        <span className="font-medium text-green-600">${cabinet.estimatedCost?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="mt-6">
                            <div className="space-y-6">
                                {/* Render Settings */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Render Settings
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">View Mode</label>
                                            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="wireframe">Wireframe Only</SelectItem>
                                                    <SelectItem value="solid">Solid Only</SelectItem>
                                                    <SelectItem value="both">Wireframe + Solid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Export Format</label>
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
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Wireframe Opacity: {wireframeOpacity}%</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={wireframeOpacity}
                                            onChange={(e) => setWireframeOpacity(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Wireframe Color</label>
                                        <input
                                            type="color"
                                            value={wireframeColor}
                                            onChange={(e) => setWireframeColor(e.target.value)}
                                            className="w-full h-8 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={showGrid}
                                                onChange={(e) => setShowGrid(e.target.checked)}
                                            />
                                            <span className="text-sm">Show Grid</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={showDimensions}
                                                onChange={(e) => setShowDimensions(e.target.checked)}
                                            />
                                            <span className="text-sm">Show Dimensions</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={showAnnotations}
                                                onChange={(e) => setShowAnnotations(e.target.checked)}
                                            />
                                            <span className="text-sm">Show Annotations</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}