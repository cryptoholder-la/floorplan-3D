// CNC TYPES - CNC manufacturing and drilling pattern types
// Consolidates all CNC-related types from fragmented files

import { 
  BaseEntity, 
  Material, 
  Tolerance, 
  Point2D, 
  Point3D,
  Status,
  Priority,
  Difficulty,
  LengthUnit
} from '../core/base.types';
import { 
  Polygon, 
  Rectangle, 
  BoundingBox,
  Toolpath,
  Tool,
  ToolpathParameters,
  ToolType,
  ToolMaterial,
  ToolCoating,
  CoolantType
} from '../core/geometry.types';

// ============================================================================
// DRILL PATTERNS
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
  estimatedTime: number; // minutes
  successRate: number; // percentage
  applications: string[];
}

export type PatternCategory = 
  | 'cabinet-hardware'
  | 'shelf-holes'
  | 'handle-mounts'
  | 'hinge-plates'
  | 'drawer-slides'
  | 'assembly'
  | 'custom';

export type PatternType = 
  | 'grid'
  | 'linear'
  | 'circular'
  | 'arc'
  | 'custom'
  | 'radial'
  | 'spiral'
  | 'hexagonal';

export interface PatternGeometry {
  points: Point2D[];
  holes: DrillHole[];
  boundingBox: Rectangle;
  perimeter: number;
  area: number;
}

export interface DrillHole {
  id: string;
  position: Point2D;
  diameter: number; // mm
  depth: number; // mm
  tolerance: Tolerance;
  angle?: number; // degrees from vertical
  chamfer?: ChamferDetail;
  counterbore?: CounterboreDetail;
  notes?: string;
}

export interface ChamferDetail {
  diameter: number; // mm
  depth: number; // mm
  angle: number; // degrees
}

export interface CounterboreDetail {
  diameter: number; // mm
  depth: number; // mm
  clearance: number; // mm
}

export interface PatternParameters {
  spacing: {
    x: number;
    y: number;
  };
  patternSize: {
    width: number;
    height: number;
  };
  origin: Point2D;
  rotation: number; // degrees
  mirror: boolean;
  scale: number;
  repetitions: number;
}

export interface DrillSettings {
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  peckDepth?: number; // mm for deep hole drilling
  dwellTime?: number; // seconds at bottom of hole
  retractHeight?: number; // mm above surface
  coolant: CoolantType;
  toolType: ToolType;
  toolDiameter: number; // mm
  plungeRate?: number; // mm/min
}

export interface PatternMetadata {
  createdBy: string;
  version: string;
  lastModified: Date;
  usage: PatternUsage;
  validation: PatternValidation;
  dependencies: PatternDependency[];
}

export interface PatternUsage {
  useCount: number;
  lastUsed?: Date;
  projects: string[];
  averageTime: number; // minutes
  successRate: number; // percentage
}

export interface PatternValidation {
  valid: boolean;
  errors: PatternError[];
  warnings: PatternWarning[];
  lastValidated: Date;
}

export interface PatternError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  position?: Point2D;
}

export interface PatternWarning {
  code: string;
  message: string;
  suggestion?: string;
  position?: Point2D;
}

export interface PatternDependency {
  type: 'tool' | 'material' | 'machine' | 'fixture';
  id: string;
  name: string;
  required: boolean;
}

// ============================================================================
// CNC OPERATIONS
// ============================================================================

export interface CNCOperation extends BaseEntity {
  type: OperationType;
  geometry: OperationGeometry;
  tooling: ToolingRequirements;
  parameters: OperationParameters;
  quality: QualityRequirements;
  timing: TimingRequirements;
  status: Status;
  priority: Priority;
}

export type OperationType = 
  | 'drill'
  | 'mill'
  | 'cut'
  | 'tap'
  | 'bore'
  | 'ream'
  | 'counterbore'
  | 'countersink'
  | 'chamfer'
  | 'face'
  | 'profile'
  | 'pocket';

export interface OperationGeometry {
  toolpath: Toolpath;
  boundingBox: BoundingBox;
  materialRemoval?: MaterialRemoval;
  features: GeometricFeature[];
}

export interface MaterialRemoval {
  volume: number; // cubic mm
  weight: number; // kg
  chips: ChipData;
  time: number; // minutes
}

export interface ChipData {
  type: 'spiral' | 'broken' | 'continuous';
  size: 'fine' | 'medium' | 'coarse';
  evacuation: ChipEvacuation;
}

