// MASTER INTEGRATION TYPES - Master integration system type definitions
// Defines types for the unified workflow system combining all modules

import {
  BaseEntity,
  Status,
  Priority,
  Difficulty,
  User,
  Project
} from '../core/base.types';
import { Cabinet } from '../domain/cabinet.types';
import { Floorplan } from '../domain/floorplan.types';
import { ManufacturingJob } from '../domain/manufacturing.types';
import { BaseEntity } from '@/types';

// ============================================================================
// MASTER SYSTEM CONFIGURATION
// ============================================================================

export interface MasterSystemConfig {
  // System settings
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  
  // Module configuration
  modules: ModuleConfig[];
  
  // Integration settings
  integrations: IntegrationConfig[];
  
  // AI and learning
  aiEnabled: boolean;
  learningEnabled: boolean;
  selfOptimization: boolean;
  
  // Performance
  maxConcurrentWorkflows: number;
  cacheEnabled: boolean;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  priority: Priority;
  dependencies: string[];
  settings: Record<string, any>;
}

export interface IntegrationConfig {
  id: string;
  type: IntegrationType;
  provider: string;
  credentials?: Record<string, string>;
  settings: Record<string, any>;
  enabled: boolean;
}

export type IntegrationType = 
  | 'ai-service'
  | 'cad-software'
  | 'cnc-machine'
  | 'inventory'
  | 'project-management'
  | 'communication'
  | 'storage'
  | 'analytics';

// ============================================================================
// MASTER WORKFLOW TYPES
// ============================================================================

export interface MasterWorkflow extends BaseEntity {
  type: WorkflowType;
  priority: Priority;
  difficulty: Difficulty;
  
  // Workflow definition
  steps: MasterWorkflowStep[];
  dependencies: string[]; // workflow IDs
  
  // Context and data
  input: WorkflowInput;
  output?: WorkflowOutput;
  context: WorkflowContext;
  
  // Execution
  status: WorkflowStatus;
  progress: number; // 0-100
  currentStep?: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  
  // Resources
  assignedTo?: User;
  requiredResources: ResourceRequirement[];
  
  // Quality and validation
  validation: WorkflowValidation;
  qualityChecks: QualityCheckPoint[];
}

export type WorkflowType = 
  | 'cabinet-design'
  | 'floorplan-creation'
  | 'manufacturing-planning'
  | 'cnc-programming'
  | 'quality-assurance'
  | 'project-management'
  | 'ai-analysis'
  | 'custom';

export type WorkflowStatus = 
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface MasterWorkflowStep extends BaseEntity {
  type: StepType;
  name: string;
  description: string;
  
  // Step configuration
  module: string; // module ID
  action: string; // action name
  parameters: StepParameters;
  
  // Execution
  status: StepStatus;
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // minutes
  
  // Dependencies
  dependencies: number[]; // step indices
  inputs: StepInput[];
  outputs: StepOutput[];
  
  // Error handling
  retryPolicy: RetryPolicy;
  errorHandling: ErrorHandling;
  
  // Validation
  validation: StepValidation;
  conditions: StepCondition[];
}

export type StepType = 
  | 'data-input'
  | 'processing'
  | 'calculation'
  | 'validation'
  | 'transformation'
  | 'external-api'
  | 'user-interaction'
  | 'decision'
  | 'parallel'
  | 'sub-workflow';

export type StepStatus = 
  | 'pending'
  | 'ready'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export interface StepParameters {
  [key: string]: any;
  // Common parameters
  timeout?: number; // seconds
  retries?: number;
  parallel?: boolean;
  
  // Module-specific parameters
  moduleConfig?: Record<string, any>;
}

export interface StepInput {
  name: string;
  type: DataType;
  source: InputSource;
  required: boolean;
  validation?: InputValidation;
}

export interface StepOutput {
  name: string;
  type: DataType;
  destination: OutputDestination;
  format?: DataFormat;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'fixed' | 'exponential' | 'linear';
  baseDelay: number; // seconds
  maxDelay?: number; // seconds
}

export interface ErrorHandling {
  strategy: 'fail' | 'retry' | 'continue' | 'skip';
  fallbackAction?: string;
  notification: ErrorNotification;
}

export interface ErrorNotification {
  enabled: boolean;
  channels: NotificationChannel[];
  template?: string;
}

export type NotificationChannel = 
  | 'email'
  | 'sms'
  | 'slack'
  | 'webhook'
  | 'in-app';

// ============================================================================
// WORKFLOW DATA TYPES
// ============================================================================

export interface WorkflowInput {
  type: InputType;
  data: InputData;
  metadata: InputMetadata;
}

export type InputType = 
  | 'manual'
  | 'file-upload'
  | 'api-call'
  | 'database-query'
  | 'sensor-data'
  | 'external-system';

export interface InputData {
  format: DataFormat;
  content: any;
  schema?: DataSchema;
}

export interface InputMetadata {
  source: string;
  timestamp: Date;
  version: string;
  checksum?: string;
}

export interface WorkflowOutput {
  type: OutputType;
  data: OutputData;
  metadata: OutputMetadata;
}

