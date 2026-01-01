// Simplified Drill Patterns Library
import { DrillPattern, PatternCategory, PatternType, DrillSettings } from '@/types/domain/cnc.types';

// Simple pattern data structure
export interface SimplePattern {
  id: string;
  name: string;
  description: string;
  category: PatternCategory;
  type: PatternType;
  drillSettings: DrillSettings;
  tags: string[];
  difficulty: string;
  estimatedTime: number;
}

// Available patterns with simplified structure
export const AVAILABLE_PATTERNS: Record<string, SimplePattern> = {
  'shelf-pins-32mm': {
    id: 'shelf-pins-32mm',
    name: '32mm Shelf Pin Pattern',
    description: 'Standard 32mm spaced shelf pin holes',
    category: 'shelf-holes' as PatternCategory,
    type: 'linear' as PatternType,
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      peckDepth: 5,
      coolant: 'off',
      toolType: 'drill-bit',
      toolDiameter: 5
    },
    tags: ['shelf', 'adjustable', '32mm'],
    difficulty: 'beginner',
    estimatedTime: 10
  },
  'shelf-pins-25mm': {
    id: 'shelf-pins-25mm',
    name: '25mm Shelf Pin Pattern',
    description: '25mm spaced shelf pin holes for tighter spacing',
    category: 'shelf-holes' as PatternCategory,
    type: 'linear' as PatternType,
    drillSettings: {
      spindleSpeed: 3000,
      feedRate: 300,
      peckDepth: 5,
      coolant: 'off',
      toolType: 'drill-bit',
      toolDiameter: 5
    },
    tags: ['shelf', 'adjustable', '25mm'],
    difficulty: 'beginner',
    estimatedTime: 10
  },
  'handle-mounts-standard': {
    id: 'handle-mounts-standard',
    name: 'Standard Handle Mount Pattern',
    description: 'Standard cabinet handle mounting holes',
    category: 'handle-mounts' as PatternCategory,
    type: 'grid' as PatternType,
    drillSettings: {
      spindleSpeed: 2500,
      feedRate: 250,
      peckDepth: 8,
      coolant: 'mist',
      toolType: 'drill-bit',
      toolDiameter: 3
    },
    tags: ['handle', 'mount', 'standard'],
    difficulty: 'intermediate',
    estimatedTime: 15
  }
};

export default AVAILABLE_PATTERNS;
