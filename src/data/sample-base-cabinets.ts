/**
 * Sample Base Cabinet Data
 * Pre-configured base cabinets in all standard widths
 */

import { BaseCabinet, CabinetWidth } from '@/types/cabinet.types';
import { generateBaseCabinet, getAvailableWidths } from '@/lib/cabinet-generator';

export const standardBaseCabinets: BaseCabinet[] = getAvailableWidths().map(width => 
  generateBaseCabinet(width)
);

export const baseCabinetsByWidth: Record<CabinetWidth, BaseCabinet> = {
  9: generateBaseCabinet(9),
  12: generateBaseCabinet(12),
  15: generateBaseCabinet(15),
  18: generateBaseCabinet(18),
  21: generateBaseCabinet(21),
  24: generateBaseCabinet(24),
  27: generateBaseCabinet(27),
  30: generateBaseCabinet(30),
  33: generateBaseCabinet(33),
  36: generateBaseCabinet(36),
};

export function getBaseCabinet(width: CabinetWidth): BaseCabinet {
  return baseCabinetsByWidth[width];
}

export function getAllBaseCabinets(): BaseCabinet[] {
  return standardBaseCabinets;
}

export const cabinetPresets = {
  kitchen: {
    name: 'Standard Kitchen',
    description: 'Typical kitchen cabinet configuration',
    cabinets: [
      { width: 30 as CabinetWidth, quantity: 2, position: 'corner' },
      { width: 24 as CabinetWidth, quantity: 3, position: 'wall' },
      { width: 18 as CabinetWidth, quantity: 2, position: 'wall' },
      { width: 36 as CabinetWidth, quantity: 1, position: 'sink-base' },
    ],
  },
  laundry: {
    name: 'Laundry Room',
    description: 'Simple laundry room setup',
    cabinets: [
      { width: 24 as CabinetWidth, quantity: 2, position: 'side-by-side' },
    ],
  },
  bathroom: {
    name: 'Bathroom Vanity',
    description: 'Standard bathroom vanity',
    cabinets: [
      { width: 36 as CabinetWidth, quantity: 1, position: 'vanity' },
    ],
  },
  garage: {
    name: 'Garage Workshop',
    description: 'Workshop storage configuration',
    cabinets: [
      { width: 24 as CabinetWidth, quantity: 4, position: 'workshop' },
      { width: 18 as CabinetWidth, quantity: 2, position: 'workshop' },
    ],
  },
};

export const cabinetMaterialSpecs = {
  plywood: {
    name: '3/4" Baltic Birch Plywood',
    sheetSize: { width: 48, height: 96 },
    thickness: 0.75,
    costPerSheet: 85,
    material: 'plywood' as const,
  },
  backPanel: {
    name: '1/4" Plywood Back Panel',
    sheetSize: { width: 48, height: 96 },
    thickness: 0.25,
    costPerSheet: 25,
    material: 'plywood' as const,
  },
  edgeBanding: {
    name: 'PVC Edge Banding',
    rollLength: 250, // feet per roll
    width: 0.75,
    costPerRoll: 35,
  },
};

export const cabinetHardware = {
  concealed35mm: {
    name: 'Blum Concealed Hinge 35mm',
    type: 'hinge',
    perCabinet: 2,
    costPerUnit: 8.5,
  },
  shelfPins: {
    name: '5mm Shelf Pins',
    type: 'shelf-support',
    perShelf: 4,
    costPerUnit: 0.35,
  },
  softCloseHinge: {
    name: 'Soft-Close Concealed Hinge 35mm',
    type: 'hinge',
    perCabinet: 2,
    costPerUnit: 12.5,
  },
  cabinetKnob: {
    name: 'Stainless Steel Knob',
    type: 'hardware',
    perDoor: 1,
    costPerUnit: 3.5,
  },
  cabinetPull: {
    name: 'Stainless Steel Pull (6")',
    type: 'hardware',
    perDoor: 1,
    costPerUnit: 6.5,
  },
};
