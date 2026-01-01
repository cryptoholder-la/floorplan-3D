// MANUFACTURING TYPES - Manufacturing-specific type definitions
// Consolidates all manufacturing-related types from fragmented files

import {
  BaseEntity,
  Status,
  Priority,
  Tolerance,
  Point3D
} from '../core/base.types';
import { Cabinet, CutListItem } from './cabinet.types';
import { BaseEntity } from '@/types';
import { first } from "@/lib/utils/array";

// ============================================================================
// MANUFACTURING JOB TYPES
// ============================================================================

export interface ManufacturingJob extends BaseEntity {
  type: 'cutting' | 'drilling' | 'assembly' | 'finishing' | 'quality-check';
  
  // Job details
  priority: Priority;
  estimatedCost?: number;
  actualCost?: number;
  
  // Job details
  cabinetId?: string;
  cutListItems?: CutListItem[];
  estimatedTime: number; // in minutes
  actualTime?: number; // in minutes
  
  // Machine settings
  machineSettings: MachineSettings;
  toolRequirements: ToolRequirement[];
  
  // Quality control
  qualityChecks: QualityCheck[];
  tolerances: Tolerance[];
  
  // Scheduling
  scheduledDate?: Date;
  startedDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  
  // Costs
  estimatedCost: number;
  actualCost?: number;
  
  // Notes
  notes?: string;
}

// ============================================================================
// MACHINE SETTINGS TYPES
// ============================================================================

export interface MachineSettings {
  machineType: MachineType;
  spindleSpeed?: number; // RPM
  feedRate?: number; // mm/min or in/min
  depthOfCut?: number; // mm
  passDepth?: number; // mm per pass
  toolNumber?: number;
  workOffset?: {
    x: number;
    y: number;
    z: number;
  };
  coolant?: CoolantType;
  additionalSettings?: Record<string, any>;
}

export type MachineType = 
  | 'cnc-router'
  | 'panel-saw'
  | 'drill-press'
  | 'edge-bander'
  | 'sander';

export type CoolantType = 
  | 'off'
  | 'mist'
  | 'flood'
  | 'through';

// ============================================================================
// TOOL REQUIREMENT TYPES
// ============================================================================

export interface ToolRequirement extends BaseEntity {
  toolId: string;
  toolType: ToolType;
  quantity?: number;
  estimatedCost?: number;
  diameter: number; // mm
  length: number; // mm
  fluteCount?: number;
  coating?: ToolCoating;
  condition: ToolCondition;
  estimatedLife?: number; // hours
  currentUsage?: number; // hours
}

export type ToolType = 
  | 'end-mill'
  | 'drill-bit'
  | 'router-bit'
  | 'saw-blade'
  | 'sanding-pad';

export type ToolCoating = 
  | 'hss'
  | 'carbide'
  | 'diamond';

export type ToolCondition = 
  | 'new'
  | 'good'
  | 'worn'
  | 'replacement-needed';

// ============================================================================
// QUALITY CONTROL TYPES
// ============================================================================

export interface QualityCheck extends BaseEntity {
  type: QualityCheckType;
  specification: string;
  tolerance: Tolerance;
  method: QualityCheckMethod;
  required: boolean;
  createdAt: Date;
  updatedAt: Date;
  performedBy?: string;
  results?: CheckResult[];
  result?: QualityCheckResult;
  measuredValue?: number;
  notes?: string;
  checkedBy?: string;
  checkedAt?: Date;
}

export type QualityCheckType = 
  | 'dimensional'
  | 'visual'
  | 'functional'
  | 'material';

export type QualityCheckMethod = 
  | 'manual'
  | 'automated'
  | 'visual-inspection';

export type QualityCheckResult = 
  | 'pass'
  | 'fail'
  | 'conditional';

// ============================================================================
// MANUFACTURING ORDER TYPES
// ============================================================================

export interface ManufacturingOrder extends BaseEntity {
  description?: string;
  customerId?: string;
  projectId?: string;
  
  // Order details
  jobs: ManufacturingJob[];
  priority: Priority;
  
  // Scheduling
  orderDate: Date;
  promisedDate?: Date;
  startedDate?: Date;
  completedDate?: Date;
  
  // Costs
  estimatedCost: number;
  actualCost?: number;
  laborCost?: number;
  materialCost?: number;
  overheadCost?: number;
  
  // Production details
  productionNotes?: string;
  specialInstructions?: string;
  qualityRequirements?: string[];
  
