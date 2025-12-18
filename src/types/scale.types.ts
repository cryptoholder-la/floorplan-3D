export type ScaleOption = '1/4"=12"' | '1/2"=12"' | '3/4"=12"' | '1"=12"' | '1-1/4"=12"' | '1-1/2"=12"' | '1-3/4"=12"' | '2"=12"';

export interface ScaleSettings {
  option: ScaleOption;
  ratio: number;
  label: string;
  pixelsPerInch: number;
}

export const SCALE_OPTIONS: Record<ScaleOption, ScaleSettings> = {
  '1/4"=12"': {
    option: '1/4"=12"',
    ratio: 48,
    label: '1/4" = 1\'',
    pixelsPerInch: 2,
  },
  '1/2"=12"': {
    option: '1/2"=12"',
    ratio: 24,
    label: '1/2" = 1\'',
    pixelsPerInch: 4,
  },
  '3/4"=12"': {
    option: '3/4"=12"',
    ratio: 16,
    label: '3/4" = 1\'',
    pixelsPerInch: 6,
  },
  '1"=12"': {
    option: '1"=12"',
    ratio: 12,
    label: '1" = 1\'',
    pixelsPerInch: 8,
  },
  '1-1/4"=12"': {
    option: '1-1/4"=12"',
    ratio: 9.6,
    label: '1-1/4" = 1\'',
    pixelsPerInch: 10,
  },
  '1-1/2"=12"': {
    option: '1-1/2"=12"',
    ratio: 8,
    label: '1-1/2" = 1\'',
    pixelsPerInch: 12,
  },
  '1-3/4"=12"': {
    option: '1-3/4"=12"',
    ratio: 6.857,
    label: '1-3/4" = 1\'',
    pixelsPerInch: 14,
  },
  '2"=12"': {
    option: '2"=12"',
    ratio: 6,
    label: '2" = 1\'',
    pixelsPerInch: 16,
  },
};

export const DEFAULT_SCALE: ScaleOption = '1/2"=12"';

export const STANDARD_HEIGHTS = {
  wallHeight: 96,
  finishedFloorOffset: 0.5,
  upperCabinetHeight: 54,
  baseCabinetHeight: 34.5,
  toeKickHeight: 4.5,
} as const;

export function inchesToPixels(inches: number, scale: ScaleOption): number {
  return inches * SCALE_OPTIONS[scale].pixelsPerInch;
}

export function pixelsToInches(pixels: number, scale: ScaleOption): number {
  return pixels / SCALE_OPTIONS[scale].pixelsPerInch;
}

export function feetToPixels(feet: number, scale: ScaleOption): number {
  return inchesToPixels(feet * 12, scale);
}

export function pixelsToFeet(pixels: number, scale: ScaleOption): number {
  return pixelsToInches(pixels, scale) / 12;
}
