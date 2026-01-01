// Cabinet Generator Library for Floorplan 3D

import { Cabinet, CabinetPart, CabinetMaterial, CabinetHardware, CutListItem } from '@/types/cabinet.types';
import { CabinetDimensions, CabinetWidth } from '@/types/base.types';

// Standard cabinet dimensions (in inches)
export const STANDARD_DIMENSIONS = {
  base: {
    depths: [12, 15, 18, 21, 24],
    heights: [34.5], // Standard base cabinet height
    widths: [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48] as CabinetWidth[]
  },
  wall: {
    depths: [12, 15],
    heights: [30, 36, 42],
    widths: [12, 15, 18, 21, 24, 27, 30, 33, 36] as CabinetWidth[]
  },
  tall: {
    depths: [12, 15, 18, 21, 24],
    heights: [84, 90, 96],
    widths: [12, 15, 18, 21, 24, 27, 30, 33, 36] as CabinetWidth[]
  }
};

// Standard materials
export const STANDARD_MATERIALS: CabinetMaterial[] = [
  {
    id: 'plywood-3-4',
    name: '3/4" Baltic Birch Plywood',
    type: 'plywood',
    thickness: 0.75,
    cost: 50,
    supplier: 'Hardwood Suppliers'
  },
  {
    id: 'plywood-1-2',
    name: '1/2" Baltic Birch Plywood',
    type: 'plywood',
    thickness: 0.5,
    cost: 50,
    supplier: 'Hardwood Suppliers'
  },
  {
    id: 'plywood-1-4',
    name: '1/4" Baltic Birch Plywood',
    type: 'plywood',
    thickness: 0.25,
    cost: 50,
    supplier: 'Hardwood Suppliers'
  },
  {
    id: 'hardwood-maple',
    name: 'Maple Hardwood',
    type: 'hardwood',
    thickness: 0.75,
    cost: 50,
    supplier: 'Hardwood Suppliers'
  }
];

// Standard hardware
export const STANDARD_HARDWARE: CabinetHardware[] = [
  {
    id: 'hinge-concealed',
    name: 'Concealed European Hinge',
    type: 'hinge',
    count: 1,
    price: 8.50,
    supplier: 'Hardware World'
  },
  {
    id: 'handle-modern',
    name: 'Modern Bar Handle',
    type: 'handle',
    count: 1,
    price: 12.00,
    supplier: 'Hardware World'
  },
  {
    id: 'drawer-slide-side',
    name: 'Side Mount Drawer Slide',
    type: 'drawer-slide',
    count: 1,
    price: 15.00,
    supplier: 'Hardware World'
  },
  {
    id: 'shelf-pin-5mm',
    name: '5mm Shelf Pin',
    type: 'shelf-pin',
    count: 1,
    price: 0.50,
    supplier: 'Hardware World'
  }
];

/**
 * Generate a base cabinet with standard construction
 */
export function generateBaseCabinet(width: CabinetWidth): Cabinet {
  const dimensions: CabinetDimensions = {
    width,
    depth: 24,
    height: 34.5
  };

  const cabinet: Cabinet = {
    id: `base-cabinet-${width}-${Date.now()}`,
    name: `${width}" Base Cabinet`,
    type: 'base',
    dimensions,
    parts: [],
    hardware: [...STANDARD_HARDWARE],
    materials: [...STANDARD_MATERIALS],
    estimatedCost: 0,
    estimatedTime: 120, // minutes
    createdAt: new Date(),
      updatedAt: new Date(),
      configuration: {
        style: 'standard',
        finish: 'natural'
      },
      difficulty: 'intermediate',
      status: 'draft',
      tags: [],
      metadata: {
        version: '1.0.0',
        designer: 'system'
      }
    };

  // Generate cabinet parts
  cabinet.parts = generateBaseCabinetParts(dimensions);
  
  // Calculate estimated cost
  cabinet.estimatedCost = calculateCabinetCost(cabinet);

  return cabinet;
}

/**
 * Generate a wall cabinet with standard construction
 */
