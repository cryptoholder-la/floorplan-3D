// Manufacturing Type Definitions for Floorplan 3D

import { Cabinet, CutListItem } from './cabinet.types';

export interface ManufacturingJob {
  id: string;
  name: string;
  type: 'cutting' | 'drilling' | 'assembly' | 'finishing' | 'quality-check';
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
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
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineSettings {
  machineType: 'cnc-router' | 'panel-saw' | 'drill-press' | 'edge-bander' | 'sander';
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
  coolant?: 'off' | 'mist' | 'flood' | 'through';
  additionalSettings?: Record<string, any>;
}

export interface ToolRequirement {
  toolId: string;
  toolName: string;
  toolType: 'end-mill' | 'drill-bit' | 'router-bit' | 'saw-blade' | 'sanding-pad';
  diameter: number; // mm
  length: number; // mm
  fluteCount?: number;
  coating?: 'hss' | 'carbide' | 'diamond';
  condition: 'new' | 'good' | 'worn' | 'replacement-needed';
  estimatedLife?: number; // hours
  currentUsage?: number; // hours
}

export interface QualityCheck {
  id: string;
  name: string;
  type: 'dimensional' | 'visual' | 'functional' | 'material';
  specification: string;
  tolerance: Tolerance;
  method: 'manual' | 'automated' | 'visual-inspection';
  required: boolean;
  result?: 'pass' | 'fail' | 'conditional';
  measuredValue?: number;
  notes?: string;
  checkedBy?: string;
  checkedAt?: Date;
}

export interface Tolerance {
  dimension: string;
  nominal: number;
  plus: number;
  minus: number;
  unit: 'mm' | 'inches';
  critical: boolean;
}

export interface ManufacturingOrder {
  id: string;
  name: string;
  description?: string;
  customerId?: string;
  projectId?: string;
  
  // Order details
  jobs: ManufacturingJob[];
  status: 'draft' | 'confirmed' | 'in-production' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
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
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionSchedule {
  id: string;
  name: string;
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
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Machine {
  id: string;
  name: string;
  type: MachineSettings['machineType'];
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
  status: 'available' | 'busy' | 'maintenance' | 'offline';
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

export interface Operator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  
  // Skills and certifications
  skills: string[];
  certifications: Certification[];
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
  
  status: 'active' | 'inactive' | 'on-leave';
  hiredAt: Date;
}

export interface MaintenanceSchedule {
  id: string;
  machineId: string;
  type: 'preventive' | 'corrective' | 'predictive';
  description: string;
  scheduledDate: Date;
  estimatedDuration: number; // hours
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  
  performedBy?: string;
  actualDuration?: number;
  notes?: string;
  partsUsed?: string[];
  cost?: number;
}

export interface Certification {
  id: string;
  name: string;
  type: 'machine-operation' | 'safety' | 'quality' | 'technical';
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expired' | 'suspended';
}

export interface ScheduleConstraint {
  id: string;
  type: 'machine-availability' | 'operator-availability' | 'material-lead-time' | 'shipping-deadline';
  description: string;
  impact: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate: Date;
  affectedResources: string[]; // machine IDs, operator IDs, etc.
}

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
