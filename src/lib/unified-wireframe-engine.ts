/**
 * Unified Wireframe Rendering Engine
 * Centralized canvas drawing logic for all cabinet types
 */

import { UnifiedCabinet, CabinetType } from './unified-cabinet-generator';

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type ViewMode = 'top' | 'elevation' | '3d';

export interface WireframeDrawOptions {
  scale: number;
  offsetX: number;
  offsetY: number;
  showInternals: boolean;
  showDimensions: boolean;
  lineColor: string;
  dimensionColor: string;
  internalColor: string;
}

const DEFAULT_OPTIONS: WireframeDrawOptions = {
  scale: 8,
  offsetX: 100,
  offsetY: 100,
  showInternals: true,
  showDimensions: true,
  lineColor: '#000000',
  dimensionColor: '#0066cc',
  internalColor: '#666666',
};

export function drawWireframe(
  ctx: CanvasRenderingContext2D,
  cabinet: UnifiedCabinet,
  viewMode: ViewMode,
  options: Partial<WireframeDrawOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  switch (viewMode) {
    case 'top':
      drawTopView(ctx, cabinet, opts);
      break;
    case 'elevation':
      drawElevation(ctx, cabinet, opts);
      break;
    case '3d':
      draw3DView(ctx, cabinet, opts);
      break;
  }
}

function drawTopView(
  ctx: CanvasRenderingContext2D,
  cabinet: UnifiedCabinet,
  opts: WireframeDrawOptions
): void {
  const { scale, offsetX, offsetY, showInternals, lineColor, internalColor } = opts;
  const boxDepth = cabinet.dimensions.boxDepth || cabinet.dimensions.depth;
  const w = cabinet.dimensions.width * scale;
  const d = boxDepth * scale;
  const t = 0.75 * scale;

  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  
  ctx.strokeRect(offsetX, offsetY, w, d);

  if (showInternals) {
    ctx.strokeStyle = internalColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX + t, offsetY + t, w - 2 * t, d - 2 * t);
    
    ctx.setLineDash([5, 5]);
    const backOffset = cabinet.type === 'base' ? 0.75 * scale : 10;
    ctx.strokeRect(offsetX + t, offsetY + d - backOffset, w - 2 * t, 5);
    ctx.setLineDash([]);
  }

  ctx.fillStyle = lineColor;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${cabinet.dimensions.width}"`, offsetX + w / 2, offsetY - 10);
  ctx.textAlign = 'right';
  ctx.fillText(`${boxDepth}"`, offsetX - 10, offsetY + d / 2);

  ctx.restore();
}

function drawElevation(
  ctx: CanvasRenderingContext2D,
  cabinet: UnifiedCabinet,
  opts: WireframeDrawOptions
): void {
  const { scale, offsetX, offsetY, showInternals, lineColor, internalColor } = opts;
  const boxHeight = cabinet.type === 'tall' 
    ? cabinet.dimensions.height - (cabinet.dimensions.toeKickHeight || 0)
    : cabinet.dimensions.height;
  
  const w = cabinet.dimensions.width * scale;
  const h = boxHeight * scale;
  const overlay = 0.75 * scale;
  const t = 0.75 * scale;

  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.font = '12px sans-serif';

  ctx.strokeRect(offsetX, offsetY, w, h);

  if (cabinet.dimensions.hasTwoDoors) {
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX + w / 2, offsetY);
    ctx.lineTo(offsetX + w / 2, offsetY + h);
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = '#4444ff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(offsetX - overlay, offsetY - overlay, w + 2 * overlay, h + 2 * overlay);

  if (showInternals) {
    ctx.strokeStyle = internalColor;
    ctx.lineWidth = 1;
    
    if (cabinet.type !== 'base') {
      ctx.strokeRect(offsetX + t, offsetY + t, w - 2 * t, t);
      ctx.strokeRect(offsetX + t, offsetY + h - 2 * t, w - 2 * t, t);
    }
  }

  if (cabinet.dimensions.toeKickHeight) {
    const toeKickH = cabinet.dimensions.toeKickHeight * scale;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY + h, w, toeKickH);
  }

  ctx.fillStyle = lineColor;
  ctx.textAlign = 'center';
  ctx.fillText(`${cabinet.dimensions.width}"`, offsetX + w / 2, offsetY - 15);
  ctx.textAlign = 'right';
  ctx.fillText(`${cabinet.dimensions.height}"`, offsetX - 10, offsetY + h / 2);

  ctx.restore();
}

