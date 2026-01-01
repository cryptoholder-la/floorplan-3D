// Cabinet Type Definitions for Floorplan 3D

export type CabinetWidth = 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36 | 39 | 42 | 45 | 48;

export type CabinetDepth = 12 | 15 | 18 | 21 | 24;

export type CabinetHeight = 30 | 33 | 36 | 39 | 42 | 45 | 48 | 54 | 60 | 72 | 84 | 90 | 34.5;

export interface CabinetDimensions {
  width: CabinetWidth;
  depth: CabinetDepth;
  height: CabinetHeight;
}

export interface CabinetMaterial {
  id: string;
  name: string;
  type: 'plywood' | 'hardwood' | 'mdf' | 'particleboard';
  thickness: number;
  pricePerSheet: number;
  supplier?: string;
}

export interface CabinetHardware {
  id: string;
  name: string;
  type: 'hinge' | 'handle' | 'drawer-slide' | 'shelf-pin' | 'screw' | 'dowel';
  quantity: number;
  unitPrice: number;
  supplier?: string;
}

export interface CabinetPart {
  id: string;
  name: string;
  material: CabinetMaterial;
  dimensions: {
    width: number;
    height: number;
    thickness: number;
  };
  quantity: number;
  grainDirection?: 'horizontal' | 'vertical';
  edgeBanding?: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}

export interface Cabinet {
  id: string;
  name: string;
  type: 'base' | 'wall' | 'tall' | 'corner' | 'sink' | 'range' | 'microwave';
  dimensions: CabinetDimensions;
  parts: CabinetPart[];
  hardware: CabinetHardware[];
  materials: CabinetMaterial[];
  estimatedCost?: number;
  estimatedTime?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CabinetConfiguration {
  style: 'traditional' | 'modern' | 'shaker' | 'flat-panel' | 'raised-panel';
  doorStyle: 'full-overlay' | 'partial-overlay' | 'inset';
  finish: {
    type: 'stain' | 'paint' | 'laminate' | 'natural';
    color: string;
    sheen: 'matte' | 'satin' | 'semi-gloss' | 'gloss';
  };
  hardware: {
    hinges: string;
    handles: string;
    drawerSlides: string;
  };
}

export interface CutListItem {
  id: string;
  cabinetId: string;
  cabinetName: string;
  partName: string;
  material: CabinetMaterial;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  grainDirection: 'horizontal' | 'vertical';
  edgeBanding: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  notes?: string;
}

export interface CutList {
  id: string;
  name: string;
  projectId?: string;
  items: CutListItem[];
  totalMaterials: {
    [materialId: string]: {
      material: CabinetMaterial;
      totalArea: number;
      totalSheets: number;
      cost: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CabinetCatalog {
  id: string;
  name: string;
  description?: string;
  cabinets: Cabinet[];
  templates: CabinetTemplate[];
  materials: CabinetMaterial[];
  hardware: CabinetHardware[];
  version: string;
  lastUpdated: Date;
}

export interface CabinetTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  cabinetType: Cabinet['type'];
  baseCabinet: Cabinet;
  configurableDimensions: {
    width: CabinetWidth[];
    depth: CabinetDepth[];
    height: CabinetHeight[];
  };
  estimatedCost: number;
  estimatedTime: number;
  tags: string[];
}
