#!/usr/bin/env node

/**
 * Complete Application Error Fix Script
 * Addresses all remaining TypeScript errors in application components
 */

const { execSync } = require('child_process');
const fs = require('fs');

class CompleteAppErrorFixer {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.fixes = [];
  }

  async run() {
    console.log('🔧 Complete Application Error Fix Script');
    console.log('==========================================\n');

    try {
      // Step 1: Create missing components
      await this.runStep('1', 'Create Missing Components', () => {
        this.runScript('./create-missing-components.js');
      });

      // Step 2: Fix application components
      await this.runStep('2', 'Fix Application Components', () => {
        this.runScript('./fix-app-components.js');
      });

      // Step 3: Fix specific critical files
      await this.runStep('3', 'Fix Critical Files', () => {
        this.fixCriticalFiles();
      });

      // Step 4: Update package.json scripts
      await this.runStep('4', 'Update NPM Scripts', () => {
        this.updateNpmScripts();
      });

      // Step 5: Run final TypeScript check
      await this.runStep('5', 'Final TypeScript Check', () => {
        this.runTypeCheck();
      });

      // Summary
      this.printSummary();

    } catch (error) {
      console.error('❌ Complete fix failed:', error.message);
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
      cwd: process.cwd()
    });
  }

  fixCriticalFiles() {
    console.log('🔧 Fixing critical application files...');
    
    const criticalFixes = [
      {
        file: './src/app/demo/page.tsx',
        fixes: [
          { from: "from '@/components/CNCSimulator'", to: "import CNCSimulator from '@/components/CNCSimulator'" },
          { from: "from '@/components/CutlistGenerator'", to: "import CutlistGenerator from '@/components/CutlistGenerator'" },
          { from: "from '@/components/CutListPanel'", to: "import CutListPanel from '@/components/CutListPanel'" }
        ]
      },
      {
        file: './src/app/analysis-tools/page.tsx',
        fixes: [
          { from: "from '@/components/CNCSimulator'", to: "import CNCSimulator from '@/components/CNCSimulator'" },
          { from: "from '@/components/CutlistGenerator'", to: "import CutlistGenerator from '@/components/CutlistGenerator'" },
          { from: "from '@/components/CutListPanel'", to: "import CutListPanel from '@/components/CutListPanel'" }
        ]
      },
      {
        file: './src/app/cabinet-tools/page.tsx',
        fixes: [
          { from: "from './SimpleCabinetViewer'", to: "import SimpleCabinetViewer from './SimpleCabinetViewer'" },
          { from: "from './SimpleQuickAdd'", to: "import SimpleQuickAdd from './SimpleQuickAdd'" }
        ]
      }
    ];

    criticalFixes.forEach(({ file, fixes }) => {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        fixes.forEach(({ from, to }) => {
          if (content.includes(from)) {
            content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
            modified = true;
          }
        });

        if (modified) {
          fs.writeFileSync(file, content, 'utf8');
          console.log(`✅ Fixed critical file: ${file}`);
        }
      }
    });
  }

  updateNpmScripts() {
    const packageJsonPath = './package.json';
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add scripts for app fixes
    const scripts = {
      "fix-app-components": "node scripts/fix-app-components.js",
      "create-missing-components": "node scripts/create-missing-components.js",
      "fix-all-app-errors": "node scripts/fix-all-app-errors.js",
      "check-app-errors": "npx tsc --noEmit --listFiles | findstr error || echo 'No errors found'"
    };

    packageJson.scripts = { ...packageJson.scripts, ...scripts };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added NPM scripts for app fixes');
  }

  runTypeCheck() {
    console.log('🔍 Running final TypeScript check...');
    
    try {
      const result = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('✅ No TypeScript errors found!');
    } catch (error) {
      // tsc returns non-zero exit code on errors
      const output = error.stdout || error.stderr;
      const errorCount = (output.match(/error/g) || []).length;
      
      if (errorCount === 0) {
        console.log('✅ No TypeScript errors found!');
      } else {
        console.log(`⚠️  Found ${errorCount} TypeScript errors remaining`);
        console.log('Some errors may require manual fixing');
        
        // Show first few errors for debugging
        const lines = output.split('\n');
        const errorLines = lines.filter(line => line.includes('error')).slice(0, 10);
        
        if (errorLines.length > 0) {
          console.log('\n🔍 Sample errors:');
          errorLines.forEach(line => console.log(`  ${line}`));
        }
      }
    }
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPLETE APP ERROR FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    
    console.log('\n✅ Completed Fixes:');
    this.fixes.forEach(fix => console.log(`  ${fix}`));
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. npm run check-app-errors    # Check remaining errors');
    console.log('2. npm run build              # Test the build');
    console.log('3. npm run dev                # Start development server');
    
    console.log('\n📚 Available Scripts:');
    console.log('- npm run fix-all-app-errors  # Run all app fixes');
    console.log('- npm run fix-app-components  # Fix component issues');
    console.log('- npm run create-missing-components # Create missing components');
    console.log('- npm run check-app-errors    # Check app errors');
    
    console.log('\n✨ Application error fix process completed!');
  }
}

// Run if called directly
if (require.main === module) {
  new CompleteAppErrorFixer().run();
}

module.exports = CompleteAppErrorFixer;
