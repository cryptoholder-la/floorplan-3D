/**
 * Unified Cabinet Generator System
 * Centralized logic for all cabinet types: Base, Wall, Tall
 */

import {
  CabinetMaterial,
  CabinetConfiguration,
  ComponentDimensions,
  HolePattern,
  Groove,
} from '@/types/cabinet.types';

export type CabinetType = 'base' | 'wall' | 'tall';

export interface UnifiedCabinetDimensions {
  type: CabinetType;
  width: number;
  height: number;
  depth: number;
  boxDepth?: number;
  doorThickness?: number;
  toeKickHeight?: number;
  toeKickDepth?: number;
  totalHeight?: number;
  hasTwoDoors?: boolean;
}

export interface UnifiedCabinet {
  id: string;
  type: CabinetType;
  dimensions: UnifiedCabinetDimensions;
  material: CabinetMaterial;
  components: Record<string, ComponentDimensions>;
  configuration: CabinetConfiguration;
}

const STANDARD_MATERIAL: CabinetMaterial = {
  thickness: 0.75,
  type: 'plywood',
};

const CONSTANTS = {
  OVERLAY: 0.75,
  BACK_THICKNESS: 0.25,
  SHELF_PIN_DIAMETER: 0.197,
  SHELF_PIN_DEPTH: 0.5,
  SHELF_PIN_SPACING: 32 / 25.4,
  HINGE_DIAMETER: 1.375,
  HINGE_DEPTH: 0.5,
  HINGE_FROM_EDGE: 0.875,
  HINGE_FROM_TOP_BOTTOM: 3.5,
};

export function generateCabinet(
  type: CabinetType,
  width: number,
  height: number
): UnifiedCabinet {
  const dimensions = getCabinetDimensions(type, width, height);
  const configuration = getConfiguration(type, dimensions);
  const components = generateComponents(dimensions, STANDARD_MATERIAL, configuration);

  return {
    id: `${type}-cabinet-${width}x${height}`,
    type,
    dimensions,
    material: STANDARD_MATERIAL,
    components,
    configuration,
  };
}

function getCabinetDimensions(
  type: CabinetType,
  width: number,
  height: number
): UnifiedCabinetDimensions {
  switch (type) {
    case 'base':
      return {
        type: 'base',
        width,
        height: 30,
        depth: 24,
        toeKickHeight: 4.5,
        toeKickDepth: 21,
        totalHeight: 34.5,
      };
    case 'wall':
      return {
        type: 'wall',
        width,
        height,
        depth: 12.875,
        boxDepth: 12,
        doorThickness: 0.875,
        hasTwoDoors: width > 21,
      };
    case 'tall':
      return {
        type: 'tall',
        width,
        height,
        depth: 24.875,
        boxDepth: 24,
        doorThickness: 0.875,
        toeKickHeight: 4.5,
        toeKickDepth: 21,
        totalHeight: height,
      };
  }
}

function getConfiguration(
  type: CabinetType,
  dims: UnifiedCabinetDimensions
): CabinetConfiguration {
  const baseConfig: CabinetConfiguration = {
    hasDrawer: false,
    hasAdjustableShelf: true,
    doorStyle: 'slab',
    hingeType: 'concealed',
    overlay: 'full',
    shelfCount: 1,
  };

  switch (type) {
    case 'base':
      return { ...baseConfig, shelfCount: 1 };
    case 'wall':
      return { ...baseConfig, shelfCount: Math.floor(dims.height / 12) };
    case 'tall':
      return { ...baseConfig, shelfCount: Math.floor((dims.height - (dims.toeKickHeight || 0)) / 15) };
  }
}

