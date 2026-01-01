// Drill Patterns Library for Floorplan 3D

import { DrillPattern, PatternCategory, PatternType, Point2D, DrillHole, DrillSettings } from '@/types/cnc.types';

// Pattern ID type
export type PatternId = string;

// Available pattern categories
export const PATTERN_CATEGORIES = {
  'cabinet-hardware': {
    name: 'Cabinet Hardware',
    description: 'Patterns for cabinet hinges, handles, and fittings'
  },
  'shelf-holes': {
    name: 'Shelf Support Holes',
    description: 'Adjustable shelf pin and support hole patterns'
  },
  'handle-mounts': {
    name: 'Handle Mounts',
    description: 'Mounting patterns for cabinet handles and knobs'
  },
  'hinge-plates': {
    name: 'Hinge Plates',
    description: 'European and traditional hinge mounting patterns'
  },
  'drawer-slides': {
    name: 'Drawer Slides',
    description: 'Mounting patterns for drawer slides and guides'
  },
  'assembly': {
    name: 'Assembly',
    description: 'Hole patterns for cabinet assembly and construction'
  },
  'custom': {
    name: 'Custom',
    description: 'User-defined and specialized patterns'
  }
} as const;

// Standard drill patterns
export const AVAILABLE_PATTERNS: Record<PatternId, DrillPattern> = {
  // Shelf pin patterns
  'shelf-pins-32mm': {
    id: 'shelf-pins-32mm',
    name: '32mm Shelf Pin Pattern',
    description: 'Standard 32mm spaced shelf pin holes',
    category: 'shelf-holes',
    type: 'linear',
    points: [],
    holes: [],
    spacing: { x: 32, y: 32 },
    patternSize: { width: 600, height: 800 },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      peckDepth: 5,
      coolant: 'off'
    },
    tags: ['shelf', 'adjustable', '32mm'],
    difficulty: 'beginner',
    estimatedTime: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'shelf-pins-25mm': {
    id: 'shelf-pins-25mm',
    name: '25mm Shelf Pin Pattern',
    description: '25mm spaced shelf pin holes for tighter spacing',
    category: 'shelf-holes',
    type: 'linear',
    points: [],
    holes: [],
    spacing: { x: 25, y: 25 },
    patternSize: { width: 500, height: 700 },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      peckDepth: 5,
      coolant: 'off'
    },
    tags: ['shelf', 'adjustable', '25mm'],
    difficulty: 'beginner',
    estimatedTime: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // European hinge patterns
  'hinge-european-35mm': {
    id: 'hinge-european-35mm',
    name: 'European Hinge 35mm',
    description: 'Standard 35mm European concealed hinge mounting',
    category: 'hinge-plates',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 50, height: 80 },
    drillSettings: {
      spindleSpeed: 2500,
      feedRate: 250,
      peckDepth: 8,
      coolant: 'mist'
    },
    tags: ['hinge', 'european', 'concealed', '35mm'],
    difficulty: 'intermediate',
    estimatedTime: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'hinge-european-26mm': {
    id: 'hinge-european-26mm',
    name: 'European Hinge 26mm',
    description: '26mm European hinge for smaller doors',
    category: 'hinge-plates',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 40, height: 60 },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      peckDepth: 6,
      coolant: 'mist'
    },
    tags: ['hinge', 'european', 'concealed', '26mm'],
    difficulty: 'intermediate',
    estimatedTime: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Handle mounting patterns
  'handle-bar-128mm': {
    id: 'handle-bar-128mm',
    name: 'Bar Handle 128mm',
    description: 'Standard 128mm bar handle mounting pattern',
    category: 'handle-mounts',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 128, y: 0 },
    patternSize: { width: 150, height: 30 },
    drillSettings: {
      spindleSpeed: 3500,
      feedRate: 400,
      peckDepth: 8,
      coolant: 'off'
    },
    tags: ['handle', 'bar', '128mm', 'mounting'],
    difficulty: 'beginner',
    estimatedTime: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'handle-knob-standard': {
    id: 'handle-knob-standard',
    name: 'Standard Knob Mount',
    description: 'Single knob mounting pattern',
    category: 'handle-mounts',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 20, height: 20 },
    drillSettings: {
      spindleSpeed: 3500,
      feedRate: 400,
      peckDepth: 6,
      coolant: 'off'
    },
    tags: ['handle', 'knob', 'single'],
    difficulty: 'beginner',
    estimatedTime: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Drawer slide patterns
  'drawer-slide-side-mount': {
    id: 'drawer-slide-side-mount',
    name: 'Side Mount Drawer Slide',
    description: 'Standard side mount drawer slide pattern',
    category: 'drawer-slides',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 32 },
    patternSize: { width: 30, height: 400 },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 350,
      peckDepth: 10,
      coolant: 'mist'
    },
    tags: ['drawer', 'slide', 'side-mount'],
    difficulty: 'intermediate',
    estimatedTime: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'drawer-slide-bottom-mount': {
    id: 'drawer-slide-bottom-mount',
    name: 'Bottom Mount Drawer Slide',
    description: 'Bottom mount drawer slide pattern',
    category: 'drawer-slides',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 60, height: 30 },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 350,
      peckDepth: 8,
      coolant: 'mist'
    },
    tags: ['drawer', 'slide', 'bottom-mount'],
    difficulty: 'intermediate',
    estimatedTime: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Assembly patterns
  'assembly-dowel-8mm': {
    id: 'assembly-dowel-8mm',
    name: '8mm Dowel Assembly',
    description: '8mm dowel hole pattern for cabinet assembly',
    category: 'assembly',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 40, height: 40 },
    drillSettings: {
      spindleSpeed: 2500,
      feedRate: 200,
      peckDepth: 12,
      coolant: 'mist'
    },
    tags: ['assembly', 'dowel', '8mm', 'construction'],
    difficulty: 'intermediate',
    estimatedTime: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'assembly-confirmat-screw': {
    id: 'assembly-confirmat-screw',
    name: 'Confirmat Screw Pattern',
    description: 'Confirmat screw pattern for panel assembly',
    category: 'assembly',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 30, height: 30 },
    drillSettings: {
      spindleSpeed: 2000,
      feedRate: 150,
      peckDepth: 15,
      coolant: 'mist'
    },
    tags: ['assembly', 'confirmat', 'screw', 'panel'],
    difficulty: 'advanced',
    estimatedTime: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Specialized patterns
  'kitchen-sink-mount': {
    id: 'kitchen-sink-mount',
    name: 'Kitchen Sink Mount',
    description: 'Standard undermount kitchen sink mounting pattern',
    category: 'cabinet-hardware',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 0, y: 0 },
    patternSize: { width: 800, height: 600 },
    drillSettings: {
      spindleSpeed: 2500,
      feedRate: 300,
      peckDepth: 15,
      coolant: 'mist'
    },
    tags: ['sink', 'kitchen', 'undermount', 'mounting'],
    difficulty: 'advanced',
    estimatedTime: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  'countertop-fastener': {
    id: 'countertop-fastener',
    name: 'Countertop Fastener Pattern',
    description: 'Countertop to cabinet fastening pattern',
    category: 'cabinet-hardware',
    type: 'custom',
    points: [],
    holes: [],
    spacing: { x: 200, y: 150 },
    patternSize: { width: 1000, height: 600 },
    drillSettings: {
      spindleSpeed: 2000,
      feedRate: 250,
      peckDepth: 20,
      coolant: 'mist'
    },
    tags: ['countertop', 'fastener', 'mounting'],
    difficulty: 'intermediate',
    estimatedTime: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

/**
 * Generate CNC drill pattern for a specific pattern ID
 */
export function generateCNCPattern(patternId: PatternId): DrillPattern {
  const pattern = AVAILABLE_PATTERNS[patternId];
  
  if (!pattern) {
    throw new Error(`Pattern not found: ${patternId}`);
  }
  
  // Generate actual hole positions based on pattern type and parameters
  const generatedPattern = generateHolePositions(pattern);
  
  return {
    ...pattern,
    holes: generatedPattern.holes,
    points: generatedPattern.points
  };
}

/**
 * Generate hole positions for a pattern
 */
function generateHolePositions(pattern: DrillPattern): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  switch (pattern.type) {
    case 'linear':
      return generateLinearPattern(pattern);
    case 'grid':
      return generateGridPattern(pattern);
    case 'circular':
      return generateCircularPattern(pattern);
    case 'custom':
      return generateCustomPattern(pattern);
    default:
      return { holes: [], points: [] };
  }
}

