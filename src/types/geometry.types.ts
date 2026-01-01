
// ============================================================================
// GEOMETRY TYPES - Advanced geometric primitives and operations
// ============================================================================

export interface Geometry {
  type: 'point' | 'line' | 'polygon' | 'circle' | 'arc' | 'bezier';
  coordinates: Point2D[] | Point3D[];
  bounds: BoundingBox;
  area?: number;
  perimeter?: number;
}

export interface Transformation {
  type: 'translate' | 'rotate' | 'scale' | 'mirror';
  parameters: Record<string, number>;
  matrix?: number[][];
}

export interface Toolpath {
  id: string;
  type: 'linear' | 'circular' | 'helical' | 'contour';
  points: Point2D[];
  feedRate: number;
  spindleSpeed: number;
  depth?: number;
}

export interface GeometricFeature {
  type: 'edge' | 'face' | 'hole' | 'slot' | 'pocket' | 'chamfer' | 'fillet';
  geometry: any;
  dimensions: Record<string, number>;
  tolerance?: Tolerance;
}