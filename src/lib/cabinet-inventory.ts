import {
  CabinetWidth,
  WallCabinetWidth,
  WallCabinetHeight,
  TallCabinetWidth,
  TallCabinetHeight,
  CabinetType,
} from '@/types/cabinet.types';
import { generateBaseCabinet, getAvailableWidths } from './cabinet-generator';
import { 
  generateWallCabinet, 
  getAvailableWallWidths, 
  getAvailableWallHeights 
} from './wall-cabinet-generator';
import { 
  generateTallCabinet, 
  getAvailableTallWidths, 
  getAvailableTallHeights 
} from './tall-cabinet-generator';

export interface CabinetInventoryItem {
  id: string;
  type: CabinetType;
  label: string;
  width: number;
  height: number;
  depth: number;
  category: string;
}

export interface CabinetTypeOption {
  value: CabinetType;
  label: string;
  description: string;
}

export interface CabinetSizeOption {
  value: string;
  label: string;
  width: number;
  height?: number;
}

export const CABINET_TYPE_OPTIONS: CabinetTypeOption[] = [
  {
    value: 'base',
    label: 'Base Cabinet',
    description: '34.5" tall, 24" deep',
  },
  {
    value: 'wall',
    label: 'Wall Cabinet',
    description: '12-42" tall, 12" deep',
  },
  {
    value: 'tall',
    label: 'Tall Cabinet',
    description: '79.5-91.5" tall, 24" deep',
  },
];

export function getBaseCabinetSizes(): CabinetSizeOption[] {
  const widths = getAvailableWidths();
  return widths.map((width) => ({
    value: `base-${width}`,
    label: `${width}" Wide`,
    width,
  }));
}

export function getWallCabinetSizes(): CabinetSizeOption[] {
  const widths = getAvailableWallWidths();
  const heights = getAvailableWallHeights();
  const options: CabinetSizeOption[] = [];

  heights.forEach((height) => {
    widths.forEach((width) => {
      options.push({
        value: `wall-${width}x${height}`,
        label: `${width}" W × ${height}" H`,
        width,
        height,
      });
    });
  });

  return options;
}

export function getTallCabinetSizes(): CabinetSizeOption[] {
  const widths = getAvailableTallWidths();
  const heights = getAvailableTallHeights();
  const options: CabinetSizeOption[] = [];

  heights.forEach((height) => {
    widths.forEach((width) => {
      options.push({
        value: `tall-${width}x${height}`,
        label: `${width}" W × ${height}" H`,
        width,
        height,
      });
    });
  });

  return options;
}

export function getCabinetSizesByType(type: CabinetType): CabinetSizeOption[] {
  switch (type) {
    case 'base':
      return getBaseCabinetSizes();
    case 'wall':
      return getWallCabinetSizes();
    case 'tall':
      return getTallCabinetSizes();
    default:
      return [];
  }
}

export function generateCabinetByTypeAndSize(
  type: CabinetType,
  sizeValue: string
): CabinetInventoryItem | null {
  const parts = sizeValue.split('-');
  
  if (type === 'base' && parts.length === 2) {
    const width = parseInt(parts[1]) as CabinetWidth;
    const cabinet = generateBaseCabinet(width);
    return {
      id: cabinet.id,
      type: 'base',
      label: `Base Cabinet ${width}"`,
      width: cabinet.dimensions.width,
      height: cabinet.dimensions.totalHeight,
      depth: cabinet.dimensions.depth,
      category: 'Base Cabinets',
    };
  }

  if (type === 'wall' && parts.length === 2) {
    const [widthStr, heightStr] = parts[1].split('x');
    const width = parseInt(widthStr) as WallCabinetWidth;
    const height = parseInt(heightStr) as WallCabinetHeight;
    const cabinet = generateWallCabinet(width, height);
    return {
      id: cabinet.id,
      type: 'wall',
      label: `Wall Cabinet ${width}"×${height}"`,
      width: cabinet.dimensions.width,
      height: cabinet.dimensions.height,
      depth: cabinet.dimensions.depth,
      category: 'Wall Cabinets',
    };
  }

  if (type === 'tall' && parts.length === 2) {
    const [widthStr, heightStr] = parts[1].split('x');
    const width = parseInt(widthStr) as TallCabinetWidth;
    const height = parseFloat(heightStr) as TallCabinetHeight;
    const cabinet = generateTallCabinet(width, height);
    return {
      id: cabinet.id,
      type: 'tall',
      label: `Tall Cabinet ${width}"×${height}"`,
      width: cabinet.dimensions.width,
      height: cabinet.dimensions.height,
      depth: cabinet.dimensions.depth,
      category: 'Tall Cabinets',
    };
  }

  return null;
}

export function getAllInventoryItems(): CabinetInventoryItem[] {
  const items: CabinetInventoryItem[] = [];

  getAvailableWidths().forEach((width) => {
    const cabinet = generateBaseCabinet(width);
    items.push({
      id: cabinet.id,
      type: 'base',
      label: `Base ${width}"`,
      width: cabinet.dimensions.width,
      height: cabinet.dimensions.totalHeight,
      depth: cabinet.dimensions.depth,
      category: 'Base Cabinets',
    });
  });

  getAvailableWallHeights().forEach((height) => {
    getAvailableWallWidths().forEach((width) => {
      const cabinet = generateWallCabinet(width, height);
      items.push({
        id: cabinet.id,
        type: 'wall',
        label: `Wall ${width}"×${height}"`,
        width: cabinet.dimensions.width,
        height: cabinet.dimensions.height,
        depth: cabinet.dimensions.depth,
        category: 'Wall Cabinets',
      });
    });
  });

  getAvailableTallHeights().forEach((height) => {
    getAvailableTallWidths().forEach((width) => {
      const cabinet = generateTallCabinet(width, height);
      items.push({
        id: cabinet.id,
        type: 'tall',
        label: `Tall ${width}"×${height}"`,
        width: cabinet.dimensions.width,
        height: cabinet.dimensions.height,
        depth: cabinet.dimensions.depth,
        category: 'Tall Cabinets',
      });
    });
  });

  return items;
}
