// FLOORPLAN TYPES - Floorplan-specific type definitions
// Consolidates all floorplan-related types from fragmented files

import {
  BaseEntity,
  Point2D,
  Point3D,
  Status,
  Priority,
  Material,
  LengthUnit
} from '../core/base.types';
import { Rectangle, BoundingBox } from '../core/geometry.types';
import { BaseEntity } from '@/types';

// ============================================================================
// FLOORPLAN CORE TYPES
// ============================================================================

export interface Floorplan extends BaseEntity {
  // Dimensions and scale
  dimensions: {
    width: number; // feet or meters
    height: number; // feet or meters
    scale: number; // e.g., 1:50
  };
  units: 'imperial' | 'metric';
  
  // Layout elements
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  rooms: Room[];
  fixtures: Fixture[];
  cabinets: CabinetPlacement[];
  
  // Grid and snap settings
  grid: GridSettings;
  snapSettings: SnapSettings;
  
  // Layers
  layers: Layer[];
  activeLayerId: string;
  
  // View settings
  viewSettings: ViewSettings;
}

// ============================================================================
// WALL TYPES
// ============================================================================

export interface Wall extends BaseEntity {
  layerId: string;
  
  // Geometry
  startPoint: Point2D;
  endPoint: Point2D;
  thickness: number;
  
  // Properties
  type: WallType;
  material: string;
  height: number;
  fireRating?: string;
  
  // Openings
  openings: WallOpening[];
  
  // Structural
  loadBearing: boolean;
  structuralType?: 'stud' | 'concrete' | 'brick' | 'steel';
  
  // Finishes
  interiorFinish?: string;
  exteriorFinish?: string;
}

export type WallType = 
  | 'exterior'
  | 'interior'
  | 'foundation'
  | 'partition'
  | 'load-bearing'
  | 'shear';

export interface WallOpening {
  id: string;
  type: 'door' | 'window' | 'pass-through' | 'niche';
  position: number; // distance from wall start (0-1)
  width: number;
  height: number;
  elevation: number; // height from floor
  elementId?: string; // reference to door/window object
}

// ============================================================================
// DOOR TYPES
// ============================================================================

export interface Door extends BaseEntity {
  layerId: string;
  
  // Position and geometry
  position: Point2D;
  width: number;
  height: number;
  rotation: number; // degrees
  swingDirection: 'left' | 'right' | 'double';
  swingAngle: number; // degrees
  
  // Type and style
  type: DoorType;
  style: DoorStyle;
  material: string;
  
  // Hardware
  hardware: {
    hinges: string;
    handles: string;
    lock?: string;
    closer?: string;
  };
  
  // Properties
  fireRating?: string;
  soundRating?: number; // STC rating
}

export type DoorType = 
  | 'entry'
  | 'interior'
  | 'patio'
  | 'french'
  | 'sliding'
  | 'bifold'
  | 'pocket'
  | 'garage'
  | 'overhead';

export type DoorStyle = 
  | 'panel'
  | 'flush'
  | 'glass'
  | 'louvered'
  | 'barn'
  | 'dutch';

// ============================================================================
// WINDOW TYPES
// ============================================================================

export interface Window extends BaseEntity {
  layerId: string;
  
  // Position and geometry
  position: Point2D;
  width: number;
  height: number;
  rotation: number;
  
  // Type and style
  type: WindowType;
  style: WindowStyle;
  material: string;
  
  // Properties
  operation: WindowOperation;
  glassType: string;
  uValue?: number; // thermal performance
  shgc?: number; // solar heat gain coefficient
  
  // Divisions
  divisions: {
    horizontal: number;
    vertical: number;
  };
}

export type WindowType = 
  | 'single-hung'
  | 'double-hung'
  | 'casement'
  | 'awning'
  | 'slider'
  | 'picture'
  | 'bay'
  | 'bow'
  | 'skylight'
  | 'clerestory';

export type WindowStyle = 
  | 'traditional'
  | 'modern'
  | 'colonial'
  | 'victorian'
  | 'craftsman'
  | 'contemporary';

