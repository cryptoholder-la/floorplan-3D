import {
  CNCOperation,
  DrillingPattern,
  DrillHole,
  RoutingPath,
  EdgeBandingSequence,
  ManufacturingJob,
  Point3D,
  STANDARD_TOOLS,
} from '@/types/manufacturing.types';
import { ComponentDimensions, HolePattern, Groove } from '@/types/cabinet.types';

let operationCounter = 0;

function generateOperationId(): string {
  return `op-${Date.now()}-${operationCounter++}`;
}

export function generateDrillingOperations(
  component: ComponentDimensions,
  materialThickness: number
): DrillingPattern[] {
  const patterns: DrillingPattern[] = [];

  if (!component.holes || component.holes.length === 0) {
    return patterns;
  }

  const shelfPinHoles = component.holes.filter(h => h.type === 'shelf-pin');
  if (shelfPinHoles.length > 0) {
    const holes: DrillHole[] = shelfPinHoles.flatMap(pattern => {
      const holes: DrillHole[] = [];
      const count = pattern.count || 1;
      const spacing = pattern.spacing || 32;

      for (let i = 0; i < count; i++) {
        holes.push({
          x: pattern.x,
          y: pattern.y + (i * spacing),
          z: 0,
          diameter: pattern.diameter,
          depth: pattern.depth,
          throughHole: false,
        });
      }
      return holes;
    });

    patterns.push({
      type: 'shelf-pin',
      holes,
      tool: STANDARD_TOOLS.SHELF_PIN_DRILL,
    });
  }

  const hingeHoles = component.holes.filter(h => h.type === 'hinge');
  if (hingeHoles.length > 0) {
    const holes: DrillHole[] = hingeHoles.map(pattern => ({
      x: pattern.x,
      y: pattern.y,
      z: 0,
      diameter: pattern.diameter,
      depth: pattern.depth,
      throughHole: false,
    }));

    patterns.push({
      type: 'hinge',
      holes,
      tool: STANDARD_TOOLS.HINGE_BORE_35MM,
    });
  }

  return patterns;
}

export function generateRoutingOperations(
  component: ComponentDimensions,
  materialThickness: number
): RoutingPath[] {
  const paths: RoutingPath[] = [];

  if (!component.grooves || component.grooves.length === 0) {
    return paths;
  }

  component.grooves.forEach(groove => {
    const path: Point3D[] = [];

    if (groove.type === 'dado' || groove.type === 'back-panel') {
      if (groove.orientation === 'horizontal') {
        path.push({ x: groove.x, y: groove.y, z: 0 });
        path.push({ x: groove.x + groove.length, y: groove.y, z: 0 });
      } else {
        path.push({ x: groove.x, y: groove.y, z: 0 });
        path.push({ x: groove.x, y: groove.y + groove.length, z: 0 });
      }

      const passes = Math.ceil(groove.depth / STANDARD_TOOLS.DADO_ROUTER.stepDown);

      paths.push({
        type: groove.type === 'dado' ? 'dado' : 'groove',
        path,
        tool: STANDARD_TOOLS.DADO_ROUTER,
        depth: groove.depth,
        passes,
        closed: false,
      });
    }

    if (groove.type === 'rabbet') {
      if (groove.orientation === 'horizontal') {
        path.push({ x: groove.x, y: groove.y, z: 0 });
        path.push({ x: groove.x + groove.length, y: groove.y, z: 0 });
        path.push({ x: groove.x + groove.length, y: groove.y + groove.width, z: 0 });
        path.push({ x: groove.x, y: groove.y + groove.width, z: 0 });
      } else {
        path.push({ x: groove.x, y: groove.y, z: 0 });
        path.push({ x: groove.x + groove.width, y: groove.y, z: 0 });
        path.push({ x: groove.x + groove.width, y: groove.y + groove.length, z: 0 });
        path.push({ x: groove.x, y: groove.y + groove.length, z: 0 });
      }

      const passes = Math.ceil(groove.depth / STANDARD_TOOLS.DADO_ROUTER.stepDown);

      paths.push({
        type: 'rabbet',
        path,
        tool: STANDARD_TOOLS.DADO_ROUTER,
        depth: groove.depth,
        passes,
        closed: true,
      });
    }
  });

  return paths;
}

