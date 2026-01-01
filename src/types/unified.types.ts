// ============================================================================
// UNIFIED TYPES - Cross-domain type definitions
// ============================================================================

import { Point2D, Rectangle, BaseEntity } from '@/types';
import { Cabinet, CabinetDimensions } from '@/types';
import { DrillPattern, CNCOperation, GCodeProgram } from '@/types';
import { ManufacturingJob, MachineSettings } from '@/types';
import { Floorplan, Wall, Room } from '@/types';

export interface UnifiedProject extends BaseEntity {
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  components: ProjectComponents;
  timeline: ProjectTimeline;
  budget?: ProjectBudget;
}

export type ProjectType = 'cabinet' | 'floorplan' | 'manufacturing' | 'unified';
export type ProjectStatus = 'planning' | 'design' | 'manufacturing' | 'assembly' | 'completed';

export interface ProjectComponents {
  cabinets?: Cabinet[];
  floorplan?: Floorplan;
  manufacturing?: ManufacturingJob[];
  patterns?: DrillPattern[];
  operations?: CNCOperation[];
}

export interface ProjectTimeline {
  startDate: Date;
  endDate?: Date;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  type: PhaseType;
  status: PhaseStatus;
  startDate: Date;
  endDate?: Date;
  dependencies?: string[];
}

export type PhaseType = 'design' | 'planning' | 'manufacturing' | 'assembly' | 'finishing';
export type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface ProjectMilestone {
  id: string;
  name: string;
  date: Date;
  completed: boolean;
  description?: string;
}

export interface ProjectBudget {
  estimated: number;
  actual?: number;
  currency: string;
  breakdown: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  estimated: number;
  actual?: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface UnifiedWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  triggers: WorkflowTrigger[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  sequence: number;
  inputs: any[];
  outputs: any[];
  parameters: Record<string, any>;
}

export type StepType = 'design' | 'analysis' | 'manufacturing' | 'quality-check' | 'assembly';

export interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  required: boolean;
}

export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';

export interface WorkflowTrigger {
  type: TriggerType;
  source: string;
  event: string;
  conditions?: WorkflowCondition[];
}

export type TriggerType = 'manual' | 'automatic' | 'scheduled' | 'event_based';

export interface MasterIntegration {
  id: string;
  name: string;
  workflow: UnifiedWorkflow;
  systems: SystemConfiguration[];
  dataFlow: DataFlowConfiguration;
  synchronization: SyncConfiguration;
  monitoring: MonitoringConfiguration;
  status: ProjectStatus;
}

export interface SystemConfiguration {
  systemId: string;
  systemType: 'cnc' | 'cad' | 'cam' | 'erp' | 'inventory' | 'design';
  settings: Record<string, any>;
  endpoints: any[];
  authentication: any;
}

export interface DataFlowConfiguration {
  sources: any[];
  destinations: any[];
  transformations: any[];
  validation: any[];
  scheduling: any;
}

export interface SyncConfiguration {
  frequency: 'real-time' | 'scheduled' | 'manual';
  conflictResolution: string;
  errorHandling: string;
  logging: any;
}

export interface MonitoringConfiguration {
  enabled: boolean;
  metrics: string[];
  alerts: any[];
  reporting: any[];
}
