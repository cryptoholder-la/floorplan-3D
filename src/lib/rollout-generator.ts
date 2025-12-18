/**
 * Rollout/Pullout Tray Generator
 * Creates parametric rollout shelves and pullout trays
 */

import { RolloutConfig } from '@/types/cabinet-config.types';
import { getDrawerSlideForDepth } from './blum-hardware-templates';
import { ComponentDimensions } from '@/types/cabinet.types';

export interface RolloutTray {
  config: RolloutConfig;
  components: {
    base: ComponentDimensions;
    frontRail: ComponentDimensions;
    backRail: ComponentDimensions;
    leftRail: ComponentDimensions;
    rightRail: ComponentDimensions;
    dividers?: ComponentDimensions[];
  };
  cutList: ComponentDimensions[];
  installation: {
    slideModel: string;
    mountingHeight: number;
    clearance: {
      side: number;
      front: number;
      rear: number;
    };
  };
}

export function generateRollout(
  cabinetWidth: number,
  cabinetDepth: number,
  rolloutHeight: number = 3,
  type: RolloutConfig['type'] = 'full-extension',
  material: 'plywood' | 'melamine' | 'wire' = 'plywood'
): RolloutTray {
  const defaultSlide = getDrawerSlideForDepth('TANDEM-BLUMOTION', cabinetDepth);
  
  const config: RolloutConfig = {
    type,
    width: cabinetWidth - 1.5,
    depth: cabinetDepth - 2,
    height: rolloutHeight,
    material,
    slide: defaultSlide!,
    hasStops: true,
    hasDividersOptions: material !== 'wire',
    capacity: calculateWeightCapacity(cabinetWidth, material),
  };
  
  const components = generateRolloutComponents(config);
  const cutList = createRolloutCutList(components);
  
  return {
    config,
    components,
    cutList,
    installation: {
      slideModel: config.slide.model,
      mountingHeight: config.slide.mountingHeight,
      clearance: {
        side: config.slide.sideGap,
        front: config.slide.frontGap,
        rear: config.slide.rearGap,
      },
    },
  };
}

function generateRolloutComponents(config: RolloutConfig): RolloutTray['components'] {
  const thickness = config.material === 'wire' ? 0.25 : 0.5;
  const railHeight = config.material === 'wire' ? 2 : config.height;
  
  const base: ComponentDimensions = {
    name: 'Rollout Base',
    width: config.width,
    height: config.depth,
    quantity: 1,
    material: config.material,
    thickness,
    edgeBanding: config.material === 'plywood' ? { front: true, back: true, left: true, right: true } : undefined,
  };
  
  const frontRail: ComponentDimensions = {
    name: 'Front Rail',
    width: config.width,
    height: railHeight,
    quantity: 1,
    material: config.material === 'wire' ? 'plywood' : config.material,
    thickness,
    edgeBanding: { top: true, left: true, right: true },
  };
  
  const backRail: ComponentDimensions = {
    name: 'Back Rail',
    width: config.width,
    height: railHeight,
    quantity: 1,
    material: config.material === 'wire' ? 'plywood' : config.material,
    thickness,
    edgeBanding: { top: true, left: true, right: true },
  };
  
  const sideRail: ComponentDimensions = {
    name: 'Side Rail',
    width: config.depth,
    height: railHeight,
    quantity: 2,
    material: config.material === 'wire' ? 'plywood' : config.material,
    thickness,
    edgeBanding: { top: true, front: true, back: true },
  };
  
  return {
    base,
    frontRail,
    backRail,
    leftRail: sideRail,
    rightRail: sideRail,
  };
}

function createRolloutCutList(components: RolloutTray['components']): ComponentDimensions[] {
  const cutList: ComponentDimensions[] = [
    components.base,
    components.frontRail,
    components.backRail,
    { ...components.leftRail, quantity: 1, name: 'Left Side Rail' },
    { ...components.rightRail, quantity: 1, name: 'Right Side Rail' },
  ];
  
  if (components.dividers) {
    cutList.push(...components.dividers);
  }
  
  return cutList;
}

