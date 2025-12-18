"use client";

import { useEffect, useRef, useState } from 'react';
import { ManufacturingJob, CNCOperation } from '@/types/manufacturing.types';

interface ToolpathVisualizationProps {
  job: ManufacturingJob;
  width?: number;
  height?: number;
}

export default function ToolpathVisualization({
  job,
  width = 600,
  height = 500,
}: ToolpathVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentOperation, setCurrentOperation] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawToolpaths(ctx, job, currentOperation);
  }, [job, currentOperation]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentOperation(prev => {
        if (prev >= job.operations.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, job.operations.length]);

  const drawToolpaths = (
    ctx: CanvasRenderingContext2D,
    job: ManufacturingJob,
    upToOperation: number
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const padding = 40;
    const drawWidth = ctx.canvas.width - 2 * padding;
    const drawHeight = ctx.canvas.height - 2 * padding;

    const scaleX = drawWidth / job.width;
    const scaleY = drawHeight / job.height;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = padding + (drawWidth - job.width * scale) / 2;
    const offsetY = padding + (drawHeight - job.height * scale) / 2;

    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, job.width * scale, job.height * scale);

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(offsetX, offsetY, job.width * scale, job.height * scale);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText(`${job.componentName}`, ctx.canvas.width / 2, 20);
    ctx.fillText(`${job.width}" × ${job.height}"`, ctx.canvas.width / 2, 35);

    for (let i = 0; i <= upToOperation && i < job.operations.length; i++) {
      const operation = job.operations[i];
      const isCurrent = i === upToOperation;

      drawOperation(ctx, operation, offsetX, offsetY, scale, isCurrent);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Operation ${upToOperation + 1}/${job.operations.length}`,
      padding,
      ctx.canvas.height - padding + 20
    );
    if (job.operations[upToOperation]) {
      ctx.fillText(
        job.operations[upToOperation].name,
        padding,
        ctx.canvas.height - padding + 35
      );
    }
  };

  const drawOperation = (
    ctx: CanvasRenderingContext2D,
    operation: CNCOperation,
    offsetX: number,
    offsetY: number,
    scale: number,
    isCurrent: boolean
  ) => {
    const transform = (x: number, y: number) => ({
      x: offsetX + x * scale,
      y: offsetY + y * scale,
    });

    if (operation.type === 'drill') {
      const pos = transform(operation.startPoint.x, operation.startPoint.y);
      const radius = (operation.tool.diameter / 2) * scale;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(radius, 3), 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? '#00ff00' : '#0088ff';
      ctx.fill();
      ctx.strokeStyle = isCurrent ? '#00ff00' : '#0088ff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pos.x - 4, pos.y);
      ctx.lineTo(pos.x + 4, pos.y);
      ctx.moveTo(pos.x, pos.y - 4);
      ctx.lineTo(pos.x, pos.y + 4);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (operation.type === 'route' && operation.path && operation.path.length > 1) {
      ctx.beginPath();
      const firstPoint = transform(operation.path[0].x, operation.path[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < operation.path.length; i++) {
        const point = transform(operation.path[i].x, operation.path[i].y);
        ctx.lineTo(point.x, point.y);
      }

      ctx.strokeStyle = isCurrent ? '#ff9900' : '#ff6600';
      ctx.lineWidth = Math.max(operation.tool.diameter * scale * 0.5, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      if (isCurrent) {
        const lastPoint = transform(
          operation.path[operation.path.length - 1].x,
          operation.path[operation.path.length - 1].y
        );
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ff9900';
        ctx.fill();
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentOperation(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentOperation < job.operations.length - 1) {
      setCurrentOperation(currentOperation + 1);
    }
  };

  const handleStepBack = () => {
    if (currentOperation > 0) {
      setCurrentOperation(currentOperation - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg bg-gray-900"
      />
      
      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-mono"
        >
          Reset
        </button>
        <button
          onClick={handleStepBack}
          disabled={currentOperation === 0}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-mono disabled:opacity-50"
        >
          ◀ Step
        </button>
        <button
          onClick={handlePlayPause}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-mono"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleStepForward}
          disabled={currentOperation >= job.operations.length - 1}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-mono disabled:opacity-50"
        >
          Step ▶
        </button>
      </div>
    </div>
  );
}
