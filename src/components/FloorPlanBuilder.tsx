"use client";

import { useEffect, useRef, useState } from 'react';
import { FloorPlan, ViewMode } from '@/lib/floorplan-types';
import { createDefaultFloorPlan, exportFloorPlan, importFloorPlan } from '@/lib/floorplan-utils';
import { ScaleProvider } from '@/contexts/ScaleContext';
import { SCALE_OPTIONS, ScaleOption, getAllScaleOptions } from '@/lib/unified-scale-utils';
import { HistoryManager } from '@/lib/history-manager';
import FloorPlan2DEditor from './FloorPlan2DEditor';
import FloorPlan3DViewer from './FloorPlan3DViewer';
import WallElevationView from './WallElevationView';
import CNCManufacturingPanel from './CNCManufacturingPanel';
import QuickAddCabinet from './QuickAddCabinet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Upload, Eye, PenTool, Trash2, Layers, Factory, Ruler, Undo2, Redo2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FloorPlanBuilder() {
  const [floorPlan, setFloorPlan] = useState<FloorPlan>(createDefaultFloorPlan());
  const [activeView, setActiveView] = useState<ViewMode>('2d');

  const historyRef = useRef<HistoryManager<FloorPlan> | null>(null);
  const isRestoringRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncHistoryFlags = () => {
    const h = historyRef.current;
    setCanUndo(Boolean(h?.canUndo()));
    setCanRedo(Boolean(h?.canRedo()));
  };

  useEffect(() => {
    if (!historyRef.current) {
      historyRef.current = new HistoryManager<FloorPlan>(50);
      historyRef.current.saveState(floorPlan);
      syncHistoryFlags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (!mod) return;

      // Ctrl/Cmd+Z => undo
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl/Cmd+Shift+Z or Ctrl+Y => redo
      if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUndo, canRedo, floorPlan]);

  const handleFloorPlanChange = (updatedFloorPlan: FloorPlan) => {
    const next = {
      ...updatedFloorPlan,
      metadata: {
        ...updatedFloorPlan.metadata!,
        updatedAt: new Date().toISOString(),
      },
    };

    setFloorPlan(next);

    if (!isRestoringRef.current) {
      historyRef.current?.saveState(next);
      syncHistoryFlags();
    }
  };

  const handleUndo = () => {
    if (!historyRef.current?.canUndo()) return;
    isRestoringRef.current = true;
    const prev = historyRef.current.undo();
    if (prev) {
      setFloorPlan(prev);
      toast.message('Undo');
    }
    isRestoringRef.current = false;
    syncHistoryFlags();
  };

  const handleRedo = () => {
    if (!historyRef.current?.canRedo()) return;
    isRestoringRef.current = true;
    const next = historyRef.current.redo();
    if (next) {
      setFloorPlan(next);
      toast.message('Redo');
    }
    isRestoringRef.current = false;
    syncHistoryFlags();
  };

  const handleScaleChange = (value: ScaleOption) => {
    setFloorPlan({
      ...floorPlan,
      metadata: {
        ...floorPlan.metadata!,
        scaleOption: value,
      },
    });
    toast.success(`Scale changed to ${SCALE_OPTIONS[value].label}`);
  };

  const handleExport = () => {
    const jsonString = exportFloorPlan(floorPlan);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${floorPlan.name.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Floor plan exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const importedFloorPlan = importFloorPlan(jsonString);
        setFloorPlan(importedFloorPlan);
        historyRef.current?.clear();
        historyRef.current?.saveState(importedFloorPlan);
        syncHistoryFlags();
        toast.success('Floor plan imported successfully!');
      } catch (error) {
        toast.error('Failed to import floor plan. Invalid file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the floor plan?')) {
      const next = createDefaultFloorPlan();
      setFloorPlan(next);
      historyRef.current?.clear();
      historyRef.current?.saveState(next);
      syncHistoryFlags();
      toast.success('Floor plan cleared');
    }
  };

  return (
    <ScaleProvider>
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        <Card className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Floor Plan Builder</h1>
                  <p className="text-muted-foreground mt-1">
                    Create 2D floor plans, edit wall elevations, and view in photo-realistic 3D
                  </p>
                </div>
                
                <div className="flex gap-2 flex-wrap items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-background">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="scale-select" className="text-sm whitespace-nowrap">Scale:</Label>
                    <Select 
                      value={floorPlan.metadata?.scaleOption} 
                      onValueChange={handleScaleChange}
                    >
                      <SelectTrigger id="scale-select" className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SCALE_OPTIONS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo}>
                    <Undo2 className="w-4 h-4 mr-2" />
                    Undo
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo}>
                    <Redo2 className="w-4 h-4 mr-2" />
                    Redo
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleClear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <QuickAddCabinet 
                floorPlan={floorPlan}
                onFloorPlanChange={handleFloorPlanChange}
              />
            </div>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewMode)} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6">
              <TabsTrigger value="2d" className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                2D Editor
              </TabsTrigger>
              <TabsTrigger value="elevation" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Elevation
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                3D View
              </TabsTrigger>
              <TabsTrigger value="manufacturing" className="flex items-center gap-2">
                <Factory className="w-4 h-4" />
                Manufacturing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="2d" className="mt-0">
              <FloorPlan2DEditor
                floorPlan={floorPlan}
                onFloorPlanChange={handleFloorPlanChange}
                width={800}
                height={600}
              />
            </TabsContent>

            <TabsContent value="elevation" className="mt-0">
              {floorPlan.walls.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/30">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No Walls Available</h3>
                  <p>Create walls in the 2D Editor first to view and edit wall elevations.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveView('2d')}
                  >
                    Go to 2D Editor
                  </Button>
                </div>
              ) : (
                <WallElevationView
                  floorPlan={floorPlan}
                  onFloorPlanChange={handleFloorPlanChange}
                  width={800}
                  height={400}
                />
              )}
            </TabsContent>

            <TabsContent value="3d" className="mt-0">
              <FloorPlan3DViewer
                floorPlan={floorPlan}
                width={800}
                height={600}
              />
            </TabsContent>

            <TabsContent value="manufacturing" className="mt-0">
              <CNCManufacturingPanel
                floorPlan={floorPlan}
                width={800}
                height={600}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Floor Plan Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Walls</p>
                <p className="text-2xl font-bold">{floorPlan.walls.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rooms</p>
                <p className="text-2xl font-bold">{floorPlan.rooms.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Doors</p>
                <p className="text-2xl font-bold">{floorPlan.doors.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Windows</p>
                <p className="text-2xl font-bold">{floorPlan.windows.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cabinets</p>
                <p className="text-2xl font-bold">{floorPlan.cabinets.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">3D Models</p>
                <p className="text-2xl font-bold">{floorPlan.models3D?.length || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Photos</p>
                <p className="text-2xl font-bold">{floorPlan.photos?.length || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Measurements</p>
                <p className="text-2xl font-bold">{floorPlan.measurements?.length || 0}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Scale: {floorPlan.metadata?.scale?.toFixed(2) || '20.00'} pixels per meter | 
                Unit: {floorPlan.metadata?.unit || 'meters'} | 
                Measurements: {floorPlan.metadata?.showMeasurements ? 'Visible' : 'Hidden'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      </ScaleProvider>
    );
  }
