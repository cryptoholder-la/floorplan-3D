// UNIFIED TYPES - Common type exports for integration
// Provides centralized access to all types in the system

// Core types - selective imports to avoid conflicts
import type {
  BaseEntity,
  Status,
  Priority,
  Difficulty,
  Point2D,
  Point3D,
  Size2D,
  Size3D,
  Rectangle,
  BoundingBox,
  Material,
  Hardware,
  Tolerance,
  User,
  Project,
  LengthUnit,
  GridSettings,
  Layer,
  LayerType,
  SnapSettings,
  ViewSettings
} from '../core/base.types';

import type {
  Vector2D,
  Vector3D,
  Polygon,
  Circle,
  Arc,
  Transformation,
  Toolpath,
  Tool,
  ToolType as GeometryToolType,
  ToolMaterial,
  ToolCoating,
  CoolantType,
  ConstraintType as GeometryConstraintType
} from '../core/geometry.types';

// Domain types - selective imports to avoid conflicts
import type {
  Cabinet,
  CabinetType,
  CabinetMaterial,
  CabinetHardware,
  CabinetPart,
  CabinetConfiguration,
  CutListItem,
  CutList,
  CabinetTemplate,
  CabinetCatalog
} from '../domain/cabinet.types';

import type {
  DrillPattern,
  CNCMachine,
  CNCTool,
  GCodeProgram,
  CNCOperation,
  PatternLibrary
} from '../domain/cnc.types';

import type {
  Floorplan,
  Wall,
  Door,
  Window,
  Room,
  Fixture,
  CabinetPlacement,
  LightingPlan,
  HVACZone
} from '../domain/floorplan.types';

import type {
  ManufacturingJob,
  MachineSettings,
  ToolRequirement,
  QualityCheck,
  ManufacturingOrder,
  ProductionSchedule,
  Machine,
  Operator
} from '../domain/manufacturing.types';

// Integration types
import type {
  MasterSystemConfig,
  MasterWorkflow,
  MasterWorkflowStep,
  IntegratedProject,
  WorkflowStatus,
  ProjectStatus
} from './master.types';
import { BaseEntity } from '@/types';

// Re-export commonly used types
export {
  BaseEntity,
  Status,
  Priority,
  Difficulty,
  Point2D,
  Point3D,
  Size2D,
  Size3D,
  Rectangle,
  BoundingBox,
  Material,
  Hardware,
  Tolerance,
  User,
  Project,
  LengthUnit,
  Cabinet,
  CabinetType,
  CabinetMaterial,
  CabinetHardware,
  CabinetPart,
  CabinetConfiguration,
  CutListItem,
  CutList,
  Floorplan,
  Wall,
  Door,
  Window,
  Room,
  Fixture,
  CabinetPlacement,
  ManufacturingJob,
  MasterSystemConfig,
  MasterWorkflow,
  MasterWorkflowStep,
  IntegratedProject,
  WorkflowStatus,
  ProjectStatus
};

// ============================================================================
// UNIFIED TYPE ALIASES
// ============================================================================

// Common entity types
export type Entity = BaseEntity;
export type ID = string;
export type Timestamp = Date;

// Common status types
export type CommonStatus = Status;

// Common geometry types
export type Point = Point2D | Point3D;
export type Size = Size2D | Size3D;
export type Bounds = Rectangle | BoundingBox;

// Common configuration types
export type Config = Record<string, any>;
export type Settings = Record<string, any>;

// Common collection types
export type List<T> = T[];
export type Map<T> = Record<string, T>;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isPoint2D(point: Point): point is Point2D {
  return typeof point === 'object' && 'x' in point && 'y' in point && !('z' in point);
}

export function isPoint3D(point: Point): point is Point3D {
  return typeof point === 'object' && 'x' in point && 'y' in point && 'z' in point;
}

export function isSize2D(size: Size): size is Size2D {
  return typeof size === 'object' && 'width' in size && 'height' in size && !('depth' in size);
}

export function isSize3D(size: Size): size is Size3D {
  return typeof size === 'object' && 'width' in size && 'height' in size && 'depth' in size;
}

export function isActive(status: Status): boolean {
  return status === 'active' || status === 'in-progress' || status === 'running';
}

export function isCompleted(status: Status): boolean {
  return status === 'completed' || status === 'done' || status === 'finished';
}

