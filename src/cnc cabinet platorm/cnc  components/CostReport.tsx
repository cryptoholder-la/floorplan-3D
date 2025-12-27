import { useState } from 'react';
import { CostBreakdown, PricingConfig } from '@/lib/cabinetTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface CostReportProps {
  costBreakdown: CostBreakdown;
  pricing: PricingConfig;
  onUpdatePricing: (pricing: PricingConfig) => void;
}

export default function CostReport({ costBreakdown, pricing, onUpdatePricing }: CostReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Report</CardTitle>
        <CardDescription>Material and hardware cost breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold">Pricing Configuration</h3>
          
          <div className="space-y-2">
            <Label>Price per Square Meter (€)</Label>
            <Input
              type="number"
              value={pricing.pricePerSquareMeter}
              onChange={(e) => onUpdatePricing({ ...pricing, pricePerSquareMeter: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hinge Price (€)</Label>
              <Input
                type="number"
                value={pricing.hingePrice}
                onChange={(e) => onUpdatePricing({ ...pricing, hingePrice: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Handle Price (€)</Label>
              <Input
                type="number"
                value={pricing.handlePrice}
                onChange={(e) => onUpdatePricing({ ...pricing, handlePrice: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold">Cost Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Material Cost</span>
              <span className="font-medium">€{costBreakdown.materialCost.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="ml-4">• {costBreakdown.sheetCount} sheet{costBreakdown.sheetCount !== 1 ? 's' : ''}</span>
              <span>{costBreakdown.wastePercentage.toFixed(1)}% waste</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Hardware Cost</span>
              <span className="font-medium">€{costBreakdown.hardwareCost.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Cost</span>
              <span className="text-primary">€{costBreakdown.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Material Efficiency</div>
            <div className="text-xl font-bold">{(100 - costBreakdown.wastePercentage).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Cost per Sheet</div>
            <div className="text-xl font-bold">
              €{(costBreakdown.materialCost / costBreakdown.sheetCount).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}