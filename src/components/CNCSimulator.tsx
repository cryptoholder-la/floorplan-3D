"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CabinetPart, Toolpath, CNCSimulationState } from '@/lib/cnc-types';
import { generateToolpath } from '@/lib/cnc-toolpath-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, FastForward, Zap } from 'lucide-react';

interface Props {
  part: CabinetPart;
  width?: number;
  height?: number;
}

const CNCSimulator = ({ part, width = 600, height = 400 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toolpath, setToolpath] = useState<Toolpath | null>(null);
  const [simState, setSimState] = useState<CNCSimulationState>({
    currentCommand: 0,
    totalCommands: 0,
    currentPosition: { x: 0, y: 0, z: 5 },
    spindleOn: false,
    progress: 0,
    toolpathHistory: [],
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const tp = generateToolpath(part);
    setToolpath(tp);
    setSimState({
      currentCommand: 0,
      totalCommands: tp.commands.length,
      currentPosition: { x: 0, y: 0, z: 5 },
      spindleOn: false,
      progress: 0,
      toolpathHistory: [],
    });
  }, [part]);

  const animate = () => {
    if (!toolpath) return;
    setSimState((prev) => {
      if (prev.currentCommand >= toolpath.commands.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      const nextCommand = prev.currentCommand + speed;
      const cmd = toolpath.commands[Math.floor(nextCommand)];

      if (!cmd) return prev;
      const newPos = {
        x: cmd.x ?? prev.currentPosition.x,
        y: cmd.y ?? prev.currentPosition.y,
        z: cmd.z ?? prev.currentPosition.z,
      };
      const newHistory = [...prev.toolpathHistory];
      if (cmd.type === 'linear' || cmd.type === 'drill') {
        newHistory.push(newPos);
      }
      return {
        ...prev,
        currentCommand: Math.floor(nextCommand),
        currentPosition: newPos,
        spindleOn: cmd.type === 'spindle_on' ? true : cmd.type === 'spindle_off' ? false : prev.spindleOn,
        progress: (nextCommand / toolpath.commands.length) * 100,
        toolpathHistory: newHistory,
      };
    });
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };



  useEffect(() => {
    if (isPlaying && toolpath) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, simState, speed, toolpath]);

  const drawSimulation = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !toolpath) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const scaleX = (width - 80) / part.width;
    const scaleY = (height - 80) / part.height;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (width - part.width * scale) / 2;
    const offsetY = (height - part.height * scale) / 2;

    ctx.fillStyle = part.material.color;
    ctx.fillRect(offsetX, offsetY, part.width * scale, part.height * scale);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, part.width * scale, part.height * scale);

    if (part.holes && part.holes.length > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (const hole of part.holes) {
        const holeX = offsetX + hole.x * scale;
        const holeY = offsetY + hole.y * scale;
        const holeR = (hole.diameter / 2) * scale;

        ctx.beginPath();
        ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    for (let i = 0; i < simState.toolpathHistory.length - 1; i++) {
      const p1 = simState.toolpathHistory[i];
      const p2 = simState.toolpathHistory[i + 1];

      const x1 = offsetX + p1.x * scale;
      const y1 = offsetY + p1.y * scale;
      const x2 = offsetX + p2.x * scale;
      const y2 = offsetY + p2.y * scale;

      if (i === 0) {
        ctx.moveTo(x1, y1);
      }
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    const toolX = offsetX + simState.currentPosition.x * scale;
    const toolY = offsetY + simState.currentPosition.y * scale;

    ctx.fillStyle = simState.spindleOn ? '#ef4444' : '#10b981';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(toolX, toolY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (simState.spindleOn) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(toolX, toolY, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(toolX, toolY, 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#000';
    ctx.font = '12px monospace';
    ctx.fillText(`X: ${simState.currentPosition.x.toFixed(1)}`, 10, 20);
    ctx.fillText(`Y: ${simState.currentPosition.y.toFixed(1)}`, 10, 35);
    ctx.fillText(`Z: ${simState.currentPosition.z.toFixed(1)}`, 10, 50);
  }, [toolpath, part, simState, width, height]);

  useEffect(() => {
    if (toolpath) {
      drawSimulation();
    }
  }, [toolpath, drawSimulation]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimState({
      currentCommand: 0,
      totalCommands: toolpath?.commands.length || 0,
      currentPosition: { x: 0, y: 0, z: 5 },
      spindleOn: false,
      progress: 0,
      toolpathHistory: [],
    });
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">CNC Simulation</h3>
            <p className="text-sm text-muted-foreground">{part.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={simState.spindleOn ? 'destructive' : 'secondary'}>
              {simState.spindleOn ? 'Spindle ON' : 'Spindle OFF'}
            </Badge>
            <Badge variant="outline">
              {Math.round(simState.progress)}%
            </Badge>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border rounded-lg bg-slate-100 dark:bg-slate-900"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant={isPlaying ? 'secondary' : 'default'}
              onClick={handlePlayPause}
              disabled={!toolpath}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset} disabled={!toolpath}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FastForward className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[speed]}
                  onValueChange={handleSpeedChange}
                  min={0.5}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{speed}x</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-muted-foreground mb-1">Command</div>
              <div className="font-mono font-bold">
                {simState.currentCommand} / {simState.totalCommands}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-muted-foreground mb-1">Position</div>
              <div className="font-mono text-xs">
                X{simState.currentPosition.x.toFixed(1)} Y{simState.currentPosition.y.toFixed(1)} Z{simState.currentPosition.z.toFixed(1)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-muted-foreground mb-1">Est. Time</div>
              <div className="font-bold">
                {toolpath ? Math.ceil(toolpath.estimatedTime) : 0} min
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CNCSimulator;
