export type CabinetStyle = 'euro' | 'inset' | 'faceframe';
export type CabinetType = 'base' | 'wall' | 'tall';
export type DoorStyle = 'slab' | 'shaker' | 'raised-panel';
export type MaterialType = 'plywood' | 'mdf' | 'particle-board';

export interface CabinetDimensions {
  width: number;
  height: number;
  depth: number;
  thickness: number;
}

export interface CabinetTemplate {
  id: string;
  name: string;
  type: CabinetType;
  style: CabinetStyle;
  dimensions: CabinetDimensions;
  doorCount: number;
  shelfCount: number;
}

export interface CabinetDesign {
  id: string;
  template?: CabinetTemplate;
  dimensions: CabinetDimensions;
  style: CabinetStyle;
  doorStyle: DoorStyle;
  material: MaterialType;
  doorCount: number;
  shelfCount: number;
  includeBack: boolean;
}

export interface CutListItem {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: MaterialType;
  edgeBanding: string[];
}

export interface NestingSheet {
  id: string;
  width: number;
  height: number;
  parts: NestingPart[];
}

export interface NestingPart {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  cutListItem: CutListItem;
}

export const DEFAULT_CABINET_TEMPLATES: CabinetTemplate[] = [
  {
    id: 'base-36x24x12',
    name: 'Base Cabinet 36" x 24" x 12"',
    type: 'base',
    style: 'euro',
    dimensions: { width: 914, height: 610, depth: 305, thickness: 18 },
    doorCount: 2,
    shelfCount: 1
  },
  {
    id: 'wall-30x12x12',
    name: 'Wall Cabinet 30" x 12" x 12"',
    type: 'wall',
    style: 'euro',
    dimensions: { width: 762, height: 305, depth: 305, thickness: 18 },
    doorCount: 1,
    shelfCount: 2
  },
  {
    id: 'tall-24x84x12',
    name: 'Tall Cabinet 24" x 84" x 12"',
    type: 'tall',
    style: 'euro',
    dimensions: { width: 610, height: 2134, depth: 305, thickness: 18 },
    doorCount: 2,
    shelfCount: 4
  }
];

export const DEFAULT_CABINET_DESIGN: CabinetDesign = {
  id: 'default-cabinet',
  dimensions: { width: 914, height: 610, depth: 305, thickness: 18 },
  style: 'euro',
  doorStyle: 'shaker',
  material: 'plywood',
  doorCount: 2,
  shelfCount: 1,
  includeBack: true
};
