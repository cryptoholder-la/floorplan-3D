'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Gauge, 
  Download, 
  Upload, 
  Settings, 
  ArrowLeft,
  FileText,
  Package,
  Ruler,
  Scissors,
  Printer,
  QrCode,
  Barcode,
  Layers,
  Grid3X3,
  Calculator,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  Wrench,
  Zap,
  Eye,
  RefreshCw,
  Play
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CutlistItem {
  id: string
  cabinet_id: string
  cabinet_name: string
  part_name: string
  material: string
  thickness: number
  quantity: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  grain_direction: 'horizontal' | 'vertical' | 'none'
  edge_banding: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }
  cnc_operations: {
    drilling: boolean
    routing: boolean
    cutting: boolean
    engraving: boolean
  }
  notes: string
  barcode: string
  estimated_time: number
  cost: number
}

interface CutlistSettings {
  material_waste: number
  blade_kerf: number
  optimize_nesting: boolean
  generate_barcodes: boolean
  include_time_estimates: boolean
  include_costing: boolean
  output_format: 'pdf' | 'csv' | 'xml' | 'dxf'
  sheet_size: '4x8' | '4x10' | '5x8' | 'custom'
  custom_sheet_size: { width: number; height: number }
}

export default function CNCCutlist() {
  const [cutlistItems, setCutlistItems] = useState<CutlistItem[]>([
    {
      id: 'part-001',
      cabinet_id: 'cabinet-001',
      cabinet_name: 'Base Cabinet - Standard 600mm',
      part_name: 'Left Side Panel',
      material: 'Plywood',
      thickness: 18,
      quantity: 1,
      dimensions: { width: 560, height: 720, depth: 18 },
      grain_direction: 'vertical',
      edge_banding: { top: true, bottom: true, left: false, right: false },
      cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
      notes: 'Standard side panel with hinge holes',
      barcode: 'KB-600-BS-LSP-001',
      estimated_time: 12,
      cost: 24.50
    },
    {
      id: 'part-002',
      cabinet_id: 'cabinet-001',
      cabinet_name: 'Base Cabinet - Standard 600mm',
      part_name: 'Right Side Panel',
      material: 'Plywood',
      thickness: 18,
      quantity: 1,
      dimensions: { width: 560, height: 720, depth: 18 },
      grain_direction: 'vertical',
      edge_banding: { top: true, bottom: true, left: false, right: false },
      cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
      notes: 'Standard side panel with hinge holes',
      barcode: 'KB-600-BS-RSP-001',
      estimated_time: 12,
      cost: 24.50
    },
    {
      id: 'part-003',
      cabinet_id: 'cabinet-001',
      cabinet_name: 'Base Cabinet - Standard 600mm',
      part_name: 'Bottom Panel',
      material: 'Plywood',
      thickness: 18,
      quantity: 1,
      dimensions: { width: 564, height: 564, depth: 18 },
      grain_direction: 'horizontal',
      edge_banding: { top: false, bottom: false, left: true, right: true },
      cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
      notes: 'Bottom panel with support holes',
      barcode: 'KB-600-BS-BTM-001',
      estimated_time: 8,
      cost: 18.75
    },
    {
      id: 'part-004',
      cabinet_id: 'cabinet-001',
      cabinet_name: 'Base Cabinet - Standard 600mm',
      part_name: 'Back Panel',
      material: 'Hardboard',
      thickness: 3,
      quantity: 1,
      dimensions: { width: 600, height: 720, depth: 3 },
      grain_direction: 'none',
      edge_banding: { top: false, bottom: false, left: false, right: false },
      cnc_operations: { drilling: false, routing: false, cutting: true, engraving: false },
      notes: 'Thin back panel',
      barcode: 'KB-600-BS-BKP-001',
      estimated_time: 5,
      cost: 8.25
    },
    {
      id: 'part-005',
      cabinet_id: 'cabinet-002',
      cabinet_name: 'Wall Cabinet - 800mm Glass Door',
      part_name: 'Left Side Panel',
      material: 'MDF',
      thickness: 18,
      quantity: 1,
      dimensions: { width: 320, height: 720, depth: 18 },
      grain_direction: 'vertical',
      edge_banding: { top: true, bottom: true, left: false, right: false },
      cnc_operations: { drilling: true, routing: true, cutting: true, engraving: false },
      notes: 'Wall cabinet side with shelf pin holes',
      barcode: 'KW-800-GLS-LSP-001',
      estimated_time: 10,
      cost: 15.80
    }
  ])

  const [cutlistSettings, setCutlistSettings] = useState<CutlistSettings>({
    material_waste: 15,
    blade_kerf: 3,
    optimize_nesting: true,
    generate_barcodes: true,
    include_time_estimates: true,
    include_costing: true,
    output_format: 'pdf',
    sheet_size: '4x8',
    custom_sheet_size: { width: 2440, height: 1220 }
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'nesting' | 'barcodes'>('list')

  const outputFormats = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'xml', label: 'XML for CNC' },
    { value: 'dxf', label: 'DXF Drawing' }
  ]

  const sheetSizes = [
    { value: '4x8', label: '4×8 feet (1220×2440mm)' },
    { value: '4x10', label: '4×10 feet (1220×3050mm)' },
    { value: '5x8', label: '5×8 feet (1524×2440mm)' },
    { value: 'custom', label: 'Custom Size' }
  ]

  const materials = ['Plywood', 'MDF', 'Hardboard', 'Particle Board', 'Solid Wood']

  const totalCost = cutlistItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
  const totalTime = cutlistItems.reduce((sum, item) => sum + (item.estimated_time * item.quantity), 0)
  const totalPieces = cutlistItems.reduce((sum, item) => sum + item.quantity, 0)

  const generateCutlist = async () => {
    setIsGenerating(true)
    
    // Simulate CNC processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    toast.success('Cutlist generated successfully')
  }

  const exportCutlist = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      settings: cutlistSettings,
      summary: {
        total_pieces: totalPieces,
        total_cost: totalCost,
        total_time: totalTime,
        material_breakdown: materials.reduce((acc, material) => {
          const items = cutlistItems.filter(item => item.material === material)
          acc[material] = {
            count: items.reduce((sum, item) => sum + item.quantity, 0),
            cost: items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
          }
          return acc
        }, {} as Record<string, { count: number; cost: number }>)
      },
      items: cutlistItems
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cnc-cutlist-${Date.now()}.${cutlistSettings.output_format}`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success(`Cutlist exported as ${cutlistSettings.outputFormat.toUpperCase()}`)
  }

  const generateBarcodes = () => {
    toast.info('Generating barcodes for all parts...')
    // In a real implementation, this would generate actual barcode images
  }

  const optimizeNesting = () => {
    toast.info('Optimizing material nesting...')
    // In a real implementation, this would run nesting optimization algorithm
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(cutlistItems.map(item => item.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-card">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard-10-10">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <div>
                <h1 className="text-sm font-medium">CNC Cutlist</h1>
                <p className="text-xs text-white/60">Detailed parts and barcodes</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">CNC</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateCutlist}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
            
            <Button variant="outline" size="sm" onClick={optimizeNesting}>
              <Grid3X3 className="w-4 h-4 mr-2" />
              Optimize
            </Button>
            
            <Button variant="outline" size="sm" onClick={generateBarcodes}>
              <QrCode className="w-4 h-4 mr-2" />
              Barcodes
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportCutlist}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Cutlist Items */}
          <div className="w-3/5 border-r border-white/10 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-white/60">Total Pieces</p>
                        <p className="text-lg font-semibold">{totalPieces}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-white/60">Total Cost</p>
                        <p className="text-lg font-semibold">${totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-white/60">Est. Time</p>
                        <p className="text-lg font-semibold">{totalTime}min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'nesting' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('nesting')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'barcodes' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('barcodes')}
                  >
                    <Barcode className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAllItems}>
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                  <span className="text-xs text-white/60">
                    {selectedItems.length} selected
                  </span>
                </div>
              </div>

              {/* Cutlist Items */}
              {viewMode === 'list' && (
                <div className="space-y-2">
                  {cutlistItems.map(item => (
                    <Card 
                      key={item.id} 
                      className={`border cursor-pointer transition ${
                        selectedItems.includes(item.id) 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-medium">{item.part_name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {item.material}
                              </Badge>
                              {cutlistSettings.generate_barcodes && (
                                <Badge variant="secondary" className="text-xs">
                                  <Barcode className="w-3 h-3 mr-1" />
                                  {item.barcode}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-xs text-white/60 mb-2">
                              {item.cabinet_name}
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                              <div>
                                <span className="text-white/60">Dimensions:</span>
                                <div>{item.dimensions.width}×{item.dimensions.height}×{item.thickness}mm</div>
                              </div>
                              <div>
                                <span className="text-white/60">Quantity:</span>
                                <div>{item.quantity}</div>
                              </div>
                              <div>
                                <span className="text-white/60">Time:</span>
                                <div>{item.estimated_time}min each</div>
                              </div>
                              <div>
                                <span className="text-white/60">Cost:</span>
                                <div>${item.cost.toFixed(2)} each</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-white/60">Grain:</span>
                                <span className="capitalize">{item.grain_direction}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <span className="text-white/60">Operations:</span>
                                <div className="flex gap-1">
                                  {item.cnc_operations.drilling && <Scissors className="w-3 h-3" />}
                                  {item.cnc_operations.routing && <Wrench className="w-3 h-3" />}
                                  {item.cnc_operations.cutting && <Scissors className="w-3 h-3" />}
                                  {item.cnc_operations.engraving && <Eye className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                            
                            {item.notes && (
                              <div className="mt-2 text-xs text-white/60 italic">
                                {item.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <div className="text-lg font-semibold">
                              ${(item.cost * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Nesting View */}
              {viewMode === 'nesting' && (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                      <h3 className="text-lg font-medium mb-2">Material Nesting Optimization</h3>
                      <p className="text-sm text-white/60 mb-4">
                        Visual representation of how parts will be laid out on material sheets
                      </p>
                      
                      <div className="bg-background border border-white/10 rounded-lg p-4 max-w-md mx-auto">
                        <div className="aspect-video bg-white/5 rounded border-2 border-dashed border-white/20 flex items-center justify-center">
                          <div className="text-center">
                            <Grid3X3 className="w-8 h-8 mx-auto mb-2 text-white/40" />
                            <p className="text-xs text-white/40">Nesting visualization</p>
                            <p className="text-xs text-white/40">4×8 sheet layout</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Material Utilization:</span>
                          <div className="font-medium">87.3%</div>
                        </div>
                        <div>
                          <span className="text-white/60">Sheets Required:</span>
                          <div className="font-medium">3 sheets</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Barcodes View */}
              {viewMode === 'barcodes' && (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Barcode className="w-16 h-16 mx-auto mb-4 text-white/20" />
                      <h3 className="text-lg font-medium mb-2">Barcode Generation</h3>
                      <p className="text-sm text-white/60 mb-4">
                        Machine-readable barcodes for part tracking and identification
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {cutlistItems.slice(0, 6).map(item => (
                          <div key={item.id} className="bg-background border border-white/10 rounded-lg p-3">
                            <div className="bg-white rounded p-2 mb-2">
                              <div className="h-16 bg-black rounded flex items-center justify-center">
                                <Barcode className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            <div className="text-xs text-center">
                              <div className="font-medium truncate">{item.barcode}</div>
                              <div className="text-white/60 truncate">{item.part_name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Panel - Settings */}
          <div className="w-2/5 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Cutlist Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Cutlist Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm">Output Format</label>
                    <Select 
                      value={cutlistSettings.output_format} 
                      onValueChange={(value: 'pdf' | 'csv' | 'xml' | 'dxf') =>
                        setCutlistSettings(prev => ({ ...prev, output_format: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {outputFormats.map(format => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm">Sheet Size</label>
                    <Select 
                      value={cutlistSettings.sheet_size} 
                      onValueChange={(value: '4x8' | '4x10' | '5x8' | 'custom') =>
                        setCutlistSettings(prev => ({ ...prev, sheet_size: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sheetSizes.map(size => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm">Material Waste Allowance</label>
                    <Slider
                      value={[cutlistSettings.material_waste]}
                      onValueChange={(value) =>
                        setCutlistSettings(prev => ({ ...prev, material_waste: value[0] }))
                      }
                      max={30}
                      min={5}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{cutlistSettings.material_waste}%</span>
                  </div>
                  
                  <div>
                    <label className="text-sm">Blade Kerf</label>
                    <Slider
                      value={[cutlistSettings.blade_kerf]}
                      onValueChange={(value) =>
                        setCutlistSettings(prev => ({ ...prev, blade_kerf: value[0] }))
                      }
                      max={10}
                      min={1}
                      className="w-full"
                    />
                    <span className="text-xs text-white/60">{cutlistSettings.blade_kerf}mm</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Optimize Nesting</label>
                      <Switch
                        checked={cutlistSettings.optimize_nesting}
                        onCheckedChange={(checked) =>
                          setCutlistSettings(prev => ({ ...prev, optimize_nesting: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Generate Barcodes</label>
                      <Switch
                        checked={cutlistSettings.generate_barcodes}
                        onCheckedChange={(checked) =>
                          setCutlistSettings(prev => ({ ...prev, generate_barcodes: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Include Time Estimates</label>
                      <Switch
                        checked={cutlistSettings.include_time_estimates}
                        onCheckedChange={(checked) =>
                          setCutlistSettings(prev => ({ ...prev, include_time_estimates: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Include Costing</label>
                      <Switch
                        checked={cutlistSettings.include_costing}
                        onCheckedChange={(checked) =>
                          setCutlistSettings(prev => ({ ...prev, include_costing: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Material Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Material Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materials.map(material => {
                      const items = cutlistItems.filter(item => item.material === material)
                      const count = items.reduce((sum, item) => sum + item.quantity, 0)
                      const cost = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
                      
                      if (count === 0) return null
                      
                      return (
                        <div key={material} className="flex items-center justify-between p-3 bg-background rounded border border-white/10">
                          <div>
                            <div className="text-sm font-medium">{material}</div>
                            <div className="text-xs text-white/60">{count} pieces</div>
                          </div>
                          <div className="text-sm font-medium">${cost.toFixed(2)}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="w-4 h-4 mr-2" />
                    Order Materials
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 mr-2" />
                    Cost Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Send to CNC
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