/**
 * Generate linear pattern (shelf pins, etc.)
 */
function generateLinearPattern(pattern: DrillPattern): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  const spacing = pattern.spacing.x || pattern.spacing.y;
  const numHolesX = Math.floor(pattern.patternSize.width / spacing);
  const numHolesY = Math.floor(pattern.patternSize.height / spacing);
  
  // Generate vertical line of holes
  for (let i = 0; i < numHolesY; i++) {
    const y = 25 + (i * spacing); // 25mm edge offset
    const x = 25; // Left edge
    
    const hole: DrillHole = {
      id: `hole-${i}`,
      position: { x, y },
      diameter: 5, // 5mm shelf pin
      depth: 15,
      tolerance: {
        diameter: { nominal: 5, plus: 0.1, minus: 0.1 },
        depth: { nominal: 15, plus: 1, minus: 1 },
        position: { x: 0.5, y: 0.5 }
      }
    };
    
    holes.push(hole);
    points.push({ x, y });
  }
  
  return { holes, points };
}

/**
 * Generate grid pattern
 */
function generateGridPattern(pattern: DrillPattern): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  const spacingX = pattern.spacing.x;
  const spacingY = pattern.spacing.y;
  
  const numHolesX = Math.floor(pattern.patternSize.width / spacingX);
  const numHolesY = Math.floor(pattern.patternSize.height / spacingY);
  
  for (let x = 0; x < numHolesX; x++) {
    for (let y = 0; y < numHolesY; y++) {
      const posX = 25 + (x * spacingX);
      const posY = 25 + (y * spacingY);
      
      const hole: DrillHole = {
        id: `hole-${x}-${y}`,
        position: { x: posX, y: posY },
        diameter: 5,
        depth: 15,
        tolerance: {
          diameter: { nominal: 5, plus: 0.1, minus: 0.1 },
          depth: { nominal: 15, plus: 1, minus: 1 },
          position: { x: 0.5, y: 0.5 }
        }
      };
      
      holes.push(hole);
      points.push({ x: posX, y: posY });
    }
  }
  
  return { holes, points };
}

