import { Cabinet } from '@/lib/floorplan-types';
import { WireframeAsset, CabinetPart, CabinetAccessory } from '@/components/WireframeViewer';

export interface ConversionSettings {
  includeAccessories: boolean;
  includeHardware: boolean;
  materialDefaults: {
    panels: string;
    doors: string;
    shelves: string;
    back: string;
  };
  hardwareDefaults: {
    handles: string;
    hinges: string;
    knobs: string;
  };
}

const DEFAULT_SETTINGS: ConversionSettings = {
  includeAccessories: true,
  includeHardware: true,
  materialDefaults: {
    panels: 'Plywood',
    doors: 'Plywood',
    shelves: 'Plywood',
    back: 'MDF'
  },
  hardwareDefaults: {
    handles: 'Stainless Steel',
    hinges: 'Steel',
    knobs: 'Brushed Nickel'
  }
};

/**
 * Converts floor plan cabinet data to detailed wireframe asset format
 */
export function convertFloorplanCabinetToWireframe(
  cabinet: Cabinet,
  settings: Partial<ConversionSettings> = {}
): WireframeAsset {
  const finalSettings = { ...DEFAULT_SETTINGS, ...settings };
  
  // Generate parts based on cabinet type and dimensions
  const parts = generateCabinetParts(cabinet, finalSettings);
  
  // Generate accessories based on cabinet configuration
  const accessories = finalSettings.includeAccessories 
    ? generateCabinetAccessories(cabinet, finalSettings)
    : [];

  return {
    id: `floorplan-${cabinet.id}`,
    name: generateCabinetName(cabinet),
    path: `/assets/floorplan/cabinets/${cabinet.id}.js`,
    category: 'cabinet',
    type: 'cabinet',
    description: generateCabinetDescription(cabinet),
    geometry: 'BoxGeometry',
    material: 'WireframeMaterial',
    dimensions: {
      width: cabinet.width,
      height: cabinet.height,
      depth: cabinet.depth
    },
    parts,
    accessories,
    renderSettings: {
      opacity: 0.8,
      color: cabinet.color || '#4a5568',
      showWireframe: true,
      showSolid: false
    }
  };
}

/**
 * Generate cabinet parts based on type and dimensions
 */
function generateCabinetParts(
  cabinet: Cabinet, 
  settings: ConversionSettings
): CabinetPart[] {
  const parts: CabinetPart[] = [];
  const { width, height, depth } = cabinet;
  const thickness = 18; // Standard 18mm thickness
  
  // Side panels
  parts.push({
    id: `${cabinet.id}-left-side`,
    name: 'Left Side Panel',
    type: 'panel',
    dimensions: { width: thickness, height, thickness },
    material: settings.materialDefaults.panels,
    quantity: 1,
    position: { x: 0, y: 0, z: 0 },
    color: cabinet.color
  });

  parts.push({
    id: `${cabinet.id}-right-side`,
    name: 'Right Side Panel',
    type: 'panel',
    dimensions: { width: thickness, height, thickness },
    material: settings.materialDefaults.panels,
    quantity: 1,
    position: { x: width - thickness, y: 0, z: 0 },
    color: cabinet.color
  });

  // Bottom panel
  parts.push({
    id: `${cabinet.id}-bottom`,
    name: 'Bottom Panel',
    type: 'panel',
    dimensions: { width: width - (thickness * 2), height: thickness, thickness },
    material: settings.materialDefaults.panels,
    quantity: 1,
    position: { x: thickness, y: 0, z: 0 },
    color: cabinet.color
  });

  // Top panel (add for all cabinet types since there's no 'open' type)
  parts.push({
    id: `${cabinet.id}-top`,
    name: 'Top Panel',
    type: 'panel',
    dimensions: { width: width - (thickness * 2), height: thickness, thickness },
    material: settings.materialDefaults.panels,
    quantity: 1,
    position: { x: thickness, y: height - thickness, z: 0 },
    color: cabinet.color
  });

  // Back panel
  parts.push({
    id: `${cabinet.id}-back`,
    name: 'Back Panel',
    type: 'panel',
    dimensions: { width, height, thickness: 6 },
    material: settings.materialDefaults.back,
    quantity: 1,
    position: { x: 0, y: 0, z: 0 },
    color: '#f5f5dc'
  });

  // Add doors or drawers based on cabinet type
  if (cabinet.type === 'base' || cabinet.type === 'wall' || cabinet.type === 'tall') {
    // Add doors
    const doorCount = width > 600 ? 2 : 1;
    const doorWidth = (width - (thickness * 2) - 4) / doorCount; // 4mm gap between doors
    
    for (let i = 0; i < doorCount; i++) {
      parts.push({
        id: `${cabinet.id}-door-${i + 1}`,
        name: `Door ${i + 1}`,
        type: 'door',
        dimensions: { width: doorWidth, height: height - (thickness * 2) - 10, thickness },
        material: settings.materialDefaults.doors,
        quantity: 1,
        position: { 
          x: thickness + (i * (doorWidth + 4)), 
          y: thickness + 5, 
          z: thickness 
        },
        color: cabinet.color
      });
    }
  } else if (cabinet.type === 'db' || cabinet.type === 'sb') {
    // Add drawers
    const drawerCount = cabinet.type === 'db' ? 4 : 3; // Double bank vs single bank
    const drawerHeight = (height - thickness - 20) / drawerCount; // 20mm total spacing
    
    for (let i = 0; i < drawerCount; i++) {
      parts.push({
        id: `${cabinet.id}-drawer-${i + 1}`,
        name: `Drawer ${i + 1}`,
        type: 'drawer',
        dimensions: { width: width - (thickness * 2) - 4, height: drawerHeight - 4, thickness },
        material: settings.materialDefaults.doors,
        quantity: 1,
        position: { 
          x: thickness + 2, 
          y: thickness + 10 + (i * drawerHeight), 
          z: thickness 
        },
        color: cabinet.color
      });
    }
  }

  // Add shelves for tall cabinets
  if (cabinet.type === 'tall') {
    const shelfCount = Math.floor((height - 100) / 350); // One shelf per 350mm
    
    for (let i = 0; i < shelfCount; i++) {
      parts.push({
        id: `${cabinet.id}-shelf-${i + 1}`,
        name: `Shelf ${i + 1}`,
        type: 'shelf',
        dimensions: { width: width - (thickness * 2), height: thickness, thickness },
        material: settings.materialDefaults.shelves,
        quantity: 1,
        position: { 
          x: thickness, 
          y: 200 + (i * 350), 
          z: thickness 
        },
        color: cabinet.color
      });
    }
  }

  return parts;
}