export function generateEdgeBandingSequence(
  component: ComponentDimensions
): EdgeBandingSequence | undefined {
  if (!component.edgeBanding) {
    return undefined;
  }

  const edges: ('top' | 'bottom' | 'left' | 'right')[] = [];

  if (component.edgeBanding.top) edges.push('top');
  if (component.edgeBanding.bottom) edges.push('bottom');
  if (component.edgeBanding.left) edges.push('left');
  if (component.edgeBanding.right) edges.push('right');

  if (edges.length === 0) {
    return undefined;
  }

  return {
    edges,
    material: 'PVC',
    thickness: 0.5,
    trimRequired: true,
  };
}

export function generateContourPath(
  width: number,
  height: number,
  toolDiameter: number
): Point3D[] {
  const offset = toolDiameter / 2;
  
  return [
    { x: offset, y: offset, z: 0 },
    { x: width - offset, y: offset, z: 0 },
    { x: width - offset, y: height - offset, z: 0 },
    { x: offset, y: height - offset, z: 0 },
    { x: offset, y: offset, z: 0 },
  ];
}

export function convertDrillingToCNCOperations(
  patterns: DrillingPattern[]
): CNCOperation[] {
  const operations: CNCOperation[] = [];

  patterns.forEach(pattern => {
    pattern.holes.forEach((hole, index) => {
      operations.push({
        id: generateOperationId(),
        type: 'drill',
        tool: pattern.tool,
        startPoint: { x: hole.x, y: hole.y, z: 0 },
        depth: hole.depth,
        passes: 1,
        name: `${pattern.type} drill ${index + 1}`,
        estimatedTime: calculateDrillTime(hole.depth, pattern.tool),
      });
    });
  });

  return operations;
}

export function convertRoutingToCNCOperations(
  paths: RoutingPath[]
): CNCOperation[] {
  const operations: CNCOperation[] = [];

  paths.forEach((routingPath, pathIndex) => {
    operations.push({
      id: generateOperationId(),
      type: 'route',
      tool: routingPath.tool,
      startPoint: routingPath.path[0],
      path: routingPath.path,
      depth: routingPath.depth,
      passes: routingPath.passes,
      name: `${routingPath.type} route ${pathIndex + 1}`,
      estimatedTime: calculateRouteTime(routingPath),
    });
  });

  return operations;
}

function calculateDrillTime(depth: number, tool: typeof STANDARD_TOOLS.SHELF_PIN_DRILL): number {
  const plungeTime = (depth / tool.plungeRate) * 60;
  const retractTime = (depth / (tool.plungeRate * 2)) * 60;
  return plungeTime + retractTime + 2;
}

function calculateRouteTime(path: RoutingPath): number {
  let totalLength = 0;
  for (let i = 1; i < path.path.length; i++) {
    const dx = path.path[i].x - path.path[i - 1].x;
    const dy = path.path[i].y - path.path[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const feedTime = (totalLength / path.tool.feedRate) * 60 * path.passes;
  const plungeTime = ((path.depth / path.tool.plungeRate) * 60) * path.passes;
  
  return feedTime + plungeTime + (path.passes * 3);
}

export function generateManufacturingJob(
  component: ComponentDimensions
): ManufacturingJob {
  const drillingPatterns = generateDrillingOperations(component, component.thickness);
  const routingPaths = generateRoutingOperations(component, component.thickness);
  const edgeBanding = generateEdgeBandingSequence(component);

  const drillingOps = convertDrillingToCNCOperations(drillingPatterns);
  const routingOps = convertRoutingToCNCOperations(routingPaths);
  
  const allOperations = [...drillingOps, ...routingOps];

  const setupTime = 5;
  const machiningTime = allOperations.reduce((sum, op) => sum + (op.estimatedTime || 0), 0);
  const edgeBandingTime = edgeBanding ? (edgeBanding.edges.length * 3) : 0;
  const totalTime = setupTime + machiningTime + edgeBandingTime;

  return {
    id: `job-${component.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    componentId: component.name,
    componentName: component.name,
    material: component.material,
    thickness: component.thickness,
    width: component.width,
    height: component.height,
    operations: allOperations,
    drillingPatterns,
    routingPaths,
    edgeBanding,
    setupTime,
    machiningTime,
    totalTime,
  };
}

export function generateJobsForCabinet(components: ComponentDimensions[]): ManufacturingJob[] {
  return components
    .filter(comp => comp.thickness >= 0.5)
    .map(comp => generateManufacturingJob(comp));
}
