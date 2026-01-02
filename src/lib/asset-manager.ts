import { promises as fs } from 'fs';
import path from 'path';
import { join } from 'path';

// Asset types and interfaces
export interface AssetItem {
  id: string;
  name: string;
  type: 'texture' | 'cnc-file' | 'dwg-file' | 'drill-pattern';
  category: string;
  path: string;
  size?: number | string;
  description?: string;
  tags?: string[];
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export interface CNCUnit {
  id: string;
  name: string;
  type: string;
  description: string;
  specifications: Record<string, any>;
}

// Asset categories
export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: 'textures',
    name: 'Textures',
    description: 'Wood textures and materials',
    itemCount: 12
  },
  {
    id: 'cnc-files',
    name: 'CNC Files',
    description: 'CNC cutting files and programs',
    itemCount: 8
  },
  {
    id: 'dwg-files',
    name: 'DWG Files',
    description: 'AutoCAD drawing files',
    itemCount: 5
  },
  {
    id: 'drill-patterns',
    name: 'Drill Patterns',
    description: 'Drilling patterns and templates',
    itemCount: 15
  }
];

// Sample assets data
export const WOOD_TEXTURES: AssetItem[] = [
  {
    id: 'oak-medium',
    name: 'Oak - Medium',
    type: 'texture',
    category: 'textures',
    path: '/assets/textures/oak-medium.jpg',
    size: '2.4 MB',
    tags: ['wood', 'oak', 'medium']
  },
  {
    id: 'walnut-dark',
    name: 'Walnut - Dark',
    type: 'texture',
    category: 'textures',
    path: '/assets/textures/walnut-dark.jpg',
    size: '3.1 MB',
    tags: ['wood', 'walnut', 'dark']
  },
  {
    id: 'maple-light',
    name: 'Maple - Light',
    type: 'texture',
    category: 'textures',
    path: '/assets/textures/maple-light.jpg',
    size: '2.8 MB',
    tags: ['wood', 'maple', 'light']
  }
];

export const CNC_UNITS: CNCUnit[] = [
  {
    id: 'cnc-001',
    name: 'Standard Cabinet Unit',
    type: 'base-cabinet',
    description: 'Standard base cabinet CNC unit',
    specifications: {
      width: 600,
      height: 720,
      depth: 560,
      material: '18mm plywood'
    }
  },
  {
    id: 'cnc-002',
    name: 'Wall Cabinet Unit',
    type: 'wall-cabinet',
    description: 'Wall cabinet CNC unit',
    specifications: {
      width: 600,
      height: 700,
      depth: 320,
      material: '18mm plywood'
    }
  }
];

// Sample assets collection
const sampleAssets: AssetItem[] = [
  ...WOOD_TEXTURES,
  {
    id: 'cabinet-base-001',
    name: 'Base Cabinet Cut File',
    type: 'cnc-file',
    category: 'cnc-files',
    path: '/assets/cnc/base-cabinet-001.cnc',
    size: '156 KB',
    tags: ['cnc', 'base-cabinet', 'cutting']
  },
  {
    id: 'drill-pattern-001',
    name: 'Standard 32mm Pattern',
    type: 'drill-pattern',
    category: 'drill-patterns',
    path: '/assets/patterns/32mm-standard.dwg',
    size: '45 KB',
    tags: ['drill', '32mm', 'pattern']
  }
];

// Asset management functions
export function getAssetByCategory(category: string): AssetItem[] {
  return sampleAssets.filter(asset => asset.category === category);
}

export function searchAssets(query: string): AssetItem[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleAssets.filter(asset => 
    asset.name.toLowerCase().includes(lowercaseQuery) ||
    asset.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    asset.description?.toLowerCase().includes(lowercaseQuery)
  );
}

// Asset management utilities
export async function readAssetFile(filePath: string): Promise<Buffer | null> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    return await fs.readFile(fullPath);
  } catch (error) {
    console.error('Error reading asset file:', error);
    return null;
  }
}

export async function writeAssetFile(filePath: string, data: Buffer): Promise<boolean> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(fullPath, data);
    return true;
  } catch (error) {
    console.error('Error writing asset file:', error);
    return false;
  }
}

export async function listAssets(directory: string = ''): Promise<string[]> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', directory);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isFile())
      .map(entry => join(directory, entry.name));
  } catch (error) {
    console.error('Error listing assets:', error);
    return [];
  }
}

export async function deleteAsset(filePath: string): Promise<boolean> {
  try {
    const fullPath = join(process.cwd(), 'public', 'assets', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
}

export function getAssetUrl(filePath: string): string {
  return `/assets/${filePath}`;
}
