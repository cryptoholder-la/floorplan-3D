"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { FloorPlan, Wall, Door, Window, Point, ResizeHandle } from '@/lib/floorplan-types';
import { distance, formatMeasurement, pointToLineDistance } from '@/lib/floorplan-utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface WallElevationViewProps {
  floorPlan: FloorPlan;
  onFloorPlanChange: (floorPlan: FloorPlan) => void;
  width?: number;
  height?: number;
}

export default function WallElevationView({
  floorPlan,
  onFloorPlanChange,
  width = 800,
  height = 400,
}: WallElevationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(
    floorPlan.walls.length > 0 ? floorPlan.walls[0].id : null
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [editingElement, setEditingElement] = useState<{ id: string; type: 'door' | 'window' } | null>(null);

  const scale = floorPlan.metadata?.scale || 20;
  const unit = floorPlan.metadata?.unit || 'meters';

    const selectedWall = floorPlan.walls.find(w => w.id === selectedWallId);
    const wallLength = selectedWall ? distance(selectedWall.start, selectedWall.end) : 0;
    const wallHeight = selectedWall?.height || 96;

  const getDoorsOnWall = useCallback((wallId: string) => {
    return floorPlan.doors.filter(d => d.wallId === wallId);
  }, [floorPlan.doors]);

  const getWindowsOnWall = useCallback((wallId: string) => {
    return floorPlan.windows.filter(w => w.wallId === wallId);
  }, [floorPlan.windows]);

  const worldToScreen = useCallback((worldX: number, worldY: number): Point => {
    const scaleRatio = (width - 100) / wallLength * zoom;
    return {
      x: 50 + worldX * scaleRatio + panOffset.x,
      y: height - 50 - worldY * scaleRatio + panOffset.y,
    };
  }, [width, height, wallLength, zoom, panOffset]);

  const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
    const scaleRatio = (width - 100) / wallLength * zoom;
    return {
      x: (screenX - 50 - panOffset.x) / scaleRatio,
      y: (height - 50 - screenY + panOffset.y) / scaleRatio,
    };
  }, [width, height, wallLength, zoom, panOffset]);

  const drawArrowLine = useCallback((
    ctx: CanvasRenderingContext2D, 
    x1: number, y1: number, 
    x2: number, y2: number, 
    label: string, 
    color: string = '#2196f3'
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const arrowSize = 6;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + arrowSize * Math.cos(angle + 0.4), y1 + arrowSize * Math.sin(angle + 0.4));
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + arrowSize * Math.cos(angle - 0.4), y1 + arrowSize * Math.sin(angle - 0.4));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + 0.4), y2 - arrowSize * Math.sin(angle + 0.4));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - 0.4), y2 - arrowSize * Math.sin(angle - 0.4));
    ctx.stroke();

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(midX - 25, midY - 8, 50, 16);
    ctx.fillStyle = color;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedWall) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const wallStart = worldToScreen(0, 0);
    const wallEnd = worldToScreen(wallLength, 0);
    const wallTop = worldToScreen(0, wallHeight * scale);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(wallStart.x, wallStart.y);
    ctx.lineTo(wallEnd.x, wallEnd.y);
    ctx.lineTo(worldToScreen(wallLength, wallHeight * scale).x, worldToScreen(wallLength, wallHeight * scale).y);
    ctx.lineTo(wallTop.x, wallTop.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    drawArrowLine(
      ctx,
      wallStart.x, wallStart.y + 20,
      wallEnd.x, wallEnd.y + 20,
      formatMeasurement(wallLength, scale, unit),
      '#0ea5e9'
    );

    drawArrowLine(
      ctx,
      wallStart.x - 20, wallStart.y,
      wallTop.x - 20, wallTop.y,
      formatMeasurement(wallHeight * scale, scale, unit),
      '#0ea5e9'
    );

    const doorsOnWall = getDoorsOnWall(selectedWall.id);
    doorsOnWall.forEach(door => {
      const doorX = distance(selectedWall.start, door.position);
      const doorWidth = door.width;
      const doorHeight = (door.height || 2.0) * scale;
      const sillHeight = (door.sillHeight || 0) * scale;

      const topLeft = worldToScreen(doorX - doorWidth / 2, sillHeight + doorHeight);
      const topRight = worldToScreen(doorX + doorWidth / 2, sillHeight + doorHeight);
      const bottomLeft = worldToScreen(doorX - doorWidth / 2, sillHeight);
      const bottomRight = worldToScreen(doorX + doorWidth / 2, sillHeight);

      const isSelected = selectedElementId === door.id;

      ctx.fillStyle = isSelected ? '#fef3c7' : '#fef9c3';
      ctx.strokeStyle = isSelected ? '#f59e0b' : '#8B4513';
      ctx.lineWidth = isSelected ? 3 : 2;

      ctx.beginPath();
      ctx.moveTo(topLeft.x, topLeft.y);
      ctx.lineTo(topRight.x, topRight.y);
      ctx.lineTo(bottomRight.x, bottomRight.y);
      ctx.lineTo(bottomLeft.x, bottomLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (door.doorType === 'double') {
        const midX = (topLeft.x + topRight.x) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, topLeft.y);
        ctx.lineTo(midX, bottomLeft.y);
        ctx.stroke();
      }

      ctx.fillStyle = '#78350f';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Door (${door.doorType || 'single'})`, (topLeft.x + topRight.x) / 2, (topLeft.y + bottomLeft.y) / 2);

      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#f59e0b';

        ctx.fillRect(topLeft.x - handleSize / 2, (topLeft.y + bottomLeft.y) / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(topRight.x - handleSize / 2, (topRight.y + bottomRight.y) / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect((topLeft.x + topRight.x) / 2 - handleSize / 2, topLeft.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect((bottomLeft.x + bottomRight.x) / 2 - handleSize / 2, bottomLeft.y - handleSize / 2, handleSize, handleSize);

        drawArrowLine(ctx, bottomLeft.x, bottomLeft.y + 15, bottomRight.x, bottomRight.y + 15, 
          formatMeasurement(doorWidth, scale, unit), '#f59e0b');
        drawArrowLine(ctx, topRight.x + 15, topRight.y, bottomRight.x + 15, bottomRight.y, 
          formatMeasurement(doorHeight, scale, unit), '#f59e0b');
      }
    });

    const windowsOnWall = getWindowsOnWall(selectedWall.id);
    windowsOnWall.forEach(window => {
      const windowX = distance(selectedWall.start, window.position);
      const windowWidth = window.width;
      const windowHeight = (window.height || 1.5) * scale;
      const sillHeight = (window.sillHeight || 0.9) * scale;

      const topLeft = worldToScreen(windowX - windowWidth / 2, sillHeight + windowHeight);
      const topRight = worldToScreen(windowX + windowWidth / 2, sillHeight + windowHeight);
      const bottomLeft = worldToScreen(windowX - windowWidth / 2, sillHeight);
      const bottomRight = worldToScreen(windowX + windowWidth / 2, sillHeight);

      const isSelected = selectedElementId === window.id;

      ctx.fillStyle = isSelected ? '#dbeafe' : '#bfdbfe';
      ctx.strokeStyle = isSelected ? '#2563eb' : '#4682B4';
      ctx.lineWidth = isSelected ? 3 : 2;

      ctx.beginPath();
      ctx.moveTo(topLeft.x, topLeft.y);
      ctx.lineTo(topRight.x, topRight.y);
      ctx.lineTo(bottomRight.x, bottomRight.y);
      ctx.lineTo(bottomLeft.x, bottomLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (window.windowType === 'double' || window.windowType === 'sliding') {
        const midX = (topLeft.x + topRight.x) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, topLeft.y);
        ctx.lineTo(midX, bottomLeft.y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      const midY = (topLeft.y + bottomLeft.y) / 2;
      ctx.beginPath();
      ctx.moveTo(topLeft.x, midY);
      ctx.lineTo(topRight.x, midY);
      ctx.stroke();

      ctx.fillStyle = '#1e3a5f';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Window (${window.windowType || 'single'})`, (topLeft.x + topRight.x) / 2, midY);

      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#2563eb';

        ctx.fillRect(topLeft.x - handleSize / 2, (topLeft.y + bottomLeft.y) / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(topRight.x - handleSize / 2, (topRight.y + bottomRight.y) / 2 - handleSize / 2, handleSize, handleSize);
        ctx.fillRect((topLeft.x + topRight.x) / 2 - handleSize / 2, topLeft.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect((bottomLeft.x + bottomRight.x) / 2 - handleSize / 2, bottomLeft.y - handleSize / 2, handleSize, handleSize);

        drawArrowLine(ctx, bottomLeft.x, bottomLeft.y + 15, bottomRight.x, bottomRight.y + 15, 
          formatMeasurement(windowWidth, scale, unit), '#2563eb');
        drawArrowLine(ctx, topRight.x + 15, topRight.y, bottomRight.x + 15, bottomRight.y, 
          formatMeasurement(windowHeight, scale, unit), '#2563eb');

        const floorToSill = worldToScreen(windowX - windowWidth / 2, 0);
        drawArrowLine(ctx, floorToSill.x - 30, wallStart.y, floorToSill.x - 30, bottomLeft.y,
          formatMeasurement(sillHeight, scale, unit), '#10b981');
      }
    });

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Wall Elevation: ${selectedWall.id}`, width / 2, 25);

  }, [selectedWall, width, height, wallLength, wallHeight, scale, unit, worldToScreen, drawArrowLine, getDoorsOnWall, getWindowsOnWall, selectedElementId]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !selectedWall) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const doorsOnWall = getDoorsOnWall(selectedWall.id);
    for (const door of doorsOnWall) {
      const doorX = distance(selectedWall.start, door.position);
      const doorWidth = door.width;
      const doorHeight = (door.height || 2.0) * scale;
      const sillHeight = (door.sillHeight || 0) * scale;

      const topLeft = worldToScreen(doorX - doorWidth / 2, sillHeight + doorHeight);
      const bottomRight = worldToScreen(doorX + doorWidth / 2, sillHeight);

      if (screenX >= topLeft.x && screenX <= bottomRight.x && screenY >= topLeft.y && screenY <= bottomRight.y) {
        setSelectedElementId(door.id);
        setEditingElement({ id: door.id, type: 'door' });

        const handleSize = 12;
        if (Math.abs(screenX - topLeft.x) < handleSize) {
          setResizeHandle({ type: 'width-left', elementId: door.id, elementType: 'door' });
        } else if (Math.abs(screenX - bottomRight.x) < handleSize) {
          setResizeHandle({ type: 'width-right', elementId: door.id, elementType: 'door' });
        } else if (Math.abs(screenY - topLeft.y) < handleSize) {
          setResizeHandle({ type: 'top', elementId: door.id, elementType: 'door' });
        } else if (Math.abs(screenY - bottomRight.y) < handleSize) {
          setResizeHandle({ type: 'bottom', elementId: door.id, elementType: 'door' });
        }
        setIsDragging(true);
        setDragStart({ x: screenX, y: screenY });
        return;
      }
    }

    const windowsOnWall = getWindowsOnWall(selectedWall.id);
    for (const window of windowsOnWall) {
      const windowX = distance(selectedWall.start, window.position);
      const windowWidth = window.width;
      const windowHeight = (window.height || 1.5) * scale;
      const sillHeight = (window.sillHeight || 0.9) * scale;

      const topLeft = worldToScreen(windowX - windowWidth / 2, sillHeight + windowHeight);
      const bottomRight = worldToScreen(windowX + windowWidth / 2, sillHeight);

      if (screenX >= topLeft.x && screenX <= bottomRight.x && screenY >= topLeft.y && screenY <= bottomRight.y) {
        setSelectedElementId(window.id);
        setEditingElement({ id: window.id, type: 'window' });

        const handleSize = 12;
        if (Math.abs(screenX - topLeft.x) < handleSize) {
          setResizeHandle({ type: 'width-left', elementId: window.id, elementType: 'window' });
        } else if (Math.abs(screenX - bottomRight.x) < handleSize) {
          setResizeHandle({ type: 'width-right', elementId: window.id, elementType: 'window' });
        } else if (Math.abs(screenY - topLeft.y) < handleSize) {
          setResizeHandle({ type: 'top', elementId: window.id, elementType: 'window' });
        } else if (Math.abs(screenY - bottomRight.y) < handleSize) {
          setResizeHandle({ type: 'bottom', elementId: window.id, elementType: 'window' });
        }
        setIsDragging(true);
        setDragStart({ x: screenX, y: screenY });
        return;
      }
    }

    setSelectedElementId(null);
    setEditingElement(null);
    setResizeHandle(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart || !resizeHandle || !selectedWall) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const deltaWorld = screenToWorld(screenX, screenY);
    const startWorld = screenToWorld(dragStart.x, dragStart.y);
    const dx = deltaWorld.x - startWorld.x;
    const dy = deltaWorld.y - startWorld.y;

    const updatedFloorPlan = { ...floorPlan };

    if (resizeHandle.elementType === 'door') {
      const doorIndex = updatedFloorPlan.doors.findIndex(d => d.id === resizeHandle.elementId);
      if (doorIndex !== -1) {
        const door = { ...updatedFloorPlan.doors[doorIndex] };
        
        switch (resizeHandle.type) {
          case 'width-left':
          case 'width-right':
            door.width = Math.max(20, door.width + (resizeHandle.type === 'width-right' ? dx : -dx));
            break;
          case 'top':
            door.height = Math.max(0.5, (door.height || 2.0) + dy / scale);
            break;
          case 'bottom':
            door.sillHeight = Math.max(0, (door.sillHeight || 0) + dy / scale);
            break;
        }

        updatedFloorPlan.doors[doorIndex] = door;
      }
    } else if (resizeHandle.elementType === 'window') {
      const windowIndex = updatedFloorPlan.windows.findIndex(w => w.id === resizeHandle.elementId);
      if (windowIndex !== -1) {
        const window = { ...updatedFloorPlan.windows[windowIndex] };
        
        switch (resizeHandle.type) {
          case 'width-left':
          case 'width-right':
            window.width = Math.max(20, window.width + (resizeHandle.type === 'width-right' ? dx : -dx));
            break;
          case 'top':
            window.height = Math.max(0.3, (window.height || 1.5) + dy / scale);
            break;
          case 'bottom':
            window.sillHeight = Math.max(0, (window.sillHeight || 0.9) + dy / scale);
            break;
        }

        updatedFloorPlan.windows[windowIndex] = window;
      }
    }

    onFloorPlanChange(updatedFloorPlan);
    setDragStart({ x: screenX, y: screenY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setResizeHandle(null);
  };

  const updateElementProperty = (property: string, value: number | string) => {
    if (!editingElement) return;

    const updatedFloorPlan = { ...floorPlan };

    if (editingElement.type === 'door') {
      const doorIndex = updatedFloorPlan.doors.findIndex(d => d.id === editingElement.id);
      if (doorIndex !== -1) {
        (updatedFloorPlan.doors[doorIndex] as Record<string, unknown>)[property] = value;
      }
    } else {
      const windowIndex = updatedFloorPlan.windows.findIndex(w => w.id === editingElement.id);
      if (windowIndex !== -1) {
        (updatedFloorPlan.windows[windowIndex] as Record<string, unknown>)[property] = value;
      }
    }

    onFloorPlanChange(updatedFloorPlan);
  };

  const selectedDoor = editingElement?.type === 'door' 
    ? floorPlan.doors.find(d => d.id === editingElement.id) 
    : null;
  const selectedWindow = editingElement?.type === 'window' 
    ? floorPlan.windows.find(w => w.id === editingElement.id) 
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg items-center">
        <Label>Select Wall:</Label>
        <Select value={selectedWallId || ''} onValueChange={setSelectedWallId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose a wall" />
          </SelectTrigger>
          <SelectContent>
            {floorPlan.walls.map((wall, index) => (
              <SelectItem key={wall.id} value={wall.id}>
                Wall {index + 1} ({formatMeasurement(distance(wall.start, wall.end), scale, unit)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 ml-auto">
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}>
            Reset
          </Button>
        </div>
      </div>

      {editingElement && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h3 className="font-semibold">
            Edit {editingElement.type === 'door' ? 'Door' : 'Window'}
          </h3>
          
          {selectedDoor && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={selectedDoor.width}
                  onChange={(e) => updateElementProperty('width', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedDoor.height || 2.0}
                  onChange={(e) => updateElementProperty('height', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Sill Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedDoor.sillHeight || 0}
                  onChange={(e) => updateElementProperty('sillHeight', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Door Type</Label>
                <Select 
                  value={selectedDoor.doorType || 'single'} 
                  onValueChange={(v) => updateElementProperty('doorType', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="sliding">Sliding</SelectItem>
                    <SelectItem value="pocket">Pocket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedWindow && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={selectedWindow.width}
                  onChange={(e) => updateElementProperty('width', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedWindow.height || 1.5}
                  onChange={(e) => updateElementProperty('height', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Sill Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedWindow.sillHeight || 0.9}
                  onChange={(e) => updateElementProperty('sillHeight', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Window Type</Label>
                <Select 
                  value={selectedWindow.windowType || 'single'} 
                  onValueChange={(v) => updateElementProperty('windowType', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="casement">Casement</SelectItem>
                    <SelectItem value="sliding">Sliding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
          style={{ display: 'block' }}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p><strong>Wall Elevation Mode:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Select a wall from the dropdown to view its elevation</li>
          <li>Click on doors/windows to select and edit their properties</li>
          <li>Drag the resize handles (squares) to resize elements</li>
          <li>Use the input fields to set precise dimensions</li>
          <li>Sill height = distance from floor to bottom of element</li>
        </ul>
      </div>
    </div>
  );
}
