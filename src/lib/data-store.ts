// Central data store for the 10_10 design system
// This provides shared state management across all components and pages

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Cabinet {
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

export interface Room {
  id: string
  name: string
  dimensions: { width: number; height: number; depth: number }
  cabinets: Cabinet[]
  objects: RoomObject[]
}

export interface RoomObject {
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

export interface Project {
  id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
  rooms: Room[]
  settings: ProjectSettings
  metadata: ProjectMetadata
}

export interface ProjectSettings {
  units: 'mm' | 'cm' | 'inches'
  grid_size: number
  snap_to_grid: boolean
  show_grid: boolean
  show_dimensions: boolean
  auto_save: boolean
  nkba_compliance: boolean
  theme: 'dark' | 'light'
}

export interface ProjectMetadata {
  version: string
  author: string
  tags: string[]
  client_info?: {
    name: string
    email: string
    phone: string
    address: string
  }
  budget?: {
    total: number
    spent: number
    currency: string
  }
}

export interface CutlistItem {
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

export interface TemplatePart {
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

// Store Interface
interface DesignStore {
  // Projects
  projects: Project[]
  current_project: Project | null
  
  // Cabinets
  cabinets: Cabinet[]
  selected_cabinet: Cabinet | null
  
  // Rooms
  rooms: Room[]
  current_room: Room | null
  
  // Templates
  templates: any[]
  selected_template: any | null
  
  // Cutlist
  cutlist_items: CutlistItem[]
  
  // UI State
  view_mode: '3d' | '2d' | 'wireframe'
  edit_mode: 'select' | 'move' | 'rotate' | 'scale'
  show_grid: boolean
  snap_to_grid: boolean
  grid_size: number
  
  // Actions
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  setCurrentRoom: (room: Room | null) => void
  addRoom: (room: Omit<Room, 'id'>) => void
  updateRoom: (id: string, updates: Partial<Room>) => void
  deleteRoom: (id: string) => void
  
  addCabinet: (cabinet: Omit<Cabinet, 'id' | 'created_at' | 'updated_at'>) => void
  updateCabinet: (id: string, updates: Partial<Cabinet>) => void
  deleteCabinet: (id: string) => void
  selectCabinet: (cabinet: Cabinet | null) => void
  
  addRoomObject: (roomId: string, object: Omit<RoomObject, 'id'>) => void
  updateRoomObject: (roomId: string, objectId: string, updates: Partial<RoomObject>) => void
  deleteRoomObject: (roomId: string, objectId: string) => void
  
  generateCutlist: (roomId: string) => void
  exportProject: (projectId: string, format: 'json' | 'pdf' | 'dxf') => void
  importProject: (data: any) => void
  
  setViewMode: (mode: '3d' | '2d' | 'wireframe') => void
  setEditMode: (mode: 'select' | 'move' | 'rotate' | 'scale') => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setGridSize: (size: number) => void
  
  // Templates
  addTemplate: (template: any) => void
  updateTemplate: (id: string, updates: Partial<any>) => void
  deleteTemplate: (id: string) => void
  selectTemplate: (template: any | null) => void
}

// Default data
const defaultCabinets: Cabinet[] = [
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
  }
]

const defaultRooms: Room[] = [
  {
    id: 'room-001',
    name: 'Main Kitchen',
    dimensions: { width: 4000, height: 2400, depth: 3000 },
    cabinets: [],
    objects: []
  },
  {
    id: 'room-002',
    name: 'Guest Kitchen',
    dimensions: { width: 3000, height: 2400, depth: 2500 },
    cabinets: [],
    objects: []
  }
]

// Create store
export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      current_project: null,
      cabinets: defaultCabinets,
      selected_cabinet: null,
      rooms: defaultRooms,
      current_room: defaultRooms[0],
      templates: [],
      selected_template: null,
      cutlist_items: [],
      view_mode: '3d',
      edit_mode: 'select',
      show_grid: true,
      snap_to_grid: true,
      grid_size: 50,

      // Project actions
      setCurrentProject: (project) => set({ current_project: project }),
      
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `project-${Date.now()}`,
          created_at: new Date(),
          updated_at: new Date()
        }
        set(state => ({
          projects: [...state.projects, newProject],
          current_project: newProject
        }))
      },
      
      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updates, updated_at: new Date() } : p
          ),
          current_project: state.current_project?.id === id 
            ? { ...state.current_project, ...updates, updated_at: new Date() }
            : state.current_project
        }))
      },
      
      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          current_project: state.current_project?.id === id ? null : state.current_project
        }))
      },

      // Room actions
      setCurrentRoom: (room) => set({ current_room: room }),
      
      addRoom: (roomData) => {
        const newRoom: Room = {
          ...roomData,
          id: `room-${Date.now()}`
        }
        set(state => ({
          rooms: [...state.rooms, newRoom],
          current_room: newRoom
        }))
      },
      
      updateRoom: (id, updates) => {
        set(state => ({
          rooms: state.rooms.map(r => r.id === id ? { ...r, ...updates } : r),
          current_room: state.current_room?.id === id 
            ? { ...state.current_room, ...updates }
            : state.current_room
        }))
      },
      
      deleteRoom: (id) => {
        set(state => ({
          rooms: state.rooms.filter(r => r.id !== id),
          current_room: state.current_room?.id === id ? state.rooms[0] || null : state.current_room
        }))
      },

      // Cabinet actions
      addCabinet: (cabinetData) => {
        const newCabinet: Cabinet = {
          ...cabinetData,
          id: `cabinet-${Date.now()}`,
          created_at: new Date(),
          updated_at: new Date()
        }
        set(state => ({
          cabinets: [...state.cabinets, newCabinet]
        }))
      },
      
      updateCabinet: (id, updates) => {
        set(state => ({
          cabinets: state.cabinets.map(c => 
            c.id === id ? { ...c, ...updates, updated_at: new Date() } : c
          ),
          selected_cabinet: state.selected_cabinet?.id === id 
            ? { ...state.selected_cabinet, ...updates, updated_at: new Date() }
            : state.selected_cabinet
        }))
      },
      
      deleteCabinet: (id) => {
        set(state => ({
          cabinets: state.cabinets.filter(c => c.id !== id),
          selected_cabinet: state.selected_cabinet?.id === id ? null : state.selected_cabinet
        }))
      },
      
      selectCabinet: (cabinet) => set({ selected_cabinet: cabinet }),

      // Room object actions
      addRoomObject: (roomId, objectData) => {
        const newObject: RoomObject = {
          ...objectData,
          id: `object-${Date.now()}`
        }
        set(state => ({
          rooms: state.rooms.map(r => 
            r.id === roomId 
              ? { ...r, objects: [...r.objects, newObject] }
              : r
          )
        }))
      },
      
      updateRoomObject: (roomId, objectId, updates) => {
        set(state => ({
          rooms: state.rooms.map(r => 
            r.id === roomId 
              ? {
                  ...r,
                  objects: r.objects.map(o => 
                    o.id === objectId ? { ...o, ...updates } : o
                  )
                }
              : r
          )
        }))
      },
      
      deleteRoomObject: (roomId, objectId) => {
        set(state => ({
          rooms: state.rooms.map(r => 
            r.id === roomId 
              ? { ...r, objects: r.objects.filter(o => o.id !== objectId) }
              : r
          )
        }))
      },

      // Cutlist actions
      generateCutlist: (roomId) => {
        const room = get().rooms.find(r => r.id === roomId)
        if (!room) return

        // Generate cutlist items from room cabinets
        const cutlistItems: CutlistItem[] = room.cabinets.flatMap(cabinet => [
          {
            id: `${cabinet.id}-left-panel`,
            cabinet_id: cabinet.id,
            cabinet_name: cabinet.name,
            part_name: 'Left Side Panel',
            material: cabinet.material,
            thickness: 18,
            quantity: 1,
            dimensions: {
              width: cabinet.dimensions.depth,
              height: cabinet.dimensions.height,
              depth: 18
            },
            grain_direction: 'vertical',
            edge_banding: { top: true, bottom: true, left: false, right: false },
            cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
            notes: 'Standard side panel',
            barcode: `${cabinet.sku}-LSP`,
            estimated_time: 12,
            cost: cabinet.price * 0.15
          },
          {
            id: `${cabinet.id}-right-panel`,
            cabinet_id: cabinet.id,
            cabinet_name: cabinet.name,
            part_name: 'Right Side Panel',
            material: cabinet.material,
            thickness: 18,
            quantity: 1,
            dimensions: {
              width: cabinet.dimensions.depth,
              height: cabinet.dimensions.height,
              depth: 18
            },
            grain_direction: 'vertical',
            edge_banding: { top: true, bottom: true, left: false, right: false },
            cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
            notes: 'Standard side panel',
            barcode: `${cabinet.sku}-RSP`,
            estimated_time: 12,
            cost: cabinet.price * 0.15
          },
          {
            id: `${cabinet.id}-bottom-panel`,
            cabinet_id: cabinet.id,
            cabinet_name: cabinet.name,
            part_name: 'Bottom Panel',
            material: cabinet.material,
            thickness: 18,
            quantity: 1,
            dimensions: {
              width: cabinet.dimensions.width - 4,
              height: cabinet.dimensions.depth - 4,
              depth: 18
            },
            grain_direction: 'horizontal',
            edge_banding: { top: false, bottom: false, left: true, right: true },
            cnc_operations: { drilling: true, routing: false, cutting: true, engraving: false },
            notes: 'Bottom panel',
            barcode: `${cabinet.sku}-BTM`,
            estimated_time: 8,
            cost: cabinet.price * 0.1
          }
        ])

        set({ cutlist_items: cutlistItems })
      },

      exportProject: (projectId, format) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const exportData = {
          project,
          export_format: format,
          timestamp: new Date().toISOString()
        }

        // In a real implementation, this would trigger actual export
        console.log('Exporting project:', exportData)
      },

      importProject: (data) => {
        // In a real implementation, this would validate and import project data
        console.log('Importing project:', data)
      },

      // UI actions
      setViewMode: (mode) => set({ view_mode: mode }),
      setEditMode: (mode) => set({ edit_mode: mode }),
      toggleGrid: () => set(state => ({ show_grid: !state.show_grid })),
      toggleSnapToGrid: () => set(state => ({ snap_to_grid: !state.snap_to_grid })),
      setGridSize: (size) => set({ grid_size: size }),

      // Template actions
      addTemplate: (template) => {
        const newTemplate = { ...template, id: `template-${Date.now()}` }
        set(state => ({
          templates: [...state.templates, newTemplate]
        }))
      },
      
      updateTemplate: (id, updates) => {
        set(state => ({
          templates: state.templates.map(t => 
            t.id === id ? { ...t, ...updates } : t
          ),
          selected_template: state.selected_template?.id === id 
            ? { ...state.selected_template, ...updates }
            : state.selected_template
        }))
      },
      
      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(t => t.id !== id),
          selected_template: state.selected_template?.id === id ? null : state.selected_template
        }))
      },
      
      selectTemplate: (template) => set({ selected_template: template })
    }),
    {
      name: 'design-store',
      partialize: (state) => ({
        projects: state.projects,
        cabinets: state.cabinets,
        rooms: state.rooms,
        templates: state.templates,
        view_mode: state.view_mode,
        show_grid: state.show_grid,
        snap_to_grid: state.snap_to_grid,
        grid_size: state.grid_size
      })
    }
  )
)

