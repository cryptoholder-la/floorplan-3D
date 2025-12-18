import {
  GCodeProgram,
  GCodeOperation,
  CNCOperation,
  ManufacturingJob,
  Point3D,
} from '@/types/manufacturing.types';

export function generateGCode(job: ManufacturingJob): GCodeProgram {
  const header = generateHeader(job);
  const operations = job.operations.map(op => generateOperation(op));
  const footer = generateFooter();

  return {
    id: `gcode-${job.id}`,
    jobId: job.id,
    componentName: job.componentName,
    header,
    operations,
    footer,
    estimatedTime: job.totalTime,
  };
}

function generateHeader(job: ManufacturingJob): string[] {
  return [
    `(Generated G-Code for ${job.componentName})`,
    `(Material: ${job.material} - ${job.thickness}" thick)`,
    `(Dimensions: ${job.width}" W x ${job.height}" H)`,
    `(Total Operations: ${job.operations.length})`,
    `(Estimated Time: ${Math.ceil(job.totalTime)} minutes)`,
    `(Date: ${new Date().toISOString()})`,
    '',
    'G21 (Metric units)',
    'G90 (Absolute positioning)',
    'G94 (Feed rate per minute)',
    'G17 (XY plane selection)',
    '',
    'G28 G91 Z0 (Home Z axis)',
    'G28 G91 X0 Y0 (Home XY axes)',
    'G90 (Return to absolute positioning)',
    '',
    'M3 S0 (Spindle on, wait for speed)',
    'G4 P2 (Dwell 2 seconds)',
    '',
  ];
}

function generateFooter(): string[] {
  return [
    '',
    '(End of program)',
    'M5 (Spindle off)',
    'G28 G91 Z0 (Home Z)',
    'G28 G91 X0 Y0 (Home XY)',
    'M30 (Program end and reset)',
  ];
}

function generateOperation(operation: CNCOperation): GCodeOperation {
  const lines: string[] = [];

  lines.push('');
  lines.push(`(Operation: ${operation.name})`);
  lines.push(`(Tool: ${operation.tool.name})`);
  lines.push(`(Diameter: ${operation.tool.diameter}mm)`);

  const toolComment = `T${getToolNumber(operation.tool.id)} (${operation.tool.name})`;
  lines.push(toolComment);
  lines.push('M6 (Tool change)');
  lines.push(`M3 S${operation.tool.rpm} (Spindle on at ${operation.tool.rpm} RPM)`);
  lines.push('G4 P1 (Dwell 1 second)');
  lines.push('');

  if (operation.type === 'drill') {
    lines.push(...generateDrillGCode(operation));
  } else if (operation.type === 'route' || operation.type === 'contour') {
    lines.push(...generateRouteGCode(operation));
  } else if (operation.type === 'pocket') {
    lines.push(...generatePocketGCode(operation));
  }

  return {
    type: operation.type,
    lines,
    tool: operation.tool,
    comment: operation.name,
  };
}

function generateDrillGCode(operation: CNCOperation): string[] {
  const lines: string[] = [];
  const { x, y, z } = operation.startPoint;
  const feedRate = operation.tool.plungeRate;
  const depth = operation.depth;

  lines.push(`G0 X${x.toFixed(3)} Y${y.toFixed(3)} (Rapid to position)`);
  lines.push('G0 Z5.0 (Rapid to safe height)');
  lines.push('G0 Z2.0 (Rapid to just above surface)');
  lines.push(`G1 Z${(-depth).toFixed(3)} F${feedRate} (Plunge to depth)`);
  lines.push('G4 P0.5 (Dwell at depth)');
  lines.push('G0 Z5.0 (Retract to safe height)');
  lines.push('');

  return lines;
}

