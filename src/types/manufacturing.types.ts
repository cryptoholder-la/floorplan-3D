
// ============================================================================
// MANUFACTURING TYPES - All manufacturing-related type definitions
// ============================================================================

export interface ManufacturingJob extends BaseEntity {
  type: 'cutting' | 'drilling' | 'assembly' | 'finishing' | 'quality-check';
  priority: Priority;
  estimatedCost?: number;
  actualCost?: number;
  materials: Material[];
  operations: CNCOperation[];
  qualityChecks: QualityCheck[];
  schedule: ProductionSchedule;
  status: Status;
}

export interface MachineSettings {
  machineType: MachineType;
  spindleSpeed?: number; // RPM
  feedRate?: number; // mm/min or in/min
  depthOfCut?: number; // mm or in
  stepOver?: number; // percentage of tool diameter
  coolant?: CoolantSetting;
}

export type MachineType = 'cnc_router' | 'cnc_mill' | 'laser_cutter' | 'plasma_cutter' | 'waterjet';

export interface ToolRequirement extends BaseEntity {
  toolId: string;
  toolType: ToolType;
  diameter: number; // mm
  length: number; // mm
  coating?: ToolCoating;
  quantity?: number;
  estimatedCost?: number;
}

export interface QualityCheck extends BaseEntity {
  type: QualityCheckType;
  specification: string;
  tolerance: Tolerance;
  method: 'manual' | 'automated' | 'coordinate-measuring';
  required: boolean;
  createdAt: Date;
  updatedAt: Date;
  performedBy?: string;
  results?: CheckResult[];
}

export type QualityCheckType = 'dimensional' | 'surface_finish' | 'alignment' | 'material' | 'assembly';

export interface ProductionSchedule extends BaseEntity {
  dateRange: { start: Date; end: Date };
  jobs: ManufacturingJob[];
  resources: ResourceAllocation[];
  constraints: ScheduleConstraint[];
}

export interface Machine extends BaseEntity {
  type: MachineType;
  model: string;
  manufacturer: string;
  specifications: MachineSettings;
  status: Status;
  maintenanceHistory: MaintenanceRecord[];
}