function generateComponents(
  dims: UnifiedCabinetDimensions,
  mat: CabinetMaterial,
  config: CabinetConfiguration
): Record<string, ComponentDimensions> {
  const t = mat.thickness;
  const boxDepth = dims.boxDepth || dims.depth;
  const boxHeight = dims.type === 'tall' ? dims.height - (dims.toeKickHeight || 0) : dims.height;
  const internalWidth = dims.width - (2 * t);
  const internalDepth = boxDepth - t;

  const components: Record<string, ComponentDimensions> = {};

  components.leftSide = createSidePanel(dims, mat, boxDepth, boxHeight);
  components.rightSide = components.leftSide;

  if (dims.type === 'base') {
    components.bottom = createHorizontalPanel('Bottom Panel', internalWidth, internalDepth, mat, { front: true });
    components.top = createTopStretcher(internalWidth, mat);
  } else {
    components.top = createHorizontalPanel('Top Panel', internalWidth, internalDepth, mat, { front: true });
    components.bottom = createHorizontalPanel('Bottom Panel', internalWidth, internalDepth, mat, { front: true });
  }

  components.back = createBackPanel(internalWidth, boxHeight, dims.type);

  if (config.hasAdjustableShelf) {
    components.adjustableShelf = createAdjustableShelf(
      internalWidth,
      internalDepth,
      config.shelfCount || 1,
      mat
    );
  }

  Object.assign(components, createDoors(dims, mat));

  if (dims.toeKickHeight && dims.toeKickDepth) {
    Object.assign(components, createToeKick(dims, mat, internalWidth));
  }

  return components;
}

function createSidePanel(
  dims: UnifiedCabinetDimensions,
  mat: CabinetMaterial,
  boxDepth: number,
  boxHeight: number
): ComponentDimensions {
  const t = mat.thickness;
  
  return {
    name: 'Side Panel',
    width: boxDepth,
    height: boxHeight,
    quantity: 2,
    material: mat.type,
    thickness: t,
    edgeBanding: dims.type === 'wall' ? { front: true, bottom: true } : { front: true },
    holes: generateShelfPinHoles(boxDepth, boxHeight, dims.type),
    grooves: createSideGrooves(dims, boxDepth, boxHeight, t),
  };
}

function createSideGrooves(
  dims: UnifiedCabinetDimensions,
  boxDepth: number,
  boxHeight: number,
  t: number
): Groove[] {
  const grooves: Groove[] = [
    {
      type: 'back-panel',
      x: boxDepth - 0.75,
      y: 0.375,
      width: CONSTANTS.BACK_THICKNESS,
      depth: 0.25,
      length: boxHeight - (dims.type === 'base' ? 0.375 : 0.75),
      orientation: 'vertical',
    },
    {
      type: 'dado',
      x: 0,
      y: 0.375,
      width: t,
      depth: 0.25,
      length: boxDepth - 0.75,
      orientation: 'horizontal',
    },
  ];

  if (dims.type !== 'base') {
    grooves.push({
      type: 'dado',
      x: 0,
      y: boxHeight - t - 0.375,
      width: t,
      depth: 0.25,
      length: boxDepth - 0.75,
      orientation: 'horizontal',
    });
  }

  return grooves;
}

function createHorizontalPanel(
  name: string,
  width: number,
  depth: number,
  mat: CabinetMaterial,
  edgeBanding: { front?: boolean; back?: boolean }
): ComponentDimensions {
  return {
    name,
    width,
    height: depth,
    quantity: name.includes('Top/Bottom') ? 2 : 1,
    material: mat.type,
    thickness: mat.thickness,
    edgeBanding,
  };
}

function createTopStretcher(width: number, mat: CabinetMaterial): ComponentDimensions {
  return {
    name: 'Top Stretcher',
    width,
    height: 3,
    depth: mat.thickness,
    quantity: 1,
    material: mat.type,
    thickness: mat.thickness,
  };
}

function createBackPanel(width: number, height: number, type: CabinetType): ComponentDimensions {
  return {
    name: 'Back Panel',
    width,
    height: height - (type === 'base' ? 0.75 : 1.5),
    quantity: 1,
    material: 'plywood',
    thickness: CONSTANTS.BACK_THICKNESS,
  };
}

