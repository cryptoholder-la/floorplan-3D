import { ScaleOption } from '@/types/scale.types';

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height: number;
  texture?: string;
}

export interface Room {
  id: string;
  name: string;
  points: Point[];
  color: string;
  floorTexture?: string;
  wallTexture?: string;
}

export interface Door {
  id: string;
  position: Point;
  angle: number;
  width: number;
  height: number;
  wallId?: string;
  sillHeight: number;
  doorType: 'single' | 'double' | 'sliding' | 'pocket';
}

export interface Window {
  id: string;
  position: Point;
  angle: number;
  width: number;
  height: number;
  wallId?: string;
  sillHeight: number;
  windowType: 'single' | 'double' | 'casement' | 'sliding';
}

export interface Cabinet {
  id: string;
  type: 'base' | 'wall' | 'tall' | 'corner' | 'island';
  position: Point;
  angle: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  mountHeight?: number;
}

export interface Model3D {
  id: string;
  name: string;
  position: Point;
  angle: number;
  scale: number;
  height: number;
  modelUrl: string;
}

export interface PhotoReference {
  id: string;
  name: string;
  url: string;
  position: Point;
  width: number;
  height: number;
  opacity: number;
  locked: boolean;
}

export interface ScaleCalibration {
  point1: Point;
  point2: Point;
  realWorldDistance: number;
  unit: 'meters' | 'feet' | 'inches';
}

export interface Measurement {
  id: string;
  start: Point;
  end: Point;
  label?: string;
  visible: boolean;
}

export interface ElevationView {
  wallId: string;
  viewDirection: 'front' | 'back';
  zoom: number;
  panOffset: Point;
}

export interface ResizeHandle {
  type: 'left' | 'right' | 'top' | 'bottom' | 'width-left' | 'width-right';
  elementId: string;
  elementType: 'door' | 'window';
}

export interface FloorPlan {
  id: string;
  name: string;
  walls: Wall[];
  rooms: Room[];
  doors: Door[];
  windows: Window[];
  cabinets: Cabinet[];
  models3D: Model3D[];
  photos: PhotoReference[];
  measurements: Measurement[];
  scaleCalibration?: ScaleCalibration;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    scale: number;
    unit: 'meters' | 'feet' | 'inches';
    showMeasurements: boolean;
    scaleOption: ScaleOption;
    defaultWallHeight: number;
    upperCabinetHeight: number;
    finishedFloorOffset: number;
  };
}

export type ViewMode = '2d' | 'elevation' | '3d' | 'manufacturing';

export type ToolType = 
  'select' | 
  'wall' | 
  'room' | 
  'door' | 
  'window' | 
  'cabinet' | 
  'delete' | 
  'measure' | 
  'model3d' | 
  'photo' | 
  'resize';

export type Mode = 
  '2d' | 
  '3d' | 
  'elevation' | 
  'manufacturing' | 
  'floorplan' | 
  'photo' | 
  'drawing' | 
  'drawing-editor' | 
  'drawing-viewer' | 
  'drawing-viewer-3d' | 
  'drawing-viewer-2d' | 
  'drawing-viewer-3d-2d' | 
  'drawing-viewer-2d-3d';