export function isError(status: Status): boolean {
  return status === 'error' || status === 'failed' || status === 'cancelled';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function createId(): ID {
  return Math.random().toString(36).substr(2, 9);
}

export function now(): Timestamp {
  return new Date();
}

export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const UNIFIED_VERSION = '1.0.0';

export const DEFAULT_SETTINGS = {
  timeout: 30000, // 30 seconds
  retries: 3,
  batchSize: 100,
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

export const SUPPORTED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'],
  document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  cad: ['dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'stl', 'obj'],
  video: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
  audio: ['mp3', 'wav', 'ogg', 'flac'],
  data: ['json', 'xml', 'csv', 'xlsx'],
};

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  numeric: /^\d+\.?\d*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
};

// ============================================================================
// ERROR TYPES
// ============================================================================

export class UnifiedError extends Error {
  constructor(
    message: string,
    public code: string,
    public type: ErrorType = 'general',
    public details?: any
  ) {
    super(message);
    this.name = 'UnifiedError';
  }
}

export type ErrorType = 
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not-found'
  | 'conflict'
  | 'business-rule'
  | 'system'
  | 'network'
  | 'timeout'
  | 'general';

export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  stack?: string;
  timestamp?: Timestamp;
  userId?: ID;
  sessionId?: ID;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface UnifiedEvent {
  id: ID;
  type: EventType;
  source: string;
  timestamp: Timestamp;
  data: any;
  metadata?: EventMetadata;
}

export type EventType = 
  | 'system.startup'
  | 'system.shutdown'
  | 'user.login'
  | 'user.logout'
  | 'project.created'
  | 'project.updated'
  | 'project.deleted'
  | 'workflow.started'
  | 'workflow.completed'
  | 'workflow.failed'
  | 'error.occurred'
  | 'notification.sent'
  | 'resource.created'
  | 'resource.updated'
  | 'resource.deleted'
  | 'custom';

export interface EventMetadata {
  userId?: ID;
  sessionId?: ID;
  requestId?: ID;
  correlationId?: ID;
  version?: string;
  tags?: string[];
}

// ============================================================================
// LOGGING TYPES
// ============================================================================

export interface LogEntry {
  id: ID;
  timestamp: Timestamp;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  metadata?: LogMetadata;
}

export type LogLevel = 
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export interface LogContext {
  userId?: ID;
  sessionId?: ID;
  requestId?: ID;
  module?: string;
  function?: string;
  line?: number;
  file?: string;
}

export interface LogMetadata {
  tags?: string[];
  properties?: Record<string, any>;
  duration?: number; // milliseconds
  memory?: number; // bytes
  cpu?: number; // percentage
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: Timestamp;
  ttl?: number; // time to live in seconds
  metadata?: CacheMetadata;
}

export interface CacheMetadata {
  source?: string;
  version?: string;
  dependencies?: string[];
  tags?: string[];
  size?: number; // bytes
  hits?: number;
  lastAccessed?: Timestamp;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  strategy?: CacheStrategy;
  compression?: boolean;
  encryption?: boolean;
}

export type CacheStrategy = 
  | 'lru' // least recently used
  | 'lfu' // least frequently used
  | 'fifo' // first in, first out
  | 'ttl' // time to live
  | 'custom';

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ApiResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Timestamp;
}

export interface ApiResponseMetadata {
  requestId: ID;
  timestamp: Timestamp;
  version: string;
  duration?: number; // milliseconds
  rateLimit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Timestamp;
  retryAfter?: number; // seconds
}

export interface ApiRequest {
  id: ID;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp: Timestamp;
  timeout?: number;
  retries?: number;
}

export type HttpMethod = 
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  recipient: NotificationRecipient;
  channels: NotificationChannel[];
  priority: Priority;
  timestamp: Timestamp;
  scheduledAt?: Timestamp;
  expiresAt?: Timestamp;
  metadata?: NotificationMetadata;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'alert'
  | 'reminder'
  | 'update'
  | 'invitation'
  | 'approval'
  | 'custom';

export interface NotificationRecipient {
  userId?: ID;
  email?: string;
  phone?: string;
  groups?: string[];
  roles?: string[];
}

export type NotificationChannel = 
  | 'email'
  | 'sms'
  | 'push'
  | 'in-app'
  | 'webhook'
  | 'slack'
  | 'teams'
  | 'custom';

export interface NotificationMetadata {
  template?: string;
  variables?: Record<string, any>;
  attachments?: NotificationAttachment[];
  actions?: NotificationAction[];
  tracking?: NotificationTracking;
}

export interface NotificationAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface NotificationAction {
  label: string;
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationTracking {
  sent?: boolean;
  delivered?: boolean;
  read?: boolean;
  clicked?: boolean;
  timestamps?: {
    sent?: Timestamp;
    delivered?: Timestamp;
    read?: Timestamp;
    clicked?: Timestamp;
  };
}
