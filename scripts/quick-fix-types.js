#!/usr/bin/env node

/**
 * Quick Type Fixes - Addresses most critical TypeScript errors
 * Focus on Tolerance, DrillSettings, and import path issues
 */

const fs = require('fs');
const path = require('path');

// Files with most critical issues based on tsc output
const CRITICAL_FILES = [
  './src/lib/drill-patterns-library.ts',
  './src/lib/cnc-operations.ts',
  './src/lib/gcode-generator.ts',
  './src/lib/cabinet-generator.ts',
  './src/types/index.ts'
];

class QuickTypeFixer {
  constructor() {
    this.fixes = 0;
  }

  async run() {
    console.log('🚀 Quick Type Fixes - Critical Issues Only\n');
    
    for (const file of CRITICAL_FILES) {
      await this.fixFile(file);
    }
    
    console.log(`\n✅ Applied ${this.fixes} fixes`);
    console.log('\n🎯 Run: npx tsc --noEmit to check remaining issues');
  }

  async fixFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Fix 1: Tolerance diameter -> dimension
      content = content.replace(
        /tolerance:\s*{\s*diameter:\s*{\s*nominal:\s*([^,]+),\s*plus:\s*([^,]+),\s*minus:\s*([^}]+)\s*}\s*}/g,
        'tolerance: { dimension: "diameter", nominal: $1, plus: $2, minus: $3, critical: false }'
      );

      // Fix 2: Add required DrillSettings properties
      content = content.replace(
        /drillSettings:\s*{\s*spindleSpeed:\s*(\d+),\s*feedRate:\s*(\d+),\s*peckDepth:\s*(\d+),\s*coolant:\s*([^}]+)\s*}/g,
        'drillSettings: { spindleSpeed: $1, feedRate: $2, peckDepth: $3, coolant: $4, toolType: "drill-bit", toolDiameter: 5 }'
      );

      // Fix 3: Import path updates
      const importReplacements = {
        "from '@/types/cnc.types'": "from '@/types/domain/cnc.types'",
        "from '@/types/cabinet.types'": "from '@/types/domain/cabinet.types'",
        "from '@/types/manufacturing.types'": "from '@/types/domain/manufacturing.types'",
        "from '@/types/floorplan-types'": "from '@/types/domain/floorplan.types'"
      };

      for (const [oldPath, newPath] of Object.entries(importReplacements)) {
        content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
      }

      // Fix 4: Add missing Tolerance import
      if (content.includes('Tolerance') && !content.includes("import { Tolerance }")) {
        content = "import { Tolerance } from '@/types/core/base.types';\n" + content;
      }

      // Fix 5: Remove CabinetDimensions from legacy exports
      content = content.replace(/CabinetDimensions as LegacyCabinetDimensions,/g, '');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixes++;
        console.log(`✅ Fixed: ${filePath}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  new QuickTypeFixer().run();
}

module.exports = QuickTypeFixer;