/**
 * Generate circular pattern
 */
function generateCircularPattern(pattern: DrillPattern): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  const centerX = pattern.patternSize.width / 2;
  const centerY = pattern.patternSize.height / 2;
  const radius = Math.min(centerX, centerY) - 25;
  
  const numHoles = 8; // Standard 8-hole circular pattern
  
  for (let i = 0; i < numHoles; i++) {
    const angle = (i / numHoles) * 2 * Math.PI;
    const x = centerX + (radius * Math.cos(angle));
    const y = centerY + (radius * Math.sin(angle));
    
    const hole: DrillHole = {
      id: `hole-${i}`,
      position: { x, y },
      diameter: 5,
      depth: 15,
      tolerance: {
        diameter: { nominal: 5, plus: 0.1, minus: 0.1 },
        depth: { nominal: 15, plus: 1, minus: 1 },
        position: { x: 0.5, y: 0.5 }
      }
    };
    
    holes.push(hole);
    points.push({ x, y });
  }
  
  return { holes, points };
}

/**
 * Generate custom pattern based on pattern ID
 */
function generateCustomPattern(pattern: DrillPattern): {
  holes: DrillHole[];
  points: Point2D[];
} {
  switch (pattern.id) {
    case 'hinge-european-35mm':
      return generateEuropeanHingePattern(35);
    case 'hinge-european-26mm':
      return generateEuropeanHingePattern(26);
    case 'handle-bar-128mm':
      return generateBarHandlePattern(128);
    case 'handle-knob-standard':
      return generateKnobPattern();
    case 'drawer-slide-side-mount':
      return generateDrawerSlidePattern('side');
    case 'drawer-slide-bottom-mount':
      return generateDrawerSlidePattern('bottom');
    case 'assembly-dowel-8mm':
      return generateDowelPattern(8);
    case 'assembly-confirmat-screw':
      return generateConfirmatPattern();
    case 'kitchen-sink-mount':
      return generateSinkMountPattern();
    case 'countertop-fastener':
      return generateCountertopPattern();
    default:
      return { holes: [], points: [] };
  }
}

