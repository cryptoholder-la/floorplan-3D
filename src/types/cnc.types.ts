// CNC Type Definitions for Floorplan 3D

export interface DrillPattern {
  id: string;
  name: string;
  description?: string;
  category: PatternCategory;
  type: PatternType;
  
  // Pattern geometry
  points: Point2D[];
  holes: DrillHole[];
  
  // Pattern parameters
  spacing: {
    x: number;
    y: number;
  };
  patternSize: {
    width: number;
    height: number;
  };
  
  // Drill settings
  drillSettings: DrillSettings;
  
  // Metadata
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  
  createdAt: Date;
  updatedAt: Date;
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

export interface DrillHole {
  id: string;
  position: Point2D;
  diameter: number; // mm
  depth: number; // mm
  tolerance?: Tolerance;
  notes?: string;
}

export interface Tolerance {
  diameter: {
    nominal: number;
    plus: number;
    minus: number;
  };
  depth: {
    nominal: number;
    plus: number;
    minus: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface DrillSettings {
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  peckDepth?: number; // mm for deep hole drilling
  dwellTime?: number; // seconds at bottom of hole
  retractHeight?: number; // mm above surface
  coolant: 'off' | 'mist' | 'flood' | 'through';
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
  | 'custom';

export interface CNCTool {
  id: string;
  name: string;
  type: ToolType;
  diameter: number; // mm
  length: number; // mm
  shankDiameter: number; // mm
  fluteCount?: number;
  coating?: ToolCoating;
  material: ToolMaterial;
  
  // Performance specs
  maxSpindleSpeed: number; // RPM
  maxFeedRate: number; // mm/min
  recommendedCutDepth: number; // mm
  
  // Status
  status: ToolStatus;
  currentLife?: number; // hours
  maxLife?: number; // hours
  
  // Location
  location?: string; // tool changer position
  machineId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export type ToolType = 
  | 'drill-bit'
  | 'end-mill'
  | 'router-bit'
  | 'ball-nose'
  | 'chamfer'
  | 'spot-drill'
  | 'counterbore'
  | 'tap';

export type ToolCoating = 
  | 'none'
  | 'tin'
  | 'ticn'
  | 'alcrn'
  | 'diamond';

export type ToolMaterial = 
  | 'hss' // High Speed Steel
  | 'carbide'
  | 'cobalt'
  | 'ceramic'
  | 'diamond';

export type ToolStatus = 
  | 'available'
  | 'in-use'
  | 'sharpening'
  | 'worn'
  | 'broken'
  | 'retired';

export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters?: Record<string, number>;
  comment?: string;
}

export interface GCodeProgram {
  id: string;
  name: string;
  description?: string;
  commands: GCodeCommand[];
  
  // Program settings
  units: 'mm' | 'inches';
  absoluteMode: boolean;
  coolantMode: 'off' | 'mist' | 'flood';
  
  // Tool information
  toolNumber?: number;
  toolInfo?: CNCTool;
  
  // Workpiece info
  workpieceSize?: {
    x: number;
    y: number;
    z: number;
  };
  workOffset?: {
    x: number;
    y: number;
    z: number;
  };
  
  // Safety and simulation
  estimatedRunTime: number; // minutes
  estimatedToolPath: Point3D[];
  boundingBox?: {
    min: Point3D;
    max: Point3D;
  };
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface CNCMachine {
  id: string;
  name: string;
  type: MachineType;
  manufacturer: string;
  model: string;
  
  // Physical specifications
  workArea: {
    x: number; // mm
    y: number; // mm
    z: number; // mm
  };
  
  // Spindle specifications
  spindle: {
    power: number; // kW
    maxSpeed: number; // RPM
    minSpeed: number; // RPM
    taper?: string; // e.g., 'R8', 'BT30'
  };
  
  // Tool changer
  toolChanger?: {
    capacity: number;
    type: 'manual' | 'automatic' | 'carousel' | 'rack';
  };
  
  // Control system
  control: {
    brand: string; // e.g., 'Fanuc', 'Siemens', 'Mach3'
    version: string;
    supportedGCodes: string[];
  };
  
  // Capabilities
  capabilities: MachineCapability[];
  
  // Current status
  status: MachineStatus;
  currentProgram?: string;
  currentTool?: number;
  currentPosition?: Point3D;
  
  // Maintenance
  maintenanceSchedule?: MaintenanceSchedule[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type MachineType = 
  | 'cnc-router'
  | 'cnc-mill'
  | 'drill-press'
  | 'panel-saw'
  | 'edge-bander';

export type MachineCapability = 
  | '3-axis'
  | '4-axis'
  | '5-axis'
  | 'automatic-tool-change'
  | 'coolant'
  | 'dust-collection'
  | 'probe'
  | 'rigid-tapping';

export type MachineStatus = 
  | 'idle'
  | 'running'
  | 'paused'
  | 'alarm'
  | 'maintenance'
  | 'offline';

export interface MaintenanceSchedule {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'hours-based';
  description: string;
  interval: number;
  lastPerformed?: Date;
  nextDue: Date;
  status: 'pending' | 'completed' | 'overdue';
}

export interface CNCSimulation {
  id: string;
  programId: string;
  machineId: string;
  
  // Simulation settings
  simulationType: 'visual' | 'collision' | 'time-estimate';
  showToolPath: boolean;
  showMaterial: boolean;
  animationSpeed: number; // 0.1 to 10
  
  // Results
  toolPath: Point3D[];
  boundingBox: {
    min: Point3D;
    max: Point3D;
  };
  estimatedTime: number; // minutes
  collisions?: Collision[];
  
  // Visualization
  materialRemoval?: MaterialRemoval[];
  
  createdAt: Date;
}

export interface Collision {
  point: Point3D;
  type: 'tool-workpiece' | 'tool-fixture' | 'tool-machine';
  severity: 'warning' | 'error';
  description: string;
}

export interface MaterialRemoval {
  timestamp: number; // seconds from start
  position: Point3D;
  volume: number; // cubic mm
  toolPosition: Point3D;
}

// Pattern library exports
export type PatternId = string;

export interface PatternLibrary {
  patterns: Record<PatternId, DrillPattern>;
  categories: Record<PatternCategory, {
    name: string;
    description: string;
    patterns: PatternId[];
  }>;
  version: string;
  lastUpdated: Date;
}

// CNC Operation types
export interface CNCOperation {
  id: string;
  type: 'drill' | 'mill' | 'cut' | 'tap' | 'bore';
  name: string;
  
  // Geometry
  toolpath: Point3D[];
  startDepth: number;
  endDepth: number;
  
  // Tool and settings
  toolId: string;
  settings: DrillSettings;
  
  // Parameters
  depthOfCut: number;
  stepOver?: number; // for milling operations
  
  // Timing
  estimatedTime: number;
  actualTime?: number;
  
  // Quality
  tolerance?: Tolerance;
  surfaceFinish?: string;
  
  status: 'pending' | 'running' | 'completed' | 'error';
  
  createdAt: Date;
  updatedAt: Date;
}
