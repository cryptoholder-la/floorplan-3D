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
  template: CabinetTemplate;
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
  wastePercentage: number;
}

export interface NestingPart {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  name: string;
}

export interface CostBreakdown {
  materialCost: number;
  hardwareCost: number;
  totalCost: number;
  sheetCount: number;
  wastePercentage: number;
}

export interface PricingConfig {
  pricePerSquareMeter: number;
  hingePrice: number;
  handlePrice: number;
}