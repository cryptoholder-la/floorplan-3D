import { CabinetPart, ToolpathCommand, Toolpath, CNCMachine, CNCHole, CNCPocket, CNCCut, Material } from './cnc-types';
import { Cabinet } from './floorplan-types';

const DEFAULT_MACHINE: CNCMachine = {
  id: 'default',
  name: 'Default CNC Router',
  workAreaWidth: 2440,
  workAreaDepth: 1220,
  workAreaHeight: 150,
  spindleSpeed: 18000,
  feedRate: 3000,
  plungeRate: 1000,
  toolDiameter: 6.35,
};

export function generateCabinetParts(cabinet: Cabinet, material: Material): CabinetPart[] {
  const parts: CabinetPart[] = [];
  const { width, depth, height, type } = cabinet;
  const thickness = material.thickness;

  const interiorWidth = width - (2 * thickness);
  const interiorDepth = depth - thickness;
  const interiorHeight = height - (2 * thickness);

  parts.push({
    id: `${cabinet.id}-left`,
    cabinetId: cabinet.id,
    name: `${type} Cabinet - Left Side`,
    type: 'side',
    width: depth,
    height: height,
    thickness,
    quantity: 1,
    material,
    edges: { top: true, bottom: true, left: false, right: true },
    holes: generateShelfPinHoles(depth - 50, height, 32),
  });

  parts.push({
    id: `${cabinet.id}-right`,
    cabinetId: cabinet.id,
    name: `${type} Cabinet - Right Side`,
    type: 'side',
    width: depth,
    height: height,
    thickness,
    quantity: 1,
    material,
    edges: { top: true, bottom: true, left: true, right: false },
    holes: generateShelfPinHoles(depth - 50, height, 32),
  });

  parts.push({
    id: `${cabinet.id}-top`,
    cabinetId: cabinet.id,
    name: `${type} Cabinet - Top`,
    type: 'top',
    width: interiorWidth,
    height: depth,
    thickness,
    quantity: 1,
    material,
    edges: { top: true, bottom: false, left: true, right: true },
  });

  parts.push({
    id: `${cabinet.id}-bottom`,
    cabinetId: cabinet.id,
    name: `${type} Cabinet - Bottom`,
    type: 'bottom',
    width: interiorWidth,
    height: depth,
    thickness,
    quantity: 1,
    material,
    edges: { top: false, bottom: true, left: true, right: true },
  });

  parts.push({
    id: `${cabinet.id}-back`,
    cabinetId: cabinet.id,
    name: `${type} Cabinet - Back Panel`,
    type: 'back',
    width: interiorWidth,
    height: interiorHeight,
    thickness: 6,
    quantity: 1,
    material,
    edges: { top: false, bottom: false, left: false, right: false },
  });

  if (type === 'base' || type === 'wall') {
    const doorWidth = (interiorWidth / 2) - 2;
    parts.push({
      id: `${cabinet.id}-door-left`,
      cabinetId: cabinet.id,
      name: `${type} Cabinet - Left Door`,
      type: 'door',
      width: doorWidth,
      height: interiorHeight,
      thickness,
      quantity: 1,
      material,
      edges: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(doorWidth, interiorHeight),
    });

    parts.push({
      id: `${cabinet.id}-door-right`,
      cabinetId: cabinet.id,
      name: `${type} Cabinet - Right Door`,
      type: 'door',
      width: doorWidth,
      height: interiorHeight,
      thickness,
      quantity: 1,
      material,
      edges: { top: true, bottom: true, left: true, right: true },
      holes: generateHingeHoles(doorWidth, interiorHeight),
    });
  }

  const shelfCount = type === 'tall' ? 4 : type === 'wall' ? 2 : 1;
  for (let i = 0; i < shelfCount; i++) {
    parts.push({
      id: `${cabinet.id}-shelf-${i}`,
      cabinetId: cabinet.id,
      name: `${type} Cabinet - Shelf ${i + 1}`,
      type: 'shelf',
      width: interiorWidth - 4,
      height: depth - 50,
      thickness,
      quantity: 1,
      material,
      edges: { top: false, bottom: false, left: true, right: true },
    });
  }

  return parts;
}

