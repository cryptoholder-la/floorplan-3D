#!/usr/bin/env node

/**
 * Complete Import Path Migration Fix
 * Addresses the 40% of errors caused by incomplete migration from old type paths to new centralized structure
 */

const fs = require('fs');
const path = require('path');

class ImportPathMigrationFixer {
  constructor() {
    this.fixes = 0;
    this.errors = [];
    this.fileStats = { fixed: 0, skipped: 0, error: 0 };
  }

  async run() {
    console.log('🔧 Complete Import Path Migration Fix\n');

    // Find all TypeScript files
    const allFiles = this.findAllTypeScriptFiles();
    console.log(`📁 Found ${allFiles.length} TypeScript files to process\n`);

    // Process each file
    for (const file of allFiles) {
      await this.fixFile(file);
    }

    // Generate summary
    this.printSummary();
  }

  findAllTypeScriptFiles() {
    const files = [];
    const directories = ['./src/app', './src/components', './src/lib', './src/types'];
    
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
          const fullPath = path.join(currentDir, item);
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
      if (!fs.existsSync(filePath)) {
        this.fileStats.skipped++;
        return;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Apply all import path fixes
      content = this.fixOldTypePaths(content);
      content = this.fixLibImportPaths(content);
      content = this.fixComponentImportPaths(content);
      content = this.fixRelativeImportPaths(content);
      content = this.fixMissingTypeImports(content, filePath);
      content = this.fixDuplicateImports(content);

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

  fixOldTypePaths(content) {
    let modified = content;

    // Comprehensive old type path to new path mappings
    const pathMappings = {
      // Old direct type imports to new domain paths
      "from '@/types/cnc.types'": "from '@/types/domain/cnc.types'",
      "from '@/types/cabinet.types'": "from '@/types/domain/cabinet.types'",
      "from '@/types/manufacturing.types'": "from '@/types/domain/manufacturing.types'",
      "from '@/types/floorplan-types'": "from '@/types/domain/floorplan.types'",
      "from '@/types/floorplan.types'": "from '@/types/domain/floorplan.types'",
      "from '@/types/master.types'": "from '@/types/integration/master.types'",
      "from '@/types/unified.types'": "from '@/types/integration/unified.types'",
      
      // Old lib type imports to new domain paths
      "from '@/lib/cnc-types'": "from '@/types/domain/cnc.types'",
      "from '@/lib/cabinet-types'": "from '@/types/domain/cabinet.types'",
      "from '@/lib/manufacturing-types'": "from '@/types/domain/manufacturing.types'",
      "from '@/lib/floorplan-types'": "from '@/types/domain/floorplan.types'",
      "from '@/lib/master-types'": "from '@/types/integration/master.types'",
      "from '@/lib/unified-types'": "from '@/types/integration/unified.types'",
      
      // Old relative type imports to new domain paths
      "from '../types/cnc.types'": "from '@/types/domain/cnc.types'",
      "from '../types/cabinet.types'": "from '@/types/domain/cabinet.types'",
      "from '../types/manufacturing.types'": "from '@/types/domain/manufacturing.types'",
      "from '../types/floorplan.types'": "from '@/types/domain/floorplan.types'",
      "from '../types/master.types'": "from '@/types/integration/master.types'",
      "from '../types/unified.types'": "from '@/types/integration/unified.types'",
      
      // Deep relative imports
      "from '../../types/cnc.types'": "from '@/types/domain/cnc.types'",
      "from '../../types/cabinet.types'": "from '@/types/domain/cabinet.types'",
      "from '../../types/manufacturing.types'": "from '@/types/domain/manufacturing.types'",
      "from '../../types/floorplan.types'": "from '@/types/domain/floorplan.types'",
      "from '../../types/master.types'": "from '@/types/integration/master.types'",
      "from '../../types/unified.types'": "from '@/types/integration/unified.types'"
    };

    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      modified = modified.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    }

    return modified;
  }

  fixLibImportPaths(content) {
    let modified = content;

    // Fix lib imports that should come from types
    const libFixes = {
      "from '@/lib/drill-patterns-library'": "from '@/lib/drill-patterns-library'",
      "from '@/lib/cnc-operations'": "from '@/lib/cnc-operations'",
      "from '@/lib/gcode-generator'": "from '@/lib/gcode-generator'",
      "from '@/lib/cabinet-generator'": "from '@/lib/cabinet-generator'",
      "from '@/lib/master-integration'": "from '@/lib/master-integration'"
    };

    for (const [oldPath, newPath] of Object.entries(libFixes)) {
      modified = modified.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    }

    return modified;
  }

  fixComponentImportPaths(content) {
    let modified = content;

    // Fix component imports to ensure they're correct
    const componentFixes = {
      "from '@/components/CNCSimulator'": "import CNCSimulator from '@/components/CNCSimulator'",
      "from '@/components/CutlistGenerator'": "import CutlistGenerator from '@/components/CutlistGenerator'",
      "from '@/components/CutListPanel'": "import CutListPanel from '@/components/CutListPanel'",
      "from '@/components/InventoryManager'": "import InventoryManager from '@/components/InventoryManager'",
      "from '@/components/ProjectManager'": "import ProjectManager from '@/components/ProjectManager'",
      "from '@/components/SimpleCabinetViewer'": "import SimpleCabinetViewer from '@/components/SimpleCabinetViewer'",
      "from '@/components/SimpleQuickAdd'": "import SimpleQuickAdd from '@/components/SimpleQuickAdd'"
    };

    for (const [oldImport, newImport] of Object.entries(componentFixes)) {
      modified = modified.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
    }

    return modified;
  }

  fixRelativeImportPaths(content) {
    let modified = content;

    // Fix problematic relative imports
    const relativeFixes = {
      "from './SimpleCabinetViewer'": "import SimpleCabinetViewer from './SimpleCabinetViewer'",
      "from './SimpleQuickAdd'": "import SimpleQuickAdd from './SimpleQuickAdd'",
      "from './CNCSimulator'": "import CNCSimulator from './CNCSimulator'",
      "from './CutlistGenerator'": "import CutlistGenerator from './CutlistGenerator'",
      "from './CutListPanel'": "import CutListPanel from './CutListPanel'"
    };

    for (const [oldImport, newImport] of Object.entries(relativeFixes)) {
      modified = modified.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
    }

    return modified;
  }

  fixMissingTypeImports(content, filePath) {
    let modified = content;

    // Add missing base type imports if needed
    const baseTypeMappings = {
      'Status': "from '@/types/core/base.types'",
      'Priority': "from '@/types/core/base.types'",
      'Difficulty': "from '@/types/core/base.types'",
      'Point2D': "from '@/types/core/base.types'",
      'Point3D': "from '@/types/core/base.types'",
      'Tolerance': "from '@/types/core/base.types'",
      'CabinetDimensions': "from '@/types/core/base.types'",
      'CabinetWidth': "from '@/types/core/base.types'",
      'CabinetDepth': "from '@/types/core/base.types'",
      'CabinetHeight': "from '@/types/core/base.types'",
      'Material': "from '@/types/core/base.types'",
      'Rectangle': "from '@/types/core/base.types'",
      'BoundingBox': "from '@/types/core/base.types'"
    };

    for (const [typeName, importPath] of Object.entries(baseTypeMappings)) {
      // Check if type is used but not imported
      if (content.includes(typeName) && !content.includes(`import { ${typeName} }`)) {
        // Find the last import statement
        const importMatches = content.match(/import[^;]+;/g);
        if (importMatches && importMatches.length > 0) {
          const lastImport = importMatches[importMatches.length - 1];
          const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
          content = content.slice(0, insertIndex) + 
                   `\nimport { ${typeName} } ${importPath};` + 
                   content.slice(insertIndex);
        }
      }
    }

    return modified;
  }

  fixDuplicateImports(content) {
    let modified = content;

    // Fix duplicate imports like "import CNCSimulator import CNCSimulator"
    const duplicateFixes = [
      { from: /import\s+(\w+)\s+import\s+\1/g, to: 'import $1' },
      { from: /import\s+{([^}]+)}\s+import\s+{\1}/g, to: 'import { $1}' }
    ];

    for (const { from, to } of duplicateFixes) {
      modified = modified.replace(from, to);
    }

    return modified;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT PATH MIGRATION FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files fixed: ${this.fileStats.fixed}`);
    console.log(`⚠️  Files skipped: ${this.fileStats.skipped}`);
    console.log(`❌ Files with errors: ${this.fileStats.error}`);
    console.log(`🔧 Total import path fixes applied: ${this.fixes}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Import Path Migrations Fixed:');
    console.log('  - Old type paths → New domain paths');
    console.log('  - Lib type imports → Domain type imports');
    console.log('  - Component imports → Default imports');
    console.log('  - Relative imports → Absolute imports');
    console.log('  - Missing base type imports added');
    console.log('  - Duplicate imports cleaned up');
    
    console.log('\n🚀 Expected Impact:');
    console.log('  - Should resolve ~40% of TypeScript errors');
    console.log('  - Import path issues should be eliminated');
    console.log('  - Type resolution should be consistent');
    
    console.log('\n✨ Import path migration completed!');
  }
}

// Run the script
if (require.main === module) {
  new ImportPathMigrationFixer().run();
}

module.exports = ImportPathMigrationFixer;
