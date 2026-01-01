// CABINET TYPES - Cabinet-specific type definitions
// Consolidates all cabinet-related types from fragmented files

import { 
  BaseEntity, 
  CabinetDimensions, 
  CabinetWidth,
  CabinetDepth,
  CabinetHeight,
  Material, 
  Hardware, 
  Tolerance, 
  Point2D, 
  Point3D,
  Status,
  Difficulty
} from '../core/base.types';
import { Polygon, Rectangle, BoundingBox } from '../core/geometry.types';

// ============================================================================
// CABINET CORE TYPES
// ============================================================================

export interface Cabinet extends BaseEntity {
  type: CabinetType;
  dimensions: CabinetDimensions;
  parts: CabinetPart[];
  hardware: CabinetHardware[];
  materials: CabinetMaterial[];
  configuration: CabinetConfiguration;
  estimatedCost?: number;
  estimatedTime?: number;
  difficulty: Difficulty;
  status: Status;
  notes?: string;
  tags: string[];
  metadata: CabinetMetadata;
}

export type CabinetType = 
  | 'base'
  | 'wall'
  | 'tall'
  | 'corner'
  | 'sink'
  | 'range'
  | 'microwave'
  | 'oven'
  | 'refrigerator'
  | 'dishwasher'
  | 'wine-cooler'
  | 'display'
  | 'bookshelf'
  | 'desk'
  | 'vanity'
  | 'custom';

export interface CabinetMetadata {
  roomType?: string;
  installationType: InstallationType;
  weightCapacity?: number; // kg
  doorStyle: DoorStyle;
  finishType: FinishType;
  assemblyRequired: boolean;
  customFeatures: string[];
}

export type InstallationType = 
  | 'floor-mounted'
  | 'wall-mounted'
  | 'floating'
  | 'freestanding'
  | 'built-in'
  | 'recessed';

export type DoorStyle = 
  | 'full-overlay'
  | 'partial-overlay'
  | 'inset'
  | 'frameless'
  | 'framed'
  | 'beaded-inset';

export type FinishType = 
  | 'stain'
  | 'paint'
  | 'laminate'
  | 'natural'
  | 'thermofoil'
  | 'melamine'
  | 'lacquer'
  | 'oil';

// ============================================================================
// CABINET PARTS
// ============================================================================

export interface CabinetPart extends BaseEntity {
  partType: PartType;
  material: CabinetMaterial;
  dimensions: PartDimensions;
  quantity: number;
  grainDirection?: GrainDirection;
  edgeBanding: EdgeBanding;
  machining: MachiningOperations;
  hardware: PartHardware[];
  tolerances: PartTolerance[];
  cost?: number;
  weight?: number;
}

export type PartType = 
  | 'side'
  | 'top'
  | 'bottom'
  | 'back'
  | 'shelf'
  | 'door'
  | 'drawer-front'
  | 'drawer-side'
  | 'drawer-back'
  | 'drawer-bottom'
  | 'face-frame'
  | 'rail'
  | 'stile'
  | 'panel'
  | 'toe-kick'
  | 'filler'
  | 'crown-molding'
  | 'base-molding'
  | 'custom';

export interface PartDimensions {
  width: number;
  height: number;
  thickness: number;
  length?: number; // for molded parts
  radius?: number; // for curved parts
}

export type GrainDirection = 'horizontal' | 'vertical' | 'none' | 'diagonal';

export interface EdgeBanding {
  top: EdgeBandingDetail;
  bottom: EdgeBandingDetail;
  left: EdgeBandingDetail;
  right: EdgeBandingDetail;
}

export interface EdgeBandingDetail {
  enabled: boolean;
  material?: string;
  thickness: number;
  color?: string;
  grainDirection?: GrainDirection;
}

export interface MachiningOperations {
  drilling: DrillingOperation[];
  routing: RoutingOperation[];
  cutting: CuttingOperation[];
  sanding: SandingOperation[];
  assembly: AssemblyOperation[];
}

export interface DrillingOperation {
  id: string;
  patternId: string;
  position: Point2D;
  diameter: number;
  depth: number;
  angle?: number;
  tolerance: Tolerance;
  toolType: string;
  notes?: string;
}

export interface RoutingOperation {
  id: string;
  profile: RouterProfile;
  path: Polygon;
  depth: number;
  passes: number;
  toolType: string;
  feedRate: number;
  spindleSpeed: number;
}

