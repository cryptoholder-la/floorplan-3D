import { Tolerance } from '@/types/core/base.types';
// TYPES INDEX - Main entry point for all type definitions
// This file provides centralized access to the unified type system

// Core types - selective exports to avoid conflicts
export type {
  BaseEntity,
  Status,
  Priority,
  Difficulty,
  Point2D,
  Point3D,
  Size2D,
  Size3D,
  Material,
  Hardware,
  Tolerance,
  User,
  Project,
  LengthUnit,
  CabinetDimensions,
  GridSettings,
  Layer,
  LayerType,
  SnapSettings,
  ViewSettings,
  ApiError,
  ApiResponse,
  EventType,
  NotificationType,
  Permission
} from './core/base.types';

export type {
  Vector2D,
  Vector3D,
  Polygon,
  Circle,
  Arc,
  Transformation,
  Transform2D,
  Transform3D,
  Toolpath,
  Tool,
  ToolType,
  ToolMaterial,
  ToolCoating,
  CoolantType,
  ConstraintType,
  GeometricFeature
} from './core/geometry.types';

// Domain types - selective exports to avoid conflicts
export type {
  Cabinet,
  CabinetType,
  CabinetMaterial,
  CabinetHardware,
  CabinetPart,
  CabinetConfiguration,
  CutListItem,
  CutList,
  CabinetTemplate,
  CabinetCatalog,
  Certification,
  ComplianceStandard,
  SurfaceFinish,
  DoorStyle
} from './domain/cabinet.types';

export type {
  DrillPattern,
  CNCMachine,
  CNCTool,
  GCodeProgram,
  CNCOperation,
  PatternLibrary,
  CNCFixture,
  CNCFixtureType
} from './domain/cnc.types';

export type {
  Floorplan,
  Wall,
  Door,
  Window,
  Room,
  Fixture as FloorplanFixture,
  CabinetPlacement,
  LightingPlan,
  HVACZone
} from './domain/floorplan.types';

export type {
  ManufacturingJob,
  MachineSettings,
  ToolRequirement,
  QualityCheck,
  ManufacturingOrder,
  ProductionSchedule,
  Machine,
  Operator,
  ManufacturingCertification,
  QualityCheckMethod,
  QualityCheckResult,
  QualityCheckType
} from './domain/manufacturing.types';

// Integration types
export type {
  MasterSystemConfig,
  MasterWorkflow,
  MasterWorkflowStep,
  IntegratedProject,
  WorkflowStatus,
  ProjectStatus,
  NotificationChannel
} from './integration/master.types';

export type {
  Entity,
  ID,
  Timestamp,
  CommonStatus,
  Point,
  Size,
  Bounds,
  Config,
  Settings,
  List,
  Map,
  UnifiedError,
  ErrorType,
  UnifiedEvent,
  LogEntry,
  LogLevel,
  CacheEntry,
  CacheOptions,
  CacheStrategy,
  ApiResponse as UnifiedApiResponse,
  ApiRequest,
  HttpMethod,
  Notification as UnifiedNotification,
  NotificationType as UnifiedNotificationType
} from './integration/unified.types';

// ============================================================================
// TYPE SYSTEM VERSION
// ============================================================================

export const TYPE_SYSTEM_VERSION = '1.0.0';

// ============================================================================
// DEPRECATED TYPE EXPORTS (for backward compatibility)
// ============================================================================

// These exports are maintained for backward compatibility
// New code should import from the specific modules above

// Legacy floorplan types (deprecated - use ./domain/floorplan.types)
export type {
  Floorplan as LegacyFloorplan,
  Wall as LegacyWall,
  Door as LegacyDoor,
  Window as LegacyWindow,
  Room as LegacyRoom,
  Fixture as LegacyFixture
} from './domain/floorplan.types';

// Legacy cabinet types (deprecated - use ./domain/cabinet.types)
export type {
  Cabinet as LegacyCabinet,
  
  CabinetMaterial as LegacyCabinetMaterial,
  CabinetHardware as LegacyCabinetHardware
} from './domain/cabinet.types';

// Legacy manufacturing types (deprecated - use ./domain/manufacturing.types)
export type {
  ManufacturingJob as LegacyManufacturingJob,
  MachineSettings as LegacyMachineSettings,
  QualityCheck as LegacyQualityCheck
} from './domain/manufacturing.types';

// Legacy CNC types (deprecated - use ./domain/cnc.types)
export type {
  DrillPattern as LegacyDrillPattern,
  CNCOperation as LegacyCNCOperation,
  GCodeProgram as LegacyGCodeProgram
} from './domain/cnc.types';
