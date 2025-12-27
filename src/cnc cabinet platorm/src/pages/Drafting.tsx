import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Undo, Redo, Eye, Settings, Share, Layers, Grid3x3, Move } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tool = 'select' | 'line' | 'rectangle' | 'circle' | 'dimension';
type DrawingElement = {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'dimension';
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  radius?: number;
};

export default function Drafting() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [elements, setElements] = useState<DrawingElement[]>([
    // Sample cabinet side panel
    { id: '1', type: 'rectangle', x1: 150, y1: 100, width: 300, height: 500 },
    { id: '2', type: 'circle', x1: 180, y1: 150, radius: 10 },
    { id: '3', type: 'circle', x1: 180, y1: 550, radius: 10 },
  ]);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(false);

  const tools = [
    { id: 'select', icon: 'near_me', label: 'Select' },
    { id: 'line', icon: 'horizontal_rule', label: 'Line' },
    { id: 'rectangle', icon: 'check_box_outline_blank', label: 'Rectangle' },
    { id: 'circle', icon: 'circle', label: 'Circle' },
    { id: 'dimension', icon: 'straighten', label: 'Dimension' },
  ];

  const bottomActions = [
    { icon: Undo, label: 'Undo', primary: true },
    { icon: Redo, label: 'Redo', primary: true },
    { icon: Eye, label: 'View', primary: false },
    { icon: Settings, label: 'Properties', primary: false },
    { icon: Share, label: 'Export', primary: false },
  ];

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200/10 dark:border-gray-800/80 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="size-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          2D Drafting View
        </h1>
        <Button variant="ghost" className="text-primary font-bold">
          Save
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col">
        {/* 2D Canvas Area with Grid */}
        <div
          ref={canvasRef}
          className="absolute inset-0 bg-gray-200/50 dark:bg-gray-900/50"
          style={{
            backgroundImage: gridEnabled
              ? 'linear-gradient(rgba(128, 128, 128, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.2) 1px, transparent 1px)'
              : 'none',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Drawing Canvas */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <svg className="w-full h-full max-w-4xl max-h-4xl" viewBox="0 0 600 800">
              {/* Render Elements */}
              {elements.map((element) => {
                if (element.type === 'rectangle') {
                  return (
                    <rect
                      key={element.id}
                      x={element.x1}
                      y={element.y1}
                      width={element.width}
                      height={element.height}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  );
                }
                if (element.type === 'circle') {
                  return (
                    <circle
                      key={element.id}
                      cx={element.x1}
                      cy={element.y1}
                      r={element.radius}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  );
                }
                return null;
              })}

              {/* Dimension Lines */}
              <g>
                {/* Horizontal dimension */}
                <line
                  x1="150"
                  y1="80"
                  x2="450"
                  y2="80"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <line
                  x1="150"
                  y1="75"
                  x2="150"
                  y2="85"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <line
                  x1="450"
                  y1="75"
                  x2="450"
                  y2="85"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <text
                  x="300"
                  y="75"
                  fill="#8E8E93"
                  fontFamily="Space Grotesk"
                  fontSize="14"
                  textAnchor="middle"
                >
                  300mm
                </text>

                {/* Vertical dimension */}
                <line
                  x1="130"
                  y1="100"
                  x2="130"
                  y2="600"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <line
                  x1="125"
                  y1="100"
                  x2="135"
                  y2="100"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <line
                  x1="125"
                  y1="600"
                  x2="135"
                  y2="600"
                  stroke="#8E8E93"
                  strokeWidth="1"
                />
                <text
                  x="120"
                  y="350"
                  fill="#8E8E93"
                  fontFamily="Space Grotesk"
                  fontSize="14"
                  textAnchor="middle"
                  transform="rotate(-90 120,350)"
                >
                  500mm
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Left Toolbar */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex flex-col gap-2 p-1.5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-lg border border-gray-200/10 dark:border-gray-800/80 shadow-lg">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className={`p-2.5 rounded-md transition-colors ${
                  activeTool === tool.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={tool.label}
              >
                <span className="material-symbols-outlined text-xl">
                  {tool.icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-4 z-10">
          {/* Layers FAB */}
          <button className="flex w-14 h-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors">
            <Layers className="w-6 h-6" />
          </button>

          {/* Snap Controls */}
          <div className="flex flex-col items-center gap-2 p-1.5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-lg border border-gray-200/10 dark:border-gray-800/80 shadow-lg">
            <button
              onClick={() => setGridEnabled(!gridEnabled)}
              className={`p-2.5 transition-colors ${
                gridEnabled ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Grid"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSnapEnabled(!snapEnabled)}
              className={`p-2.5 transition-colors ${
                snapEnabled ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Snap"
            >
              <Move className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Actions Bar */}
      <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200/10 dark:border-gray-800/80 p-2 z-20">
        <div className="grid grid-cols-5 gap-2 px-2">
          {bottomActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-1 py-1.5 text-center"
            >
              <div
                className={`rounded-full p-2.5 ${
                  action.primary
                    ? 'bg-primary/20'
                    : 'bg-gray-200 dark:bg-gray-800'
                }`}
              >
                <action.icon
                  className={`w-5 h-5 ${
                    action.primary
                      ? 'text-primary'
                      : 'text-gray-800 dark:text-white'
                  }`}
                />
              </div>
              <p className="text-gray-800 dark:text-white text-xs font-medium leading-normal">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}