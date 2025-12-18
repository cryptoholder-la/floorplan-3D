/**
 * CAD-Quality Cabinet Wireframe Generator
 * Generates professional architectural-grade wireframe views with full detail
 */

import {
  BaseCabinet,
  WireframeGeometry,
  Line3D,
  Point3D,
  DimensionLine,
  Annotation,
  CabinetDrawing,
} from '@/types/cabinet.types';

/**
 * Generate complete CAD-quality cabinet drawing
 */
export function generateDetailedCabinetDrawing(
  cabinet: BaseCabinet,
  showInternals: boolean = true
): CabinetDrawing {
  return {
    topView: generateEnhancedTopView(cabinet, showInternals),
    elevationView: generateEnhancedElevationView(cabinet, showInternals),
    isoView: generateEnhancedIsometricView(cabinet, showInternals),
  };
}

/**
 * Enhanced Top View with construction details
 */
function generateEnhancedTopView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  // Outer perimeter (solid heavy line)
  lines.push(
    { start: { x: 0, y: 0, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: dims.width, y: 0, z: 0 }, end: { x: dims.width, y: dims.depth, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: dims.width, y: dims.depth, z: 0 }, end: { x: 0, y: dims.depth, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: 0, y: dims.depth, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 2.5, color: '#000' }
  );

  if (showInternals) {
    // Left side panel with dado grooves
    lines.push(
      { start: { x: t, y: 0, z: 0 }, end: { x: t, y: dims.depth, z: 0 }, style: 'solid', weight: 1.5, color: '#333' }
    );
    
    // Dado groove indicators for bottom panel (left side)
    const dadoDepth = 0.25;
    const dadoY = 0.375;
    lines.push(
      { start: { x: t, y: dadoY, z: 0 }, end: { x: t + dadoDepth, y: dadoY, z: 0 }, style: 'solid', weight: 1, color: '#666' },
      { start: { x: t, y: dadoY + t, z: 0 }, end: { x: t + dadoDepth, y: dadoY + t, z: 0 }, style: 'solid', weight: 1, color: '#666' }
    );

    // Right side panel with dado grooves
    lines.push(
      { start: { x: dims.width - t, y: 0, z: 0 }, end: { x: dims.width - t, y: dims.depth, z: 0 }, style: 'solid', weight: 1.5, color: '#333' }
    );
    
    // Dado groove indicators (right side)
    lines.push(
      { start: { x: dims.width - t - dadoDepth, y: dadoY, z: 0 }, end: { x: dims.width - t, y: dadoY, z: 0 }, style: 'solid', weight: 1, color: '#666' },
      { start: { x: dims.width - t - dadoDepth, y: dadoY + t, z: 0 }, end: { x: dims.width - t, y: dadoY + t, z: 0 }, style: 'solid', weight: 1, color: '#666' }
    );

    // Back panel dado (1/4" back in 1/4" x 3/8" dado)
    const backY = dims.depth - 0.75;
    const backDadoY = backY - 0.125;
    lines.push(
      { start: { x: t, y: backY, z: 0 }, end: { x: dims.width - t, y: backY, z: 0 }, style: 'dashed', weight: 1, color: '#888' }
    );
    
    // Back dado grooves on sides
    lines.push(
      { start: { x: t, y: backDadoY, z: 0 }, end: { x: t, y: backDadoY + 0.25, z: 0 }, style: 'solid', weight: 0.8, color: '#666' },
      { start: { x: dims.width - t, y: backDadoY, z: 0 }, end: { x: dims.width - t, y: backDadoY + 0.25, z: 0 }, style: 'solid', weight: 0.8, color: '#666' }
    );

    // Bottom panel edges
    lines.push(
      { start: { x: t, y: 0, z: 0 }, end: { x: dims.width - t, y: 0, z: 0 }, style: 'solid', weight: 1.2, color: '#333' },
      { start: { x: t, y: dims.depth - 0.75, z: 0 }, end: { x: dims.width - t, y: dims.depth - 0.75, z: 0 }, style: 'solid', weight: 1.2, color: '#333' }
    );

    // Adjustable shelf (shown in center position)
    if (cabinet.components.adjustableShelf) {
      const shelfInset = 0.125;
      const shelfBack = dims.depth - 0.75 - shelfInset;
      
      lines.push(
        { start: { x: t + shelfInset, y: shelfInset, z: 0 }, end: { x: dims.width - t - shelfInset, y: shelfInset, z: 0 }, style: 'dashed', weight: 1, color: '#0099cc' },
        { start: { x: dims.width - t - shelfInset, y: shelfInset, z: 0 }, end: { x: dims.width - t - shelfInset, y: shelfBack, z: 0 }, style: 'dashed', weight: 1, color: '#0099cc' },
        { start: { x: dims.width - t - shelfInset, y: shelfBack, z: 0 }, end: { x: t + shelfInset, y: shelfBack, z: 0 }, style: 'dashed', weight: 1, color: '#0099cc' },
        { start: { x: t + shelfInset, y: shelfBack, z: 0 }, end: { x: t + shelfInset, y: shelfInset, z: 0 }, style: 'dashed', weight: 1, color: '#0099cc' }
      );
    }

    // 32mm shelf pin hole pattern
    const pinInsetX = 1.5;
    const pinSpacing = 32 / 25.4; // 1.26"
    
    for (let row = 0; row < 6; row++) {
      const yPos = 2 + (row * pinSpacing);
      if (yPos < dims.depth - 3) {
        annotations.push(
          { position: { x: t + pinInsetX, y: yPos, z: 0 }, text: '⊕', fontSize: 5 },
          { position: { x: dims.width - t - pinInsetX, y: yPos, z: 0 }, text: '⊕', fontSize: 5 }
        );
      }
    }
    
    // Edge banding on front edges (shown in gold/tan)
    lines.push(
      { start: { x: 0, y: 0, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 3, color: '#b8860b' }
    );

    // Construction annotations
    annotations.push(
      {
        position: { x: t + 1, y: dadoY + t/2, z: 0 },
        text: 'DADO 3/8"D × 3/4"W',
        fontSize: 6,
      },
      {
        position: { x: dims.width / 2, y: backY + 1, z: 0 },
        text: '1/4" BACK PANEL',
        fontSize: 7,
      },
      {
        position: { x: t + pinInsetX + 3, y: 2 + pinSpacing/2, z: 0 },
        text: '32mm',
        fontSize: 6,
      }
    );
  }

  // Dimensions
  dimensions.push(
    {
      start: { x: 0, y: dims.depth + 2, z: 0 },
      end: { x: dims.width, y: dims.depth + 2, z: 0 },
      value: dims.width,
      unit: 'inches',
      label: `${dims.width}" WIDTH`,
      offset: 2,
    },
    {
      start: { x: dims.width + 2, y: 0, z: 0 },
      end: { x: dims.width + 2, y: dims.depth, z: 0 },
      value: dims.depth,
      unit: 'inches',
      label: `${dims.depth}" DEPTH`,
      offset: 2,
    }
  );

  if (showInternals) {
    dimensions.push({
      start: { x: t, y: -2, z: 0 },
      end: { x: dims.width - t, y: -2, z: 0 },
      value: dims.width - (2 * t),
      unit: 'inches',
      label: `${(dims.width - (2 * t)).toFixed(2)}" INT`,
      offset: -2,
    });
  }

  annotations.push({
    position: { x: dims.width / 2, y: dims.depth + 5, z: 0 },
    text: 'TOP VIEW (PLAN)',
    fontSize: 13,
  });

  return { lines, dimensions, annotations };
}

/**
 * Enhanced Elevation View with full overlay doors and hardware
 */
function generateEnhancedElevationView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  // Cabinet box perimeter
  lines.push(
    { start: { x: 0, y: 0, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: dims.width, y: 0, z: 0 }, end: { x: dims.width, y: dims.height, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: dims.width, y: dims.height, z: 0 }, end: { x: 0, y: dims.height, z: 0 }, style: 'solid', weight: 2.5, color: '#000' },
    { start: { x: 0, y: dims.height, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 2.5, color: '#000' }
  );

  // Toe kick
  lines.push(
    { start: { x: 0, y: -dims.toeKickHeight, z: 0 }, end: { x: dims.width, y: -dims.toeKickHeight, z: 0 }, style: 'solid', weight: 2, color: '#555' },
    { start: { x: 0, y: -dims.toeKickHeight, z: 0 }, end: { x: 0, y: 0, z: 0 }, style: 'solid', weight: 2, color: '#555' },
    { start: { x: dims.width, y: -dims.toeKickHeight, z: 0 }, end: { x: dims.width, y: 0, z: 0 }, style: 'solid', weight: 2, color: '#555' }
  );

  if (showInternals) {
    // Side panels
    lines.push(
      { start: { x: t, y: 0, z: 0 }, end: { x: t, y: dims.height, z: 0 }, style: 'solid', weight: 1.5, color: '#333' },
      { start: { x: dims.width - t, y: 0, z: 0 }, end: { x: dims.width - t, y: dims.height, z: 0 }, style: 'solid', weight: 1.5, color: '#333' }
    );

    // Dado grooves for bottom
    const dadoY = 0.375;
    lines.push(
      { start: { x: t - 0.15, y: dadoY, z: 0 }, end: { x: t + 0.15, y: dadoY, z: 0 }, style: 'solid', weight: 1, color: '#666' },
      { start: { x: t - 0.15, y: dadoY + t, z: 0 }, end: { x: t + 0.15, y: dadoY + t, z: 0 }, style: 'solid', weight: 1, color: '#666' },
      { start: { x: dims.width - t - 0.15, y: dadoY, z: 0 }, end: { x: dims.width - t + 0.15, y: dadoY, z: 0 }, style: 'solid', weight: 1, color: '#666' },
      { start: { x: dims.width - t - 0.15, y: dadoY + t, z: 0 }, end: { x: dims.width - t + 0.15, y: dadoY + t, z: 0 }, style: 'solid', weight: 1, color: '#666' }
    );

    // Bottom panel
    lines.push(
      { start: { x: t, y: dadoY + 0.1, z: 0 }, end: { x: dims.width - t, y: dadoY + 0.1, z: 0 }, style: 'solid', weight: 1.5, color: '#333' }
    );

    // Top stretcher
    const topStretcherY = dims.height - 3;
    lines.push(
      { start: { x: t, y: topStretcherY, z: 0 }, end: { x: dims.width - t, y: topStretcherY, z: 0 }, style: 'solid', weight: 1.2, color: '#555' }
    );

    // Back panel groove indicators
    const backGrooveTop = dims.height - 1;
    const backGrooveBottom = dadoY + t + 0.5;
    lines.push(
      { start: { x: t - 0.1, y: backGrooveBottom, z: 0 }, end: { x: t - 0.1, y: backGrooveTop, z: 0 }, style: 'dashed', weight: 0.8, color: '#999' },
      { start: { x: dims.width - t + 0.1, y: backGrooveBottom, z: 0 }, end: { x: dims.width - t + 0.1, y: backGrooveTop, z: 0 }, style: 'dashed', weight: 0.8, color: '#999' }
    );

    // Adjustable shelves (show 3 possible positions)
    if (cabinet.components.adjustableShelf) {
      const shelfYs = [dims.height * 0.35, dims.height * 0.55, dims.height * 0.75];
      shelfYs.forEach((y, i) => {
        const color = i === 1 ? '#0099cc' : '#dddddd';
        const weight = i === 1 ? 1.2 : 0.8;
        lines.push(
          { start: { x: t + 0.125, y, z: 0 }, end: { x: dims.width - t - 0.125, y, z: 0 }, style: 'dashed', weight, color }
        );
      });
      
      annotations.push({
        position: { x: dims.width + 2.5, y: shelfYs[1], z: 0 },
        text: 'ADJ',
        fontSize: 7,
      });
    }

    // 32mm shelf pin holes (vertical pattern)
    const startY = 4;
    const spacing = 32 / 25.4;
    const holeCount = Math.floor((dims.height - 8) / spacing);
    const pinX = 1.5;
    
    for (let i = 0; i < Math.min(holeCount, 12); i++) {
      const y = startY + (i * spacing);
      if (y < dims.height - 4) {
        annotations.push(
          { position: { x: t + pinX, y, z: 0 }, text: '⊕', fontSize: 5 },
          { position: { x: dims.width - t - pinX, y, z: 0 }, text: '⊕', fontSize: 5 },
          { position: { x: t + pinX + 2, y, z: 0 }, text: '⊕', fontSize: 5 },
          { position: { x: dims.width - t - pinX - 2, y, z: 0 }, text: '⊕', fontSize: 5 }
        );
      }
    }

    // 32mm spacing dimension
    dimensions.push({
      start: { x: -3, y: startY, z: 0 },
      end: { x: -3, y: startY + spacing, z: 0 },
      value: spacing,
      unit: 'mm',
      label: '32mm',
      offset: -3,
    });

    // Edge banding on front edges
    lines.push(
      { start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: dims.height, z: 0 }, style: 'solid', weight: 3.5, color: '#b8860b' },
      { start: { x: dims.width, y: 0, z: 0 }, end: { x: dims.width, y: dims.height, z: 0 }, style: 'solid', weight: 3.5, color: '#b8860b' }
    );

    // Blum 35mm hinge mounting locations
    const hingeTopY = dims.height - 3;
    const hingeBottomY = 3;
    [hingeTopY, hingeBottomY].forEach(y => {
      // Hinge cup circle
      annotations.push({
        position: { x: 0.7, y, z: 0 },
        text: '◉',
        fontSize: 9,
      });
      // Hinge mounting plate
      lines.push(
        { start: { x: 0.4, y: y - 0.6, z: 0 }, end: { x: 0.4, y: y + 0.6, z: 0 }, style: 'solid', weight: 1.2, color: '#0066cc' },
        { start: { x: 0.2, y: y, z: 0 }, end: { x: 0.6, y, z: 0 }, style: 'solid', weight: 1.2, color: '#0066cc' }
      );
    });

    annotations.push(
      {
        position: { x: 0.7, y: hingeTopY + 1.8, z: 0 },
        text: 'BLUM',
        fontSize: 6,
      },
      {
        position: { x: 0.7, y: hingeTopY + 1, z: 0 },
        text: '35mm',
        fontSize: 6,
      }
    );
  }

  // Full overlay door outline
  const doorOL = 0.75;
  
  lines.push(
    { start: { x: -doorOL, y: -doorOL, z: 1 }, end: { x: dims.width + doorOL, y: -doorOL, z: 1 }, style: 'solid', weight: 3, color: '#0066cc' },
    { start: { x: dims.width + doorOL, y: -doorOL, z: 1 }, end: { x: dims.width + doorOL, y: dims.height + doorOL, z: 1 }, style: 'solid', weight: 3, color: '#0066cc' },
    { start: { x: dims.width + doorOL, y: dims.height + doorOL, z: 1 }, end: { x: -doorOL, y: dims.height + doorOL, z: 1 }, style: 'solid', weight: 3, color: '#0066cc' },
    { start: { x: -doorOL, y: dims.height + doorOL, z: 1 }, end: { x: -doorOL, y: -doorOL, z: 1 }, style: 'solid', weight: 3, color: '#0066cc' }
  );
  
  // Door split (if two doors)
  if (dims.width > 21) {
    lines.push(
      { start: { x: dims.width / 2, y: -doorOL, z: 1 }, end: { x: dims.width / 2, y: dims.height + doorOL, z: 1 }, style: 'dashed', weight: 1.5, color: '#0066cc' }
    );
    annotations.push({
      position: { x: dims.width / 2, y: dims.height + doorOL + 2.8, z: 0 },
      text: '(2) DOORS',
      fontSize: 9,
    });
  } else {
    annotations.push({
      position: { x: dims.width / 2, y: dims.height + doorOL + 2.8, z: 0 },
      text: '(1) DOOR',
      fontSize: 9,
    });
  }

  // Dimensions
  dimensions.push(
    {
      start: { x: 0, y: dims.height + 3.5, z: 0 },
      end: { x: dims.width, y: dims.height + 3.5, z: 0 },
      value: dims.width,
      unit: 'inches',
      label: `${dims.width}"`,
      offset: 3.5,
    },
    {
      start: { x: dims.width + 3, y: 0, z: 0 },
      end: { x: dims.width + 3, y: dims.height, z: 0 },
      value: dims.height,
      unit: 'inches',
      label: `${dims.height}" BOX`,
      offset: 3,
    },
    {
      start: { x: dims.width + 3, y: -dims.toeKickHeight, z: 0 },
      end: { x: dims.width + 3, y: 0, z: 0 },
      value: dims.toeKickHeight,
      unit: 'inches',
      label: `${dims.toeKickHeight}" TK`,
      offset: 3,
    },
    {
      start: { x: dims.width + 7, y: -dims.toeKickHeight, z: 0 },
      end: { x: dims.width + 7, y: dims.height, z: 0 },
      value: dims.totalHeight,
      unit: 'inches',
      label: `${dims.totalHeight}" TOT`,
      offset: 7,
    },
    {
      start: { x: -doorOL, y: -4, z: 0 },
      end: { x: 0, y: -4, z: 0 },
      value: doorOL,
      unit: 'inches',
      label: '3/4" OL',
      offset: -4,
    }
  );

  annotations.push(
    {
      position: { x: dims.width / 2, y: dims.height + 7.5, z: 0 },
      text: 'FRONT ELEVATION - FULL OVERLAY',
      fontSize: 13,
    },
    {
      position: { x: dims.width / 2, y: -dims.toeKickHeight / 2, z: 0 },
      text: `TOE KICK ${dims.toeKickDepth}" DEEP`,
      fontSize: 8,
    }
  );

  return { lines, dimensions, annotations };
}

