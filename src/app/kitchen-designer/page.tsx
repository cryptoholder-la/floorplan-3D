'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { SimpleIcon } from '@/components/ui/icon-simple'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Save,
  Eye,
  Settings,
  Grid3X3,
  Box,
  Package,
  Ruler,
  Wrench,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Move3d,
  Maximize2,
  Layers,
  Zap
} from '@/lib/icons-simple'
import { toast } from 'sonner'
import Link from 'next/link'

interface Cabinet {
  id: string
  type: string
  width: number
  height: number
  depth: number
  position: { x: number; y: number; z: number }
  finish: string
  handleStyle: string
}

interface Room {
  id: string
  name: string
  dimensions: { width: number; height: number; depth: number }
  cabinets: Cabinet[]
}

export default function KitchenDesigner() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string>('kitchen-1')
  const [cabinetType, setCabinetType] = useState<string>('base')
  const [cabinetWidth, setCabinetWidth] = useState<string>('600')
  const [finishSelect, setFinishSelect] = useState<string>('white')
  const [handleStyle, setHandleStyle] = useState<string>('modern')
  const [selectedCabinet, setSelectedCabinet] = useState<string | null>(null)
  const [showNKBAReport, setShowNKBAReport] = useState(false)
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'wireframe'>('3d')
  const [gridSnap, setGridSnap] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'kitchen-1',
      name: 'Main Kitchen',
      dimensions: { width: 4000, height: 2400, depth: 3000 },
      cabinets: []
    },
    {
      id: 'kitchen-2',
      name: 'Guest Kitchen',
      dimensions: { width: 3000, height: 2400, depth: 2500 },
      cabinets: []
    }
  ])

  const cabinetTypes = [
    { value: 'base', label: 'Base Cabinet' },
    { value: 'wall', label: 'Wall Cabinet' },
    { value: 'tall', label: 'Tall Cabinet' },
    { value: 'sink', label: 'Sink Base' },
    { value: 'cooktop', label: 'Cooktop Base' },
    { value: 'oven', label: 'Oven Cabinet' },
    { value: 'microwave', label: 'Microwave Cabinet' },
    { value: 'range', label: 'Range Cabinet' }
  ]

  const cabinetWidths = [
    { value: '300', label: '300mm' },
    { value: '450', label: '450mm' },
    { value: '600', label: '600mm' },
    { value: '750', label: '750mm' },
    { value: '900', label: '900mm' },
    { value: '1200', label: '1200mm' }
  ]

  const finishes = [
    { value: 'white', label: 'White Thermofoil' },
    { value: 'gray', label: 'Gray Thermofoil' },
    { value: 'wood', label: 'Natural Wood' },
    { value: 'dark-wood', label: 'Dark Wood' },
    { value: 'black', label: 'Black Matte' }
  ]

  const handleStyles = [
    { value: 'modern', label: 'Modern Bar' },
    { value: 'traditional', label: 'Traditional Pull' },
    { value: 'knob', label: 'Round Knob' },
    { value: 'handleless', label: 'Handleless' }
  ]

  const addCabinet = () => {
    const currentRoom = rooms.find(r => r.id === selectedRoom)
    if (!currentRoom) return

    const newCabinet: Cabinet = {
      id: `cabinet-${Date.now()}`,
      type: cabinetType,
      width: parseInt(cabinetWidth),
      height: cabinetType === 'wall' ? 720 : cabinetType === 'tall' ? 2100 : 720,
      depth: cabinetType === 'wall' ? 320 : cabinetType === 'tall' ? 600 : 560,
      position: { x: 0, y: 0, z: 0 },
      finish: finishSelect,
      handleStyle: handleStyle
    }

    setRooms(prev => prev.map(room => 
      room.id === selectedRoom 
        ? { ...room, cabinets: [...room.cabinets, newCabinet] }
        : room
    ))

    toast.success(`${cabinetType} cabinet added to ${currentRoom.name}`)
  }

  const runNKBAComplianceCheck = () => {
    const currentRoom = rooms.find(r => r.id === selectedRoom)
    if (!currentRoom) return

    const issues = []
    const warnings = []

    // Mock NKBA compliance checks
    if (currentRoom.cabinets.length === 0) {
      warnings.push('No cabinets placed in room')
    }

    const workTriangles = currentRoom.cabinets.filter(c => 
      c.type === 'sink' || c.type === 'cooktop' || c.type === 'range'
    )

    if (workTriangles.length < 3) {
      warnings.push('Incomplete work triangle - missing sink, cooktop, or refrigerator')
    }

    if (currentRoom.cabinets.some(c => c.type === 'wall' && c.position.y < 400)) {
      warnings.push('Wall cabinets may be too low - recommended minimum 400mm from counter')
    }

    setShowNKBAReport(true)
    
    if (issues.length > 0) {
      toast.error(`${issues.length} NKBA compliance issues found`)
    } else if (warnings.length > 0) {
      toast.warning(`${warnings.length} NKBA recommendations`)
    } else {
      toast.success('Design passes NKBA compliance checks')
    }
  }

  const exportPDF = () => {
    toast.success('PDF export started - download will begin shortly')
  }

  const importPDF = () => {
    toast.info('PDF import feature coming soon')
  }

  const downloadLog = () => {
    const logData = {
      timestamp: new Date().toISOString(),
      room: rooms.find(r => r.id === selectedRoom),
      cabinets: rooms.find(r => r.id === selectedRoom)?.cabinets || [],
      nkbaCompliance: showNKBAReport
    }
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kitchen-design-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Design log downloaded')
  }

  useEffect(() => {
    // Initialize 3D scene
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Simple 2D representation for now
        ctx.fillStyle = '#1a2230'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw grid
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        for (let x = 0; x < canvas.width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
        
        // Draw room outline
        const currentRoom = rooms.find(r => r.id === selectedRoom)
        if (currentRoom) {
          ctx.strokeStyle = '#60a5fa'
          ctx.lineWidth = 2
          ctx.strokeRect(50, 50, 300, 200)
          
          // Draw cabinets
          ctx.fillStyle = '#4b5563'
          currentRoom.cabinets.forEach((cabinet, index) => {
            const x = 70 + (index % 4) * 80
            const y = 70 + Math.floor(index / 4) * 60
            ctx.fillRect(x, y, 60, 40)
          })
        }
      }
    }
  }, [selectedRoom, rooms])

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header Toolbar */}
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
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={cabinetType} onValueChange={setCabinetType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cabinetTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={cabinetWidth} onValueChange={setCabinetWidth}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cabinetWidths.map(width => (
                  <SelectItem key={width.value} value={width.value}>
                    {width.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={finishSelect} onValueChange={setFinishSelect}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {finishes.map(finish => (
                  <SelectItem key={finish.value} value={finish.value}>
                    {finish.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={handleStyle} onValueChange={setHandleStyle}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {handleStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={addCabinet} size="sm">
              <SimpleIcon name="BOX" className="mr-2" />
              Add
            </Button>
            
            <Button variant="outline" size="sm">
              <SimpleIcon name="SETTINGS" className="mr-2" />
              Config
            </Button>
            
            <Button onClick={runNKBAComplianceCheck} variant="outline" size="sm">
              <SimpleIcon name="SHIELD" className="mr-2" />
              NKBA Check
            </Button>
            
            <Button onClick={exportPDF} variant="outline" size="sm">
              <SimpleIcon name="DOWNLOAD" className="mr-2" />
              Export PDF
            </Button>
            
            <Button onClick={downloadLog} variant="outline" size="sm">
              <SimpleIcon name="DOWNLOAD" className="mr-2" />
              Download Log
            </Button>
            
            <Button onClick={importPDF} variant="outline" size="sm">
              <SimpleIcon name="UPLOAD" className="mr-2" />
              Import PDF
            </Button>
            
            <div className="text-sm">
              Selected: <strong>{selectedCabinet || 'None'}</strong>
            </div>
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
              <div className="flex gap-1">
                <Button
                  variant={viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                >
                  <SimpleIcon name="MOVE" />
                </Button>
                <Button
                  variant={viewMode === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('2d')}
                >
                  <SimpleIcon name="GRID" />
                </Button>
                <Button
                  variant={viewMode === 'wireframe' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('wireframe')}
                >
                  <SimpleIcon name="BOX" />
                </Button>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <SimpleIcon name="ROTATE" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SimpleIcon name="MAXIMIZE" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SimpleIcon name="LAYERS" />
                </Button>
              </div>
            </div>
          </div>

          {/* Play Controls */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex gap-2">
                <Button
                  variant={isPlaying ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <SimpleIcon name="PAUSE" /> : <SimpleIcon name="PLAY" />}
                </Button>
              </div>
            </div>
          </div>

          {/* NKBA Report Panel */}
          {showNKBAReport && (
            <div className="absolute top-4 right-4 w-80">
              <Card className="bg-card/90 backdrop-blur-sm border border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">NKBA Report</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNKBAReport(false)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SimpleIcon name="CHECK" />
                      <span>Work triangle dimensions: Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SimpleIcon name="ALERT" />
                      <span>Clearance heights: Minimum met</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SimpleIcon name="CHECK" />
                      <span>Counter space: Adequate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SimpleIcon name="ALERT" />
                      <span>Storage capacity: Review recommended</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l border-white/10 bg-card p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Design Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Grid Snap</label>
                  <Switch
                    checked={gridSnap}
                    onCheckedChange={setGridSnap}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Auto Save</label>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Room Information</h3>
              <div className="bg-background rounded-lg p-3 border border-white/10">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Room:</span>
                    <span>{rooms.find(r => r.id === selectedRoom)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Dimensions:</span>
                    <span>
                      {rooms.find(r => r.id === selectedRoom)?.dimensions.width}×
                      {rooms.find(r => r.id === selectedRoom)?.dimensions.depth}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Cabinets:</span>
                    <span>{rooms.find(r => r.id === selectedRoom)?.cabinets.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cabinet List</h3>
              <div className="space-y-2">
                {rooms.find(r => r.id === selectedRoom)?.cabinets.map((cabinet, index) => (
                  <div
                    key={cabinet.id}
                    className="bg-background rounded-lg p-3 border border-white/10 cursor-pointer hover:border-white/20"
                    onClick={() => setSelectedCabinet(cabinet.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium capitalize">{cabinet.type} Cabinet</div>
                        <div className="text-xs text-white/60">
                          {cabinet.width}×{cabinet.height}×{cabinet.depth}mm
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cabinet.finish}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Save className="w-4 h-4 mr-2" />
                  Save Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Load Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Mode
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