export interface RouterProfile {
  type: 'straight' | 'roundover' | 'chamfer' | 'ogee' | 'cove' | 'custom';
  radius?: number;
  angle?: number;
  depth?: number;
}

export interface CuttingOperation {
  id: string;
  type: 'rip' | 'crosscut' | 'miter' | 'bevel' | 'curve';
  dimensions: PartDimensions;
  angle?: number;
  bladeType: string;
  feedRate: number;
}

export interface SandingOperation {
  id: string;
  grit: number;
  type: 'flat' | 'edge' | 'profile' | 'final';
  passes: number;
  notes?: string;
}

export interface AssemblyOperation {
  id: string;
  type: AssemblyType;
  hardwareId: string;
  position: Point2D;
  quantity: number;
  sequence: number;
}

export type AssemblyType = 
  | 'screw'
  | 'dowel'
  | 'biscuit'
  | 'domino'
  | 'pocket-hole'
  | 'mortise-tenon'
  | 'dado'
  | 'rabbet'
  | 'glue'
  | 'clamp';

export interface PartHardware {
  hardwareId: string;
  quantity: number;
  position: Point2D;
  orientation: number;
  insertionMethod: InsertionMethod;
}

export type InsertionMethod = 
  | 'surface-mount'
  | 'recessed'
  | 'flush'
  | 'countersunk'
  | 'pocket'
  | 'mortise';

export interface PartTolerance {
  dimension: string;
  tolerance: Tolerance;
  critical: boolean;
  measurementMethod: MeasurementMethod;
}

export type MeasurementMethod = 
  | 'caliper'
  | 'tape-measure'
  | 'square'
  | 'level'
  | 'laser'
  | 'cmm'
  | 'template';

// ============================================================================
// CABINET MATERIALS
// ============================================================================

export interface CabinetMaterial extends Material {
  grade: MaterialGrade;
  surfaceFinish: SurfaceFinish;
  moistureContent: number; // percentage
  formaldehydeEmission: FormaldehydeClass;
  fireRating: FireRating;
  structuralProperties: StructuralProperties;
  workability: WorkabilityProperties;
}

export type MaterialGrade = 
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'shop'
  | 'premium'
  | 'economy'
  | 'industrial';

export type SurfaceFinish = 
  | 'smooth'
  | 'textured'
  | 'glossy'
  | 'matte'
  | 'satin'
  | 'rough'
  | 'pre-finished'
  | 'raw';

export type FormaldehydeClass = 
  | 'E0'
  | 'E1'
  | 'E2'
  | 'CARB-Phase-1'
  | 'CARB-Phase-2'
  | 'NAF'
  | 'UF';

export type FireRating = 
  | 'A'
  | 'B'
  | 'C'
  | 'Class-1'
  | 'Class-2'
  | 'Class-3'
  | 'non-rated';

export interface StructuralProperties {
  modulusOfElasticity: number; // MPa
  modulusOfRupture: number; // MPa
  compressiveStrength: number; // MPa
  shearStrength: number; // MPa;
  hardness: number; // Janka
  density: number; // kg/m³
}

export interface WorkabilityProperties {
  easeOfCutting: number; // 1-10 scale
  machiningQuality: number; // 1-10 scale
  screwHolding: number; // 1-10 scale
  glueBonding: number; // 1-10 scale
  finishingQuality: number; // 1-10 scale
}

// ============================================================================
// CABINET HARDWARE
// ============================================================================

export interface CabinetHardware extends Hardware {
  category: HardwareCategory;
  specifications: HardwareSpecifications;
  installation: InstallationRequirements;
  finish: HardwareFinish;
  loadRating?: LoadRating;
  warranty?: Warranty;
}

export type HardwareCategory = 
  | 'hinges'
  | 'handles'
  | 'drawer-slides'
  | 'shelf-pins'
  | 'fasteners'
  | 'dowels'
  | 'brackets'
  | 'legs'
  | 'casters'
  | 'lighting'
  | 'accessories';

export interface HardwareSpecifications {
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    thickness?: number;
  };
  weight: number;
  material: string;
  mountingPattern: MountingPattern;
  adjustmentRange?: AdjustmentRange;
  specialFeatures: string[];
}

export interface MountingPattern {
  type: 'single-screw' | 'two-screw' | 'three-screw' | 'four-screw' | 'custom';
  spacing: {
    x?: number;
    y?: number;
  };
  holeSize: number;
  counterbore?: boolean;
  countersink?: boolean;
}

