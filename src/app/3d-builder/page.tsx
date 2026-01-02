'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SimpleIcon } from '@/components/ui/icon-simple'
import { 
  Move3d,
  Box,
  Grid3X3,
  Plus,
  Trash2,
  Move,
  RotateCw,
  Maximize2,
  Save,
  Upload,
  Download,
  Eye,
  EyeOff,
  Layers,
  Settings,
  ArrowLeft,
  Play,
  Pause,
  RefreshCw,
  Ruler,
  Cube,
  Package,
  Home,
  Sofa,
  Sink,
  Zap,
  MousePointer
} from '@/lib/icons-simple'
import { toast } from 'sonner'
import Link from 'next/link'

interface RoomObject {
  id: string
  type: 'cabinet' | 'appliance' | 'fixture' | 'furniture'
  name: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  dimensions: { width: number; height: number; depth: number }
  color: string
  visible: boolean
  locked: boolean
}

interface Room {
  id: string
  name: string
  dimensions: { width: number; height: number; depth: number }
  objects: RoomObject[]
}

export default function ThreeDBuilder() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'wireframe'>('3d')
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(50)
  const [showDimensions, setShowDimensions] = useState(true)
  const [editMode, setEditMode] = useState<'select' | 'move' | 'rotate' | 'scale'>('select')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'main-room',
      name: 'Kitchen',
      dimensions: { width: 4000, height: 2400, depth: 3000 },
      objects: [
        {
          id: 'cabinet-1',
          type: 'cabinet',
          name: 'Base Cabinet 1',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          dimensions: { width: 600, height: 720, depth: 560 },
          color: '#4b5563',
          visible: true,
          locked: false
        },
        {
          id: 'cabinet-2',
          type: 'cabinet',
          name: 'Base Cabinet 2',
          position: { x: 600, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          dimensions: { width: 600, height: 720, depth: 560 },
          color: '#4b5563',
          visible: true,
          locked: false
        },
        {
          id: 'sink',
          type: 'appliance',
          name: 'Kitchen Sink',
          position: { x: 300, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          dimensions: { width: 500, height: 200, depth: 400 },
          color: '#6b7280',
          visible: true,
          locked: false
        }
      ]
    }
  ])

  const objectCategories = [
    { 
      id: 'cabinets', 
      name: 'Cabinets', 
      icon: Box,
      items: [
        { id: 'base-cabinet', name: 'Base Cabinet', dimensions: { width: 600, height: 720, depth: 560 } },
        { id: 'wall-cabinet', name: 'Wall Cabinet', dimensions: { width: 600, height: 720, depth: 320 } },
        { id: 'tall-cabinet', name: 'Tall Cabinet', dimensions: { width: 600, height: 2100, depth: 560 } }
      ]
    },
    { 
      id: 'appliances', 
      name: 'Appliances', 
      icon: Zap,
      items: [
        { id: 'sink', name: 'Sink', dimensions: { width: 500, height: 200, depth: 400 } },
        { id: 'cooktop', name: 'Cooktop', dimensions: { width: 600, height: 50, depth: 500 } },
        { id: 'oven', name: 'Oven', dimensions: { width: 600, height: 600, depth: 600 } }
      ]
    },
    { 
      id: 'fixtures', 
      name: 'Fixtures', 
      icon: Home,
      items: [
        { id: 'window', name: 'Window', dimensions: { width: 1200, height: 1200, depth: 100 } },
        { id: 'door', name: 'Door', dimensions: { width: 800, height: 2000, depth: 100 } }
      ]
    },
    { 
      id: 'furniture', 
      name: 'Furniture', 
      icon: Sofa,
      items: [
        { id: 'table', name: 'Table', dimensions: { width: 1200, height: 750, depth: 800 } },
        { id: 'chair', name: 'Chair', dimensions: { width: 450, height: 850, depth: 450 } }
      ]
    }
  ]

  const addObject = (category: string, item: any) => {
    const newObject: RoomObject = {
      id: `${category}-${Date.now()}`,
      type: category as any,
      name: item.name,
      position: { 
        x: Math.floor(Math.random() * 1000), 
        y: 0, 
        z: Math.floor(Math.random() * 1000) 
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      dimensions: item.dimensions,
      color: category === 'cabinets' ? '#4b5563' : 
              category === 'appliances' ? '#6b7280' : 
              category === 'fixtures' ? '#8b5cf6' : '#10b981',
      visible: true,
      locked: false
    }

    setRooms(prev => prev.map(room => 
      room.id === 'main-room' 
        ? { ...room, objects: [...room.objects, newObject] }
        : room
    ))

    toast.success(`${item.name} added to room`)
  }

  const deleteObject = (objectId: string) => {
    setRooms(prev => prev.map(room => 
      room.id === 'main-room' 
        ? { ...room, objects: room.objects.filter(obj => obj.id !== objectId) }
        : room
    ))
    setSelectedObject(null)
    toast.success('Object removed')
  }

  const resetScene = () => {
    setRooms(prev => prev.map(room => 
      room.id === 'main-room' 
        ? { ...room, objects: [] }
        : room
    ))
    setSelectedObject(null)
    toast.success('Scene reset')
  }

  const exportScene = () => {
    const sceneData = JSON.stringify(rooms, null, 2)
    const blob = new Blob([sceneData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `3d-scene-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Scene exported')
  }

  useEffect(() => {
    // Initialize 3D scene
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = '#1a2230'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw grid if enabled
        if (showGrid) {
          ctx.strokeStyle = '#374151'
          ctx.lineWidth = 1
          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()
          }
          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
          }
        }
        
        // Draw room boundaries
        const currentRoom = rooms.find(r => r.id === 'main-room')
        if (currentRoom) {
          ctx.strokeStyle = '#60a5fa'
          ctx.lineWidth = 2
          ctx.strokeRect(50, 50, 400, 300)
          
          // Draw objects
          currentRoom.objects.forEach((obj, index) => {
            if (!obj.visible) return
            
            const scale = 0.1 // Scale down for display
            const x = 70 + (index % 5) * 80
            const y = 70 + Math.floor(index / 5) * 80
            const width = obj.dimensions.width * scale
            const height = obj.dimensions.depth * scale
            
            // Draw object
            ctx.fillStyle = obj.color
            ctx.fillRect(x, y, width, height)
            
            // Draw selection outline
            if (selectedObject === obj.id) {
              ctx.strokeStyle = '#3b82f6'
              ctx.lineWidth = 2
              ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
            }
            
            // Draw dimensions if enabled
            if (showDimensions) {
              ctx.fillStyle = '#ffffff'
              ctx.font = '10px monospace'
              ctx.fillText(`${obj.dimensions.width}mm`, x, y - 5)
            }
          })
        }
      }
    }
  }, [rooms, selectedObject, showGrid, gridSize, showDimensions])

  const selectedObj = rooms.find(r => r.id === 'main-room')?.objects.find(obj => obj.id === selectedObject)

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-card">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard-10-10">
              <Button variant="ghost" size="sm">
                <SimpleIcon name="BACK" className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-sm font-medium">3D Builder</div>
            <Badge variant="secondary" className="text-xs">Interactive Room + Cabinet Placement</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <SimpleIcon name="PAUSE" /> : <SimpleIcon name="PLAY" />}
            </Button>
            
            <Button variant="outline" size="sm" onClick={resetScene}>
              <SimpleIcon name="REFRESH" />
              Reset
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportScene}>
              <SimpleIcon name="DOWNLOAD" />
              Export
            </Button>
            
            <Button variant="outline" size="sm">
              <SimpleIcon name="SAVE" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Toolbar */}
        <div className="w-16 border-r border-white/10 bg-card p-2 flex flex-col gap-2">
          <Button
            variant={editMode === 'select' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setEditMode('select')}
            title="Select"
          >
            <SimpleIcon name="POINTER" />
          </Button>
          <Button
            variant={editMode === 'move' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setEditMode('move')}
            title="Move"
          >
            <SimpleIcon name="MOVE" />
          </Button>
          <Button
            variant={editMode === 'rotate' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setEditMode('rotate')}
            title="Rotate"
          >
            <SimpleIcon name="ROTATE" />
          </Button>
          <Button
            variant={editMode === 'scale' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setEditMode('scale')}
            title="Scale"
          >
            <SimpleIcon name="MAXIMIZE" />
          </Button>
          
          <div className="border-t border-white/10 pt-2">
            <Button
              variant={viewMode === '3d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('3d')}
              title="3D View"
            >
              <SimpleIcon name="MOVE" />
            </Button>
            <Button
              variant={viewMode === '2d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('2d')}
              title="2D View"
            >
              <SimpleIcon name="GRID" />
            </Button>
            <Button
              variant={viewMode === 'wireframe' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('wireframe')}
              title="Wireframe"
            >
              <SimpleIcon name="BOX" />
            </Button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full bg-background cursor-crosshair"
          />
          
          {/* View Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span>Grid:</span>
                <Switch
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                  size="sm"
                />
                <span>Snap:</span>
                <Switch
                  checked={snapToGrid}
                  onCheckedChange={setSnapToGrid}
                  size="sm"
                />
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span>Grid Size:</span>
                <Slider
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                  max={100}
                  min={25}
                  step={25}
                  className="w-20"
                />
                <span>{gridSize}px</span>
              </div>
            </div>
          </div>

          {/* Scene Info */}
          <div className="absolute top-4 right-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-xs">
              <div className="space-y-1">
                <div>Mode: <span className="text-blue-400">{editMode}</span></div>
                <div>View: <span className="text-green-400">{viewMode}</span></div>
                <div>Objects: <span className="text-yellow-400">{rooms.find(r => r.id === 'main-room')?.objects.length || 0}</span></div>
                <div>Selected: <span className="text-purple-400">{selectedObj?.name || 'None'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Object Library */}
        <div className="w-80 border-l border-white/10 bg-card p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Object Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <SimpleIcon name="PACKAGE" />
                Object Library
              </h3>
              <div className="space-y-4">
                {objectCategories.map(category => {
                  const Icon = category.icon
                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <h4 className="text-sm font-medium">{category.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {category.items.map(item => (
                          <Button
                            key={item.id}
                            variant="outline"
                            size="sm"
                            onClick={() => addObject(category.id, item)}
                            className="h-auto p-2 flex flex-col items-center gap-1"
                          >
                            <SimpleIcon name="BOX" />
                            <span className="text-xs">{item.name}</span>
                            <span className="text-xs text-white/60">
                              {item.dimensions.width}×{item.dimensions.depth}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Object Properties */}
            {selectedObj && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <SimpleIcon name="SETTINGS" />
                  Object Properties
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm">Name</label>
                    <Input
                      value={selectedObj.name}
                      onChange={(e) => {
                        const newName = e.target.value
                        setRooms(prev => prev.map(room => 
                          room.id === 'main-room' 
                            ? {
                                ...room,
                                objects: room.objects.map(obj => 
                                  obj.id === selectedObj.id 
                                    ? { ...obj, name: newName }
                                    : obj
                                )
                              }
                            : room
                        ))
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs">X</label>
                      <Input
                        type="number"
                        value={selectedObj.position.x}
                        onChange={(e) => {
                          const newX = parseInt(e.target.value) || 0
                          setRooms(prev => prev.map(room => 
                            room.id === 'main-room' 
                              ? {
                                  ...room,
                                  objects: room.objects.map(obj => 
                                    obj.id === selectedObj.id 
                                      ? { ...obj, position: { ...obj.position, x: newX } }
                                      : obj
                                  )
                                }
                              : room
                          ))
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Y</label>
                      <Input
                        type="number"
                        value={selectedObj.position.y}
                        onChange={(e) => {
                          const newY = parseInt(e.target.value) || 0
                          setRooms(prev => prev.map(room => 
                            room.id === 'main-room' 
                              ? {
                                  ...room,
                                  objects: room.objects.map(obj => 
                                    obj.id === selectedObj.id 
                                      ? { ...obj, position: { ...obj.position, y: newY } }
                                      : obj
                                  )
                                }
                              : room
                          ))
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Z</label>
                      <Input
                        type="number"
                        value={selectedObj.position.z}
                        onChange={(e) => {
                          const newZ = parseInt(e.target.value) || 0
                          setRooms(prev => prev.map(room => 
                            room.id === 'main-room' 
                              ? {
                                  ...room,
                                  objects: room.objects.map(obj => 
                                    obj.id === selectedObj.id 
                                      ? { ...obj, position: { ...obj.position, z: newZ } }
                                      : obj
                                  )
                                }
                              : room
                          ))
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Visible</label>
                    <Switch
                      checked={selectedObj.visible}
                      onCheckedChange={(checked) => {
                        setRooms(prev => prev.map(room => 
                          room.id === 'main-room' 
                            ? {
                                ...room,
                                objects: room.objects.map(obj => 
                                  obj.id === selectedObj.id 
                                    ? { ...obj, visible: checked }
                                    : obj
                                )
                              }
                            : room
                        ))
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Locked</label>
                    <Switch
                      checked={selectedObj.locked}
                      onCheckedChange={(checked) => {
                        setRooms(prev => prev.map(room => 
                          room.id === 'main-room' 
                            ? {
                                ...room,
                                objects: room.objects.map(obj => 
                                  obj.id === selectedObj.id 
                                    ? { ...obj, locked: checked }
                                    : obj
                                )
                              }
                            : room
                        ))
                      }}
                    />
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteObject(selectedObj.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Object
                  </Button>
                </div>
              </div>
            )}

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
                  <label className="text-sm">Snap to Grid</label>
                  <Switch
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Dimensions</label>
                  <Switch
                    checked={showDimensions}
                    onCheckedChange={setShowDimensions}
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