function createAdjustableShelf(
  width: number,
  depth: number,
  quantity: number,
  mat: CabinetMaterial
): ComponentDimensions {
  return {
    name: 'Adjustable Shelf',
    width: width - 0.125,
    height: depth - 0.75,
    quantity,
    material: mat.type,
    thickness: mat.thickness,
    edgeBanding: { front: true },
  };
}

function createDoors(
  dims: UnifiedCabinetDimensions,
  mat: CabinetMaterial
): Record<string, ComponentDimensions> {
  const doorThickness = dims.doorThickness || mat.thickness;
  const boxHeight = dims.type === 'tall' ? dims.height - (dims.toeKickHeight || 0) : dims.height;
  const doorHeight = boxHeight + (2 * CONSTANTS.OVERLAY);

  if (dims.hasTwoDoors) {
    const doorWidth = (dims.width / 2) + CONSTANTS.OVERLAY;
    return {
      leftDoor: {
        name: 'Left Door',
        width: doorWidth,
        height: doorHeight,
        quantity: 1,
        material: mat.type,
        thickness: doorThickness,
        edgeBanding: { top: true, bottom: true, left: true, right: true },
        holes: generateHingeHoles(boxHeight, dims.type, 'left'),
      },
      rightDoor: {
        name: 'Right Door',
        width: doorWidth,
        height: doorHeight,
        quantity: 1,
        material: mat.type,
        thickness: doorThickness,
        edgeBanding: { top: true, bottom: true, left: true, right: true },
        holes: generateHingeHoles(boxHeight, dims.type, 'right'),
      },
    };
  }

  return {
    door: {
      name: 'Door Panel',
      width: dims.width + (2 * CONSTANTS.OVERLAY),
      height: doorHeight,
      quantity: 1,
      material: mat.type,
      thickness: doorThickness,
      edgeBanding: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(boxHeight, dims.type),
    },
  };
}

function createToeKick(
  dims: UnifiedCabinetDimensions,
  mat: CabinetMaterial,
  internalWidth: number
): Record<string, ComponentDimensions> {
  return {
    toeKickFront: {
      name: 'Toe Kick Front',
      width: dims.width,
      height: dims.toeKickHeight!,
      quantity: 1,
      material: mat.type,
      thickness: mat.thickness,
    },
    toeKickSide1: {
      name: 'Toe Kick Side',
      width: dims.toeKickDepth!,
      height: dims.toeKickHeight!,
      quantity: 1,
      material: mat.type,
      thickness: mat.thickness,
    },
    toeKickSide2: {
      name: 'Toe Kick Side',
      width: dims.toeKickDepth!,
      height: dims.toeKickHeight!,
      quantity: 1,
      material: mat.type,
      thickness: mat.thickness,
    },
    ...(dims.type === 'tall' && {
      toeKickBack: {
        name: 'Toe Kick Back',
        width: internalWidth,
        height: dims.toeKickHeight!,
        quantity: 1,
        material: mat.type,
        thickness: mat.thickness,
      },
    }),
  };
}

function generateShelfPinHoles(depth: number, height: number, type: CabinetType): HolePattern[] {
  const holes: HolePattern[] = [];
  const startFromBottom = type === 'base' ? 3 : 2;
  const endFromTop = type === 'base' ? 3 : 2;
  const fromFront = type === 'base' ? 2 : 1.5;
  const fromBack = type === 'base' ? 2 : 1.5;

  const availableHeight = height - startFromBottom - endFromTop;
  const holeCount = Math.floor(availableHeight / CONSTANTS.SHELF_PIN_SPACING);

  for (let i = 0; i <= holeCount; i++) {
    const y = startFromBottom + (i * CONSTANTS.SHELF_PIN_SPACING);
    holes.push(
      {
        type: 'shelf-pin',
        x: fromFront,
        y,
        diameter: CONSTANTS.SHELF_PIN_DIAMETER,
        depth: CONSTANTS.SHELF_PIN_DEPTH,
      },
      {
        type: 'shelf-pin',
        x: depth - fromBack,
        y,
        diameter: CONSTANTS.SHELF_PIN_DIAMETER,
        depth: CONSTANTS.SHELF_PIN_DEPTH,
      }
    );
  }

  return holes;
}