export interface ChipEvacuation {
  method: 'air' | 'vacuum' | 'flood' | 'manual';
  pressure?: number; // PSI
  flowRate?: number; // CFM
}

export interface GeometricFeature {
  type: 'edge' | 'face' | 'hole' | 'slot' | 'pocket' | 'chamfer' | 'fillet';
  geometry: any;
  dimensions: {
    length?: number;
    width?: number;
    depth?: number;
    diameter?: number;
    radius?: number;
  };
  tolerance: Tolerance;
  surfaceFinish: SurfaceFinish;
}

export interface SurfaceFinish {
  value: number; // Ra in micrometers
  method: 'mill' | 'grind' | 'polish' | 'lap';
  tool: string;
  parameters: Record<string, number>;
}

export interface ToolingRequirements {
  primaryTool: Tool;
  secondaryTools?: Tool[];
  fixtures: Fixture[];
  accessories: Accessory[];
  toolLife: ToolLife;
}

export interface Fixture {
  id: string;
  name: string;
  type: FixtureType;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  mounting: FixtureMounting;
  capacity: number; // number of workpieces
  setupTime: number; // minutes
}

export type FixtureType = 
  | 'vise'
  | 'clamp'
  | 'jig'
  | 'custom'
  | 'vacuum'
  | 'magnetic'
  | 'hydraulic';

export interface FixtureMounting {
  method: 'bolt' | 'clamp' | 'magnetic' | 'vacuum';
  pattern: Point2D[];
  hardware: string[];
}

export interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  purpose: string;
  specifications: Record<string, any>;
}

export type AccessoryType = 
  | 'probe'
  | 'touch-off'
  | 'tool-setter'
  | 'work-light'
  | 'coolant-nozzle'
  | 'dust-extraction';

export interface ToolLife {
  estimated: number; // hours
  actual?: number; // hours
  remaining: number; // percentage
  factors: ToolLifeFactor[];
}

export interface ToolLifeFactor {
  factor: 'material' | 'speed' | 'feed' | 'depth' | 'coolant';
  impact: number; // percentage impact
  value: number;
}

export interface OperationParameters {
  depthOfCut: number; // mm
  stepOver?: number; // percentage of tool diameter
  stepDown?: number; // mm per pass
  widthOfCut?: number; // mm
  engagement: EngagementParameters;
  optimization: OptimizationParameters;
}

export interface EngagementParameters {
  radial: number; // percentage of tool diameter
  axial: number; // percentage of tool diameter
  chipLoad: number; // mm per tooth
  cuttingSpeed: number; // m/min
}

export interface OptimizationParameters {
  adaptiveClearing: boolean;
  highSpeedMachining: boolean;
  trochoidal: boolean;
  dynamic: boolean;
  constants: {
    stepOver?: number;
    stepDown?: number;
    angle?: number;
    radius?: number;
  };
}

export interface QualityRequirements {
  tolerances: Tolerance[];
  surfaceFinish: SurfaceFinish[];
  inspection: InspectionRequirements;
  validation: ValidationRequirements;
}

export interface InspectionRequirements {
  method: 'manual' | 'automated' | 'coordinate-measuring';
  frequency: 'every-part' | 'sampling' | 'first-article';
  criteria: InspectionCriteria[];
}

export interface InspectionCriteria {
  characteristic: string;
  specification: Tolerance;
  instrument: string;
  method: string;
}

export interface ValidationRequirements {
  inProcess: boolean;
  postProcess: boolean;
  statistical: boolean;
  sampleSize: number;
  controlLimits: ControlLimits;
}

export interface ControlLimits {
  upper: number;
  lower: number;
  target: number;
  standardDeviation: number;
}

export interface TimingRequirements {
  estimated: TimeEstimate;
  actual?: TimeActual;
  optimization: TimeOptimization;
}

export interface TimeEstimate {
  setup: number; // minutes
  machining: number; // minutes
  toolChange: number; // minutes
  inspection: number; // minutes
  total: number; // minutes
}

export interface TimeActual {
  setup: number; // minutes
  machining: number; // minutes
  toolChange: number; // minutes
  inspection: number; // minutes
  total: number; // minutes
  variance: number; // percentage from estimate
}

export interface TimeOptimization {
  strategies: OptimizationStrategy[];
  potentialSavings: number; // percentage
  implementation: ImplementationPlan;
}

