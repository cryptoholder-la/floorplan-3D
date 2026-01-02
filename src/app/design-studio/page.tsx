'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Eye, 
  Download, 
  Settings, 
  Layers, 
  Grid3X3, 
  Move3d,
  Box,
  Palette,
  Sun,
  Zap,
  Camera,
  Save,
  Share2,
  Maximize2,
  Minimize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Play,
  Pause
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface SceneSettings {
  lighting: {
    intensity: number
    ambient: number
    directional: number
  }
  camera: {
    position: { x: number; y: number; z: number }
    fov: number
    near: number
    far: number
  }
  rendering: {
    shadows: boolean
    antialiasing: boolean
    wireframe: boolean
    materials: boolean
  }
  export: {
    format: 'png' | 'jpg' | 'svg' | 'pdf'
    quality: number
    resolution: '720p' | '1080p' | '4k'
  }
}

export default function DesignStudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'wireframe' | 'render'>('3d')
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState('all')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sceneSettings, setSceneSettings] = useState<SceneSettings>({
    lighting: {
      intensity: 75,
      ambient: 30,
      directional: 80
    },
    camera: {
      position: { x: 5, y: 5, z: 5 },
      fov: 75,
      near: 0.1,
      far: 1000
    },
    rendering: {
      shadows: true,
      antialiasing: true,
      wireframe: false,
      materials: true
    },
    export: {
      format: 'png',
      quality: 90,
      resolution: '1080p'
    }
  })

  const layers = [
    { id: 'all', name: 'All Layers', visible: true, count: 24 },
    { id: 'cabinets', name: 'Cabinets', visible: true, count: 12 },
    { id: 'countertops', name: 'Countertops', visible: true, count: 4 },
    { id: 'appliances', name: 'Appliances', visible: true, count: 3 },
    { id: 'fixtures', name: 'Fixtures', visible: true, count: 2 },
    { id: 'lighting', name: 'Lighting', visible: true, count: 3 }
  ]

  const exportFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'svg', label: 'SVG' },
    { value: 'pdf', label: 'PDF' }
  ]

  const resolutions = [
    { value: '720p', label: '720p (1280×720)' },
    { value: '1080p', label: '1080p (1920×1080)' },
    { value: '4k', label: '4K (3840×2160)' }
  ]

  const captureScene = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.download = `design-studio-${Date.now()}.${sceneSettings.export.format}`
      link.href = canvas.toDataURL()
      link.click()
      toast.success('Scene captured successfully')
    }
  }

  const resetCamera = () => {
    setSceneSettings(prev => ({
      ...prev,
      camera: {
        position: { x: 5, y: 5, z: 5 },
        fov: 75,
        near: 0.1,
        far: 1000
      }
    }))
    toast.success('Camera position reset')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    // Initialize 3D scene
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Simple 3D representation
        ctx.fillStyle = '#1a2230'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw grid if enabled
        if (showGrid) {
          ctx.strokeStyle = '#374151'
          ctx.lineWidth = 1
          for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()
          }
          for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
          }
        }
        
        // Draw axes if enabled
        if (showAxes) {
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(50, canvas.height - 50)
          ctx.lineTo(150, canvas.height - 50)
          ctx.stroke()
          
          ctx.strokeStyle = '#10b981'
          ctx.beginPath()
          ctx.moveTo(50, canvas.height - 50)
          ctx.lineTo(50, canvas.height - 150)
          ctx.stroke()
          
          ctx.strokeStyle = '#3b82f6'
          ctx.beginPath()
          ctx.moveTo(50, canvas.height - 50)
          ctx.lineTo(30, canvas.height - 70)
          ctx.stroke()
        }
        
        // Draw mock 3D objects
        const draw3DBox = (x: number, y: number, width: number, height: number, depth: number, color: string) => {
          ctx.fillStyle = color
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          
          // Front face
          ctx.fillRect(x, y, width, height)
          ctx.strokeRect(x, y, width, height)
          
          // Top face (simulated 3D)
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + depth/2, y - depth/2)
          ctx.lineTo(x + width + depth/2, y - depth/2)
          ctx.lineTo(x + width, y)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          
          // Right face (simulated 3D)
          ctx.beginPath()
          ctx.moveTo(x + width, y)
          ctx.lineTo(x + width + depth/2, y - depth/2)
          ctx.lineTo(x + width + depth/2, y + height - depth/2)
          ctx.lineTo(x + width, y + height)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
        
        // Draw sample cabinets
        draw3DBox(100, 200, 80, 120, 30, '#4b5563')
        draw3DBox(200, 200, 80, 120, 30, '#4b5563')
        draw3DBox(300, 200, 80, 120, 30, '#4b5563')
        
        // Draw countertop
        draw3DBox(90, 180, 300, 20, 40, '#8b5cf6')
        
        // Draw wall cabinets
        draw3DBox(120, 80, 60, 80, 25, '#6b7280')
        draw3DBox(200, 80, 60, 80, 25, '#6b7280')
        draw3DBox(280, 80, 60, 80, 25, '#6b7280')
      }
    }
  }, [showGrid, showAxes, sceneSettings.rendering])

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-card">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard-10-10">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-sm font-medium">Design Studio</div>
            <Badge variant="secondary" className="text-xs">Scene Controls & Outputs</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button variant="outline" size="sm" onClick={captureScene}>
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetCamera}>
              <RotateCw className="w-4 h-4 mr-2" />
              Reset Camera
            </Button>
            
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Scene
            </Button>
            
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full bg-background"
          />
          
          {/* View Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant={viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                >
                  <Move3d className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('2d')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'wireframe' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('wireframe')}
                >
                  <Box className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'render' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('render')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="grid grid-cols-2 gap-1">
                <Button variant="ghost" size="sm">
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <FlipVertical className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AlignCenter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scene Info Overlay */}
          <div className="absolute top-4 right-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-xs">
              <div className="space-y-1">
                <div>View: <span className="text-blue-400">{viewMode.toUpperCase()}</span></div>
                <div>Objects: <span className="text-green-400">24</span></div>
                <div>FPS: <span className="text-yellow-400">60</span></div>
                <div>Resolution: <span className="text-purple-400">1920×1080</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l border-white/10 bg-card p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Display Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Display Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Grid</label>
                  <Switch
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Axes</label>
                  <Switch
                    checked={showAxes}
                    onCheckedChange={setShowAxes}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Auto Rotate</label>
                  <Switch
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                  />
                </div>
              </div>
            </div>

            {/* Lighting Controls */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Lighting
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Intensity</label>
                  <Slider
                    value={[sceneSettings.lighting.intensity]}
                    onValueChange={(value) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        lighting: { ...prev.lighting, intensity: value[0] }
                      }))
                    }
                    max={100}
                    min={0}
                    className="w-full"
                  />
                  <span className="text-xs text-white/60">{sceneSettings.lighting.intensity}%</span>
                </div>
                <div>
                  <label className="text-sm">Ambient</label>
                  <Slider
                    value={[sceneSettings.lighting.ambient]}
                    onValueChange={(value) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        lighting: { ...prev.lighting, ambient: value[0] }
                      }))
                    }
                    max={100}
                    min={0}
                    className="w-full"
                  />
                  <span className="text-xs text-white/60">{sceneSettings.lighting.ambient}%</span>
                </div>
                <div>
                  <label className="text-sm">Directional</label>
                  <Slider
                    value={[sceneSettings.lighting.directional]}
                    onValueChange={(value) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        lighting: { ...prev.lighting, directional: value[0] }
                      }))
                    }
                    max={100}
                    min={0}
                    className="w-full"
                  />
                  <span className="text-xs text-white/60">{sceneSettings.lighting.directional}%</span>
                </div>
              </div>
            </div>

            {/* Layer Management */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Layers
              </h3>
              <div className="space-y-2">
                {layers.map(layer => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition ${
                      selectedLayer === layer.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={layer.visible}
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className="text-sm font-medium">{layer.name}</div>
                        <div className="text-xs text-white/60">{layer.count} objects</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {layer.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Format</label>
                  <Select 
                    value={sceneSettings.export.format} 
                    onValueChange={(value: 'png' | 'jpg' | 'svg' | 'pdf') =>
                      setSceneSettings(prev => ({
                        ...prev,
                        export: { ...prev.export, format: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm">Resolution</label>
                  <Select 
                    value={sceneSettings.export.resolution} 
                    onValueChange={(value: '720p' | '1080p' | '4k') =>
                      setSceneSettings(prev => ({
                        ...prev,
                        export: { ...prev.export, resolution: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutions.map(resolution => (
                        <SelectItem key={resolution.value} value={resolution.value}>
                          {resolution.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm">Quality</label>
                  <Slider
                    value={[sceneSettings.export.quality]}
                    onValueChange={(value) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        export: { ...prev.export, quality: value[0] }
                      }))
                    }
                    max={100}
                    min={10}
                    className="w-full"
                  />
                  <span className="text-xs text-white/60">{sceneSettings.export.quality}%</span>
                </div>
              </div>
            </div>

            {/* Rendering Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Rendering
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Shadows</label>
                  <Switch
                    checked={sceneSettings.rendering.shadows}
                    onCheckedChange={(checked) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        rendering: { ...prev.rendering, shadows: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Antialiasing</label>
                  <Switch
                    checked={sceneSettings.rendering.antialiasing}
                    onCheckedChange={(checked) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        rendering: { ...prev.rendering, antialiasing: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Wireframe</label>
                  <Switch
                    checked={sceneSettings.rendering.wireframe}
                    onCheckedChange={(checked) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        rendering: { ...prev.rendering, wireframe: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Materials</label>
                  <Switch
                    checked={sceneSettings.rendering.materials}
                    onCheckedChange={(checked) =>
                      setSceneSettings(prev => ({
                        ...prev,
                        rendering: { ...prev.rendering, materials: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