export interface AdjustmentRange {
  horizontal?: number; // mm
  vertical?: number; // mm
  depth?: number; // mm
  rotation?: number; // degrees
}

export interface InstallationRequirements {
  tools: string[];
  skills: string[];
  timeEstimate: number; // minutes
  difficulty: Difficulty;
  specialInstructions: string[];
  clearanceRequirements: ClearanceRequirements;
}

export interface ClearanceRequirements {
  front: number;
  back: number;
  sides: number;
  top: number;
  bottom: number;
}

export type HardwareFinish = 
  | 'polished-chrome'
  | 'satin-chrome'
  | 'matte-chrome'
  | 'polished-brass'
  | 'satin-brass'
  | 'antique-brass'
  | 'oil-rubbed-bronze'
  | 'satin-nickel'
  | 'matte-black'
  | 'white'
  | 'stainless-steel'
  | 'custom';

export interface LoadRating {
  staticLoad: number; // kg
  dynamicLoad: number; // kg
  safetyFactor: number;
  testMethod: string;
}

export interface Warranty {
  duration: number; // months
  coverage: string[];
  conditions: string[];
  claimProcess: string;
}

// ============================================================================
// CABINET CONFIGURATION
// ============================================================================

export interface CabinetConfiguration {
  style: CabinetStyle;
  construction: ConstructionMethod;
  joinery: JoineryMethod;
  finishing: FinishingOptions;
  hardware: HardwareConfiguration;
  customizations: CustomizationOptions;
}

export type CabinetStyle = 
  | 'traditional'
  | 'modern'
  | 'shaker'
  | 'flat-panel'
  | 'raised-panel'
  | 'mission'
  | 'craftsman'
  | 'contemporary'
  | 'industrial'
  | 'farmhouse'
  | 'european';

export type ConstructionMethod = 
  | 'frameless'
  | 'face-frame'
  | 'inset'
  | 'overlay'
  | 'partial-overlay';

export type JoineryMethod = 
  | 'butt-joint'
  | 'dowel-joint'
  | 'mortise-tenon'
  | 'dado-joint'
  | 'rabbet-joint'
  | 'biscuit-joint'
  | 'pocket-hole'
  | 'domino'
  | 'custom';

export interface FinishingOptions {
  interior: InteriorFinish;
  exterior: ExteriorFinish;
  edgeBanding: EdgeBandingOptions;
  protectiveCoating: ProtectiveCoating;
}

export interface InteriorFinish {
  material: string;
  color: string;
  sheen: SheenLevel;
  texture: Texture;
}

export interface ExteriorFinish {
  material: string;
  color: string;
  sheen: SheenLevel;
  texture: Texture;
  glazing?: GlazingOptions;
}

export type SheenLevel = 
  | 'matte'
  | 'eggshell'
  | 'satin'
  | 'semi-gloss'
  | 'gloss'
  | 'high-gloss';

export type Texture = 
  | 'smooth'
  | 'textured'
  | 'grained'
  | 'distressed'
  | 'brushed'
  | 'polished';

export interface GlazingOptions {
  type: 'clear' | 'tinted' | 'frosted' | 'antiqued';
  color?: string;
  coverage: 'light' | 'medium' | 'heavy';
  technique: 'spray' | 'brush' | 'rag' | 'dip';
}

export interface EdgeBandingOptions {
  enabled: boolean;
  material: string;
  thickness: number;
  color: string;
  grainDirection: GrainDirection;
  application: 'hot-melt' | 'cold-press' | 'contact-cement';
}

export interface ProtectiveCoating {
  type: 'none' | 'lacquer' | 'polyurethane' | 'varnish' | 'wax' | 'oil';
  sheen: SheenLevel;
  coats: number;
  application: 'spray' | 'brush' | 'wipe-on';
}

export interface HardwareConfiguration {
  hinges: HingeConfiguration;
  handles: HandleConfiguration;
  drawerSlides: DrawerSlideConfiguration;
  shelfSupports: ShelfSupportConfiguration;
  lighting?: LightingConfiguration;
}

export interface HingeConfiguration {
  type: HingeType;
  brand: string;
  model: string;
  finish: HardwareFinish;
  quantity: number;
  features: string[];
}

export type HingeType = 
  | 'concealed'
  | 'semi-concealed'
  | 'surface-mount'
  | 'knife-hinge'
  | 'piano-hinge'
  | 'butterfly-hinge'
  | 'strap-hinge'
  | 'offset-hinge';

