import { Point, Wall, Room, Door, Window, FloorPlan, Cabinet, Measurement, Model3D, PhotoReference } from './floorplan-types';
import {
  DEFAULT_SCALE,
  STANDARD_DIMENSIONS,
  SCALE_OPTIONS,
  ScaleOption,
  inchesToPixels,
  pixelsToInches,
  formatDimension,
  inchesToMeters,
} from '@/lib/unified-scale-utils';

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function getWallVector(wall: Wall): Point {
  return {
    x: wall.end.x - wall.start.x,
    y: wall.end.y - wall.start.y,
  };
}

export function getWallLength(wall: Wall): number {
  return distance(wall.start, wall.end);
}

export function getWallTangent(wall: Wall): Point {
  const len = getWallLength(wall);
  if (len === 0) return { x: 0, y: 0 };
  const v = getWallVector(wall);
  return { x: v.x / len, y: v.y / len };
}

export function getWallNormal(wall: Wall): Point {
  const t = getWallTangent(wall);
  return { x: -t.y, y: t.x };
}

export function getPointOnWall(wall: Wall, tParameter: number): Point {
  const v = getWallVector(wall);
  return {
    x: wall.start.x + tParameter * v.x,
    y: wall.start.y + tParameter * v.y,
  };
}

export function pointToLineDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

export function findNearestPoint(point: Point, points: Point[], threshold: number): Point | null {
  let nearest: Point | null = null;
  let minDist = threshold;

  for (const p of points) {
    const dist = distance(point, p);
    if (dist < minDist) {
      minDist = dist;
      nearest = p;
    }
  }

  return nearest;
}

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function exportFloorPlan(floorPlan: FloorPlan): string {
  return JSON.stringify(floorPlan, null, 2);
}

export function importFloorPlan(jsonString: string): FloorPlan {
  const parsed = JSON.parse(jsonString);
  parsed.doors = parsed.doors.map((door: Door) => ({
    ...door,
    height: door.height ?? 2.0,
    sillHeight: door.sillHeight ?? 0,
    doorType: door.doorType ?? 'single',
  }));
  parsed.windows = parsed.windows.map((window: Window) => ({
    ...window,
    sillHeight: window.sillHeight ?? 0.9,
    windowType: window.windowType ?? 'single',
  }));
  return parsed;
}

export function createDefaultFloorPlan(): FloorPlan {
  return {
    id: `floorplan-${Date.now()}`,
    name: 'New Floor Plan',
    walls: [],
    rooms: [],
    doors: [],
    windows: [],
    cabinets: [],
    models3D: [],
    photos: [],
    measurements: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scale: SCALE_OPTIONS[DEFAULT_SCALE].pixelsPerInch,
      unit: 'inches',
      showMeasurements: true,
      scaleOption: DEFAULT_SCALE,
      defaultWallHeight: STANDARD_DIMENSIONS.wallHeightInches,
      upperCabinetHeight: STANDARD_DIMENSIONS.upperCabinetMountHeightInches,
      finishedFloorOffset: STANDARD_DIMENSIONS.finishedFloorOffsetInches,
    },
  };
}

export function getWallAngle(wall: Wall): number {
  return Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
}

export function generateRoomTemplate(type: 'living' | 'bedroom' | 'kitchen' | 'bathroom', centerX: number, centerY: number, scale: number = 20): Room {
  const templates = {
    living: { width: 5, height: 6, name: 'Living Room', color: '#e3f2fd' },
    bedroom: { width: 4, height: 4, name: 'Bedroom', color: '#fff3e0' },
    kitchen: { width: 4, height: 3, name: 'Kitchen', color: '#f3e5f5' },
    bathroom: { width: 2, height: 2.5, name: 'Bathroom', color: '#e0f2f1' },
  };

  const template = templates[type];
  const w = template.width * scale;
  const h = template.height * scale;

  return {
    id: `room-${Date.now()}-${Math.random()}`,
    name: template.name,
    color: template.color,
    points: [
      { x: centerX - w / 2, y: centerY - h / 2 },
      { x: centerX + w / 2, y: centerY - h / 2 },
      { x: centerX + w / 2, y: centerY + h / 2 },
      { x: centerX - w / 2, y: centerY + h / 2 },
    ],
  };
}

