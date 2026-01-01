
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
}