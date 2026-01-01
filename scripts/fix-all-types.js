#!/usr/bin/env node

/**
 * Master Type System Fix Script
 * Runs all type fixes in the correct order to resolve TypeScript errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MasterTypeFixer {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.fixes = [];
  }

  async run() {
    console.log('🔧 Master Type System Fix Script');
    console.log('=====================================\n');

    try {
      // Step 1: Quick fixes for most critical issues
      await this.runStep('1', 'Quick Critical Fixes', () => {
        this.runScript('./quick-fix-types.js');
      });

      // Step 2: Fix drill pattern structure
      await this.runStep('2', 'Drill Pattern Structure', () => {
        this.runScript('./fix-drill-patterns.js');
      });

      // Step 3: Comprehensive type fixes
      await this.runStep('3', 'Comprehensive Type Fixes', () => {
        this.runScript('./fix-types.js');
      });

      // Step 4: Update package.json scripts
      await this.runStep('4', 'Add NPM Scripts', () => {
        this.addNpmScripts();
      });

      // Step 5: Run TypeScript check
      await this.runStep('5', 'TypeScript Validation', () => {
        this.runTypeCheck();
      });

      // Summary
      this.printSummary();

    } catch (error) {
      console.error('❌ Master fix failed:', error.message);
      process.exit(1);
    }
  }

  async runStep(step, name, fn) {
    console.log(`\n📍 Step ${step}: ${name}`);
    console.log('-'.repeat(50));
    
    try {
      await fn();
      this.fixes.push(`✅ Step ${step}: ${name}`);
    } catch (error) {
      this.errors.push(`❌ Step ${step}: ${name} - ${error.message}`);
      throw error;
    }
  }

  runScript(scriptPath) {
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script not found: ${scriptPath}`);
    }
    
    console.log(`🔄 Running: ${scriptPath}`);
    execSync(`node "${scriptPath}"`, { 
      stdio: 'inherit',
      cwd: path.dirname(scriptPath)
    });
  }

  addNpmScripts() {
    const packageJsonPath = './package.json';
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add scripts if they don't exist
    const scripts = {
      "fix-types": "node scripts/fix-all-types.js",
      "fix-types-quick": "node scripts/quick-fix-types.js",
      "fix-patterns": "node scripts/fix-drill-patterns.js",
      "check-types": "npx tsc --noEmit",
      "type-report": "npx tsc --noEmit --listFiles | grep -E '(error|found)'"
    };

    packageJson.scripts = { ...packageJson.scripts, ...scripts };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added NPM scripts for type fixes');
  }

  runTypeCheck() {
    console.log('🔍 Running TypeScript check...');
    
    try {
      const result = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const lines = result.split('\n');
      const errorCount = lines.filter(line => line.includes('error')).length;
      
      if (errorCount === 0) {
        console.log('✅ No TypeScript errors found!');
      } else {
        console.log(`⚠️  Found ${errorCount} TypeScript errors`);
        console.log('Run "npm run check-types" to see all errors');
      }
    } catch (error) {
      // tsc returns non-zero exit code on errors
      const output = error.stdout || error.stderr;
      const errorCount = (output.match(/error/g) || []).length;
      console.log(`⚠️  Found ${errorCount} TypeScript errors`);
      console.log('Some errors may require manual fixing');
    }
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TYPE SYSTEM FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    
    console.log('\n✅ Completed Fixes:');
    this.fixes.forEach(fix => console.log(`  ${fix}`));
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. npm run check-types     # Check remaining TypeScript errors');
    console.log('2. npm run build          # Test the build');
    console.log('3. npm run dev            # Start development server');
    
    console.log('\n📚 Available Scripts:');
    console.log('- npm run fix-types       # Run all fixes');
    console.log('- npm run fix-types-quick # Quick fixes only');
    console.log('- npm run fix-patterns    # Fix drill patterns');
    console.log('- npm run check-types     # TypeScript check');
    
    console.log('\n✨ Type system fix process completed!');
  }
}

// Run if called directly
if (require.main === module) {
  new MasterTypeFixer().run();
}

module.exports = MasterTypeFixer;
