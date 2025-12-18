/**
 * CAD-Quality Cabinet Wireframe Generator
 * Generates professional architectural-grade wireframe views with full detail
 * - Top view (plan) with internal components
 * - Front elevation with full overlay doors
 * - 3D isometric with construction details
 * - Section cuts showing joinery
 */

import {
  BaseCabinet,
  WireframeGeometry,
  Line3D,
  Point3D,
  DimensionLine,
  Annotation,
  CabinetDrawing,
  WireframeView,
} from '@/types/cabinet.types';

/**
 * Generate complete cabinet drawing with all views
 */
export function generateCabinetDrawing(
  cabinet: BaseCabinet,
  showInternals: boolean = true
): CabinetDrawing {
  return {
    topView: generateTopView(cabinet, showInternals),
    elevationView: generateElevationView(cabinet, showInternals),
    isoView: generateIsometricView(cabinet, showInternals),
  };
}

/**
 * Generate top view (looking down)
 */
function generateTopView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  // Outer perimeter
  lines.push(
    { start: { x: 0, y: 0, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: dims.width, y: 0, z: 0 }, end: { x: dims.width, y: dims.depth, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: dims.width, y: dims.depth, z: 0 }, end: { x: 0, y: dims.depth, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: 0, y: dims.depth, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 2 }
  );

  if (showInternals) {
    // Left side panel
    lines.push(
      { start: { x: t, y: 0, z: 0 }, end: { x: t, y: dims.depth, z: 0 }, style: 'solid', weight: 1 }
    );

    // Right side panel
    lines.push(
      { start: { x: dims.width - t, y: 0, z: 0 }, end: { x: dims.width - t, y: dims.depth, z: 0 }, style: 'solid', weight: 1 }
    );

    // Back panel (dashed line at back - 0.75" from edge)
    const backPosition = dims.depth - 0.75;
    lines.push(
      { start: { x: t, y: backPosition, z: 0 }, end: { x: dims.width - t, y: backPosition, z: 0 }, style: 'dashed', weight: 1 }
    );

    // Adjustable shelf (if present)
    if (cabinet.components.adjustableShelf) {
      const shelfY = dims.depth / 2; // Show shelf at mid-depth
      lines.push(
        { start: { x: t + 0.125, y: 0, z: 0 }, end: { x: dims.width - t - 0.125, y: 0, z: 0 }, style: 'dashed', weight: 1, color: '#888' }
      );
    }

    // Shelf pin hole locations (show 4 corner positions)
    const holePositions = [
      { x: 2 + t, y: 2, label: 'Shelf Pin' },
      { x: dims.width - t - 2, y: 2, label: 'Shelf Pin' },
      { x: 2 + t, y: dims.depth - 2, label: 'Shelf Pin' },
      { x: dims.width - t - 2, y: dims.depth - 2, label: 'Shelf Pin' },
    ];

    holePositions.forEach(pos => {
      annotations.push({
        position: { x: pos.x, y: pos.y, z: 0 },
        text: '○',
        fontSize: 8,
      });
    });
  }

  // Dimensions
  dimensions.push(
    // Overall width
    {
      start: { x: 0, y: dims.depth + 2, z: 0 },
      end: { x: dims.width, y: dims.depth + 2, z: 0 },
      value: dims.width,
      unit: 'inches',
      label: `${dims.width}"`,
      offset: 2,
    },
    // Overall depth
    {
      start: { x: dims.width + 2, y: 0, z: 0 },
      end: { x: dims.width + 2, y: dims.depth, z: 0 },
      value: dims.depth,
      unit: 'inches',
      label: `${dims.depth}"`,
      offset: 2,
    }
  );

  if (showInternals) {
    // Internal width
    dimensions.push({
      start: { x: t, y: dims.depth / 2 - 0.5, z: 0 },
      end: { x: dims.width - t, y: dims.depth / 2 - 0.5, z: 0 },
      value: dims.width - (2 * t),
      unit: 'inches',
      label: `${(dims.width - (2 * t)).toFixed(2)}"`,
      offset: -1,
    });
  }

  annotations.push({
    position: { x: dims.width / 2, y: dims.depth / 2, z: 0 },
    text: 'TOP VIEW',
    fontSize: 12,
  });

  return { lines, dimensions, annotations };
}

/**
 * Generate elevation view (front view)
 */
