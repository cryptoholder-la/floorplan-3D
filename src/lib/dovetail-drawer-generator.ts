/**
 * Dovetail Drawer Generator
 * Creates parametric dovetail drawer boxes with specifications
 */

import { DovetailDrawerConfig, DrawerConfiguration } from '@/types/cabinet-config.types';
import { getDrawerSlideForDepth } from './blum-hardware-templates';
import { ComponentDimensions } from '@/types/cabinet.types';

export interface DovetailDrawerBox {
  config: DovetailDrawerConfig;
  components: {
    front: ComponentDimensions;
    back: ComponentDimensions;
    leftSide: ComponentDimensions;
    rightSide: ComponentDimensions;
    bottom: ComponentDimensions;
    falseFront?: ComponentDimensions;
  };
  dovetailDetails: {
    frontPins: number;
    backPins: number;
    pinWidth: number;
    tailWidth: number;
    spacing: number;
  };
  cutList: ComponentDimensions[];
}

export function generateDovetailDrawer(
  cabinetWidth: number,
  cabinetDepth: number,
  drawerHeight: number,
  options: Partial<DovetailDrawerConfig> = {}
): DovetailDrawerBox {
  const defaultSlide = getDrawerSlideForDepth('TANDEM-BLUMOTION', cabinetDepth);
  
  const config: DovetailDrawerConfig = {
    width: cabinetWidth - 1,
    depth: cabinetDepth - 2,
    height: drawerHeight,
    
    dovetailType: options.dovetailType || 'half-blind',
    dovetailSpacing: options.dovetailSpacing || 3,
    pinCount: options.pinCount || calculatePinCount(cabinetWidth, 3),
    
    material: options.material || 'maple',
    thickness: options.thickness || 0.5,
    
    bottomMaterial: options.bottomMaterial || 'plywood',
    bottomThickness: options.bottomThickness || 0.25,
    bottomGrooveOffset: options.bottomGrooveOffset || 0.375,
    
    frontStyle: options.frontStyle || 'false-front',
    frontOverlay: options.frontOverlay || 0.75,
    
    slide: options.slide || defaultSlide!,
    
    hasUnderMount: options.hasUnderMount !== undefined ? options.hasUnderMount : true,
    hasSoftClose: options.hasSoftClose !== undefined ? options.hasSoftClose : true,
    hasBlumotion: options.hasBlumotion !== undefined ? options.hasBlumotion : true,
  };
  
  const internalWidth = config.width - (2 * config.thickness);
  const internalDepth = config.depth - config.thickness;
  const bottomInset = 0.125;
  
  const front: ComponentDimensions = {
    name: 'Drawer Front',
    width: config.width,
    height: config.height,
    quantity: 1,
    material: config.material,
    thickness: config.thickness,
    edgeBanding: { top: true },
  };
  
  const back: ComponentDimensions = {
    name: 'Drawer Back',
    width: config.width,
    height: config.height - (config.bottomThickness + config.bottomGrooveOffset),
    quantity: 1,
    material: config.material,
    thickness: config.thickness,
    edgeBanding: { top: true },
  };
  
  const side: ComponentDimensions = {
    name: 'Drawer Side',
    width: config.depth,
    height: config.height,
    quantity: 2,
    material: config.material,
    thickness: config.thickness,
    edgeBanding: { top: true },
  };
  
  const bottom: ComponentDimensions = {
    name: 'Drawer Bottom',
    width: internalWidth - (2 * bottomInset),
    height: internalDepth + config.thickness - bottomInset,
    quantity: 1,
    material: config.bottomMaterial,
    thickness: config.bottomThickness,
  };
  
  const components: DovetailDrawerBox['components'] = {
    front,
    back,
    leftSide: side,
    rightSide: side,
    bottom,
  };
  
  if (config.frontStyle === 'false-front') {
    const falseFront: ComponentDimensions = {
      name: 'False Front',
      width: config.width + (2 * config.frontOverlay),
      height: config.height + config.frontOverlay,
      quantity: 1,
      material: 'plywood',
      thickness: 0.75,
      edgeBanding: { top: true, bottom: true, left: true, right: true },
    };
    components.falseFront = falseFront;
  }
  
  const dovetailDetails = calculateDovetailLayout(
    config.width,
    config.pinCount,
    config.dovetailSpacing
  );
  
  const cutList: ComponentDimensions[] = [
    front,
    back,
    { ...side, quantity: 1, name: 'Drawer Left Side' },
    { ...side, quantity: 1, name: 'Drawer Right Side' },
    bottom,
  ];
  
  if (components.falseFront) {
    cutList.push(components.falseFront);
  }
  
  return {
    config,
    components,
    dovetailDetails,
    cutList,
  };
}

