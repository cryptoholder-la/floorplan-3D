// G-Code Generator Library for Floorplan 3D

import { ManufacturingJob, CutListItem } from '@/types/manufacturing.types';
import { GCodeProgram, GCodeCommand, Point3D, CNCTool } from '@/types/cnc.types';

// G-Code command constants
export const GCODE_COMMANDS = {
  // Movement commands
  RAPID_MOVE: 'G00',
  LINEAR_MOVE: 'G01',
  ARC_CW: 'G02',
  ARC_CCW: 'G03',
  
  // Plane selection
  PLANE_XY: 'G17',
  PLANE_XZ: 'G18',
  PLANE_YZ: 'G19',
  
  // Coordinate system
  ABSOLUTE: 'G90',
  RELATIVE: 'G91',
  
  // Units
  METRIC: 'G21',
  IMPERIAL: 'G20',
  
  // Tool commands
  TOOL_CHANGE: 'M06',
  SPINDLE_ON_CW: 'M03',
  SPINDLE_ON_CCW: 'M04',
  SPINDLE_OFF: 'M05',
  COOLANT_ON: 'M08',
  COOLANT_OFF: 'M09',
  
  // Program control
  PROGRAM_END: 'M30',
  PROGRAM_STOP: 'M00',
  OPTIONAL_STOP: 'M01'
};

/**
 * Generate G-Code program from manufacturing jobs
 */
export function generateGCode(jobs: ManufacturingJob[]): GCodeProgram {
  const commands: GCodeCommand[] = [];
  let lineNumber = 1;
  
  // Program header
  commands.push(createCommand(lineNumber++, '; Floorplan 3D Generated G-Code'));
  commands.push(createCommand(lineNumber++, '; Generated: ' + new Date().toISOString()));
  commands.push(createCommand(lineNumber++, '; Jobs: ' + jobs.length));
  commands.push(createCommand(lineNumber++, ''));
  
  // Initialize machine
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.METRIC));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.ABSOLUTE));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.PLANE_XY));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.COOLANT_OFF));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.SPINDLE_OFF));
  commands.push(createCommand(lineNumber++, ''));
  
  // Safety block - move to safe height
  commands.push(createCommand(lineNumber++, '; Safety block'));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { Z: 50 }));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { X: 0, Y: 0 }));
  commands.push(createCommand(lineNumber++, ''));
  
  // Process each job
  jobs.forEach((job, jobIndex) => {
    const jobCommands = generateJobCommands(job, lineNumber);
    commands.push(...jobCommands.commands);
    lineNumber = jobCommands.nextLineNumber;
    
    // Add separator between jobs
    if (jobIndex < jobs.length - 1) {
      commands.push(createCommand(lineNumber++, ''));
      commands.push(createCommand(lineNumber++, '; Job separator'));
      commands.push(createCommand(lineNumber++, ''));
    }
  });
  
  // Program footer
  commands.push(createCommand(lineNumber++, ''));
  commands.push(createCommand(lineNumber++, '; Program end'));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.COOLANT_OFF));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.SPINDLE_OFF));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { Z: 50 }));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { X: 0, Y: 0 }));
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.PROGRAM_END));
  
  // Calculate program metadata
  const estimatedRunTime = calculateRunTime(commands);
  const toolPath = generateToolPath(commands);
  const boundingBox = calculateBoundingBox(commands);
  
  return {
    id: `gcode-${Date.now()}`,
    name: 'Cabinet Manufacturing Program',
    description: `Generated program for ${jobs.length} manufacturing jobs`,
    commands,
    units: 'mm',
    absoluteMode: true,
    coolantMode: 'off',
    estimatedRunTime,
    toolPath,
    boundingBox,
    createdBy: 'Floorplan 3D',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0'
  };
}

/**
 * Generate G-Code commands for a single job
 */
