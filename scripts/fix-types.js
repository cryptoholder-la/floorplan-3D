#!/usr/bin/env node

/**
 * Type System Fix Script
 * Automatically fixes common type system issues after migration to centralized types
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  srcDir: './src',
  patterns: {
    types: '**/*.{ts,tsx}',
    imports: /from ['"]@\/types\/([^'"]+)['"]/g,
    oldTypePaths: [
      '@/types/cnc.types',
      '@/types/cabinet.types',
      '@/types/manufacturing.types',
      '@/types/floorplan-types'
    ]
  }
};

// Type mapping for old to new imports
const TYPE_MAPPINGS = {
  '@/types/cnc.types': {
    DrillPattern: '@/types/domain/cnc.types',
    CNCOperation: '@/types/domain/cnc.types',
    CNCTool: '@/types/domain/cnc.types',
    DrillSettings: '@/types/domain/cnc.types',
    PatternCategory: '@/types/domain/cnc.types',
    PatternType: '@/types/domain/cnc.types'
  },
  '@/types/cabinet.types': {
    Cabinet: '@/types/domain/cabinet.types',
    CabinetPart: '@/types/domain/cabinet.types',
    CabinetMaterial: '@/types/domain/cabinet.types',
    CabinetHardware: '@/types/domain/cabinet.types',
    CutListItem: '@/types/domain/cabinet.types',
    CutList: '@/types/domain/cabinet.types'
  },
  '@/types/manufacturing.types': {
    ManufacturingJob: '@/types/domain/manufacturing.types',
    MachineSettings: '@/types/domain/manufacturing.types',
    ToolRequirement: '@/types/domain/manufacturing.types',
    QualityCheck: '@/types/domain/manufacturing.types'
    // Tolerance should come from base.types
  },
  '@/types/floorplan-types': {
    Floorplan: '@/types/domain/floorplan.types',
    Wall: '@/types/domain/floorplan.types',
    Door: '@/types/domain/floorplan.types',
    Window: '@/types/domain/floorplan.types',
    Room: '@/types/domain/floorplan.types',
    Fixture: '@/types/domain/floorplan.types'
  }
};

// Base types that should be imported from core
const BASE_TYPES = {
  Tolerance: '@/types/core/base.types',
  Point2D: '@/types/core/base.types',
  Point3D: '@/types/core/base.types',
  Status: '@/types/core/base.types',
  Priority: '@/types/core/base.types',
  Difficulty: '@/types/core/base.types',
  Material: '@/types/core/base.types',
  CabinetDimensions: '@/types/core/base.types',
  CabinetWidth: '@/types/core/base.types',
  CabinetDepth: '@/types/core/base.types',
  CabinetHeight: '@/types/core/base.types'
};

class TypeFixer {
  constructor() {
    this.fixedFiles = 0;
    this.totalErrors = 0;
    this.errors = [];
  }

  async run() {
    console.log('🔧 Starting Type System Fix Script...\n');

    // Find all TypeScript files
    const files = glob.sync(path.join(CONFIG.srcDir, CONFIG.patterns.types));
    console.log(`📁 Found ${files.length} TypeScript files\n`);

    // Process each file
    for (const file of files) {
      await this.fixFile(file);
    }

    // Generate summary
    this.printSummary();
  }

  async fixFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      const originalContent = content;

      // Fix 1: Update import paths
      content = this.fixImports(content);
      if (content !== originalContent) modified = true;

      // Fix 2: Fix Tolerance usage (diameter -> dimension)
      content = this.fixToleranceUsage(content);
      if (content !== originalContent) modified = true;

      // Fix 3: Fix DrillSettings (add required properties)
      content = this.fixDrillSettings(content);
      if (content !== originalContent) modified = true;

      // Fix 4: Fix CabinetDimensions export issue
      content = this.fixCabinetDimensions(content);
      if (content !== originalContent) modified = true;

