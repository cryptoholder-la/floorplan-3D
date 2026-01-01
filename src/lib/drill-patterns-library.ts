// Drill Patterns Library for Floorplan 3D
import { DrillPattern, PatternCategory, PatternType, DrillSettings } from '@/types/domain/cnc.types';
import { Point2D } from '@/types/core/base.types';

// Pattern ID type
export type PatternId = string;

// Available pattern categories
export const PATTERN_CATEGORIES = {
  'cabinet-hardware': {
    name: 'Cabinet Hardware',
    description: 'Patterns for cabinet hinges, handles, and fittings'
  },
  'shelf-holes': {
    name: 'Shelf Support Holes',
    description: 'Adjustable shelf pin and support hole patterns'
  },
  'handle-mounts': {
    name: 'Handle Mounts',
    description: 'Mounting patterns for cabinet handles and knobs'
  }
};

// Available patterns
export const AVAILABLE_PATTERNS: Record<string, DrillPattern> = {
  'shelf-pins-32mm': {
    id: 'shelf-pins-32mm',
    name: '32mm Shelf Pin Pattern',
    description: 'Standard 32mm spaced shelf pin holes',
    category: 'shelf-holes' as PatternCategory,
    type: 'linear' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.652Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'shelf-pins-25mm': {
    id: 'shelf-pins-25mm',
    name: '25mm Shelf Pin Pattern',
    description: '25mm spaced shelf pin holes for tighter spacing',
    category: 'shelf-holes' as PatternCategory,
    type: 'linear' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.652Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'hinge-european-35mm': {
    id: 'hinge-european-35mm',
    name: 'European Hinge 35mm',
    description: 'Standard 35mm European concealed hinge mounting',
    category: 'hinge-plates' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'hinge-european-26mm': {
    id: 'hinge-european-26mm',
    name: 'European Hinge 26mm',
    description: '26mm European hinge for smaller doors',
    category: 'hinge-plates' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'handle-bar-128mm': {
    id: 'handle-bar-128mm',
    name: 'Bar Handle 128mm',
    description: 'Standard 128mm bar handle mounting pattern',
    category: 'handle-mounts' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'handle-knob-standard': {
    id: 'handle-knob-standard',
    name: 'Standard Knob Mount',
    description: 'Single knob mounting pattern',
    category: 'handle-mounts' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'drawer-slide-side-mount': {
    id: 'drawer-slide-side-mount',
    name: 'Side Mount Drawer Slide',
    description: 'Standard side mount drawer slide pattern',
    category: 'drawer-slides' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'drawer-slide-bottom-mount': {
    id: 'drawer-slide-bottom-mount',
    name: 'Bottom Mount Drawer Slide',
    description: 'Bottom mount drawer slide pattern',
    category: 'drawer-slides' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'assembly-dowel-8mm': {
    id: 'assembly-dowel-8mm',
    name: '8mm Dowel Assembly',
    description: '8mm dowel hole pattern for cabinet assembly',
    category: 'assembly' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'assembly-confirmat-screw': {
    id: 'assembly-confirmat-screw',
    name: 'Confirmat Screw Pattern',
    description: 'Confirmat screw pattern for panel assembly',
    category: 'assembly' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'kitchen-sink-mount': {
    id: 'kitchen-sink-mount',
    name: 'Kitchen Sink Mount',
    description: 'Standard undermount kitchen sink mounting pattern',
    category: 'cabinet-hardware' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  'countertop-fastener': {
    id: 'countertop-fastener',
    name: 'Countertop Fastener Pattern',
    description: 'Countertop to cabinet fastening pattern',
    category: 'cabinet-hardware' as PatternCategory,
    type: 'custom' as PatternType,
    geometry: {"type":"grid","spacing":{"x":32,"y":32},"origin":{"x":0,"y":0},"bounds":{"min":{"x":0,"y":0},"max":{"x":600,"y":800}}},
    parameters: {"holeCount":10,"depth":18,"edgeClearance":10},
    drillSettings: {"spindleSpeed":3000,"feedRate":300,"toolType":"drill-bit","toolDiameter":5,"coolant":"off"},
    metadata: {"createdBy":"system","version":"1.0.0","lastModified":"2026-01-01T01:33:12.653Z","usage": { projectCount: 0, lastUsed: null },"validation": { status: "valid", errors: [], warnings: [] },"dependencies":[]},
    tags: [],
    difficulty: 'beginner',
    estimatedTime: 10,
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  }};

export default AVAILABLE_PATTERNS;
