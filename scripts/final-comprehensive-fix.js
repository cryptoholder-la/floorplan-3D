#!/usr/bin/env node

/**
 * Final Comprehensive Fix Script
 * Addresses all remaining TypeScript errors with targeted fixes
 */

const fs = require('fs');

class FinalComprehensiveFixer {
  constructor() {
    this.fixes = 0;
    this.errors = [];
  }

  async run() {
    console.log('🔧 Final Comprehensive TypeScript Fix\n');

    // Fix 1: Drill patterns JSON syntax issues
    this.fixDrillPatterns();

    // Fix 2: GCodeGenerator issues
    this.fixGCodeGenerator();

    // Fix 3: Cabinet generator issues
    this.fixCabinetGenerator();

    // Fix 4: Common import and type issues
    this.fixCommonIssues();

    console.log(`\n✅ Applied ${this.fixes} final fixes`);
    console.log('\n🎯 Run: npm run check-types to verify fixes');
  }

  fixDrillPatterns() {
    const file = './src/lib/drill-patterns-library.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix JSON.stringify issues - convert to proper TypeScript objects
    content = content.replace(
      /geometry:\s*({[^}]+})/g,
      (match, geometryStr) => {
        try {
          const geometry = JSON.parse(geometryStr);
          return `geometry: ${this.formatObject(geometry)}`;
        } catch {
          return match;
        }
      }
    );

    content = content.replace(
      /parameters:\s*({[^}]+})/g,
      (match, paramsStr) => {
        try {
          const params = JSON.parse(paramsStr);
          return `parameters: ${this.formatObject(params)}`;
        } catch {
          return match;
        }
      }
    );

    content = content.replace(
      /metadata:\s*({[^}]+})/g,
      (match, metadataStr) => {
        try {
          const metadata = JSON.parse(metadataStr);
          return `metadata: ${this.formatMetadata(metadata)}`;
        } catch {
          return match;
        }
      }
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed drill patterns syntax');
    }
  }

  formatObject(obj) {
    const props = Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${key}: ${this.formatObject(value)}`;
      }
      return `${key}: ${typeof value === 'string' ? `'${value}'` : value}`;
    }).join(',\n    ');
    return `{\n    ${props}\n  }`;
  }

  formatMetadata(metadata) {
    // Fix specific metadata properties
    const fixed = { ...metadata };
    
    // Convert lastModified string to Date
    if (typeof fixed.lastModified === 'string') {
      fixed.lastModified = 'new Date()';
    }

    // Fix usage structure
    if (fixed.usage && typeof fixed.usage === 'object') {
      fixed.usage = {
        count: fixed.usage.projectCount || 0,
        lastUsed: fixed.usage.lastUsed || null
      };
    }

    // Fix validation structure
    if (fixed.validation && typeof fixed.validation === 'object') {
      fixed.validation = {
        isValid: fixed.validation.status === 'valid',
        errors: fixed.validation.errors || [],
        warnings: fixed.validation.warnings || []
      };
    }

    return this.formatObject(fixed);
  }

  fixGCodeGenerator() {
    const file = './src/lib/gcode-generator.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Remove absoluteMode property
    content = content.replace(/absoluteMode:\s*true,?\s*/g, '');

    // Fix GCodeCommand structure
    content = content.replace(
      /return\s*{\s*lineNumber:\s*number,\s*command:\s*string,\s*parameters:\s*Record<string,\s*number>,\s*comment:\s*undefined\s*}/g,
      `return {
        lineNumber,
        command,
        parameters,
        comment,
        block: 'main',
        modal: 'G90'
      }`
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed gcode-generator issues');
    }
  }

  fixCabinetGenerator() {
    const file = './src/lib/cabinet-generator.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix specific property issues
    const fixes = [
      { from: 'pricePerSheet:', to: 'cost:' },
      { from: 'quantity:', to: 'count:' },
      { from: 'unitPrice:', to: 'price:' }
    ];

    fixes.forEach(({ from, to }) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed cabinet generator issues');
    }
  }

  fixCommonIssues() {
    // Fix common issues across multiple files
    const commonFixes = [
      {
        files: [
          './src/app/analysis-tools/page.tsx',
          './src/app/cabinet-tools/page.tsx',
          './src/app/demo/page.tsx',
          './src/app/manufacturing-tools/page.tsx'
        ],
        fixes: [
          { from: 'import CNCSimulator import CNCSimulator', to: 'import CNCSimulator' },
          { from: 'import CutlistGenerator import CutlistGenerator', to: 'import CutlistGenerator' },
          { from: 'import CutListPanel import CutListPanel', to: 'import CutListPanel' }
        ]
      }
    ];

    commonFixes.forEach(({ files, fixes }) => {
      files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          const original = content;

          fixes.forEach(({ from, to }) => {
            content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          });

          if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            this.fixes++;
            console.log(`✅ Fixed common issues in ${filePath}`);
          }
        }
      });
    });
  }
}

// Run the script
if (require.main === module) {
  new FinalComprehensiveFixer().run();
}

module.exports = FinalComprehensiveFixer;
