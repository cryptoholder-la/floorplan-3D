"use client";

import { useState } from 'react';
import { CabinetDesign, MaterialType } from '@/lib/cabinet-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  DollarSign, 
  Package,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface PricingConfig {
  pricePerSquareMeter: number;
  hingePrice: number;
  handlePrice: number;
  shelfPinPrice: number;
  laborRatePerHour: number;
}

interface CostBreakdown {
  materialCost: number;
  hardwareCost: number;
  laborCost: number;
  totalCost: number;
  surfaceArea: number;
}

interface CostReportProps {
  design: CabinetDesign;
  onPricingChange?: (pricing: PricingConfig) => void;
}

const MATERIAL_PRICES: Record<MaterialType, number> = {
  'plywood': 25.50,
  'mdf': 18.75,
  'particle-board': 12.25
};

export default function CostReport({ design, onPricingChange }: CostReportProps) {
  const [pricing, setPricing] = useState<PricingConfig>({
    pricePerSquareMeter: 25.50,
    hingePrice: 12.99,
    handlePrice: 8.50,
    shelfPinPrice: 0.50,
    laborRatePerHour: 45.00
  });

  const calculateCostBreakdown = (): CostBreakdown => {
    const { dimensions } = design;
    const { width, height, depth, thickness } = dimensions;
    
    // Calculate surface area in square meters
    const surfaceArea = ((width * height) + (width * depth) + (height * depth) * 2) / 1000000; // Convert mm² to m²
    
    // Material cost
    const materialCost = surfaceArea * pricing.pricePerSquareMeter;
    
    // Hardware cost
    const hingeCost = design.doorCount * pricing.hingePrice;
    const handleCost = design.doorCount * pricing.handlePrice;
    const shelfPinCost = design.shelfCount * 4 * pricing.shelfPinPrice; // 4 pins per shelf
    const hardwareCost = hingeCost + handleCost + shelfPinCost;
    
    // Labor cost (estimated 2 hours for assembly)
    const laborCost = pricing.laborRatePerHour * 2;
    
    const totalCost = materialCost + hardwareCost + laborCost;
    
    return {
      materialCost,
      hardwareCost,
      laborCost,
      totalCost,
      surfaceArea
    };
  };

  const costBreakdown = calculateCostBreakdown();

  const handlePricingUpdate = (updates: Partial<PricingConfig>) => {
    const newPricing = { ...pricing, ...updates };
    setPricing(newPricing);
    onPricingChange?.(newPricing);
    toast.success('Pricing updated');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Cost Report
        </CardTitle>
        <CardDescription>
          Material and hardware cost breakdown for cabinet design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-green-600">Material Cost</p>
              <p className="text-2xl font-bold text-green-700">
                €{costBreakdown.materialCost.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-blue-600">Hardware Cost</p>
              <p className="text-2xl font-bold text-blue-700">
                €{costBreakdown.hardwareCost.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-purple-600">Total Cost</p>
              <p className="text-2xl font-bold text-purple-700">
                €{costBreakdown.totalCost.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold">Cost Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Surface Area:</span>
                <span>{costBreakdown.surfaceArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="capitalize">{design.material}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span>€{pricing.pricePerSquareMeter}/m²</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Doors:</span>
                <span>{design.doorCount} × €{pricing.hingePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Handles:</span>
                <span>{design.doorCount} × €{pricing.handlePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shelf Pins:</span>
                <span>{design.shelfCount * 4} × €{pricing.shelfPinPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor:</span>
                <span>2h × €{pricing.laborRatePerHour}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold">Pricing Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Price per Square Meter (€)</Label>
                <Input
                  type="number"
                  value={pricing.pricePerSquareMeter}
                  onChange={(e) => handlePricingUpdate({ pricePerSquareMeter: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>Labor Rate (€/hour)</Label>
                <Input
                  type="number"
                  value={pricing.laborRatePerHour}
                  onChange={(e) => handlePricingUpdate({ laborRatePerHour: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hinge Price (€)</Label>
                <Input
                  type="number"
                  value={pricing.hingePrice}
                  onChange={(e) => handlePricingUpdate({ hingePrice: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>Handle Price (€)</Label>
                <Input
                  type="number"
                  value={pricing.handlePrice}
                  onChange={(e) => handlePricingUpdate({ handlePrice: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>Shelf Pin Price (€)</Label>
                <Input
                  type="number"
                  value={pricing.shelfPinPrice}
                  onChange={(e) => handlePricingUpdate({ shelfPinPrice: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cabinet Specifications */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold mb-3">Cabinet Specifications</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dimensions</p>
              <p className="font-semibold">
                {design.dimensions.width}×{design.dimensions.height}×{design.dimensions.depth}mm
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Style</p>
              <p className="font-semibold capitalize">{design.style}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doors</p>
              <p className="font-semibold">{design.doorCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Shelves</p>
              <p className="font-semibold">{design.shelfCount}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => toast.success('Cost report exported!')}>
            <Calculator className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => toast.success('Order placed!')}>
            <Package className="w-4 h-4 mr-2" />
            Place Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