export interface HandleConfiguration {
  type: HandleType;
  brand: string;
  model: string;
  finish: HardwareFinish;
  quantity: number;
  spacing: number; // center-to-center
  features: string[];
}

export type HandleType = 
  | 'pull'
  | 'knob'
  | 'bar-pull'
  | 'cup-pull'
  | 'ring-pull'
  | 'handle'
  | 'bail-pull'
  | 'custom';

export interface DrawerSlideConfiguration {
  type: DrawerSlideType;
  brand: string;
  model: string;
  finish: HardwareFinish;
  quantity: number;
  features: string[];
}

export type DrawerSlideType = 
  | 'side-mount'
  | 'undermount'
  | 'center-mount'
  | 'bottom-mount'
  | 'concealed'
  | 'soft-close'
  | 'self-close';

export interface ShelfSupportConfiguration {
  type: ShelfSupportType;
  brand: string;
  model: string;
  finish: HardwareFinish;
  quantity: number;
  spacing: number; // mm
}

export type ShelfSupportType = 
  | 'pin'
  | 'bracket'
  | 'clip'
  | 'adjustable'
  | 'fixed'
  | 'floating';

export interface LightingConfiguration {
  type: LightingType;
  brand: string;
  model: string;
  finish: HardwareFinish;
  power: number; // watts
  voltage: number; // volts
  colorTemperature: number; // Kelvin
  dimmable: boolean;
  quantity: number;
}

export type LightingType = 
  | 'led-strip'
  | 'puck-light'
  | 'under-cabinet'
  | 'in-cabinet'
  | 'task-light'
  | 'accent-light';

export interface CustomizationOptions {
  modifications: CabinetModification[];
  specialFeatures: SpecialFeature[];
  customParts: CustomPart[];
  uniqueRequirements: string[];
}

export interface CabinetModification {
  type: ModificationType;
  description: string;
  impact: ModificationImpact;
  cost: number;
  timeImpact: number; // days
}

export type ModificationType = 
  | 'size-adjustment'
  | 'material-change'
  | 'hardware-upgrade'
  | 'feature-addition'
  | 'style-change'
  | 'construction-change';