function generateShelfPinHoles(depth: number, height: number, spacing: number): CNCHole[] {
  const holes: CNCHole[] = [];
  const startY = 100;
  const rows = Math.floor((height - 200) / spacing);
  
  for (let i = 0; i <= rows; i++) {
    const y = startY + (i * spacing);
    holes.push({
      id: `hole-front-${i}`,
      x: 37,
      y,
      diameter: 5,
      depth: 12,
      type: 'blind',
    });
    holes.push({
      id: `hole-back-${i}`,
      x: depth - 37,
      y,
      diameter: 5,
      depth: 12,
      type: 'blind',
    });
  }
  
  return holes;
}

function generateHingeHoles(width: number, height: number): CNCHole[] {
  return [
    { id: 'hinge-top', x: 10, y: 100, diameter: 35, depth: 12.5, type: 'blind' },
    { id: 'hinge-bottom', x: 10, y: height - 100, diameter: 35, depth: 12.5, type: 'blind' },
  ];
}

export function generateToolpath(part: CabinetPart, machine: CNCMachine = DEFAULT_MACHINE): Toolpath {
  const commands: ToolpathCommand[] = [];
  const safeHeight = 5;
  
  commands.push({ type: 'spindle_on', spindleSpeed: machine.spindleSpeed });
  commands.push({ type: 'move', x: 0, y: 0, z: safeHeight });

  commands.push(...generateOutlineToolpath(part, machine, safeHeight));
  
  if (part.holes && part.holes.length > 0) {
    commands.push(...generateHolesToolpath(part.holes, machine, safeHeight));
  }
  
  if (part.pockets && part.pockets.length > 0) {
    commands.push(...generatePocketsToolpath(part.pockets, machine, safeHeight));
  }

  commands.push({ type: 'move', x: 0, y: 0, z: safeHeight });
  commands.push({ type: 'spindle_off' });

  const gcode = generateGCode(commands, machine);
  const estimatedTime = calculateEstimatedTime(commands, machine);

  return {
    id: `toolpath-${part.id}`,
    partId: part.id,
    commands,
    estimatedTime,
    gcode,
  };
}

function generateOutlineToolpath(
  part: CabinetPart,
  machine: CNCMachine,
  safeHeight: number
): ToolpathCommand[] {
  const commands: ToolpathCommand[] = [];
  const { width, height, thickness } = part;
  const toolRadius = machine.toolDiameter / 2;
  const offset = toolRadius;

  commands.push({ type: 'move', x: -offset, y: -offset, z: safeHeight });
  commands.push({ type: 'linear', x: -offset, y: -offset, z: -thickness, feedRate: machine.plungeRate });
  
  commands.push({ type: 'linear', x: width + offset, y: -offset, z: -thickness, feedRate: machine.feedRate });
  commands.push({ type: 'linear', x: width + offset, y: height + offset, z: -thickness, feedRate: machine.feedRate });
  commands.push({ type: 'linear', x: -offset, y: height + offset, z: -thickness, feedRate: machine.feedRate });
  commands.push({ type: 'linear', x: -offset, y: -offset, z: -thickness, feedRate: machine.feedRate });
  
  commands.push({ type: 'move', x: -offset, y: -offset, z: safeHeight });
  
  return commands;
}

function generateHolesToolpath(
  holes: CNCHole[],
  machine: CNCMachine,
  safeHeight: number
): ToolpathCommand[] {
  const commands: ToolpathCommand[] = [];
  
  for (const hole of holes) {
    commands.push({ type: 'move', x: hole.x, y: hole.y, z: safeHeight });
    commands.push({ type: 'drill', x: hole.x, y: hole.y, z: -hole.depth, feedRate: machine.plungeRate });
    commands.push({ type: 'move', x: hole.x, y: hole.y, z: safeHeight });
  }
  
  return commands;
}

function generatePocketsToolpath(
  pockets: CNCPocket[],
  machine: CNCMachine,
  safeHeight: number
): ToolpathCommand[] {
  const commands: ToolpathCommand[] = [];
  
  for (const pocket of pockets) {
    const stepOver = machine.toolDiameter * 0.4;
    const passes = Math.ceil(pocket.width / stepOver);
    
    for (let i = 0; i < passes; i++) {
      const y = pocket.y + (i * stepOver);
      commands.push({ type: 'move', x: pocket.x, y, z: safeHeight });
      commands.push({ type: 'linear', x: pocket.x, y, z: -pocket.depth, feedRate: machine.plungeRate });
      commands.push({ type: 'linear', x: pocket.x + pocket.width, y, z: -pocket.depth, feedRate: machine.feedRate });
      commands.push({ type: 'move', x: pocket.x + pocket.width, y, z: safeHeight });
    }
  }
  
  return commands;
}

