#!/usr/bin/env node

/**
 * Analyze Remaining Type Issues Script
 * Comprehensive analysis of what's left to fix in the type system
 */

const fs = require('fs');
const { execSync } = require('child_process');

class TypeIssueAnalyzer {
  constructor() {
    this.issues = {
      importErrors: [],
      typeErrors: [],
      missingTypes: [],
      duplicateImports: [],
      pathErrors: [],
      otherErrors: []
    };
  }

  async run() {
    console.log('🔍 Analyzing Remaining Type System Issues\n');

    // Run TypeScript check and capture output
    await this.runTypeScriptCheck();
    
    // Analyze the results
    await this.analyzeIssues();
    
    // Generate comprehensive report
    await this.generateReport();

    console.log('\n✅ Type system analysis complete!');
  }

  async runTypeScriptCheck() {
    console.log('🔧 Running TypeScript check...');

    try {
      const output = execSync('npx tsc --noEmit', { 
        encoding: 'utf8', 
        cwd: './' 
      });
      
      console.log('✅ No TypeScript errors found!');
      return [];
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || '';
      const lines = errorOutput.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.includes('error TS')) {
          await this.categorizeError(line);
        }
      }
      
      return lines;
    }
  }

  async categorizeError(errorLine) {
    // Import path errors
    if (errorLine.includes("Cannot find module") || errorLine.includes("module") || errorLine.includes("import")) {
      this.issues.importErrors.push(errorLine);
    }
    // Type definition errors
    else if (errorLine.includes("Property") || errorLine.includes("does not exist") || errorLine.includes("Type")) {
      this.issues.typeErrors.push(errorLine);
    }
    // Missing type errors
    else if (errorLine.includes("Cannot find name") || errorLine.includes("is not defined")) {
      this.issues.missingTypes.push(errorLine);
    }
    // Path syntax errors
    else if (errorLine.includes("TS1005") || errorLine.includes("TS1002") || errorLine.includes("TS1434")) {
      this.issues.pathErrors.push(errorLine);
    }
    // Other errors
    else {
      this.issues.otherErrors.push(errorLine);
    }
  }

  async analyzeIssues() {
    console.log('📊 Analyzing issue patterns...');

    // Analyze import errors
    await this.analyzeImportErrors();
    
    // Analyze type errors
    await this.analyzeTypeErrors();
    
    // Analyze missing types
    await this.analyzeMissingTypes();
    
    // Analyze path errors
    await this.analyzePathErrors();
  }

  async analyzeImportErrors() {
    console.log(`📁 Analyzing ${this.issues.importErrors.length} import errors...`);

    const importPatterns = {};
    
    for (const error of this.issues.importErrors) {
      // Extract import path patterns
      const pathMatch = error.match(/from '([^']+)'/);
      if (pathMatch) {
        const path = pathMatch[1];
        importPatterns[path] = (importPatterns[path] || 0) + 1;
      }
    }

    console.log('\n🎯 Import Error Patterns:');
    Object.entries(importPatterns).forEach(([path, count]) => {
      console.log(`  ${path}: ${count} errors`);
    });
  }

  async analyzeTypeErrors() {
    console.log(`🔧 Analyzing ${this.issues.typeErrors.length} type errors...`);

    const typePatterns = {};
    
    for (const error of this.issues.typeErrors) {
      // Extract type error patterns
      const propertyMatch = error.match(/Property '([^']+)' does not exist/);
      if (propertyMatch) {
        const property = propertyMatch[1];
        typePatterns[property] = (typePatterns[property] || 0) + 1;
      }
    }

    console.log('\n🎯 Type Error Patterns:');
    Object.entries(typePatterns).forEach(([property, count]) => {
      console.log(`  ${property}: ${count} errors`);
    });
  }

  async analyzeMissingTypes() {
    console.log(`❓ Analyzing ${this.issues.missingTypes.length} missing type errors...`);

    const missingPatterns = {};
    
    for (const error of this.issues.missingTypes) {
      // Extract missing type patterns
      const typeMatch = error.match(/Cannot find name '([^']+)'/);
      if (typeMatch) {
        const type = typeMatch[1];
        missingPatterns[type] = (missingPatterns[type] || 0) + 1;
      }
    }

    console.log('\n🎯 Missing Type Patterns:');
    Object.entries(missingPatterns).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} errors`);
    });
  }

  async analyzePathErrors() {
    console.log(`🛤️  Analyzing ${this.issues.pathErrors.length} path syntax errors...`);

    const pathPatterns = {};
    
    for (const error of this.issues.pathErrors) {
      // Extract path syntax error patterns
      const pathMatch = error.match(/from '([^']+)'/);
      if (pathMatch) {
        const path = pathMatch[1];
        pathPatterns[path] = (pathPatterns[path] || 0) + 1;
      }
    }

    console.log('\n🎯 Path Syntax Error Patterns:');
    Object.entries(pathPatterns).forEach(([path, count]) => {
      console.log(`  ${path}: ${count} errors`);
    });
  }

  async generateReport() {
    console.log('\n📝 Generating comprehensive report...');

    const report = this.generateReportContent();
    
    // Write the report
    fs.writeFileSync('./TYPE_SYSTEM_STATUS.md', report, 'utf8');
    
    console.log('✅ Report generated: TYPE_SYSTEM_STATUS.md');
  }

  generateReportContent() {
    const totalErrors = Object.values(this.issues).reduce((sum, arr) => sum + arr.length, 0);
    
    return `# Type System Status Report