export type OutputType = 
  | 'file'
  | 'report'
  | 'database-record'
  | 'api-response'
  | 'notification'
  | 'dashboard';

export interface OutputData {
  format: DataFormat;
  content: any;
  size?: number; // bytes
}

export interface OutputMetadata {
  destination: string;
  timestamp: Date;
  version: string;
  checksum?: string;
}

export interface WorkflowContext {
  projectId?: string;
  userId?: string;
  sessionId: string;
  environment: Record<string, any>;
  variables: ContextVariable[];
  history: ContextHistory[];
}

export interface ContextVariable {
  name: string;
  value: any;
  type: DataType;
  scope: 'global' | 'workflow' | 'step';
  readonly: boolean;
}

export interface ContextHistory {
  timestamp: Date;
  action: string;
  details: Record<string, any>;
}

// ============================================================================
// INTEGRATED PROJECT TYPES
// ============================================================================

export interface IntegratedProject extends BaseEntity {
  // Project information
  name: string;
  description?: string;
  client?: string;
  
  // Project components
  floorplan?: Floorplan;
  cabinets: Cabinet[];
  manufacturingJobs: ManufacturingJob[];
  
  // Workflows
  workflows: MasterWorkflow[];
  activeWorkflow?: string;
  
  // Team and resources
  team: ProjectTeamMember[];
  resources: ProjectResource[];
  
  // Timeline and milestones
  startDate?: Date;
  endDate?: Date;
  milestones: ProjectMilestone[];
  
  // Budget and costs
  budget?: ProjectBudget;
  actualCost?: number;
  
  // Status and progress
  status: ProjectStatus;
  progress: number; // 0-100
  
  // Quality and compliance
  qualityStandards: QualityStandard[];
  complianceRequirements: ComplianceRequirement[];
  
  // Documents and assets
  documents: ProjectDocument[];
  assets: ProjectAsset[];
}

export interface ProjectTeamMember {
  userId: string;
  role: ProjectRole;
  responsibilities: string[];
  permissions: Permission[];
  joinedAt: Date;
}

export type ProjectRole = 
  | 'owner'
  | 'manager'
  | 'designer'
  | 'engineer'
  | 'manufacturer'
  | 'quality-assurance'
  | 'client'
  | 'observer';

export interface Permission {
  action: string;
  resource: string;
  granted: boolean;
}

export interface ProjectResource {
  id: string;
  type: ResourceType;
  name: string;
  capacity?: number;
  availability: ResourceAvailability;
  cost?: number;
  unit?: string;
}

export type ResourceType = 
  | 'machine'
  | 'tool'
  | 'material'
  | 'software'
  | 'facility'
  | 'personnel'
  | 'equipment';

export interface ResourceAvailability {
  schedule: AvailabilitySchedule[];
  maintenanceWindows: MaintenanceWindow[];
  currentLoad?: number; // percentage
}

export interface AvailabilitySchedule {
  startDate: Date;
  endDate: Date;
  available: boolean;
  reason?: string;
}

export interface MaintenanceWindow {
  startDate: Date;
  endDate: Date;
  type: 'planned' | 'unplanned';
  description: string;
}

export interface ProjectMilestone extends BaseEntity {
  type: MilestoneType;
  targetDate: Date;
  actualDate?: Date;
  dependencies: string[]; // milestone IDs
  criteria: AcceptanceCriteria[];
  status: MilestoneStatus;
}

export type MilestoneType = 
  | 'design-complete'
  | 'approval'
  | 'manufacturing-start'
  | 'quality-check'
  | 'delivery'
  | 'installation'
  | 'project-complete';