export type WindowOperation = 
  | 'fixed'
  | 'single-sash'
  | 'double-sash'
  | 'casement'
  | 'awning'
  | 'hopper'
  | 'pivot'
  | 'tilt-turn';

// ============================================================================
// ROOM TYPES
// ============================================================================

export interface Room extends BaseEntity {
  layerId: string;
  
  // Geometry
  boundary: Point2D[]; // polygon points defining room boundary
  area: number; // square feet or meters
  perimeter: number;
  
  // Properties
  type: RoomType;
  level: number; // floor level
  
  // Finishes
  flooring: {
    type: string;
    material: string;
    color?: string;
  };
  ceiling: {
    height: number;
    type: string;
    material?: string;
  };
  walls: {
    finish: string;
    color?: string;
  };
  
  // Fixtures and fittings
  fixtures: Fixture[];
  
  // Environmental
  lighting: LightingPlan;
  hvac?: HVACZone;
  
  // Notes
  notes?: string;
}

export type RoomType = 
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'bedroom'
  | 'bathroom'
  | 'office'
  | 'garage'
  | 'laundry'
  | 'storage'
  | 'entry'
  | 'hallway'
  | 'stairs'
  | 'utility'
  | 'outdoor';

// ============================================================================
// FIXTURE TYPES
// ============================================================================

export interface Fixture extends BaseEntity {
  layerId: string;
  
  // Position and geometry
  position: Point2D;
  rotation: number;
  size: {
    width: number;
    height: number;
    depth?: number;
  };
  
  // Type and category
  type: FixtureType;
  category: FixtureCategory;
  
  // Properties
  manufacturer?: string;
  model?: string;
  specifications?: Record<string, any>;
  
  // Connections
  connections: {
    electrical?: ElectricalConnection;
    plumbing?: PlumbingConnection;
    data?: DataConnection;
  };
  
  // Clearances
  clearances?: {
    front: number;
    back: number;
    sides: number;
    top: number;
  };
}

export type FixtureType = 
  | 'sink'
  | 'toilet'
  | 'shower'
  | 'bathtub'
  | 'faucet'
  | 'appliance'
  | 'lighting'
  | 'outlet'
  | 'switch'
  | 'thermostat'
  | 'smoke-detector'
  | 'carbon-monoxide-detector'
  | 'vent'
  | 'fan';

export type FixtureCategory = 
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'lighting'
  | 'safety'
  | 'furniture'
  | 'storage';

export interface ElectricalConnection {
  voltage: number;
  amperage: number;
  phase: 'single' | 'three';
  circuitNumber?: string;
  boxType?: string;
}

export interface PlumbingConnection {
  pipeType: string;
  pipeSize: number; // inches or mm
  supplyType: 'hot' | 'cold' | 'drain' | 'vent';
  connectionType: string;
}

export interface DataConnection {
  type: 'ethernet' | 'coaxial' | 'phone' | 'fiber';
  standard?: string;
  termination?: string;
}

// ============================================================================
// CABINET PLACEMENT TYPES
// ============================================================================

export interface CabinetPlacement extends BaseEntity {
  cabinetId: string; // reference to cabinet definition
  layerId: string;
  
  // Position and orientation
  position: Point2D;
  rotation: number;
  elevation: number; // height from floor
  
  // Configuration overrides
  configuration?: {
    width?: number;
    height?: number;
    depth?: number;
    finish?: string;
    hardware?: string;
  };
  
  // Installation details
  installation: {
    method: 'floor-mounted' | 'wall-mounted' | 'floating';
    fasteners?: string[];
    backingRequired: boolean;
  };
  
  // Clearances and access
  clearances?: {
    front: number;
    sides: number;
    above: number;
  };
}

// ============================================================================
// LAYER TYPES
// ============================================================================

export interface Layer extends BaseEntity {
  color: string;
  opacity: number; // 0-1
  order: number; // drawing order
  
  // Layer properties
  type: LayerType;
  
  // Objects on this layer
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
// GRID AND SNAP TYPES
// ============================================================================

export interface GridSettings {
  enabled: boolean;
  spacing: {
    x: number;
    y: number;
  };
  origin: Point2D;
  color: string;
  opacity: number;
  subdivision: number; // subdivisions per grid cell
}

export interface SnapSettings {
  enabled: boolean;
  toGrid: boolean;
  toObjects: boolean;
  toGuides: boolean;
  snapRadius: number; // pixels
  
