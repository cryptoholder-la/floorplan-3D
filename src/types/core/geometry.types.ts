// GEOMETRY TYPES - Advanced geometric primitives and operations
// Extends base types with specialized geometry for CAD/CAM operations

import { Point2D, Point3D, Size2D, Size3D, Material, Rectangle, BoundingBox } from './base.types';

// ============================================================================
// ADVANCED GEOMETRY
// ============================================================================

// Re-export base geometry types for convenience
export type { Rectangle, BoundingBox };

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Line2D {
  start: Point2D;
  end: Point2D;
}

export interface Line3D {
  start: Point3D;
  end: Point3D;
}

export interface Circle {
  center: Point2D;
  radius: number;
}

export interface Arc {
  center: Point2D;
  radius: number;
  startAngle: number; // radians
  endAngle: number; // radians
  direction: 'clockwise' | 'counter-clockwise';
}

export interface Polygon {
  points: Point2D[];
  closed: boolean;
}

export interface Polyline {
  points: Point2D[];
  closed: boolean;
}

export interface BezierCurve {
  points: Point2D[];
  controlPoints: Point2D[];
  degree: number;
}

export interface Spline {
  points: Point2D[];
  tension: number;
  closed: boolean;
}

// ============================================================================
// 3D GEOMETRY
// ============================================================================

export interface Plane {
  point: Point3D;
  normal: Vector3D;
}

export interface Sphere {
  center: Point3D;
  radius: number;
}

export interface Cylinder {
  center: Point3D;
  radius: number;
  height: number;
  axis: Vector3D;
}

export interface Box {
  min: Point3D;
  max: Point3D;
}

export interface Mesh {
  vertices: Point3D[];
  faces: Face[];
  normals?: Vector3D[];
  textureCoordinates?: Point2D[];
}

export interface Face {
  vertexIndices: number[];
  normal?: Vector3D;
  materialId?: string;
}

export interface Solid {
  type: 'primitive' | 'mesh' | 'boolean' | 'sweep' | 'revolution';
  geometry: Mesh | Primitive | BooleanOperation | Sweep | Revolution;
  material?: Material;
}

export interface Primitive {
  type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  parameters: Record<string, number>;
}

export interface BooleanOperation {
  operation: 'union' | 'difference' | 'intersection';
  operands: Solid[];
}

export interface Sweep {
  profile: Polygon;
  path: Polyline;
  scale?: number;
  twist?: number;
}

export interface Revolution {
  profile: Polygon;
  axis: Line3D;
  angle: number; // radians
}

// ============================================================================
// TRANSFORMATIONS
// ============================================================================

export interface Transform2D {
  translation: Vector2D;
  rotation: number; // radians
  scale: Vector2D;
  matrix?: number[][]; // 3x3 transformation matrix
}

export interface Transform3D {
  translation: Vector3D;
  rotation: Vector3D; // Euler angles in radians
  scale: Vector3D;
  matrix?: number[][]; // 4x4 transformation matrix
}

export interface Transformation {
  type: '2d' | '3d';
  transform: Transform2D | Transform3D;
  inverse?: Transformation;
}

export interface Matrix3D {
  m11: number; m12: number; m13: number; m14: number;
  m21: number; m22: number; m23: number; m24: number;
  m31: number; m32: number; m33: number; m34: number;
  m41: number; m42: number; m43: number; m44: number;
}

// ============================================================================
// GEOMETRIC OPERATIONS
// ============================================================================

export interface GeometricOperation {
  type: 'offset' | 'fillet' | 'chamfer' | 'extend' | 'trim' | 'intersect' | 'union' | 'difference';
  parameters: Record<string, number>;
  targets: string[]; // IDs of geometric entities
}

export interface OffsetOperation extends GeometricOperation {
  type: 'offset';
  distance: number;
  side: 'left' | 'right' | 'both';
}

export interface FilletOperation extends GeometricOperation {
  type: 'fillet';
  radius: number;
  points: Point2D[];
}

