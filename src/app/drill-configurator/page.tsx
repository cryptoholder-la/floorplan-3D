"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, FlipHorizontal, FlipVertical, Grid3x3, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/lib/cnc-types';
import {
  generateGridPattern,
  generateLinearPattern,
  generateCircularPattern,
  mirrorPatternHorizontal,
  mirrorPatternVertical,
  validatePattern,
} from '@/lib/drill-pattern-generator';

export default function DrillConfiguratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [partWidth, setPartWidth] = useState(600);
  const [partHeight, setPartHeight] = useState(800);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  const [gridRows, setGridRows] = useState(8);
  const [gridColumns, setGridColumns] = useState(2);
  const [gridSpacingX, setGridSpacingX] = useState(100);
  const [gridSpacingY, setGridSpacingY] = useState(32);
  const [gridStartX, setGridStartX] = useState(37);
  const [gridStartY, setGridStartY] = useState(100);

  const [linearCount, setLinearCount] = useState(10);
  const [linearSpacing, setLinearSpacing] = useState(32);
  const [linearStartX, setLinearStartX] = useState(50);
  const [linearStartY, setLinearStartY] = useState(100);
  const [linearDirection, setLinearDirection] = useState<'horizontal' | 'vertical'>('vertical');

  const [circularCount, setCircularCount] = useState(8);
  const [circularRadius, setCircularRadius] = useState(150);
  const [circularCenterX, setCircularCenterX] = useState(300);
  const [circularCenterY, setCircularCenterY] = useState(400);
  const [circularStartAngle, setCircularStartAngle] = useState(0);

  const [holeDiameter, setHoleDiameter] = useState(5);
  const [holeDepth, setHoleDepth] = useState(12);
  const [holeType, setHoleType] = useState<'through' | 'blind' | 'countersink'>('blind');

  useEffect(() => {
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    if (width) setPartWidth(Number(width));
    if (height) setPartHeight(Number(height));
  }, [searchParams]);

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId);

  const handleCreateGridPattern = () => {
    const pattern = generateGridPattern(
      `Grid ${patterns.length + 1}`,
      gridRows,
      gridColumns,
      gridSpacingX,
      gridSpacingY,
      gridStartX,
      gridStartY,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created grid pattern with ${pattern.holes.length} holes`);
  };

  const handleCreateLinearPattern = () => {
    const pattern = generateLinearPattern(
      `Linear ${patterns.length + 1}`,
      linearCount,
      linearSpacing,
      linearStartX,
      linearStartY,
      linearDirection,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created linear pattern with ${pattern.holes.length} holes`);
  };

  const handleCreateCircularPattern = () => {
    const pattern = generateCircularPattern(
      `Circular ${patterns.length + 1}`,
      circularCount,
      circularRadius,
      circularCenterX,
      circularCenterY,
      circularStartAngle,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created circular pattern with ${pattern.holes.length} holes`);
  };

  const handleDeletePattern = (patternId: string) => {
    setPatterns(patterns.filter((p) => p.id !== patternId));
    if (selectedPatternId === patternId) {
      setSelectedPatternId(null);
    }
    toast.success('Pattern deleted');
  };

  const handleDuplicatePattern = (pattern: DrillPattern) => {
    const newPattern = {
      ...pattern,
      id: `${pattern.type}-${Date.now()}`,
      name: `${pattern.name} (Copy)`,
    };
    setPatterns([...patterns, newPattern]);
    setSelectedPatternId(newPattern.id);
    toast.success('Pattern duplicated');
  };

  const handleMirrorHorizontal = () => {
    if (!selectedPattern) return;
    const mirrored = mirrorPatternHorizontal(selectedPattern, partWidth / 2);
    setPatterns(patterns.map((p) => (p.id === selectedPattern.id ? mirrored : p)));
    toast.success('Pattern mirrored horizontally');
  };

  const handleMirrorVertical = () => {
    if (!selectedPattern) return;
    const mirrored = mirrorPatternVertical(selectedPattern, partHeight / 2);
    setPatterns(patterns.map((p) => (p.id === selectedPattern.id ? mirrored : p)));
    toast.success('Pattern mirrored vertically');
  };

  const handleExportPattern = () => {
    if (patterns.length === 0) {
      toast.error('No patterns to export');
      return;
    }

    const data = {
      partWidth,
      partHeight,
      patterns,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drill-pattern-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Pattern exported successfully');
  };

  const handleSaveAndReturn = () => {
    if (patterns.length === 0) {
      toast.error('Create at least one pattern before saving');
      return;
    }

    localStorage.setItem(
      'drillPatterns',
      JSON.stringify({
        partWidth,
        partHeight,
        patterns,
        timestamp: Date.now(),
      })
    );

    toast.success('Patterns saved!');
    router.push('/');
  };

  const allHoles = patterns.flatMap((p) => p.holes);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto p-5 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid3x3 className="w-8 h-8" />
              Drill Pattern Configurator
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#90a7cb] mt-1">
              Design precise drilling patterns for cabinet parts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPattern}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSaveAndReturn}>
              <Save className="w-4 h-4 mr-2" />
              Save & Return
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Part Preview</h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {partWidth} × {partHeight} mm
                  </Badge>
                  <Badge variant="secondary">{allHoles.length} holes total</Badge>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto">
                <svg
                  width={partWidth * previewScale}
                  height={partHeight * previewScale}
                  className="border-2 border-white/20 bg-amber-100/10"
                >
                  <rect
                    x={0}
                    y={0}
                    width={partWidth * previewScale}
                    height={partHeight * previewScale}
                    fill="#E8D4B8"
                    opacity={0.3}
                  />

                  {patterns.map((pattern) => (
                    <g key={pattern.id}>
                      {pattern.holes.map((hole, hIndex) => (
                        <g key={hole.id}>
                          <circle
                            cx={hole.x * previewScale}
                            cy={hole.y * previewScale}
                            r={(hole.diameter / 2) * previewScale}
                            fill={
                              hole.type === 'through'
                                ? '#ef4444'
                                : hole.type === 'countersink'
                                ? '#f59e0b'
                                : '#3b82f6'
                            }
                            opacity={0.6}
                            stroke="white"
                            strokeWidth={1}
                          />
                          <text
                            x={hole.x * previewScale}
                            y={hole.y * previewScale}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={10}
                            fill="white"
                            fontWeight="bold"
                          >
                            {hIndex + 1}
                          </text>
                        </g>
                      ))}
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Label>Scale:</Label>
                <Input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={previewScale}
                  onChange={(e) => setPreviewScale(Number(e.target.value))}
                  className="w-48"
                />
                <span className="text-sm">{(previewScale * 100).toFixed(0)}%</span>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Part Dimensions</h3>
              <div className="space-y-3">
                <div>
                  <Label>Width (mm)</Label>
                  <Input type="number" value={partWidth} onChange={(e) => setPartWidth(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Height (mm)</Label>
                  <Input type="number" value={partHeight} onChange={(e) => setPartHeight(Number(e.target.value))} />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Hole Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label>Diameter (mm)</Label>
                  <Input type="number" value={holeDiameter} onChange={(e) => setHoleDiameter(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Depth (mm)</Label>
                  <Input type="number" value={holeDepth} onChange={(e) => setHoleDepth(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={holeType} onValueChange={(v: any) => setHoleType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blind">Blind</SelectItem>
                      <SelectItem value="through">Through</SelectItem>
                      <SelectItem value="countersink">Countersink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {selectedPattern && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Selected Pattern</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white">{selectedPattern.name}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">{selectedPattern.holes.length} holes</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleMirrorHorizontal} className="flex-1">
                      <FlipHorizontal className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleMirrorVertical} className="flex-1">
                      <FlipVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Create Pattern</h3>
            <Tabs defaultValue="grid">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="linear">Linear</TabsTrigger>
                <TabsTrigger value="circular">Circular</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Rows</Label>
                    <Input type="number" value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Columns</Label>
                    <Input type="number" value={gridColumns} onChange={(e) => setGridColumns(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing X</Label>
                    <Input type="number" value={gridSpacingX} onChange={(e) => setGridSpacingX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing Y</Label>
                    <Input type="number" value={gridSpacingY} onChange={(e) => setGridSpacingY(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start X</Label>
                    <Input type="number" value={gridStartX} onChange={(e) => setGridStartX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start Y</Label>
                    <Input type="number" value={gridStartY} onChange={(e) => setGridStartY(Number(e.target.value))} />
                  </div>
                </div>
                <Button onClick={handleCreateGridPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Grid Pattern
                </Button>
              </TabsContent>

              <TabsContent value="linear" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Count</Label>
                    <Input type="number" value={linearCount} onChange={(e) => setLinearCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing</Label>
                    <Input type="number" value={linearSpacing} onChange={(e) => setLinearSpacing(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start X</Label>
                    <Input type="number" value={linearStartX} onChange={(e) => setLinearStartX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start Y</Label>
                    <Input type="number" value={linearStartY} onChange={(e) => setLinearStartY(Number(e.target.value))} />
                  </div>
                  <div className="col-span-2">
                    <Label>Direction</Label>
                    <Select value={linearDirection} onValueChange={(v: any) => setLinearDirection(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateLinearPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Linear Pattern
                </Button>
              </TabsContent>

              <TabsContent value="circular" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Count</Label>
                    <Input type="number" value={circularCount} onChange={(e) => setCircularCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Radius</Label>
                    <Input type="number" value={circularRadius} onChange={(e) => setCircularRadius(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Center X</Label>
                    <Input
                      type="number"
                      value={circularCenterX}
                      onChange={(e) => setCircularCenterX(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Center Y</Label>
                    <Input
                      type="number"
                      value={circularCenterY}
                      onChange={(e) => setCircularCenterY(Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Start Angle (radians)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={circularStartAngle}
                      onChange={(e) => setCircularStartAngle(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCircularPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Circular Pattern
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Patterns ({patterns.length})</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPatternId === pattern.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-slate-50 dark:bg-[#151c28] border-slate-200 dark:border-white/10 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPatternId(pattern.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{pattern.name}</div>
                        <div className="text-sm text-slate-500 dark:text-[#90a7cb]">
                          {pattern.type} • {pattern.holes.length} holes
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePattern(pattern);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePattern(pattern.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {patterns.length === 0 && (
                  <div className="text-center py-12 text-slate-500 dark:text-[#90a7cb]">
                    <Grid3x3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No patterns created yet</p>
                    <p className="text-sm">Create a pattern to get started</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, FlipHorizontal, FlipVertical, Grid3x3, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DrillPattern } from '@/lib/cnc-types';
import {
  generateGridPattern,
  generateLinearPattern,
  generateCircularPattern,
  mirrorPatternHorizontal,
  mirrorPatternVertical,
  validatePattern,
} from '@/lib/drill-pattern-generator';

export default function DrillConfiguratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [partWidth, setPartWidth] = useState(600);
  const [partHeight, setPartHeight] = useState(800);
  const [patterns, setPatterns] = useState<DrillPattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  const [gridRows, setGridRows] = useState(8);
  const [gridColumns, setGridColumns] = useState(2);
  const [gridSpacingX, setGridSpacingX] = useState(100);
  const [gridSpacingY, setGridSpacingY] = useState(32);
  const [gridStartX, setGridStartX] = useState(37);
  const [gridStartY, setGridStartY] = useState(100);

  const [linearCount, setLinearCount] = useState(10);
  const [linearSpacing, setLinearSpacing] = useState(32);
  const [linearStartX, setLinearStartX] = useState(50);
  const [linearStartY, setLinearStartY] = useState(100);
  const [linearDirection, setLinearDirection] = useState<'horizontal' | 'vertical'>('vertical');

  const [circularCount, setCircularCount] = useState(8);
  const [circularRadius, setCircularRadius] = useState(150);
  const [circularCenterX, setCircularCenterX] = useState(300);
  const [circularCenterY, setCircularCenterY] = useState(400);
  const [circularStartAngle, setCircularStartAngle] = useState(0);

  const [holeDiameter, setHoleDiameter] = useState(5);
  const [holeDepth, setHoleDepth] = useState(12);
  const [holeType, setHoleType] = useState<'through' | 'blind' | 'countersink'>('blind');

  useEffect(() => {
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    if (width) setPartWidth(Number(width));
    if (height) setPartHeight(Number(height));
  }, [searchParams]);

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId);

  const handleCreateGridPattern = () => {
    const pattern = generateGridPattern(
      `Grid ${patterns.length + 1}`,
      gridRows,
      gridColumns,
      gridSpacingX,
      gridSpacingY,
      gridStartX,
      gridStartY,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created grid pattern with ${pattern.holes.length} holes`);
  };

  const handleCreateLinearPattern = () => {
    const pattern = generateLinearPattern(
      `Linear ${patterns.length + 1}`,
      linearCount,
      linearSpacing,
      linearStartX,
      linearStartY,
      linearDirection,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created linear pattern with ${pattern.holes.length} holes`);
  };

  const handleCreateCircularPattern = () => {
    const pattern = generateCircularPattern(
      `Circular ${patterns.length + 1}`,
      circularCount,
      circularRadius,
      circularCenterX,
      circularCenterY,
      circularStartAngle,
      holeDiameter,
      holeDepth,
      holeType
    );

    const validation = validatePattern(pattern, partWidth, partHeight);
    if (!validation.valid) {
      toast.error(`Invalid pattern: ${validation.errors[0]}`);
      return;
    }

    setPatterns([...patterns, pattern]);
    setSelectedPatternId(pattern.id);
    toast.success(`Created circular pattern with ${pattern.holes.length} holes`);
  };

  const handleDeletePattern = (patternId: string) => {
    setPatterns(patterns.filter((p) => p.id !== patternId));
    if (selectedPatternId === patternId) {
      setSelectedPatternId(null);
    }
    toast.success('Pattern deleted');
  };

  const handleDuplicatePattern = (pattern: DrillPattern) => {
    const newPattern = {
      ...pattern,
      id: `${pattern.type}-${Date.now()}`,
      name: `${pattern.name} (Copy)`,
    };
    setPatterns([...patterns, newPattern]);
    setSelectedPatternId(newPattern.id);
    toast.success('Pattern duplicated');
  };

  const handleMirrorHorizontal = () => {
    if (!selectedPattern) return;
    const mirrored = mirrorPatternHorizontal(selectedPattern, partWidth / 2);
    setPatterns(patterns.map((p) => (p.id === selectedPattern.id ? mirrored : p)));
    toast.success('Pattern mirrored horizontally');
  };

  const handleMirrorVertical = () => {
    if (!selectedPattern) return;
    const mirrored = mirrorPatternVertical(selectedPattern, partHeight / 2);
    setPatterns(patterns.map((p) => (p.id === selectedPattern.id ? mirrored : p)));
    toast.success('Pattern mirrored vertically');
  };

  const handleExportPattern = () => {
    if (patterns.length === 0) {
      toast.error('No patterns to export');
      return;
    }

    const data = {
      partWidth,
      partHeight,
      patterns,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drill-pattern-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Pattern exported successfully');
  };

  const handleSaveAndReturn = () => {
    if (patterns.length === 0) {
      toast.error('Create at least one pattern before saving');
      return;
    }

    localStorage.setItem(
      'drillPatterns',
      JSON.stringify({
        partWidth,
        partHeight,
        patterns,
        timestamp: Date.now(),
      })
    );

    toast.success('Patterns saved!');
    router.push('/');
  };

  const allHoles = patterns.flatMap((p) => p.holes);

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Navigation />
        <div className="max-w-7xl mx-auto p-5 pt-20 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid3x3 className="w-8 h-8" />
              Drill Pattern Configurator
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#90a7cb] mt-1">
              Design precise drilling patterns for cabinet parts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPattern}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSaveAndReturn}>
              <Save className="w-4 h-4 mr-2" />
              Save & Return
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Part Preview</h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {partWidth} × {partHeight} mm
                  </Badge>
                  <Badge variant="secondary">{allHoles.length} holes total</Badge>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151c28] rounded-2xl p-8 border border-slate-200 dark:border-white/10 overflow-auto">
                <svg
                  width={partWidth * previewScale}
                  height={partHeight * previewScale}
                  className="border-2 border-white/20 bg-amber-100/10"
                >
                  <rect
                    x={0}
                    y={0}
                    width={partWidth * previewScale}
                    height={partHeight * previewScale}
                    fill="#E8D4B8"
                    opacity={0.3}
                  />

                  {patterns.map((pattern) => (
                    <g key={pattern.id}>
                      {pattern.holes.map((hole, hIndex) => (
                        <g key={hole.id}>
                          <circle
                            cx={hole.x * previewScale}
                            cy={hole.y * previewScale}
                            r={(hole.diameter / 2) * previewScale}
                            fill={
                              hole.type === 'through'
                                ? '#ef4444'
                                : hole.type === 'countersink'
                                ? '#f59e0b'
                                : '#3b82f6'
                            }
                            opacity={0.6}
                            stroke="white"
                            strokeWidth={1}
                          />
                          <text
                            x={hole.x * previewScale}
                            y={hole.y * previewScale}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={10}
                            fill="white"
                            fontWeight="bold"
                          >
                            {hIndex + 1}
                          </text>
                        </g>
                      ))}
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Label>Scale:</Label>
                <Input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={previewScale}
                  onChange={(e) => setPreviewScale(Number(e.target.value))}
                  className="w-48"
                />
                <span className="text-sm">{(previewScale * 100).toFixed(0)}%</span>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Part Dimensions</h3>
              <div className="space-y-3">
                <div>
                  <Label>Width (mm)</Label>
                  <Input type="number" value={partWidth} onChange={(e) => setPartWidth(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Height (mm)</Label>
                  <Input type="number" value={partHeight} onChange={(e) => setPartHeight(Number(e.target.value))} />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Hole Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label>Diameter (mm)</Label>
                  <Input type="number" value={holeDiameter} onChange={(e) => setHoleDiameter(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Depth (mm)</Label>
                  <Input type="number" value={holeDepth} onChange={(e) => setHoleDepth(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={holeType} onValueChange={(v: any) => setHoleType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blind">Blind</SelectItem>
                      <SelectItem value="through">Through</SelectItem>
                      <SelectItem value="countersink">Countersink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {selectedPattern && (
              <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Selected Pattern</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-[#151c28] rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white">{selectedPattern.name}</div>
                    <div className="text-sm text-slate-500 dark:text-[#90a7cb]">{selectedPattern.holes.length} holes</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleMirrorHorizontal} className="flex-1">
                      <FlipHorizontal className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleMirrorVertical} className="flex-1">
                      <FlipVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Create Pattern</h3>
            <Tabs defaultValue="grid">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="linear">Linear</TabsTrigger>
                <TabsTrigger value="circular">Circular</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Rows</Label>
                    <Input type="number" value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Columns</Label>
                    <Input type="number" value={gridColumns} onChange={(e) => setGridColumns(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing X</Label>
                    <Input type="number" value={gridSpacingX} onChange={(e) => setGridSpacingX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing Y</Label>
                    <Input type="number" value={gridSpacingY} onChange={(e) => setGridSpacingY(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start X</Label>
                    <Input type="number" value={gridStartX} onChange={(e) => setGridStartX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start Y</Label>
                    <Input type="number" value={gridStartY} onChange={(e) => setGridStartY(Number(e.target.value))} />
                  </div>
                </div>
                <Button onClick={handleCreateGridPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Grid Pattern
                </Button>
              </TabsContent>

              <TabsContent value="linear" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Count</Label>
                    <Input type="number" value={linearCount} onChange={(e) => setLinearCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Spacing</Label>
                    <Input type="number" value={linearSpacing} onChange={(e) => setLinearSpacing(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start X</Label>
                    <Input type="number" value={linearStartX} onChange={(e) => setLinearStartX(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Start Y</Label>
                    <Input type="number" value={linearStartY} onChange={(e) => setLinearStartY(Number(e.target.value))} />
                  </div>
                  <div className="col-span-2">
                    <Label>Direction</Label>
                    <Select value={linearDirection} onValueChange={(v: any) => setLinearDirection(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateLinearPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Linear Pattern
                </Button>
              </TabsContent>

              <TabsContent value="circular" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Count</Label>
                    <Input type="number" value={circularCount} onChange={(e) => setCircularCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Radius</Label>
                    <Input type="number" value={circularRadius} onChange={(e) => setCircularRadius(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Center X</Label>
                    <Input
                      type="number"
                      value={circularCenterX}
                      onChange={(e) => setCircularCenterX(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Center Y</Label>
                    <Input
                      type="number"
                      value={circularCenterY}
                      onChange={(e) => setCircularCenterY(Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Start Angle (radians)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={circularStartAngle}
                      onChange={(e) => setCircularStartAngle(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCircularPattern} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Circular Pattern
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Patterns ({patterns.length})</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPatternId === pattern.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-slate-50 dark:bg-[#151c28] border-slate-200 dark:border-white/10 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPatternId(pattern.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{pattern.name}</div>
                        <div className="text-sm text-slate-500 dark:text-[#90a7cb]">
                          {pattern.type} • {pattern.holes.length} holes
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePattern(pattern);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePattern(pattern.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {patterns.length === 0 && (
                  <div className="text-center py-12 text-slate-500 dark:text-[#90a7cb]">
                    <Grid3x3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No patterns created yet</p>
                    <p className="text-sm">Create a pattern to get started</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
