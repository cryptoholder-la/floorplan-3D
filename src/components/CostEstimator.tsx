import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, Clock, Package } from 'lucide-react';

interface CutlistItem {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: string;
}

interface CostEstimatorProps {
  cutlist: CutlistItem[];
  estimatedTime: number;
  onCostUpdate: (data: any) => void;
}

export default function CostEstimator({ 
  cutlist, 
  estimatedTime, 
  onCostUpdate 
}: CostEstimatorProps) {
  const [materialCosts, setMaterialCosts] = useState({
    'Plywood': 35,
    'Hardwood': 45,
    'MDF': 25,
    'Particle Board': 20
  });

  const [laborRate, setLaborRate] = useState(50);
  const [overheadRate, setOverheadRate] = useState(15);

  const calculateMaterialCost = () => {
    return cutlist.reduce((total, item) => {
      const area = (item.width * item.height) / 10000; // Convert to square meters
      const costPerUnit = materialCosts[item.material] || 30;
      return total + (area * costPerUnit * item.quantity);
    }, 0);
  };

  const calculateLaborCost = () => {
    return estimatedTime * laborRate;
  };

  const calculateOverheadCost = () => {
    return (calculateMaterialCost() + calculateLaborCost()) * (overheadRate / 100);
  };

  const calculateTotalCost = () => {
    return calculateMaterialCost() + calculateLaborCost() + calculateOverheadCost();
  };

  useEffect(() => {
    const costData = {
      materialCost: calculateMaterialCost(),
      laborCost: calculateLaborCost(),
      overheadCost: calculateOverheadCost(),
      totalCost: calculateTotalCost(),
      breakdown: {
        materials: cutlist.map(item => ({
          ...item,
          cost: ((item.width * item.height) / 10000) * (materialCosts[item.material] || 30) * item.quantity
        }))
      }
    };
    onCostUpdate(costData);
  }, [cutlist, materialCosts, laborRate, overheadRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Cost</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateMaterialCost().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Cost</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateLaborCost().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${calculateTotalCost().toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Labor Rate ($/hour)</label>
              <input
                type="number"
                value={laborRate}
                onChange={(e) => setLaborRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Overhead Rate (%)</label>
              <input
                type="number"
                value={overheadRate}
                onChange={(e) => setOverheadRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Material Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(materialCosts).map(([material, cost]) => (
              <div key={material} className="flex items-center justify-between">
                <label className="text-sm font-medium">{material}</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setMaterialCosts(prev => ({
                    ...prev,
                    [material]: Number(e.target.value)
                  }))}
                  className="w-20 px-2 py-1 border rounded-md text-sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
