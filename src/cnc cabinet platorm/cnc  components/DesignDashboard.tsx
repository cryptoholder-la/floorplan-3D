import { CabinetDesign, CabinetStyle, DoorStyle, MaterialType } from '@/lib/cabinetTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface DesignDashboardProps {
  design: CabinetDesign;
  onUpdateDesign: (updates: Partial<CabinetDesign>) => void;
}

export default function DesignDashboard({ design, onUpdateDesign }: DesignDashboardProps) {
  const updateDimension = (key: keyof CabinetDesign['dimensions'], value: number) => {
    onUpdateDesign({
      dimensions: {
        ...design.dimensions,
        [key]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Controls</CardTitle>
        <CardDescription>Customize your cabinet design</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Dimensions */}
        <div className="space-y-4">
          <h3 className="font-semibold">Dimensions (mm)</h3>
          
          <div className="space-y-2">
            <Label>Width: {design.dimensions.width}mm</Label>
            <Input
              type="number"
              value={design.dimensions.width}
              onChange={(e) => updateDimension('width', parseInt(e.target.value) || 0)}
              min={200}
              max={2000}
            />
          </div>

          <div className="space-y-2">
            <Label>Height: {design.dimensions.height}mm</Label>
            <Input
              type="number"
              value={design.dimensions.height}
              onChange={(e) => updateDimension('height', parseInt(e.target.value) || 0)}
              min={200}
              max={2400}
            />
          </div>

          <div className="space-y-2">
            <Label>Depth: {design.dimensions.depth}mm</Label>
            <Input
              type="number"
              value={design.dimensions.depth}
              onChange={(e) => updateDimension('depth', parseInt(e.target.value) || 0)}
              min={200}
              max={800}
            />
          </div>

          <div className="space-y-2">
            <Label>Material Thickness: {design.dimensions.thickness}mm</Label>
            <Select 
              value={design.dimensions.thickness.toString()} 
              onValueChange={(value) => updateDimension('thickness', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16">16mm</SelectItem>
                <SelectItem value="18">18mm</SelectItem>
                <SelectItem value="19">19mm</SelectItem>
                <SelectItem value="25">25mm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Door Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold">Door Configuration</h3>
          
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

          <div className="space-y-2">
            <Label>Number of Doors: {design.doorCount}</Label>
            <Slider
              value={[design.doorCount]}
              onValueChange={([value]) => onUpdateDesign({ doorCount: value })}
              min={0}
              max={4}
              step={1}
            />
          </div>
        </div>

        {/* Material Selection */}
        <div className="space-y-2">
          <Label>Material Type</Label>
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

        {/* Shelves */}
        <div className="space-y-2">
          <Label>Number of Shelves: {design.shelfCount}</Label>
          <Slider
            value={[design.shelfCount]}
            onValueChange={([value]) => onUpdateDesign({ shelfCount: value })}
            min={0}
            max={6}
            step={1}
          />
        </div>

        {/* Back Panel */}
        <div className="flex items-center justify-between">
          <Label>Include Back Panel</Label>
          <Switch
            checked={design.includeBack}
            onCheckedChange={(checked) => onUpdateDesign({ includeBack: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}