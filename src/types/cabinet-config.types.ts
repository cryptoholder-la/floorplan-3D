/**
 * Comprehensive Cabinet Configuration Types
 * Includes all cabinet types, sizes, drawer configs, rollouts, and hardware
 */

export type BaseCabinetType = 
  | 'B9' | 'B12' | 'B15' | 'B18' | 'B21' | 'B24' | 'B27' | 'B30' | 'B33' | 'B36'  // Single door
  | 'DB12' | 'DB15' | 'DB18' | 'DB21' | 'DB24' | 'DB27' | 'DB30' | 'DB33' | 'DB36'  // Drawer base
  | 'SB24' | 'SB30' | 'SB33' | 'SB36'  // Sink base
  | '3DB12' | '3DB15' | '3DB18'  // 3 Drawer base
  | '4DB12' | '4DB15' | '4DB18';  // 4 Drawer base

export type WallCabinetType =
  | 'W1212' | 'W1215' | 'W1218' | 'W1221' | 'W1224' | 'W1227' | 'W1230' | 'W1233' | 'W1236'  // 12" wide
  | 'W1512' | 'W1515' | 'W1518' | 'W1521' | 'W1524' | 'W1527' | 'W1530' | 'W1533' | 'W1536'  // 15" wide
  | 'W1812' | 'W1815' | 'W1818' | 'W1821' | 'W1824' | 'W1827' | 'W1830' | 'W1833' | 'W1836'  // 18" wide
  | 'W2412' | 'W2415' | 'W2418' | 'W2421' | 'W2424' | 'W2427' | 'W2430' | 'W2433' | 'W2436'  // 24" wide (2 doors)
  | 'W3012' | 'W3015' | 'W3018' | 'W3021' | 'W3024' | 'W3027' | 'W3030' | 'W3033' | 'W3036'  // 30" wide (2 doors)
  | 'W3612' | 'W3615' | 'W3618' | 'W3621' | 'W3624' | 'W3627' | 'W3630' | 'W3633' | 'W3636';  // 36" wide (2 doors)

export type TallCabinetType =
  | 'T1279' | 'T1285' | 'T1291'  // 12" wide
  | 'T1579' | 'T1585' | 'T1591'  // 15" wide
  | 'T1879' | 'T1885' | 'T1891'  // 18" wide
  | 'T2179' | 'T2185' | 'T2191'  // 21" wide
  | 'T2479' | 'T2485' | 'T2491'  // 24" wide
  | 'T2779' | 'T2785' | 'T2791'  // 27" wide
  | 'T3079' | 'T3085' | 'T3091'  // 30" wide
  | 'T3379' | 'T3385' | 'T3391'  // 33" wide
  | 'T3679' | 'T3685' | 'T3691';  // 36" wide

export type CabinetFunction = 
  | 'standard'
  | 'sink-base'
  | 'drawer-base'
  | 'trash-pullout'
  | 'lazy-susan'
  | 'corner-base'
  | 'blind-corner'
  | 'appliance-garage'
  | 'spice-pullout'
  | 'tray-divider'
  | 'pantry';

export interface DovetailDrawerConfig {
  width: number;
  depth: number;
  height: number;
  
  dovetailType: 'half-blind' | 'through' | 'sliding';
  dovetailSpacing: number;  // Typical 2-4 inches
  pinCount: number;
  
  material: 'maple' | 'birch' | 'poplar' | 'oak';
  thickness: 0.5 | 0.625;  // 1/2" or 5/8"
  
  bottomMaterial: 'plywood' | 'mdf';
  bottomThickness: 0.25 | 0.375;
  bottomGrooveOffset: number;  // Typically 0.375" from bottom
  
  frontStyle: 'false-front' | 'slab' | 'shaker';
  frontOverlay: number;  // Typically 0.75" for full overlay
  
  slide: BlumDrawerSlide;
  
  hasUnderMount: boolean;
  hasSoftClose: boolean;
  hasBlumotion: boolean;
}

export type DrawerConfiguration = 
  | 'single-drawer'
  | 'two-drawer'
  | 'three-drawer'
  | 'four-drawer'
  | 'five-drawer';

export interface RolloutConfig {
  type: 'full-extension' | 'three-quarter' | 'single-tray' | 'double-tray' | 'wire-basket';
  width: number;
  depth: number;
  height: number;
  
  material: 'plywood' | 'melamine' | 'wire';
  
