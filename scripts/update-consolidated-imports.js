#!/usr/bin/env node

/**
 * Update Consolidated Imports Script
 * Updates all import paths to work with the new consolidated directory structure
 */

const fs = require('fs');

class ConsolidatedImportUpdater {
  constructor() {
    this.fixes = 0;
    this.errors = [];
  }

  async run() {
    console.log('🔧 Updating Import Paths for Consolidated Structure\n');

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
      if (!fs.existsSync(filePath)) return;

      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Update import paths for consolidated structure
      content = this.updateComponentImports(content);
      content = this.updateTypeImports(content);
      content = this.updateLibImports(content);
      content = this.updateUIImports(content);
      content = this.updateDataImports(content);
      content = this.updateHookImports(content);
      content = this.updateContextImports(content);
      content = this.updatePageImports(content);

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

  updateComponentImports(content) {
    let modified = content;

    // Update component imports from scattered locations to consolidated
    const componentFixes = {
      "from '@/components/10_10/": "from '@/components/",
      "from '@/components/ui/": "from '@/ui/",
      "from '@/app/": "from '@/pages/'"
    };

    for (const [oldPath, newPath] of Object.entries(componentFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateTypeImports(content) {
    let modified = content;

    // Update type imports from domain structure to consolidated
    const typeFixes = {
      "from '@/types/core/": "from '@/types/",
      "from '@/types/domain/": "from '@/types/", 
      "from '@/types/integration/": "from '@/types/"
    };

    for (const [oldPath, newPath] of Object.entries(typeFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateLibImports(content) {
    let modified = content;

    // Update lib imports from subdirectories to consolidated
    const libFixes = {
      "from '@/lib/catalog/": "from '@/lib/",
      "from '@/lib/hooks/": "from '@/hooks/'"
    };

    for (const [oldPath, newPath] of Object.entries(libFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateUIImports(content) {
    let modified = content;

    // UI imports are already correct, but ensure consistency
    const uiFixes = {
      "from '@/components/ui/": "from '@/ui/'"
    };

    for (const [oldPath, newPath] of Object.entries(uiFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateDataImports(content) {
    let modified = content;

    // Update data imports from subdirectories to consolidated
    const dataFixes = {
      "from '@/data/sample/": "from '@/data/'"
    };

    for (const [oldPath, newPath] of Object.entries(dataFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateHookImports(content) {
    let modified = content;

    // Update hook imports to consolidated location
    const hookFixes = {
      "from '@/lib/hooks/": "from '@/hooks/'",
      "from '@/hooks/use-mobile": "from '@/hooks/use-mobile'"
    };

    for (const [oldPath, newPath] of Object.entries(hookFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updateContextImports(content) {
    let modified = content;

    // Context imports should be from contexts directory
    const contextFixes = {
      "from '@/contexts/": "from '@/contexts/'"
    };

    for (const [oldPath, newPath] of Object.entries(contextFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  updatePageImports(content) {
    let modified = content;

    // Update page imports from app structure to consolidated
    const pageFixes = {
      "from '@/app/": "from '@/pages/'"
    };

    for (const [oldPath, newPath] of Object.entries(pageFixes)) {
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      modified = modified.replace(new RegExp(escapedPath, 'g'), newPath);
    }

    return modified;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONSOLIDATED IMPORT UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files updated: ${this.fixes}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Updated Import Paths:');
    console.log('  - Components: @/components/10_10/ → @/components/');
    console.log('  - UI: @/components/ui/ → @/ui/');
    console.log('  - Types: @/types/core/ → @/types/');
    console.log('  - Types: @/types/domain/ → @/types/');
    console.log('  - Types: @/types/integration/ → @/types/');
    console.log('  - Pages: @/app/ → @/pages/');
    console.log('  - Hooks: @/lib/hooks/ → @/hooks/');
    console.log('  - Data: @/data/sample/ → @/data/');
    
    console.log('\n🚀 New Import Structure:');
    console.log('  @/components/     - All components');
    console.log('  @/pages/          - All pages');
    console.log('  @/lib/            - All library files');
    console.log('  @/types/          - All type definitions');
    console.log('  @/data/           - All data files');
    console.log('  @/hooks/          - All custom hooks');
    console.log('  @/contexts/       - All React contexts');
    console.log('  @/ui/             - UI components');
    console.log('  @/assets/         - All assets');
    console.log('  @/config/         - All config files');
    
    console.log('\n✨ Import path updates completed!');
  }
}

// Add path module
const path = require('path');

// Run the script
if (require.main === module) {
  new ConsolidatedImportUpdater().run();
}

module.exports = ConsolidatedImportUpdater;
