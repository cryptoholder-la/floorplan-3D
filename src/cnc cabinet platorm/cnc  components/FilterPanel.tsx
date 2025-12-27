import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    type: string;
    style: string;
    minHeight: string;
    maxHeight: string;
    doors: string;
    drawers: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  uniqueTypes: string[];
  uniqueStyles: string[];
  uniqueHeights: number[];
  uniqueDoors: number[];
  uniqueDrawers: number[];
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  uniqueTypes,
  uniqueStyles,
  uniqueHeights,
  uniqueDoors,
  uniqueDrawers
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search cabinet name..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="type">Cabinet Type</Label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="style">Style</Label>
          <Select value={filters.style} onValueChange={(value) => onFilterChange('style', value)}>
            <SelectTrigger id="style">
              <SelectValue placeholder="All styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All styles</SelectItem>
              {uniqueStyles.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minHeight">Min Height</Label>
            <Select value={filters.minHeight} onValueChange={(value) => onFilterChange('minHeight', value)}>
              <SelectTrigger id="minHeight">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {uniqueHeights.map(h => (
                  <SelectItem key={h} value={String(h)}>{h}U</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxHeight">Max Height</Label>
            <Select value={filters.maxHeight} onValueChange={(value) => onFilterChange('maxHeight', value)}>
              <SelectTrigger id="maxHeight">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                {uniqueHeights.map(h => (
                  <SelectItem key={h} value={String(h)}>{h}U</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="doors">Number of Doors</Label>
          <Select value={filters.doors} onValueChange={(value) => onFilterChange('doors', value)}>
            <SelectTrigger id="doors">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {uniqueDoors.map(d => (
                <SelectItem key={d} value={String(d)}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="drawers">Number of Drawers</Label>
          <Select value={filters.drawers} onValueChange={(value) => onFilterChange('drawers', value)}>
            <SelectTrigger id="drawers">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {uniqueDrawers.map(d => (
                <SelectItem key={d} value={String(d)}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}