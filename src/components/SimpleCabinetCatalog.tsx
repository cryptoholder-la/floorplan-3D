import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Package, Plus } from 'lucide-react';
import { Material } from '@/types';

interface Cabinet {
  id: string;
  name: string;
  type: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  price?: number;
  material?: string;
  style?: string;
}

interface SimpleCabinetCatalogProps {
  onCabinetSelect: (cabinet: Cabinet) => void;
  onAddToProject: (cabinet: Cabinet) => void;
}

const sampleCabinets: Cabinet[] = [
  {
    id: 'base-cabinet-30',
    name: 'Base Cabinet 30"',
    type: 'base',
    dimensions: { width: 762, height: 720, depth: 305 },
    price: 150,
    material: 'Plywood',
    style: 'Shaker'
  },
  {
    id: 'wall-cabinet-30',
    name: 'Wall Cabinet 30"',
    type: 'wall',
    dimensions: { width: 762, height: 350, depth: 305 },
    price: 120,
    material: 'Plywood',
    style: 'Shaker'
  },
  {
    id: 'tall-cabinet-24',
    name: 'Tall Cabinet 24"',
    type: 'tall',
    dimensions: { width: 610, height: 2134, depth: 305 },
    price: 280,
    material: 'Plywood',
    style: 'Shaker'
  },
  {
    id: 'base-cabinet-36',
    name: 'Base Cabinet 36"',
    type: 'base',
    dimensions: { width: 914, height: 720, depth: 305 },
    price: 180,
    material: 'Plywood',
    style: 'Shaker'
  }
];

export default function SimpleCabinetCatalog({ 
  onCabinetSelect, 
  onAddToProject 
}: SimpleCabinetCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'base', label: 'Base Cabinets' },
    { id: 'wall', label: 'Wall Cabinets' },
    { id: 'tall', label: 'Tall Cabinets' }
  ];

  const filteredCabinets = selectedCategory === 'all' 
    ? sampleCabinets 
    : sampleCabinets.filter(c => c.type === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Cabinet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCabinets.map(cabinet => (
          <Card key={cabinet.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{cabinet.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {cabinet.type}
                  </Badge>
                </div>
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Dimensions: {cabinet.dimensions.width} × {cabinet.dimensions.height} × {cabinet.dimensions.depth}mm</p>
                {cabinet.material && <p>Material: {cabinet.material}</p>}
                {cabinet.style && <p>Style: {cabinet.style}</p>}
                {cabinet.price && <p className="font-semibold text-primary">Price: ${cabinet.price}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCabinetSelect(cabinet)}
                  className="flex-1"
                >
                  Select
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAddToProject(cabinet)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