  // Tracking
  progress: number; // 0-100 percentage
  completedJobs: number;
  totalJobs: number;
}

// ============================================================================
// PRODUCTION SCHEDULE TYPES
// ============================================================================

export interface ProductionSchedule extends BaseEntity {
  dateRange: {
    start: Date;
    end: Date;
  };
  orders: ManufacturingOrder[];
  machines: Machine[];
  operators: Operator[];
  
  // Efficiency metrics
  plannedEfficiency: number; // percentage
  actualEfficiency?: number; // percentage
  utilization?: number; // percentage
  
  // Constraints
  constraints: ScheduleConstraint[];
  bottlenecks?: string[];
}

// ============================================================================
// MACHINE TYPES
// ============================================================================

export interface Machine extends BaseEntity {
  type: MachineType;
  model: string;
  manufacturer: string;
  
  // Capabilities
  maxWorkpieceSize: {
    x: number;
    y: number;
    z: number;
  };
  spindlePower: number; // kW or HP
  maxSpindleSpeed: number; // RPM
  toolCapacity: number; // number of tools
  
  // Status
  status: MachineStatus;
  currentJob?: string;
  nextAvailable?: Date;
  
  // Maintenance
  maintenanceSchedule: MaintenanceSchedule[];
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  
  // Performance
  efficiency?: number; // percentage
  uptime?: number; // percentage
  
  installedAt: Date;
  location?: string;
}

export type MachineStatus = 
  | 'available'
  | 'busy'
  | 'maintenance'
  | 'offline';

// ============================================================================
// OPERATOR TYPES
// ============================================================================

export interface Operator extends BaseEntity {
  email: string;
  phone?: string;
  
  // Skills and certifications
  skills: string[];
  certifications: ManufacturingCertification[];
  machines: string[]; // machine IDs they can operate
  
  // Availability
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  
  // Performance
  efficiency?: number; // percentage
  qualityRating?: number; // 1-5 scale
  
  status: OperatorStatus;
  hiredAt: Date;
}

export type OperatorStatus = 
  | 'active'
  | 'inactive'
  | 'on-leave';

// ============================================================================
// MAINTENANCE TYPES
// ============================================================================

export interface MaintenanceSchedule extends BaseEntity {
  machineId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  estimatedDuration: number; // hours
  priority: Priority;
  status: MaintenanceStatus;
  
  performedBy?: string;
  actualDuration?: number;
  notes?: string;
  partsUsed?: string[];
  cost?: number;
}

export type MaintenanceType = 
  | 'preventive'
  | 'corrective'
  | 'predictive';

export type MaintenanceStatus = 
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

// ============================================================================
// CERTIFICATION TYPES
// ============================================================================

export interface ManufacturingCertification extends BaseEntity {
  type: CertificationType;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  status: CertificationStatus;
}

export type CertificationType = 
  | 'machine-operation'
  | 'safety'
  | 'quality'
  | 'technical';

export type CertificationStatus = 
  | 'valid'
  | 'expired'
  | 'suspended';

// ============================================================================
// SCHEDULE CONSTRAINT TYPES
// ============================================================================

export interface ScheduleConstraint extends BaseEntity {
  type: ConstraintType;
  description: string;
  impact: ConstraintImpact;
  startDate: Date;
  endDate: Date;
  affectedResources: string[]; // machine IDs, operator IDs, etc.
}

export type ConstraintType = 
  | 'machine-availability'
  | 'operator-availability'
  | 'material-lead-time'
  | 'shipping-deadline';

export type ConstraintImpact = 
  | 'low'
  | 'medium'
  | 'high';

// ============================================================================
// MANUFACTURING METRICS TYPES
// ============================================================================

export interface ManufacturingMetrics {
  // Production metrics
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  averageOrderTime: number; // days
  
  // Efficiency metrics
  overallEfficiency: number; // percentage
  machineUtilization: number; // percentage
  laborEfficiency: number; // percentage
  
  // Quality metrics
  firstPassYield: number; // percentage
  reworkRate: number; // percentage
  qualityScore: number; // 1-5 scale
  
  // Cost metrics
  averageCostPerOrder: number;
  laborCostPercentage: number;
  materialCostPercentage: number;
  overheadCostPercentage: number;
  
  // Time metrics
  averageSetupTime: number; // hours
  averageCycleTime: number; // hours
  onTimeDeliveryRate: number; // percentage
  
  calculatedAt: Date;
}