/**
 * Enhanced 3D Isometric View
 */
function generateEnhancedIsometricView(
  cabinet: BaseCabinet,
  showInternals: boolean
): WireframeGeometry {
  const dims = cabinet.dimensions;
  const t = cabinet.material.thickness;
  const lines: Line3D[] = [];
  const dimensions: DimensionLine[] = [];
  const annotations: Annotation[] = [];

  const iso = (x: number, y: number, z: number): Point3D => ({
    x: (x - y) * Math.cos(Math.PI / 6),
    y: (x + y) * Math.sin(Math.PI / 6) - z,
    z: 0,
  });

  // Main box corners
  const corners = [
    iso(0, 0, 0),
    iso(dims.width, 0, 0),
    iso(dims.width, dims.height, 0),
    iso(0, dims.height, 0),
    iso(0, 0, dims.depth),
    iso(dims.width, 0, dims.depth),
    iso(dims.width, dims.height, dims.depth),
    iso(0, dims.height, dims.depth),
  ];

  // Draw main cabinet box
  // Bottom face
  [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
    if (idx < arr.length - 1) {
      lines.push({ start: corners[i], end: corners[arr[idx + 1]], style: 'solid', weight: 2.5, color: '#000' });
    }
  });
  // Top face
  [4, 5, 6, 7, 4].forEach((i, idx, arr) => {
    if (idx < arr.length - 1) {
      lines.push({ start: corners[i], end: corners[arr[idx + 1]], style: 'solid', weight: 2.5, color: '#000' });
    }
  });
  // Vertical edges
  [0, 1, 2, 3].forEach(i => {
    lines.push({ start: corners[i], end: corners[i + 4], style: 'solid', weight: 2.5, color: '#000' });
  });

  if (showInternals) {
    // Left side panel
    const lsCorners = [
      iso(t, 0, 0),
      iso(t, dims.height, 0),
      iso(t, dims.height, dims.depth),
      iso(t, 0, dims.depth),
    ];
    [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
      if (idx < arr.length - 1) {
        lines.push({ start: lsCorners[i], end: lsCorners[arr[idx + 1]], style: 'solid', weight: 1.2, color: '#555' });
      }
    });

    // Right side panel
    const rsCorners = [
      iso(dims.width - t, 0, 0),
      iso(dims.width - t, dims.height, 0),
      iso(dims.width - t, dims.height, dims.depth),
      iso(dims.width - t, 0, dims.depth),
    ];
    [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
      if (idx < arr.length - 1) {
        lines.push({ start: rsCorners[i], end: rsCorners[arr[idx + 1]], style: 'solid', weight: 1.2, color: '#555' });
      }
    });

    // Bottom panel
    const bCorners = [
      iso(t, 0.375, 0),
      iso(dims.width - t, 0.375, 0),
      iso(dims.width - t, 0.375, dims.depth - 0.75),
      iso(t, 0.375, dims.depth - 0.75),
    ];
    [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
      if (idx < arr.length - 1) {
        lines.push({ start: bCorners[i], end: bCorners[arr[idx + 1]], style: 'dashed', weight: 1, color: '#666' });
      }
    });

    // Adjustable shelf
    if (cabinet.components.adjustableShelf) {
      const shelfZ = dims.height / 2;
      const sCorners = [
        iso(t + 0.125, shelfZ, 0.125),
        iso(dims.width - t - 0.125, shelfZ, 0.125),
        iso(dims.width - t - 0.125, shelfZ, dims.depth - 0.875),
        iso(t + 0.125, shelfZ, dims.depth - 0.875),
      ];
      [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
        if (idx < arr.length - 1) {
          lines.push({ start: sCorners[i], end: sCorners[arr[idx + 1]], style: 'dashed', weight: 1, color: '#0099cc' });
        }
      });
    }

    // Back panel
    const backY = dims.depth - 0.75;
    const backCorners = [
      iso(t, 0.375, backY),
      iso(dims.width - t, 0.375, backY),
      iso(dims.width - t, dims.height, backY),
      iso(t, dims.height, backY),
    ];
    [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
      if (idx < arr.length - 1) {
        lines.push({ start: backCorners[i], end: backCorners[arr[idx + 1]], style: 'dashed', weight: 0.8, color: '#999' });
      }
    });
  }

  // Toe kick
  const tkCorners = [
    iso(0, -dims.toeKickHeight, 0),
    iso(dims.width, -dims.toeKickHeight, 0),
    iso(dims.width, -dims.toeKickHeight, dims.toeKickDepth),
    iso(0, -dims.toeKickHeight, dims.toeKickDepth),
  ];
  
  [0, 1, 2, 3, 0].forEach((i, idx, arr) => {
    if (idx < arr.length - 1) {
      lines.push({ start: tkCorners[i], end: tkCorners[arr[idx + 1]], style: 'solid', weight: 1.5, color: '#666' });
    }
  });
  
  // Connect toe kick to cabinet
  lines.push(
    { start: tkCorners[0], end: corners[0], style: 'solid', weight: 1.5, color: '#666' },
    { start: tkCorners[1], end: corners[1], style: 'solid', weight: 1.5, color: '#666' }
  );

  annotations.push({
    position: iso(dims.width / 2, dims.height + 5, dims.depth / 2),
    text: '3D ISOMETRIC VIEW',
    fontSize: 13,
  });

  return { lines, dimensions, annotations };
}

export { generateEnhancedTopView, generateEnhancedElevationView, generateEnhancedIsometricView };
