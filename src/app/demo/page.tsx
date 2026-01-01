'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Box,
  Home,
  Settings
} from 'lucide-react'

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5))
  const handleReset = () => {
    setRotation(0)
    setZoom(1)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold text-white">3D Floorplan Demo</h1>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white">
              Interactive Demo
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main 3D Viewer */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">3D Viewer</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {/* 3D Canvas Placeholder */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `scale(${zoom}) rotateY(${rotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <div className="text-center">
                      <Box className="w-32 h-32 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-400">3D Floorplan Visualization</p>
                      <p className="text-gray-500 text-sm mt-2">Interactive 3D model viewer</p>
                    </div>
                  </div>
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-lg p-2">
                    <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-white text-sm px-2">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Rotation</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12">{rotation}°</span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Zoom</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={zoom * 100}
                      onChange={(e) => setZoom(Number(e.target.value) / 100)}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12">{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="viewing" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="viewing">Viewing</TabsTrigger>
                    <TabsTrigger value="editing">Editing</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>
                  <TabsContent value="viewing" className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Move className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Pan and rotate</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <ZoomIn className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Zoom controls</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Box className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">3D navigation</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="editing" className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Object properties</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Box className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Material editor</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Move className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Transform tools</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="export" className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Box className="w-4 h-4 text-green-400" />
                      <span className="text-sm">3D models</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Settings className="w-4 h-4 text-green-400" />
                      <span className="text-sm">G-code export</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Move className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Cut lists</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Demo Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <strong>Platform:</strong> Next.js + Three.js
                  </p>
                  <p className="text-gray-300">
                    <strong>Features:</strong> Real-time 3D rendering
                  </p>
                  <p className="text-gray-300">
                    <strong>Performance:</strong> 60 FPS target
                  </p>
                  <p className="text-gray-300">
                    <strong>Export:</strong> Multiple formats supported
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
