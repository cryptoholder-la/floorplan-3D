// BASE TYPES - Core type definitions for Floorplan 3D
// These are the fundamental types used across the entire system

// ============================================================================
// GEOMETRY TYPES
// ============================================================================

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface Size3D {
  width: number;
  height: number;
  depth: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  min: Point3D;
  max: Point3D;
}

// ============================================================================
// DIMENSION TYPES
// ============================================================================

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type CabinetWidth = 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36 | 39 | 42 | 45 | 48;
export type CabinetDepth = 12 | 15 | 18 | 21 | 24;
export type CabinetHeight = 30 | 33 | 36 | 39 | 42 | 45 | 48 | 54 | 60 | 72 | 84 | 90 | 34.5;

export interface Dimensions {
  width: number;
  height: number;
  depth?: number;
  thickness?: number;
}

export interface CabinetDimensions {
  width: CabinetWidth;
  depth: CabinetDepth;
  height: CabinetHeight;
}

// ============================================================================
// STATUS & STATE TYPES
// ============================================================================

export type Status = 'active' | 'inactive' | 'pending' | 'in-progress' | 'running' | 'completed' | 'done' | 'finished' | 'failed' | 'error' | 'cancelled' | 'archived';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Visibility = 'visible' | 'hidden' | 'locked';

// ============================================================================
// IDENTIFICATION TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface TimestampedEntity {
  id: string;
  timestamp: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface Configuration {
  enabled: boolean;
  settings: Record<string, any>;
  metadata?: Record<string, string>;
}

export interface GridSettings {
  enabled: boolean;
  spacing: {
    x: number;
    y: number;
  };
  origin: Point2D;
  color: string;
  opacity: number;
  subdivision: number;
}

export interface SnapSettings {
  enabled: boolean;
  toGrid: boolean;
  toObjects: boolean;
  toGuides: boolean;
  snapRadius: number;
  increments: {
    angle: number;
    length: number;
  };
}

// ============================================================================
// LAYER TYPES
// ============================================================================

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
  type: LayerType;
  objectIds: string[];
}

export type LayerType = 
  | 'architectural'
  | 'structural'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'furniture'
  | 'fixtures'
  | 'annotations'
  | 'dimensions'
  | 'custom';

// ============================================================================
// VIEW TYPES
// ============================================================================

export interface ViewSettings {
  scale: number;
  center: Point2D;
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  showDimensions: boolean;
  showAnnotations: boolean;
  renderMode: RenderMode;
  layerVisibility: Record<string, boolean>;
  mode: ViewMode;
  projection: ProjectionType;
  camera?: Camera3D;
}

export type RenderMode = 'wireframe' | 'hidden-line' | 'shaded' | 'rendered';
export type ViewMode = '2d' | '3d';
export type ProjectionType = 'orthographic' | 'perspective';

export interface Camera3D {
  position: Point3D;
  target: Point3D;
  up: Point3D;
  fov?: number;
}

// ============================================================================
// MATERIAL TYPES
// ============================================================================

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  thickness: number;
  density?: number; // kg/m³
  pricePerUnit: number;
  unit: 'sheet' | 'linear' | 'square-foot' | 'square-meter';
  supplier?: string;
  properties?: MaterialProperties;
}

export type MaterialType = 
  | 'plywood'
  | 'hardwood'
  | 'mdf'
  | 'particleboard'
  | 'solid-surface'
  | 'laminate'
  | 'metal'
  | 'plastic'
  | 'glass';

export interface MaterialProperties {
  strength?: number; // MPa
  hardness?: number;
  moistureResistance?: number; // 1-10 scale
  fireRating?: string;
  finish?: string;
  color?: string;
  grainDirection?: 'horizontal' | 'vertical' | 'none';
}

// ============================================================================
// HARDWARE TYPES
// ============================================================================

export interface Hardware {
  id: string;
  name: string;
  type: HardwareType;
  manufacturer?: string;
  model?: string;
  specifications?: Record<string, any>;
  price: number;
  unit: 'each' | 'box' | 'set';
  supplier?: string;
}

export type HardwareType = 
  | 'hinge'
  | 'handle'
  | 'drawer-slide'
  | 'shelf-pin'
  | 'screw'
  | 'dowel'
  | 'fastener'
  | 'bracket'
  | 'leg'
  | 'caster';

// ============================================================================
// TOLERANCE TYPES
// ============================================================================

export interface Tolerance {
  dimension: string;
  nominal: number;
  plus: number;
  minus: number;
  unit: LengthUnit;
  critical: boolean;
}

export interface ToleranceSet {
  diameter: Tolerance;
  depth: Tolerance;
  position: {
    x: number;
    y: number;
  };
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project extends BaseEntity {
  type: ProjectType;
  status: Status;
  priority: Priority;
  client?: Client;
  deadline?: Date;
  budget?: number;
  tags: string[];
  metadata: ProjectMetadata;
}

export type ProjectType = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'educational'
  | 'healthcare'
  | 'custom';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface ProjectMetadata {
  totalArea: number;
  roomCount: number;
  cabinetCount: number;
  estimatedCost: number;
  estimatedTime: number;
  complexity: Difficulty;
  requirements: string[];
}

// ============================================================================
// USER & PERMISSION TYPES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
}

export type UserRole = 
  | 'admin'
  | 'designer'
  | 'manufacturer'
  | 'viewer'
  | 'guest';

export type Permission = 
  | 'project.create'
  | 'project.edit'
  | 'project.delete'
  | 'project.view'
  | 'design.create'
  | 'design.edit'
  | 'manufacture.create'
  | 'manufacture.edit'
  | 'system.admin';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  units: LengthUnit;
  defaultViewMode: ViewMode;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: NotificationType[];
}

export type NotificationType = 
  | 'project.created'
  | 'project.updated'
  | 'design.changed'
  | 'manufacturing.started'
  | 'error.occurred'
  | 'system.maintenance';

// ============================================================================
// API & RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface SystemEvent {
  id: string;
  type: EventType;
  source: string;
  timestamp: Date;
  data: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export type EventType = 
  | 'user.action'
  | 'system.error'
  | 'project.created'
  | 'project.updated'
  | 'design.changed'
  | 'manufacturing.started'
  | 'manufacturing.completed'
  | 'performance.metric';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type IdGenerator = () => string;
export type TimestampGenerator = () => number;

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_SNAP_RADIUS = 10;
export const DEFAULT_TOLERANCE = 0.1; // mm

export const MATERIAL_TYPES: MaterialType[] = [
  'plywood', 'hardwood', 'mdf', 'particleboard', 
  'solid-surface', 'laminate', 'metal', 'plastic', 'glass'
];

export const HARDWARE_TYPES: HardwareType[] = [
  'hinge', 'handle', 'drawer-slide', 'shelf-pin', 
  'screw', 'dowel', 'fastener', 'bracket', 'leg', 'caster'
];

export const LAYER_TYPES: LayerType[] = [
  'architectural', 'structural', 'mechanical', 'electrical',
  'plumbing', 'furniture', 'fixtures', 'annotations', 'dimensions', 'custom'
];

export const PROJECT_TYPES: ProjectType[] = [
  'residential', 'commercial', 'industrial', 'educational', 'healthcare', 'custom'
];

export const USER_ROLES: UserRole[] = ['admin', 'designer', 'manufacturer', 'viewer', 'guest'];
export const PERMISSIONS: Permission[] = [
  'project.create', 'project.edit', 'project.delete', 'project.view',
  'design.create', 'design.edit', 'manufacture.create', 'manufacture.edit', 'system.admin'
];
