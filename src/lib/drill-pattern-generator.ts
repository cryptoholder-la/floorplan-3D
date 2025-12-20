import { 
  DrillPattern, 
  DrillPatternHole, 
  GridDrillPattern, 
  LinearDrillPattern, 
  CircularDrillPattern,
  CustomDrillPattern 
} from './cnc-types';

export function generateGridPattern(
  name: string,
  rows: number,
  columns: number,
  spacingX: number,
  spacingY: number,
  startX: number,
  startY: number,
  diameter: number,
  depth: number,
  holeType: 'through' | 'blind' | 'countersink' = 'blind'
): GridDrillPattern {
  const holes: DrillPatternHole[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      holes.push({
        id: `hole-${row}-${col}`,
        x: startX + (col * spacingX),
        y: startY + (row * spacingY),
        diameter,
        depth,
        type: holeType,
      });
    }
  }
  
  return {
    id: `grid-${Date.now()}`,
    name,
    type: 'grid',
    rows,
    columns,
    spacingX,
    spacingY,
    startX,
    startY,
    holes,
  };
}

export function generateLinearPattern(
  name: string,
  count: number,
  spacing: number,
  startX: number,
  startY: number,
  direction: 'horizontal' | 'vertical',
  diameter: number,
  depth: number,
  holeType: 'through' | 'blind' | 'countersink' = 'blind'
): LinearDrillPattern {
  const holes: DrillPatternHole[] = [];
  
  for (let i = 0; i < count; i++) {
    const x = direction === 'horizontal' ? startX + (i * spacing) : startX;
    const y = direction === 'vertical' ? startY + (i * spacing) : startY;
    
    holes.push({
      id: `hole-${i}`,
      x,
      y,
      diameter,
      depth,
      type: holeType,
    });
  }
  
  return {
    id: `linear-${Date.now()}`,
    name,
    type: 'linear',
    count,
    spacing,
    startX,
    startY,
    direction,
    holes,
  };
}

export function generateCircularPattern(
  name: string,
  count: number,
  radius: number,
  centerX: number,
  centerY: number,
  startAngle: number,
  diameter: number,
  depth: number,
  holeType: 'through' | 'blind' | 'countersink' = 'blind'
): CircularDrillPattern {
  const holes: DrillPatternHole[] = [];
  const angleStep = (2 * Math.PI) / count;
  
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (i * angleStep);
    const x = centerX + (radius * Math.cos(angle));
    const y = centerY + (radius * Math.sin(angle));
    
    holes.push({
      id: `hole-${i}`,
      x,
      y,
      diameter,
      depth,
      type: holeType,
    });
  }
  
  return {
    id: `circular-${Date.now()}`,
    name,
    type: 'circular',
    count,
    radius,
    centerX,
    centerY,
    startAngle,
    holes,
  };
}

export function createCustomPattern(
  name: string,
  holes: DrillPatternHole[]
): CustomDrillPattern {
  return {
    id: `custom-${Date.now()}`,
    name,
    type: 'custom',
    holes,
  };
}

export function duplicatePattern(pattern: DrillPattern): DrillPattern {
  const timestamp = Date.now();
  const duplicatedHoles = pattern.holes.map((hole, index) => ({
    ...hole,
    id: `${hole.id}-dup-${timestamp}-${index}`,
  }));

  return {
    ...pattern,
    id: `${pattern.id}-dup-${timestamp}`,
    name: `${pattern.name} Copy`,
    holes: duplicatedHoles,
  };
}

export function addHoleToPattern(
  pattern: DrillPattern,
  x: number,
  y: number,
  diameter: number,
  depth: number,
  holeType: 'through' | 'blind' | 'countersink' = 'blind'
): DrillPattern {
  const newHole: DrillPatternHole = {
    id: `hole-${Date.now()}`,
    x,
    y,
    diameter,
    depth,
    type: holeType,
  };
  
  return {
    ...pattern,
    holes: [...pattern.holes, newHole],
  };
}

export function removeHoleFromPattern(
  pattern: DrillPattern,
  holeId: string
): DrillPattern {
  return {
    ...pattern,
    holes: pattern.holes.filter(h => h.id !== holeId),
  };
}

export function updateHoleInPattern(
  pattern: DrillPattern,
  holeId: string,
  updates: Partial<Omit<DrillPatternHole, 'id'>>
): DrillPattern {
  return {
    ...pattern,
    holes: pattern.holes.map(h => 
      h.id === holeId ? { ...h, ...updates } : h
    ),
  };
}

export function mirrorPatternHorizontal(
  pattern: DrillPattern,
  mirrorX: number
): DrillPattern {
  const mirroredHoles = pattern.holes.map(hole => ({
    ...hole,
    id: `${hole.id}-mirrored`,
    x: 2 * mirrorX - hole.x,
  }));
  
  return {
    ...pattern,
    id: `${pattern.id}-mirrored`,
    name: `${pattern.name} (Mirrored)`,
    holes: [...pattern.holes, ...mirroredHoles],
  };
}

export function mirrorPatternVertical(
  pattern: DrillPattern,
  mirrorY: number
): DrillPattern {
  const mirroredHoles = pattern.holes.map(hole => ({
    ...hole,
    id: `${hole.id}-mirrored`,
    y: 2 * mirrorY - hole.y,
  }));
  
  return {
    ...pattern,
    id: `${pattern.id}-mirrored`,
    name: `${pattern.name} (Mirrored)`,
    holes: [...pattern.holes, ...mirroredHoles],
  };
}

export function validatePattern(
  pattern: DrillPattern,
  partWidth: number,
  partHeight: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const hole of pattern.holes) {
    if (hole.x < 0 || hole.x > partWidth) {
      errors.push(`Hole ${hole.id} X position (${hole.x}) is outside part bounds (0-${partWidth})`);
    }
    
    if (hole.y < 0 || hole.y > partHeight) {
      errors.push(`Hole ${hole.id} Y position (${hole.y}) is outside part bounds (0-${partHeight})`);
    }
    
    if (hole.diameter <= 0) {
      errors.push(`Hole ${hole.id} diameter must be positive`);
    }
    
    if (hole.depth <= 0) {
      errors.push(`Hole ${hole.id} depth must be positive`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
