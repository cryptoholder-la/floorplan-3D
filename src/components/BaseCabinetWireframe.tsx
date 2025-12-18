"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Box, Maximize2, Layers, Package } from 'lucide-react';
import { BaseCabinet, CabinetWidth, WireframeGeometry } from '@/types/cabinet.types';
import { generateBaseCabinet, getAvailableWidths, generateCutList, calculateMaterialUsage } from '@/lib/cabinet-generator';
import { generateCabinetDrawing, exportToSVG } from '@/lib/cabinet-wireframe';
import { CabinetFunction, DrawerConfiguration, BlumHingeType, BlumDrawerSlideType } from '@/types/cabinet-config.types';
import { generateDrawerStack } from '@/lib/dovetail-drawer-generator';
import { generateRolloutStack, ROLLOUT_PRESETS } from '@/lib/rollout-generator';
import { BLUM_HINGES } from '@/lib/blum-hardware-templates';

interface BaseCabinetProps {
  defaultWidth?: CabinetWidth;
}

export default function BaseCabinetWireframe({ defaultWidth = 24 }: BaseCabinetProps) {
  const [selectedWidth, setSelectedWidth] = useState<CabinetWidth>(defaultWidth);
  const [showInternals, setShowInternals] = useState(true);
  const [activeView, setActiveView] = useState<'top' | 'elevation' | '3d'>('elevation');
  
  const [cabinetFunction, setCabinetFunction] = useState<CabinetFunction>('standard');
  const [drawerConfig, setDrawerConfig] = useState<DrawerConfiguration | 'none'>('none');
  const [hasRollouts, setHasRollouts] = useState(false);
  const [rolloutCount, setRolloutCount] = useState(2);
  const [hingeType, setHingeType] = useState<BlumHingeType>('CLIP-top-BLUMOTION-110');
  const [slideType, setSlideType] = useState<BlumDrawerSlideType>('TANDEM-BLUMOTION');
  const [shelfCount, setShelfCount] = useState(1);

  const cabinet = useMemo(() => {
    const config: any = {
      shelfCount,
    };
    if (drawerConfig !== 'none') {
      config.hasDrawer = true;
    }
    return generateBaseCabinet(selectedWidth, config);
  }, [selectedWidth, shelfCount, drawerConfig]);

  const drawers = useMemo(() => {
    if (drawerConfig === 'none') return null;
    return generateDrawerStack(selectedWidth, 24, 30, drawerConfig as DrawerConfiguration);
  }, [drawerConfig, selectedWidth]);

  const rollouts = useMemo(() => {
    if (!hasRollouts) return null;
    if (cabinetFunction === 'spice-pullout') {
      return ROLLOUT_PRESETS.spicePullout(selectedWidth, 24);
    }
    if (cabinetFunction === 'trash-pullout') {
      return [ROLLOUT_PRESETS.trashPullout(selectedWidth, 24)];
    }
    return generateRolloutStack(selectedWidth, 24, 30, rolloutCount);
  }, [hasRollouts, rolloutCount, selectedWidth, cabinetFunction]);

  const selectedHinge = useMemo(() => BLUM_HINGES[hingeType], [hingeType]);

  const drawing = useMemo(() => {
    return generateCabinetDrawing(cabinet, showInternals);
  }, [cabinet, showInternals]);

  const cutList = useMemo(() => {
    const list = generateCutList(cabinet);
    if (drawers) {
      drawers.forEach((drawer, idx) => {
        list.push(...drawer.cutList.map(c => ({ ...c, name: `${c.name} (Drawer ${idx + 1})` })));
      });
    }
    if (rollouts) {
      rollouts.forEach((rollout, idx) => {
        list.push(...rollout.cutList.map(c => ({ ...c, name: `${c.name} (Rollout ${idx + 1})` })));
      });
    }
    return list;
  }, [cabinet, drawers, rollouts]);

  const materialUsage = useMemo(() => {
    return calculateMaterialUsage(cabinet);
  }, [cabinet]);

  const handleDownloadSVG = (view: 'top' | 'elevation' | '3d') => {
    let geometry: WireframeGeometry;
    let filename: string;

    switch (view) {
      case 'top':
        geometry = drawing.topView;
        filename = `cabinet-${selectedWidth}in-top-view.svg`;
        break;
      case 'elevation':
        geometry = drawing.elevationView;
        filename = `cabinet-${selectedWidth}in-elevation.svg`;
        break;
      case '3d':
        geometry = drawing.isoView;
        filename = `cabinet-${selectedWidth}in-isometric.svg`;
        break;
    }

    const svg = exportToSVG(geometry);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-6 h-6" />
            Parametric Base Cabinet Wireframe System
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Full overlay base cabinets • 9"-36" (3" increments) • 24" deep • 30" high • 4.5" toe kick
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Cabinet Width</Label>
                <Select
                  value={selectedWidth.toString()}
                  onValueChange={(v) => setSelectedWidth(parseInt(v) as CabinetWidth)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableWidths().map((width) => (
                      <SelectItem key={width} value={width.toString()}>
                        {width}" Wide
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cabinet Function</Label>
                <Select
                  value={cabinetFunction}
                  onValueChange={(v) => setCabinetFunction(v as CabinetFunction)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Base</SelectItem>
                    <SelectItem value="sink-base">Sink Base</SelectItem>
                    <SelectItem value="drawer-base">Drawer Base</SelectItem>
                    <SelectItem value="trash-pullout">Trash Pullout</SelectItem>
                    <SelectItem value="spice-pullout">Spice Pullout</SelectItem>
                    <SelectItem value="lazy-susan">Lazy Susan</SelectItem>
                    <SelectItem value="corner-base">Corner Base</SelectItem>
                    <SelectItem value="blind-corner">Blind Corner</SelectItem>
                    <SelectItem value="tray-divider">Tray Divider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Drawer Configuration</Label>
                <Select
                  value={drawerConfig}
                  onValueChange={(v) => setDrawerConfig(v as DrawerConfiguration | 'none')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Drawers</SelectItem>
                    <SelectItem value="single-drawer">1 Drawer</SelectItem>
                    <SelectItem value="two-drawer">2 Drawers</SelectItem>
                    <SelectItem value="three-drawer">3 Drawers</SelectItem>
                    <SelectItem value="four-drawer">4 Drawers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Adjustable Shelves</Label>
                <Select
                  value={shelfCount.toString()}
                  onValueChange={(v) => setShelfCount(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Shelves</SelectItem>
                    <SelectItem value="1">1 Shelf</SelectItem>
                    <SelectItem value="2">2 Shelves</SelectItem>
                    <SelectItem value="3">3 Shelves</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Blum Hinge Type</Label>
                <Select
                  value={hingeType}
                  onValueChange={(v) => setHingeType(v as BlumHingeType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIP-top-BLUMOTION-110">CLIP-top 110° BLUMOTION</SelectItem>
                    <SelectItem value="CLIP-top-BLUMOTION-120">CLIP-top 120° BLUMOTION</SelectItem>
                    <SelectItem value="CLIP-top-BLUMOTION-155">CLIP-top 155° BLUMOTION</SelectItem>
                    <SelectItem value="CLIP-top-BLUMOTION-170">CLIP-top 170° BLUMOTION</SelectItem>
                    <SelectItem value="COMPACT-BLUMOTION-33">COMPACT 33 BLUMOTION</SelectItem>
                    <SelectItem value="COMPACT-BLUMOTION-38">COMPACT 38 BLUMOTION</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Blum Drawer Slide</Label>
                <Select
                  value={slideType}
                  onValueChange={(v) => setSlideType(v as BlumDrawerSlideType)}
                  disabled={drawerConfig === 'none' && !hasRollouts}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TANDEM-BLUMOTION">TANDEM BLUMOTION</SelectItem>
                    <SelectItem value="TANDEM-PLUS-BLUMOTION">TANDEM PLUS BLUMOTION</SelectItem>
                    <SelectItem value="MOVENTO">MOVENTO</SelectItem>
                    <SelectItem value="MOVENTO-TIP-ON">MOVENTO TIP-ON</SelectItem>
                    <SelectItem value="LEGRABOX">LEGRABOX</SelectItem>
                    <SelectItem value="METABOX">METABOX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Switch
                    id="has-rollouts"
                    checked={hasRollouts}
                    onCheckedChange={setHasRollouts}
                  />
                  Rollout Trays
                </Label>
                <Select
                  value={rolloutCount.toString()}
                  onValueChange={(v) => setRolloutCount(parseInt(v))}
                  disabled={!hasRollouts}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Rollout</SelectItem>
                    <SelectItem value="2">2 Rollouts</SelectItem>
                    <SelectItem value="3">3 Rollouts</SelectItem>
                    <SelectItem value="4">4 Rollouts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-internals"
                    checked={showInternals}
                    onCheckedChange={setShowInternals}
                  />
                  <Label htmlFor="show-internals">Show Internals</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadSVG(activeView)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </div>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="top" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Top View
              </TabsTrigger>
              <TabsTrigger value="elevation" className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Elevation
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                3D Iso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top" className="mt-6">
              <WireframeCanvas geometry={drawing.topView} />
            </TabsContent>

            <TabsContent value="elevation" className="mt-6">
              <WireframeCanvas geometry={drawing.elevationView} />
            </TabsContent>

            <TabsContent value="3d" className="mt-6">
              <WireframeCanvas geometry={drawing.isoView} />
            </TabsContent>
          </Tabs>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cabinet Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Overall Width:</div>
                    <div className="font-mono">{cabinet.dimensions.width}"</div>
                    
                    <div className="text-muted-foreground">Overall Depth:</div>
                    <div className="font-mono">{cabinet.dimensions.depth}"</div>
                    
                    <div className="text-muted-foreground">Box Height:</div>
                    <div className="font-mono">{cabinet.dimensions.height}"</div>
                    
                    <div className="text-muted-foreground">Total Height:</div>
                    <div className="font-mono font-bold">{cabinet.dimensions.totalHeight}"</div>
                    
                    <div className="text-muted-foreground">Toe Kick:</div>
                    <div className="font-mono">{cabinet.dimensions.toeKickHeight}" H × {cabinet.dimensions.toeKickDepth}" D</div>
                    
                    <div className="text-muted-foreground">Material:</div>
                    <div className="capitalize">{cabinet.material.thickness}" {cabinet.material.type}</div>
                    
                    <div className="text-muted-foreground">Function:</div>
                    <div className="capitalize">{cabinetFunction.replace('-', ' ')}</div>
                    
                    <div className="text-muted-foreground">Drawers:</div>
                    <div className="capitalize">{drawerConfig === 'none' ? 'None' : drawerConfig.replace('-', ' ')}</div>
                    
                    <div className="text-muted-foreground">Rollouts:</div>
                    <div className="font-mono">{hasRollouts ? `${rolloutCount} trays` : 'None'}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blum Hardware</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold mb-1">Hinges</div>
                      <div className="text-xs text-muted-foreground">
                        Model: {selectedHinge.model}<br/>
                        Opening: {selectedHinge.opening}°<br/>
                        BLUMOTION: {selectedHinge.hasBlumotion ? 'Yes' : 'No'}<br/>
                        Mounting Plate: {selectedHinge.mountingPlate}<br/>
                        Quantity: 2 per door
                      </div>
                    </div>
                    
                    {(drawerConfig !== 'none' || hasRollouts) && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Drawer Slides</div>
                        <div className="text-xs text-muted-foreground">
                          Type: {slideType.replace(/-/g, ' ')}<br/>
                          Extension: Full<br/>
                          BLUMOTION: Yes<br/>
                          Capacity: 30-70kg<br/>
                          {drawers && `Drawer Sets: ${drawers.length} pairs`}
                          {rollouts && `Rollout Sets: ${rollouts.length} pairs`}
                        </div>
                      </div>
                    )}
                    
                    {shelfCount > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Shelf System</div>
                        <div className="text-xs text-muted-foreground">
                          32mm System<br/>
                          Pins: {shelfCount * 4} pcs<br/>
                          Shelves: {shelfCount} adjustable
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Material Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">3/4" Plywood:</div>
                    <div className="font-mono font-bold">{materialUsage.plywood34} sq ft</div>
                    
                    <div className="text-muted-foreground">1/4" Plywood:</div>
                    <div className="font-mono">{materialUsage.plywood14} sq ft</div>
                    
                    <div className="text-muted-foreground">Edge Banding:</div>
                    <div className="font-mono">{materialUsage.edgeBanding} linear ft</div>
                    
                    {drawers && (
                      <>
                        <div className="text-muted-foreground col-span-2 border-t pt-2 mt-2">Drawer Materials:</div>
                        <div className="text-muted-foreground">Solid Wood:</div>
                        <div className="font-mono">{drawers.reduce((sum, d) => sum + (d.components.front.width * d.components.front.height / 144), 0).toFixed(1)} sq ft</div>
                      </>
                    )}
                    
                    <div className="text-muted-foreground col-span-2 border-t pt-2 mt-2">Component Count:</div>
                    <div className="text-muted-foreground">Total Parts:</div>
                    <div className="font-mono font-bold">{cutList.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cut List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">Part Name</th>
                      <th className="pb-2 font-semibold">Qty</th>
                      <th className="pb-2 font-semibold">Width</th>
                      <th className="pb-2 font-semibold">Height/Length</th>
                      <th className="pb-2 font-semibold">Thickness</th>
                      <th className="pb-2 font-semibold">Material</th>
                      <th className="pb-2 font-semibold">Edge Band</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cutList.map((component, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{component.name}</td>
                        <td className="py-2 font-mono">{component.quantity}</td>
                        <td className="py-2 font-mono">{component.width.toFixed(2)}"</td>
                        <td className="py-2 font-mono">{(component.height || component.depth || 0).toFixed(2)}"</td>
                        <td className="py-2 font-mono">{component.thickness}"</td>
                        <td className="py-2 capitalize">{component.material}</td>
                        <td className="py-2 text-xs">
                          {component.edgeBanding && (
                            <>
                              {component.edgeBanding.top && 'T '}
                              {component.edgeBanding.bottom && 'B '}
                              {component.edgeBanding.left && 'L '}
                              {component.edgeBanding.right && 'R '}
                              {component.edgeBanding.front && 'F '}
                              {component.edgeBanding.back && 'Bk'}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

function WireframeCanvas({ geometry }: { geometry: WireframeGeometry }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    const scale = 10;
    ctx.scale(scale, -scale);

    geometry.lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      
      ctx.strokeStyle = line.color || '#000000';
      ctx.lineWidth = (line.weight || 1) / 10;
      
      if (line.style === 'dashed') {
        ctx.setLineDash([0.2, 0.2]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.stroke();
    });

    ctx.restore();

    geometry.dimensions.forEach(dim => {
      const midX = width / 2 + ((dim.start.x + dim.end.x) / 2) * scale;
      const midY = height / 2 - ((dim.start.y + dim.end.y) / 2) * scale + (dim.offset || 0) * scale;
      
      ctx.fillStyle = '#0066cc';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(dim.label || '', midX, midY);
    });

    geometry.annotations.forEach(ann => {
      const x = width / 2 + ann.position.x * scale;
      const y = height / 2 - ann.position.y * scale;
      
      ctx.fillStyle = '#000000';
      ctx.font = `${ann.fontSize || 10}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(ann.text, x, y);
    });

  }, [geometry]);

  return (
    <div className="border rounded-lg bg-white p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto"
      />
    </div>
  );
}
