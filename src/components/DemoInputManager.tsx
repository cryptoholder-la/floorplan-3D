"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  MousePointer, 
  Touchpad, 
  Keyboard, 
  Gamepad2,
  Move,
  Hand,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface InputEvent {
  type: string;
  timestamp: number;
  data: any;
}

interface DemoInputManagerProps {
  className?: string;
}

export default function DemoInputManager({ className = "" }: DemoInputManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [events, setEvents] = useState<InputEvent[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [touchCount, setTouchCount] = useState(0);
  const [activeInputs, setActiveInputs] = useState({
    mouse: false,
    keyboard: false,
    touch: false,
    gamepad: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw mouse position
      if (activeInputs.mouse) {
        ctx.fillStyle = isMouseDown ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, isMouseDown ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw trail
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(mousePos.x - 20, mousePos.y - 20);
        ctx.stroke();
      }

      // Draw touch points
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < touchCount; i++) {
        const x = 150 + i * 100;
        const y = 200;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw active keys
      ctx.fillStyle = '#f59e0b';
      ctx.font = '16px monospace';
      let keyX = 50;
      let keyY = 50;
      keys.forEach(key => {
        ctx.fillText(key.toUpperCase(), keyX, keyY);
        keyX += 40;
        if (keyX > 550) {
          keyX = 50;
          keyY += 30;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePos, isMouseDown, keys, touchCount, activeInputs]);

  const addEvent = (type: string, data: any) => {
    const event: InputEvent = {
      type,
      timestamp: Date.now(),
      data
    };
    setEvents(prev => [...prev.slice(-9), event]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setActiveInputs(prev => ({ ...prev, mouse: true }));
    
    addEvent('mousemove', { x, y });
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
    addEvent('mousedown', { button: 0 });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    addEvent('mouseup', { button: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setKeys(prev => new Set(prev).add(e.key));
    setActiveInputs(prev => ({ ...prev, keyboard: true }));
    addEvent('keydown', { key: e.key });
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(e.key);
      return newKeys;
    });
    addEvent('keyup', { key: e.key });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchCount(e.touches.length);
    setActiveInputs(prev => ({ ...prev, touch: true }));
    addEvent('touchstart', { count: e.touches.length });
  };

  const handleTouchEnd = () => {
    setTouchCount(0);
    addEvent('touchend', { count: 0 });
  };

  const simulateGamepad = () => {
    setActiveInputs(prev => ({ ...prev, gamepad: true }));
    addEvent('gamepad', { connected: true });
    toast.success('Gamepad simulated!');
    
    setTimeout(() => {
      setActiveInputs(prev => ({ ...prev, gamepad: false }));
    }, 2000);
  };

  const clearEvents = () => {
    setEvents([]);
    toast.success('Event log cleared!');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Input Manager Demo
          </CardTitle>
          <CardDescription>
            Interactive input handling demonstration with mouse, keyboard, touch, and gamepad support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Input Indicators */}
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
              activeInputs.mouse ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
            }`}>
              <MousePointer className="w-4 h-4" />
              <span className="text-sm">Mouse</span>
              {activeInputs.mouse && <Badge variant="secondary">Active</Badge>}
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
              activeInputs.keyboard ? 'bg-amber-100 border-amber-300' : 'bg-gray-100 border-gray-300'
            }`}>
              <Keyboard className="w-4 h-4" />
              <span className="text-sm">Keyboard</span>
              {activeInputs.keyboard && <Badge variant="secondary">Active</Badge>}
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
              activeInputs.touch ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
            }`}>
              <Touchpad className="w-4 h-4" />
              <span className="text-sm">Touch</span>
              {activeInputs.touch && <Badge variant="secondary">{touchCount} points</Badge>}
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
              activeInputs.gamepad ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-300'
            }`}>
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm">Gamepad</span>
              {activeInputs.gamepad && <Badge variant="secondary">Connected</Badge>}
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Interact with the canvas below using mouse, keyboard, or touch:
            </p>
            <canvas
              ref={canvasRef}
              className="border rounded-lg cursor-crosshair bg-slate-900"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setActiveInputs(prev => ({ ...prev, mouse: false }))}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              tabIndex={0}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={simulateGamepad}>
              <Gamepad2 className="w-4 h-4 mr-2" />
              Simulate Gamepad
            </Button>
            
            <Button variant="outline" size="sm" onClick={clearEvents}>
              <Zap className="w-4 h-4 mr-2" />
              Clear Events
            </Button>
          </div>

          {/* Event Log */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Event Log:</h4>
            <div className="bg-muted rounded-lg p-3 h-32 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events yet. Start interacting!</p>
              ) : (
                <div className="space-y-1">
                  {events.map((event, index) => (
                    <div key={index} className="text-xs font-mono flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-muted-foreground">
                        {JSON.stringify(event.data)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Move mouse over canvas to see cursor tracking</li>
              <li>• Click and hold to see mouse down state</li>
              <li>• Press any keys while canvas is focused</li>
              <li>• Touch the canvas on mobile devices</li>
              <li>• Click "Simulate Gamepad" to test gamepad input</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
