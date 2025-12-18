"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FloorPlan } from '@/lib/floorplan-types';
import { Material, CabinetPart, ManufacturingJob } from '@/lib/cnc-types';
import { generateCabinetParts, generateToolpath, generateCutList } from '@/lib/cnc-toolpath-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Play, FileCode, Factory, Package, Clock, DollarSign, Grid3x3 } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'birch-ply-18',
    name: 'Birch Plywood 18mm',
    type: 'plywood',
    thickness: 18,
    width: 1220,
    length: 2440,
    color: '#E8D4B8',
    pricePerSheet: 85,
    grain: 'horizontal',
  },
  {
    id: 'mdf-18',
    name: 'MDF 18mm',
    type: 'mdf',
    thickness: 18,
    width: 1220,
    length: 2440,
    color: '#8B7355',
    pricePerSheet: 45,
    grain: 'none',
  },
  {
    id: 'melamine-16',
    name: 'White Melamine 16mm',
    type: 'melamine',
    thickness: 16,
    width: 1220,
    length: 2440,
    color: '#FFFFFF',
    pricePerSheet: 55,
    grain: 'none',
  },
  {
    id: 'oak-ply-18',
    name: 'Oak Plywood 18mm',
    type: 'hardwood',
    thickness: 18,
    width: 1220,
    length: 2440,
    color: '#C8A882',
    pricePerSheet: 120,
    grain: 'horizontal',
  },
];

interface Props {
  floorPlan: FloorPlan;
  width?: number;
  height?: number;
}