export function generateRolloutStack(
  cabinetWidth: number,
  cabinetDepth: number,
  cabinetHeight: number,
  rolloutCount: number,
  spacing: number = 4
): RolloutTray[] {
  const availableHeight = cabinetHeight - 4.5;
  const rolloutHeight = 3;
  const totalRolloutHeight = rolloutHeight * rolloutCount;
  const totalSpacing = spacing * (rolloutCount - 1);
  
  if (totalRolloutHeight + totalSpacing > availableHeight) {
    throw new Error('Too many rollouts for cabinet height');
  }
  
  return Array.from({ length: rolloutCount }, () =>
    generateRollout(cabinetWidth, cabinetDepth, rolloutHeight)
  );
}

export function generateDualTrayRollout(
  cabinetWidth: number,
  cabinetDepth: number,
  upperHeight: number = 3,
  lowerHeight: number = 5
): { upper: RolloutTray; lower: RolloutTray } {
  return {
    upper: generateRollout(cabinetWidth, cabinetDepth, upperHeight),
    lower: generateRollout(cabinetWidth, cabinetDepth, lowerHeight),
  };
}

export function generateWireBasketRollout(
  cabinetWidth: number,
  cabinetDepth: number,
  basketHeight: number = 8
): RolloutTray {
  return generateRollout(
    cabinetWidth,
    cabinetDepth,
    basketHeight,
    'full-extension',
    'wire'
  );
}

export function calculateRolloutPositions(
  cabinetHeight: number,
  rolloutCount: number,
  rolloutHeight: number = 3,
  spacing: number = 4,
  startFromBottom: number = 4.5
): number[] {
  const positions: number[] = [];
  let currentHeight = startFromBottom;
  
  for (let i = 0; i < rolloutCount; i++) {
    positions.push(currentHeight);
    currentHeight += rolloutHeight + spacing;
  }
  
  return positions;
}

function calculateWeightCapacity(width: number, material: string): number {
  const baseCapacity = material === 'wire' ? 30 : 40;
  
  if (width <= 18) return baseCapacity + 10;
  if (width <= 24) return baseCapacity;
  if (width <= 30) return baseCapacity - 5;
  return baseCapacity - 10;
}

export function addDividersToRollout(
  rollout: RolloutTray,
  dividerPositions: number[]
): RolloutTray {
  if (rollout.config.material === 'wire' || !rollout.config.hasDividersOptions) {
    return rollout;
  }
  
  const dividers: ComponentDimensions[] = dividerPositions.map((position, idx) => ({
    name: `Divider ${idx + 1}`,
    width: rollout.config.depth - 1,
    height: rollout.config.height - 0.5,
    quantity: 1,
    material: rollout.config.material,
    thickness: 0.25,
    edgeBanding: { top: true, front: true, back: true },
  }));
  
  rollout.components.dividers = dividers;
  rollout.cutList = createRolloutCutList(rollout.components);
  
  return rollout;
}

export const ROLLOUT_PRESETS = {
  spicePullout: (cabinetWidth: number, cabinetDepth: number) =>
    generateRolloutStack(cabinetWidth, cabinetDepth, 30, 4, 3),
  
  trashPullout: (cabinetWidth: number, cabinetDepth: number) =>
    generateRollout(cabinetWidth, cabinetDepth, 18, 'full-extension'),
  
  potAndPanRollout: (cabinetWidth: number, cabinetDepth: number) =>
    generateRolloutStack(cabinetWidth, cabinetDepth, 30, 2, 6),
  
  pantryRollouts: (cabinetWidth: number, cabinetDepth: number, cabinetHeight: number) =>
    generateRolloutStack(cabinetWidth, cabinetDepth, cabinetHeight, 5, 6),
  
  wirePantryBaskets: (cabinetWidth: number, cabinetDepth: number, cabinetHeight: number) => {
    const basketCount = Math.floor((cabinetHeight - 10) / 14);
    return Array.from({ length: basketCount }, () =>
      generateWireBasketRollout(cabinetWidth, cabinetDepth, 10)
    );
  },
};