export interface ChamferOperation extends GeometricOperation {
  type: 'chamfer';
  distance: number;
  angle: number; // degrees
  points: Point2D[];
}

// ============================================================================
// GEOMETRIC CONSTRAINTS
// ============================================================================

export interface GeometricConstraint {
  id: string;
  type: ConstraintType;
  entities: string[]; // IDs of constrained entities
  parameters: Record<string, number>;
  active: boolean;
}

export type ConstraintType = 
  | 'coincident'
  | 'collinear'
  | 'concentric'
  | 'parallel'
  | 'perpendicular'
  | 'horizontal'
  | 'vertical'
  | 'tangent'
  | 'distance'
  | 'angle'
  | 'radius'
  | 'diameter';

export interface DistanceConstraint extends GeometricConstraint {
  type: 'distance';
  distance: number;
}

export interface AngleConstraint extends GeometricConstraint {
  type: 'angle';
  angle: number; // degrees
}

export interface RadiusConstraint extends GeometricConstraint {
  type: 'radius';
  radius: number;
}

// ============================================================================
// GEOMETRIC VALIDATION
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  entity?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  code: string;
  message: string;
  entity?: string;
  suggestion?: string;
}

export interface GeometryValidator {
  validateSelfIntersection(polygon: Polygon): ValidationResult;
  validateManifold(mesh: Mesh): ValidationResult;
  validateTolerance(geometry: any, tolerance: number): ValidationResult;
  validateConstraints(constraints: GeometricConstraint[]): ValidationResult;
}

// ============================================================================
// GEOMETRIC ANALYSIS
// ============================================================================

export interface GeometricProperties {
  area: number;
  perimeter: number;
  centroid: Point2D;
  momentsOfInertia: {
    xx: number;
    yy: number;
    xy: number;
  };
  boundingBox: Rectangle;
}

export interface VolumeProperties {
  volume: number;
  surfaceArea: number;
  centroid: Point3D;
  momentsOfInertia: {
    xx: number;
    yy: number;
    zz: number;
    xy: number;
    xz: number;
    yz: number;
  };
  boundingBox: BoundingBox;
}

export interface GeometricAnalysis {
  properties: GeometricProperties | VolumeProperties;
  features: GeometricFeature[];
  relationships: GeometricRelationship[];
}

export interface GeometricFeature {
  type: 'edge' | 'face' | 'vertex' | 'hole' | 'slot' | 'fillet' | 'chamfer';
  geometry: any;
  properties: Record<string, number>;
}

export interface GeometricRelationship {
  type: 'adjacent' | 'parallel' | 'perpendicular' | 'concentric' | 'tangent';
  entities: string[];
  parameters: Record<string, number>;
}

// ============================================================================
// TOOLPATH GEOMETRY
// ============================================================================

export interface Toolpath {
  id: string;
  type: ToolpathType;
  geometry: Polyline;
  parameters: ToolpathParameters;
  tool: Tool;
}

export type ToolpathType = 
  | 'contour'
  | 'pocket'
  | 'drill'
  | 'engrave'
  | 'profile'
  | 'adaptive'
  | 'morph';

export interface ToolpathParameters {
  stepOver?: number; // percentage of tool diameter
  stepDown?: number; // depth per pass
  feedRate: number; // mm/min
  spindleSpeed: number; // RPM
  plungeRate?: number; // mm/min
  retractHeight?: number; // mm
  coolant?: CoolantType;
  direction?: 'climb' | 'conventional';
}

export type CoolantType = 'off' | 'mist' | 'flood' | 'through';

export interface Tool {
  id: string;
  type: ToolType;
  diameter: number;
  length: number;
  fluteCount?: number;
  cornerRadius?: number;
  taperAngle?: number;
  material: ToolMaterial;
  coating?: ToolCoating;
  maxSpindleSpeed: number;
  maxFeedRate: number;
}