/**
 * Generate European hinge pattern
 */
function generateEuropeanHingePattern(cupDiameter: number): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  // Center hole for hinge cup
  holes.push({
    id: 'hinge-cup',
    position: { x: 25, y: 25 },
    diameter: cupDiameter,
    depth: cupDiameter === 35 ? 13 : 11.5,
    tolerance: {
      diameter: { nominal: cupDiameter, plus: 0.2, minus: 0.2 },
      depth: { nominal: cupDiameter === 35 ? 13 : 11.5, plus: 0.5, minus: 0.5 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  points.push({ x: 25, y: 25 });
  
  // Mounting screw holes
  const screwOffset = cupDiameter === 35 ? 22.5 : 16;
  holes.push({
    id: 'mount-screw-1',
    position: { x: 25 + screwOffset, y: 25 },
    diameter: 3,
    depth: 12,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 12, plus: 1, minus: 1 },
      position: { x: 0.3, y: 0.3 }
    }
  });
  
  holes.push({
    id: 'mount-screw-2',
    position: { x: 25 - screwOffset, y: 25 },
    diameter: 3,
    depth: 12,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 12, plus: 1, minus: 1 },
      position: { x: 0.3, y: 0.3 }
    }
  });
  
  points.push({ x: 25 + screwOffset, y: 25 });
  points.push({ x: 25 - screwOffset, y: 25 });
  
  return { holes, points };
}

/**
 * Generate bar handle pattern
 */
