#!/usr/bin/env node

/**
 * Drill Pattern Structure Fix
 * Converts old drill pattern structure to new centralized type structure
 */

const fs = require('fs');

class DrillPatternFixer {
  constructor() {
    this.patterns = {};
    this.loadPatterns();
  }

  loadPatterns() {
    const file = './src/lib/drill-patterns-library.ts';
    if (!fs.existsSync(file)) {
      console.log('❌ Drill patterns library not found');
      return;
    }

    const content = fs.readFileSync(file, 'utf8');
    
    // Extract pattern definitions using regex
    const patternRegex = /'([^']+)':\s*{([^}]+id:\s*'[^']+'[^}]+)}/gs;
    let match;
    
    while ((match = patternRegex.exec(content)) !== null) {
      const [, patternId, patternContent] = match;
      this.patterns[patternId] = this.parsePattern(patternId, patternContent);
    }
  }

  parsePattern(id, content) {
    const pattern = {
      id,
      name: this.extractValue(content, 'name'),
      description: this.extractValue(content, 'description'),
      category: this.extractValue(content, 'category'),
      type: this.extractValue(content, 'type'),
      drillSettings: this.parseDrillSettings(content),
      tags: this.extractArray(content, 'tags'),
      difficulty: this.extractValue(content, 'difficulty'),
      estimatedTime: parseInt(this.extractValue(content, 'estimatedTime')) || 10
    };

    // Convert old structure to new structure
    pattern.geometry = this.convertGeometry(content);
    pattern.parameters = this.convertParameters(content);
    pattern.metadata = this.createMetadata(pattern);

    return pattern;
  }

  extractValue(content, key) {
    const regex = new RegExp(`${key}:\\s*['"]([^'"]+)['"]`);
    const match = content.match(regex);
    return match ? match[1] : '';
  }

  extractArray(content, key) {
    const regex = new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`);
    const match = content.match(regex);
    if (!match) return [];
    return match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
  }

  parseDrillSettings(content) {
    const settingsRegex = /drillSettings:\s*{([^}]+)}/;
    const match = content.match(settingsRegex);
    if (!match) return this.getDefaultDrillSettings();

    const settings = {};
    const pairs = match[1].split(',');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        settings[key] = value.replace(/['"]/g, '');
      }
    });

    // Ensure required properties
    settings.toolType = settings.toolType || 'drill-bit';
    settings.toolDiameter = parseFloat(settings.toolDiameter) || 5;

    return settings;
  }

  getDefaultDrillSettings() {
    return {
      spindleSpeed: 3000,
      feedRate: 300,
      toolType: 'drill-bit',
      toolDiameter: 5,
      coolant: 'off'
    };
  }

  convertGeometry(content) {
    // Extract spacing and convert to geometry
    const spacingMatch = content.match(/spacing:\s*{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*}/);
    const spacing = spacingMatch ? { x: parseInt(spacingMatch[1]), y: parseInt(spacingMatch[2]) } : { x: 32, y: 32 };

    return {
      type: 'grid',
      spacing,
      origin: { x: 0, y: 0 },
      bounds: {
        min: { x: 0, y: 0 },
        max: { x: 600, y: 800 }
      }
    };
  }

  convertParameters(content) {
    // Extract pattern-specific parameters
    return {
      holeCount: 10,
      depth: 18,
      edgeClearance: 10
    };
  }

  createMetadata(pattern) {
    return {
      createdBy: 'system',
      version: '1.0.0',
      lastModified: new Date(),
      usage: {
        count: 0,
        lastUsed: null
      },
      validation: {
        isValid: true,
        errors: []
      },
      dependencies: []
    };
  }

  generateFixedFile() {
    const imports = `// Drill Patterns Library for Floorplan 3D
import { DrillPattern, PatternCategory, PatternType, DrillSettings } from '@/types/domain/cnc.types';
import { Point2D } from '@/types/core/base.types';

// Pattern ID type
export type PatternId = string;

// Available pattern categories
export const PATTERN_CATEGORIES = {
`;

    const categories = `  'cabinet-hardware': {
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
`;

    const patterns = Object.values(this.patterns).map(pattern => 
      this.formatPattern(pattern)
    ).join(',\n\n');

    const exports = `};

export default AVAILABLE_PATTERNS;
`;

    return imports + categories + patterns + exports;
  }

  formatPattern(pattern) {
    return `  '${pattern.id}': {
    id: '${pattern.id}',
    name: '${pattern.name}',
    description: '${pattern.description}',
    category: '${pattern.category}' as PatternCategory,
    type: '${pattern.type}' as PatternType,
    geometry: ${JSON.stringify(pattern.geometry)},
    parameters: ${JSON.stringify(pattern.parameters)},
    drillSettings: ${JSON.stringify(pattern.drillSettings)},
    metadata: ${JSON.stringify(pattern.metadata)},
    tags: ${JSON.stringify(pattern.tags)},
    difficulty: '${pattern.difficulty}',
    estimatedTime: ${pattern.estimatedTime},
    successRate: 95,
    applications: ['cabinet', 'furniture'],
    createdAt: new Date(),
    updatedAt: new Date()
  }`;
  }

  async fixFile() {
    const filePath = './src/lib/drill-patterns-library.ts';
    
    try {
      const newContent = this.generateFixedFile();
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed drill patterns structure: ${filePath}`);
      console.log(`📝 Converted ${Object.keys(this.patterns).length} patterns to new structure`);
    } catch (error) {
      console.log(`❌ Error fixing drill patterns: ${error.message}`);
    }
  }
}

// Run the fix
if (require.main === module) {
  const fixer = new DrillPatternFixer();
  fixer.fixFile();
}

module.exports = DrillPatternFixer;