export type ToolType = 
  | 'end-mill'
  | 'ball-nose'
  | 'chamfer'
  | 'drill-bit'
  | 'spot-drill'
  | 'counterbore'
  | 'tap'
  | 'router-bit'
  | 'saw-blade';

export type ToolMaterial = 
  | 'hss' // High Speed Steel
  | 'carbide'
  | 'cobalt'
  | 'ceramic'
  | 'diamond';

export type ToolCoating = 
  | 'none'
  | 'tin'
  | 'ticn'
  | 'alcrn'
  | 'diamond';

// ============================================================================
// GEOMETRIC UTILITIES
// ============================================================================

export interface GeometryUtils {
  // Basic operations
  distance(p1: Point2D, p2: Point2D): number;
  distance3D(p1: Point3D, p2: Point3D): number;
  angle(p1: Point2D, p2: Point2D, p3: Point2D): number; // angle at p2
  area(polygon: Polygon): number;
  perimeter(polygon: Polygon): number;
  
  // Transformations
  translate(point: Point2D, vector: Vector2D): Point2D;
  rotate(point: Point2D, center: Point2D, angle: number): Point2D;
  scale(point: Point2D, center: Point2D, factor: number): Point2D;
  transform(point: Point2D, transform: Transform2D): Point2D;
  
  // Intersections
  lineIntersection(line1: Line2D, line2: Line2D): Point2D | null;
  lineCircleIntersection(line: Line2D, circle: Circle): Point2D[];
  circleCircleIntersection(circle1: Circle, circle2: Circle): Point2D[];
  
  // Projections
  pointToLineDistance(point: Point2D, line: Line2D): number;
  pointToLineProjection(point: Point2D, line: Line2D): Point2D;
  pointToPolygonDistance(point: Point2D, polygon: Polygon): number;
  
  // Containment
  pointInPolygon(point: Point2D, polygon: Polygon): boolean;
  polygonInPolygon(polygon1: Polygon, polygon2: Polygon): boolean;
  
  // Offsets
  offsetPolygon(polygon: Polygon, distance: number): Polygon;
  offsetLine(line: Line2D, distance: number, side: 'left' | 'right'): Line2D;
  
  // Fillets and chamfers
  filletPolyline(polyline: Polyline, radius: number): Polyline;
  chamferPolyline(polyline: Polyline, distance: number): Polyline;
  
  // Boolean operations
  union(polygons: Polygon[]): Polygon[];
  intersection(polygons: Polygon[]): Polygon[];
  difference(polygons: Polygon[]): Polygon[];
  
  // Triangulation
  triangulatePolygon(polygon: Polygon): Face[];
  
  // Convex hull
  convexHull(points: Point2D[]): Polygon;
  
  // Simplification
  simplifyPolyline(polyline: Polyline, tolerance: number): Polyline;
  
  // Smoothing
  smoothPolyline(polyline: Polyline, tension: number): Polyline;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EPSILON = 1e-10; // Small value for floating point comparisons
export const PI = Math.PI;
export const TWO_PI = 2 * Math.PI;
export const HALF_PI = Math.PI / 2;

export const DEFAULT_TOOLPATH_PARAMETERS: Partial<ToolpathParameters> = {
  stepOver: 40, // 40% of tool diameter
  stepDown: 2, // 2mm per pass
  feedRate: 1000, // mm/min
  spindleSpeed: 18000, // RPM
  plungeRate: 500, // mm/min
  retractHeight: 5, // mm
  coolant: 'off',
  direction: 'climb'
};

export const TOOL_TYPES: ToolType[] = [
  'end-mill', 'ball-nose', 'chamfer', 'drill-bit', 
  'spot-drill', 'counterbore', 'tap', 'router-bit', 'saw-blade'
];

export const TOOL_MATERIALS: ToolMaterial[] = ['hss', 'carbide', 'cobalt', 'ceramic', 'diamond'];
export const TOOL_COATINGS: ToolCoating[] = ['none', 'tin', 'ticn', 'alcrn', 'diamond'];
