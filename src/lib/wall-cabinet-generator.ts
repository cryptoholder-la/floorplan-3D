/**
 * Parametric Wall Cabinet Generator
 * 12" deep (plus 7/8" door), heights 12"-42", widths 9"-36" in 3" increments
 * Over 21" wide = two doors
 */

import {
  WallCabinetWidth,
  WallCabinetHeight,
  WallCabinetDimensions,
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

export function generateWallCabinet(
  width: WallCabinetWidth,
  height: WallCabinetHeight
): {
  id: string;
  dimensions: WallCabinetDimensions;
  material: typeof STANDARD_MATERIAL;
  components: Record<string, ComponentDimensions>;
  configuration: CabinetConfiguration;
} {
  const dimensions = getWallCabinetDimensions(width, height);
  const material = STANDARD_MATERIAL;
  const hasTwoDoors = width > 21;
  
  const configuration: CabinetConfiguration = {
    hasDrawer: false,
    hasAdjustableShelf: true,
    shelfCount: Math.floor(height / 12),
    doorStyle: 'slab',
    hingeType: 'concealed',
    overlay: 'full',
  };
  
  const components = generateWallComponents(dimensions, material, configuration);

  return {
    id: `wall-cabinet-${width}x${height}`,
    dimensions,
    material,
    components,
    configuration,
  };
}

function getWallCabinetDimensions(
  width: WallCabinetWidth,
  height: WallCabinetHeight
): WallCabinetDimensions {
  return {
    width,
    depth: 12.875,
    height,
    boxDepth: 12,
    doorThickness: 0.875,
    hasTwoDoors: width > 21,
  };
}

function generateWallComponents(
  dims: WallCabinetDimensions,
  mat: typeof STANDARD_MATERIAL,
  config: CabinetConfiguration
): Record<string, ComponentDimensions> {
  const t = mat.thickness;
  const internalWidth = dims.width - (2 * t);
  const internalDepth = dims.boxDepth - t;

  const sidePanels: ComponentDimensions = {
    name: 'Side Panel',
    width: dims.boxDepth,
    height: dims.height,
    quantity: 2,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true, bottom: true },
    holes: generateShelfPinHoles(dims.boxDepth, dims.height, 2, 2, 1.5, 1.5),
    grooves: generateStandardGrooves(dims.boxDepth, dims.height, t, true),
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
    height: dims.height - 1.5,
    quantity: 1,
    material: 'plywood',
    thickness: 0.25,
  };

  const adjustableShelf: ComponentDimensions = {
    name: 'Adjustable Shelf',
    width: internalWidth - 0.125,
    height: internalDepth - 0.75,
    quantity: config.shelfCount || 1,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
  };

  const components: Record<string, ComponentDimensions> = {
    leftSide: sidePanels,
    rightSide: sidePanels,
    top: horizontalPanel,
    bottom: horizontalPanel,
    back: backPanel,
    adjustableShelf,
  };

  const hingeCount = dims.height > 30 ? 3 : 2;

  if (dims.hasTwoDoors) {
    const doorWidth = (dims.width / 2) + FULL_OVERLAY;
    components.leftDoor = {
      name: 'Left Door',
      width: doorWidth,
      height: dims.height + (2 * FULL_OVERLAY),
      quantity: 1,
      material: mat.type,
      thickness: dims.doorThickness,
      edgeBanding: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(dims.height, hingeCount),
    };
    components.rightDoor = {
      name: 'Right Door',
      width: doorWidth,
      height: dims.height + (2 * FULL_OVERLAY),
      quantity: 1,
      material: mat.type,
      thickness: dims.doorThickness,
      edgeBanding: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(dims.height, hingeCount),
    };
  } else {
    components.door = {
      name: 'Door Panel',
      width: dims.width + (2 * FULL_OVERLAY),
      height: dims.height + (2 * FULL_OVERLAY),
      quantity: 1,
      material: mat.type,
      thickness: dims.doorThickness,
      edgeBanding: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(dims.height, hingeCount),
    };
  }

  return components;
}

export function getAvailableWallWidths(): WallCabinetWidth[] {
  return [9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
}

export function getAvailableWallHeights(): WallCabinetHeight[] {
  return [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42];
}

export function calculateWallMaterialUsage(cabinet: {
  components: Record<string, ComponentDimensions>;
}): {
  plywood34: number;
  plywood14: number;
  edgeBanding: number;
} {
  return calculateMaterial(cabinet.components);
}
