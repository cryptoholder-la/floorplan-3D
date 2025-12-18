/**
 * Blum Hardware Templates Library
 * Complete specifications for Blum hinges, drawer slides, and lift systems
 */

import {
  BlumHinge,
  BlumDrawerSlide,
  BlumLiftSystem,
  BlumHardwareTemplates,
  BlumHingeType,
  BlumDrawerSlideType,
  BlumLiftSystemType,
} from '@/types/cabinet-config.types';

export const BLUM_HINGES: Record<BlumHingeType, BlumHinge> = {
  'CLIP-top-BLUMOTION-110': {
    type: 'CLIP-top-BLUMOTION-110',
    model: '71B3550',
    opening: 110,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '173H7100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 4,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
  'CLIP-top-BLUMOTION-120': {
    type: 'CLIP-top-BLUMOTION-120',
    model: '71B3590',
    opening: 120,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '173H7100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 4,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
  'CLIP-top-BLUMOTION-155': {
    type: 'CLIP-top-BLUMOTION-155',
    model: '71B3650',
    opening: 155,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '173H7100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 4,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
  'CLIP-top-BLUMOTION-170': {
    type: 'CLIP-top-BLUMOTION-170',
    model: '71B3690',
    opening: 170,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '173H7100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 4,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
  'CLIP-top-INSERTA': {
    type: 'CLIP-top-INSERTA',
    model: '71T9550',
    opening: 95,
    overlay: 0,
    hasBlumotion: false,
    mountingPlate: '173H7100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 4,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 11.5,
      offsetFromEdge: 3,
    },
    heightPosition: {
      top: 2.5,
      bottom: 2.5,
    },
  },
  'COMPACT-BLUMOTION-33': {
    type: 'COMPACT-BLUMOTION-33',
    model: '33.3630',
    opening: 110,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '173L6100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 2,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
  'COMPACT-BLUMOTION-38': {
    type: 'COMPACT-BLUMOTION-38',
    model: '38N3550',
    opening: 110,
    overlay: 0,
    hasBlumotion: true,
    mountingPlate: '130.1100',
    screws: {
      type: 'Euro screw 5x15mm',
      quantity: 2,
    },
    drillingPattern: {
      centerDistance: 52,
      diameter: 35,
      depth: 12.5,
      offsetFromEdge: 4,
    },
    heightPosition: {
      top: 3,
      bottom: 3,
    },
  },
};

export const BLUM_DRAWER_SLIDES: Record<BlumDrawerSlideType, BlumDrawerSlide[]> = {
  'TANDEM-BLUMOTION': [
    {
      type: 'TANDEM-BLUMOTION',
      model: '563H.3050B',
      length: 300,
      weightCapacity: 30,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'TANDEM-BLUMOTION',
      model: '563H.4050B',
      length: 400,
      weightCapacity: 30,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'TANDEM-BLUMOTION',
      model: '563H.5050B',
      length: 500,
      weightCapacity: 30,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'TANDEM-BLUMOTION',
      model: '563H.6050B',
      length: 600,
      weightCapacity: 30,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
  'TANDEM-PLUS-BLUMOTION': [
    {
      type: 'TANDEM-PLUS-BLUMOTION',
      model: '569H.4570B',
      length: 450,
      weightCapacity: 65,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'TANDEM-PLUS-BLUMOTION',
      model: '569H.5570B',
      length: 550,
      weightCapacity: 65,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'TANDEM-PLUS-BLUMOTION',
      model: '569H.6570B',
      length: 650,
      weightCapacity: 65,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
  'MOVENTO': [
    {
      type: 'MOVENTO',
      model: '760H.3000B',
      length: 300,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'MOVENTO',
      model: '760H.4000B',
      length: 400,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'MOVENTO',
      model: '760H.5000B',
      length: 500,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'MOVENTO',
      model: '760H.6000B',
      length: 600,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
  'MOVENTO-TIP-ON': [
    {
      type: 'MOVENTO-TIP-ON',
      model: '760H.3000T',
      length: 300,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: true,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'MOVENTO-TIP-ON',
      model: '760H.4000T',
      length: 400,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: true,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'MOVENTO-TIP-ON',
      model: '760H.5000T',
      length: 500,
      weightCapacity: 40,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: true,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
  'LEGRABOX': [
    {
      type: 'LEGRABOX',
      model: 'K.4330M',
      length: 400,
      weightCapacity: 70,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'LEGRABOX',
      model: 'K.5330M',
      length: 500,
      weightCapacity: 70,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'LEGRABOX',
      model: 'K.6330M',
      length: 600,
      weightCapacity: 70,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
  'METABOX': [
    {
      type: 'METABOX',
      model: '320H.3000C',
      length: 300,
      weightCapacity: 50,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'METABOX',
      model: '320H.4000C',
      length: 400,
      weightCapacity: 50,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
    {
      type: 'METABOX',
      model: '320H.5000C',
      length: 500,
      weightCapacity: 50,
      extension: 'full',
      hasBlumotion: true,
      hasTipOn: false,
      mountingHeight: 32,
      sideGap: 12.5,
      frontGap: 8,
      rearGap: 8,
    },
  ],
};

export const BLUM_LIFT_SYSTEMS: Record<BlumLiftSystemType, BlumLiftSystem> = {
  'AVENTOS-HF': {
    type: 'AVENTOS-HF',
    model: '20F2200',
    doorWeight: {
      min: 3.3,
      max: 11,
    },
    doorWidth: {
      min: 500,
      max: 1000,
    },
    cabinetWidth: {
      min: 500,
      max: 1000,
    },
    powerFactor: 1400,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
  'AVENTOS-HS': {
    type: 'AVENTOS-HS',
    model: '20S2C00',
    doorWeight: {
      min: 5.5,
      max: 20,
    },
    doorWidth: {
      min: 500,
      max: 1400,
    },
    cabinetWidth: {
      min: 500,
      max: 1400,
    },
    powerFactor: 2800,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
  'AVENTOS-HL': {
    type: 'AVENTOS-HL',
    model: '20L2500',
    doorWeight: {
      min: 7.7,
      max: 20,
    },
    doorWidth: {
      min: 500,
      max: 1400,
    },
    cabinetWidth: {
      min: 500,
      max: 1400,
    },
    powerFactor: 2900,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
  'AVENTOS-HK-S': {
    type: 'AVENTOS-HK-S',
    model: '20K2500',
    doorWeight: {
      min: 3.75,
      max: 10,
    },
    doorWidth: {
      min: 400,
      max: 1000,
    },
    cabinetWidth: {
      min: 400,
      max: 1000,
    },
    powerFactor: 1200,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
      bottomHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
  'AVENTOS-HK-XS': {
    type: 'AVENTOS-HK-XS',
    model: '20K2300',
    doorWeight: {
      min: 1.75,
      max: 5.5,
    },
    doorWidth: {
      min: 300,
      max: 600,
    },
    cabinetWidth: {
      min: 300,
      max: 600,
    },
    powerFactor: 600,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
      bottomHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
  'AVENTOS-HK': {
    type: 'AVENTOS-HK',
    model: '20K2700',
    doorWeight: {
      min: 5.5,
      max: 16.5,
    },
    doorWidth: {
      min: 600,
      max: 1200,
    },
    cabinetWidth: {
      min: 600,
      max: 1200,
    },
    powerFactor: 1800,
    hasBlumotion: true,
    drillingPattern: {
      topHinge: {
        x: 22.5,
        y: 49,
      },
      bottomHinge: {
        x: 22.5,
        y: 49,
      },
    },
  },
};

export const BLUM_HARDWARE_TEMPLATES: BlumHardwareTemplates = {
  hinges: BLUM_HINGES,
  slides: BLUM_DRAWER_SLIDES,
  liftSystems: BLUM_LIFT_SYSTEMS,
};

export function getDrawerSlideForDepth(
  slideType: BlumDrawerSlideType,
  depthInches: number
): BlumDrawerSlide | null {
  const slides = BLUM_DRAWER_SLIDES[slideType];
  const depthMM = depthInches * 25.4;
  
  const matchingSlides = slides.filter(slide => slide.length >= depthMM - 50);
  
  if (matchingSlides.length === 0) return null;
  
  return matchingSlides.reduce((prev, curr) => 
    curr.length < prev.length ? curr : prev
  );
}

export function recommendHingeForCabinet(
  cabinetWidth: number,
  doorWeight: number,
  needsWideOpening: boolean = false
): BlumHinge {
  if (cabinetWidth < 15) {
    return BLUM_HINGES['COMPACT-BLUMOTION-33'];
  }
  
  if (needsWideOpening) {
    return BLUM_HINGES['CLIP-top-BLUMOTION-170'];
  }
  
  return BLUM_HINGES['CLIP-top-BLUMOTION-110'];
}

export function recommendLiftSystemForWallCabinet(
  cabinetWidth: number,
  cabinetHeight: number,
  doorWeight: number
): BlumLiftSystem | null {
  const widthMM = cabinetWidth * 25.4;
  const weightKG = doorWeight * 0.453592;
  
  for (const system of Object.values(BLUM_LIFT_SYSTEMS)) {
    if (
      widthMM >= system.cabinetWidth.min &&
      widthMM <= system.cabinetWidth.max &&
      weightKG >= system.doorWeight.min &&
      weightKG <= system.doorWeight.max
    ) {
      return system;
    }
  }
  
  return null;
}

export function calculateHingeQuantity(doorHeight: number): number {
  if (doorHeight < 24) return 2;
  if (doorHeight < 48) return 3;
  if (doorHeight < 72) return 4;
  return 5;
}
