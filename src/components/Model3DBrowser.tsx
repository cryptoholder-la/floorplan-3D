import { useState } from 'react';
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { Box, Search, Download, Eye } from 'lucide-react';

interface Model3D {
  id: string;
  name: string;
  category: string;
  format: string;
  vertices: number;
  triangles: number;
  fileSize: string;
  thumbnail?: string;
}

interface Model3DBrowserProps {
  onModelSelect: (model: Model3D) => void;
  onModelAdd: (model: Model3D) => void;
}

const sampleModels: Model3D[] = [
  {
    id: 'kitchen-cabinet-30',
    name: 'Kitchen Cabinet 30"',
    category: 'Cabinets',
    format: 'GLTF',
    vertices: 1250,
    triangles: 2100,
    fileSize: '2.1 MB'
  },
  {
    id: 'modern-sofa',
    name: 'Modern Sofa',
    category: 'Furniture',
    format: 'OBJ',
    vertices: 3400,
    triangles: 5600,
    fileSize: '4.2 MB'
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Furniture',
    format: 'GLTF',
    vertices: 2800,
    triangles: 4200,
    fileSize: '3.1 MB'
  },
  {
    id: 'refrigerator',
    name: 'Standard Refrigerator',
    category: 'Appliances',
    format: 'FBX',
    vertices: 1800,
    triangles: 3200,
    fileSize: '2.8 MB'
  }
];

export default function Model3DBrowser({ onModelSelect, onModelAdd }: Model3DBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'cabinets', label: 'Cabinets' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'appliances', label: 'Appliances' },
    { id: 'fixtures', label: 'Fixtures' }
  ];

  const filteredModels = sampleModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      model.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search 3D models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map(model => (
          <Card key={model.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {model.category}
                  </Badge>
                </div>
                <Box className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Thumbnail Placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                <Box className="w-8 h-8 text-muted-foreground" />
              </div>
              
              {/* Model Details */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Format: {model.format}</p>
                <p>Vertices: {model.vertices.toLocaleString()}</p>
                <p>Triangles: {model.triangles.toLocaleString()}</p>
                <p>File Size: {model.fileSize}</p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onModelSelect(model)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => onModelAdd(model)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-8">
          <Box className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No models found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
