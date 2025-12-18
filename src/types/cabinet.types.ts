/**
 * Base Cabinet Parametric System
 * Full overlay construction with adjustable dimensions
 */

export type CabinetWidth = 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36;
export type WallCabinetWidth = 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36;
export type WallCabinetHeight = 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36 | 39 | 42;
export type TallCabinetWidth = 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36;
export type TallCabinetHeight = 79.5 | 85.5 | 91.5;

export type CabinetType = 'base' | 'wall' | 'tall';

export interface BaseCabinetDimensions {
  width: CabinetWidth; // Width in inches (9-36 in 3" steps)
  depth: number; // Standard 24"
  height: number; // Standard 30" (box height)
  toeKickHeight: number; // Standard 4.5"
  toeKickDepth: number; // Standard 21" (3" recess)
  totalHeight: number; // 34.5" (30" + 4.5")
}

export interface WallCabinetDimensions {
  width: WallCabinetWidth;
  depth: number; // 12" box + 0.875" door = 12.875" total
  height: WallCabinetHeight;
  boxDepth: number; // 12"
  doorThickness: number; // 0.875"
  hasTwoDoors: boolean; // Over 21" wide = two doors
}

export interface TallCabinetDimensions {
  width: TallCabinetWidth;
  depth: number; // 24" box + 0.875" door = 24.875" total
  height: TallCabinetHeight;
  boxDepth: number; // 24"
  doorThickness: number; // 0.875"
  toeKickHeight: number; // 4.5"
  toeKickDepth: number; // 21" (3" setback)
  boxHeight: number; // Total height minus toe kick
}

export interface CabinetMaterial {
  thickness: number; // Material thickness (typically 0.75" for 3/4" plywood)
  type: 'plywood' | 'mdf' | 'particleboard';
}

export interface CabinetComponents {
  // Box components
  leftSide: ComponentDimensions;
  rightSide: ComponentDimensions;
  bottom: ComponentDimensions;
  top: ComponentDimensions; // Optional stretcher
  back: ComponentDimensions;
  
  // Shelf components
  adjustableShelf?: ComponentDimensions;
  
  // Face frame (full overlay has minimal or no face frame)
  door: ComponentDimensions;
  drawerFront?: ComponentDimensions;
  
  // Toe kick
  toeKickFront: ComponentDimensions;
  toeKickSides: ComponentDimensions[];
}

export interface ComponentDimensions {
  name: string;
  width: number;
  height: number;
  depth?: number; // For 3D components
  quantity: number;
  material: string;
  thickness: number;
  edgeBanding?: EdgeBandingSpec;
  holes?: HolePattern[];
  grooves?: Groove[];
}

export interface EdgeBandingSpec {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  front?: boolean;
  back?: boolean;
}

export interface HolePattern {
  type: 'shelf-pin' | 'hinge' | 'mounting' | 'drawer-slide';
  x: number;
  y: number;
  z?: number;
  diameter: number;
  depth: number;
  spacing?: number; // For repeated patterns
  count?: number;
}

export interface Groove {
  type: 'dado' | 'rabbet' | 'back-panel';
  x: number;
  y: number;
  width: number;
  depth: number;
  length: number;
  orientation: 'horizontal' | 'vertical';
}

export interface WireframeView {
  type: 'top' | 'elevation' | '3d-iso';
  scale: number;
  showDimensions: boolean;
  showInternals: boolean;
}

export interface BaseCabinet {
  id: string;
  dimensions: BaseCabinetDimensions;
  material: CabinetMaterial;
  components: CabinetComponents;
  configuration: CabinetConfiguration;
}

export interface CabinetConfiguration {
  hasDrawer: boolean;
  drawerCount?: number;
  hasAdjustableShelf: boolean;
  shelfCount?: number;
  doorStyle: 'slab' | 'shaker' | 'raised-panel';
  hingeType: 'concealed' | 'european' | 'butt';
  overlay: 'full' | 'partial' | 'inset';
}

export interface CabinetDrawing {
  topView: WireframeGeometry;
  elevationView: WireframeGeometry;
  isoView: WireframeGeometry;
}

export interface WireframeGeometry {
  lines: Line3D[];
  dimensions: DimensionLine[];
  annotations: Annotation[];
}

export interface Line3D {
  start: Point3D;
  end: Point3D;
  style?: 'solid' | 'dashed' | 'hidden';
  color?: string;
  weight?: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface DimensionLine {
  start: Point3D;
  end: Point3D;
  value: number;
  unit: 'inches' | 'mm';
  label?: string;
  offset?: number;
}

export interface Annotation {
  position: Point3D;
  text: string;
  fontSize?: number;
  leader?: boolean;
}