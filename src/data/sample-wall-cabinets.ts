/**
 * Sample Wall Cabinet Data
 * Pre-configured wall cabinets for common applications
 */

import {
  WallCabinetWidth,
  WallCabinetHeight,
  WallCabinetDimensions,
} from '@/types/cabinet.types';
import { generateWallCabinet } from '@/lib/wall-cabinet-generator';

export const STANDARD_WALL_WIDTHS: WallCabinetWidth[] = [
  9, 12, 15, 18, 21, 24, 27, 30, 33, 36,
];

export const STANDARD_WALL_HEIGHTS: WallCabinetHeight[] = [
  12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42,
];

export const COMMON_WALL_CABINETS = [
  {
    id: 'W1230',
    name: '12" Wide × 30" Tall Wall Cabinet',
    width: 12 as WallCabinetWidth,
    height: 30 as WallCabinetHeight,
    description: 'Standard single-door wall cabinet',
    application: 'Kitchen upper storage',
  },
  {
    id: 'W1836',
    name: '18" Wide × 36" Tall Wall Cabinet',
    width: 18 as WallCabinetWidth,
    height: 36 as WallCabinetHeight,
    description: 'Tall single-door wall cabinet',
    application: 'Kitchen upper storage, pantry',
  },
  {
    id: 'W2430',
    name: '24" Wide × 30" Tall Wall Cabinet',
    width: 24 as WallCabinetWidth,
    height: 30 as WallCabinetHeight,
    description: 'Two-door wall cabinet',
    application: 'Kitchen upper storage',
  },
  {
    id: 'W3030',
    name: '30" Wide × 30" Tall Wall Cabinet',
    width: 30 as WallCabinetWidth,
    height: 30 as WallCabinetHeight,
    description: 'Wide two-door wall cabinet',
    application: 'Kitchen upper storage over sink',
  },
  {
    id: 'W3642',
    name: '36" Wide × 42" Tall Wall Cabinet',
    width: 36 as WallCabinetWidth,
    height: 42 as WallCabinetHeight,
    description: 'Extra tall two-door wall cabinet',
    application: 'Kitchen upper storage, tall ceilings',
  },
  {
    id: 'W0912',
    name: '9" Wide × 12" Tall Wall Cabinet',
    width: 9 as WallCabinetWidth,
    height: 12 as WallCabinetHeight,
    description: 'Small wall cabinet',
    application: 'Space filler, small items storage',
  },
];

export function getWallCabinetByCode(code: string) {
  const cabinet = COMMON_WALL_CABINETS.find((c) => c.id === code);
  if (!cabinet) return null;
  return generateWallCabinet(cabinet.width, cabinet.height);
}

export function getWallCabinetsByApplication(application: string) {
  return COMMON_WALL_CABINETS.filter((c) =>
    c.application.toLowerCase().includes(application.toLowerCase())
  );
}

export const WALL_CABINET_APPLICATIONS = {
  kitchen: [
    { code: 'W1230', quantity: 6 },
    { code: 'W2430', quantity: 4 },
    { code: 'W3030', quantity: 2 },
  ],
  bathroom: [
    { code: 'W1230', quantity: 2 },
    { code: 'W1836', quantity: 1 },
  ],
  laundry: [
    { code: 'W2430', quantity: 2 },
    { code: 'W1836', quantity: 1 },
  ],
};

export const WALL_CABINET_SPECS = {
  boxDepth: 12,
  doorThickness: 0.875,
  totalDepth: 12.875,
  twoDoorThreshold: 21,
  material: {
    box: '3/4" plywood',
    back: '1/4" plywood',
    door: '3/4" or 7/8" material',
  },
  hardware: {
    hinges: '35mm concealed Euro hinge',
    shelfPins: '5mm diameter, 32mm spacing',
    pulls: 'Optional door pulls or knobs',
  },
  construction: {
    overlay: 'Full overlay (3/4" on all sides)',
    backPanel: '1/4" back in dado groove',
    shelves: 'Adjustable on 32mm system',
    edgeBanding: 'Front edges and exposed sides',
  },
};