export default function CNCManufacturingPanel({ floorPlan, width = 800, height = 600 }: Props) {
  const router = useRouter();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(DEFAULT_MATERIALS[0].id);
  const [generatedParts, setGeneratedParts] = useState<CabinetPart[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedMaterial = useMemo(
    () => DEFAULT_MATERIALS.find((m) => m.id === selectedMaterialId)!,
    [selectedMaterialId]
  );

  const cutList = useMemo(() => {
    if (generatedParts.length === 0) return [];
    return generateCutList(generatedParts);
  }, [generatedParts]);

  const costEstimate = useMemo(() => {
    if (generatedParts.length === 0) return { sheets: 0, cost: 0, time: 0 };

    const totalArea = generatedParts.reduce((sum, part) => {
      return sum + (part.width * part.height * part.quantity);
    }, 0);

    const sheetArea = selectedMaterial.width * selectedMaterial.length;
    const sheetsNeeded = Math.ceil(totalArea / sheetArea);
    const cost = sheetsNeeded * selectedMaterial.pricePerSheet;

    const estimatedTime = generatedParts.reduce((sum, part) => {
      const toolpath = generateToolpath(part);
      return sum + toolpath.estimatedTime;
    }, 0);

    return { sheets: sheetsNeeded, cost, time: estimatedTime };
  }, [generatedParts, selectedMaterial]);

  const handleGenerateParts = () => {
    if (floorPlan.cabinets.length === 0) {
      toast.error('No cabinets to manufacture. Add cabinets in the 2D editor first.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const allParts: CabinetPart[] = [];
      
      for (const cabinet of floorPlan.cabinets) {
        const parts = generateCabinetParts(cabinet, selectedMaterial);
        allParts.push(...parts);
      }

      setGeneratedParts(allParts);
      setIsGenerating(false);
      toast.success(`Generated ${allParts.length} parts for ${floorPlan.cabinets.length} cabinets`);
    }, 500);
  };

  const handleExportGCode = () => {
    if (generatedParts.length === 0) {
      toast.error('Generate parts first before exporting G-code');
      return;
    }

    const allGCode: string[] = [];
    allGCode.push(`; CNC Manufacturing Job`);
    allGCode.push(`; Generated: ${new Date().toISOString()}`);
    allGCode.push(`; Total Parts: ${generatedParts.length}`);
    allGCode.push(`; Material: ${selectedMaterial.name}`);
    allGCode.push('');

    for (const part of generatedParts) {
      allGCode.push(`; ===== Part: ${part.name} =====`);
      const toolpath = generateToolpath(part);
      allGCode.push(toolpath.gcode);
      allGCode.push('');
    }

    const blob = new Blob([allGCode.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cnc-job-${Date.now()}.nc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('G-code exported successfully!');
  };

  const handleExportCutList = () => {
    if (cutList.length === 0) {
      toast.error('Generate parts first before exporting cut list');
      return;
    }

    const csv: string[] = [];
    csv.push('Part Name,Width (mm),Height (mm),Thickness (mm),Quantity,Material,Edge Banding');
    
    for (const item of cutList) {
      csv.push(
        `"${item.partName}",${item.width},${item.height},${item.thickness},${item.quantity},"${item.material}","${item.edgeBanding}"`
      );
    }

    csv.push('');
    csv.push(`Total Sheets Required,${costEstimate.sheets}`);
    csv.push(`Estimated Cost,$${costEstimate.cost.toFixed(2)}`);
    csv.push(`Estimated Time,${Math.ceil(costEstimate.time)} minutes`);

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cut-list-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Cut list exported successfully!');
  };

  const handleConfigureDrillPattern = (part: CabinetPart) => {
    router.push(`/drill-configurator?width=${part.width}&height=${part.height}&partId=${part.id}`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Factory className="w-6 h-6" />
              CNC Manufacturing
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Generate toolpaths, cut lists, and G-code for cabinet production
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Material Selection</label>
            <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_MATERIALS.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: material.color }}
                      />
                      {material.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sheet Size</label>
            <div className="text-sm p-3 bg-muted rounded-lg">
              {selectedMaterial.width} × {selectedMaterial.length} mm
              <div className="text-xs text-muted-foreground mt-1">
                ${selectedMaterial.pricePerSheet} per sheet
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Cabinets to Manufacture</label>
            <div className="text-sm p-3 bg-muted rounded-lg">
              <span className="text-2xl font-bold">{floorPlan.cabinets.length}</span>
              <div className="text-xs text-muted-foreground mt-1">
                {generatedParts.length} parts generated
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button onClick={handleGenerateParts} disabled={isGenerating || floorPlan.cabinets.length === 0}>
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Parts'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/drill-configurator')}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Configure Drill Patterns
          </Button>
          <Button
            variant="outline"
            onClick={handleExportGCode}
            disabled={generatedParts.length === 0}
          >
            <FileCode className="w-4 h-4 mr-2" />
            Export G-code
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCutList}
            disabled={cutList.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Cut List
          </Button>
        </div>

        {floorPlan.cabinets.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed rounded-lg">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Cabinets Found</h3>
            <p className="text-sm text-muted-foreground">
              Add cabinets in the 2D Editor to start manufacturing
            </p>
          </div>
        )}
      </Card>

      {generatedParts.length > 0 && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Estimate
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-sm text-muted-foreground mb-1">Sheets Required</div>
                <div className="text-3xl font-bold text-blue-600">{costEstimate.sheets}</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-sm text-muted-foreground mb-1">Material Cost</div>
                <div className="text-3xl font-bold text-green-600">${costEstimate.cost.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Machine Time
                </div>
                <div className="text-3xl font-bold text-orange-600">{Math.ceil(costEstimate.time)} min</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cut List</h3>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Name</TableHead>
                    <TableHead className="text-right">Width</TableHead>
                    <TableHead className="text-right">Height</TableHead>
                    <TableHead className="text-right">Thick</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Edge Banding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cutList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.partName}</TableCell>
                      <TableCell className="text-right">{item.width}mm</TableCell>
                      <TableCell className="text-right">{item.height}mm</TableCell>
                      <TableCell className="text-right">{item.thickness}mm</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{item.quantity}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.material}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.edgeBanding}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">All Parts ({generatedParts.length})</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {generatedParts.map((part) => (
                  <div
                    key={part.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{part.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {part.width} × {part.height} × {part.thickness}mm
                          {part.holes && part.holes.length > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {part.holes.length} holes
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{part.type}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfigureDrillPattern(part)}
                        >
                          <Grid3x3 className="w-4 h-4 mr-1" />
                          Drill Pattern
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
}