// Utility functions
export const generateBarcode = (text: string): string => {
  // Simple barcode generation (in real app, use proper barcode library)
  return `BC-${text.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now().toString(36)}`
}

export const calculateMaterialCost = (dimensions: { width: number; height: number; thickness: number }, material: string): number => {
  const materialRates: Record<string, number> = {
    'Plywood': 0.0002,
    'MDF': 0.00015,
    'Hardboard': 0.0001,
    'Particle Board': 0.00008,
    'Solid Wood': 0.0005
  }
  
  const area = dimensions.width * dimensions.height
  const rate = materialRates[material] || 0.0002
  
  return area * rate
}

export const validateNKBACompliance = (room: Room): { passed: boolean; issues: string[] } => {
  const issues: string[] = []
  
  // Check work triangle
  const workItems = room.objects.filter(obj => 
    obj.type === 'appliance' && (obj.name.includes('sink') || obj.name.includes('cooktop') || obj.name.includes('refrigerator'))
  )
  
  if (workItems.length < 3) {
    issues.push('Incomplete work triangle - missing sink, cooktop, or refrigerator')
  }
  
  // Check clearances
  const wallCabinets = room.objects.filter(obj => obj.type === 'cabinet' && obj.name.includes('wall'))
  wallCabinets.forEach(cabinet => {
    if (cabinet.position.y < 400) {
      issues.push(`Wall cabinet "${cabinet.name}" may be too low - recommended minimum 400mm from counter`)
    }
  })
  
  // Check aisle space
  const maxX = Math.max(...room.objects.map(obj => obj.position.x + obj.dimensions.width))
  if (maxX > room.dimensions.width - 900) {
    issues.push('Insufficient aisle space - recommended minimum 900mm clearance')
  }
  
  return {
    passed: issues.length === 0,
    issues
  }
}

export const optimizeNesting = (parts: CutlistItem[], sheetSize: { width: number; height: number }) => {
  // Simple nesting optimization (in real app, use sophisticated algorithm)
  const sheets = []
  let currentSheet = { width: sheetSize.width, height: sheetSize.height, parts: [] }
  
  parts.forEach(part => {
    if (part.dimensions.width <= currentSheet.width && part.dimensions.height <= currentSheet.height) {
      currentSheet.parts.push(part)
      currentSheet.width -= part.dimensions.width + 3 // Add kerf
    } else {
      sheets.push(currentSheet)
      currentSheet = { width: sheetSize.width, height: sheetSize.height, parts: [part] }
      currentSheet.width -= part.dimensions.width + 3
    }
  })
  
  if (currentSheet.parts.length > 0) {
    sheets.push(currentSheet)
  }
  
  return sheets
}