function generateRouteGCode(operation: CNCOperation): string[] {
  const lines: string[] = [];

  if (!operation.path || operation.path.length === 0) {
    return lines;
  }

  const feedRate = operation.tool.feedRate;
  const plungeRate = operation.tool.plungeRate;
  const passes = operation.passes || 1;
  const depthPerPass = operation.depth / passes;

  const firstPoint = operation.path[0];
  lines.push(`G0 X${firstPoint.x.toFixed(3)} Y${firstPoint.y.toFixed(3)} (Move to start)`);
  lines.push('G0 Z5.0 (Safe height)');
  lines.push('G0 Z2.0 (Approach surface)');

  for (let pass = 1; pass <= passes; pass++) {
    const currentDepth = depthPerPass * pass;
    lines.push('');
    lines.push(`(Pass ${pass} of ${passes} - Depth: ${currentDepth.toFixed(3)}mm)`);
    
    lines.push(`G1 Z${(-currentDepth).toFixed(3)} F${plungeRate} (Plunge)`);

    for (let i = 1; i < operation.path.length; i++) {
      const point = operation.path[i];
      lines.push(`G1 X${point.x.toFixed(3)} Y${point.y.toFixed(3)} F${feedRate}`);
    }

    if (pass < passes) {
      lines.push('G0 Z2.0 (Retract between passes)');
      lines.push(`G0 X${firstPoint.x.toFixed(3)} Y${firstPoint.y.toFixed(3)} (Return to start)`);
    }
  }

  lines.push('G0 Z5.0 (Retract to safe height)');
  lines.push('');

  return lines;
}

function generatePocketGCode(operation: CNCOperation): string[] {
  const lines: string[] = [];

  if (!operation.path || operation.path.length === 0) {
    return lines;
  }

  const feedRate = operation.tool.feedRate;
  const plungeRate = operation.tool.plungeRate;
  const passes = operation.passes || 1;
  const depthPerPass = operation.depth / passes;
  const stepOver = operation.tool.diameter * 0.4;

  lines.push('(Pocket clearing operation)');
  lines.push(`(Step over: ${stepOver.toFixed(3)}mm)`);

  const bounds = calculateBounds(operation.path);
  const firstPoint = operation.path[0];

  lines.push(`G0 X${firstPoint.x.toFixed(3)} Y${firstPoint.y.toFixed(3)} (Move to start)`);
  lines.push('G0 Z5.0 (Safe height)');

  for (let pass = 1; pass <= passes; pass++) {
    const currentDepth = depthPerPass * pass;
    lines.push('');
    lines.push(`(Pass ${pass} of ${passes} - Depth: ${currentDepth.toFixed(3)}mm)`);
    
    let currentY = bounds.minY + stepOver;
    let direction = 1;

    while (currentY <= bounds.maxY - stepOver) {
      if (direction === 1) {
        lines.push(`G1 X${bounds.minX.toFixed(3)} Y${currentY.toFixed(3)} F${feedRate}`);
        lines.push(`G1 X${bounds.maxX.toFixed(3)} Y${currentY.toFixed(3)} F${feedRate}`);
      } else {
        lines.push(`G1 X${bounds.maxX.toFixed(3)} Y${currentY.toFixed(3)} F${feedRate}`);
        lines.push(`G1 X${bounds.minX.toFixed(3)} Y${currentY.toFixed(3)} F${feedRate}`);
      }
      
      currentY += stepOver;
      direction *= -1;
    }
  }

  lines.push('G0 Z5.0 (Retract to safe height)');
  lines.push('');

  return lines;
}

function calculateBounds(path: Point3D[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  path.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });

  return { minX, maxX, minY, maxY };
}

function getToolNumber(toolId: string): number {
  const toolMap: Record<string, number> = {
    'drill-5mm': 1,
    'bore-35mm': 2,
    'router-3-8': 3,
    'router-flush-trim': 4,
    'router-1-4': 5,
  };

  return toolMap[toolId] || 99;
}

export function exportGCodeToFile(program: GCodeProgram): string {
  const allLines: string[] = [
    ...program.header,
  ];

  program.operations.forEach(op => {
    allLines.push(...op.lines);
  });

  allLines.push(...program.footer);

  return allLines.join('\n');
}

export function generateGCodeForAllJobs(jobs: ManufacturingJob[]): GCodeProgram[] {
  return jobs.map(job => generateGCode(job));
}

export function downloadGCode(program: GCodeProgram): void {
  const content = exportGCodeToFile(program);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${program.componentName.replace(/\s+/g, '_')}.nc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
