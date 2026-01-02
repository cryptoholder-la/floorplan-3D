'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Settings, 
  Plus, 
  Save, 
  Upload, 
  Download, 
  Code, 
  FileJson, 
  ArrowLeft,
  Box,
  Layers,
  Ruler,
  Wrench,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  Zap,
  Grid3X3,
  Package,
  Cpu,
  Hammer
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface TemplatePart {
  id: string
  name: string
  type: 'panel' | 'door' | 'drawer' | 'shelf' | 'frame' | 'hardware'
  material: string
  thickness: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  operations: {
    drilling: boolean
    routing: boolean
    cutting: boolean
    assembly: boolean
  }
  constraints: {
    min_width: number
    max_width: number
    min_height: number
    max_height: number
  }
  pricing: {
    base_cost: number
    cost_per_mm2: number
    labor_cost: number
  }
  metadata: {
    category: string
    tags: string[]
    description: string
    version: string
  }
}

interface CabinetTemplate {
  id: string
  name: string
  category: 'base' | 'wall' | 'tall' | 'sink' | 'oven' | 'custom'
  description: string
  parts: TemplatePart[]
  dimensions: {
    standard_width: number
    standard_height: number
    standard_depth: number
  }
  construction: {
    joinery_type: 'dowel' | 'mortise' | 'cam' | 'screw'
    assembly_time: number
    skill_level: 'beginner' | 'intermediate' | 'advanced'
  }
  metadata: {
    created_at: Date
    updated_at: Date
    version: string
    author: string
    tags: string[]
  }
}

