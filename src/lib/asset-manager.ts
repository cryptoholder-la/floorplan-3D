export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  path: string;
  itemCount: number;
}

export interface AssetItem {
  id: string;
  name: string;
  path: string;
  category: string;
  type: 'texture' | 'cnc-file' | 'dwg-file' | 'model' | 'pattern' | 'base' | 'drawer' | 'wall' | 'jig';
  size?: number | string;
  thumbnail?: string;
}

export interface CNCUnit {
  id: string;
  name: string;
  type: 'base' | 'drawer' | 'wall' | 'jig';
  size: string;
  path: string;
  stepFile?: string;
  parts: AssetItem[];
  category: string;
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: 'textures',
    name: 'Wood Textures',
    description: 'High-quality wood material textures for 3D rendering',
    path: '/assets/Textures',
    itemCount: 29
  },
  {
    id: 'cnc-files',
    name: 'CNC Files',
    description: 'OpenGrill 3D CAD collection of kitchen units',
    path: '/assets/CNC FILES',
    itemCount: 14
  },
  {
    id: 'models',
    name: '3D Models',
    description: 'GLB format 3D furniture and cabinet models',
    path: '/assets/models/glb',
    itemCount: 781
  },
  {
    id: 'wireframes',
    name: 'Wireframe Assets',
    description: 'JavaScript wireframe components and 3D framework',
    path: '/assets/js',
    itemCount: 34
  },
  {
    id: 'nesting',
    name: 'Nesting Optimizer',
    description: 'CNC sheet nesting optimization and workflow management',
    path: '/assets/cnc_32mm_drill_patterns_by_PETER_DRAGON',
    itemCount: 6
  },
  {
    id: 'catalog',
    name: 'Catalog Manager',
    description: 'Advanced catalog system for kitchen components and furniture',
    path: '/assets/js/core/catalog',
    itemCount: 3
  },
  {
    id: 'gcode',
    name: 'G-Code Generator',
    description: 'CNC G-code generation and manufacturing file formats',
    path: '/assets/cnc_32mm_drill_patterns_by_PETER_DRAGON',
    itemCount: 7
  },
  {
    id: 'dwg-files',
    name: 'DWG Files',
    description: 'AutoCAD drawing files for various components',
    path: '/assets/DWG-100',
    itemCount: 54
  },
  {
    id: 'drill-patterns',
    name: 'Drill Patterns',
    description: '32mm drill patterns by Peter Dragon',
    path: '/assets/cnc_32mm_drill_patterns_by_PETER_DRAGON',
    itemCount: 19
  }
];

export const WOOD_TEXTURES: AssetItem[] = [
  { id: 'alder', name: 'Alder', path: '/assets/Textures/Alder.jpg', category: 'textures', type: 'texture' },
  { id: 'ash', name: 'Ash', path: '/assets/Textures/Ash.jpg', category: 'textures', type: 'texture' },
  { id: 'beech', name: 'Beech', path: '/assets/Textures/BEECH.JPG', category: 'textures', type: 'texture' },
  { id: 'birch', name: 'Birch', path: '/assets/Textures/Birch.jpg', category: 'textures', type: 'texture' },
  { id: 'brick2', name: 'Brick 2', path: '/assets/Textures/BRICK2.JPG', category: 'textures', type: 'texture' },
  { id: 'brick-hv', name: 'Brick HV', path: '/assets/Textures/BRICKHV.JPG', category: 'textures', type: 'texture' },
  { id: 'brick-uni', name: 'Brick Universal', path: '/assets/Textures/BRICKUNI.JPG', category: 'textures', type: 'texture' },
  { id: 'cherry', name: 'Cherry', path: '/assets/Textures/Cherry.jpg', category: 'textures', type: 'texture' },
  { id: 'maple', name: 'Maple', path: '/assets/Textures/Maple.jpg', category: 'textures', type: 'texture' },
  { id: 'oak1', name: 'Oak 1', path: '/assets/Textures/OAK1.JPG', category: 'textures', type: 'texture' },
  { id: 'pine', name: 'Pine', path: '/assets/Textures/PINEWOOD.JPG', category: 'textures', type: 'texture' },
  { id: 'pine2', name: 'Pine 2', path: '/assets/Textures/Pine2.jpg', category: 'textures', type: 'texture' },
  { id: 'granite1', name: 'Granite 1', path: '/assets/Textures/GRANIT1.JPG', category: 'textures', type: 'texture' },
  { id: 'granite20', name: 'Granite 20', path: '/assets/Textures/GRANIT20.JPG', category: 'textures', type: 'texture' },
  { id: 'marble', name: 'Marble', path: '/assets/Textures/MARBLE.JPG', category: 'textures', type: 'texture' },
  { id: 'marble3', name: 'Marble 3', path: '/assets/Textures/MARBLE3.JPG', category: 'textures', type: 'texture' },
  { id: 'stone2', name: 'Stone 2', path: '/assets/Textures/Stone2.jpg', category: 'textures', type: 'texture' },
  { id: 'stone4', name: 'Stone 4', path: '/assets/Textures/Stone4.jpg', category: 'textures', type: 'texture' }
];

