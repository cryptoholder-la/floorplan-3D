export const HEIGHT_CONSTANTS = {
  WALL_HEIGHT: 96,
  BASE_CABINET_HEIGHT: 34.5,
  BASE_CABINET_BOX_HEIGHT: 30,
  TOE_KICK_HEIGHT: 4.5,
  FINISHED_FLOOR_OFFSET: 0.5,
  SUBFLOOR: 0,
} as const;

export const UPPER_CABINET_HEIGHTS = {
  SHORT: 30,
  STANDARD: 36,
  TALL: 42,
} as const;

export const TALL_CABINET_HEIGHTS = {
  STANDARD: 79.5,
  TALL: 85.5,
  EXTRA_TALL: 91.5,
} as const;

export interface WallCabinetMountRule {
  cabinetHeight: number;
  mountHeight: number;
  maxCeilingHeight: number;
}

export const WALL_CABINET_MOUNT_RULES: WallCabinetMountRule[] = [
  {
    cabinetHeight: UPPER_CABINET_HEIGHTS.SHORT,
    mountHeight: 54,
    maxCeilingHeight: 84,
  },
  {
    cabinetHeight: UPPER_CABINET_HEIGHTS.STANDARD,
    mountHeight: 54,
    maxCeilingHeight: 90,
  },
  {
    cabinetHeight: UPPER_CABINET_HEIGHTS.TALL,
    mountHeight: 54,
    maxCeilingHeight: 96,
  },
];

export function getWallCabinetMountHeight(
  cabinetHeight: number,
  wallHeight: number = HEIGHT_CONSTANTS.WALL_HEIGHT
): number {
  const rule = WALL_CABINET_MOUNT_RULES.find(
    r => r.cabinetHeight === cabinetHeight && wallHeight <= r.maxCeilingHeight
  );
  
  if (rule) {
    return rule.mountHeight;
  }
  
  return 54;
}

export function getTotalWallCabinetTopHeight(
  cabinetHeight: number,
  mountHeight?: number
): number {
  const mount = mountHeight ?? getWallCabinetMountHeight(cabinetHeight);
  return mount + cabinetHeight;
}

export function inchesToFeet(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  
  if (remainingInches === 0) {
    return `${feet}'`;
  }
  
  return `${feet}' ${remainingInches}"`;
}

export function feetToInches(feet: number, inches: number = 0): number {
  return feet * 12 + inches;
}
