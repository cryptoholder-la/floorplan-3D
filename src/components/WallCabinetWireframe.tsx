"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  generateWallCabinet,
  getAvailableWallWidths,
  getAvailableWallHeights,
  calculateWallMaterialUsage,
} from '@/lib/wall-cabinet-generator';
import { WallCabinetWidth, WallCabinetHeight, ComponentDimensions } from '@/types/cabinet.types';

type ViewMode = 'top' | 'elevation' | '3d';

interface WallCabinetWireframeProps {
  defaultWidth?: WallCabinetWidth;
  defaultHeight?: WallCabinetHeight;
}

export default function WallCabinetWireframe({
  defaultWidth = 24,
  defaultHeight = 30,
}: WallCabinetWireframeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<WallCabinetWidth>(defaultWidth);
  const [height, setHeight] = useState<WallCabinetHeight>(defaultHeight);
  const [viewMode, setViewMode] = useState<ViewMode>('elevation');
  const [showInternals, setShowInternals] = useState(true);

  const cabinet = generateWallCabinet(width, height);
  const materialUsage = calculateWallMaterialUsage(cabinet);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (viewMode === 'top') {
      drawTopView(ctx, cabinet, showInternals);
    } else if (viewMode === 'elevation') {
      drawElevation(ctx, cabinet, showInternals);
    } else {
      draw3DView(ctx, cabinet, showInternals);
    }
  }, [cabinet, viewMode, showInternals]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wall Cabinet Configurator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (inches)</Label>
              <Select value={width.toString()} onValueChange={(v) => setWidth(parseInt(v) as WallCabinetWidth)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableWallWidths().map((w) => (
                    <SelectItem key={w} value={w.toString()}>
                      {w}"
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Height (inches)</Label>
              <Select value={height.toString()} onValueChange={(v) => setHeight(parseInt(v) as WallCabinetHeight)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableWallHeights().map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h}"
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>View Mode</Label>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top View</SelectItem>
                <SelectItem value="elevation">Front Elevation</SelectItem>
                <SelectItem value="3d">3D Isometric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="internals" checked={showInternals} onCheckedChange={setShowInternals} />
            <Label htmlFor="internals">Show Internal Components</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wireframe Drawing</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border border-gray-300 rounded-lg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cabinet Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Width:</strong> {cabinet.dimensions.width}"
            </div>
            <div>
              <strong>Height:</strong> {cabinet.dimensions.height}"
            </div>
            <div>
              <strong>Box Depth:</strong> {cabinet.dimensions.boxDepth}"
            </div>
            <div>
              <strong>Total Depth:</strong> {cabinet.dimensions.depth}"
            </div>
            <div>
              <strong>Door Type:</strong> {cabinet.dimensions.hasTwoDoors ? 'Two Doors' : 'Single Door'}
            </div>
            <div>
              <strong>Door Thickness:</strong> {cabinet.dimensions.doorThickness}"
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Material Requirements</h4>
            <div className="space-y-1 text-sm">
              <div>3/4" Plywood: {materialUsage.plywood34} sq ft</div>
              <div>1/4" Plywood: {materialUsage.plywood14} sq ft</div>
              <div>Edge Banding: {materialUsage.edgeBanding} lin ft</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Cut List</h4>
            <div className="space-y-2 text-sm">
              {Object.values(cabinet.components).map((component, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                  <div className="col-span-2">{component.name}</div>
                  <div>{component.width}" × {component.height || component.depth}"</div>
                  <div>Qty: {component.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function drawTopView(ctx: CanvasRenderingContext2D, cabinet: any, showInternals: boolean) {
  const scale = 15;
  const offsetX = 100;
  const offsetY = 100;

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.font = '12px sans-serif';

  const w = cabinet.dimensions.width * scale;
  const d = cabinet.dimensions.boxDepth * scale;
  const t = 0.75 * scale;

  ctx.strokeRect(offsetX, offsetY, w, d);

  if (showInternals) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.strokeRect(offsetX + t, offsetY + t, w - 2 * t, d - 2 * t);
    
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(offsetX + t, offsetY + d - 10, w - 2 * t, 5);
    ctx.setLineDash([]);
  }

  ctx.fillStyle = '#000';
  ctx.fillText(`${cabinet.dimensions.width}"`, offsetX + w / 2 - 15, offsetY - 10);
  ctx.fillText(`${cabinet.dimensions.boxDepth}"`, offsetX - 40, offsetY + d / 2);
}

function drawElevation(ctx: CanvasRenderingContext2D, cabinet: any, showInternals: boolean) {
  const scale = 8;
  const offsetX = 100;
  const offsetY = 100;

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.font = '12px sans-serif';

  const w = cabinet.dimensions.width * scale;
  const h = cabinet.dimensions.height * scale;
  const overlay = 0.75 * scale;

  ctx.strokeRect(offsetX, offsetY, w, h);

  if (cabinet.dimensions.hasTwoDoors) {
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(offsetX + w / 2, offsetY);
    ctx.lineTo(offsetX + w / 2, offsetY + h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.strokeStyle = '#4444ff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(offsetX - overlay, offsetY - overlay, w + 2 * overlay, h + 2 * overlay);

  if (showInternals) {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    const t = 0.75 * scale;
    ctx.strokeRect(offsetX + t, offsetY + t, w - 2 * t, t);
    ctx.strokeRect(offsetX + t, offsetY + h - 2 * t, w - 2 * t, t);
  }

  ctx.fillStyle = '#000';
  ctx.fillText(`${cabinet.dimensions.width}"`, offsetX + w / 2 - 15, offsetY - 15);
  ctx.fillText(`${cabinet.dimensions.height}"`, offsetX - 40, offsetY + h / 2);
}

function draw3DView(ctx: CanvasRenderingContext2D, cabinet: any, showInternals: boolean) {
  const scale = 6;
  const offsetX = 200;
  const offsetY = 200;

  const iso = (x: number, y: number, z: number) => ({
    x: offsetX + (x - z) * scale * Math.cos(Math.PI / 6),
    y: offsetY + (x + z) * scale * Math.sin(Math.PI / 6) - y * scale,
  });

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;

  const w = cabinet.dimensions.width;
  const h = cabinet.dimensions.height;
  const d = cabinet.dimensions.boxDepth;

  const corners = [
    iso(0, 0, 0),
    iso(w, 0, 0),
    iso(w, h, 0),
    iso(0, h, 0),
    iso(0, 0, d),
    iso(w, 0, d),
    iso(w, h, d),
    iso(0, h, d),
  ];

  ctx.beginPath();
  [0, 1, 2, 3, 0].forEach((i, idx) => {
    if (idx === 0) ctx.moveTo(corners[i].x, corners[i].y);
    else ctx.lineTo(corners[i].x, corners[i].y);
  });
  ctx.stroke();

  ctx.beginPath();
  [4, 5, 6, 7, 4].forEach((i, idx) => {
    if (idx === 0) ctx.moveTo(corners[i].x, corners[i].y);
    else ctx.lineTo(corners[i].x, corners[i].y);
  });
  ctx.stroke();

  [0, 1, 2, 3].forEach((i) => {
    ctx.beginPath();
    ctx.moveTo(corners[i].x, corners[i].y);
    ctx.lineTo(corners[i + 4].x, corners[i + 4].y);
    ctx.stroke();
  });

  if (showInternals) {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const t = 0.75;
    const innerCorners = [
      iso(t, t, t),
      iso(w - t, t, t),
      iso(w - t, h - t, t),
      iso(t, h - t, t),
    ];
    
    ctx.beginPath();
    innerCorners.forEach((corner, idx) => {
      if (idx === 0) ctx.moveTo(corner.x, corner.y);
      else ctx.lineTo(corner.x, corner.y);
    });
    ctx.closePath();
    ctx.stroke();
    
    ctx.setLineDash([]);
  }
}
