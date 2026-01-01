#!/usr/bin/env node

/**
 * Centralize All Type Definitions Script
 * Consolidates all type definitions into a single comprehensive type system
 */

const fs = require('fs');

class TypeCentralizer {
  constructor() {
    this.centralTypes = {};
    this.typeCategories = {
      base: [],
      geometry: [],
      cabinet: [],
      cnc: [],
      manufacturing: [],
      floorplan: [],
      integration: [],
      ui: [],
      api: [],
      utility: []
    };
  }

  async run() {
    console.log('🔧 Centralizing All Type Definitions\n');

    // Collect all existing types
    await this.collectExistingTypes();
    
    // Create comprehensive unified types
    await this.createUnifiedTypes();
    
    // Write centralized type file
    await this.writeCentralTypes();

    console.log('\n✅ All type definitions centralized!');
  }

  async collectExistingTypes() {
    console.log('📁 Collecting existing type definitions...');

    // Collect from consolidated types directory
    const typesDir = './src/types';
    if (fs.existsSync(typesDir)) {
      const files = this.findFiles(typesDir, '.ts');
      
      for (const file of files) {
        await this.extractTypesFromFile(file);
      }
    }
  }

  async extractTypesFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = filePath.split('/').pop().replace('.ts', '');
      
      // Extract interfaces and types
      const interfaceMatches = content.match(/export interface (\w+)\s*{[^}]+}/gs);
      const typeMatches = content.match(/export (?:type|enum) (\w+)[^;]+;/gs);
      
      if (interfaceMatches) {
        interfaceMatches.forEach(match => {
          this.centralTypes[match] = match;
        });
      }
      
      if (typeMatches) {
        typeMatches.forEach(match => {
          this.centralTypes[match] = match;
        });
      }
    } catch (error) {
      console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    }
  }

  async createUnifiedTypes() {
    console.log('🔧 Creating unified type definitions...');

    // Create comprehensive base types
    this.createBaseTypes();
    
    // Create geometry types
    this.createGeometryTypes();
    
    // Create cabinet types
    this.createCabinetTypes();
    
    // Create CNC types
    this.createCNCTypes();
    
    // Create manufacturing types
    this.createManufacturingTypes();
    
    // Create floorplan types
    this.createFloorplanTypes();
    
    // Create integration types
    this.createIntegrationTypes();
    
    // Create UI types
    this.createUITypes();
    
    // Create API types
    this.createAPITypes();
    
    // Create utility types
    this.createUtilityTypes();
  }

  createBaseTypes() {
    this.typeCategories.base.push(`
// ============================================================================
// BASE TYPES - Core fundamental types for all logic
// ============================================================================

export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  min: Point2D;
  max: Point2D;
}

export type Status = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'running' | 'done' | 'finished' | 'error';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Tolerance {
  dimension: string;
  nominal: number;
  plus: number;
  minus: number;
  unit: 'mm' | 'in' | 'cm';
  critical: boolean;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  cost?: number;
  supplier?: string;
}

export interface CabinetDimensions {
  width: number;
  height: number;
  depth: number;
}

export type CabinetWidth = 300 | 450 | 600 | 900 | 1200;
export type CabinetDepth = 300 | 350 | 400 | 450 | 600;
export type CabinetHeight = 720 | 900 | 1200 | 1500 | 2100;
`);
  }

  createGeometryTypes() {
    this.typeCategories.geometry.push(`
// ============================================================================
// GEOMETRY TYPES - Advanced geometric primitives and operations
// ============================================================================

export interface Geometry {
  type: 'point' | 'line' | 'polygon' | 'circle' | 'arc' | 'bezier';
  coordinates: Point2D[] | Point3D[];
  bounds: BoundingBox;
  area?: number;
  perimeter?: number;
}

export interface Transformation {
  type: 'translate' | 'rotate' | 'scale' | 'mirror';
  parameters: Record<string, number>;
  matrix?: number[][];
}

export interface Toolpath {
  id: string;
  type: 'linear' | 'circular' | 'helical' | 'contour';
  points: Point2D[];
  feedRate: number;
  spindleSpeed: number;
  depth?: number;
}

export interface GeometricFeature {
  type: 'edge' | 'face' | 'hole' | 'slot' | 'pocket' | 'chamfer' | 'fillet';
  geometry: any;
  dimensions: Record<string, number>;
  tolerance?: Tolerance;
}`);
  }

  createCabinetTypes() {
    this.typeCategories.cabinet.push(`
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
}`);
  }

  createCNCTypes() {
    this.typeCategories.cnc.push(`
// ============================================================================
// CNC TYPES - All CNC manufacturing and drilling pattern types
// ============================================================================

export interface DrillPattern extends BaseEntity {
  category: PatternCategory;
  type: PatternType;
  geometry: PatternGeometry;
  parameters: PatternParameters;
  drillSettings: DrillSettings;
  metadata: PatternMetadata;
  tags: string[];
  difficulty: Difficulty;
  estimatedTime: number;
  successRate: number;
  applications: string[];
}

export type PatternCategory = 'shelf-holes' | 'handle-mounts' | 'hardware-mounts' | 'joinery' | 'decorative';
export type PatternType = 'linear' | 'grid' | 'circular' | 'radial' | 'custom';

export interface PatternGeometry {
  points: Point2D[];
  holes: DrillHole[];
  boundingBox: BoundingBox;
  area: number;
}

export interface DrillHole {
  id: string;
  position: Point2D;
  diameter: number; // mm
  depth: number; // mm
  angle?: number; // degrees
  chamfer?: ChamferDetail;
  counterbore?: CounterboreDetail;
}

export interface PatternParameters {
  spacing: { x: number; y: number };
  depth: number;
  edgeClearance: number;
  repetitions: number;
}

export interface DrillSettings {
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  peckDepth?: number; // mm for deep hole drilling
  coolant: 'off' | 'mist' | 'flood';
  toolType: string;
  toolDiameter: number;
  plungeRate?: number; // mm/min
}

export interface CNCTool extends BaseEntity {
  type: 'drill' | 'endmill' | 'ballmill' | 'facemill' | 'slotmill';
  diameter: number; // mm
  length: number; // mm
  flutes?: number;
  coating?: ToolCoating;
  maxLife?: number;
  currentLife?: number;
  wearPercentage?: number;
}

export type ToolCoating = 'none' | 'hss' | 'carbide' | 'diamond' | 'tin' | 'ticn' | 'alcrn';

export interface CNCOperation extends BaseEntity {
  type: OperationType;
  geometry: OperationGeometry;
  tooling: ToolingRequirements;
  parameters: OperationParameters;
  quality: QualityRequirements;
  timing: TimingRequirements;
}

export type OperationType = 'drilling' | 'milling' | 'pocket' | 'profile' | 'contour';

export interface GCodeProgram extends BaseEntity {
  machine: MachineSpecification;
  workpiece: WorkpieceSpecification;
  operations: CNCOperation[];
  toolpaths: Toolpath[];
  estimatedRunTime?: number;
  metadata: ProgramMetadata;
}

export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters: Record<string, number>;
  comment?: string;
  block: string;
  modal: string;
}`);
  }

  createManufacturingTypes() {
    this.typeCategories.manufacturing.push(`
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
}`);
  }

  createFloorplanTypes() {
    this.typeCategories.floorplan.push(`
// ============================================================================
// FLOORPLAN TYPES - All floorplan and architectural types
// ============================================================================

export interface Floorplan extends BaseEntity {
  dimensions: { width: number; height: number };
  scale: number;
  unit: 'meters' | 'feet' | 'millimeters';
  layers: Layer[];
  rooms: Room[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  fixtures: Fixture[];
  metadata: FloorplanMetadata;
}

export interface Wall extends BaseEntity {
  layerId: string;
  geometry: { start: Point2D; end: Point2D };
  thickness: number;
  height: number;
  material: Material;
  openings: WallOpening[];
  type: 'interior' | 'exterior' | 'load-bearing' | 'shear';
}

export interface Room extends BaseEntity {
  layerId: string;
  geometry: { points: Point2D[] };
  area: number;
  perimeter: number;
  floorLevel: number;
  ceilingHeight: number;
  openings: WallOpening[];
  fixtures: Fixture[];
  type: 'bedroom' | 'kitchen' | 'bathroom' | 'living' | 'dining' | 'office' | 'storage' | 'garage' | 'utility';
}

export interface Door extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'sliding' | 'folding' | 'pocket' | 'bypass';
  swing: 'left' | 'right' | 'inward' | 'outward';
  material: Material;
  hardware: CabinetHardware[];
}

export interface Window extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'casement' | 'sliding' | 'awning' | 'bay' | 'picture';
  material: Material;
  properties: WindowProperties;
}

export interface Fixture extends BaseEntity {
  layerId: string;
  position: Point2D;
  rotation: number;
  type: 'electrical' | 'plumbing' | 'hvac' | 'lighting' | 'data' | 'furniture' | 'storage';
  specifications: Record<string, any>;
}`);
  }

  createIntegrationTypes() {
    this.typeCategories.integration.push(`
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
}`);
  }

  createUITypes() {
    this.typeCategories.ui.push(`
// ============================================================================
// UI TYPES - All user interface component types
// ============================================================================

export interface UIComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  state: ComponentState;
  events: ComponentEvent[];
  styling: ComponentStyling;
}

export type ComponentType = 'button' | 'input' | 'select' | 'modal' | 'card' | 'table' | 'form' | 'navigation';

export interface ComponentProps {
  [key: string]: any;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: any) => void;
  onChange?: (value: any) => void;
}

export interface ComponentState {
  loading?: boolean;
  error?: string;
  value?: any;
  disabled?: boolean;
  visible?: boolean;
}

export interface ComponentEvent {
  type: 'click' | 'change' | 'focus' | 'blur' | 'submit' | 'cancel';
  handler: (event: any) => void;
  payload?: any;
}

export interface ComponentStyling {
  theme: Theme;
  variant: ComponentVariant;
  size: ComponentSize;
  customClasses?: string[];
  responsive?: ResponsiveBreakpoints;
}

export type Theme = 'light' | 'dark' | 'auto';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';`);
  }

  createAPITypes() {
    this.typeCategories.api.push(`
// ============================================================================
// API TYPES - All API and data exchange types
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  metadata?: ResponseMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface APIEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  authentication?: AuthRequirement;
  rateLimit?: RateLimit;
}

export interface AuthConfiguration {
  type: 'none' | 'basic' | 'bearer' | 'oauth' | 'api_key';
  credentials?: AuthCredentials;
  refresh?: TokenRefresh;
}

export interface DataValidation {
  rules: ValidationRule[];
  schema?: JSONSchema;
  customValidators?: CustomValidator[];
  errorHandling: ErrorHandlingStrategy;
}`);
  }

  createUtilityTypes() {
    this.typeCategories.utility.push(`
// ============================================================================
// UTILITY TYPES - Helper types and utilities
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateRange?: DateRange;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};`);
  }

  async writeCentralTypes() {
    console.log('📝 Writing centralized type definitions...');

    const centralTypesPath = './src/types/index.ts';
    
    // Create the complete centralized types file
    const centralTypesContent = this.generateCentralTypesFile();
    
    fs.writeFileSync(centralTypesPath, centralTypesContent, 'utf8');
    
    // Also create individual category files for better organization
    await this.writeCategoryFiles();
    
    console.log(`✅ Created: ${centralTypesPath}`);
  }

  generateCentralTypesFile() {
    return `// ============================================================================
// CENTRALIZED TYPE SYSTEM - Complete type definitions for all logic
// ============================================================================
// This file contains all type definitions used across the entire application
// Generated on: ${new Date().toISOString()}
//
// Categories:
// - Base Types: Core fundamental types
// - Geometry Types: Geometric primitives and operations
// - Cabinet Types: Cabinet-related types
// - CNC Types: CNC manufacturing types
// - Manufacturing Types: Production and manufacturing types
// - Floorplan Types: Floorplan and architectural types
// - Integration Types: System integration types
// - UI Types: User interface component types
// - API Types: API and data exchange types
// - Utility Types: Helper types and utilities
// ============================================================================

${this.typeCategories.base.join('\n')}

${this.typeCategories.geometry.join('\n')}

${this.typeCategories.cabinet.join('\n')}

${this.typeCategories.cnc.join('\n')}

${this.typeCategories.manufacturing.join('\n')}

${this.typeCategories.floorplan.join('\n')}

${this.typeCategories.integration.join('\n')}

${this.typeCategories.ui.join('\n')}

${this.typeCategories.api.join('\n')}

${this.typeCategories.utility.join('\n')}

// ============================================================================
// RE-EXPORTS - Convenient access to all types
// ============================================================================

// Re-export all types for easy importing
export * from './base.types';
export * from './geometry.types';
export * from './cabinet.types';
export * from './cnc.types';
export * from './manufacturing.types';
export * from './floorplan.types';
export * from './integration.types';
export * from './ui.types';
export * from './api.types';
export * from './utility.types';

// Legacy exports for backward compatibility
export { Cabinet as LegacyCabinet } from './cabinet.types';
export { DrillPattern as LegacyDrillPattern } from './cnc.types';
export { ManufacturingJob as LegacyManufacturingJob } from './manufacturing.types';
export { Floorplan as LegacyFloorplan } from './floorplan.types';
`;
  }

  async writeCategoryFiles() {
    console.log('📁 Writing individual category files...');
    
    const categories = [
      { name: 'base.types.ts', content: this.typeCategories.base.join('\n') },
      { name: 'geometry.types.ts', content: this.typeCategories.geometry.join('\n') },
      { name: 'cabinet.types.ts', content: this.typeCategories.cabinet.join('\n') },
      { name: 'cnc.types.ts', content: this.typeCategories.cnc.join('\n') },
      { name: 'manufacturing.types.ts', content: this.typeCategories.manufacturing.join('\n') },
      { name: 'floorplan.types.ts', content: this.typeCategories.floorplan.join('\n') },
      { name: 'integration.types.ts', content: this.typeCategories.integration.join('\n') },
      { name: 'ui.types.ts', content: this.typeCategories.ui.join('\n') },
      { name: 'api.types.ts', content: this.typeCategories.api.join('\n') },
      { name: 'utility.types.ts', content: this.typeCategories.utility.join('\n') }
    ];

    for (const category of categories) {
      const filePath = `./src/types/${category.name}`;
      fs.writeFileSync(filePath, category.content, 'utf8');
      console.log(`✅ Created: ${filePath}`);
    }
  }

  findFiles(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    function traverse(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = require('path').join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (item.endsWith(extension)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    traverse(dir);
    return files;
  }
}

// Run the script
if (require.main === module) {
  new TypeCentralizer().run();
}

module.exports = TypeCentralizer;