## 📊 **Current Status Overview**

**Total Errors**: ${totalErrors}
- Import Errors: ${this.issues.importErrors.length}
- Type Errors: ${this.issues.typeErrors.length}
- Missing Types: ${this.issues.missingTypes.length}
- Path Syntax Errors: ${this.issues.pathErrors.length}
- Other Errors: ${this.issues.otherErrors.length}

## 🎯 **What's Left to Do**

### 1. **Import Path Issues** (${this.issues.importErrors.length} errors)

These are import statements with incorrect paths or syntax:

${this.issues.importErrors.length > 0 ? 
  this.issues.importErrors.slice(0, 10).map(err => `- ${err}`).join('\n') + 
  (this.issues.importErrors.length > 10 ? '\n- ... and more' : '') : 
  '✅ No import errors found!'}

**Fix Strategy:**
- Update import paths to use consolidated structure
- Fix syntax errors in import statements
- Ensure all imports use \`@/types\` for types

### 2. **Type Definition Issues** (${this.issues.typeErrors.length} errors)

These are type mismatches or missing properties:

${this.issues.typeErrors.length > 0 ? 
  this.issues.typeErrors.slice(0, 10).map(err => `- ${err}`).join('\n') + 
  (this.issues.typeErrors.length > 10 ? '\n- ... and more' : '') : 
  '✅ No type errors found!'}

**Fix Strategy:**
- Add missing properties to type definitions
- Update type usage to match centralized types
- Ensure all types are properly exported

### 3. **Missing Type References** (${this.issues.missingTypes.length} errors)

These are undefined types or variables:

${this.issues.missingTypes.length > 0 ? 
  this.issues.missingTypes.slice(0, 10).map(err => `- ${err}`).join('\n') + 
  (this.issues.missingTypes.length > 10 ? '\n- ... and more' : '') : 
  '✅ No missing type errors found!'}

**Fix Strategy:**
- Add missing type definitions to centralized types
- Import missing types from \`@/types\`
- Ensure all types are properly exported

### 4. **Path Syntax Errors** (${this.issues.pathErrors.length} errors)

These are syntax errors in import paths:

${this.issues.pathErrors.length > 0 ? 
  this.issues.pathErrors.slice(0, 10).map(err => `- ${err}`).join('\n') + 
  (this.issues.pathErrors.length > 10 ? '\n- ... and more' : '') : 
  '✅ No path syntax errors found!'}

**Fix Strategy:**
- Fix malformed import paths
- Remove extra quotes or syntax errors
- Ensure proper path formatting

## 🚀 **Recommended Next Steps**

### **Priority 1: Fix Import Path Issues**
1. Update all import paths to use consolidated structure
2. Fix syntax errors in import statements
3. Ensure all type imports use \`@/types\`

### **Priority 2: Add Missing Type Definitions**
1. Identify missing types from error analysis
2. Add missing types to appropriate category files
3. Ensure proper exports in index.ts

### **Priority 3: Fix Type Mismatches**
1. Update type usage to match centralized definitions
2. Add missing properties to type interfaces
3. Ensure type consistency across files

### **Priority 4: Clean Up and Optimize**
1. Remove duplicate imports
2. Optimize import statements
3. Ensure all files use centralized types

## 📋 **Quick Fix Commands**

### Fix Import Paths
\`\`\`bash
node scripts/fix-remaining-import-paths.js
\`\`\`

### Add Missing Types
\`\`\`bash
node scripts/add-missing-types.js
\`\`\`

### Fix Type Mismatches
\`\`\`bash
node scripts/fix-type-mismatches.js
\`\`\`

## 🎯 **Success Criteria**

✅ **Complete When:**
- 0 TypeScript errors
- All imports use \`@/types\`
- All types are properly defined
- No duplicate or missing imports
- Clean, consistent type usage

---

**Status**: ${totalErrors === 0 ? '✅ COMPLETE' : '🔄 IN PROGRESS'} - ${totalErrors} errors remaining
`;
  }
}

// Run the analysis
if (require.main === module) {
  new TypeIssueAnalyzer().run();
}

module.exports = TypeIssueAnalyzer;