export interface OptimizationStrategy {
  type: 'tool-selection' | 'parameter-adjustment' | 'toolpath-optimization' | 'fixture-improvement';
  description: string;
  impact: number; // percentage time reduction
  cost: number;
  difficulty: Difficulty;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  timeline: number; // days
  resources: string[];
  risks: string[];
}

export interface ImplementationPhase {
  name: string;
  duration: number; // days
  tasks: string[];
  dependencies: string[];
}

// ============================================================================
// G-CODE GENERATION
// ============================================================================

export interface GCodeProgram extends BaseEntity {
  machine: MachineSpecification;
  workpiece: WorkpieceSpecification;
  operations: CNCOperation[];
  commands: GCodeCommand[];
  settings: ProgramSettings;
  simulation: SimulationResults;
  validation: ProgramValidation;
  metadata: ProgramMetadata;
}

export interface MachineSpecification {
  controller: ControllerType;
  axes: AxisConfiguration[];
  spindle: SpindleSpecification;
  toolChanger: ToolChangerSpecification;
  workArea: WorkArea;
  capabilities: MachineCapabilities;
}

export type ControllerType = 
  | 'fanuc'
  | 'siemens'
  | 'haas'
  | 'mazak'
  | 'okuma'
  | 'mach3'
  | 'linuxcnc'
  | 'grbl';

export interface AxisConfiguration {
  axis: 'X' | 'Y' | 'Z' | 'A' | 'B' | 'C';
  type: 'linear' | 'rotary';
  travel: number; // mm or degrees
  resolution: number; // mm or degrees
  maximumSpeed: number; // mm/min or deg/min
  acceleration: number; // mm/s² or deg/s²
}

export interface SpindleSpecification {
  power: number; // kW
  maxSpeed: number; // RPM
  minSpeed: number; // RPM
  taper: string; // e.g., 'R8', 'BT30', 'CAT40'
  orientation: 'horizontal' | 'vertical';
  coolant: boolean;
}

export interface ToolChangerSpecification {
  type: 'manual' | 'automatic' | 'carousel' | 'rack' | 'chain';
  capacity: number;
  changeTime: number; // seconds
  toolToToolTime: number; // seconds
  accuracy: number; // mm
}

export interface WorkArea {
  x: number; // mm
  y: number; // mm
  z: number; // mm
  tableType: 'fixed' | 'tilt' | 'rotary';
  loadCapacity: number; // kg
}

export interface MachineCapabilities {
  axes: number; // 2, 3, 4, or 5
  rigidTapping: boolean;
  highSpeedMachining: boolean;
  coolantThrough: boolean;
  probe: boolean;
  toolMeasurement: boolean;
  spindleOrientation: boolean;
}

export interface WorkpieceSpecification {
  material: Material;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number; // kg
  fixturing: FixturingMethod;
  zeroPoint: WorkpieceZero;
  stock: StockModel;
}

export interface FixturingMethod {
  type: 'clamp' | 'vise' | 'vacuum' | 'custom';
  positions: Point3D[];
  forces: {
    clamping: number; // N
    cutting: number; // N
  };
  deflection: number; // mm
}

export interface WorkpieceZero {
  position: Point3D;
  method: 'probe' | 'indicator' | 'preset' | 'manual';
  accuracy: number; // mm
}

export interface StockModel {
  type: 'rectangular' | 'cylindrical' | 'complex';
  geometry: any;
  allowances: {
    x: number; // mm
    y: number; // mm
    z: number; // mm
  };
}

export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters?: Record<string, number>;
  comment?: string;
  block: BlockNumber;
  modal: ModalState;
}

export interface BlockNumber {
  major: number;
  minor?: number;
}

export interface ModalState {
  motion: MotionMode;
  plane: PlaneSelection;
  units: UnitsMode;
  coordinate: CoordinateMode;
  feedRate: FeedRateMode;
  spindle: SpindleMode;
  coolant: CoolantMode;
  tool: ToolMode;
}

export type MotionMode = 
  | 'rapid' | 'linear' | 'circular' | 'dwell' | 'canned'
  | 'canned-cycle' | 'custom';

export type PlaneSelection = 'XY' | 'XZ' | 'YZ';
export type UnitsMode = 'metric' | 'imperial';
export type CoordinateMode = 'absolute' | 'incremental';
export type FeedRateMode = 'per-minute' | 'per-revolution';
export type SpindleMode = 'rpm' | 'css' | 'constant-surface-speed';
export type CoolantMode = 'off' | 'mist' | 'flood' | 'through';
export type ToolMode = 'tool-change' | 'tool-offset' | 'tool-length';

