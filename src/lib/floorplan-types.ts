export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  height: number;
  thickness: number;
}

export interface Room {
  id: string;
  name: string;
  points: Point[];
  color: string;
}

export interface Door {
  id: string;
  position: Point;
  width: number;
  height: number;
  angle: number;
  doorType: 'single' | 'double' | 'pocket' | 'bifold';
  sillHeight: number;
}

export interface Window {
  id: string;
  position: Point;
  width: number;
  height: number;
  sillHeight: number;
  type: 'single' | 'double' | 'casement' | 'sliding';
}

export interface Cabinet {
  id: string;
  type: string;
  position: Point;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  rotation: number;
  properties: Record<string, any>;
}

export interface Model3D {
  id: string;
  name: string;
  type: string;
  position: Point;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  rotation: number;
  url?: string;
}

export interface Photo {
  id: string;
  name: string;
  url: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface Measurement {
  id: string;
  start: Point;
  end: Point;
  value: number;
  unit: string;
  label?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  walls: Wall[];
  rooms: Room[];
  cabinets: Cabinet[];
  doors: Door[];
  windows: Window[];
  models3D: Model3D[];
  photos: Photo[];
  measurements: Measurement[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    scale: number;
    scaleOption: string;
    unit: string;
    showMeasurements: boolean;
    defaultWallHeight: number;
    upperCabinetHeight: number;
    finishedFloorOffset: number;
  };
}
