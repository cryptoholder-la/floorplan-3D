'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Ruler, 
  Settings,
  Box,
  Download,
  Eye
} from 'lucide-react';

interface CabinetDetails {
  id: string;
  name: string;
  type: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  finish: string;
  doorStyle: string;
  price: number;
  weight: number;
  manufacturer: string;
  inStock: boolean;
}

interface SimpleCabinetDetailsProps {
  cabinetId?: string;
  className?: string;
}

export default function SimpleCabinetDetails({ cabinetId, className = "" }: SimpleCabinetDetailsProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'specifications' | 'pricing'>('overview');

  // Mock cabinet details - in real app this would be fetched based on cabinetId
  const cabinetDetails: CabinetDetails = {
    id: cabinetId || '1',
    name: 'Base Cabinet 24"',
    type: 'base',
    dimensions: { width: 600, height: 720, depth: 560 },
    material: 'Plywood',
    finish: 'Maple',
    doorStyle: 'Shaker',
    price: 245.00,
    weight: 45.5,
    manufacturer: 'Mid Continent',
    inStock: true
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {cabinetDetails.name} - Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* View Tabs */}
            <div className="flex gap-2">
              <Button
                variant={selectedView === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('overview')}
              >
                Overview
              </Button>
              <Button
                variant={selectedView === 'specifications' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('specifications')}
              >
                Specifications
              </Button>
              <Button
                variant={selectedView === 'pricing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('pricing')}
              >
                Pricing
              </Button>
            </div>

            {/* Overview View */}
            {selectedView === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">{cabinetDetails.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{cabinetDetails.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock Status:</span>
                        <Badge variant={cabinetDetails.inStock ? 'default' : 'destructive'}>
                          {cabinetDetails.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{cabinetDetails.weight} kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Appearance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{cabinetDetails.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Finish:</span>
                        <span className="font-medium">{cabinetDetails.finish}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Door Style:</span>
                        <span className="font-medium">{cabinetDetails.doorStyle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <Box className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600">Cabinet Preview</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications View */}
            {selectedView === 'specifications' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Dimensions & Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4" />
                      <span className="font-medium">Width</span>
                    </div>
                    <p className="text-2xl font-bold">{cabinetDetails.dimensions.width}mm</p>
                    <p className="text-sm text-muted-foreground">({cabinetDetails.dimensions.width / 25.4} inches)</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4" />
                      <span className="font-medium">Height</span>
                    </div>
                    <p className="text-2xl font-bold">{cabinetDetails.dimensions.height}mm</p>
                    <p className="text-sm text-muted-foreground">({cabinetDetails.dimensions.height / 25.4} inches)</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4" />
                      <span className="font-medium">Depth</span>
                    </div>
                    <p className="text-2xl font-bold">{cabinetDetails.dimensions.depth}mm</p>
                    <p className="text-sm text-muted-foreground">({cabinetDetails.dimensions.depth / 25.4} inches)</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium mb-2">Volume</h5>
                  <p className="text-lg font-semibold">
                    {(cabinetDetails.dimensions.width * cabinetDetails.dimensions.height * cabinetDetails.dimensions.depth / 1000000000).toFixed(3)} m³
                  </p>
                </div>
              </div>
            )}

            {/* Pricing View */}
            {selectedView === 'pricing' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Pricing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h5 className="font-medium mb-4">Base Price</h5>
                    <p className="text-3xl font-bold text-green-600">${cabinetDetails.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-2">Standard configuration</p>
                  </div>
                  
                  <div className="p-6 bg-muted rounded-lg">
                    <h5 className="font-medium mb-4">Price Breakdown</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Materials:</span>
                        <span>${(cabinetDetails.price * 0.6).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span>${(cabinetDetails.price * 0.3).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hardware:</span>
                        <span>${(cabinetDetails.price * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${cabinetDetails.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button size="sm">
                <Package className="w-4 h-4 mr-2" />
                Add to Project
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View 3D
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Spec Sheet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}