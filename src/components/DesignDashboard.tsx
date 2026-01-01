"use client";

import { useState } from 'react';
import { CabinetDesign, CabinetStyle, DoorStyle, MaterialType, DEFAULT_CABINET_TEMPLATES } from '@/types/cabinet.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Switch } from '@/ui/switch';
import { Slider } from '@/ui/slider';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  Settings, 
  Ruler, 
  Package, 
  Layers,
  Save,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface DesignDashboardProps {
  design: CabinetDesign;
  onUpdateDesign: (updates: Partial<CabinetDesign>) => void;
  onApplyTemplate?: (template: any) => void;
  className?: string;
}

export default function DesignDashboard({ 
  design, 
  onUpdateDesign, 
  onApplyTemplate,
  className = "" 
}: DesignDashboardProps) {
  const [activeTab, setActiveTab] = useState('dimensions');

  const updateDimension = (key: keyof CabinetDesign['dimensions'], value: number) => {
    onUpdateDesign({
      dimensions: {
        ...design.dimensions,
        [key]: value
      }
    });
  };

  const applyTemplate = (template: any) => {
    onUpdateDesign({
      dimensions: template.dimensions,
      style: template.style,
      doorCount: template.doorCount,
      shelfCount: template.shelfCount
    });
    onApplyTemplate?.(template);
    toast.success(`Applied template: ${template.name}`);
  };

  const resetToDefaults = () => {
    onUpdateDesign({
      dimensions: { width: 914, height: 610, depth: 305, thickness: 18 },
      style: 'euro',
      doorStyle: 'shaker',
      material: 'plywood',
      doorCount: 2,
      shelfCount: 1,
      includeBack: true
    });
    toast.success('Reset to default values');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Design Dashboard
          </CardTitle>
          <CardDescription>
            Customize your cabinet design with precise controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeTab === 'dimensions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('dimensions')}
            >
              <Ruler className="w-4 h-4 mr-2" />
              Dimensions
            </Button>
            <Button
              variant={activeTab === 'style' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('style')}
            >
              <Package className="w-4 h-4 mr-2" />
              Style
            </Button>
            <Button
              variant={activeTab === 'templates' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('templates')}
            >
              <Layers className="w-4 h-4 mr-2" />
              Templates
            </Button>
          </div>

          {/* Dimensions Tab */}
          {activeTab === 'dimensions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Width */}
                <div className="space-y-2">
                  <Label>Width (mm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[design.dimensions.width]}
                      onValueChange={([value]) => updateDimension('width', value)}
                      min={200}
                      max={2000}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      value={design.dimensions.width}
                      onChange={(e) => updateDimension('width', parseInt(e.target.value) || 0)}
                      min={200}
                      max={2000}
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label>Height (mm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[design.dimensions.height]}
                      onValueChange={([value]) => updateDimension('height', value)}
                      min={200}
                      max={2400}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      value={design.dimensions.height}
                      onChange={(e) => updateDimension('height', parseInt(e.target.value) || 0)}
                      min={200}
                      max={2400}
                    />
                  </div>
                </div>

                {/* Depth */}
                <div className="space-y-2">
                  <Label>Depth (mm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[design.dimensions.depth]}
                      onValueChange={([value]) => updateDimension('depth', value)}
                      min={150}
                      max={600}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      value={design.dimensions.depth}
                      onChange={(e) => updateDimension('depth', parseInt(e.target.value) || 0)}
                      min={150}
                      max={600}
                    />
                  </div>
                </div>

                {/* Thickness */}
                <div className="space-y-2">
                  <Label>Thickness (mm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[design.dimensions.thickness]}
                      onValueChange={([value]) => updateDimension('thickness', value)}
                      min={12}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      value={design.dimensions.thickness}
                      onChange={(e) => updateDimension('thickness', parseInt(e.target.value) || 0)}
                      min={12}
                      max={25}
                    />
                  </div>
                </div>
              </div>

              {/* Doors and Shelves */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Door Count</Label>
                  <Select 
                    value={design.doorCount.toString()} 
                    onValueChange={(value) => onUpdateDesign({ doorCount: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Doors</SelectItem>
                      <SelectItem value="1">1 Door</SelectItem>
                      <SelectItem value="2">2 Doors</SelectItem>
                      <SelectItem value="3">3 Doors</SelectItem>
                      <SelectItem value="4">4 Doors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shelf Count</Label>
                  <Select 
                    value={design.shelfCount.toString()} 
                    onValueChange={(value) => onUpdateDesign({ shelfCount: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Shelves</SelectItem>
                      <SelectItem value="1">1 Shelf</SelectItem>
                      <SelectItem value="2">2 Shelves</SelectItem>
                      <SelectItem value="3">3 Shelves</SelectItem>
                      <SelectItem value="4">4 Shelves</SelectItem>
                      <SelectItem value="5">5 Shelves</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Include Back */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={design.includeBack}
                  onCheckedChange={(checked) => onUpdateDesign({ includeBack: checked })}
                />
                <Label>Include Back Panel</Label>
              </div>
            </div>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Cabinet Style */}
              <div className="space-y-2">
                <Label>Cabinet Style</Label>
                <Select 
                  value={design.style} 
                  onValueChange={(value: CabinetStyle) => onUpdateDesign({ style: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="euro">Euro (32mm System)</SelectItem>
                    <SelectItem value="inset">Inset</SelectItem>
                    <SelectItem value="faceframe">Face Frame</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Door Style */}
              <div className="space-y-2">
                <Label>Door Style</Label>
                <Select 
                  value={design.doorStyle} 
                  onValueChange={(value: DoorStyle) => onUpdateDesign({ doorStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slab">Slab</SelectItem>
                    <SelectItem value="shaker">Shaker</SelectItem>
                    <SelectItem value="raised-panel">Raised Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material */}
              <div className="space-y-2">
                <Label>Material</Label>
                <Select 
                  value={design.material} 
                  onValueChange={(value: MaterialType) => onUpdateDesign({ material: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plywood">Plywood</SelectItem>
                    <SelectItem value="mdf">MDF</SelectItem>
                    <SelectItem value="particle-board">Particle Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material Properties Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Style</p>
                  <Badge variant="secondary" className="mt-1">
                    {design.style}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Door Style</p>
                  <Badge variant="secondary" className="mt-1">
                    {design.doorStyle}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Material</p>
                  <Badge variant="secondary" className="mt-1">
                    {design.material}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEFAULT_CABINET_TEMPLATES.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.type} • {template.style}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Dimensions:</span>
                          <span>{template.dimensions.width}×{template.dimensions.height}×{template.dimensions.depth}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Doors:</span>
                          <span>{template.doorCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shelves:</span>
                          <span>{template.shelfCount}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => applyTemplate(template)}
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button variant="default" size="sm" onClick={() => toast.success('Design saved!')}>
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