  // Snap increments
  increments: {
    angle: number; // degrees
    length: number;
  };
}

// ============================================================================
// VIEW SETTINGS TYPES
// ============================================================================

export interface ViewSettings {
  scale: number;
  center: Point2D;
  
  // Display options
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  showDimensions: boolean;
  showAnnotations: boolean;
  
  // Rendering
  renderMode: 'wireframe' | 'hidden-line' | 'shaded' | 'rendered';
  
  // Layers visibility
  layerVisibility: Record<string, boolean>;
  
  // View modes
  mode: '2d' | '3d';
  projection: 'orthographic' | 'perspective';
  
  // 3D specific
  camera?: {
    position: Point3D;
    target: Point3D;
    up: Point3D;
    fov?: number;
  };
}

// ============================================================================
// LIGHTING TYPES
// ============================================================================

export interface LightingPlan {
  general: LightFixture[];
  task: LightFixture[];
  accent: LightFixture[];
  decorative: LightFixture[];
  
  // Lighting levels
  ambientLevel: number; // foot-candles or lux
  taskLevel: number;
  accentLevel: number;
  
  // Controls
  controls: LightingControl[];
}

export interface LightFixture extends BaseEntity {
  type: string;
  position: Point2D;
  rotation: number;
  
  // Lighting properties
  lumens: number;
  colorTemperature: number; // Kelvin
  beamAngle?: number;
  dimmable: boolean;
  
  // Electrical
  voltage: number;
  wattage: number;
  circuitNumber?: string;
}

export interface LightingControl extends BaseEntity {
  type: 'switch' | 'dimmer' | 'smart' | 'scene';
  position: Point2D;
  
  // Controlled fixtures
  controlledFixtureIds: string[];
  
  // Settings
  scenes?: LightingScene[];
}

export interface LightingScene {
  name: string;
  fixtureLevels: Record<string, number>; // fixture ID to brightness level
}

// ============================================================================
// HVAC TYPES
// ============================================================================

export interface HVACZone extends BaseEntity {
  roomIds: string[];
  
  // System type
  systemType: 'forced-air' | 'hydronic' | 'heat-pump' | 'mini-split' | 'boiler';
  
  // Equipment
  equipment: HVACEquipment[];
  
  // Thermostat
  thermostat?: Thermostat;
  
  // Zones
  zones: HVACSubZone[];
}

export interface HVACEquipment extends BaseEntity {
  type: 'furnace' | 'air-handler' | 'condenser' | 'boiler' | 'heat-pump';
  position: Point2D;
  
  // Capacity
  heatingCapacity?: number; // BTU/hr
  coolingCapacity?: number; // BTU/hr
  
  // Efficiency
  afue?: number; // Annual Fuel Utilization Efficiency
  seer?: number; // Seasonal Energy Efficiency Ratio
  hspf?: number; // Heating Seasonal Performance Factor
  
  // Ductwork
  ductwork?: DuctworkSegment[];
}

export interface Thermostat extends BaseEntity {
  position: Point2D;
  
  // Type
  type: 'manual' | 'programmable' | 'smart';
  
  // Settings
  heatingSetpoint: number; // Fahrenheit or Celsius
  coolingSetpoint: number;
  
  // Schedules
  schedules?: ThermostatSchedule[];
}

export interface DuctworkSegment extends BaseEntity {
  startPoint: Point2D;
  endPoint: Point2D;
  diameter: number; // inches or mm
  type: 'supply' | 'return' | 'exhaust';
  material: string;
}

export interface HVACSubZone extends BaseEntity {
  roomIds: string[];
  
  // Control
  damper?: string;
  temperatureSensor?: string;
  
  // Airflow
  requiredAirflow: number; // CFM or m³/h
}

export interface ThermostatSchedule {
  name: string;
  periods: {
    time: string; // HH:MM
    heatingSetpoint: number;
    coolingSetpoint: number;
    day: 'weekday' | 'weekend' | string;
  }[];
}