  slide: BlumDrawerSlide;
  hasStops: boolean;
  hasDividersOptions: boolean;
  
  capacity: number;  // Weight capacity in lbs
}

export type BlumHingeType = 
  | 'CLIP-top-BLUMOTION-110'  // Standard overlay
  | 'CLIP-top-BLUMOTION-120'  // Wide angle
  | 'CLIP-top-BLUMOTION-155'  // Bi-fold
  | 'CLIP-top-BLUMOTION-170'  // Wide angle
  | 'CLIP-top-INSERTA'  // Thin doors
  | 'COMPACT-BLUMOTION-33'  // Narrow cabinets
  | 'COMPACT-BLUMOTION-38';  // Standard

export type BlumDrawerSlideType =
  | 'TANDEM-BLUMOTION'  // Standard undermount
  | 'TANDEM-PLUS-BLUMOTION'  // Heavy duty
  | 'MOVENTO'  // Tip-On
  | 'MOVENTO-TIP-ON'  // Push to open
  | 'LEGRABOX'  // Premium
  | 'METABOX';  // Economy

export type BlumLiftSystemType =
  | 'AVENTOS-HF'  // Flip-up (narrow cabinets)
  | 'AVENTOS-HS'  // Lift-up (standard)
  | 'AVENTOS-HL'  // Flip-up (standard)
  | 'AVENTOS-HK-S'  // Bi-fold (top)
  | 'AVENTOS-HK-XS'  // Bi-fold (top, compact)
  | 'AVENTOS-HK'  // Stay lift (top);

export interface BlumHinge {
  type: BlumHingeType;
  model: string;
  opening: 110 | 120 | 155 | 170 | 95;  // Opening angle
  overlay: number;  // Typically -2mm to +6mm
  hasBlumotion: boolean;  // Soft close
  
  mountingPlate: string;  // e.g., 'CLIP-top-173H7100'
  screws: {
    type: string;
    quantity: number;
  };
  
  drillingPattern: {
    centerDistance: 52;  // 52mm standard
    diameter: 35;  // 35mm cup
    depth: 11.5 | 12.5;  // mm
    offsetFromEdge: 3 | 4 | 5;  // mm
  };
  
  heightPosition: {
    top: number;  // Distance from top
    bottom: number;  // Distance from bottom
  };
}

export interface BlumDrawerSlide {
  type: BlumDrawerSlideType;
  model: string;
  length: 270 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650;  // mm
  weightCapacity: 30 | 40 | 50 | 65 | 70;  // kg
  
  extension: 'full' | '3/4';
  hasBlumotion: boolean;
  hasTipOn: boolean;
  
  mountingHeight: number;  // From cabinet bottom
  sideGap: number;  // Typically 12.5mm per side
  
  frontGap: number;  // Cabinet front to drawer front
  rearGap: number;  // Clearance at back
}

export interface BlumLiftSystem {
  type: BlumLiftSystemType;
  model: string;
  doorWeight: {
    min: number;
    max: number;
  };
  
  doorWidth: {
    min: number;
    max: number;
  };
  
  cabinetWidth: {
    min: number;
    max: number;
  };
  
  powerFactor: number;  // Spring strength
  hasBlumotion: boolean;
  
  drillingPattern: {
    topHinge: {
      x: number;
      y: number;
    };
    bottomHinge?: {
      x: number;
      y: number;
    };
  };
}

export interface CabinetSuiteConfig {
  cabinetType: BaseCabinetType | WallCabinetType | TallCabinetType;
  
  function: CabinetFunction;
  
  drawerConfig?: {
    configuration: DrawerConfiguration;
    drawers: DovetailDrawerConfig[];
  };
  
  rollouts?: RolloutConfig[];
  
  hardware: {
    hinges: BlumHinge[];
    slides?: BlumDrawerSlide[];
    liftSystem?: BlumLiftSystem;
  };
  
  shelves: {
    adjustable: boolean;
    count: number;
    material: 'plywood' | 'melamine';
    thickness: 0.75;
    edgeBanding: boolean;
  };
  
  interior: {
    hasLighting: boolean;
    hasOutlets: boolean;
    hasDividers: boolean;
    hasSpiceRack: boolean;
  };
}

export interface BlumHardwareTemplates {
  hinges: Record<BlumHingeType, BlumHinge>;
  slides: Record<BlumDrawerSlideType, BlumDrawerSlide[]>;
  liftSystems: Record<BlumLiftSystemType, BlumLiftSystem>;
}