export interface AcceptanceCriteria {
  description: string;
  required: boolean;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export type MilestoneStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'overdue'
  | 'cancelled';

export interface ProjectBudget {
  total: number;
  currency: string;
  breakdown: BudgetBreakdown;
  contingencies: BudgetContingency[];
  tracking: BudgetTracking;
}

export interface BudgetBreakdown {
  labor: number;
  materials: number;
  equipment: number;
  overhead: number;
  other: number;
}

export interface BudgetContingency {
  category: string;
  amount: number;
  percentage: number;
  used: number;
}

export interface BudgetTracking {
  spent: number;
  committed: number;
  remaining: number;
  variance: number;
  lastUpdated: Date;
}

export type ProjectStatus = 
  | 'planning'
  | 'design'
  | 'approval'
  | 'manufacturing'
  | 'quality-assurance'
  | 'delivery'
  | 'installation'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

export interface QualityStandard {
  name: string;
  organization: string;
  version: string;
  requirements: QualityRequirement[];
}

export interface QualityRequirement {
  category: string;
  specification: string;
  method: string;
  tolerance?: string;
  mandatory: boolean;
}

export interface ComplianceRequirement {
  type: ComplianceType;
  authority: string;
  reference: string;
  requirements: string[];
  verified: boolean;
  verifiedAt?: Date;
  documents: string[];
}

export type ComplianceType = 
  | 'building-code'
  | 'safety'
  | 'environmental'
  | 'industry-standard'
  | 'certification'
  | 'regulation';

export interface ProjectDocument extends BaseEntity {
  type: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number; // bytes
  format: string;
  version: string;
  author: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  tags: string[];
}

export type DocumentType = 
  | 'specification'
  | 'drawing'
  | 'manual'
  | 'report'
  | 'certificate'
  | 'contract'
  | 'invoice'
  | 'correspondence'
  | 'photo'
  | 'video';

export interface ProjectAsset extends BaseEntity {
  type: AssetType;
  name: string;
  description?: string;
  url: string;
  format: string;
  size: number; // bytes
  metadata: AssetMetadata;
  permissions: AssetPermission[];
}

export type AssetType = 
  | '3d-model'
  | '2d-drawing'
  | 'rendering'
  | 'photograph'
  | 'video'
  | 'audio'
  | 'document'
  | 'dataset';

export interface AssetMetadata {
  created: Date;
  modified: Date;
  software?: string;
  version?: string;
  coordinates?: AssetCoordinates;
  properties?: Record<string, any>;
}

export interface AssetCoordinates {
  x?: number;
  y?: number;
  z?: number;
  reference?: string;
}

export interface AssetPermission {
  userId: string;
  actions: AssetAction[];
  granted: boolean;
  expiresAt?: Date;
}

export type AssetAction = 
  | 'view'
  | 'download'
  | 'edit'
  | 'delete'
  | 'share'
  | 'approve';

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface WorkflowValidation {
  rules: ValidationRule[];
  strictMode: boolean;
  errorThreshold: number; // percentage of errors allowed
}

export interface ValidationRule {
  id: string;
  name: string;
  type: ValidationType;
  target: ValidationTarget;
  condition: ValidationCondition;
  action: ValidationAction;
  severity: ValidationSeverity;
}

export type ValidationType = 
  | 'data-quality'
  | 'business-rule'
  | 'technical'
  | 'security'
  | 'performance'
  | 'compliance';

export type ValidationTarget = 
  | 'input'
  | 'output'
  | 'context'
  | 'configuration'
  | 'resource';

export interface ValidationCondition {
  field?: string;
  operator: ValidationOperator;
  value: any;
  logic?: 'and' | 'or';
}

export type ValidationOperator = 
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'less-than'
  | 'contains'
  | 'matches'
  | 'in'
  | 'not-in';

export interface ValidationAction {
  type: 'block' | 'warn' | 'log' | 'transform';
  message?: string;
  transformation?: string;
}

export type ValidationSeverity = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

export interface StepValidation {
  preConditions: ValidationRule[];
  postConditions: ValidationRule[];
  invariants: ValidationRule[];
}

export interface StepCondition {
  type: ConditionType;
  expression: string;
  parameters?: Record<string, any>;
}

export type ConditionType = 
  | 'boolean'
  | 'comparison'
  | 'existence'
  | 'custom-function'
  | 'external-api';

export interface QualityCheckPoint extends BaseEntity {
  name: string;
  description: string;
  type: QualityCheckType;
  method: QualityCheckMethod;
  criteria: QualityCriteria;
  required: boolean;
  automated: boolean;
  frequency: CheckFrequency;
  result?: QualityCheckResult;
  checkedBy?: string;
  checkedAt?: Date;
}

export type QualityCheckType = 
  | 'dimensional'
  | 'visual'
  | 'functional'
  | 'material'
  | 'performance'
  | 'safety'
  | 'compliance';

export type QualityCheckMethod = 
  | 'manual'
  | 'automated'
  | 'visual-inspection'
  | 'measurement'
  | 'testing';

export interface QualityCriteria {
  specification: string;
  tolerance?: string;
  standard?: string;
  passFailCriteria: string;
}

export type CheckFrequency = 
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'per-batch'
  | 'per-item'
  | 'conditional';

export type QualityCheckResult = 
  | 'pass'
  | 'fail'
  | 'conditional'
  | 'not-applicable';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DataType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'array'
  | 'object'
  | 'file'
  | 'image'
  | 'video'
  | 'custom';

export type DataFormat = 
  | 'json'
  | 'xml'
  | 'csv'
  | 'pdf'
  | 'dwg'
  | 'step'
  | 'iges'
  | 'stl'
  | 'obj'
  | 'ply'
  | 'jpg'
  | 'png'
  | 'mp4'
  | 'custom';

export interface DataSchema {
  type: DataType;
  properties?: Record<string, DataSchema>;
  required?: string[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
}

export interface InputSource {
  type: 'static' | 'dynamic' | 'computed';
  value?: any;
  reference?: string; // reference to other step output
  expression?: string;
}

export interface OutputDestination {
  type: 'variable' | 'file' | 'database' | 'api';
  target: string;
  format?: DataFormat;
}

export interface InputValidation {
  required: boolean;
  type: DataType;
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  custom?: string; // validation function
}

export interface ResourceRequirement {
  type: ResourceType;
  name: string;
  quantity: number;
  duration?: number; // minutes
  specifications?: Record<string, any>;
}