function generateGCode(commands: ToolpathCommand[], machine: CNCMachine): string {
  const lines: string[] = [];
  
  lines.push('G21 ; Set units to millimeters');
  lines.push('G90 ; Absolute positioning');
  lines.push('G17 ; XY plane selection');
  lines.push('');
  
  for (const cmd of commands) {
    switch (cmd.type) {
      case 'spindle_on':
        lines.push(`M3 S${cmd.spindleSpeed || machine.spindleSpeed} ; Spindle on`);
        lines.push('G4 P2 ; Dwell 2 seconds');
        break;
      case 'spindle_off':
        lines.push('M5 ; Spindle off');
        break;
      case 'move':
        lines.push(`G0 X${cmd.x?.toFixed(3)} Y${cmd.y?.toFixed(3)} Z${cmd.z?.toFixed(3)} ; Rapid move`);
        break;
      case 'linear':
        lines.push(`G1 X${cmd.x?.toFixed(3)} Y${cmd.y?.toFixed(3)} Z${cmd.z?.toFixed(3)} F${cmd.feedRate || machine.feedRate} ; Linear cut`);
        break;
      case 'drill':
        lines.push(`G1 Z${cmd.z?.toFixed(3)} F${cmd.feedRate || machine.plungeRate} ; Drill`);
        break;
      case 'arc':
        const gCmd = cmd.clockwise ? 'G2' : 'G3';
        lines.push(`${gCmd} X${cmd.x?.toFixed(3)} Y${cmd.y?.toFixed(3)} I${cmd.i?.toFixed(3)} J${cmd.j?.toFixed(3)} F${cmd.feedRate || machine.feedRate} ; Arc`);
        break;
    }
  }
  
  lines.push('');
  lines.push('G0 Z10 ; Move to safe height');
  lines.push('G0 X0 Y0 ; Return to origin');
  lines.push('M30 ; Program end');
  
  return lines.join('\n');
}

function calculateEstimatedTime(commands: ToolpathCommand[], machine: CNCMachine): number {
  let totalTime = 0;
  let lastX = 0, lastY = 0, lastZ = 0;
  
  for (const cmd of commands) {
    if (cmd.x !== undefined && cmd.y !== undefined && cmd.z !== undefined) {
      const distance = Math.sqrt(
        Math.pow(cmd.x - lastX, 2) +
        Math.pow(cmd.y - lastY, 2) +
        Math.pow(cmd.z - lastZ, 2)
      );
      
      const feedRate = cmd.feedRate || machine.feedRate;
      totalTime += (distance / feedRate) * 60;
      
      lastX = cmd.x;
      lastY = cmd.y;
      lastZ = cmd.z;
    }
  }
  
  totalTime += 3;
  
  return totalTime;
}

export function generateCutList(parts: CabinetPart[]) {
  const cutList = new Map<string, any>();
  
  for (const part of parts) {
    const key = `${part.width}x${part.height}x${part.thickness}-${part.material.name}`;
    
    if (cutList.has(key)) {
      const existing = cutList.get(key);
      existing.quantity += part.quantity;
      existing.parts.push(part.name);
    } else {
      cutList.set(key, {
        partName: part.name,
        width: part.width,
        height: part.height,
        thickness: part.thickness,
        quantity: part.quantity,
        material: part.material.name,
        edgeBanding: getEdgeBandingDescription(part.edges),
        parts: [part.name],
      });
    }
  }
  
  return Array.from(cutList.values());
}

function getEdgeBandingDescription(edges: { top: boolean; bottom: boolean; left: boolean; right: boolean }): string {
  const bands: string[] = [];
  if (edges.top) bands.push('Top');
  if (edges.bottom) bands.push('Bottom');
  if (edges.left) bands.push('Left');
  if (edges.right) bands.push('Right');
  return bands.length > 0 ? bands.join(', ') : 'None';
}
