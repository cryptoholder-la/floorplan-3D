
// ============================================================================
// INTEGRATION TYPES - All system integration and workflow types
// ============================================================================

export interface MasterIntegration extends BaseEntity {
  workflow: IntegratedWorkflow;
  systems: SystemConfiguration[];
  dataFlow: DataFlowConfiguration;
  synchronization: SyncConfiguration;
  monitoring: MonitoringConfiguration;
  status: Status;
}

export interface IntegratedWorkflow {
  steps: WorkflowStep[];
  dependencies: WorkflowDependency[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  outputs: WorkflowOutput[];
}

export interface SystemConfiguration {
  systemId: string;
  systemType: 'cnc' | 'cad' | 'cam' | 'erp' | 'inventory' | 'design';
  settings: Record<string, any>;
  endpoints: APIEndpoint[];
  authentication: AuthConfiguration;
}

export interface DataFlowConfiguration {
  sources: DataSource[];
  destinations: DataDestination[];
  transformations: DataTransformation[];
  validation: DataValidation[];
  scheduling: FlowSchedule;
}

export interface SyncConfiguration {
  frequency: 'real-time' | 'scheduled' | 'manual';
  conflictResolution: ConflictResolutionStrategy;
  errorHandling: ErrorHandlingStrategy;
  logging: LoggingConfiguration;
}