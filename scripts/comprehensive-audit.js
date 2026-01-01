#!/usr/bin/env node

/**
 * Comprehensive Code Audit Script
 * Analyzes files for logic, organization, and performance improvement opportunities
 */

const fs = require('fs');
const path = require('path');

class ComprehensiveAuditor {
  constructor() {
    this.auditResults = {
      logic: [],
      organization: [],
      performance: [],
      security: [],
      maintainability: []
    };
    this.fileAnalysis = new Map();
  }

  async run() {
    console.log('🔍 Starting Comprehensive Code Audit\n');

    // Analyze all source files
    await this.analyzeAllFiles();
    
    // Identify improvement opportunities
    await this.identifyLogicOpportunities();
    await this.identifyOrganizationOpportunities();
    await this.identifyPerformanceOpportunities();
    await this.identifySecurityOpportunities();
    await this.identifyMaintainabilityOpportunities();
    
    // Generate comprehensive audit report
    await this.generateAuditReport();
    
    console.log('\n✅ Comprehensive audit complete!');
  }

  async analyzeAllFiles() {
    console.log('📁 Analyzing all source files...');

    const directories = ['./src'];
    
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }
    
    console.log(`✅ Analyzed ${this.fileAnalysis.size} files`);
  }

  async scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (this.isCodeFile(item)) {
          await this.analyzeFile(fullPath);
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  isCodeFile(filename) {
    const codeExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.basename(filePath, path.extname(filePath));
      
      const analysis = {
        path: filePath,
        filename: filename,
        size: content.length,
        lines: content.split('\n').length,
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        functions: this.extractFunctions(content),
        classes: this.extractClasses(content),
        interfaces: this.extractInterfaces(content),
        types: this.extractTypes(content),
        complexity: this.analyzeComplexity(content),
        performance: this.analyzePerformance(content),
        security: this.analyzeSecurity(content),
        organization: this.analyzeOrganization(content),
        maintainability: this.analyzeMaintainability(content),
        lastModified: fs.statSync(filePath).mtime
      };
      
      this.fileAnalysis.set(filePath, analysis);
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  extractImports(content) {
    const imports = [];
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  extractExports(content) {
    const exports = [];
    const exportRegex = /export\s+(?:interface|type|class|function|const|let|var)\s+(\w+)/g;
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  extractFunctions(content) {
    const functions = [];
    const funcRegex = /(?:function\s+(\w+)|(\w+)\s*:\s*\([^)]*\)\s*=>|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>)/g;
    let match;
    
    while ((match = funcRegex.exec(content)) !== null) {
      const funcName = match[1] || match[2] || match[3];
      if (funcName) {
        functions.push(funcName);
      }
    }
    
    return functions;
  }

  extractClasses(content) {
    const classes = [];
    const classRegex = /class\s+(\w+)/g;
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }
    
    return classes;
  }

  extractInterfaces(content) {
    const interfaces = [];
    const interfaceRegex = /interface\s+(\w+)/g;
    let match;
    
    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push(match[1]);
    }
    
    return interfaces;
  }

  extractTypes(content) {
    const types = [];
    const typeRegex = /type\s+(\w+)/g;
    let match;
    
    while ((match = typeRegex.exec(content)) !== null) {
      types.push(match[1]);
    }
    
    return types;
  }

  analyzeComplexity(content) {
    const complexity = {
      cyclomaticComplexity: 0,
      nestingDepth: 0,
      functionCount: 0,
      classCount: 0,
      conditionalStatements: 0,
      loopStatements: 0,
      tryCatchBlocks: 0
    };
    
    // Count cyclomatic complexity indicators
    complexity.conditionalStatements = (content.match(/if\s*\(|else\s+if|switch\s*\(/g) || []).length;
    complexity.loopStatements = (content.match(/for\s*\(|while\s*\(|\.forEach\(|\.map\(|\.filter\(/g) || []).length;
    complexity.tryCatchBlocks = (content.match(/try\s*\{|catch\s*\(/g) || []).length;
    complexity.functionCount = this.extractFunctions(content).length;
    complexity.classCount = this.extractClasses(content).length;
    
    // Calculate cyclomatic complexity (simplified)
    complexity.cyclomaticComplexity = 
      complexity.conditionalStatements + 
      complexity.loopStatements + 
      complexity.tryCatchBlocks + 1;
    
    // Calculate maximum nesting depth
    const lines = content.split('\n');
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const line of lines) {
      const opens = (line.match(/{/g) || []).length;
      const closes = (line.match(/}/g) || []).length;
      currentDepth += opens - closes;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    complexity.nestingDepth = maxDepth;
    
    return complexity;
  }

  analyzePerformance(content) {
    const performance = {
      expensiveOperations: [],
      potentialOptimizations: [],
      memoryLeaks: [],
      inefficientPatterns: []
    };
    
    // Check for expensive operations
    const expensivePatterns = [
      { pattern: /document\.querySelectorAll/g, type: 'DOM queries' },
      { pattern: /JSON\.parse\(/g, type: 'JSON parsing' },
      { pattern: /JSON\.stringify\(/g, type: 'JSON stringification' },
      { pattern: /RegExp\(/g, type: 'RegExp creation' },
      { pattern: /new\s+Date\(/g, type: 'Date creation' },
      { pattern: /\.sort\(/g, type: 'Array sorting' }
    ];
    
    for (const { pattern, type } of expensivePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        performance.expensiveOperations.push({
          type,
          count: matches.length,
          recommendation: this.getOptimizationRecommendation(type)
        });
      }
    }
    
    // Check for inefficient patterns
    const inefficientPatterns = [
      { pattern: /for\s*\(.*length.*\)/g, type: 'Length in loop condition' },
      { pattern: /\.length\s*===\s*0/g, type: 'Length check instead of isEmpty' },
      { pattern: /console\.log/g, type: 'Console logging in production' },
      { pattern: /debugger/g, type: 'Debugger statements' }
    ];
    
    for (const { pattern, type } of inefficientPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        performance.inefficientPatterns.push({
          type,
          count: matches.length,
          recommendation: this.getInefficiencyRecommendation(type)
        });
      }
    }
    
    return performance;
  }

  analyzeSecurity(content) {
    const security = {
      vulnerabilities: [],
      sensitiveData: [],
      insecurePatterns: []
    };
    
    // Check for security vulnerabilities
    const securityPatterns = [
      { pattern: /eval\(/g, type: 'eval() usage' },
      { pattern: /innerHTML\s*=/g, type: 'innerHTML assignment' },
      { pattern: /dangerouslySetInnerHTML/g, type: 'dangerouslySetInnerHTML' },
      { pattern: /Function\(/g, type: 'Function constructor' },
      { pattern: /setTimeout\s*\(\s*["']/g, type: 'setTimeout with string' }
    ];
    
    for (const { pattern, type } of securityPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        security.vulnerabilities.push({
          type,
          count: matches.length,
          severity: this.getSecuritySeverity(type),
          recommendation: this.getSecurityRecommendation(type)
        });
      }
    }
    
    // Check for sensitive data exposure
    const sensitivePatterns = [
      { pattern: /password/gi, type: 'Password reference' },
      { pattern: /api[_-]?key/gi, type: 'API key reference' },
      { pattern: /secret/gi, type: 'Secret reference' },
      { pattern: /token/gi, type: 'Token reference' }
    ];
    
    for (const { pattern, type } of sensitivePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        security.sensitiveData.push({
          type,
          count: matches.length,
          recommendation: 'Ensure sensitive data is properly secured and not hardcoded'
        });
      }
    }
    
    return security;
  }

  analyzeOrganization(content) {
    const organization = {
      structureIssues: [],
      namingIssues: [],
      importIssues: [],
      exportIssues: []
    };
    
    // Check for structure issues
    if (content.length > 5000) {
      organization.structureIssues.push({
        type: 'Large file',
        severity: 'medium',
        recommendation: 'Consider splitting into smaller modules'
      });
    }
    
    const lines = content.split('\n');
    if (lines.length > 200) {
      organization.structureIssues.push({
        type: 'Long file',
        severity: 'medium',
        recommendation: 'Consider breaking into smaller files'
      });
    }
    
    // Check for naming issues
    const namingPatterns = [
      { pattern: /\b[a-z]\b/g, type: 'Single letter variable' },
      { pattern: /temp/gi, type: 'Temporary variable name' },
      { pattern: /data/gi, type: 'Generic variable name' }
    ];
    
    for (const { pattern, type } of namingPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 2) {
        organization.namingIssues.push({
          type,
          count: matches.length,
          recommendation: 'Use more descriptive variable names'
        });
      }
    }
    
    return organization;
  }

  analyzeMaintainability(content) {
    const maintainability = {
      codeSmells: [],
      technicalDebt: [],
      documentation: [],
      testing: []
    };
    
    // Check for code smells
    const codeSmellPatterns = [
      { pattern: /\/\*\*[\s\S]*?\*\//g, type: 'JSDoc comments' },
      { pattern: /\/\/.*TODO/gi, type: 'TODO comments' },
      { pattern: /\/\/.*FIXME/gi, type: 'FIXME comments' },
      { pattern: /\/\/.*HACK/gi, type: 'HACK comments' }
    ];
    
    for (const { pattern, type } of codeSmellPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        maintainability.codeSmells.push({
          type,
          count: matches.length,
          recommendation: this.getCodeSmellRecommendation(type)
        });
      }
    }
    
    // Check for documentation
    const hasJSDoc = content.match(/\/\*\*[\s\S]*?\*\//g);
    if (!hasJSDoc || hasJSDoc.length === 0) {
      maintainability.documentation.push({
        type: 'Missing documentation',
        severity: 'medium',
        recommendation: 'Add JSDoc comments for better maintainability'
      });
    }
    
    return maintainability;
  }

  getOptimizationRecommendation(type) {
    const recommendations = {
      'DOM queries': 'Cache DOM queries and use selectors efficiently',
      'JSON parsing': 'Cache parsed results and validate input',
      'JSON stringification': 'Cache stringified results and use efficient serialization',
      'RegExp creation': 'Cache regex patterns and use compiled expressions',
      'Date creation': 'Cache date objects and use efficient date handling',
      'Array sorting': 'Use efficient sorting algorithms and cache results'
    };
    return recommendations[type] || 'Optimize this operation';
  }

  getInefficiencyRecommendation(type) {
    const recommendations = {
      'Length in loop condition': 'Cache array length before loop',
      'Length check instead of isEmpty': 'Use isEmpty utility function',
      'Console logging in production': 'Remove or conditionally disable console logs',
      'Debugger statements': 'Remove debugger statements from production code'
    };
    return recommendations[type] || 'Optimize this pattern';
  }

  getSecuritySeverity(type) {
    const severities = {
      'eval() usage': 'critical',
      'innerHTML assignment': 'high',
      'dangerouslySetInnerHTML': 'high',
      'Function constructor': 'critical',
      'setTimeout with string': 'medium'
    };
    return severities[type] || 'medium';
  }

  getSecurityRecommendation(type) {
    const recommendations = {
      'eval() usage': 'Avoid eval() and use safer alternatives',
      'innerHTML assignment': 'Use textContent or sanitize HTML',
      'dangerouslySetInnerHTML': 'Validate and sanitize HTML content',
      'Function constructor': 'Avoid Function constructor and use safer alternatives',
      'setTimeout with string': 'Use function reference instead of string'
    };
    return recommendations[type] || 'Review security implications';
  }

  getCodeSmellRecommendation(type) {
    const recommendations = {
      'JSDoc comments': 'Good documentation practice',
      'TODO comments': 'Address TODO items promptly',
      'FIXME comments': 'Fix FIXME items urgently',
      'HACK comments': 'Replace hacks with proper solutions'
    };
    return recommendations[type] || 'Review and improve code quality';
  }

  async identifyLogicOpportunities() {
    console.log('\n🧠 Identifying Logic Improvement Opportunities...');

    const files = Array.from(this.fileAnalysis.values());
    
    for (const file of files) {
      // High complexity files
      if (file.complexity.cyclomaticComplexity > 10) {
        this.auditResults.logic.push({
          file: file.path,
          type: 'High Complexity',
          severity: 'high',
          description: `Cyclomatic complexity: ${file.complexity.cyclomaticComplexity}`,
          recommendation: 'Break down into smaller functions and reduce nesting',
          impact: 'high'
        });
      }
      
      // Deep nesting
      if (file.complexity.nestingDepth > 4) {
        this.auditResults.logic.push({
          file: file.path,
          type: 'Deep Nesting',
          severity: 'medium',
          description: `Maximum nesting depth: ${file.complexity.nestingDepth}`,
          recommendation: 'Extract nested logic into separate functions',
          impact: 'medium'
        });
      }
      
      // Large functions
      if (file.functions.length > 10) {
        this.auditResults.logic.push({
          file: file.path,
          type: 'Too Many Functions',
          severity: 'medium',
          description: `${file.functions.length} functions in one file`,
          recommendation: 'Split into multiple focused modules',
          impact: 'medium'
        });
      }
    }
    
    console.log(`✅ Found ${this.auditResults.logic.length} logic improvement opportunities`);
  }

  async identifyOrganizationOpportunities() {
    console.log('📁 Identifying Organization Improvement Opportunities...');

    const files = Array.from(this.fileAnalysis.values());
    
    // Check for organizational patterns
    const fileGroups = new Map();
    
    for (const file of files) {
      const category = this.categorizeFile(file.path);
      if (!fileGroups.has(category)) {
        fileGroups.set(category, []);
      }
      fileGroups.get(category).push(file);
    }
    
    // Identify organizational issues
    for (const [category, categoryFiles] of fileGroups) {
      if (categoryFiles.length > 10) {
        this.auditResults.organization.push({
          category,
          type: 'Too Many Files',
          severity: 'medium',
          description: `${categoryFiles.length} files in ${category}`,
          recommendation: 'Consider sub-categorization or consolidation',
          impact: 'medium'
        });
      }
      
      // Check for inconsistent naming
      const namingPatterns = categoryFiles.map(f => f.filename);
      const hasInconsistentNaming = this.checkNamingConsistency(namingPatterns);
      
      if (hasInconsistentNaming) {
        this.auditResults.organization.push({
          category,
          type: 'Inconsistent Naming',
          severity: 'low',
          description: 'Inconsistent file naming patterns detected',
          recommendation: 'Standardize naming conventions',
          impact: 'low'
        });
      }
    }
    
    console.log(`✅ Found ${this.auditResults.organization.length} organization improvement opportunities`);
  }

  categorizeFile(filePath) {
    if (filePath.includes('/components/')) return 'components';
    if (filePath.includes('/types/')) return 'types';
    if (filePath.includes('/lib/')) return 'lib';
    if (filePath.includes('/utils/')) return 'utils';
    if (filePath.includes('/pages/')) return 'pages';
    if (filePath.includes('/app/')) return 'app';
    if (filePath.includes('/ui/')) return 'ui';
    return 'other';
  }

  checkNamingConsistency(filenames) {
    // Simple check for naming consistency
    const patterns = filenames.map(name => {
      if (name.includes('-')) return 'kebab-case';
      if (name.includes('_')) return 'snake_case';
      if (name.match(/[A-Z]/)) return 'PascalCase';
      return 'unknown';
    });
    
    const uniquePatterns = [...new Set(patterns)];
    return uniquePatterns.length > 1;
  }

  async identifyPerformanceOpportunities() {
    console.log('⚡ Identifying Performance Improvement Opportunities...');

    const files = Array.from(this.fileAnalysis.values());
    
    for (const file of files) {
      // Expensive operations
      if (file.performance.expensiveOperations.length > 0) {
        for (const op of file.performance.expensiveOperations) {
          if (op.count > 3) {
            this.auditResults.performance.push({
              file: file.path,
              type: 'Frequent Expensive Operations',
              severity: 'high',
              description: `${op.type} used ${op.count} times`,
              recommendation: op.recommendation,
              impact: 'high'
            });
          }
        }
      }
      
      // Inefficient patterns
      if (file.performance.inefficientPatterns.length > 0) {
        for (const pattern of file.performance.inefficientPatterns) {
          this.auditResults.performance.push({
            file: file.path,
            type: 'Inefficient Pattern',
            severity: 'medium',
            description: `${pattern.type} used ${pattern.count} times`,
            recommendation: pattern.recommendation,
            impact: 'medium'
          });
        }
      }
      
      // Large files
      if (file.size > 10000) {
        this.auditResults.performance.push({
          file: file.path,
          type: 'Large File',
          severity: 'medium',
          description: `File size: ${(file.size / 1024).toFixed(1)}KB`,
          recommendation: 'Consider code splitting and lazy loading',
          impact: 'medium'
        });
      }
    }
    
    console.log(`✅ Found ${this.auditResults.performance.length} performance improvement opportunities`);
  }

  async identifySecurityOpportunities() {
    console.log('🔒 Identifying Security Improvement Opportunities...');

    const files = Array.from(this.fileAnalysis.values());
    
    for (const file of files) {
      // Security vulnerabilities
      if (file.security.vulnerabilities.length > 0) {
        for (const vuln of file.security.vulnerabilities) {
          this.auditResults.security.push({
            file: file.path,
            type: 'Security Vulnerability',
            severity: vuln.severity,
            description: `${vuln.type} detected ${vuln.count} times`,
            recommendation: vuln.recommendation,
            impact: vuln.severity === 'critical' ? 'critical' : 'high'
          });
        }
      }
      
      // Sensitive data exposure
      if (file.security.sensitiveData.length > 0) {
        for (const data of file.security.sensitiveData) {
          this.auditResults.security.push({
            file: file.path,
            type: 'Sensitive Data Exposure',
            severity: 'medium',
            description: `${data.type} referenced ${data.count} times`,
            recommendation: data.recommendation,
            impact: 'medium'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.auditResults.security.length} security improvement opportunities`);
  }

  async identifyMaintainabilityOpportunities() {
    console.log('🔧 Identifying Maintainability Improvement Opportunities...');

    const files = Array.from(this.fileAnalysis.values());
    
    for (const file of files) {
      // Code smells
      if (file.maintainability.codeSmells.length > 0) {
        for (const smell of file.maintainability.codeSmells) {
          if (smell.type === 'TODO comments' || smell.type === 'FIXME comments') {
            this.auditResults.maintainability.push({
              file: file.path,
              type: 'Technical Debt',
              severity: 'medium',
              description: `${smell.type}: ${smell.count} items`,
              recommendation: smell.recommendation,
              impact: 'medium'
            });
          }
        }
      }
      
      // Missing documentation
      if (file.maintainability.documentation.length > 0) {
        this.auditResults.maintainability.push({
          file: file.path,
          type: 'Missing Documentation',
          severity: 'low',
          description: 'No JSDoc comments found',
          recommendation: 'Add documentation for better maintainability',
          impact: 'low'
        });
      }
      
      // Large files
      if (file.lines > 300) {
        this.auditResults.maintainability.push({
          file: file.path,
          type: 'Large File',
          severity: 'medium',
          description: `${file.lines} lines of code`,
          recommendation: 'Break down into smaller, focused files',
          impact: 'medium'
        });
      }
    }
    
    console.log(`✅ Found ${this.auditResults.maintainability.length} maintainability improvement opportunities`);
  }

  async generateAuditReport() {
    console.log('\n📝 Generating Comprehensive Audit Report...');

    const totalOpportunities = Object.values(this.auditResults)
      .reduce((sum, arr) => sum + arr.length, 0);
    
    const report = `# Comprehensive Code Audit Report

## 📊 **Audit Summary**

**Total Files Analyzed**: ${this.fileAnalysis.size}
**Total Improvement Opportunities**: ${totalOpportunities}
- Logic Improvements: ${this.auditResults.logic.length}
- Organization Improvements: ${this.auditResults.organization.length}
- Performance Improvements: ${this.auditResults.performance.length}
- Security Improvements: ${this.auditResults.security.length}
- Maintainability Improvements: ${this.auditResults.maintainability.length}

## 🧠 **Logic Improvement Opportunities** (${this.auditResults.logic.length})

${this.auditResults.logic.length > 0 ? 
  this.auditResults.logic.slice(0, 5).map(opp => 
    `### ${opp.type} - ${opp.severity.toUpperCase()}
**File**: \`${opp.file}\`
**Description**: ${opp.description}
**Recommendation**: ${opp.recommendation}
**Impact**: ${opp.impact}`).join('\n\n') + 
  (this.auditResults.logic.length > 5 ? `\n\n... and ${this.auditResults.logic.length - 5} more logic opportunities` : '') : 
  '✅ No major logic issues found!'}

## 📁 **Organization Improvement Opportunities** (${this.auditResults.organization.length})

${this.auditResults.organization.length > 0 ? 
  this.auditResults.organization.slice(0, 3).map(opp => 
    `### ${opp.type} - ${opp.severity.toUpperCase()}
**Category**: ${opp.category}
**Description**: ${opp.description}
**Recommendation**: ${opp.recommendation}
**Impact**: ${opp.impact}`).join('\n\n') + 
  (this.auditResults.organization.length > 3 ? `\n\n... and ${this.auditResults.organization.length - 3} more organization opportunities` : '') : 
  '✅ Organization structure is well organized!'}

## ⚡ **Performance Improvement Opportunities** (${this.auditResults.performance.length})

${this.auditResults.performance.length > 0 ? 
  this.auditResults.performance.slice(0, 5).map(opp => 
    `### ${opp.type} - ${opp.severity.toUpperCase()}
**File**: \`${opp.file}\`
**Description**: ${opp.description}
**Recommendation**: ${opp.recommendation}
**Impact**: ${opp.impact}`).join('\n\n') + 
  (this.auditResults.performance.length > 5 ? `\n\n... and ${this.auditResults.performance.length - 5} more performance opportunities` : '') : 
  '✅ No major performance issues found!'}

## 🔒 **Security Improvement Opportunities** (${this.auditResults.security.length})

${this.auditResults.security.length > 0 ? 
  this.auditResults.security.slice(0, 3).map(opp => 
    `### ${opp.type} - ${opp.severity.toUpperCase()}
**File**: \`${opp.file}\`
**Description**: ${opp.description}
**Recommendation**: ${opp.recommendation}
**Impact**: ${opp.impact}`).join('\n\n') + 
  (this.auditResults.security.length > 3 ? `\n\n... and ${this.auditResults.security.length - 3} more security opportunities` : '') : 
  '✅ No major security issues found!'}

## 🔧 **Maintainability Improvement Opportunities** (${this.auditResults.maintainability.length})

${this.auditResults.maintainability.length > 0 ? 
  this.auditResults.maintainability.slice(0, 5).map(opp => 
    `### ${opp.type} - ${opp.severity.toUpperCase()}
**File**: \`${opp.file}\`
**Description**: ${opp.description}
**Recommendation**: ${opp.recommendation}
**Impact**: ${opp.impact}`).join('\n\n') + 
  (this.auditResults.maintainability.length > 5 ? `\n\n... and ${this.auditResults.maintainability.length - 5} more maintainability opportunities` : '') : 
  '✅ Code maintainability is good!'}

## 🎯 **Priority Recommendations**

### **High Priority (Critical Impact)**
${this.getHighPriorityRecommendations()}

### **Medium Priority (Significant Impact)**
${this.getMediumPriorityRecommendations()}

### **Low Priority (Incremental Improvement)**
${this.getLowPriorityRecommendations()}

## 📋 **Implementation Plan**

### **Phase 1: Critical Fixes** (1-2 weeks)
1. Address security vulnerabilities
2. Fix high-impact performance issues
3. Resolve critical logic complexity

### **Phase 2: Structural Improvements** (2-3 weeks)
1. Reorganize file structure
2. Optimize performance bottlenecks
3. Improve code organization

### **Phase 3: Quality Enhancement** (1-2 weeks)
1. Add documentation
2. Refactor complex functions
3. Standardize naming conventions

## 🚀 **Expected Benefits**

- **Performance**: Faster load times and better responsiveness
- **Security**: Reduced vulnerability surface
- **Maintainability**: Easier to modify and extend
- **Organization**: Better developer experience
- **Quality**: More reliable and robust code

---

**Status**: ✅ **AUDIT COMPLETE** - ${totalOpportunities} improvement opportunities identified
**Next Step**: Review recommendations and create implementation timeline
`;

    fs.writeFileSync('./COMPREHENSIVE_AUDIT_REPORT.md', report, 'utf8');
    console.log('✅ Comprehensive audit report created: COMPREHENSIVE_AUDIT_REPORT.md');
    
    // Show summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE AUDIT SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Files analyzed: ${this.fileAnalysis.size}`);
    console.log(`🎯 Total opportunities: ${totalOpportunities}`);
    console.log(`🧠 Logic: ${this.auditResults.logic.length}`);
    console.log(`📁 Organization: ${this.auditResults.organization.length}`);
    console.log(`⚡ Performance: ${this.auditResults.performance.length}`);
    console.log(`🔒 Security: ${this.auditResults.security.length}`);
    console.log(`🔧 Maintainability: ${this.auditResults.maintainability.length}`);
    
    console.log('\n🎯 Priority Breakdown:');
    const critical = this.auditResults.logic.filter(opp => opp.severity === 'high').length +
                    this.auditResults.security.filter(opp => opp.severity === 'critical').length +
                    this.auditResults.performance.filter(opp => opp.severity === 'high').length;
    const medium = this.auditResults.logic.filter(opp => opp.severity === 'medium').length +
                   this.auditResults.organization.filter(opp => opp.severity === 'medium').length +
                   this.auditResults.performance.filter(opp => opp.severity === 'medium').length;
    const low = this.auditResults.maintainability.filter(opp => opp.severity === 'low').length +
                this.auditResults.organization.filter(opp => opp.severity === 'low').length;
    
    console.log(`🚨 Critical: ${critical}`);
    console.log(`⚠️  Medium: ${medium}`);
    console.log(`💡 Low: ${low}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. 📖 Review COMPREHENSIVE_AUDIT_REPORT.md');
    console.log('2. 🎯 Prioritize critical issues');
    console.log('3. 📅 Create implementation timeline');
    console.log('4. 🚀 Start with high-impact improvements');
  }

  getHighPriorityRecommendations() {
    const critical = this.auditResults.logic.filter(opp => opp.severity === 'high').slice(0, 2);
    const security = this.auditResults.security.filter(opp => opp.severity === 'critical').slice(0, 2);
    const performance = this.auditResults.performance.filter(opp => opp.severity === 'high').slice(0, 2);
    
    return [...critical, ...security, ...performance].map(opp => 
      `- **${opp.type}**: ${opp.recommendation} (\`${opp.file.split('/').pop()}\`)`
    ).join('\n');
  }

  getMediumPriorityRecommendations() {
    const medium = this.auditResults.logic.filter(opp => opp.severity === 'medium').slice(0, 2);
    const organization = this.auditResults.organization.filter(opp => opp.severity === 'medium').slice(0, 2);
    const performance = this.auditResults.performance.filter(opp => opp.severity === 'medium').slice(0, 2);
    
    return [...medium, ...organization, ...performance].map(opp => 
      `- **${opp.type}**: ${opp.recommendation} (\`${opp.file?.split('/').pop() || opp.category}\`)`
    ).join('\n');
  }

  getLowPriorityRecommendations() {
    const low = this.auditResults.maintainability.filter(opp => opp.severity === 'low').slice(0, 2);
    const organization = this.auditResults.organization.filter(opp => opp.severity === 'low').slice(0, 2);
    
    return [...low, ...organization].map(opp => 
      `- **${opp.type}**: ${opp.recommendation} (\`${opp.file?.split('/').pop() || opp.category}\`)`
    ).join('\n');
  }
}

// Run the comprehensive audit
if (require.main === module) {
  new ComprehensiveAuditor().run();
}

module.exports = ComprehensiveAuditor;