function generateJobCommands(job: ManufacturingJob, startLineNumber: number): {
  commands: GCodeCommand[];
  nextLineNumber: number;
} {
  const commands: GCodeCommand[] = [];
  let lineNumber = startLineNumber;
  
  // Job header
  commands.push(createCommand(lineNumber++, `; Job: ${job.name}`));
  commands.push(createCommand(lineNumber++, `; Type: ${job.type}`));
  commands.push(createCommand(lineNumber++, `; Priority: ${job.priority}`));
  commands.push(createCommand(lineNumber++, `; Estimated time: ${job.estimatedTime} minutes`));
  commands.push(createCommand(lineNumber++, ''));
  
  // Tool change if needed
  if (job.toolRequirements.length > 0) {
    const tool = job.toolRequirements[0];
    commands.push(createCommand(lineNumber++, `; Tool: ${tool.toolName}`));
    commands.push(createCommand(lineNumber++, GCODE_COMMANDS.SPINDLE_OFF));
    commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { Z: 50 }));
    commands.push(createCommand(lineNumber++, GCODE_COMMANDS.TOOL_CHANGE, { T: 1 }));
    commands.push(createCommand(lineNumber++, ''));
  }
  
  // Set machine parameters
  commands.push(createCommand(lineNumber++, `; Machine settings`));
  if (job.machineSettings.spindleSpeed) {
    commands.push(createCommand(lineNumber++, 'S' + job.machineSettings.spindleSpeed));
  }
  if (job.machineSettings.feedRate) {
    commands.push(createCommand(lineNumber++, 'F' + job.machineSettings.feedRate));
  }
  commands.push(createCommand(lineNumber++, ''));
  
  // Generate operation-specific commands
  switch (job.type) {
    case 'drilling':
      commands.push(...generateDrillingCommands(job, lineNumber));
      break;
    case 'cutting':
      commands.push(...generateCuttingCommands(job, lineNumber));
      break;
    default:
      commands.push(createCommand(lineNumber++, `; Unsupported job type: ${job.type}`));
  }
  
  // Update line number
  lineNumber = commands[commands.length - 1].lineNumber + 1;
  
  return { commands, nextLineNumber: lineNumber };
}

/**
 * Generate drilling commands
 */
function generateDrillingCommands(job: ManufacturingJob, startLineNumber: number): GCodeCommand[] {
  const commands: GCodeCommand[] = [];
  let lineNumber = startLineNumber;
  
  commands.push(createCommand(lineNumber++, '; Drilling operations'));
  
  // Start spindle
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.SPINDLE_ON_CW));
  
  // Enable coolant if specified
  if (job.machineSettings.coolant !== 'off') {
    commands.push(createCommand(lineNumber++, GCODE_COMMANDS.COOLANT_ON));
  }
  
  // Generate drilling pattern for each cut list item
  job.cutListItems?.forEach((item, itemIndex) => {
    commands.push(createCommand(lineNumber++, `; Item ${itemIndex + 1}: ${item.partName}`));
    
    // Generate standard drilling pattern for cabinet parts
    const drillPoints = generateDrillPatternForItem(item);
    
    drillPoints.forEach((point, pointIndex) => {
      // Rapid move to position above hole
      commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { 
        X: point.x, 
        Y: point.y, 
        Z: 10 
      }));
      
      // Drill to depth
      commands.push(createCommand(lineNumber++, GCODE_COMMANDS.LINEAR_MOVE, { 
        Z: -point.z 
      }));
      
      // Retract
      commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, { 
        Z: 10 
      }));
    });
  });
  
  return commands;
}

/**
 * Generate cutting commands
 */
function generateCuttingCommands(job: ManufacturingJob, startLineNumber: number): GCodeCommand[] {
  const commands: GCodeCommand[] = [];
  let lineNumber = startLineNumber;
  
  commands.push(createCommand(lineNumber++, '; Cutting operations'));
  
  // Start spindle
  commands.push(createCommand(lineNumber++, GCODE_COMMANDS.SPINDLE_ON_CW));
  
  // Enable coolant if specified
  if (job.machineSettings.coolant !== 'off') {
    commands.push(createCommand(lineNumber++, GCODE_COMMANDS.COOLANT_ON));
  }
  
  // Generate cutting path for each cut list item
  job.cutListItems?.forEach((item, itemIndex) => {
    commands.push(createCommand(lineNumber++, `; Item ${itemIndex + 1}: ${item.partName}`));
    commands.push(createCommand(lineNumber++, `; Dimensions: ${item.width}x${item.height}x${item.thickness}`));
    
    // Generate cutting path for rectangular part
    const cuttingPath = generateCuttingPathForItem(item, job.machineSettings.depthOfCut || 3);
    
    cuttingPath.forEach((move, moveIndex) => {
      if (move.type === 'rapid') {
        commands.push(createCommand(lineNumber++, GCODE_COMMANDS.RAPID_MOVE, {
          X: move.x,
          Y: move.y,
          Z: move.z
        }));
      } else if (move.type === 'cut') {
        commands.push(createCommand(lineNumber++, GCODE_COMMANDS.LINEAR_MOVE, {
          X: move.x,
          Y: move.y,
          Z: move.z
        }));
      }
    });
  });
  
  return commands;
}

