/**
 * Sample Tall Cabinet Data
 * Pre-configured tall cabinets for pantry, utility, and storage applications
 */

import {
  TallCabinetWidth,
  TallCabinetHeight,
  TallCabinetDimensions,
} from '@/types/cabinet.types';
import { generateTallCabinet } from '@/lib/tall-cabinet-generator';

export const STANDARD_TALL_WIDTHS: TallCabinetWidth[] = [
  12, 15, 18, 21, 24, 27, 30, 33, 36,
];

export const STANDARD_TALL_HEIGHTS: TallCabinetHeight[] = [79.5, 85.5, 91.5];

export const COMMON_TALL_CABINETS = [
  {
    id: 'T1879',
    name: '18" Wide × 79.5" Tall Pantry Cabinet',
    width: 18 as TallCabinetWidth,
    height: 79.5 as TallCabinetHeight,
    description: 'Narrow pantry cabinet for compact spaces',
    application: 'Kitchen pantry, compact storage',
  },
  {
    id: 'T2479',
    name: '24" Wide × 79.5" Tall Pantry Cabinet',
    width: 24 as TallCabinetWidth,
    height: 79.5 as TallCabinetHeight,
    description: 'Standard pantry cabinet',
    application: 'Kitchen pantry, food storage',
  },
  {
    id: 'T2485',
    name: '24" Wide × 85.5" Tall Pantry Cabinet',
    width: 24 as TallCabinetWidth,
    height: 85.5 as TallCabinetHeight,
    description: 'Tall pantry cabinet for 9\' ceilings',
    application: 'Kitchen pantry, tall ceilings',
  },
  {
    id: 'T3085',
    name: '30" Wide × 85.5" Tall Utility Cabinet',
    width: 30 as TallCabinetWidth,
    height: 85.5 as TallCabinetHeight,
    description: 'Wide utility/storage cabinet',
    application: 'Broom closet, cleaning supplies, utility room',
  },
  {
    id: 'T3691',
    name: '36" Wide × 91.5" Tall Pantry Cabinet',
    width: 36 as TallCabinetWidth,
    height: 91.5 as TallCabinetHeight,
    description: 'Extra tall, wide pantry cabinet',
    application: 'Large pantry, bulk storage, 10\' ceilings',
  },
  {
    id: 'T1285',
    name: '12" Wide × 85.5" Tall Narrow Cabinet',
    width: 12 as TallCabinetWidth,
    height: 85.5 as TallCabinetHeight,
    description: 'Narrow tall cabinet',
    application: 'Space filler, slim storage',
  },
];

export function getTallCabinetByCode(code: string) {
  const cabinet = COMMON_TALL_CABINETS.find((c) => c.id === code);
  if (!cabinet) return null;
  return generateTallCabinet(cabinet.width, cabinet.height);
}

export function getTallCabinetsByApplication(application: string) {
  return COMMON_TALL_CABINETS.filter((c) =>
    c.application.toLowerCase().includes(application.toLowerCase())
  );
}

export const TALL_CABINET_APPLICATIONS = {
  pantry: [
    { code: 'T2479', quantity: 2 },
    { code: 'T3085', quantity: 1 },
  ],
  utility: [
    { code: 'T1879', quantity: 1 },
    { code: 'T3085', quantity: 1 },
  ],
  storage: [
    { code: 'T2485', quantity: 2 },
    { code: 'T3691', quantity: 1 },
  ],
};

export const TALL_CABINET_SPECS = {
  boxDepth: 24,
  doorThickness: 0.875,
  totalDepth: 24.875,
  toeKickHeight: 4.5,
  toeKickDepth: 21,
  toeKickSetback: 3,
  material: {
    box: '3/4" plywood',
    back: '1/4" plywood',
    door: '3/4" or 7/8" material',
    toeKick: '3/4" plywood',
  },
  hardware: {
    hinges: '35mm concealed Euro hinge (3-4 per door)',
    shelfPins: '5mm diameter, 32mm spacing',
    pulls: 'Door pulls or handles',
  },
  construction: {
    overlay: 'Full overlay (3/4" on all sides)',
    backPanel: '1/4" back in dado groove',
    shelves: 'Adjustable on 32mm system (4-6 shelves typical)',
    edgeBanding: 'Front edges and exposed sides',
    toeKick: 'Set back 3" from cabinet front',
  },
  heightOptions: {
    79.5: 'Standard 8\' ceiling (96" - 16.5" for countertop/crown)',
    85.5: '9\' ceiling (108" - 22.5" for countertop/crown)',
    91.5: '10\' ceiling (120" - 28.5" for countertop/crown)',
  },
};

export const TALL_CABINET_SHELF_RECOMMENDATIONS = {
  79.5: {
    shelves: 4,
    spacing: 'Approximately 15" between shelves',
  },
  85.5: {
    shelves: 5,
    spacing: 'Approximately 14" between shelves',
  },
  91.5: {
    shelves: 6,
    spacing: 'Approximately 13" between shelves',
  },
};
