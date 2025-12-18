export type CNCOperationType = 
  | 'drill' 
  | 'route' 
  | 'pocket' 
  | 'contour' 
  | 'bore'
  | 'edge-trim';

export type ToolType = 
  | 'drill-bit'
  | 'router-bit'
  | 'end-mill'
  | 'v-bit'
  | 'boring-bit';

export interface CNCTool {
  id: string;
  name: string;
  type: ToolType;
  diameter: number;
  length: number;
  flutes?: number;
  rpm: number;
  feedRate: number;
  plungeRate: number;
  stepDown: number;
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

export interface CNCOperation {
  id: string;
  type: CNCOperationType;
  tool: CNCTool;
  startPoint: Point3D;
  endPoint?: Point3D;
  path?: Point3D[];
  depth: number;
  passes?: number;
  name: string;
  estimatedTime?: number;
}

export interface DrillingPattern {
  type: 'shelf-pin' | 'hinge' | 'mounting' | 'drawer-slide' | 'custom';
  holes: DrillHole[];
  tool: CNCTool;
}

export interface DrillHole {
  x: number;
  y: number;
  z: number;
  diameter: number;
  depth: number;
  throughHole: boolean;
}

export interface RoutingPath {
  type: 'contour' | 'pocket' | 'dado' | 'rabbet' | 'groove';
  path: Point3D[];
  tool: CNCTool;
  depth: number;
  passes: number;
  closed: boolean;
}

export interface EdgeBandingSequence {
  edges: ('top' | 'bottom' | 'left' | 'right')[];
  material: string;
  thickness: number;
  trimRequired: boolean;
}

export interface ManufacturingJob {
  id: string;
  componentId: string;
  componentName: string;
  material: string;
  thickness: number;
  width: number;
  height: number;
  operations: CNCOperation[];
  drillingPatterns: DrillingPattern[];
  routingPaths: RoutingPath[];
  edgeBanding?: EdgeBandingSequence;
  setupTime: number;
  machiningTime: number;
  totalTime: number;
}

export interface GCodeProgram {
  id: string;
  jobId: string;
  componentName: string;
  header: string[];
  operations: GCodeOperation[];
  footer: string[];
  estimatedTime: number;
}

export interface GCodeOperation {
  type: CNCOperationType;
  lines: string[];
  tool: CNCTool;
  comment: string;
}

export interface ToolpathVisualization {
  jobId: string;
  operations: CNCOperation[];
  currentOperation?: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

export interface CNCMachine {
  id: string;
  name: string;
  type: 'router' | 'drill' | 'boring';
  workArea: {
    width: number;
    height: number;
    depth: number;
  };
  maxRPM: number;
  maxFeedRate: number;
  toolChanger: boolean;
  availableTools: CNCTool[];
}

export const STANDARD_TOOLS: Record<string, CNCTool> = {
  SHELF_PIN_DRILL: {
    id: 'drill-5mm',
    name: '5mm Shelf Pin Drill',
    type: 'drill-bit',
    diameter: 5,
    length: 13,
    rpm: 18000,
    feedRate: 100,
    plungeRate: 50,
    stepDown: 13,
  },
  HINGE_BORE_35MM: {
    id: 'bore-35mm',
    name: '35mm Hinge Boring Bit',
    type: 'boring-bit',
    diameter: 35,
    length: 13,
    rpm: 12000,
    feedRate: 80,
    plungeRate: 40,
    stepDown: 13,
  },
  DADO_ROUTER: {
    id: 'router-3-8',
    name: '3/8" Straight Router Bit',
    type: 'router-bit',
    diameter: 9.525,
    length: 25.4,
    flutes: 2,
    rpm: 18000,
    feedRate: 150,
    plungeRate: 60,
    stepDown: 6,
  },
  EDGE_TRIM: {
    id: 'router-flush-trim',
    name: 'Flush Trim Router',
    type: 'router-bit',
    diameter: 6.35,
    length: 12.7,
    flutes: 2,
    rpm: 20000,
    feedRate: 200,
    plungeRate: 80,
    stepDown: 3,
  },
  CONTOUR_CUT: {
    id: 'router-1-4',
    name: '1/4" End Mill',
    type: 'end-mill',
    diameter: 6.35,
    length: 50,
    flutes: 2,
    rpm: 18000,
    feedRate: 180,
    plungeRate: 70,
    stepDown: 5,
  },
};