export default function TemplateBuilder() {
  const [templates, setTemplates] = useState<CabinetTemplate[]>([
    {
      id: 'template-001',
      name: 'Standard Base Cabinet',
      category: 'base',
      description: 'Standard kitchen base cabinet with adjustable shelves',
      parts: [
        {
          id: 'part-001',
          name: 'Left Side Panel',
          type: 'panel',
          material: 'Plywood',
          thickness: 18,
          dimensions: { width: 560, height: 720, depth: 18 },
          operations: { drilling: true, routing: false, cutting: true, assembly: true },
          constraints: { min_width: 300, max_width: 1200, min_height: 600, max_height: 900 },
          pricing: { base_cost: 15.00, cost_per_mm2: 0.0002, labor_cost: 8.00 },
          metadata: {
            category: 'structural',
            tags: ['side', 'panel', 'vertical'],
            description: 'Left side panel with hinge holes',
            version: '1.0'
          }
        },
        {
          id: 'part-002',
          name: 'Right Side Panel',
          type: 'panel',
          material: 'Plywood',
          thickness: 18,
          dimensions: { width: 560, height: 720, depth: 18 },
          operations: { drilling: true, routing: false, cutting: true, assembly: true },
          constraints: { min_width: 300, max_width: 1200, min_height: 600, max_height: 900 },
          pricing: { base_cost: 15.00, cost_per_mm2: 0.0002, labor_cost: 8.00 },
          metadata: {
            category: 'structural',
            tags: ['side', 'panel', 'vertical'],
            description: 'Right side panel with hinge holes',
            version: '1.0'
          }
        },
        {
          id: 'part-003',
          name: 'Bottom Panel',
          type: 'panel',
          material: 'Plywood',
          thickness: 18,
          dimensions: { width: 564, height: 564, depth: 18 },
          operations: { drilling: true, routing: false, cutting: true, assembly: true },
          constraints: { min_width: 300, max_width: 1200, min_height: 300, max_width: 1200 },
          pricing: { base_cost: 12.00, cost_per_mm2: 0.0002, labor_cost: 6.00 },
          metadata: {
            category: 'structural',
            tags: ['bottom', 'panel', 'horizontal'],
            description: 'Bottom panel with support holes',
            version: '1.0'
          }
        }
      ],
      dimensions: {
        standard_width: 600,
        standard_height: 720,
        standard_depth: 560
      },
      construction: {
        joinery_type: 'cam',
        assembly_time: 45,
        skill_level: 'intermediate'
      },
      metadata: {
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-20'),
        version: '1.2',
        author: 'System Admin',
        tags: ['standard', 'base', 'kitchen']
      }
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<CabinetTemplate | null>(null)
  const [selectedPart, setSelectedPart] = useState<TemplatePart | null>(null)
  const [viewMode, setViewMode] = useState<'templates' | 'editor' | 'preview'>('templates')
  const [showJson, setShowJson] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const categories = ['base', 'wall', 'tall', 'sink', 'oven', 'custom']
  const partTypes = ['panel', 'door', 'drawer', 'shelf', 'frame', 'hardware']
  const materials = ['Plywood', 'MDF', 'Hardboard', 'Particle Board', 'Solid Wood']
  const joineryTypes = ['dowel', 'mortise', 'cam', 'screw']
  const skillLevels = ['beginner', 'intermediate', 'advanced']

  const createNewTemplate = () => {
    const newTemplate: CabinetTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Cabinet Template',
      category: 'base',
      description: 'Custom cabinet template',
      parts: [],
      dimensions: {
        standard_width: 600,
        standard_height: 720,
        standard_depth: 560
      },
      construction: {
        joinery_type: 'cam',
        assembly_time: 30,
        skill_level: 'intermediate'
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        version: '1.0',
        author: 'Current User',
        tags: ['custom', 'new']
      }
    }
    
    setTemplates(prev => [newTemplate, ...prev])
    setSelectedTemplate(newTemplate)
    setViewMode('editor')
    setIsEditing(true)
    toast.success('New template created')
  }

  const saveTemplate = () => {
    if (!selectedTemplate) return
    
    setTemplates(prev => prev.map(template => 
      template.id === selectedTemplate.id 
        ? { ...selectedTemplate, metadata: { ...selectedTemplate.metadata, updated_at: new Date() } }
        : template
    ))
    
    setIsEditing(false)
    toast.success('Template saved successfully')
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
    toast.success('Template deleted')
  }

  const duplicateTemplate = (template: CabinetTemplate) => {
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      metadata: {
        ...template.metadata,
        created_at: new Date(),
        updated_at: new Date(),
        version: '1.0'
      }
    }
    
    setTemplates(prev => [newTemplate, ...prev])
    toast.success('Template duplicated')
  }

  const exportTemplate = () => {
    if (!selectedTemplate) return
    
    const exportData = JSON.stringify(selectedTemplate, null, 2)
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTemplate.name.replace(/\s+/g, '-')}-template.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Template exported')
  }

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string)
          template.id = `template-${Date.now()}`
          template.metadata.created_at = new Date()
          template.metadata.updated_at = new Date()
          
          setTemplates(prev => [template, ...prev])
          toast.success('Template imported successfully')
        } catch (error) {
          toast.error('Invalid template file')
        }
      }
      reader.readAsText(file)
    }
  }

  const addPart = () => {
    if (!selectedTemplate) return
    
    const newPart: TemplatePart = {
      id: `part-${Date.now()}`,
      name: 'New Part',
      type: 'panel',
      material: 'Plywood',
      thickness: 18,
      dimensions: { width: 600, height: 400, depth: 18 },
      operations: { drilling: false, routing: false, cutting: true, assembly: true },
      constraints: { min_width: 100, max_width: 2000, min_height: 100, max_height: 2000 },
      pricing: { base_cost: 10.00, cost_per_mm2: 0.0001, labor_cost: 5.00 },
      metadata: {
        category: 'custom',
        tags: ['new'],
        description: 'Custom cabinet part',
        version: '1.0'
      }
    }
    
    setSelectedTemplate(prev => prev ? {
      ...prev,
      parts: [...prev.parts, newPart]
    } : null)
    
    toast.success('Part added to template')
  }

  const updateTemplate = (field: string, value: any) => {
    if (!selectedTemplate) return
    
    setSelectedTemplate(prev => prev ? {
      ...prev,
      [field]: value
    } : null)
  }

  const updatePart = (partId: string, field: string, value: any) => {
    if (!selectedTemplate) return
    
    setSelectedTemplate(prev => prev ? {
      ...prev,
      parts: prev.parts.map(part => 
        part.id === partId ? { ...part, [field]: value } : part
      )
    } : null)
  }

  const deletePart = (partId: string) => {
    if (!selectedTemplate) return
    
    setSelectedTemplate(prev => prev ? {
      ...prev,
      parts: prev.parts.filter(part => part.id !== partId)
    } : null)
    
    if (selectedPart?.id === partId) {
      setSelectedPart(null)
    }
    
    toast.success('Part removed from template')
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
              <Settings className="w-4 h-4" />
              <div>
                <h1 className="text-sm font-medium">Template Builder</h1>
                <p className="text-xs text-white/60">Define custom cabinet parts (JSON)</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">Configuration</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedTemplate && (
              <>
                <Button
                  variant={isEditing ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
                
                <Button variant="outline" size="sm" onClick={saveTemplate} disabled={!isEditing}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                
                <Button variant="outline" size="sm" onClick={exportTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            
            <Button variant="outline" size="sm">
              <label className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importTemplate}
                  className="hidden"
                />
              </label>
            </Button>
            
            <Button size="sm" onClick={createNewTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Templates List */}
          {viewMode === 'templates' && (
            <div className="w-full p-4">
              <div className="space-y-4">
                {/* View Controls */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Cabinet Templates</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={showJson ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setShowJson(!showJson)}
                    >
                      <FileJson className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map(template => (
                    <Card 
                      key={template.id} 
                      className="border border-white/10 hover:border-white/20 transition cursor-pointer"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setViewMode('editor')
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm line-clamp-2">{template.name}</CardTitle>
                            <CardDescription className="text-xs">{template.category}</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            v{template.metadata.version}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-white/60 line-clamp-2">{template.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-white/60">Parts:</span>
                            <div>{template.parts.length}</div>
                          </div>
                          <div>
                            <span className="text-white/60">Assembly:</span>
                            <div>{template.construction.assembly_time}min</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.metadata.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateTemplate(template)
                            }}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTemplate(template.id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* JSON View */}
                {showJson && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileJson className="w-4 h-4" />
                        Template Definitions (JSON)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-black/50 rounded p-4 text-xs overflow-x-auto">
                        {JSON.stringify(templates, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Template Editor */}
          {viewMode === 'editor' && selectedTemplate && (
            <div className="w-full p-4">
              <div className="space-y-6">
                {/* Template Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('templates')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Templates
                    </Button>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedTemplate.name}</h2>
                      <p className="text-sm text-white/60">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'preview' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Template Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Template Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Name</label>
                        <Input
                          value={selectedTemplate.name}
                          onChange={(e) => updateTemplate('name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Category</label>
                        <Select 
                          value={selectedTemplate.category} 
                          onValueChange={(value) => updateTemplate('category', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Version</label>
                        <Input
                          value={selectedTemplate.metadata.version}
                          onChange={(e) => updateTemplate('metadata', {
                            ...selectedTemplate.metadata,
                            version: e.target.value
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Description</label>
                      <Input
                        value={selectedTemplate.description}
                        onChange={(e) => updateTemplate('description', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Standard Width</label>
                        <Input
                          type="number"
                          value={selectedTemplate.dimensions.standard_width}
                          onChange={(e) => updateTemplate('dimensions', {
                            ...selectedTemplate.dimensions,
                            standard_width: parseInt(e.target.value) || 0
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Standard Height</label>
                        <Input
                          type="number"
                          value={selectedTemplate.dimensions.standard_height}
                          onChange={(e) => updateTemplate('dimensions', {
                            ...selectedTemplate.dimensions,
                            standard_height: parseInt(e.target.value) || 0
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Standard Depth</label>
                        <Input
                          type="number"
                          value={selectedTemplate.dimensions.standard_depth}
                          onChange={(e) => updateTemplate('dimensions', {
                            ...selectedTemplate.dimensions,
                            standard_depth: parseInt(e.target.value) || 0
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parts List */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Template Parts</CardTitle>
                      <Button size="sm" onClick={addPart} disabled={!isEditing}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Part
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedTemplate.parts.map(part => (
                        <div
                          key={part.id}
                          className={`border rounded-lg p-3 cursor-pointer transition ${
                            selectedPart?.id === part.id 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedPart(part)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                                <Box className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{part.name}</div>
                                <div className="text-xs text-white/60">
                                  {part.type} • {part.material} • {part.thickness}mm
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {part.dimensions.width}×{part.dimensions.height}mm
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deletePart(part.id)
                                }}
                                disabled={!isEditing}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Part Editor */}
                {selectedPart && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Edit Part: {selectedPart.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Part Name</label>
                          <Input
                            value={selectedPart.name}
                            onChange={(e) => updatePart(selectedPart.id, 'name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Type</label>
                          <Select 
                            value={selectedPart.type} 
                            onValueChange={(value) => updatePart(selectedPart.id, 'type', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {partTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Material</label>
                          <Select 
                            value={selectedPart.material} 
                            onValueChange={(value) => updatePart(selectedPart.id, 'material', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {materials.map(material => (
                                <SelectItem key={material} value={material}>
                                  {material}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Width (mm)</label>
                          <Input
                            type="number"
                            value={selectedPart.dimensions.width}
                            onChange={(e) => updatePart(selectedPart.id, 'dimensions', {
                              ...selectedPart.dimensions,
                              width: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Height (mm)</label>
                          <Input
                            type="number"
                            value={selectedPart.dimensions.height}
                            onChange={(e) => updatePart(selectedPart.id, 'dimensions', {
                              ...selectedPart.dimensions,
                              height: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/60 mb-1 block">Thickness (mm)</label>
                          <Input
                            type="number"
                            value={selectedPart.thickness}
                            onChange={(e) => updatePart(selectedPart.id, 'thickness', parseInt(e.target.value) || 0)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Description</label>
                        <Input
                          value={selectedPart.metadata.description}
                          onChange={(e) => updatePart(selectedPart.id, 'metadata', {
                            ...selectedPart.metadata,
                            description: e.target.value
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Preview Mode */}
          {viewMode === 'preview' && selectedTemplate && (
            <div className="w-full p-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Template Preview</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('editor')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Editor
                  </Button>
                </div>

                {/* 3D Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">3D Cabinet Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-background border border-white/10 rounded-lg p-8">
                      <div className="aspect-video bg-white/5 rounded border-2 border-dashed border-white/20 flex items-center justify-center">
                        <div className="text-center">
                          <Box className="w-16 h-16 mx-auto mb-4 text-white/20" />
                          <p className="text-sm text-white/40">3D Cabinet Visualization</p>
                          <p className="text-xs text-white/40">{selectedTemplate.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parts Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Parts Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTemplate.parts.map(part => (
                        <div key={part.id} className="flex items-center justify-between p-3 bg-background rounded border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                              <Box className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{part.name}</div>
                              <div className="text-xs text-white/60">
                                {part.dimensions.width}×{part.dimensions.height}×{part.thickness}mm
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">${part.pricing.base_cost.toFixed(2)}</div>
                            <div className="text-xs text-white/60">{part.material}</div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Parts Cost:</span>
                          <span className="text-sm font-medium">
                            ${selectedTemplate.parts.reduce((sum, part) => sum + part.pricing.base_cost, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
