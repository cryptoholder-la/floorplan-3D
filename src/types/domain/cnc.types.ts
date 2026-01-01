// ============================================================================
// CNC TYPES - Manufacturing and drilling pattern types
// ============================================================================

import { Point2D, Tolerance, Material } from '@/types';

export interface DrillPattern {
  id: string;
  name: string;
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
  boundingBox: { min: Point2D; max: Point2D };
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

export interface ChamferDetail {
  depth: number;
  angle: number;
}

export interface CounterboreDetail {
  diameter: number;
  depth: number;
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

export interface PatternMetadata {
  author?: string;
  version?: string;
  notes?: string;
  tags?: string[];
}

export interface CNCTool {
  id: string;
  name: string;
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

export interface CNCOperation {
  id: string;
  name: string;
  type: OperationType;
  geometry: any;
  tooling: ToolingRequirements;
  parameters: OperationParameters;
  quality: QualityRequirements;
  timing: TimingRequirements;
}

export type OperationType = 'drilling' | 'milling' | 'pocket' | 'profile' | 'contour';

export interface ToolingRequirements {
  tools: CNCTool[];
  fixtures: string[];
  setupTime: number; // minutes
}

export interface OperationParameters {
  spindleSpeed: number;
  feedRate: number;
  depthOfCut: number;
  stepOver: number;
  coolant: string;
}

export interface QualityRequirements {
  tolerance: Tolerance[];
  surfaceFinish: string;
  inspectionPoints: string[];
}

export interface TimingRequirements {
  estimatedRunTime: number; // minutes
  setupTime: number; // minutes
  totalCycleTime: number; // minutes
}

export interface GCodeProgram {
  id: string;
  name: string;
  machine: MachineSpecification;
  workpiece: WorkpieceSpecification;
  operations: CNCOperation[];
  toolpaths: any[];
  estimatedRunTime?: number;
  metadata: ProgramMetadata;
}

export interface MachineSpecification {
  type: string;
  model: string;
  manufacturer: string;
  workArea: { x: number; y: number; z: number };
  spindle: { maxRPM: number; power: number };
  table: { size: { x: number; y: number } };
}

export interface WorkpieceSpecification {
  material: Material;
  dimensions: { x: number; y: number; z: number };
  origin: Point2D;
  zeroPoint: Point2D;
}

export interface ProgramMetadata {
  author?: string;
  version?: string;
  notes?: string;
  tags?: string[];
}

export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters: Record<string, number>;
  comment?: string;
  block: string;
  modal: string;
}
