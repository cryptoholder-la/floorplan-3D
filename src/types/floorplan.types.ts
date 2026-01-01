
// ============================================================================
// FLOORPLAN TYPES - All floorplan and architectural types
// ============================================================================

export interface Floorplan extends BaseEntity {
  dimensions: { width: number; height: number };
  scale: number;
  unit: 'meters' | 'feet' | 'millimeters';
  layers: Layer[];
  rooms: Room[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  fixtures: Fixture[];
  metadata: FloorplanMetadata;
}

export interface Wall extends BaseEntity {
  layerId: string;
  geometry: { start: Point2D; end: Point2D };
  thickness: number;
  height: number;
  material: Material;
  openings: WallOpening[];
  type: 'interior' | 'exterior' | 'load-bearing' | 'shear';
}

export interface Room extends BaseEntity {
  layerId: string;
  geometry: { points: Point2D[] };
  area: number;
  perimeter: number;
  floorLevel: number;
  ceilingHeight: number;
  openings: WallOpening[];
  fixtures: Fixture[];
  type: 'bedroom' | 'kitchen' | 'bathroom' | 'living' | 'dining' | 'office' | 'storage' | 'garage' | 'utility';
}

export interface Door extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'sliding' | 'folding' | 'pocket' | 'bypass';
  swing: 'left' | 'right' | 'inward' | 'outward';
  material: Material;
  hardware: CabinetHardware[];
}

export interface Window extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'casement' | 'sliding' | 'awning' | 'bay' | 'picture';
  material: Material;
  properties: WindowProperties;
}

export interface Fixture extends BaseEntity {
  layerId: string;
  position: Point2D;
  rotation: number;
  type: 'electrical' | 'plumbing' | 'hvac' | 'lighting' | 'data' | 'furniture' | 'storage';
  specifications: Record<string, any>;
}