/**
 * Generate cabinet accessories based on configuration
 */
function generateCabinetAccessories(
  cabinet: Cabinet,
  settings: ConversionSettings
): CabinetAccessory[] {
  const accessories: CabinetAccessory[] = [];
  
  if (!settings.includeHardware) return accessories;

  const { width, height, depth } = cabinet;
  
  // Add handles for doors
  if (cabinet.type === 'base' || cabinet.type === 'wall' || cabinet.type === 'tall') {
    const doorCount = width > 600 ? 2 : 1;
    const handleWidth = Math.min(200, width * 0.3);
    
    for (let i = 0; i < doorCount; i++) {
      accessories.push({
        id: `${cabinet.id}-handle-${i + 1}`,
        name: 'Door Handle',
        type: 'handle',
        position: { 
          x: (width / (doorCount + 1)) * (i + 1), 
          y: height / 2, 
          z: depth - 20 
        },
        dimensions: { width: handleWidth, height: 20, depth: 25 },
        material: settings.hardwareDefaults.handles,
        color: '#c0c0c0',
        quantity: 1
      });
    }
  }

  // Add pulls for drawers
  if (cabinet.type === 'db' || cabinet.type === 'sb') {
    const drawerCount = cabinet.type === 'db' ? 4 : 3;
    
    for (let i = 0; i < drawerCount; i++) {
      accessories.push({
        id: `${cabinet.id}-pull-${i + 1}`,
        name: 'Drawer Pull',
        type: 'pull',
        position: { 
          x: width / 2, 
          y: 50 + (i * ((height - 50) / drawerCount)), 
          z: depth - 20 
        },
        dimensions: { width: 100, height: 15, depth: 20 },
        material: settings.hardwareDefaults.handles,
        color: '#c0c0c0',
        quantity: 1
      });
    }
  }

  // Add hinges
  if (cabinet.type === 'base' || cabinet.type === 'wall' || cabinet.type === 'tall') {
    const doorCount = width > 600 ? 2 : 1;
    const hingeCount = doorCount * 2; // 2 hinges per door
    
    for (let i = 0; i < hingeCount; i++) {
      const doorIndex = Math.floor(i / 2);
      const isTopHinge = i % 2 === 0;
      
      accessories.push({
        id: `${cabinet.id}-hinge-${i + 1}`,
        name: 'Door Hinge',
        type: 'hinge',
        position: { 
          x: doorIndex === 0 ? 10 : width - 10, 
          y: isTopHinge ? 100 : height - 100, 
          z: depth - 20 
        },
        dimensions: { width: 40, height: 35, depth: 15 },
        material: settings.hardwareDefaults.hinges,
        color: '#808080',
        quantity: 1
      });
    }
  }

  return accessories;
}

/**
 * Generate cabinet name based on type and dimensions
 */
function generateCabinetName(cabinet: Cabinet): string {
  const typeNames = {
    'base': 'Base Cabinet',
    'wall': 'Wall Cabinet', 
    'tall': 'Tall Cabinet',
    'db': 'Double Bank Drawer',
    'sb': 'Single Bank Drawer',
    'lsb': 'Low Sideboard',
    'corner': 'Corner Cabinet',
    'island': 'Kitchen Island'
  };

  const baseName = typeNames[cabinet.type] || 'Cabinet';
  const dimensions = `${cabinet.width}×${cabinet.height}×${cabinet.depth}`;
  
  return `${baseName} (${dimensions}mm)`;
}

/**
 * Generate cabinet description
 */
function generateCabinetDescription(cabinet: Cabinet): string {
  const typeDescriptions = {
    'base': 'Standard kitchen base cabinet with doors and adjustable shelves',
    'wall': 'Wall-mounted cabinet ideal for storage at eye level',
    'tall': 'Full-height pantry cabinet with multiple adjustable shelves',
    'db': 'Double bank drawer unit for maximum drawer storage',
    'sb': 'Single bank drawer unit for efficient organization',
    'lsb': 'Low sideboard with combination of drawers and storage',
    'corner': 'Corner cabinet optimized for space utilization',
    'island': 'Freestanding kitchen island with comprehensive storage'
  };

  return typeDescriptions[cabinet.type] || 'Custom cabinet configuration';
}

/**
 * Convert multiple floor plan cabinets to wireframe assets
 */
export function convertFloorplanCabinetsToWireframes(
  cabinets: Cabinet[],
  settings?: Partial<ConversionSettings>
): WireframeAsset[] {
  return cabinets.map(cabinet => convertFloorplanCabinetToWireframe(cabinet, settings));
}

/**
 * Filter cabinets by type for batch conversion
 */
export function filterCabinetsByType(
  cabinets: Cabinet[], 
  types: Cabinet['type'][]
): Cabinet[] {
  return cabinets.filter(cabinet => types.includes(cabinet.type));
}