export interface ModificationImpact {
  structural: boolean;
  aesthetic: boolean;
  functional: boolean;
  cost: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface SpecialFeature {
  name: string;
  description: string;
  category: FeatureCategory;
  cost: number;
  timeImpact: number;
  requirements: string[];
}

export type FeatureCategory = 
  | 'storage'
  | 'accessibility'
  | 'technology'
  | 'lighting'
  | 'security'
  | 'ventilation'
  | 'custom';

export interface CustomPart {
  name: string;
  description: string;
  material: string;
  dimensions: PartDimensions;
  quantity: number;
  manufacturing: CustomManufacturing;
  cost: number;
}

export interface CustomManufacturing {
  method: ManufacturingMethod;
  tooling: string[];
  setupTime: number; // hours
  runTime: number; // hours per part
  specialRequirements: string[];
}

export type ManufacturingMethod = 
  | 'cnc-routing'
  | 'laser-cutting'
  | '3d-printing'
  | 'vacuum-forming'
  | 'injection-molding'
  | 'manual-fabrication';

// ============================================================================
// CABINET TEMPLATES
// ============================================================================

export interface CabinetTemplate extends BaseEntity {
  category: TemplateCategory;
  cabinetType: CabinetType;
  baseCabinet: Cabinet;
  configurableDimensions: ConfigurableDimensions;
  estimatedCost: number;
  estimatedTime: number;
  difficulty: Difficulty;
  popularity: number; // 1-10 scale
  tags: string[];
  images: TemplateImage[];
  documentation: TemplateDocumentation;
}

export type TemplateCategory = 
  | 'kitchen'
  | 'bathroom'
  | 'office'
  | 'laundry'
  | 'garage'
  | 'closet'
  | 'entertainment'
  | 'storage'
  | 'custom';

export interface ConfigurableDimensions {
  width: CabinetWidth[];
  depth: CabinetDepth[];
  height: CabinetHeight[];
  customRanges: {
    width?: { min: number; max: number; increment: number };
    depth?: { min: number; max: number; increment: number };
    height?: { min: number; max: number; increment: number };
  };
}

export interface TemplateImage {
  type: 'rendering' | 'photograph' | 'drawing' | 'schematic';
  url: string;
  description: string;
  primary: boolean;
}

export interface TemplateDocumentation {
  instructions: string[];
  materials: string[];
  tools: string[];
  tips: string[];
  warnings: string[];
}

// ============================================================================
// CABINET CATALOG
// ============================================================================

export interface CabinetCatalog extends BaseEntity {
  manufacturer: string;
  version: string;
  cabinets: Cabinet[];
  templates: CabinetTemplate[];
  materials: CabinetMaterial[];
  hardware: CabinetHardware[];
  pricing: CatalogPricing;
  availability: CatalogAvailability;
  specifications: CatalogSpecifications;
}

export interface CatalogPricing {
  currency: string;
  effectiveDate: Date;
  priceLists: PriceList[];
  discounts: DiscountStructure[];
}

export interface PriceList {
  name: string;
  region: string;
  items: PriceListItem[];
}

export interface PriceListItem {
  itemId: string;
  itemType: 'cabinet' | 'material' | 'hardware' | 'template';
  unitPrice: number;
  unit: string;
  minimumQuantity: number;
  priceBreaks: PriceBreak[];
}

export interface PriceBreak {
  quantity: number;
  unitPrice: number;
  effectiveDate: Date;
}

export interface DiscountStructure {
  type: 'percentage' | 'fixed' | 'tiered';
  conditions: DiscountCondition[];
  calculation: DiscountCalculation;
}

export interface DiscountCondition {
  field: string;
  operator: 'equals' | 'greater-than' | 'less-than' | 'between';
  value: any;
}

export interface DiscountCalculation {
  method: 'percentage' | 'fixed' | 'formula';
  value: number;
  formula?: string;
}

export interface CatalogAvailability {
  regions: string[];
  leadTimes: LeadTime[];
  restrictions: AvailabilityRestriction[];
}

export interface LeadTime {
  itemType: string;
  region: string;
  standard: number; // days
  expedited?: number; // days
  conditions: string[];
}

export interface AvailabilityRestriction {
  itemType: string;
  region: string;
  restriction: string;
  reason: string;
  alternative?: string;
}

export interface CatalogSpecifications {
  standards: ComplianceStandard[];
  certifications: Certification[];
  testing: TestResult[];
  warranties: CatalogWarranty[];
}

export interface ComplianceStandard {
  name: string;
  organization: string;
  version: string;
  scope: string[];
  compliant: boolean;
  notes?: string;
}

export interface Certification {
  name: string;
  organization: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  scope: string[];
}

export interface TestResult {
  name: string;
  standard: string;
  date: Date;
  results: TestMetric[];
  overall: 'pass' | 'fail' | 'conditional';
}

export interface TestMetric {
  name: string;
  value: number;
  unit: string;
  requirement: number;
  result: 'pass' | 'fail';
}

export interface CatalogWarranty {
  type: string;
  duration: number; // months
  coverage: string[];
  exclusions: string[];
  claimProcess: string;
  contact: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CABINET_TYPES: CabinetType[] = [
  'base', 'wall', 'tall', 'corner', 'sink', 'range', 'microwave',
  'oven', 'refrigerator', 'dishwasher', 'wine-cooler', 'display',
  'bookshelf', 'desk', 'vanity', 'custom'
];

export const PART_TYPES: PartType[] = [
  'side', 'top', 'bottom', 'back', 'shelf', 'door', 'drawer-front',
  'drawer-side', 'drawer-back', 'drawer-bottom', 'face-frame',
  'rail', 'stile', 'panel', 'toe-kick', 'filler', 'crown-molding',
  'base-molding', 'custom'
];

export const HARDWARE_CATEGORIES: HardwareCategory[] = [
  'hinges', 'handles', 'drawer-slides', 'shelf-pins', 'fasteners',
  'dowels', 'brackets', 'legs', 'casters', 'lighting', 'accessories'
];

export const CABINET_STYLES: CabinetStyle[] = [
  'traditional', 'modern', 'shaker', 'flat-panel', 'raised-panel',
  'mission', 'craftsman', 'contemporary', 'industrial', 'farmhouse', 'european'
];

export const CONSTRUCTION_METHODS: ConstructionMethod[] = [
  'frameless', 'face-frame', 'inset', 'overlay', 'partial-overlay'
];

export const JOINERY_METHODS: JoineryMethod[] = [
  'butt-joint', 'dowel-joint', 'mortise-tenon', 'dado-joint',
  'rabbet-joint', 'biscuit-joint', 'pocket-hole', 'domino', 'custom'
];