/**
 * Generate drill pattern for a cabinet item
 */
function generateDrillPatternForItem(item: CutListItem): Point3D[] {
  const points: Point3D[] = [];
  
  // Standard shelf pin holes (32mm spacing, 25mm from edges)
  const shelfPinSpacing = 32;
  const edgeOffset = 25;
  
  // Generate shelf pin holes along the height
  if (item.height > 100) { // Only for taller parts
    const numHoles = Math.floor((item.height - 2 * edgeOffset) / shelfPinSpacing);
    for (let i = 0; i < numHoles; i++) {
      const y = edgeOffset + (i * shelfPinSpacing);
      
      // Left side holes
      points.push({ x: edgeOffset, y: y, z: -15 });
      
      // Right side holes
      points.push({ x: item.width - edgeOffset, y: y, z: -15 });
    }
  }
  
  // Hinge plate holes (if this looks like a door panel)
  if (item.width > 200 && item.height > 300) {
    // Top hinge hole
    points.push({ x: item.width / 2, y: 100, z: -13 });
    
    // Bottom hinge hole
    points.push({ x: item.width / 2, y: item.height - 100, z: -13 });
  }
  
  // Handle mounting holes (centered on larger panels)
  if (item.width > 150 && item.height > 200) {
    points.push({ x: item.width / 2, y: item.height / 2, z: -10 });
  }
  
  return points;
}

/**
 * Generate cutting path for a rectangular item
 */
function generateCuttingPathForItem(item: CutListItem, cutDepth: number): CuttingMove[] {
  const moves: CuttingMove[] = [];
  const safeHeight = 10;
  const cuttingHeight = -cutDepth;
  
  // Start position (above corner)
  moves.push({ type: 'rapid', x: 0, y: 0, z: safeHeight });
  
  // Move to start cutting position
  moves.push({ type: 'rapid', x: 0, y: 0, z: cuttingHeight });
  
  // Cut the rectangle
  moves.push({ type: 'cut', x: item.width, y: 0, z: cuttingHeight });
  moves.push({ type: 'cut', x: item.width, y: item.height, z: cuttingHeight });
  moves.push({ type: 'cut', x: 0, y: item.height, z: cuttingHeight });
  moves.push({ type: 'cut', x: 0, y: 0, z: cuttingHeight });
  
  // Retract to safe height
  moves.push({ type: 'rapid', x: 0, y: 0, z: safeHeight });
  
  return moves;
}

/**
 * Create a G-Code command
 */
function createCommand(lineNumber: number, command: string, parameters?: Record<string, number>): GCodeCommand {
  return {
    lineNumber,
    command,
    parameters,
    comment: undefined
  };
}

/**
 * Calculate estimated run time from commands
 */
function calculateRunTime(commands: GCodeCommand[]): number {
  let totalTime = 0; // in seconds
  
  commands.forEach(cmd => {
    if (cmd.command === GCODE_COMMANDS.LINEAR_MOVE && cmd.parameters) {
      // Estimate time based on feed rate and distance
      const feedRate = 1000; // mm/min (default)
      const distance = calculateMoveDistance(cmd.parameters);
      totalTime += (distance / feedRate) * 60; // Convert to seconds
    } else if (cmd.command === GCODE_COMMANDS.RAPID_MOVE && cmd.parameters) {
      // Rapid moves are faster
      const distance = calculateMoveDistance(cmd.parameters);
      totalTime += (distance / 5000) * 60; // Assume 5000 mm/min rapid
    } else if (cmd.command === GCODE_COMMANDS.TOOL_CHANGE) {
      totalTime += 30; // 30 seconds for tool change
    } else if (cmd.command === GCODE_COMMANDS.SPINDLE_ON_CW) {
      totalTime += 5; // 5 seconds to start spindle
    }
  });
  
  return Math.ceil(totalTime / 60); // Convert to minutes
}

/**
 * Calculate move distance from parameters
 */
function calculateMoveDistance(parameters: Record<string, number>): number {
  let distance = 0;
  
  if (parameters.X !== undefined || parameters.Y !== undefined) {
    const x = parameters.X || 0;
    const y = parameters.Y || 0;
    distance += Math.sqrt(x * x + y * y);
  }
  
  if (parameters.Z !== undefined) {
    distance += Math.abs(parameters.Z);
  }
  
  return distance;
}