export interface ProgramSettings {
  units: LengthUnit;
  absoluteMode: boolean;
  coolantMode: CoolantMode;
  safety: SafetySettings;
  optimization: OptimizationSettings;
  output: OutputSettings;
}

export interface SafetySettings {
  toolChangeHeight: number; // mm
  rapidHeight: number; // mm
  clearancePlane: number; // mm
  retractPlane: number; // mm
  feedRateLimits: {
    minimum: number;
    maximum: number;
  };
  spindleLimits: {
    minimum: number;
    maximum: number;
  };
}

export interface OptimizationSettings {
  lookAhead: boolean;
  highSpeed: boolean;
  adaptive: boolean;
  smoothing: boolean;
  cornerRounding: number; // mm
  accelerationLimits: boolean;
}

export interface OutputSettings {
  format: 'standard' | 'condensed' | 'verbose';
  comments: boolean;
  lineNumbers: boolean;
  blockNumbers: boolean;
  timestamp: boolean;
  checksum: boolean;
}

export interface SimulationResults {
  toolPath: ToolPathData;
  materialRemoval: MaterialRemovalData;
  timing: TimingData;
  collisions: CollisionData;
  quality: QualityData;
}

export interface ToolPathData {
  points: Point3D[];
  length: number; // mm
  bounds: BoundingBox;
  segments: ToolPathSegment[];
}

export interface ToolPathSegment {
  type: 'rapid' | 'feed' | 'arc' | 'dwell';
  start: Point3D;
  end: Point3D;
  length: number; // mm
  time: number; // seconds
  tool: string;
}

export interface MaterialRemovalData {
  volume: number; // cubic mm
  mass: number; // kg
  rate: number; // cubic mm/min
  efficiency: number; // percentage
}

export interface TimingData {
  estimated: TimeEstimate;
  simulated: TimeEstimate;
  breakdown: TimingBreakdown;
}

export interface TimingBreakdown {
  cutting: number; // percentage
  rapid: number; // percentage
  toolChange: number; // percentage
  dwell: number; // percentage;
  miscellaneous: number; // percentage
}