      // Write back if modified
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixedFiles++;
        console.log(`✅ Fixed: ${filePath}`);
      }
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    }
  }

  fixImports(content) {
    let modified = content;

    // Update old type imports to new paths
    for (const [oldPath, types] of Object.entries(TYPE_MAPPINGS)) {
      for (const [typeName, newPath] of Object.entries(types)) {
        // Replace specific type imports
        const regex = new RegExp(`import\\s*{\\s*${typeName}\\s*}\\s*from\\s*['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
        modified = modified.replace(regex, `import { ${typeName} } from '${newPath}'`);

        // Replace named imports in multi-imports
        const multiImportRegex = new RegExp(`import\\s*{([^}]*${typeName}[^}]*)}\\s*from\\s*['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
        modified = modified.replace(multiImportRegex, (match, imports) => {
          // Split and rebuild imports, moving this type to new path
          const importList = imports.split(',').map(i => i.trim());
          const otherImports = importList.filter(i => i !== typeName);
          const result = [];
          
          if (otherImports.length > 0) {
            result.push(`import { ${otherImports.join(', ')} } from '${oldPath}'`);
          }
          result.push(`import { ${typeName} } from '${newPath}'`);
          
          return result.join('\n');
        });
      }
    }

    // Add base types imports where needed
    for (const [typeName, path] of Object.entries(BASE_TYPES)) {
      // Check if type is used but not imported
      if (content.includes(typeName) && !content.includes(`import { ${typeName} }`)) {
        // Find the last import statement
        const importMatches = content.match(/import[^;]+;/g);
        if (importMatches && importMatches.length > 0) {
          const lastImport = importMatches[importMatches.length - 1];
          const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
          content = content.slice(0, insertIndex) + 
                   `\nimport { ${typeName} } from '${path}';` + 
                   content.slice(insertIndex);
        }
      }
    }

    return modified;
  }

  fixToleranceUsage(content) {
    // Fix tolerance objects that use 'diameter' instead of 'dimension'
    const toleranceRegex = /tolerance:\s*{\s*diameter:\s*{\s*nominal:\s*([^,]+),\s*plus:\s*([^,]+),\s*minus:\s*([^}]+)\s*}\s*}/g;
    
    return content.replace(toleranceRegex, (match, nominal, plus, minus) => {
      return `tolerance: { dimension: 'diameter', nominal: ${nominal}, plus: ${plus}, minus: ${minus}, critical: false }`;
    });
  }

  fixDrillSettings(content) {
    // Fix DrillSettings objects missing required properties
    const drillSettingsRegex = /drillSettings:\s*{\s*([^}]+)\s*}/g;
    
    return content.replace(drillSettingsRegex, (match, settingsContent) => {
      // Check if required properties are missing
      if (!settingsContent.includes('toolType:') || !settingsContent.includes('toolDiameter:')) {
        // Extract existing properties
        const hasSpindleSpeed = settingsContent.includes('spindleSpeed:');
        const spindleSpeed = hasSpindleSpeed ? settingsContent.match(/spindleSpeed:\s*([^,]+)/)?.[1] : '3000';
        const feedRate = settingsContent.includes('feedRate:') ? settingsContent.match(/feedRate:\s*([^,]+)/)?.[1] : '300';
        
        // Build complete DrillSettings
        return `drillSettings: {
          spindleSpeed: ${spindleSpeed},
          feedRate: ${feedRate},
          toolType: 'drill-bit',
          toolDiameter: 5,
          ${settingsContent}
        }`;
      }
      return match;
    });
  }

  fixCabinetDimensions(content) {
    // Fix CabinetDimensions import/export issues
    if (content.includes('CabinetDimensions') && !content.includes('@/types/core/base.types')) {
      // Add CabinetDimensions import from base.types
      const importMatches = content.match(/import[^;]+;/g);
      if (importMatches && importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertIndex) + 
                 `\nimport { CabinetDimensions } from '@/types/core/base.types';` + 
                 content.slice(insertIndex);
      }
    }
    
    return content;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TYPE SYSTEM FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files fixed: ${this.fixedFiles}`);
    console.log(`❌ Errors encountered: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Run TypeScript check: npx tsc --noEmit');
    console.log('2. Fix any remaining manual issues');
    console.log('3. Run build: npm run build');
    console.log('\n✨ Type system migration progress completed!');
  }
}

// Run the script
if (require.main === module) {
  const fixer = new TypeFixer();
  fixer.run().catch(console.error);
}

module.exports = TypeFixer;
