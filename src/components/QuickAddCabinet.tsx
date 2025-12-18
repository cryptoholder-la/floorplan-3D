"use client";

import { useState } from 'react';
import { FloorPlan, Cabinet } from '@/lib/floorplan-types';
import { createCabinet } from '@/lib/floorplan-utils';
import { 
  CABINET_TYPE_OPTIONS, 
  getCabinetSizesByType,
  CabinetTypeOption,
  CabinetSizeOption,
  generateCabinetByTypeAndSize,
} from '@/lib/cabinet-inventory';
import { CabinetType } from '@/types/cabinet.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface QuickAddCabinetProps {
  floorPlan: FloorPlan;
  onFloorPlanChange: (floorPlan: FloorPlan) => void;
}

export default function QuickAddCabinet({ floorPlan, onFloorPlanChange }: QuickAddCabinetProps) {
  const [selectedType, setSelectedType] = useState<CabinetType>('base');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeOptions, setSizeOptions] = useState<CabinetSizeOption[]>(getCabinetSizesByType('base'));

  const handleTypeChange = (type: CabinetType) => {
    setSelectedType(type);
    const sizes = getCabinetSizesByType(type);
    setSizeOptions(sizes);
    setSelectedSize(sizes[0]?.value || '');
  };

  const handleAddCabinet = () => {
    if (!selectedSize) {
      toast.error('Please select a cabinet size');
      return;
    }

    const inventoryItem = generateCabinetByTypeAndSize(selectedType, selectedSize);
    if (!inventoryItem) {
      toast.error('Invalid cabinet selection');
      return;
    }

    const scaleOption = floorPlan.metadata?.scaleOption || 'half';
    const centerX = 400;
    const centerY = 300;

    const newCabinet = createCabinet(
      selectedType,
      { x: centerX, y: centerY },
      0,
      scaleOption,
      {
        widthInches: inventoryItem.width,
        depthInches: inventoryItem.depth,
        heightInches: inventoryItem.height,
      }
    );

    onFloorPlanChange({
      ...floorPlan,
      cabinets: [...floorPlan.cabinets, newCabinet],
    });

    toast.success(`Added ${inventoryItem.label} to floor plan`);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 border rounded-lg bg-muted/30">
      <div className="space-y-1.5">
        <Label htmlFor="cabinet-type" className="text-xs font-medium">
          Cabinet Type
        </Label>
        <Select value={selectedType} onValueChange={(value) => handleTypeChange(value as CabinetType)}>
          <SelectTrigger id="cabinet-type" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CABINET_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cabinet-size" className="text-xs font-medium">
          Size
        </Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger id="cabinet-size" className="w-48">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleAddCabinet} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add to Floor Plan
      </Button>
    </div>
  );
}