export interface CollisionData {
  detected: boolean;
  count: number;
  details: CollisionDetail[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CollisionDetail {
  type: CollisionType;
  position: Point3D;
  tool: string;
  workpiece: string;
  fixture?: string;
  machine?: string;
  depth: number; // mm
  time: number; // seconds
}

export type CollisionType = 
  | 'tool-workpiece'
  | 'tool-fixture'
  | 'tool-machine'
  | 'workpiece-fixture'
  | 'workpiece-machine'
  | 'fixture-machine';

export interface QualityData {
  surfaceFinish: SurfaceFinishData;
  dimensionalAccuracy: DimensionalData;
  toolWear: ToolWearData;
}

export interface SurfaceFinishData {
  predicted: number; // Ra micrometers
  target: number; // Ra micrometers
  confidence: number; // percentage
}

export interface DimensionalData {
  tolerances: ToleranceCompliance[];
  overall: number; // percentage compliance
}

export interface ToleranceCompliance {
  dimension: string;
  tolerance: Tolerance;
  predicted: number;
  compliance: boolean;
  confidence: number; // percentage
}

export interface ToolWearData {
  estimated: number; // percentage
  critical: boolean;
  recommendations: string[];
}

export interface ProgramValidation {
  syntax: SyntaxValidation;
  semantics: SemanticValidation;
  safety: SafetyValidation;
  performance: PerformanceValidation;
}

export interface SyntaxValidation {
  valid: boolean;
  errors: SyntaxError[];
  warnings: SyntaxWarning[];
}

export interface SyntaxError {
  line: number;
  command: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface SyntaxWarning {
  line: number;
  command: string;
  message: string;
  suggestion?: string;
}

export interface SemanticValidation {
  valid: boolean;
  errors: SemanticError[];
  warnings: SemanticWarning[];
}

export interface SemanticError {
  type: 'inconsistent' | 'impossible' | 'dangerous' | 'unsupported';
  description: string;
  context: string;
  severity: 'error' | 'warning';
}

export interface SemanticWarning {
  type: 'inefficient' | 'unusual' | 'deprecated' | 'alternative';
  description: string;
  suggestion?: string;
}

export interface SafetyValidation {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  concerns: SafetyConcern[];
  recommendations: SafetyRecommendation[];
}

export interface SafetyConcern {
  type: 'collision' | 'over-travel' | 'excessive-speed' | 'tool-failure';
  description: string;
  probability: number; // 0-1
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface SafetyRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  reason: string;
  implementation: string;
}

export interface PerformanceValidation {
  efficiency: number; // percentage
  bottlenecks: PerformanceBottleneck[];
  optimizations: PerformanceOptimization[];
}

export interface PerformanceBottleneck {
  type: 'tool-change' | 'rapid-move' | 'cutting' | 'coolant';
  impact: number; // percentage of total time
  description: string;
  location: string;
}

export interface PerformanceOptimization {
  type: 'parameter' | 'toolpath' | 'tooling' | 'sequence';
  potential: number; // percentage improvement
  effort: 'low' | 'medium' | 'high';
  description: string;
}

export interface ProgramMetadata {
  version: string;
  author: string;
  created: Date;
  modified: Date;
  revision: number;
  notes: string[];
  tags: string[];
  references: string[];
}

// ============================================================================
// PATTERN LIBRARY
// ============================================================================

export interface PatternLibrary extends BaseEntity {
  patterns: Record<string, DrillPattern>;
  categories: Record<PatternCategory, CategoryInfo>;
  manufacturers: ManufacturerInfo[];
  standards: ComplianceStandard[];
  version: string;
  lastUpdated: Date;
  statistics: LibraryStatistics;
}

export interface CategoryInfo {
  name: string;
  description: string;
  patterns: string[];
  icon?: string;
  color?: string;
}

export interface ManufacturerInfo {
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  patterns: string[];
  standards: string[];
}

export interface ComplianceStandard {
  name: string;
  organization: string;
  version: string;
  description: string;
  requirements: StandardRequirement[];
}

export interface StandardRequirement {
  parameter: string;
  specification: any;
  tolerance: Tolerance;
  test: string;
}

export interface LibraryStatistics {
  totalPatterns: number;
  patternsByCategory: Record<PatternCategory, number>;
  patternsByType: Record<PatternType, number>;
  patternsByDifficulty: Record<Difficulty, number>;
  averageComplexity: number;
  mostUsed: string[];
  recentlyAdded: string[];
  usage: UsageStatistics;
}

export interface UsageStatistics {
  totalUses: number;
  usesByCategory: Record<PatternCategory, number>;
  usesByType: Record<PatternType, number>;
  averageTime: number; // minutes
  successRate: number; // percentage
  errorRate: number; // percentage
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PATTERN_CATEGORIES: PatternCategory[] = [
  'cabinet-hardware', 'shelf-holes', 'handle-mounts',
  'hinge-plates', 'drawer-slides', 'assembly', 'custom'
];

export const PATTERN_TYPES: PatternType[] = [
  'grid', 'linear', 'circular', 'arc', 'custom',
  'radial', 'spiral', 'hexagonal'
];

export const OPERATION_TYPES: OperationType[] = [
  'drill', 'mill', 'cut', 'tap', 'bore', 'ream',
  'counterbore', 'countersink', 'chamfer', 'face', 'profile', 'pocket'
];

export const CONTROLLER_TYPES: ControllerType[] = [
  'fanuc', 'siemens', 'haas', 'mazak', 'okuma', 'mach3', 'linuxcnc', 'grbl'
];

export const FIXTURE_TYPES: FixtureType[] = [
  'vise', 'clamp', 'jig', 'custom', 'vacuum', 'magnetic', 'hydraulic'
];

export const ACCESSORY_TYPES: AccessoryType[] = [
  'probe', 'touch-off', 'tool-setter', 'work-light', 'coolant-nozzle', 'dust-extraction'
];

export const COLLISION_TYPES: CollisionType[] = [
  'tool-workpiece', 'tool-fixture', 'tool-machine',
  'workpiece-fixture', 'workpiece-machine', 'fixture-machine'
];

export const DEFAULT_DRILL_SETTINGS: Partial<DrillSettings> = {
  spindleSpeed: 18000,
  feedRate: 1000,
  retractHeight: 5,
  coolant: 'off',
  plungeRate: 500
};

export const DEFAULT_OPERATION_PARAMETERS: Partial<OperationParameters> = {
  depthOfCut: 2,
  stepOver: 40,
  stepDown: 2
};