function generateHingeHoles(
  height: number,
  type: CabinetType,
  side?: 'left' | 'right'
): HolePattern[] {
  const hinges: HolePattern[] = [
    {
      type: 'hinge',
      x: CONSTANTS.HINGE_FROM_EDGE,
      y: CONSTANTS.HINGE_FROM_TOP_BOTTOM,
      diameter: CONSTANTS.HINGE_DIAMETER,
      depth: CONSTANTS.HINGE_DEPTH,
    },
    {
      type: 'hinge',
      x: CONSTANTS.HINGE_FROM_EDGE,
      y: height - CONSTANTS.HINGE_FROM_TOP_BOTTOM,
      diameter: CONSTANTS.HINGE_DIAMETER,
      depth: CONSTANTS.HINGE_DEPTH,
    },
  ];

  if (type === 'wall' && height > 30) {
    hinges.push({
      type: 'hinge',
      x: CONSTANTS.HINGE_FROM_EDGE,
      y: height / 2,
      diameter: CONSTANTS.HINGE_DIAMETER,
      depth: CONSTANTS.HINGE_DEPTH,
    });
  }

  if (type === 'tall') {
    hinges.push(
      {
        type: 'hinge',
        x: CONSTANTS.HINGE_FROM_EDGE,
        y: height / 3,
        diameter: CONSTANTS.HINGE_DIAMETER,
        depth: CONSTANTS.HINGE_DEPTH,
      },
      {
        type: 'hinge',
        x: CONSTANTS.HINGE_FROM_EDGE,
        y: (height * 2) / 3,
        diameter: CONSTANTS.HINGE_DIAMETER,
        depth: CONSTANTS.HINGE_DEPTH,
      }
    );
  }

  return hinges;
}

export function getAvailableWidths(type: CabinetType): number[] {
  if (type === 'tall') {
    return [12, 15, 18, 21, 24, 27, 30, 33, 36];
  }
  return [9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
}

export function getAvailableHeights(type: CabinetType): number[] {
  switch (type) {
    case 'base':
      return [30];
    case 'wall':
      return [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42];
    case 'tall':
      return [79.5, 85.5, 91.5];
  }
}

export function calculateMaterialUsage(cabinet: UnifiedCabinet): {
  plywood34: number;
  plywood14: number;
  edgeBanding: number;
} {
  let plywood34 = 0;
  let plywood14 = 0;
  let edgeBanding = 0;

  Object.values(cabinet.components).forEach((component) => {
    const area = (component.width * (component.height || component.depth || 0)) / 144;

    if (component.thickness === 0.75 || component.thickness === 0.875) {
      plywood34 += area * component.quantity;
    } else if (component.thickness === 0.25) {
      plywood14 += area * component.quantity;
    }

    if (component.edgeBanding) {
      let perimeter = 0;
      if (component.edgeBanding.top) perimeter += component.width;
      if (component.edgeBanding.bottom) perimeter += component.width;
      if (component.edgeBanding.left) perimeter += (component.height || 0);
      if (component.edgeBanding.right) perimeter += (component.height || 0);
      if (component.edgeBanding.front) perimeter += component.width;
      edgeBanding += (perimeter / 12) * component.quantity;
    }
  });

  return {
    plywood34: Math.ceil(plywood34 * 1.1),
    plywood14: Math.ceil(plywood14 * 1.1),
    edgeBanding: Math.ceil(edgeBanding * 1.15),
  };
}
