/**
 * Unified Scale and Conversion Utilities
 * Centralized scaling logic for floorplan, cabinets, and all dimensions
 */

export type ScaleOption = '1/4"=12"' | '1/2"=12"' | '3/4"=12"' | '1"=12"' | '1-1/4"=12"' | '1-1/2"=12"' | '1-3/4"=12"' | '2"=12"';

export interface ScaleSettings {
  option: ScaleOption;
  ratio: number;
  label: string;
  pixelsPerInch: number;
}

export const SCALE_OPTIONS: Record<ScaleOption, ScaleSettings> = {
  '1/4"=12"': { option: '1/4"=12"', ratio: 48, label: '1/4" = 1\'', pixelsPerInch: 2 },
  '1/2"=12"': { option: '1/2"=12"', ratio: 24, label: '1/2" = 1\'', pixelsPerInch: 4 },
  '3/4"=12"': { option: '3/4"=12"', ratio: 16, label: '3/4" = 1\'', pixelsPerInch: 6 },
  '1"=12"': { option: '1"=12"', ratio: 12, label: '1" = 1\'', pixelsPerInch: 8 },
  '1-1/4"=12"': { option: '1-1/4"=12"', ratio: 9.6, label: '1-1/4" = 1\'', pixelsPerInch: 10 },
  '1-1/2"=12"': { option: '1-1/2"=12"', ratio: 8, label: '1-1/2" = 1\'', pixelsPerInch: 12 },
  '1-3/4"=12"': { option: '1-3/4"=12"', ratio: 6.857, label: '1-3/4" = 1\'', pixelsPerInch: 14 },
  '2"=12"': { option: '2"=12"', ratio: 6, label: '2" = 1\'', pixelsPerInch: 16 },
};

export const DEFAULT_SCALE: ScaleOption = '1/2"=12"';

export const STANDARD_DIMENSIONS = {
  wallHeight: 96,
  finishedFloorOffset: 0.5,
  upperCabinetMountHeight: 54,
  baseCabinetHeight: 30,
  baseCabinetTotalHeight: 34.5,
  toeKickHeight: 4.5,
  baseCabinetDepth: 24,
  wallCabinetDepth: 12,
  tallCabinetDepth: 24,
} as const;

export function inchesToPixels(inches: number, scale: ScaleOption = DEFAULT_SCALE): number {
  return inches * SCALE_OPTIONS[scale].pixelsPerInch;
}

export function pixelsToInches(pixels: number, scale: ScaleOption = DEFAULT_SCALE): number {
  return pixels / SCALE_OPTIONS[scale].pixelsPerInch;
}

export function feetToPixels(feet: number, scale: ScaleOption = DEFAULT_SCALE): number {
  return inchesToPixels(feet * 12, scale);
}

export function pixelsToFeet(pixels: number, scale: ScaleOption = DEFAULT_SCALE): number {
  return pixelsToInches(pixels, scale) / 12;
}

export function feetToInches(feet: number): number {
  return feet * 12;
}

export function inchesToFeet(inches: number): number {
  return inches / 12;
}

export function getScaleSettings(scale: ScaleOption = DEFAULT_SCALE): ScaleSettings {
  return SCALE_OPTIONS[scale];
}

export function getAllScaleOptions(): ScaleOption[] {
  return Object.keys(SCALE_OPTIONS) as ScaleOption[];
}

export function formatDimension(inches: number, showFeet: boolean = true): string {
  if (!showFeet || inches < 12) {
    return `${inches}"`;
  }
  
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  
  if (remainingInches === 0) {
    return `${feet}'`;
  }
  
  return `${feet}'-${remainingInches}"`;
}

export function calculateScaledDimensions(
  inches: number,
  scale: ScaleOption = DEFAULT_SCALE
): {
  pixels: number;
  displayInches: string;
  displayFeet: string;
} {
  return {
    pixels: inchesToPixels(inches, scale),
    displayInches: `${inches}"`,
    displayFeet: formatDimension(inches, true),
  };
}
