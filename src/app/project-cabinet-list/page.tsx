'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye,
  ArrowLeft,
  Package,
  Box,
  Ruler,
  Layers,
  Settings,
  Grid3X3,
  List,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Wrench,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Cabinet {
  id: string
  name: string
  type: 'base' | 'wall' | 'tall' | 'sink' | 'cooktop' | 'oven' | 'custom'
  category: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  material: string
  finish: string
  price: number
  quantity: number
  status: 'available' | 'out_of_stock' | 'discontinued'
  supplier: string
  sku: string
  weight: number
  assembly_time: number
  notes: string
  tags: string[]
  created_at: Date
  updated_at: Date
}

export default function ProjectCabinetList() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([
    {
      id: 'cabinet-001',
      name: 'Base Cabinet - Standard 600mm',
      type: 'base',
      category: 'Kitchen',
      dimensions: { width: 600, height: 720, depth: 560 },
      material: 'Plywood',
      finish: 'White Thermofoil',
      price: 299.99,
      quantity: 12,
      status: 'available',
      supplier: 'Kitchen Supplies Co',
      sku: 'KB-600-BASE-WH',
      weight: 45,
      assembly_time: 45,
      notes: 'Standard base cabinet with soft-close hinges',
      tags: ['standard', 'base', 'white'],
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-20')
    },
    {
      id: 'cabinet-002',
      name: 'Wall Cabinet - 800mm Glass Door',
      type: 'wall',
      category: 'Kitchen',
      dimensions: { width: 800, height: 720, depth: 320 },
      material: 'MDF',
      finish: 'Natural Wood',
      price: 389.99,
      quantity: 8,
      status: 'available',
      supplier: 'Premium Cabinets Inc',
      sku: 'KW-800-GLS-NW',
      weight: 28,
      assembly_time: 30,
      notes: 'Glass door wall cabinet with LED lighting',
      tags: ['wall', 'glass', 'premium'],
      created_at: new Date('2024-01-16'),
      updated_at: new Date('2024-01-18')
    },
    {
      id: 'cabinet-003',
      name: 'Tall Pantry Cabinet - 600mm',
      type: 'tall',
      category: 'Kitchen',
      dimensions: { width: 600, height: 2100, depth: 560 },
      material: 'Plywood',
      finish: 'Dark Wood',
      price: 599.99,
      quantity: 4,
      status: 'available',
      supplier: 'Kitchen Supplies Co',
      sku: 'KT-600-PAN-DW',
      weight: 78,
      assembly_time: 90,
      notes: 'Full-height pantry with adjustable shelves',
      tags: ['tall', 'pantry', 'storage'],
      created_at: new Date('2024-01-17'),
      updated_at: new Date('2024-01-19')
    },
    {
      id: 'cabinet-004',
      name: 'Sink Base Cabinet - Double Bowl',
      type: 'sink',
      category: 'Kitchen',
      dimensions: { width: 900, height: 720, depth: 560 },
      material: 'Plywood',
      finish: 'White Thermofoil',
      price: 449.99,
      quantity: 2,
      status: 'out_of_stock',
      supplier: 'Kitchen Supplies Co',
      sku: 'KB-900-SNK-WH',
      weight: 52,
      assembly_time: 60,
      notes: 'Double bowl sink base with plumbing access',
      tags: ['sink', 'base', 'plumbing'],
      created_at: new Date('2024-01-14'),
      updated_at: new Date('2024-01-21')
    },
    {
      id: 'cabinet-005',
      name: 'Oven Cabinet - 600mm',
      type: 'oven',
      category: 'Kitchen',
      dimensions: { width: 600, height: 720, depth: 600 },
      material: 'MDF',
      finish: 'Gray Thermofoil',
      price: 399.99,
      quantity: 6,
      status: 'available',
      supplier: 'Premium Cabinets Inc',
      sku: 'KB-600-OVN-GR',
      weight: 48,
      assembly_time: 50,
      notes: 'Built-in oven cabinet with heat protection',
      tags: ['oven', 'appliance', 'gray'],
      created_at: new Date('2024-01-18'),
      updated_at: new Date('2024-01-20')
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity' | 'created'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', 'Kitchen', 'Bathroom', 'Laundry', 'Garage', 'Custom']
  const types = ['all', 'base', 'wall', 'tall', 'sink', 'cooktop', 'oven', 'custom']
  const statuses = ['all', 'available', 'out_of_stock', 'discontinued']

  const filteredCabinets = cabinets.filter(cabinet => {
    const matchesSearch = cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabinet.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabinet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || cabinet.category === selectedCategory
    const matchesType = selectedType === 'all' || cabinet.type === selectedType
    const matchesStatus = selectedStatus === 'all' || cabinet.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus
  })

  const sortedCabinets = [...filteredCabinets].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = a.price - b.price
        break
      case 'quantity':
        comparison = a.quantity - b.quantity
        break
      case 'created':
        comparison = a.created_at.getTime() - b.created_at.getTime()
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-300'
      case 'out_of_stock': return 'bg-red-500/20 text-red-300'
      case 'discontinued': return 'bg-gray-500/20 text-gray-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-3 h-3" />
      case 'out_of_stock': return <AlertCircle className="w-3 h-3" />
      case 'discontinued': return <AlertCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'base': return <Box className="w-4 h-4" />
      case 'wall': return <Layers className="w-4 h-4" />
      case 'tall': return <Package className="w-4 h-4" />
      case 'sink': return <Wrench className="w-4 h-4" />
      case 'oven': return <Settings className="w-4 h-4" />
      default: return <Box className="w-4 h-4" />
    }
  }

  const exportInventory = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      total_cabinets: cabinets.length,
      total_value: cabinets.reduce((sum, c) => sum + (c.price * c.quantity), 0),
      cabinets: cabinets
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cabinet-inventory-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Inventory exported successfully')
  }

  const deleteCabinet = (id: string) => {
    setCabinets(prev => prev.filter(c => c.id !== id))
    toast.success('Cabinet removed from inventory')
  }

  const duplicateCabinet = (cabinet: Cabinet) => {
    const newCabinet = {
      ...cabinet,
      id: `cabinet-${Date.now()}`,
      name: `${cabinet.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date()
    }
    setCabinets(prev => [newCabinet, ...prev])
    toast.success('Cabinet duplicated')
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
              <Database className="w-4 h-4" />
              <div>
                <h1 className="text-sm font-medium">Project Cabinet List</h1>
                <p className="text-xs text-white/60">Browse all cabinets in the current project</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">Live</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportInventory}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Cabinet
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search cabinets by name, SKU, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status === 'all' ? 'All Statuses' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'quantity' | 'created') => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="created">Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Showing {sortedCabinets.length} of {cabinets.length} cabinets
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Sort:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
            </div>
          </div>
        </div>

        {/* Cabinet Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCabinets.map(cabinet => (
              <Card key={cabinet.id} className="border border-white/10 hover:border-white/20 transition">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(cabinet.type)}
                      <div>
                        <CardTitle className="text-sm line-clamp-2">{cabinet.name}</CardTitle>
                        <CardDescription className="text-xs">{cabinet.sku}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(cabinet.status)}
                      <Badge className={`text-xs ${getStatusColor(cabinet.status)}`}>
                        {cabinet.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-white/60">W:</span>
                      <span className="ml-1">{cabinet.dimensions.width}mm</span>
                    </div>
                    <div>
                      <span className="text-white/60">H:</span>
                      <span className="ml-1">{cabinet.dimensions.height}mm</span>
                    </div>
                    <div>
                      <span className="text-white/60">D:</span>
                      <span className="ml-1">{cabinet.dimensions.depth}mm</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/60">{cabinet.finish}</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${cabinet.price}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/60">Qty: {cabinet.quantity}</span>
                    </div>
                    <div className="text-xs text-white/60">
                      {cabinet.weight}kg
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {cabinet.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {cabinet.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cabinet.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteCabinet(cabinet.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-xs font-medium text-white/60">Cabinet</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">SKU</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Dimensions</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Material/Finish</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Price</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Quantity</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCabinets.map(cabinet => (
                    <tr key={cabinet.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(cabinet.type)}
                          <div>
                            <div className="text-sm font-medium line-clamp-1">{cabinet.name}</div>
                            <div className="text-xs text-white/60">{cabinet.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-xs font-mono">{cabinet.sku}</td>
                      <td className="p-3 text-xs">
                        {cabinet.dimensions.width}×{cabinet.dimensions.height}×{cabinet.dimensions.depth}mm
                      </td>
                      <td className="p-3 text-xs">
                        <div>{cabinet.material}</div>
                        <div className="text-white/60">{cabinet.finish}</div>
                      </td>
                      <td className="p-3 text-sm font-medium">${cabinet.price}</td>
                      <td className="p-3 text-xs">{cabinet.quantity}</td>
                      <td className="p-3">
                        <Badge className={`text-xs ${getStatusColor(cabinet.status)}`}>
                          {cabinet.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteCabinet(cabinet.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedCabinets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Database className="w-16 h-16 text-white/20 mb-4" />
            <p className="text-white/60">No cabinets found</p>
            <p className="text-sm text-white/40">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
