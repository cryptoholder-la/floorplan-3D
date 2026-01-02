'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Scan, 
  Upload, 
  Camera, 
  FileImage, 
  Download, 
  Settings, 
  ArrowLeft,
  Zap,
  Eye,
  Grid3X3,
  Ruler,
  Box,
  Layers,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Maximize2,
  Move3d
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ScanResult {
  id: string
  timestamp: Date
  originalImage: string
  processedImage: string
  dimensions: {
    width: number
    height: number
    depth: number
    unit: 'mm' | 'cm' | 'inches'
  }
  objects: Array<{
    type: string
    position: { x: number; y: number }
    dimensions: { width: number; height: number }
    confidence: number
  }>
  confidence: number
  processingTime: number
}

interface ScanSettings {
  scanMode: 'photo' | 'upload' | 'camera'
  quality: 'low' | 'medium' | 'high'
  detectionSensitivity: number
  autoEnhance: boolean
  showGrid: boolean
  showDimensions: boolean
  unit: 'mm' | 'cm' | 'inches'
}

export default function FloorplanScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null)
  const [viewMode, setViewMode] = useState<'original' | 'processed' | '3d'>('processed')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [scanSettings, setScanSettings] = useState<ScanSettings>({
    scanMode: 'upload',
    quality: 'high',
    detectionSensitivity: 75,
    autoEnhance: true,
    showGrid: true,
    showDimensions: true,
    unit: 'mm'
  })

  const scanModes = [
    { value: 'photo', label: 'Photo Analysis', icon: Camera },
    { value: 'upload', label: 'Upload Image', icon: Upload },
    { value: 'camera', label: 'Live Camera', icon: Camera }
  ]

  const qualityOptions = [
    { value: 'low', label: 'Fast (Low Quality)' },
    { value: 'medium', label: 'Balanced' },
    { value: 'high', label: 'Detailed (High Quality)' }
  ]

  const unitOptions = [
    { value: 'mm', label: 'Millimeters (mm)' },
    { value: 'cm', label: 'Centimeters (cm)' },
    { value: 'inches', label: 'Inches (in)' }
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        toast.success('Image uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  const performScan = useCallback(async () => {
    if (!uploadedImage && scanSettings.scanMode === 'upload') {
      toast.error('Please upload an image first')
      return
    }

    setIsScanning(true)
    
    // Simulate AI processing
    const startTime = Date.now()
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const processingTime = Date.now() - startTime
    
    // Mock scan result
    const mockResult: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date(),
      originalImage: uploadedImage || '/api/placeholder/800/600',
      processedImage: uploadedImage || '/api/placeholder/800/600',
      dimensions: {
        width: 4000,
        height: 3000,
        depth: 2400,
        unit: scanSettings.unit
      },
      objects: [
        {
          type: 'wall',
          position: { x: 0, y: 0 },
          dimensions: { width: 4000, height: 2400 },
          confidence: 0.95
        },
        {
          type: 'door',
          position: { x: 800, y: 0 },
          dimensions: { width: 800, height: 2000 },
          confidence: 0.88
        },
        {
          type: 'window',
          position: { x: 2000, y: 400 },
          dimensions: { width: 1200, height: 1200 },
          confidence: 0.92
        },
        {
          type: 'cabinet',
          position: { x: 400, y: 400 },
          dimensions: { width: 600, height: 600 },
          confidence: 0.78
        },
        {
          type: 'cabinet',
          position: { x: 1200, y: 400 },
          dimensions: { width: 600, height: 600 },
          confidence: 0.75
        }
      ],
      confidence: 0.85,
      processingTime
    }
    
    setScanResults(prev => [mockResult, ...prev])
    setSelectedResult(mockResult)
    setIsScanning(false)
    
    toast.success(`Scan completed in ${(processingTime / 1000).toFixed(1)}s with ${mockResult.confidence * 100}% confidence`)
  }, [uploadedImage, scanSettings])

  const exportResults = () => {
    if (!selectedResult) return
    
    const exportData = {
      timestamp: selectedResult.timestamp,
      dimensions: selectedResult.dimensions,
      objects: selectedResult.objects,
      confidence: selectedResult.confidence,
      settings: scanSettings
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `floorplan-scan-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Scan results exported')
  }

  const clearResults = () => {
    setScanResults([])
    setSelectedResult(null)
    setUploadedImage(null)
    toast.success('Results cleared')
  }

  useEffect(() => {
    // Draw processed image on canvas
    if (canvasRef.current && selectedResult) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = '#1a2230'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw grid if enabled
        if (scanSettings.showGrid) {
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
        
        // Draw detected objects
        selectedResult.objects.forEach((obj, index) => {
          const scale = 0.15 // Scale down for display
          const x = 50 + obj.position.x * scale / 10
          const y = 50 + obj.position.y * scale / 10
          const width = obj.dimensions.width * scale / 10
          const height = obj.dimensions.height * scale / 10
          
          // Different colors for different object types
          const colors = {
            wall: '#60a5fa',
            door: '#10b981',
            window: '#8b5cf6',
            cabinet: '#f59e0b',
            appliance: '#ef4444'
          }
          
          ctx.fillStyle = colors[obj.type as keyof typeof colors] || '#6b7280'
          ctx.globalAlpha = obj.confidence
          ctx.fillRect(x, y, width, height)
          ctx.globalAlpha = 1
          
          // Draw border
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, width, height)
          
          // Draw label
          ctx.fillStyle = '#ffffff'
          ctx.font = '12px sans-serif'
          ctx.fillText(obj.type, x + 5, y - 5)
          
          // Draw dimensions if enabled
          if (scanSettings.showDimensions) {
            ctx.fillStyle = '#fbbf24'
            ctx.font = '10px monospace'
            ctx.fillText(
              `${obj.dimensions.width}${scanSettings.unit}`,
              x + width / 2 - 20,
              y + height + 15
            )
          }
        })
        
        // Draw room dimensions
        if (scanSettings.showDimensions) {
          ctx.fillStyle = '#60a5fa'
          ctx.font = 'bold 14px sans-serif'
          ctx.fillText(
            `Room: ${selectedResult.dimensions.width}×${selectedResult.dimensions.height}×${selectedResult.dimensions.depth} ${selectedResult.dimensions.unit}`,
            50,
            canvas.height - 20
          )
        }
      }
    }
  }, [selectedResult, scanSettings])

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
            <div className="text-sm font-medium">Floorplan Scanner</div>
            <Badge variant="secondary" className="text-xs">AI-Powered Dimension Generation</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={performScan}
              disabled={isScanning || (!uploadedImage && scanSettings.scanMode === 'upload')}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Floorplan
                </>
              )}
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportResults} disabled={!selectedResult}>
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            
            <Button variant="outline" size="sm" onClick={clearResults}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Scanner */}
          <div className="w-1/2 border-r border-white/10 p-4">
            <div className="space-y-4">
              {/* Scan Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Scan Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm">Scan Mode</label>
                    <Select 
                      value={scanSettings.scanMode} 
                      onValueChange={(value: 'photo' | 'upload' | 'camera') =>
                        setScanSettings(prev => ({ ...prev, scanMode: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scanModes.map(mode => {
                          const Icon = mode.icon
                          return (
                            <SelectItem key={mode.value} value={mode.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {mode.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm">Quality</label>
                    <Select 
                      value={scanSettings.quality} 
                      onValueChange={(value: 'low' | 'medium' | 'high') =>
                        setScanSettings(prev => ({ ...prev, quality: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm">Detection Sensitivity</label>
                    <Slider
                      value={[scanSettings.detectionSensitivity]}
                      onValueChange={(value) =>
                        setScanSettings(prev => ({ ...prev, detectionSensitivity: value[0] }))
                      }
                      max={100}
                      min={10}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{scanSettings.detectionSensitivity}%</span>
                  </div>
                  
                  <div>
                    <label className="text-sm">Units</label>
                    <Select 
                      value={scanSettings.unit} 
                      onValueChange={(value: 'mm' | 'cm' | 'inches') =>
                        setScanSettings(prev => ({ ...prev, unit: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Auto Enhance</label>
                    <Switch
                      checked={scanSettings.autoEnhance}
                      onCheckedChange={(checked) =>
                        setScanSettings(prev => ({ ...prev, autoEnhance: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show Grid</label>
                    <Switch
                      checked={scanSettings.showGrid}
                      onCheckedChange={(checked) =>
                        setScanSettings(prev => ({ ...prev, showGrid: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Show Dimensions</label>
                    <Switch
                      checked={scanSettings.showDimensions}
                      onCheckedChange={(checked) =>
                        setScanSettings(prev => ({ ...prev, showDimensions: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              {scanSettings.scanMode === 'upload' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Floorplan
                    </CardTitle>
                    <CardDescription>
                      Upload a floorplan image for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-white/40" />
                      <div className="space-y-2">
                        <p className="text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs text-white/60">PNG, JPG, GIF up to 10MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                    
                    {uploadedImage && (
                      <div className="mt-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded floorplan" 
                          className="w-full rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="w-1/2 p-4">
            <div className="space-y-4">
              {/* View Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Scan Results</h3>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'original' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('original')}
                  >
                    <FileImage className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'processed' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('processed')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === '3d' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('3d')}
                  >
                    <Move3d className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Scan Result Display */}
              {selectedResult ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Scan from {selectedResult.timestamp.toLocaleTimeString()}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedResult.confidence > 0.8 ? 'default' : 'secondary'}>
                          {(selectedResult.confidence * 100).toFixed(0)}% Confidence
                        </Badge>
                        <Badge variant="outline">
                          {selectedResult.processingTime}ms
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Canvas for processed view */}
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full border border-white/10 rounded-lg"
                      />
                      
                      {/* Dimensions Summary */}
                      <div className="bg-background rounded-lg p-3 border border-white/10">
                        <h4 className="text-sm font-medium mb-2">Room Dimensions</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-white/60">Width:</span>
                            <span className="ml-2">{selectedResult.dimensions.width} {selectedResult.dimensions.unit}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Height:</span>
                            <span className="ml-2">{selectedResult.dimensions.height} {selectedResult.dimensions.unit}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Depth:</span>
                            <span className="ml-2">{selectedResult.dimensions.depth} {selectedResult.dimensions.unit}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Detected Objects */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Detected Objects</h4>
                        <div className="space-y-2">
                          {selectedResult.objects.map((obj, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-background rounded border border-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm capitalize">{obj.type}</span>
                              </div>
                              <div className="text-xs text-white/60">
                                {obj.dimensions.width}×{obj.dimensions.height} {selectedResult.dimensions.unit} ({(obj.confidence * 100).toFixed(0)}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Scan className="w-16 h-16 text-white/20 mb-4" />
                    <p className="text-white/60">No scan results yet</p>
                    <p className="text-sm text-white/40">Upload an image and click "Scan Floorplan" to begin</p>
                  </CardContent>
                </Card>
              )}

              {/* Previous Scans */}
              {scanResults.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Previous Scans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scanResults.slice(1).map(result => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-2 bg-background rounded border border-white/10 cursor-pointer hover:border-white/20"
                          onClick={() => setSelectedResult(result)}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{result.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <Badge variant="outline">
                            {(result.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
