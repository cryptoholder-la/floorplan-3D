#!/usr/bin/env node

/**
 * Fix Duplicate Imports Script
 * Fixes duplicate import statements created during the component fixes
 */

const fs = require('fs');

class DuplicateImportFixer {
  constructor() {
    this.fixes = 0;
  }

  run() {
    console.log('🔧 Fixing Duplicate Import Statements\n');

    const filesToFix = [
      './src/app/analysis-tools/page.tsx',
      './src/app/cabinet-tools/page.tsx',
      './src/app/demo/page.tsx',
      './src/app/manufacturing-tools/page.tsx'
    ];

    filesToFix.forEach(file => {
      this.fixFile(file);
    });

    console.log(`\n✅ Fixed ${this.fixes} files with duplicate imports`);
  }

  fixFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix duplicate imports
    const duplicateFixes = [
      { from: 'import CNCSimulator import CNCSimulator', to: 'import CNCSimulator' },
      { from: 'import CutlistGenerator import CutlistGenerator', to: 'import CutlistGenerator' },
      { from: 'import CutListPanel import CutListPanel', to: 'import CutListPanel' },
      { from: 'import SimpleCabinetViewer import SimpleCabinetViewer', to: 'import SimpleCabinetViewer' },
      { from: 'import SimpleQuickAdd import SimpleQuickAdd', to: 'import SimpleQuickAdd' }
    ];

    duplicateFixes.forEach(({ from, to }) => {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.fixes++;
      console.log(`✅ Fixed: ${filePath}`);
    }
  }
}

// Run the script
if (require.main === module) {
  new DuplicateImportFixer().run();
}

module.exports = DuplicateImportFixer;
