/**
 * Parametric Base Cabinet Generator
 * Generates full overlay base cabinets from 9" to 36" in 3" increments
 */

import {
  BaseCabinet,
  BaseCabinetDimensions,
  CabinetComponents,
  CabinetConfiguration,
  ComponentDimensions,
  CabinetWidth,
} from '@/types/cabinet.types';
import {
  STANDARD_MATERIAL,
  FULL_OVERLAY,
  generateShelfPinHoles,
  generateHingeHoles,
  generateStandardGrooves,
  calculateMaterialUsage as calculateMaterial,
} from './cabinet-common';

const STANDARD_CONFIG: CabinetConfiguration = {
  hasDrawer: false,
  hasAdjustableShelf: true,
  shelfCount: 1,
  doorStyle: 'slab',
  hingeType: 'concealed',
  overlay: 'full',
};

export function generateBaseCabinet(
  width: CabinetWidth,
  config: Partial<CabinetConfiguration> = {}
): BaseCabinet {
  const dimensions = getStandardDimensions(width);
  const material = STANDARD_MATERIAL;
  const configuration = { ...STANDARD_CONFIG, ...config };
  const components = generateComponents(dimensions, material, configuration);

  return {
    id: `base-cabinet-${width}`,
    dimensions,
    material,
    components,
    configuration,
  };
}

function getStandardDimensions(width: CabinetWidth): BaseCabinetDimensions {
  return {
    width,
    depth: 24,
    height: 30,
    toeKickHeight: 4.5,
    toeKickDepth: 21,
    totalHeight: 34.5,
  };
}

function generateComponents(
  dims: BaseCabinetDimensions,
  mat: typeof STANDARD_MATERIAL,
  config: CabinetConfiguration
): CabinetComponents {
  const t = mat.thickness;
  const internalWidth = dims.width - (2 * t);
  const internalDepth = dims.depth - t;

  const sidePanels: ComponentDimensions = {
    name: 'Side Panel',
    width: dims.depth,
    height: dims.height,
    quantity: 2,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
    holes: generateShelfPinHoles(dims.depth, dims.height, 3, 3, 2, 2),
    grooves: generateStandardGrooves(dims.depth, dims.height, t, false),
  };

  const bottomPanel: ComponentDimensions = {
    name: 'Bottom Panel',
    width: internalWidth,
    height: internalDepth,
    quantity: 1,
    material: mat.type,
    thickness: t,
    edgeBanding: { front: true },
  };

  const topStretcher: ComponentDimensions = {
    name: 'Top Stretcher',
    width: internalWidth,
    height: 3,
    depth: t,
    quantity: 1,
    material: mat.type,
    thickness: t,
  };

  const backPanel: ComponentDimensions = {
    name: 'Back Panel',
    width: internalWidth,
    height: dims.height - 0.75,
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

  const doorPanel: ComponentDimensions = {
    name: 'Door Panel',
    width: dims.width + (2 * FULL_OVERLAY),
    height: dims.height + FULL_OVERLAY,
    quantity: 1,
    material: mat.type,
    thickness: t,
    edgeBanding: { top: true, bottom: true, left: true, right: true },
    holes: generateHingeHoles(dims.height, 2),
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

  return {
    leftSide: sidePanels,
    rightSide: sidePanels,
    bottom: bottomPanel,
    top: topStretcher,
    back: backPanel,
    adjustableShelf: config.hasAdjustableShelf ? adjustableShelf : undefined,
    door: doorPanel,
    toeKickFront,
    toeKickSides: [toeKickSide, toeKickSide],
  };
}

export function getAvailableWidths(): CabinetWidth[] {
  return [9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
}

export function generateCutList(cabinet: BaseCabinet): ComponentDimensions[] {
  const components = cabinet.components;
  const cutList: ComponentDimensions[] = [];

  cutList.push(components.leftSide);
  cutList.push(components.rightSide);
  cutList.push(components.bottom);
  cutList.push(components.top);
  cutList.push(components.back);
  
  if (components.adjustableShelf) {
    cutList.push(components.adjustableShelf);
  }
  
  cutList.push(components.door);
  
  if (components.drawerFront) {
    cutList.push(components.drawerFront);
  }
  
  cutList.push(components.toeKickFront);
  components.toeKickSides.forEach(side => cutList.push(side));

  return cutList;
}

export function calculateMaterialUsage(cabinet: BaseCabinet): {
  plywood34: number;
  plywood14: number;
  edgeBanding: number;
} {
  return calculateMaterial(generateCutList(cabinet));
}
