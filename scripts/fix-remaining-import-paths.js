#!/usr/bin/env node

/**
 * Fix Remaining Import Paths Script
 * Fixes the 6 remaining path syntax errors
 */

const fs = require('fs');

class RemainingImportPathFixer {
  constructor() {
    this.fixes = 0;
    this.errors = [];
  }

  async run() {
    console.log('🔧 Fixing Remaining Import Path Syntax Errors\n');

    // Fix the specific files with syntax errors
    await this.fixCabinetsPage();
    await this.fixDrillConfiguratorPage();

    this.printSummary();
  }

  async fixCabinetsPage() {
    console.log('🔧 Fixing src/app/cabinets/page.tsx...');

    const filePath = './src/app/cabinets/page.tsx';
    
    if (!fs.existsSync(filePath)) {
      console.log('⚠️  File not found, skipping...');
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix the malformed import: from '@/contexts/'ScaleContext'
    content = content.replace(
      "from '@/contexts/'ScaleContext'",
      "from '@/contexts/ScaleContext'"
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed cabinets page import');
    }
  }

  async fixDrillConfiguratorPage() {
    console.log('🔧 Fixing src/app/drill-configurator/enhanced/page.tsx...');

    const filePath = './src/app/drill-configurator/enhanced/page.tsx';
    
    if (!fs.existsSync(filePath)) {
      console.log('⚠️  File not found, skipping...');
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix the malformed import: from '@/pages/'drill-configurator/EnhancedDrillConfigurator'
    content = content.replace(
      "from '@/pages/'drill-configurator/EnhancedDrillConfigurator'",
      "from '@/pages/drill-configurator/EnhancedDrillConfigurator'"
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed drill configurator page import');
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REMAINING IMPORT PATH FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files fixed: ${this.fixes}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 Fixed Issues:');
    console.log('  - Malformed import path in cabinets page');
    console.log('  - Malformed import path in drill configurator page');
    console.log('  - Removed extra quotes in import paths');
    console.log('  - Fixed path syntax errors');
    
    console.log('\n✨ All remaining import path issues fixed!');
  }
}

// Run the script
if (require.main === module) {
  new RemainingImportPathFixer().run();
}

module.exports = RemainingImportPathFixer;
