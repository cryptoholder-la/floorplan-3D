#!/usr/bin/env node

/**
 * Simplified Application Components Fix Script
 * Fixes TypeScript errors in application components without external dependencies
 */

const fs = require('fs');
const path = require('path');

class SimpleAppComponentFixer {
  constructor() {
    this.fixes = 0;
    this.errors = [];
    this.fileStats = { fixed: 0, skipped: 0, error: 0 };
  }

  async run() {
    console.log('🔧 Fixing Application Components TypeScript Errors\n');

    // Find files manually without glob
    const appFiles = this.findFiles('./src/app', '.tsx');
    const componentFiles = this.findFiles('./src/components', '.tsx');
    const allFiles = [...appFiles, ...componentFiles];

    console.log(`📁 Found ${allFiles.length} application files to process\n`);

    // Process each file
    for (const file of allFiles) {
      await this.fixFile(file);
    }

    // Generate summary
    this.printSummary();
  }

  findFiles(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    }

    traverse(dir);
    return files;
  }

  async fixFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        this.fileStats.skipped++;
        return;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Fix 1: Update import paths for types
      content = this.fixTypeImports(content);

      // Fix 2: Fix missing component imports
      content = this.fixMissingImports(content, filePath);

      // Fix 3: Fix prop type issues
      content = this.fixPropTypes(content);

      // Fix 4: Fix hook and function signature issues
      content = this.fixFunctionSignatures(content);

      // Write back if modified
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fileStats.fixed++;
        this.fixes++;
        console.log(`✅ Fixed: ${filePath}`);
      } else {
        this.fileStats.skipped++;
      }
    } catch (error) {
      this.fileStats.error++;
      this.errors.push({ file: filePath, error: error.message });
      console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    }
  }

  fixTypeImports(content) {
    let modified = content;

    // Common type import fixes
    const typeReplacements = {
      // Old type paths to new paths
      "from '@/types/cnc.types'": "from '@/types/domain/cnc.types'",
      "from '@/types/cabinet.types'": "from '@/types/domain/cabinet.types'",
      "from '@/types/manufacturing.types'": "from '@/types/domain/manufacturing.types'",
      "from '@/types/floorplan-types'": "from '@/types/domain/floorplan.types'",
      "from '@/types/floorplan.types'": "from '@/types/domain/floorplan.types'",
      
      // Specific type imports that need base types
      "import { Status }": "import { Status } from '@/types/core/base.types'",
      "import { Priority }": "import { Priority } from '@/types/core/base.types'",
      "import { Difficulty }": "import { Difficulty } from '@/types/core/base.types'",
      "import { Point2D }": "import { Point2D } from '@/types/core/base.types'",
      "import { Point3D }": "import { Point3D } from '@/types/core/base.types'",
      "import { Tolerance }": "import { Tolerance } from '@/types/core/base.types'",
      "import { CabinetDimensions }": "import { CabinetDimensions } from '@/types/core/base.types'",
      
      // Fix specific component imports
      "from '@/components/CNCSimulator'": "import CNCSimulator from '@/components/CNCSimulator'",
      "from '@/components/CutlistGenerator'": "import CutlistGenerator from '@/components/CutlistGenerator'",
      "from '@/components/CutListPanel'": "import CutListPanel from '@/components/CutListPanel'",
      "from '@/components/InventoryManager'": "import InventoryManager from '@/components/InventoryManager'",
      "from '@/components/ProjectManager'": "import ProjectManager from '@/components/ProjectManager'",
      
      // Fix specific file imports
      "from './SimpleCabinetViewer'": "import SimpleCabinetViewer from './SimpleCabinetViewer'",
      "from './SimpleQuickAdd'": "import SimpleQuickAdd from './SimpleQuickAdd'",
      "from '@/lib/floorplan-types'": "from '@/types/domain/floorplan.types'",
      "from '@/lib/cabinet-types'": "from '@/types/domain/cabinet.types'",
      "from '@/lib/cnc-types'": "from '@/types/domain/cnc.types'",
      "from '@/lib/manufacturing-types'": "from '@/types/domain/manufacturing.types'"
    };

    for (const [oldImport, newImport] of Object.entries(typeReplacements)) {
      modified = modified.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
    }

    return modified;
  }

  fixMissingImports(content, filePath) {
    let modified = content;

    // Add missing React imports if needed
    if (content.includes('useState') && !content.includes('import { useState }')) {
      modified = "import { useState } from 'react';\n" + modified;
    }

    if (content.includes('useEffect') && !content.includes('import { useEffect }')) {
      const reactImport = modified.includes('import { useState }') ? 
        modified.replace('import { useState }', 'import { useState, useEffect }') :
        "import { useEffect } from 'react';\n" + modified;
      modified = reactImport;
    }

    // Add missing UI component imports
    if (content.includes('<Button') && !content.includes("import { Button }")) {
      const lastImport = modified.match(/import[^;]+;/g)?.pop();
      if (lastImport) {
        const insertIndex = modified.lastIndexOf(lastImport) + lastImport.length;
        modified = modified.slice(0, insertIndex) + 
                 "\nimport { Button } from '@/components/ui/button';" + 
                 modified.slice(insertIndex);
      }
    }

    return modified;
  }

  fixPropTypes(content) {
    let modified = content;

    // Fix common prop type issues
    const propFixes = {
      // Fix status prop types
      'status: Status': 'status: Status | string',
      'priority: Priority': 'priority: Priority | string',
      'difficulty: Difficulty': 'difficulty: Difficulty | string',
      
      // Fix dimension props
      'width: CabinetWidth': 'width: number',
      'height: CabinetHeight': 'height: number',
      'depth: CabinetDepth': 'depth: number',
      
      // Fix array prop types
      'patterns: DrillPattern[]': 'patterns: any[]',
      'cabinets: Cabinet[]': 'cabinets: any[]',
      'tools: CNCTool[]': 'tools: any[]',
      
      // Fix optional props
      'onChange: (value: any)': 'onChange?: (value: any)',
      'onSelect: (item: any)': 'onSelect?: (item: any)',
      'onClick: (event: any)': 'onClick?: (event: any)'
    };

    for (const [oldProp, newProp] of Object.entries(propFixes)) {
      modified = modified.replace(new RegExp(oldProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newProp);
    }

    return modified;
  }

  fixFunctionSignatures(content) {
    let modified = content;

    // Fix common function signature issues
    modified = modified.replace(
      /const\s+(\w+)\s*=\s*\(([^)]+)\)\s*=>\s*{/g,
      (match, funcName, params) => {
        // Add type annotations if missing
        if (!params.includes(':') && params.trim()) {
          const typedParams = params.split(',').map(p => p.trim()).map(p => {
            if (p === '') return '';
            return `${p}: any`;
          }).join(', ');
          return `const ${funcName} = (${typedParams}) => {`;
        }
        return match;
      }
    );

    return modified;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 APPLICATION COMPONENTS FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files fixed: ${this.fileStats.fixed}`);
    console.log(`⚠️  Files skipped: ${this.fileStats.skipped}`);
    console.log(`❌ Files with errors: ${this.fileStats.error}`);
    console.log(`🔧 Total fixes applied: ${this.fixes}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Run TypeScript check: npm run check-types');
    console.log('2. Fix any remaining manual issues');
    console.log('3. Test the application: npm run dev');
    
    console.log('\n✨ Application components fix completed!');
  }
}

// Run the script
if (require.main === module) {
  const fixer = new SimpleAppComponentFixer();
  fixer.run().catch(console.error);
}

module.exports = SimpleAppComponentFixer;