function draw3DView(
  ctx: CanvasRenderingContext2D,
  cabinet: UnifiedCabinet,
  opts: WireframeDrawOptions
): void {
  const { scale, offsetX, offsetY, showInternals, lineColor, internalColor } = opts;
  
  const iso = (x: number, y: number, z: number): Point2D => ({
    x: offsetX + (x - z) * scale * Math.cos(Math.PI / 6),
    y: offsetY + (x + z) * scale * Math.sin(Math.PI / 6) - y * scale,
  });

  const w = cabinet.dimensions.width;
  const boxHeight = cabinet.type === 'tall'
    ? cabinet.dimensions.height - (cabinet.dimensions.toeKickHeight || 0)
    : cabinet.dimensions.height;
  const boxDepth = cabinet.dimensions.boxDepth || cabinet.dimensions.depth;

  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  const corners = [
    iso(0, 0, 0),
    iso(w, 0, 0),
    iso(w, boxHeight, 0),
    iso(0, boxHeight, 0),
    iso(0, 0, boxDepth),
    iso(w, 0, boxDepth),
    iso(w, boxHeight, boxDepth),
    iso(0, boxHeight, boxDepth),
  ];

  drawPolygon(ctx, [corners[0], corners[1], corners[2], corners[3]], true);
  drawPolygon(ctx, [corners[4], corners[5], corners[6], corners[7]], true);
  
  [0, 1, 2, 3].forEach((i) => {
    ctx.beginPath();
    ctx.moveTo(corners[i].x, corners[i].y);
    ctx.lineTo(corners[i + 4].x, corners[i + 4].y);
    ctx.stroke();
  });

  if (showInternals) {
    ctx.strokeStyle = internalColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const t = 0.75;
    const innerCorners = [
      iso(t, t, t),
      iso(w - t, t, t),
      iso(w - t, boxHeight - t, t),
      iso(t, boxHeight - t, t),
    ];
    
    drawPolygon(ctx, innerCorners, true);
    ctx.setLineDash([]);
  }

  if (cabinet.dimensions.toeKickHeight) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    const toeH = cabinet.dimensions.toeKickHeight;
    const toeD = cabinet.dimensions.toeKickDepth || 21;
    
    const toeCorners = [
      iso(0, -toeH, 0),
      iso(w, -toeH, 0),
      iso(w, 0, 0),
      iso(0, 0, 0),
      iso(0, -toeH, toeD),
      iso(w, -toeH, toeD),
      iso(w, 0, toeD),
      iso(0, 0, toeD),
    ];
    
    drawPolygon(ctx, [toeCorners[0], toeCorners[1], toeCorners[2], toeCorners[3]], false);
    drawPolygon(ctx, [toeCorners[4], toeCorners[5], toeCorners[6], toeCorners[7]], false);
    [0, 1, 2, 3].forEach((i) => {
      ctx.beginPath();
      ctx.moveTo(toeCorners[i].x, toeCorners[i].y);
      ctx.lineTo(toeCorners[i + 4].x, toeCorners[i + 4].y);
      ctx.stroke();
    });
  }

  ctx.restore();
}

function drawPolygon(ctx: CanvasRenderingContext2D, points: Point2D[], close: boolean = false): void {
  if (points.length === 0) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  if (close) {
    ctx.closePath();
  }
  
  ctx.stroke();
}

export function exportToSVG(
  cabinet: UnifiedCabinet,
  viewMode: ViewMode,
  options: Partial<WireframeDrawOptions> = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  drawWireframe(ctx, cabinet, viewMode, opts);
  
  const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">`;
  
  const svgFooter = `</svg>`;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const svgImage = `<image width="800" height="600" href="${canvas.toDataURL()}" />`;
  
  return svgHeader + svgImage + svgFooter;
}
