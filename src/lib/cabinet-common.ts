/**
 * Common cabinet generation utilities
 * Consolidates shared logic across base, wall, and tall cabinets
 */

import { CabinetMaterial, HolePattern, ComponentDimensions, Groove } from '@/types/cabinet.types';

export const STANDARD_MATERIAL: CabinetMaterial = {
  thickness: 0.75,
  type: 'plywood',
};

export const SHELF_PIN_SPACING = 32 / 25.4;
export const HINGE_DIAMETER = 1.375;
export const HINGE_EDGE_OFFSET = 0.875;
export const FULL_OVERLAY = 0.75;

export function generateShelfPinHoles(
  depth: number,
  height: number,
  startFromBottom: number = 3,
  endFromTop: number = 3,
  fromFront: number = 2,
  fromBack: number = 2
): HolePattern[] {
  const holes: HolePattern[] = [];
  const availableHeight = height - startFromBottom - endFromTop;
  const holeCount = Math.floor(availableHeight / SHELF_PIN_SPACING);

  for (let i = 0; i <= holeCount; i++) {
    const y = startFromBottom + (i * SHELF_PIN_SPACING);
    holes.push({
      type: 'shelf-pin',
      x: fromFront,
      y,
      diameter: 0.197,
      depth: 0.5,
    });
    holes.push({
      type: 'shelf-pin',
      x: depth - fromBack,
      y,
      diameter: 0.197,
      depth: 0.5,
    });
  }

  return holes;
}

export function generateHingeHoles(
  height: number,
  hingeCount: 2 | 3 | 4 = 2
): HolePattern[] {
  const hinges: HolePattern[] = [];
  
  hinges.push({
    type: 'hinge',
    x: HINGE_EDGE_OFFSET,
    y: 3.5,
    diameter: HINGE_DIAMETER,
    depth: 0.5,
  });
  
  hinges.push({
    type: 'hinge',
    x: HINGE_EDGE_OFFSET,
    y: height - 3.5,
    diameter: HINGE_DIAMETER,
    depth: 0.5,
  });
  
  if (hingeCount >= 3) {
    hinges.push({
      type: 'hinge',
      x: HINGE_EDGE_OFFSET,
      y: height / 2,
      diameter: HINGE_DIAMETER,
      depth: 0.5,
    });
  }
  
  if (hingeCount === 4) {
    hinges.push({
      type: 'hinge',
      x: HINGE_EDGE_OFFSET,
      y: height / 3,
      diameter: HINGE_DIAMETER,
      depth: 0.5,
    });
    hinges.splice(2, 1);
    hinges.push({
      type: 'hinge',
      x: HINGE_EDGE_OFFSET,
      y: (height * 2) / 3,
      diameter: HINGE_DIAMETER,
      depth: 0.5,
    });
  }

  return hinges;
}

export function generateStandardGrooves(
  depth: number,
  height: number,
  thickness: number,
  hasTopDado: boolean = false
): Groove[] {
  const grooves: Groove[] = [
    {
      type: 'back-panel',
      x: depth - 0.75,
      y: 0.375,
      width: 0.25,
      depth: 0.25,
      length: height - (hasTopDado ? 1.125 : 0.375),
      orientation: 'vertical',
    },
    {
      type: 'dado',
      x: 0,
      y: 0.375,
      width: thickness,
      depth: 0.25,
      length: depth - 0.75,
      orientation: 'horizontal',
    },
  ];

  if (hasTopDado) {
    grooves.push({
      type: 'dado',
      x: 0,
      y: height - thickness - 0.375,
      width: thickness,
      depth: 0.25,
      length: depth - 0.75,
      orientation: 'horizontal',
    });
  }

  return grooves;
}

export function calculateMaterialUsage(
  components: ComponentDimensions[] | Record<string, ComponentDimensions>
): {
  plywood34: number;
  plywood14: number;
  edgeBanding: number;
} {
  let plywood34 = 0;
  let plywood14 = 0;
  let edgeBanding = 0;

  const componentArray = Array.isArray(components) 
    ? components 
    : Object.values(components);

  componentArray.forEach(component => {
    const area = (component.width * (component.height || component.depth || 0)) / 144;
    
    if (component.thickness === 0.75 || component.thickness === 0.875) {
      plywood34 += area * component.quantity;
    } else if (component.thickness === 0.25) {
      plywood14 += area * component.quantity;
    }

    if (component.edgeBanding) {
      let perimeter = 0;
      if (component.edgeBanding.top) perimeter += component.width;
      if (component.edgeBanding.bottom) perimeter += component.width;
      if (component.edgeBanding.left) perimeter += (component.height || 0);
      if (component.edgeBanding.right) perimeter += (component.height || 0);
      if (component.edgeBanding.front) perimeter += component.width;
      if (component.edgeBanding.back) perimeter += component.width;
      
      edgeBanding += (perimeter / 12) * component.quantity;
    }
  });

  return {
    plywood34: Math.ceil(plywood34 * 1.1),
    plywood14: Math.ceil(plywood14 * 1.1),
    edgeBanding: Math.ceil(edgeBanding * 1.15),
  };
}