export const CNC_UNITS: CNCUnit[] = [
  {
    id: 'base-300mm',
    name: 'Base Unit 300mm',
    type: 'base',
    size: '300mm',
    path: '/assets/CNC FILES/Base Units/300mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'base-400mm',
    name: 'Base Unit 400mm',
    type: 'base',
    size: '400mm',
    path: '/assets/CNC FILES/Base Units/400mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'base-500mm',
    name: 'Base Unit 500mm',
    type: 'base',
    size: '500mm',
    path: '/assets/CNC FILES/Base Units/500mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'base-600mm',
    name: 'Base Unit 600mm',
    type: 'base',
    size: '600mm',
    path: '/assets/CNC FILES/Base Units/600mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'base-800mm',
    name: 'Base Unit 800mm',
    type: 'base',
    size: '800mm',
    path: '/assets/CNC FILES/Base Units/800mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'base-1000mm',
    name: 'Base Unit 1000mm',
    type: 'base',
    size: '1000mm',
    path: '/assets/CNC FILES/Base Units/1000mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'drawer-500mm',
    name: 'Drawer Unit 500mm',
    type: 'drawer',
    size: '500mm',
    path: '/assets/CNC FILES/Drawer Units/500mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'drawer-600mm',
    name: 'Drawer Unit 600mm',
    type: 'drawer',
    size: '600mm',
    path: '/assets/CNC FILES/Drawer Units/600mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'drawer-800mm',
    name: 'Drawer Unit 800mm',
    type: 'drawer',
    size: '800mm',
    path: '/assets/CNC FILES/Drawer Units/800mm',
    parts: [],
    category: 'cnc-files'
  },
  {
    id: 'drawer-1000mm',
    name: 'Drawer Unit 1000mm',
    type: 'drawer',
    size: '1000mm',
    path: '/assets/CNC FILES/Drawer Units/1000mm',
    parts: [],
    category: 'cnc-files'
  }
];

export function getAssetByCategory(categoryId: string): AssetItem[] {
  switch (categoryId) {
    case 'textures':
      return WOOD_TEXTURES;
    case 'cnc-files':
      return CNC_UNITS;
    case 'models':
      return []; // Models are handled separately in ModelViewer
    case 'wireframes':
      return []; // Wireframes are handled separately in WireframeViewer
    case 'nesting':
      return []; // Nesting is handled separately in NestingOptimizer
    case 'catalog':
      return []; // Catalog is handled separately in CatalogManager
    case 'gcode':
      return []; // G-code is handled separately in GCodeGenerator
    case 'dwg-files':
      return []; // DWG files not yet implemented
    case 'drill-patterns':
      return []; // Drill patterns not yet implemented
    default:
      return [];
  }
}

export function getAssetById(id: string): AssetItem | null {
  const allAssets = [...WOOD_TEXTURES, ...CNC_UNITS];
  return allAssets.find(asset => asset.id === id) || null;
}

export function searchAssets(query: string): AssetItem[] {
  const allAssets = [...WOOD_TEXTURES, ...CNC_UNITS];
  return allAssets.filter(asset => 
    asset.name.toLowerCase().includes(query.toLowerCase()) ||
    asset.category.toLowerCase().includes(query.toLowerCase())
  );
}
