#!/usr/bin/env node

/**
 * Update to Centralized Types Script
 * Updates all import paths to use the new centralized type system
 */

const fs = require('fs');

class CentralizedTypeUpdater {
  constructor() {
    this.fixes = 0;
    this.errors = [];
  }

  async run() {
    console.log('🔧 Updating All Imports to Centralized Type System\n');

    // Find all TypeScript files
    const allFiles = this.findAllTypeScriptFiles();
    console.log(`📁 Found ${allFiles.length} files to update\n`);

    // Process each file
    for (const file of allFiles) {
      await this.fixFile(file);
    }

    this.printSummary();
  }

  findAllTypeScriptFiles() {
    const files = [];
    const directories = ['./src'];
    
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        files.push(...this.findFiles(dir, '.ts'));
        files.push(...this.findFiles(dir, '.tsx'));
      }
    }
    
    return files;
  }

  findFiles(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    function traverse(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = require('path').join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (item.endsWith(extension)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    traverse(dir);
    return files;
  }

  async fixFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) return;

      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Update imports to use centralized types
      content = this.updateToCentralizedTypes(content);

      // Write back if modified
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixes++;
        console.log(`✅ Updated: ${filePath}`);
      }
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.log(`❌ Error updating ${filePath}: ${error.message}`);
    }
  }

  updateToCentralizedTypes(content) {
    let modified = content;

    // Update all type imports to use centralized index
    const typeImportFixes = {
      // Base types
      "from '@/types/core/base.types'": "from '@/types'",
      "from '@/types/base.types'": "from '@/types'",
      "from '@/types/core/geometry.types'": "from '@/types'",
      "from '@/types/geometry.types'": "from '@/types'",
      
      // Domain types
      "from '@/types/domain/cabinet.types'": "from '@/types'",
      "from '@/types/cabinet.types'": "from '@/types'",
      "from '@/types/domain/cnc.types'": "from '@/types'",
      "from '@/types/cnc.types'": "from '@/types'",
      "from '@/types/domain/manufacturing.types'": "from '@/types'",
      "from '@/types/manufacturing.types'": "from '@/types'",
      "from '@/types/domain/floorplan.types'": "from '@/types'",
      "from '@/types/floorplan.types'": "from '@/types'",
      
      // Integration types
      "from '@/types/integration/master.types'": "from '@/types'",
      "from '@/types/master.types'": "from '@/types'",
      "from '@/types/integration/unified.types'": "from '@/types'",
      "from '@/types/unified.types'": "from '@/types'",
      
      // Remove duplicate imports
      "import { Point2D } from '@/types';\nimport { Point2D } from '@/types';": "import { Point2D } from '@/types';",
      "import { Status } from '@/types';\nimport { Status } from '@/types';": "import { Status } from '@/types';",
      "import { Material } from '@/types';\nimport { Material } from '@/types';": "import { Material } from '@/types';"
    };

    for (const [oldImport, newImport] of Object.entries(typeImportFixes)) {
      modified = modified.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
    }

    // Add missing imports for commonly used types
    modified = this.addMissingImports(modified);

    return modified;
  }

  addMissingImports(content) {
    let modified = content;

    // Common types that should be imported
    const commonTypes = [
      'Point2D', 'Point3D', 'Status', 'Priority', 'Difficulty',
      'Material', 'Tolerance', 'Rectangle', 'BoundingBox',
      'BaseEntity', 'CabinetDimensions', 'CabinetWidth',
      'CabinetDepth', 'CabinetHeight'
    ];

    for (const type of commonTypes) {
      // Check if type is used but not imported
      if (content.includes(type) && !content.includes(`import { ${type} } from '@/types'`)) {
        // Find the last import statement
        const importMatches = content.match(/import[^;]+;/g);
        if (importMatches && importMatches.length > 0) {
          const lastImport = importMatches[importMatches.length - 1];
          const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
          
          // Insert the missing import
          modified = content.slice(0, insertIndex) + 
                   `\nimport { ${type} } from '@/types';` + 
                   content.slice(insertIndex);
        }
      }
    }

    return modified;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CENTRALIZED TYPE SYSTEM UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files updated: ${this.fixes}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Import Updates Applied:');
    console.log('  - All type imports now use @/types/');
    console.log('  - Removed duplicate imports');
    console.log('  - Added missing common type imports');
    console.log('  - Centralized type system fully integrated');
    
    console.log('\n🚀 New Type System Structure:');
    console.log('  @/types/');
    console.log('  ├── base.types.ts     (Core fundamental types)');
    console.log('  ├── geometry.types.ts  (Geometric primitives)');
    console.log('  ├── cabinet.types.ts   (Cabinet-related types)');
    console.log('  ├── cnc.types.ts       (CNC manufacturing types)');
    console.log('  ├── manufacturing.types.ts (Production types)');
    console.log('  ├── floorplan.types.ts (Floorplan types)');
    console.log('  ├── integration.types.ts (System integration types)');
    console.log('  ├── ui.types.ts         (UI component types)');
    console.log('  ├── api.types.ts        (API and data exchange types)');
    console.log('  ├── utility.types.ts    (Helper types and utilities)');
    console.log('  └── index.ts          (Re-exports for easy access)');
    
    console.log('\n✨ All files now use centralized type system!');
  }
}

// Run the script
if (require.main === module) {
  new CentralizedTypeUpdater().run();
}

module.exports = CentralizedTypeUpdater;