function generateBarHandlePattern(length: number): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  const screwSpacing = length - 32; // 16mm from each end
  const centerX = 75; // Pattern center
  
  holes.push({
    id: 'handle-screw-1',
    position: { x: centerX - screwSpacing / 2, y: 15 },
    diameter: 3,
    depth: 10,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 10, plus: 1, minus: 1 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  holes.push({
    id: 'handle-screw-2',
    position: { x: centerX + screwSpacing / 2, y: 15 },
    diameter: 3,
    depth: 10,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 10, plus: 1, minus: 1 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  points.push({ x: centerX - screwSpacing / 2, y: 15 });
  points.push({ x: centerX + screwSpacing / 2, y: 15 });
  
  return { holes, points };
}

/**
 * Generate knob pattern
 */
function generateKnobPattern(): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  holes.push({
    id: 'knob-mount',
    position: { x: 10, y: 10 },
    diameter: 3,
    depth: 12,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 12, plus: 1, minus: 1 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  points.push({ x: 10, y: 10 });
  
  return { holes, points };
}

/**
 * Generate drawer slide pattern
 */
function generateDrawerSlidePattern(type: 'side' | 'bottom'): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  if (type === 'side') {
    // Side mount pattern - multiple holes along length
    const holePositions = [32, 96, 160, 224, 288, 352]; // Standard positions
    
    holePositions.forEach((y, index) => {
      holes.push({
        id: `slide-hole-${index}`,
        position: { x: 15, y },
        diameter: 4,
        depth: 12,
        tolerance: {
          diameter: { nominal: 4, plus: 0.1, minus: 0.1 },
          depth: { nominal: 12, plus: 1, minus: 1 },
          position: { x: 0.3, y: 0.3 }
        }
      });
      
      points.push({ x: 15, y });
    });
  } else {
    // Bottom mount pattern - 4 holes in rectangle
    const holePositions = [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 10, y: 20 },
      { x: 50, y: 20 }
    ];
    
    holePositions.forEach((pos, index) => {
      holes.push({
        id: `slide-hole-${index}`,
        position: pos,
        diameter: 4,
        depth: 10,
        tolerance: {
          diameter: { nominal: 4, plus: 0.1, minus: 0.1 },
          depth: { nominal: 10, plus: 1, minus: 1 },
          position: { x: 0.3, y: 0.3 }
        }
      });
      
      points.push(pos);
    });
  }
  
  return { holes, points };
}

/**
 * Generate dowel pattern
 */
function generateDowelPattern(dowelDiameter: number): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  // Four corner dowel holes
  const positions = [
    { x: 10, y: 10 },
    { x: 30, y: 10 },
    { x: 10, y: 30 },
    { x: 30, y: 30 }
  ];
  
  positions.forEach((pos, index) => {
    holes.push({
      id: `dowel-${index}`,
      position: pos,
      diameter: dowelDiameter,
      depth: dowelDiameter * 2,
      tolerance: {
        diameter: { nominal: dowelDiameter, plus: 0.1, minus: 0.1 },
        depth: { nominal: dowelDiameter * 2, plus: 1, minus: 1 },
        position: { x: 0.2, y: 0.2 }
      }
    });
    
    points.push(pos);
  });
  
  return { holes, points };
}

/**
 * Generate confirmat screw pattern
 */
function generateConfirmatPattern(): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  // Confirmat screw requires counterbore and through hole
  holes.push({
    id: 'confirmat-main',
    position: { x: 15, y: 15 },
    diameter: 7, // Counterbore diameter
    depth: 12,
    tolerance: {
      diameter: { nominal: 7, plus: 0.2, minus: 0.2 },
      depth: { nominal: 12, plus: 1, minus: 1 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  holes.push({
    id: 'confirmat-pilot',
    position: { x: 15, y: 15 },
    diameter: 3, // Pilot hole
    depth: 25,
    tolerance: {
      diameter: { nominal: 3, plus: 0.1, minus: 0.1 },
      depth: { nominal: 25, plus: 2, minus: 2 },
      position: { x: 0.2, y: 0.2 }
    }
  });
  
  points.push({ x: 15, y: 15 });
  
  return { holes, points };
}

/**
 * Generate sink mount pattern
 */
function generateSinkMountPattern(): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  // Standard undermount sink clip positions
  const clipPositions = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 100, y: 500 },
    { x: 700, y: 500 },
    { x: 400, y: 100 }, // Center front
    { x: 400, y: 500 }  // Center back
  ];
  
  clipPositions.forEach((pos, index) => {
    holes.push({
      id: `sink-clip-${index}`,
      position: pos,
      diameter: 4,
      depth: 15,
      tolerance: {
        diameter: { nominal: 4, plus: 0.1, minus: 0.1 },
        depth: { nominal: 15, plus: 2, minus: 2 },
        position: { x: 0.5, y: 0.5 }
      }
    });
    
    points.push(pos);
  });
  
  return { holes, points };
}

/**
 * Generate countertop fastener pattern
 */
function generateCountertopPattern(): {
  holes: DrillHole[];
  points: Point2D[];
} {
  const holes: DrillHole[] = [];
  const points: Point2D[] = [];
  
  // Grid of fastener points
  const spacingX = 200;
  const spacingY = 150;
  
  for (let x = 100; x <= 900; x += spacingX) {
    for (let y = 100; y <= 500; y += spacingY) {
      holes.push({
        id: `fastener-${x}-${y}`,
        position: { x, y },
        diameter: 6,
        depth: 20,
        tolerance: {
          diameter: { nominal: 6, plus: 0.2, minus: 0.2 },
          depth: { nominal: 20, plus: 2, minus: 2 },
          position: { x: 0.5, y: 0.5 }
        }
      });
      
      points.push({ x, y });
    }
  }
  
  return { holes, points };
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: PatternCategory): DrillPattern[] {
  return Object.values(AVAILABLE_PATTERNS).filter(
    pattern => pattern.category === category
  );
}

/**
 * Search patterns by tags
 */
export function searchPatternsByTags(tags: string[]): DrillPattern[] {
  return Object.values(AVAILABLE_PATTERNS).filter(pattern =>
    tags.some(tag => pattern.tags.includes(tag))
  );
}

/**
 * Create custom pattern
 */
export function createCustomPattern(
  name: string,
  category: PatternCategory,
  holes: DrillHole[],
  settings?: Partial<DrillSettings>
): DrillPattern {
  const pattern: DrillPattern = {
    id: `custom-${Date.now()}`,
    name,
    category,
    type: 'custom',
    points: holes.map(h => h.position),
    holes,
    spacing: { x: 0, y: 0 },
    patternSize: {
      width: Math.max(...holes.map(h => h.position.x)) + 50,
      height: Math.max(...holes.map(h => h.position.y)) + 50
    },
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      coolant: 'off',
      ...settings
    },
    tags: ['custom'],
    difficulty: 'intermediate',
    estimatedTime: holes.length * 2,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return pattern;
}
