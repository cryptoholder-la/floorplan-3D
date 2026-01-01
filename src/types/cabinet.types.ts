
// ============================================================================
// CABINET TYPES - All cabinet-related type definitions
// ============================================================================

export interface Cabinet extends BaseEntity {
  type: 'base' | 'wall' | 'tall' | 'corner' | 'sink' | 'appliance';
  dimensions: CabinetDimensions;
  material: Material;
  hardware: CabinetHardware[];
  parts: CabinetPart[];
  configuration: CabinetConfiguration;
  difficulty: Difficulty;
  status: Status;
  tags: string[];
  metadata: CabinetMetadata;
  price?: number;
}

export interface CabinetPart extends BaseEntity {
  partType: 'side' | 'top' | 'bottom' | 'back' | 'door' | 'drawer' | 'shelf';
  material: Material;
  dimensions: CabinetDimensions;
  edgeBanding?: EdgeBanding;
  machining?: MachiningDetails;
  hardware?: CabinetHardware;
}

export interface CabinetMaterial extends BaseEntity {
  thickness: number;
  pricePerSheet?: number;
  costPerUnit?: number;
  supplier?: string;
  finish: string;
  grain?: string;
}

export interface CabinetHardware extends BaseEntity {
  type: 'hinge' | 'handle' | 'slide' | 'support' | 'bracket';
  material: string;
  finish: string;
  quantity?: number;
  unitPrice?: number;
  totalCost?: number;
}

export interface CabinetConfiguration {
  style: 'traditional' | 'modern' | 'shaker' | 'flat-panel';
  construction: 'frameless' | 'face-frame' | 'overlay';
  features: string[];
  customizations: Record<string, any>;
}

export interface CabinetMetadata {
  designer?: string;
  project?: string;
  client?: string;
  room?: string;
  installation?: InstallationDetails;
  notes?: string;
}