export function generateDrawerStack(
  cabinetWidth: number,
  cabinetDepth: number,
  cabinetHeight: number,
  drawerConfiguration: DrawerConfiguration,
  options: Partial<DovetailDrawerConfig> = {}
): DovetailDrawerBox[] {
  const drawerHeights = calculateDrawerHeights(cabinetHeight, drawerConfiguration);
  
  return drawerHeights.map(height => 
    generateDovetailDrawer(cabinetWidth, cabinetDepth, height, options)
  );
}

function calculateDrawerHeights(
  cabinetHeight: number,
  configuration: DrawerConfiguration
): number[] {
  const usableHeight = cabinetHeight - 1;
  
  switch (configuration) {
    case 'single-drawer':
      return [usableHeight];
      
    case 'two-drawer':
      return [
        usableHeight * 0.4,
        usableHeight * 0.6,
      ];
      
    case 'three-drawer':
      return [
        usableHeight * 0.25,
        usableHeight * 0.35,
        usableHeight * 0.4,
      ];
      
    case 'four-drawer':
      return [
        usableHeight * 0.2,
        usableHeight * 0.25,
        usableHeight * 0.25,
        usableHeight * 0.3,
      ];
      
    case 'five-drawer':
      return [
        usableHeight * 0.15,
        usableHeight * 0.2,
        usableHeight * 0.2,
        usableHeight * 0.225,
        usableHeight * 0.225,
      ];
  }
}

function calculatePinCount(width: number, spacing: number): number {
  return Math.floor(width / spacing) + 1;
}

function calculateDovetailLayout(
  width: number,
  pinCount: number,
  spacing: number
) {
  const totalPins = pinCount;
  const totalTails = pinCount - 1;
  
  const totalSpacing = width - (totalPins * 0.5);
  const pinWidth = 0.5;
  const tailWidth = totalSpacing / totalTails;
  
  return {
    frontPins: totalPins,
    backPins: totalPins,
    pinWidth,
    tailWidth,
    spacing,
  };
}

export function calculateDrawerMaterialUsage(drawer: DovetailDrawerBox): {
  solidWood: number;
  plywood: number;
  edgeBanding: number;
} {
  const solidWoodArea = 
    (drawer.components.front.width * drawer.components.front.height / 144) +
    (drawer.components.back.width * drawer.components.back.height / 144) +
    (drawer.components.leftSide.width * drawer.components.leftSide.height * 2 / 144);
  
  const plywoodArea = 
    (drawer.components.bottom.width * drawer.components.bottom.height / 144) +
    (drawer.components.falseFront 
      ? drawer.components.falseFront.width * drawer.components.falseFront.height / 144 
      : 0);
  
  const edgeBandingLength = 
    drawer.components.front.width +
    drawer.components.back.width +
    (drawer.components.leftSide.width * 2);
  
  return {
    solidWood: Math.ceil(solidWoodArea * 10) / 10,
    plywood: Math.ceil(plywoodArea * 10) / 10,
    edgeBanding: Math.ceil(edgeBandingLength / 12 * 10) / 10,
  };
}

export const STANDARD_DRAWER_HEIGHTS = {
  shallow: 3,
  standard: 4.5,
  medium: 6,
  deep: 8,
  xDeep: 10,
  fileDrawer: 12,
};

export function recommendDrawerHeight(itemType: string): number {
  const recommendations: Record<string, number> = {
    'utensils': STANDARD_DRAWER_HEIGHTS.shallow,
    'cutlery': STANDARD_DRAWER_HEIGHTS.shallow,
    'flatware': STANDARD_DRAWER_HEIGHTS.shallow,
    'spices': STANDARD_DRAWER_HEIGHTS.shallow,
    'kitchen-tools': STANDARD_DRAWER_HEIGHTS.standard,
    'dishes': STANDARD_DRAWER_HEIGHTS.medium,
    'pots-pans': STANDARD_DRAWER_HEIGHTS.deep,
    'files': STANDARD_DRAWER_HEIGHTS.fileDrawer,
    'general': STANDARD_DRAWER_HEIGHTS.standard,
  };
  
  return recommendations[itemType] || STANDARD_DRAWER_HEIGHTS.standard;
}