/**
 * Generate tool path from commands
 */
function generateToolPath(commands: GCodeCommand[]): Point3D[] {
  const toolPath: Point3D[] = [];
  let currentPos: Point3D = { x: 0, y: 0, z: 50 };
  
  commands.forEach(cmd => {
    if (cmd.parameters) {
      const newPos: Point3D = {
        x: cmd.parameters.X !== undefined ? cmd.parameters.X : currentPos.x,
        y: cmd.parameters.Y !== undefined ? cmd.parameters.Y : currentPos.y,
        z: cmd.parameters.Z !== undefined ? cmd.parameters.Z : currentPos.z
      };
      
      // Only add to path if it's a movement command
      if (cmd.command === GCODE_COMMANDS.RAPID_MOVE || 
          cmd.command === GCODE_COMMANDS.LINEAR_MOVE ||
          cmd.command === GCODE_COMMANDS.ARC_CW ||
          cmd.command === GCODE_COMMANDS.ARC_CCW) {
        toolPath.push({ ...newPos });
        currentPos = newPos;
      }
    }
  });
  
  return toolPath;
}

/**
 * Calculate bounding box from tool path
 */
function calculateBoundingBox(commands: GCodeCommand[]): { min: Point3D; max: Point3D } {
  const toolPath = generateToolPath(commands);
  
  if (toolPath.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 }
    };
  }
  
  const min: Point3D = { ...toolPath[0] };
  const max: Point3D = { ...toolPath[0] };
  
  toolPath.forEach(point => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    min.z = Math.min(min.z, point.z);
    
    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
    max.z = Math.max(max.z, point.z);
  });
  
  return { min, max };
}

/**
 * Download G-Code as a file
 */
export function downloadGCode(program: GCodeProgram): void {
  const gcodeContent = formatGCodeForOutput(program);
  
  const blob = new Blob([gcodeContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${program.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.nc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

/**
 * Format G-Code for output
 */
function formatGCodeForOutput(program: GCodeProgram): string {
  return program.commands.map(cmd => {
    let line = '';
    
    // Add line number (optional, some controllers don't use them)
    // line += `N${cmd.lineNumber} `;
    
    // Add command
    line += cmd.command;
    
    // Add parameters
    if (cmd.parameters) {
      Object.entries(cmd.parameters).forEach(([key, value]) => {
        line += ` ${key}${value}`;
      });
    }
    
    // Add comment
    if (cmd.comment) {
      line += ` ; ${cmd.comment}`;
    }
    
    return line;
  }).join('\n');
}

/**
 * Validate G-Code program
 */
export function validateGCode(program: GCodeProgram): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for required commands
  const hasUnitCommand = program.commands.some(cmd => 
    cmd.command === GCODE_COMMANDS.METRIC || cmd.command === GCODE_COMMANDS.IMPERIAL
  );
  
  if (!hasUnitCommand) {
    warnings.push('No unit command (G20/G21) found');
  }
  
  // Check for tool changes without spindle off
  for (let i = 0; i < program.commands.length; i++) {
    const cmd = program.commands[i];
    
    if (cmd.command === GCODE_COMMANDS.TOOL_CHANGE) {
      // Check if spindle is turned off before tool change
      let spindleOffFound = false;
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        if (program.commands[j].command === GCODE_COMMANDS.SPINDLE_OFF) {
          spindleOffFound = true;
          break;
        }
      }
      
      if (!spindleOffFound) {
        warnings.push(`Tool change at line ${cmd.lineNumber} without spindle off`);
      }
    }
  }
  
  // Check for rapid moves to negative Z (dangerous)
  program.commands.forEach(cmd => {
    if (cmd.command === GCODE_COMMANDS.RAPID_MOVE && 
        cmd.parameters && 
        cmd.parameters.Z && 
        cmd.parameters.Z < 0) {
      errors.push(`Dangerous rapid move to negative Z at line ${cmd.lineNumber}`);
    }
  });
  
  // Check for program end
  const hasProgramEnd = program.commands.some(cmd => 
    cmd.command === GCODE_COMMANDS.PROGRAM_END
  );
  
  if (!hasProgramEnd) {
    warnings.push('No program end command (M30) found');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Internal types
interface CuttingMove {
  type: 'rapid' | 'cut';
  x: number;
  y: number;
  z: number;
}
