/**
 * Parametric Tall Cabinet Generator
 * 24" deep (plus 7/8" door), heights 79.5"/85.5"/91.5", widths 12"-36" in 3" increments
 * Sits on 4.5" tall, 21" deep toe kick (3" setback from front)
 */

import {
  TallCabinetWidth,
  TallCabinetHeight,
  TallCabinetDimensions,
  CabinetConfiguration,
  ComponentDimensions,
} from '@/types/cabinet.types';
import {
  STANDARD_MATERIAL,
  FULL_OVERLAY,
  generateShelfPinHoles,
  generateHingeHoles,
  generateStandardGrooves,
  calculateMaterialUsage as calculateMaterial,
} from './cabinet-common';

export function generateTallCabinet(
  width: TallCabinetWidth,
  height: TallCabinetHeight
): {
  id: string;
  dimensions: TallCabinetDimensions;
  material: typeof STANDARD_MATERIAL;
  components: Record<string, ComponentDimensions>;
  configuration: CabinetConfiguration;
} {
  const dimensions = getTallCabinetDimensions(width, height);
  const material = STANDARD_MATERIAL;
  
  const configuration: CabinetConfiguration = {
    hasDrawer: false,
    hasAdjustableShelf: true,
    shelfCount: Math.floor((height - 4.5) / 15),
    doorStyle: 'slab',
    hingeType: 'concealed',
    overlay: 'full',
  };
  
  const components = generateTallComponents(dimensions, material, configuration);

  return {
    id: `tall-cabinet-${width}x${height}`,
    dimensions,
    material,
    components,
    configuration,
  };
}

function getTallCabinetDimensions(
  width: TallCabinetWidth,
  height: TallCabinetHeight
): TallCabinetDimensions {
  return {
    width,
    depth: 24.875,
    height,
    boxDepth: 24,
    doorThickness: 0.875,
    toeKickHeight: 4.5,
    toeKickDepth: 21,
    boxHeight: height - 4.5,
  };
}

function generateTallComponents(
  dims: TallCabinetDimensions,
  mat: typeof STANDARD_MATERIAL,
  config: CabinetConfiguration
): Record<string, ComponentDimensions> {
  const t = mat.thickness;
  const internalWidth = dims.width - (2 * t);
  const internalDepth = dims.boxDepth - t;
  const boxHeight = dims.boxHeight;

  const sidePanels: ComponentDimensions = {
    name: 'Side Panel',
    width: dims.boxDepth,
    height: boxHeight,
    quantity: 2,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
    holes: generateShelfPinHoles(dims.boxDepth, boxHeight, 3, 3, 2, 2),
    grooves: generateStandardGrooves(dims.boxDepth, boxHeight, t, true),
  };

  const horizontalPanel: ComponentDimensions = {
    name: 'Top/Bottom Panel',
    width: internalWidth,
    height: internalDepth,
    quantity: 2,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
  };

  const backPanel: ComponentDimensions = {
    name: 'Back Panel',
    width: internalWidth,
    height: boxHeight - 1.5,
    quantity: 1,
    material: 'plywood',
    thickness: 0.25,
  };

  const adjustableShelf: ComponentDimensions = {
    name: 'Adjustable Shelf',
    width: internalWidth - 0.125,
    height: internalDepth - 0.75,
    quantity: config.shelfCount || 4,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
  };

  const doorPanel: ComponentDimensions = {
    name: 'Door Panel',
    width: dims.width + (2 * FULL_OVERLAY),
    height: boxHeight + (2 * FULL_OVERLAY),
    quantity: 1,
    material: mat.type,
    thickness: dims.doorThickness,
    edgeBanding: { top: true, bottom: true, left: true, right: true },
    holes: generateHingeHoles(boxHeight, 4),
  };

  const toeKickFront: ComponentDimensions = {
    name: 'Toe Kick Front',
    width: dims.width,
    height: dims.toeKickHeight,
    quantity: 1,
    material: mat.type,
    thickness: t,
  };

  const toeKickSide: ComponentDimensions = {
    name: 'Toe Kick Side',
    width: dims.toeKickDepth,
    height: dims.toeKickHeight,
    quantity: 2,
    material: mat.type,
    thickness: t,
  };

  const toeKickBack: ComponentDimensions = {
    name: 'Toe Kick Back',
    width: internalWidth,
    height: dims.toeKickHeight,
    quantity: 1,
    material: mat.type,
    thickness: t,
  };

  return {
    leftSide: sidePanels,
    rightSide: sidePanels,
    top: horizontalPanel,
    bottom: horizontalPanel,
    back: backPanel,
    adjustableShelf,
    door: doorPanel,
    toeKickFront,
    toeKickSide1: toeKickSide,
    toeKickSide2: toeKickSide,
    toeKickBack,
  };
}

export function getAvailableTallWidths(): TallCabinetWidth[] {
  return [12, 15, 18, 21, 24, 27, 30, 33, 36];
}

export function getAvailableTallHeights(): TallCabinetHeight[] {
  return [79.5, 85.5, 91.5];
}

export function calculateTallMaterialUsage(cabinet: {
  components: Record<string, ComponentDimensions>;
}): {
  plywood34: number;
  plywood14: number;
  edgeBanding: number;
} {
  return calculateMaterial(cabinet.components);
}
