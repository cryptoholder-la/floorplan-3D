// ============================================================================
// CENTRALIZED TYPE SYSTEM - Complete /**
 * TypeScript type definition for type
 * 
 * @description
 * Defines the structure and properties for type.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: type = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for type
 * 
 * @description
 * Defines the structure and properties for type.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: type = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for type
 * 
 * @description
 * Defines the structure and properties for type.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: type = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for type
 * 
 * @description
 * Defines the structure and properties for type.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: type = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
type definitions for all logic
// ============================================================================
// This file contains all type definitions used across the entire application
// Generated on: 2026-01-01T03:06:05.781Z
//
// Categories:
// - Base Types: Core fundamental types
// - Geometry Types: Geometric primitives and operations
// - Cabinet Types: Cabinet-related types
// - CNC Types: CNC manufacturing types
// - Manufacturing Types: Production and manufacturing types
// - Floorplan Types: Floorplan and architectural types
// - Integration Types: System integration types
// - UI Types: User /**
 * TypeScript type definition for interface
 * 
 * @description
 * Defines the structure and properties for interface.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: interface = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for interface
 * 
 * @description
 * Defines the structure and properties for interface.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: interface = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
interface component types
// - API Types: API and data exchange types
// - Utility Types: Helper types and utilities
// ============================================================================