function generateElevationView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  // Outer perimeter of cabinet box
  lines.push(
    { start: { x: 0, y: 0, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: dims.width, y: 0, z: 0 }, end: { x: dims.width, y: dims.height, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: dims.width, y: dims.height, z: 0 }, end: { x: 0, y: dims.height, z: 0 }, style: 'solid', weight: 2 },
    { start: { x: 0, y: dims.height, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 2 }
  );

  // Toe kick
  lines.push(
    { start: { x: 0, y: -dims.toeKickHeight, z: 0 }, end: { x: dims.width, y: -dims.toeKickHeight, z: 0 }, style: 'solid', weight: 1 },
    { start: { x: 0, y: -dims.toeKickHeight, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 1 },
    { start: { x: dims.width, y: -dims.toeKickHeight, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 1 }
  );

  if (showInternals) {
    // Side panels
    lines.push(
      { start: { x: t, y: 0, z: 0 }, end: { x: t, y: dims.height, z: 0 }, style: 'solid', weight: 1 },
      { start: { x: dims.width - t, y: 0, z: 0 }, end: { x: dims.width - t, y: dims.height, z: 0 }, style: 'solid', weight: 1 }
    );

    // Bottom panel
    lines.push(
      { start: { x: t, y: 0.375, z: 0 }, end: { x: dims.width - t, y: 0.375, z: 0 }, style: 'solid', weight: 1 }
    );

    // Top stretcher
    lines.push(
      { start: { x: t, y: dims.height - 3, z: 0 }, end: { x: dims.width - t, y: dims.height - 3, z: 0 }, style: 'dashed', weight: 1 }
    );

    // Adjustable shelf (show at mid-height)
    if (cabinet.components.adjustableShelf) {
      const shelfHeight = dims.height / 2;
      lines.push(
        { start: { x: t + 0.125, y: shelfHeight, z: 0 }, end: { x: dims.width - t - 0.125, y: shelfHeight, z: 0 }, style: 'dashed', weight: 1, color: '#888' }
      );
      
      annotations.push({
        position: { x: dims.width + 3, y: shelfHeight, z: 0 },
        text: 'Adj. Shelf',
        fontSize: 8,
        leader: true,
      });
    }

    // Shelf pin holes (show vertical pattern on sides)
    const startY = 3;
    const spacing = 32 / 25.4; // 32mm in inches
    const holeCount = Math.floor((dims.height - 6) / spacing);
    
    for (let i = 0; i <= 3; i++) { // Show first few holes
      const y = startY + (i * spacing);
      annotations.push(
        { position: { x: 2, y, z: 0 }, text: '○', fontSize: 6 },
        { position: { x: dims.width - 2, y, z: 0 }, text: '○', fontSize: 6 }
      );
    }

    annotations.push({
      position: { x: 2, y: startY + (1.5 * spacing), z: 0 },
      text: `32mm (${spacing.toFixed(2)}") spacing`,
      fontSize: 7,
      leader: true,
    });
  }

  // Door outline (full overlay - shown in front of cabinet)
  const doorOverlay = 0.75;
  lines.push(
    { start: { x: -doorOverlay, y: -doorOverlay, z: 1 }, end: { x: dims.width + doorOverlay, y: -doorOverlay, z: 1 }, style: 'dashed', weight: 2, color: '#0066cc' },
    { start: { x: dims.width + doorOverlay, y: -doorOverlay, z: 1 }, end: { x: dims.width + doorOverlay, y: dims.height + doorOverlay, z: 1 }, style: 'dashed', weight: 2, color: '#0066cc' },
    { start: { x: dims.width + doorOverlay, y: dims.height + doorOverlay, z: 1 }, end: { x: -doorOverlay, y: dims.height + doorOverlay, z: 1 }, style: 'dashed', weight: 2, color: '#0066cc' },
    { start: { x: -doorOverlay, y: dims.height + doorOverlay, z: 1 }, end: { x: -doorOverlay, y: -doorOverlay, z: 1 }, style: 'dashed', weight: 2, color: '#0066cc' }
  );

  // Dimensions
  dimensions.push(
    // Overall width
    {
      start: { x: 0, y: dims.height + 3, z: 0 },
      end: { x: dims.width, y: dims.height + 3, z: 0 },
      value: dims.width,
      unit: 'inches',
      label: `${dims.width}"`,
      offset: 3,
    },
    // Box height
    {
      start: { x: dims.width + 3, y: 0, z: 0 },
      end: { x: dims.width + 3, y: dims.height, z: 0 },
      value: dims.height,
      unit: 'inches',
      label: `${dims.height}"`,
      offset: 3,
    },
    // Toe kick height
    {
      start: { x: dims.width + 3, y: -dims.toeKickHeight, z: 0 },
      end: { x: dims.width + 3, y: 0, z: 0 },
      value: dims.toeKickHeight,
      unit: 'inches',
      label: `${dims.toeKickHeight}"`,
      offset: 3,
    },
    // Total height
    {
      start: { x: dims.width + 6, y: -dims.toeKickHeight, z: 0 },
      end: { x: dims.width + 6, y: dims.height, z: 0 },
      value: dims.totalHeight,
      unit: 'inches',
      label: `${dims.totalHeight}" TOTAL`,
      offset: 6,
    }
  );

  annotations.push(
    {
      position: { x: dims.width / 2, y: dims.height + 6, z: 0 },
      text: 'FRONT ELEVATION',
      fontSize: 12,
    },
    {
      position: { x: dims.width / 2, y: -dims.toeKickHeight / 2, z: 0 },
      text: 'TOE KICK',
      fontSize: 8,
    }
  );

  return { lines, dimensions, annotations };
}

/**
 * Generate 3D isometric view
 */
function generateIsometricView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  // Isometric projection angles (30 degrees)
  const isoX = (x: number, y: number) => x * Math.cos(Math.PI / 6) - y * Math.cos(Math.PI / 6);
  const isoY = (x: number, y: number, z: number) => x * Math.sin(Math.PI / 6) + y * Math.sin(Math.PI / 6) - z;

  const project = (x: number, y: number, z: number): Point3D => ({
    x: isoX(x, y),
    y: isoY(x, y, z),
    z: 0,
  });

  // Bottom rectangle
  const p1 = project(0, 0, 0);
  const p2 = project(dims.width, 0, 0);
  const p3 = project(dims.width, dims.depth, 0);
  const p4 = project(0, dims.depth, 0);

  // Top rectangle
  const p5 = project(0, 0, dims.height);
  const p6 = project(dims.width, 0, dims.height);
  const p7 = project(dims.width, dims.depth, dims.height);
  const p8 = project(0, dims.depth, dims.height);

  // Draw outer box edges
  lines.push(
    // Bottom
    { start: p1, end: p2, style: 'solid', weight: 2 },
    { start: p2, end: p3, style: 'solid', weight: 2 },
    { start: p3, end: p4, style: 'solid', weight: 2 },
    { start: p4, end: p1, style: 'solid', weight: 2 },
    // Top
    { start: p5, end: p6, style: 'solid', weight: 2 },
    { start: p6, end: p7, style: 'solid', weight: 2 },
    { start: p7, end: p8, style: 'solid', weight: 2 },
    { start: p8, end: p5, style: 'solid', weight: 2 },
    // Vertical edges
    { start: p1, end: p5, style: 'solid', weight: 2 },
    { start: p2, end: p6, style: 'solid', weight: 2 },
    { start: p3, end: p7, style: 'solid', weight: 2 },
    { start: p4, end: p8, style: 'solid', weight: 2 }
  );

  if (showInternals) {
    // Left side panel
    const ls1 = project(t, 0, 0);
    const ls2 = project(t, dims.depth, 0);
    const ls3 = project(t, dims.depth, dims.height);
    const ls4 = project(t, 0, dims.height);
    lines.push(
      { start: ls1, end: ls2, style: 'solid', weight: 1 },
      { start: ls2, end: ls3, style: 'solid', weight: 1 },
      { start: ls3, end: ls4, style: 'solid', weight: 1 },
      { start: ls4, end: ls1, style: 'solid', weight: 1 }
    );

    // Right side panel
    const rs1 = project(dims.width - t, 0, 0);
    const rs2 = project(dims.width - t, dims.depth, 0);
    const rs3 = project(dims.width - t, dims.depth, dims.height);
    const rs4 = project(dims.width - t, 0, dims.height);
    lines.push(
      { start: rs1, end: rs2, style: 'solid', weight: 1 },
      { start: rs2, end: rs3, style: 'solid', weight: 1 },
      { start: rs3, end: rs4, style: 'solid', weight: 1 },
      { start: rs4, end: rs1, style: 'solid', weight: 1 }
    );

    // Bottom panel
    const b1 = project(t, 0, 0.375);
    const b2 = project(dims.width - t, 0, 0.375);
    const b3 = project(dims.width - t, dims.depth - 0.75, 0.375);
    const b4 = project(t, dims.depth - 0.75, 0.375);
    lines.push(
      { start: b1, end: b2, style: 'dashed', weight: 1 },
      { start: b2, end: b3, style: 'dashed', weight: 1 },
      { start: b3, end: b4, style: 'dashed', weight: 1 },
      { start: b4, end: b1, style: 'dashed', weight: 1 }
    );

    // Adjustable shelf
    if (cabinet.components.adjustableShelf) {
      const shelfZ = dims.height / 2;
      const s1 = project(t + 0.125, 0, shelfZ);
      const s2 = project(dims.width - t - 0.125, 0, shelfZ);
      const s3 = project(dims.width - t - 0.125, dims.depth - 0.75, shelfZ);
      const s4 = project(t + 0.125, dims.depth - 0.75, shelfZ);
      lines.push(
        { start: s1, end: s2, style: 'dashed', weight: 1, color: '#888' },
        { start: s2, end: s3, style: 'dashed', weight: 1, color: '#888' },
        { start: s3, end: s4, style: 'dashed', weight: 1, color: '#888' },
        { start: s4, end: s1, style: 'dashed', weight: 1, color: '#888' }
      );
    }

    // Back panel
    const back1 = project(t, dims.depth - 0.75, 0.375);
    const back2 = project(dims.width - t, dims.depth - 0.75, 0.375);
    const back3 = project(dims.width - t, dims.depth - 0.75, dims.height);
    const back4 = project(t, dims.depth - 0.75, dims.height);
    lines.push(
      { start: back1, end: back2, style: 'dashed', weight: 1 },
      { start: back2, end: back3, style: 'dashed', weight: 1 },
      { start: back3, end: back4, style: 'dashed', weight: 1 },
      { start: back4, end: back1, style: 'dashed', weight: 1 }
    );
  }

  // Toe kick (simplified front view)
  const tk1 = project(0, 0, -dims.toeKickHeight);
  const tk2 = project(dims.width, 0, -dims.toeKickHeight);
  lines.push(
    { start: tk1, end: tk2, style: 'solid', weight: 1 },
    { start: tk1, end: p1, style: 'solid', weight: 1 },
    { start: tk2, end: p2, style: 'solid', weight: 1 }
  );

  annotations.push({
    position: project(dims.width / 2, dims.depth / 2, dims.height + 5),
    text: '3D ISOMETRIC VIEW',
    fontSize: 12,
  });

  return { lines, dimensions, annotations };
}

/**
 * Export drawing to SVG
 */
export function exportToSVG(
  geometry: WireframeGeometry,
  width: number = 800,
  height: number = 600,
  viewBox?: string
): string {
  const vb = viewBox || `0 0 ${width} ${height}`;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${vb}">\n`;
  svg += `  <rect width="100%" height="100%" fill="white"/>\n`;
  svg += `  <g transform="translate(${width/2}, ${height/2}) scale(10)">\n`;
  
  // Draw lines
  geometry.lines.forEach(line => {
    const strokeWidth = (line.weight || 1) / 10;
    const strokeDasharray = line.style === 'dashed' ? '2,2' : 'none';
    const stroke = line.color || '#000000';
    
    svg += `    <line x1="${line.start.x}" y1="${-line.start.y}" x2="${line.end.x}" y2="${-line.end.y}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}"/>\n`;
  });
  
  // Draw dimensions
  geometry.dimensions.forEach(dim => {
    const offset = dim.offset || 0;
    const midX = (dim.start.x + dim.end.x) / 2;
    const midY = -(dim.start.y + dim.end.y) / 2 + offset;
    
    svg += `    <text x="${midX}" y="${midY}" font-size="1" text-anchor="middle" fill="#0066cc">${dim.label}</text>\n`;
  });
  
  // Draw annotations
  geometry.annotations.forEach(ann => {
    const fontSize = (ann.fontSize || 10) / 10;
    svg += `    <text x="${ann.position.x}" y="${-ann.position.y}" font-size="${fontSize}" text-anchor="middle">${ann.text}</text>\n`;
  });
  
  svg += `  </g>\n`;
  svg += `</svg>`;
  
  return svg;
}
