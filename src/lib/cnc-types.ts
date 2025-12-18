export interface Material {
  id: string;
  name: string;
  type: 'plywood' | 'mdf' | 'hardwood' | 'particle_board' | 'melamine';
  thickness: number;
  width: number;
  length: number;
  color: string;
  pricePerSheet: number;
  grain?: 'horizontal' | 'vertical' | 'none';
}

export interface CNCMachine {
  id: string;
  name: string;
  workAreaWidth: number;
  workAreaDepth: number;
  workAreaHeight: number;
  spindleSpeed: number;
  feedRate: number;
  plungeRate: number;
  toolDiameter: number;
}

export interface CabinetPart {
  id: string;
  cabinetId: string;
  name: string;
  type: 'side' | 'top' | 'bottom' | 'back' | 'door' | 'drawer_front' | 'shelf' | 'face_frame';
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: Material;
  edges: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  holes?: CNCHole[];
  pockets?: CNCPocket[];
  cuts?: CNCCut[];
}

export interface CNCHole {
  id: string;
  x: number;
  y: number;
  diameter: number;
  depth: number;
  type: 'through' | 'blind' | 'countersink';
}

export interface CNCPocket {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
}

export interface CNCCut {
  id: string;
  type: 'straight' | 'arc' | 'circle';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  radius?: number;
  depth: number;
}

export interface ToolpathCommand {
  type: 'move' | 'linear' | 'arc' | 'drill' | 'spindle_on' | 'spindle_off';
  x?: number;
  y?: number;
  z?: number;
  feedRate?: number;
  spindleSpeed?: number;
  i?: number;
  j?: number;
  clockwise?: boolean;
}

export interface Toolpath {
  id: string;
  partId: string;
  commands: ToolpathCommand[];
  estimatedTime: number;
  gcode: string;
}

export interface CutListItem {
  partName: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: string;
  edgeBanding: string;
}

export interface SheetLayout {
  id: string;
  material: Material;
  parts: {
    part: CabinetPart;
    x: number;
    y: number;
    rotated: boolean;
  }[];
  efficiency: number;
  wasteArea: number;
}

export interface ManufacturingJob {
  id: string;
  name: string;
  cabinetIds: string[];
  parts: CabinetPart[];
  toolpaths: Toolpath[];
  sheetLayouts: SheetLayout[];
  cutList: CutListItem[];
  totalCost: number;
  totalTime: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  createdAt: string;
}

export interface CNCSimulationState {
  currentCommand: number;
  totalCommands: number;
  currentPosition: { x: number; y: number; z: number };
  spindleOn: boolean;
  progress: number;
  toolpathHistory: { x: number; y: number; z: number }[];
}

export interface DrillPattern {
  id: string;
  name: string;
  type: 'grid' | 'linear' | 'circular' | 'custom';
  holes: DrillPatternHole[];
}

export interface DrillPatternHole {
  id: string;
  x: number;
  y: number;
  diameter: number;
  depth: number;
  type: 'through' | 'blind' | 'countersink';
}

export interface GridDrillPattern extends DrillPattern {
  type: 'grid';
  rows: number;
  columns: number;
  spacingX: number;
  spacingY: number;
  startX: number;
  startY: number;
}

export interface LinearDrillPattern extends DrillPattern {
  type: 'linear';
  count: number;
  spacing: number;
  startX: number;
  startY: number;
  direction: 'horizontal' | 'vertical';
}

export interface CircularDrillPattern extends DrillPattern {
  type: 'circular';
  count: number;
  radius: number;
  centerX: number;
  centerY: number;
  startAngle: number;
}

export interface CustomDrillPattern extends DrillPattern {
  type: 'custom';
}

export interface DrillPatternConfig {
  partId: string;
  patterns: DrillPattern[];
}