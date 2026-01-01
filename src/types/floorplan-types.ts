// Floorplan Type Definitions for Floorplan 3D

export interface Floorplan {
  id: string;
  name: string;
  description?: string;
  
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
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version: string;
  createdBy?: string;
}

export interface Wall {
  id: string;
  name: string;
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
  
  visible: boolean;
  locked: boolean;
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

export interface Door {
  id: string;
  name: string;
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
  
  visible: boolean;
  locked: boolean;
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
  | ' dutch';

export interface Window {
  id: string;
  name: string;
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
  
  visible: boolean;
  locked: boolean;
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

export interface Room {
  id: string;
  name: string;
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
  
  visible: boolean;
  locked: boolean;
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

export interface Fixture {
  id: string;
  name: string;
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
  
  visible: boolean;
  locked: boolean;
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

export interface CabinetPlacement {
  id: string;
  cabinetId: string; // reference to cabinet definition
  name: string;
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
  
  visible: boolean;
  locked: boolean;
}

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
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

export interface LightFixture {
  id: string;
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

export interface LightingControl {
  id: string;
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

export interface HVACZone {
  id: string;
  name: string;
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

export interface HVACEquipment {
  id: string;
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

export interface Thermostat {
  id: string;
  position: Point2D;
  
  // Type
  type: 'manual' | 'programmable' | 'smart';
  
  // Settings
  heatingSetpoint: number; // Fahrenheit or Celsius
  coolingSetpoint: number;
  
  // Schedules
  schedules?: ThermostatSchedule[];
}

export interface DuctworkSegment {
  id: string;
  startPoint: Point2D;
  endPoint: Point2D;
  diameter: number; // inches or mm
  type: 'supply' | 'return' | 'exhaust';
  material: string;
}

export interface HVACSubZone {
  id: string;
  name: string;
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

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Import cabinet types for reference
import { Cabinet } from './cabinet.types';