export function createCabinet(
  type: Cabinet['type'],
  position: Point,
  angle: number = 0,
  scaleOption: ScaleOption = DEFAULT_SCALE,
  customDimensions?: {
    widthInches?: number;
    depthInches?: number;
    heightInches?: number;
    mountHeightInches?: number;
  }
): Cabinet {
  const presets: Record<Cabinet['type'], {
    widthInches: number;
    depthInches: number;
    heightInches: number;
    mountHeightInches?: number;
    color: string
  }> = {
    base: {
      widthInches: 24,
      depthInches: STANDARD_DIMENSIONS.baseCabinetDepthInches,
      heightInches: STANDARD_DIMENSIONS.baseCabinetTotalHeightInches,
      color: '#8B4513'
    },
    db: {
      widthInches: 18,
      depthInches: STANDARD_DIMENSIONS.baseCabinetDepthInches,
      heightInches: 24,
      color: '#8B4513'
    },
    sb: {
      widthInches: 30,
      depthInches: STANDARD_DIMENSIONS.baseCabinetDepthInches,
      heightInches: STANDARD_DIMENSIONS.baseCabinetTotalHeightInches,
      color: '#8B4513'
    },
    lsb: {
      widthInches: 36,
      depthInches: STANDARD_DIMENSIONS.baseCabinetDepthInches,
      heightInches: STANDARD_DIMENSIONS.baseCabinetTotalHeightInches,
      color: '#8B4513'
    },
    wall: {
      widthInches: 30,
      depthInches: STANDARD_DIMENSIONS.wallCabinetDepthInches,
      heightInches: 30,
      mountHeightInches: STANDARD_DIMENSIONS.upperCabinetMountHeightInches,
      color: '#A0522D'
    },
    tall: {
      widthInches: 24,
      depthInches: STANDARD_DIMENSIONS.tallCabinetDepthInches,
      heightInches: 84,
      color: '#654321'
    },
    corner: {
      widthInches: 36,
      depthInches: 36,
      heightInches: STANDARD_DIMENSIONS.baseCabinetTotalHeightInches,
      color: '#8B4513'
    },
    island: {
      widthInches: 48,
      depthInches: 36,
      heightInches: STANDARD_DIMENSIONS.baseCabinetTotalHeightInches,
      color: '#A0522D'
    },
  };

  const preset = presets[type];
  const widthInches = customDimensions?.widthInches ?? preset.widthInches;
  const depthInches = customDimensions?.depthInches ?? preset.depthInches;
  const heightInches = customDimensions?.heightInches ?? preset.heightInches;
  const mountHeightInches = customDimensions?.mountHeightInches ?? preset.mountHeightInches;

  return {
    id: `cabinet-${Date.now()}-${Math.random()}`,
    type,
    position,
    angle,
    width: inchesToPixels(widthInches, scaleOption),
    depth: inchesToPixels(depthInches, scaleOption),
    height: heightInches,
    mountHeight: mountHeightInches,
    color: preset.color,
  };
}

export function convertPixelsToRealWorld(
  pixels: number,
  scaleOption: ScaleOption = DEFAULT_SCALE,
  unit: 'meters' | 'feet' | 'inches' = 'inches'
): number {
  const inches = pixelsToInches(pixels, scaleOption);
  switch (unit) {
    case 'feet':
      return inches / 12;
    case 'meters':
      return inchesToMeters(inches);
    default:
      return inches;
  }
}

export function convertRealWorldToPixels(
  realWorld: number,
  scaleOption: ScaleOption = DEFAULT_SCALE,
  unit: 'meters' | 'feet' | 'inches' = 'inches'
): number {
  let inches = realWorld;
  switch (unit) {
    case 'feet':
      inches = realWorld * 12;
      break;
    case 'meters':
      inches = realWorld * 39.37007874015748;
      break;
  }
  return inchesToPixels(inches, scaleOption);
}

export function formatMeasurement(
  pixels: number,
  scaleOption: ScaleOption = DEFAULT_SCALE,
  unit: 'meters' | 'feet' | 'inches' = 'inches'
): string {
  const inches = pixelsToInches(pixels, scaleOption);
  switch (unit) {
    case 'feet':
      return formatDimension(inches, true);
    case 'meters':
      return `${inchesToMeters(inches).toFixed(2)} m`;
    default:
      return `${inches.toFixed(1)} in`;
  }
}

export function calculateAutoMeasurements(floorPlan: FloorPlan): Measurement[] {
  const measurements: Measurement[] = [];
  const scaleOption = floorPlan.metadata?.scaleOption || DEFAULT_SCALE;
  const unit = floorPlan.metadata?.unit || 'inches';

  // Add measurements for all walls
  floorPlan.walls.forEach(wall => {
    const dist = distance(wall.start, wall.end);
    measurements.push({
      id: `measure-wall-${wall.id}`,
      start: wall.start,
      end: wall.end,
      label: formatMeasurement(dist, scaleOption, unit),
      visible: true,
    });
  });

  // Add measurements for rooms (perimeter)
  floorPlan.rooms.forEach(room => {
    for (let i = 0; i < room.points.length; i++) {
      const start = room.points[i];
      const end = room.points[(i + 1) % room.points.length];
      const dist = distance(start, end);
      measurements.push({
        id: `measure-room-${room.id}-${i}`,
        start,
        end,
        label: formatMeasurement(dist, scaleOption, unit),
        visible: true,
      });
    }
  });

  return measurements;
}

export function uploadImageToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}