// ============================================================================
// BASE TYPES - Core fundamental types for all logic
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface BoundingBox {
  min: Point2D;
  max: Point2D;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type Status = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'running' | 'done' | 'finished' | 'error';
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type Priority = 'low' | 'medium' | 'high' | 'critical';
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Tolerance {
  dimension: string;
  nominal: number;
  plus: number;
  minus: number;
  unit: 'mm' | 'in' | 'cm';
  critical: boolean;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Material {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  cost?: number;
  supplier?: string;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetDimensions {
  width: number;
  height: number;
  depth: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type CabinetWidth = 300 | 450 | 600 | 900 | 1200;
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type CabinetDepth = 300 | 350 | 400 | 450 | 600;
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type CabinetHeight = 720 | 900 | 1200 | 1500 | 2100;



// ============================================================================
// GEOMETRY TYPES - Advanced geometric primitives and operations
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Geometry {
  type: 'point' | 'line' | 'polygon' | 'circle' | 'arc' | 'bezier';
  coordinates: Point2D[] | Point3D[];
  bounds: BoundingBox;
  area?: number;
  perimeter?: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Transformation {
  type: 'translate' | 'rotate' | 'scale' | 'mirror';
  parameters: Record<string, number>;
  matrix?: number[][];
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Toolpath {
  id: string;
  type: 'linear' | 'circular' | 'helical' | 'contour';
  points: Point2D[];
  feedRate: number;
  spindleSpeed: number;
  depth?: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface GeometricFeature {
  type: 'edge' | 'face' | 'hole' | 'slot' | 'pocket' | 'chamfer' | 'fillet';
  geometry: any;
  dimensions: Record<string, number>;
  tolerance?: Tolerance;
}


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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetPart extends BaseEntity {
  partType: 'side' | 'top' | 'bottom' | 'back' | 'door' | 'drawer' | 'shelf';
  material: Material;
  dimensions: CabinetDimensions;
  edgeBanding?: EdgeBanding;
  machining?: MachiningDetails;
  hardware?: CabinetHardware;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetMaterial extends BaseEntity {
  thickness: number;
  pricePerSheet?: number;
  costPerUnit?: number;
  supplier?: string;
  finish: string;
  grain?: string;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetHardware extends BaseEntity {
  type: 'hinge' | 'handle' | 'slide' | 'support' | 'bracket';
  material: string;
  finish: string;
  quantity?: number;
  unitPrice?: number;
  totalCost?: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetConfiguration {
  style: 'traditional' | 'modern' | 'shaker' | 'flat-panel';
  construction: 'frameless' | 'face-frame' | 'overlay';
  features: string[];
  customizations: Record<string, any>;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CabinetMetadata {
  designer?: string;
  project?: string;
  client?: string;
  room?: string;
  installation?: InstallationDetails;
  notes?: string;
}


// ============================================================================
// CNC TYPES - All CNC manufacturing and drilling pattern types
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type PatternCategory = 'shelf-holes' | 'handle-mounts' | 'hardware-mounts' | 'joinery' | 'decorative';
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type PatternType = 'linear' | 'grid' | 'circular' | 'radial' | 'custom';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface PatternGeometry {
  points: Point2D[];
  holes: DrillHole[];
  boundingBox: BoundingBox;
  area: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface DrillHole {
  id: string;
  position: Point2D;
  diameter: number; // mm
  depth: number; // mm
  angle?: number; // degrees
  chamfer?: ChamferDetail;
  counterbore?: CounterboreDetail;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface PatternParameters {
  spacing: { x: number; y: number };
  depth: number;
  edgeClearance: number;
  repetitions: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface DrillSettings {
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  peckDepth?: number; // mm for deep hole drilling
  coolant: 'off' | 'mist' | 'flood';
  toolType: string;
  toolDiameter: number;
  plungeRate?: number; // mm/min
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type ToolCoating = 'none' | 'hss' | 'carbide' | 'diamond' | 'tin' | 'ticn' | 'alcrn';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface CNCOperation extends BaseEntity {
  type: OperationType;
  geometry: OperationGeometry;
  tooling: ToolingRequirements;
  parameters: OperationParameters;
  quality: QualityRequirements;
  timing: TimingRequirements;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type OperationType = 'drilling' | 'milling' | 'pocket' | 'profile' | 'contour';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface GCodeProgram extends BaseEntity {
  machine: MachineSpecification;
  workpiece: WorkpieceSpecification;
  operations: CNCOperation[];
  toolpaths: Toolpath[];
  estimatedRunTime?: number;
  metadata: ProgramMetadata;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters: Record<string, number>;
  comment?: string;
  block: string;
  modal: string;
}


// ============================================================================
// MANUFACTURING TYPES - All manufacturing-related type definitions
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface MachineSettings {
  machineType: MachineType;
  spindleSpeed?: number; // RPM
  feedRate?: number; // mm/min or in/min
  depthOfCut?: number; // mm or in
  stepOver?: number; // percentage of tool diameter
  coolant?: CoolantSetting;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type MachineType = 'cnc_router' | 'cnc_mill' | 'laser_cutter' | 'plasma_cutter' | 'waterjet';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ToolRequirement extends BaseEntity {
  toolId: string;
  toolType: ToolType;
  diameter: number; // mm
  length: number; // mm
  coating?: ToolCoating;
  quantity?: number;
  estimatedCost?: number;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type QualityCheckType = 'dimensional' | 'surface_finish' | 'alignment' | 'material' | 'assembly';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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


// ============================================================================
// FLOORPLAN TYPES - All floorplan and architectural types
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Wall extends BaseEntity {
  layerId: string;
  geometry: { start: Point2D; end: Point2D };
  thickness: number;
  height: number;
  material: Material;
  openings: WallOpening[];
  type: 'interior' | 'exterior' | 'load-bearing' | 'shear';
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
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

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Door extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'sliding' | 'folding' | 'pocket' | 'bypass';
  swing: 'left' | 'right' | 'inward' | 'outward';
  material: Material;
  hardware: CabinetHardware[];
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Window extends BaseEntity {
  layerId: string;
  position: { wall: string; distance: number };
  dimensions: { width: number; height: number };
  type: 'single' | 'double' | 'casement' | 'sliding' | 'awning' | 'bay' | 'picture';
  material: Material;
  properties: WindowProperties;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface Fixture extends BaseEntity {
  layerId: string;
  position: Point2D;
  rotation: number;
  type: 'electrical' | 'plumbing' | 'hvac' | 'lighting' | 'data' | 'furniture' | 'storage';
  specifications: Record<string, any>;
}


// ============================================================================
// INTEGRATION TYPES - All system integration and workflow types
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface MasterIntegration extends BaseEntity {
  workflow: IntegratedWorkflow;
  systems: SystemConfiguration[];
  dataFlow: DataFlowConfiguration;
  synchronization: SyncConfiguration;
  monitoring: MonitoringConfiguration;
  status: Status;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface IntegratedWorkflow {
  steps: WorkflowStep[];
  dependencies: WorkflowDependency[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  outputs: WorkflowOutput[];
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface SystemConfiguration {
  systemId: string;
  systemType: 'cnc' | 'cad' | 'cam' | 'erp' | 'inventory' | 'design';
  settings: Record<string, any>;
  endpoints: APIEndpoint[];
  authentication: AuthConfiguration;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface DataFlowConfiguration {
  sources: DataSource[];
  destinations: DataDestination[];
  transformations: DataTransformation[];
  validation: DataValidation[];
  scheduling: FlowSchedule;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface SyncConfiguration {
  frequency: 'real-time' | 'scheduled' | 'manual';
  conflictResolution: ConflictResolutionStrategy;
  errorHandling: ErrorHandlingStrategy;
  logging: LoggingConfiguration;
}


// ============================================================================
// UI TYPES - All user interface component types
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface UIComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  state: ComponentState;
  events: ComponentEvent[];
  styling: ComponentStyling;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type ComponentType = 'button' | 'input' | 'select' | 'modal' | 'card' | 'table' | 'form' | 'navigation';

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ComponentProps {
  [key: string]: any;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: any) => void;
  onChange?: (value: any) => void;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ComponentState {
  loading?: boolean;
  error?: string;
  value?: any;
  disabled?: boolean;
  visible?: boolean;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ComponentEvent {
  type: 'click' | 'change' | 'focus' | 'blur' | 'submit' | 'cancel';
  handler: (event: any) => void;
  payload?: any;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ComponentStyling {
  theme: Theme;
  variant: ComponentVariant;
  size: ComponentSize;
  customClasses?: string[];
  responsive?: ResponsiveBreakpoints;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type Theme = 'light' | 'dark' | 'auto';
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';


// ============================================================================
// API TYPES - All API and data exchange types
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  metadata?: ResponseMetadata;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface APIEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  authentication?: AuthRequirement;
  rateLimit?: RateLimit;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface AuthConfiguration {
  type: 'none' | 'basic' | 'bearer' | 'oauth' | 'api_key';
  credentials?: AuthCredentials;
  refresh?: TokenRefresh;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface DataValidation {
  rules: ValidationRule[];
  schema?: JSONSchema;
  customValidators?: CustomValidator[];
  errorHandling: ErrorHandlingStrategy;
}


// ============================================================================
// UTILITY TYPES - Helper types and utilities
// ============================================================================

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateRange?: DateRange;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * TypeScript type definition for export
 * 
 * @description
 * Defines the structure and properties for export.
 * 
 * @template T - Generic type parameter
 * 
 * @example
 * // Example usage:
 * const variable: export = {
 *   // properties
 * };
 * 
 * @since 1.0.0
 * @author Development Team
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// RE-EXPORTS - Convenient access to all types
// ============================================================================

// Re-export all types for easy importing
export * from './base.types';
import { CabinetHeight } from '@/types';
import { sortBy } from "@/lib/utils/array";
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