export function generateWallCabinet(width: CabinetWidth, height: number = 30): Cabinet {
  const dimensions: CabinetDimensions = {
    width,
    depth: 12,
    height: height as any
  };

  const cabinet: Cabinet = {
    id: `wall-cabinet-${width}-${Date.now()}`,
    name: `${width}" Wall Cabinet`,
    type: 'wall',
    dimensions,
    parts: [],
    hardware: [...STANDARD_HARDWARE],
    materials: [...STANDARD_MATERIALS],
    estimatedCost: 0,
    estimatedTime: 90, // minutes
    createdAt: new Date(),
      updatedAt: new Date(),
      configuration: {
        style: 'standard',
        finish: 'natural'
      },
      difficulty: 'intermediate',
      status: 'draft',
      tags: [],
      metadata: {
        version: '1.0.0',
        designer: 'system'
      }
    };

  // Generate cabinet parts
  cabinet.parts = generateWallCabinetParts(dimensions);
  
  // Calculate estimated cost
  cabinet.estimatedCost = calculateCabinetCost(cabinet);

  return cabinet;
}

/**
 * Generate parts for a base cabinet
 */
function generateBaseCabinetParts(dimensions: CabinetDimensions): CabinetPart[] {
  const parts: CabinetPart[] = [];
  const plywood3_4 = STANDARD_MATERIALS.find(m => m.id === 'plywood-3-4')!;
  const plywood1_2 = STANDARD_MATERIALS.find(m => m.id === 'plywood-1-2')!;
  const plywood1_4 = STANDARD_MATERIALS.find(m => m.id === 'plywood-1-4')!;

  // Sides (2 pieces)
  parts.push({
    id: 'side-left',
    name: 'Left Side Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.depth,
      height: dimensions.height,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  parts.push({
    id: 'side-right',
    name: 'Right Side Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.depth,
      height: dimensions.height,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  // Top and bottom (2 pieces)
  parts.push({
    id: 'top',
    name: 'Top Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5, // Account for side thickness
      height: dimensions.depth,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  parts.push({
    id: 'bottom',
    name: 'Bottom Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth - 1, // Set back from front
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  // Back panel
  parts.push({
    id: 'back',
    name: 'Back Panel',
    material: plywood1_4,
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
      thickness: plywood1_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  // Toe kick base
  parts.push({
    id: 'toe-kick',
    name: 'Toe Kick Base',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: 3,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  // Adjustable shelves (2 standard)
  parts.push({
    id: 'shelf-1',
    name: 'Adjustable Shelf 1',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth - 1,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  parts.push({
    id: 'shelf-2',
    name: 'Adjustable Shelf 2',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth - 1,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  return parts;
}

/**
 * Generate parts for a wall cabinet
 */
function generateWallCabinetParts(dimensions: CabinetDimensions): CabinetPart[] {
  const parts: CabinetPart[] = [];
  const plywood3_4 = STANDARD_MATERIALS.find(m => m.id === 'plywood-3-4')!;
  const plywood1_4 = STANDARD_MATERIALS.find(m => m.id === 'plywood-1-4')!;

  // Sides (2 pieces)
  parts.push({
    id: 'side-left',
    name: 'Left Side Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.depth,
      height: dimensions.height,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  parts.push({
    id: 'side-right',
    name: 'Right Side Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.depth,
      height: dimensions.height,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  // Top and bottom (2 pieces)
  parts.push({
    id: 'top',
    name: 'Top Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  parts.push({
    id: 'bottom',
    name: 'Bottom Panel',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  // Back panel
  parts.push({
    id: 'back',
    name: 'Back Panel',
    material: plywood1_4,
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
      thickness: plywood1_4.thickness
    },
    count: 1,
    grainDirection: 'vertical'
  });

  // Adjustable shelves (1 standard for wall cabinet)
  parts.push({
    id: 'shelf-1',
    name: 'Adjustable Shelf',
    material: plywood3_4,
    dimensions: {
      width: dimensions.width - 1.5,
      height: dimensions.depth - 0.5,
      thickness: plywood3_4.thickness
    },
    count: 1,
    grainDirection: 'horizontal'
  });

  return parts;
}

/**
 * Calculate the total cost of a cabinet
 */
export function calculateCabinetCost(cabinet: Cabinet): number {
  let materialCost = 0;
  let hardwareCost = 0;

  // Calculate material cost
  cabinet.parts.forEach(part => {
    const area = (part.dimensions.width * part.dimensions.height) / 144; // Convert to square feet
    const materialCostPerSqFt = part.material.pricePerSheet / 32; // Assume 4x8 sheet (32 sq ft)
    materialCost += area * materialCostPerSqFt * part.quantity;
  });

  // Calculate hardware cost
  cabinet.hardware.forEach(hardware => {
    hardwareCost += hardware.unitPrice * hardware.quantity;
  });

  // Add labor cost (estimated at $50/hour)
  const laborCost = (cabinet.estimatedTime || 120) / 60 * 50;

  // Add overhead (15%)
  const overhead = (materialCost + hardwareCost + laborCost) * 0.15;

  return materialCost + hardwareCost + laborCost + overhead;
}

/**
 * Generate a cut list from a cabinet
 */
export function generateCutList(cabinet: Cabinet): CutListItem[] {
  return cabinet.parts.map(part => ({
    id: `${cabinet.id}-${part.id}`,
    cabinetId: cabinet.id,
    cabinetName: cabinet.name,
    partName: part.name,
    material: part.material,
    width: part.dimensions.width,
    height: part.dimensions.height,
    thickness: part.dimensions.thickness,
    count: part.quantity,
    grainDirection: part.grainDirection || 'horizontal',
    edgeBanding: part.edgeBanding || {
      top: false,
      bottom: false,
      left: false,
      right: false
    },
    notes: `Grain direction: ${part.grainDirection || 'horizontal'}`
  }));
}

/**
 * Generate multiple cabinets for a kitchen layout
 */
export function generateKitchenLayout(layout: {
  baseCabinets: CabinetWidth[];
  wallCabinets: CabinetWidth[];
  tallCabinets?: CabinetWidth[];
}): Cabinet[] {
  const cabinets: Cabinet[] = [];

  // Generate base cabinets
  layout.baseCabinets.forEach(width => {
    cabinets.push(generateBaseCabinet(width));
  });

  // Generate wall cabinets
  layout.wallCabinets.forEach(width => {
    cabinets.push(generateWallCabinet(width));
  });

  // Generate tall cabinets if specified
  layout.tallCabinets?.forEach(width => {
    const tallCabinet = generateBaseCabinet(width);
    tallCabinet.type = 'tall';
    tallCabinet.dimensions.height = 84;
    tallCabinet.name = `${width}" Tall Cabinet`;
    tallCabinet.id = `tall-cabinet-${width}-${Date.now()}`;
    cabinets.push(tallCabinet);
  });

  return cabinets;
}

/**
 * Optimize cut list for material efficiency
 */
export function optimizeCutList(cutList: CutListItem[]): {
  optimized: CutListItem[];
  materialUsage: Record<string, {
    sheets: number;
    waste: number;
    efficiency: number;
  }>;
} {
  // Group by material and thickness
  const grouped = cutList.reduce((acc, item) => {
    const key = `${item.material.id}-${item.thickness}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CutListItem[]>);

  const materialUsage: Record<string, {
    sheets: number;
    waste: number;
    efficiency: number;
  }> = {};

  const optimized: CutListItem[] = [];

  // For each material group, optimize layout
  Object.entries(grouped).forEach(([key, items]) => {
    const [materialId] = key.split('-');
    const material = items[0].material;
    
    // Simple optimization: sort by largest area first
    const sorted = items.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    // Calculate material usage (simplified)
    const totalArea = sorted.reduce((sum, item) => sum + (item.width * item.height) * item.quantity, 0);
    const sheetArea = 96 * 48; // 4x8 sheet in inches
    const sheets = Math.ceil(totalArea / sheetArea);
    const waste = (sheets * sheetArea) - totalArea;
    const efficiency = (totalArea / (sheets * sheetArea)) * 100;

    materialUsage[materialId] = {
      sheets,
      waste,
      efficiency
    };

    optimized.push(...sorted);
  });

  return {
    optimized,
    materialUsage
  };
}

/**
 * Validate cabinet dimensions for manufacturing constraints
 */
export function validateCabinetDimensions(cabinet: Cabinet): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check minimum dimensions
  if (cabinet.dimensions.width < 9) {
    errors.push('Cabinet width must be at least 9 inches');
  }

  if (cabinet.dimensions.depth < 12) {
    errors.push('Cabinet depth must be at least 12 inches');
  }

  if (cabinet.dimensions.height < 12) {
    errors.push('Cabinet height must be at least 12 inches');
  }

  // Check maximum dimensions
  if (cabinet.dimensions.width > 48) {
    warnings.push('Cabinet width over 48 inches may require special construction');
  }

  if (cabinet.dimensions.depth > 24) {
    warnings.push('Cabinet depth over 24 inches may require special construction');
  }

  // Check type-specific constraints
  if (cabinet.type === 'base' && cabinet.dimensions.height !== 34.5) {
    warnings.push('Base cabinet height should typically be 34.5 inches');
  }

  if (cabinet.type === 'wall' && cabinet.dimensions.depth > 15) {
    warnings.push('Wall cabinet depth over 15 inches may require special mounting');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
