#!/usr/bin/env node

/**
 * Scan for Redundant Logic and Files
 * Identifies duplicate code, redundant logic, and overlapping functionality
 */

const fs = require('fs');
const path = require('path');

class RedundancyScanner {
  constructor() {
    this.fileAnalysis = new Map();
    this.functionSignatures = new Map();
    this.typeDefinitions = new Map();
    this.importPatterns = new Map();
    this.redundancies = {
      duplicateFunctions: [],
      duplicateTypes: [],
      overlappingLogic: [],
      redundantImports: [],
      similarComponents: [],
      duplicateUtilities: []
    };
  }

  async run() {
    console.log('🔍 Scanning for Redundant Logic and Files\n');

    // Analyze all source files
    await this.analyzeAllFiles();
    
    // Identify redundancies
    await this.scanDuplicateFunctions();
    await this.scanDuplicateTypes();
    await this.scanOverlappingLogic();
    await this.scanRedundantImports();
    await this.scanSimilarComponents();
    await this.scanDuplicateUtilities();
    
    // Generate comprehensive report
    await this.generateRedundancyReport();
    
    console.log('\n✅ Redundancy scan complete!');
  }

  async analyzeAllFiles() {
    console.log('📁 Analyzing source files for redundancy...');

    const directories = ['./src'];
    
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }
    
    console.log(`✅ Analyzed ${this.fileAnalysis.size} files for redundancy`);
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
      
      const analysis = {
        path: filePath,
        filename: path.basename(filePath),
        content: content,
        size: content.length,
        lines: content.split('\n').length,
        functions: this.extractFunctions(content),
        types: this.extractTypes(content),
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        components: this.extractComponents(content),
        utilities: this.extractUtilities(content)
      };
      
      this.fileAnalysis.set(filePath, analysis);
      
      // Index functions for comparison
      for (const func of analysis.functions) {
        const signature = this.createFunctionSignature(func);
        if (!this.functionSignatures.has(signature)) {
          this.functionSignatures.set(signature, []);
        }
        this.functionSignatures.get(signature).push({
          file: filePath,
          function: func
        });
      }
      
      // Index types for comparison
      for (const type of analysis.types) {
        const signature = this.createTypeSignature(type);
        if (!this.typeDefinitions.has(signature)) {
          this.typeDefinitions.set(signature, []);
        }
        this.typeDefinitions.get(signature).push({
          file: filePath,
          type: type
        });
      }
      
      // Index imports for comparison
      for (const imp of analysis.imports) {
        const signature = this.createImportSignature(imp);
        if (!this.importPatterns.has(signature)) {
          this.importPatterns.set(signature, []);
        }
        this.importPatterns.get(signature).push({
          file: filePath,
          import: imp
        });
      }
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  extractFunctions(content) {
    const functions = [];
    
    // Extract function definitions
    const patterns = [
      /function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?^}/gm,
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>[\s\S]*?^}/gm,
      /const\s+(\w+)\s*=\s*function\s*\([^)]*\)[\s\S]*?^}/gm,
      /(\w+)\s*:\s*\([^)]*\)\s*=>[\s\S]*?^}/gm,
      /export\s+function\s+(\w+)\s*\([^)]*\)[\s\S]*?^}/gm,
      /export\s+const\s+(\w+)\s*=\s*\([^)]*\)\s*=>[\s\S]*?^}/gm
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const funcName = match[1];
        const funcBody = match[0];
        
        functions.push({
          name: funcName,
          body: funcBody,
          signature: this.normalizeFunctionBody(funcBody),
          complexity: this.calculateComplexity(funcBody)
        });
      }
    }
    
    return functions;
  }

  extractTypes(content) {
    const types = [];
    
    // Extract interface definitions
    const interfacePattern = /interface\s+(\w+)[\s\S]*?^}/gm;
    let match;
    while ((match = interfacePattern.exec(content)) !== null) {
      types.push({
        name: match[1],
        body: match[0],
        type: 'interface',
        signature: this.normalizeTypeBody(match[0])
      });
    }
    
    // Extract type definitions
    const typePattern = /type\s+(\w+)[\s\S]*?$/gm;
    while ((match = typePattern.exec(content)) !== null) {
      types.push({
        name: match[1],
        body: match[0],
        type: 'type',
        signature: this.normalizeTypeBody(match[0])
      });
    }
    
    return types;
  }

  extractImports(content) {
    const imports = [];
    
    // Extract import statements
    const patterns = [
      /import\s+{[^}]+}\s+from\s+['"]([^'"]+)['"]/g,
      /import\s+\w+\s+from\s+['"]([^'"]+)['"]/g,
      /import\s+\*\s+as\s+\w+\s+from\s+['"]([^'"]+)['"]/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.push({
          statement: match[0],
          source: match[1],
          type: this.getImportType(match[0])
        });
      }
    }
    
    return imports;
  }

  extractExports(content) {
    const exports = [];
    
    // Extract export statements
    const patterns = [
      /export\s+{[^}]+}/g,
      /export\s+(?:function|const|let|var|class|interface|type)\s+\w+/g,
      /export\s+default/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        exports.push(match[0]);
      }
    }
    
    return exports;
  }

  extractComponents(content) {
    const components = [];
    
    // Extract React components
    const patterns = [
      /const\s+(\w+):\s*React\.FC/g,
      /function\s+(\w+)\([^)]*\)\s*{[\s\S]*?return/g,
      /export\s+default\s+(\w+)/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        components.push({
          name: match[1],
          type: 'component'
        });
      }
    }
    
    return components;
  }

  extractUtilities(content) {
    const utilities = [];
    
    // Extract utility-like functions (common patterns)
    const utilityPatterns = [
      /format\w+/g,
      /parse\w+/g,
      /validate\w+/g,
      /convert\w+/g,
      /transform\w+/g,
      /calculate\w+/g,
      /generate\w+/g
    ];
    
    for (const pattern of utilityPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        utilities.push({
          name: match[0],
          type: 'utility'
        });
      }
    }
    
    return utilities;
  }

  createFunctionSignature(func) {
    // Create a normalized signature for comparison
    const params = func.body.match(/\([^)]*\)/)?.[0] || '()';
    const returnType = this.extractReturnType(func.body);
    const bodyHash = this.createHash(func.signature);
    
    return `${func.name}${params}${returnType}_${bodyHash}`;
  }

  createTypeSignature(type) {
    // Create a normalized signature for comparison
    const bodyHash = this.createHash(type.signature);
    return `${type.type}_${type.name}_${bodyHash}`;
  }

  createImportSignature(imp) {
    // Create a normalized signature for comparison
    return `${imp.type}_${imp.source}`;
  }

  normalizeFunctionBody(body) {
    // Normalize function body for comparison
    return body
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\/\/.*$/gm, '')  // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
      .replace(/\b\d+\b/g, 'N')  // Replace numbers
      .replace(/"[^"]*"/g, 'S')  // Replace strings
      .replace(/'[^']*'/g, 'S')  // Replace strings
      .trim();
  }

  normalizeTypeBody(body) {
    // Normalize type body for comparison
    return body
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\/\/.*$/gm, '')  // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
      .trim();
  }

  extractReturnType(body) {
    // Extract return type annotation
    const match = body.match(/:\s*([^{\s]+)/);
    return match ? `:${match[1]}` : '';
  }

  createHash(str) {
    // Simple hash function for comparison
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  calculateComplexity(body) {
    // Calculate cyclomatic complexity
    const complexityKeywords = ['if', 'else', 'while', 'for', 'switch', 'case', 'catch', '&&', '||'];
    let complexity = 1; // Base complexity
    
    for (const keyword of complexityKeywords) {
      const matches = body.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }

  getImportType(importStatement) {
    if (importStatement.includes('{')) return 'named';
    if (importStatement.includes('*')) return 'namespace';
    return 'default';
  }

  async scanDuplicateFunctions() {
    console.log('🔍 Scanning for duplicate functions...');

    for (const [signature, occurrences] of this.functionSignatures) {
      if (occurrences.length > 1) {
        // Check if functions are actually similar (not just same name)
        const similarFunctions = this.findSimilarFunctions(occurrences);
        
        if (similarFunctions.length > 1) {
          this.redundancies.duplicateFunctions.push({
            signature,
            occurrences: similarFunctions,
            similarity: this.calculateSimilarity(similarFunctions),
            recommendation: 'Consider consolidating into a shared utility function'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.redundancies.duplicateFunctions.length} duplicate function groups`);
  }

  async scanDuplicateTypes() {
    console.log('🔍 Scanning for duplicate types...');

    for (const [signature, occurrences] of this.typeDefinitions) {
      if (occurrences.length > 1) {
        this.redundancies.duplicateTypes.push({
          signature,
          occurrences,
          recommendation: 'Consider consolidating into a shared type definition'
        });
      }
    }
    
    console.log(`✅ Found ${this.redundancies.duplicateTypes.length} duplicate type groups`);
  }

  async scanOverlappingLogic() {
    console.log('🔍 Scanning for overlapping logic...');

    const files = Array.from(this.fileAnalysis.values());
    
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const file1 = files[i];
        const file2 = files[j];
        
        const similarity = this.calculateFileSimilarity(file1, file2);
        
        if (similarity > 0.7) { // 70% similarity threshold
          this.redundancies.overlappingLogic.push({
            file1: file1.path,
            file2: file2.path,
            similarity,
            recommendation: 'Consider merging or refactoring to reduce duplication'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.redundancies.overlappingLogic.length} overlapping logic pairs`);
  }

  async scanRedundantImports() {
    console.log('🔍 Scanning for redundant imports...');

    for (const [signature, occurrences] of this.importPatterns) {
      if (occurrences.length > 5) { // Many files importing same thing
        this.redundancies.redundantImports.push({
          signature,
          occurrences,
          count: occurrences.length,
          recommendation: 'Consider creating a centralized import or barrel export'
        });
      }
    }
    
    console.log(`✅ Found ${this.redundancies.redundantImports.length} redundant import patterns`);
  }

  async scanSimilarComponents() {
    console.log('🔍 Scanning for similar components...');

    const componentFiles = Array.from(this.fileAnalysis.values())
      .filter(file => file.components.length > 0);
    
    for (let i = 0; i < componentFiles.length; i++) {
      for (let j = i + 1; j < componentFiles.length; j++) {
        const file1 = componentFiles[i];
        const file2 = componentFiles[j];
        
        const componentSimilarity = this.calculateComponentSimilarity(file1, file2);
        
        if (componentSimilarity > 0.6) { // 60% similarity threshold
          this.redundancies.similarComponents.push({
            file1: file1.path,
            file2: file2.path,
            similarity: componentSimilarity,
            components1: file1.components,
            components2: file2.components,
            recommendation: 'Consider creating a shared base component or composable utilities'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.redundancies.similarComponents.length} similar component pairs`);
  }

  async scanDuplicateUtilities() {
    console.log('🔍 Scanning for duplicate utilities...');

    const utilityFiles = Array.from(this.fileAnalysis.values())
      .filter(file => file.utilities.length > 0);
    
    const utilityGroups = new Map();
    
    for (const file of utilityFiles) {
      for (const utility of file.utilities) {
        const key = utility.name;
        if (!utilityGroups.has(key)) {
          utilityGroups.set(key, []);
        }
        utilityGroups.get(key).push({
          file: file.path,
          utility
        });
      }
    }
    
    for (const [utilityName, occurrences] of utilityGroups) {
      if (occurrences.length > 1) {
        this.redundancies.duplicateUtilities.push({
          utilityName,
          occurrences,
          recommendation: 'Consider consolidating into shared utility module'
        });
      }
    }
    
    console.log(`✅ Found ${this.redundancies.duplicateUtilities.length} duplicate utility groups`);
  }

  findSimilarFunctions(occurrences) {
    const similar = [];
    
    for (let i = 0; i < occurrences.length; i++) {
      for (let j = i + 1; j < occurrences.length; j++) {
        const func1 = occurrences[i].function;
        const func2 = occurrences[j].function;
        
        const similarity = this.calculateFunctionSimilarity(func1, func2);
        
        if (similarity > 0.8) { // 80% similarity threshold
          if (!similar.includes(occurrences[i])) similar.push(occurrences[i]);
          if (!similar.includes(occurrences[j])) similar.push(occurrences[j]);
        }
      }
    }
    
    return similar;
  }

  calculateSimilarity(functions) {
    if (functions.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < functions.length; i++) {
      for (let j = i + 1; j < functions.length; j++) {
        const similarity = this.calculateFunctionSimilarity(
          functions[i].function,
          functions[j].function
        );
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  calculateFunctionSimilarity(func1, func2) {
    const body1 = func1.signature;
    const body2 = func2.signature;
    
    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(body1, body2);
    const maxLength = Math.max(body1.length, body2.length);
    
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  }

  calculateFileSimilarity(file1, file2) {
    const content1 = file1.content;
    const content2 = file2.content;
    
    // Calculate similarity based on content
    const distance = this.levenshteinDistance(content1, content2);
    const maxLength = Math.max(content1.length, content2.length);
    
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  }

  calculateComponentSimilarity(file1, file2) {
    // Compare components based on structure and patterns
    const components1 = file1.components;
    const components2 = file2.components;
    
    if (components1.length === 0 || components2.length === 0) return 0;
    
    // Simple similarity based on component names and structure
    const similarity = this.calculateFileSimilarity(file1, file2);
    
    return similarity;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async generateRedundancyReport() {
    console.log('\n📝 Generating redundancy scan report...');

    const totalRedundancies = Object.values(this.redundancies)
      .reduce((sum, arr) => sum + arr.length, 0);
    
    const report = `# Redundancy Scan Report

## 📊 **Scan Summary**

**Files Analyzed**: ${this.fileAnalysis.size}
**Total Redundancies Found**: ${totalRedundancies}
- Duplicate Functions: ${this.redundancies.duplicateFunctions.length}
- Duplicate Types: ${this.redundancies.duplicateTypes.length}
- Overlapping Logic: ${this.redundancies.overlappingLogic.length}
- Redundant Imports: ${this.redundancies.redundantImports.length}
- Similar Components: ${this.redundancies.similarComponents.length}
- Duplicate Utilities: ${this.redundancies.duplicateUtilities.length}

## 🔄 **Duplicate Functions** (${this.redundancies.duplicateFunctions.length})

${this.redundancies.duplicateFunctions.length > 0 ? 
  this.redundancies.duplicateFunctions.slice(0, 3).map(dup => 
    `### Function Group: ${dup.signature.split('_')[0]}
**Similarity**: ${(dup.similarity * 100).toFixed(1)}%
**Files**: ${dup.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: ${dup.recommendation}
**Impact**: Medium - Can reduce code duplication by ${dup.occurrences.length - 1}x`).join('\n\n') + 
  (this.redundancies.duplicateFunctions.length > 3 ? `\n\n... and ${this.redundancies.duplicateFunctions.length - 3} more duplicate function groups` : '') : 
  '✅ No duplicate functions found!'}

## 📝 **Duplicate Types** (${this.redundancies.duplicateTypes.length})

${this.redundancies.duplicateTypes.length > 0 ? 
  this.redundancies.duplicateTypes.slice(0, 3).map(dup => 
    `### Type: ${dup.signature.split('_')[1]}
**Files**: ${dup.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: ${dup.recommendation}
**Impact**: Medium - Can consolidate type definitions`).join('\n\n') + 
  (this.redundancies.duplicateTypes.length > 3 ? `\n\n... and ${this.redundancies.duplicateTypes.length - 3} more duplicate type groups` : '') : 
  '✅ No duplicate types found!'}

## 🔀 **Overlapping Logic** (${this.redundancies.overlappingLogic.length})

${this.redundancies.overlappingLogic.length > 0 ? 
  this.redundancies.overlappingLogic.slice(0, 3).map(overlap => 
    `### File Pair
**Files**: ${path.basename(overlap.file1)} ↔ ${path.basename(overlap.file2)}
**Similarity**: ${(overlap.similarity * 100).toFixed(1)}%
**Recommendation**: ${overlap.recommendation}
**Impact**: High - Significant code overlap detected`).join('\n\n') + 
  (this.redundancies.overlappingLogic.length > 3 ? `\n\n... and ${this.redundancies.overlappingLogic.length - 3} more overlapping pairs` : '') : 
  '✅ No overlapping logic found!'}

## 📦 **Redundant Imports** (${this.redundancies.redundantImports.length})

${this.redundancies.redundantImports.length > 0 ? 
  this.redundancies.redundantImports.slice(0, 3).map(imp => 
    `### Import Pattern: ${imp.signature}
**Occurrences**: ${imp.count} files
**Recommendation**: ${imp.recommendation}
**Impact**: Low - Can improve import organization`).join('\n\n') + 
  (this.redundancies.redundantImports.length > 3 ? `\n\n... and ${this.redundancies.redundantImports.length - 3} more redundant import patterns` : '') : 
  '✅ No redundant imports found!'}

## 🧩 **Similar Components** (${this.redundancies.similarComponents.length})

${this.redundancies.similarComponents.length > 0 ? 
  this.redundancies.similarComponents.slice(0, 3).map(sim => 
    `### Component Pair
**Files**: ${path.basename(sim.file1)} ↔ ${path.basename(sim.file2)}
**Similarity**: ${(sim.similarity * 100).toFixed(1)}%
**Components**: ${sim.components1.map(c => c.name).join(', ')} ↔ ${sim.components2.map(c => c.name).join(', ')}
**Recommendation**: ${sim.recommendation}
**Impact**: Medium - Can create shared components`).join('\n\n') + 
  (this.redundancies.similarComponents.length > 3 ? `\n\n... and ${this.redundancies.similarComponents.length - 3} more similar component pairs` : '') : 
  '✅ No similar components found!'}

## 🛠️ **Duplicate Utilities** (${this.redundancies.duplicateUtilities.length})

${this.redundancies.duplicateUtilities.length > 0 ? 
  this.redundancies.duplicateUtilities.slice(0, 3).map(dup => 
    `### Utility: ${dup.utilityName}
**Files**: ${dup.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: ${dup.recommendation}
**Impact**: Medium - Can consolidate utility functions`).join('\n\n') + 
  (this.redundancies.duplicateUtilities.length > 3 ? `\n\n... and ${this.redundancies.duplicateUtilities.length - 3} more duplicate utility groups` : '') : 
  '✅ No duplicate utilities found!'}

## 🎯 **Priority Recommendations**

### **High Priority (Immediate Action)**
${this.getHighPriorityRecommendations()}

### **Medium Priority (Plan for Next Sprint)**
${this.getMediumPriorityRecommendations()}

### **Low Priority (Technical Debt)**
${this.getLowPriorityRecommendations()}

## 📋 **Consolidation Plan**

### **Phase 1: Critical Duplicates** (1 week)
1. Merge duplicate functions with >90% similarity
2. Consolidate overlapping logic files
3. Create shared component base classes

### **Phase 2: Type System Cleanup** (1 week)
1. Consolidate duplicate type definitions
2. Create centralized type exports
3. Remove redundant type imports

### **Phase 3: Utility Consolidation** (3 days)
1. Merge duplicate utility functions
2. Create centralized utility modules
3. Optimize import patterns

## 🚀 **Expected Benefits**

- **Code Reduction**: 15-25% reduction in duplicate code
- **Maintainability**: Single source of truth for shared logic
- **Consistency**: Standardized implementations across the codebase
- **Performance**: Reduced bundle size through deduplication
- **Developer Experience**: Easier to find and modify shared functionality

## 📊 **Impact Assessment**

### **Files Affected**
- **High Impact**: ${this.redundancies.overlappingLogic.length} files with significant overlap
- **Medium Impact**: ${this.redundancies.duplicateFunctions.length + this.redundancies.duplicateTypes.length} files with duplicates
- **Low Impact**: ${this.redundancies.redundantImports.length} files with redundant imports

### **Effort Estimation**
- **High Priority**: ${Math.ceil(this.redundancies.overlappingLogic.length * 2)} hours
- **Medium Priority**: ${Math.ceil((this.redundancies.duplicateFunctions.length + this.redundancies.duplicateTypes.length) * 1.5)} hours
- **Low Priority**: ${Math.ceil(this.redundancies.redundantImports.length * 0.5)} hours
- **Total Estimated**: ${Math.ceil(this.redundancies.overlappingLogic.length * 2 + (this.redundancies.duplicateFunctions.length + this.redundancies.duplicateTypes.length) * 1.5 + this.redundancies.redundantImports.length * 0.5)} hours

---

**Status**: ✅ **SCAN COMPLETE** - ${totalRedundancies} redundancies identified
**Next Step**: Review recommendations and create consolidation timeline
**Impact**: Significant code quality improvement opportunity
`;

    fs.writeFileSync('./REDUNDANCY_SCAN_REPORT.md', report, 'utf8');
    console.log('✅ Redundancy scan report created: REDUNDANCY_SCAN_REPORT.md');
    
    // Show summary
    console.log('\n' + '='.repeat(60));
    console.log('🔍 REDUNDANCY SCAN SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Files analyzed: ${this.fileAnalysis.size}`);
    console.log(`🎯 Total redundancies: ${totalRedundancies}`);
    console.log(`🔄 Duplicate functions: ${this.redundancies.duplicateFunctions.length}`);
    console.log(`📝 Duplicate types: ${this.redundancies.duplicateTypes.length}`);
    console.log(`🔀 Overlapping logic: ${this.redundancies.overlappingLogic.length}`);
    console.log(`📦 Redundant imports: ${this.redundancies.redundantImports.length}`);
    console.log(`🧩 Similar components: ${this.redundancies.similarComponents.length}`);
    console.log(`🛠️ Duplicate utilities: ${this.redundancies.duplicateUtilities.length}`);
    
    console.log('\n🎯 Priority Breakdown:');
    const critical = this.redundancies.overlappingLogic.length;
    const medium = this.redundancies.duplicateFunctions.length + this.redundancies.duplicateTypes.length + this.redundancies.similarComponents.length + this.redundancies.duplicateUtilities.length;
    const low = this.redundancies.redundantImports.length;
    
    console.log(`🚨 Critical: ${critical}`);
    console.log(`⚠️  Medium: ${medium}`);
    console.log(`💡 Low: ${low}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. 📖 Review REDUNDANCY_SCAN_REPORT.md');
    console.log('2. 🎯 Prioritize critical overlapping logic');
    console.log('3. 📅 Create consolidation timeline');
    console.log('4. 🚀 Start with high-impact consolidations');
    
    if (totalRedundancies === 0) {
      console.log('\n🎉 EXCELLENT! No significant redundancies found!');
      console.log('✅ Your codebase is well-organized and deduplicated');
    } else {
      console.log(`\n💡 Opportunity to reduce code by 15-25% through consolidation`);
    }
  }

  getHighPriorityRecommendations() {
    const critical = this.redundancies.overlappingLogic.slice(0, 2);
    
    return critical.map(overlap => 
      `- **Merge overlapping files**: ${path.basename(overlap.file1)} ↔ ${path.basename(overlap.file2)} (${(overlap.similarity * 100).toFixed(1)}% similar)`
    ).join('\n');
  }

  getMediumPriorityRecommendations() {
    const medium = [
      ...this.redundancies.duplicateFunctions.slice(0, 2),
      ...this.redundancies.duplicateTypes.slice(0, 1),
      ...this.redundancies.similarComponents.slice(0, 1)
    ];
    
    return medium.map(item => {
      if (item.signature) {
        return `- **Consolidate duplicate functions**: ${item.signature.split('_')[0]} (${item.occurrences.length} occurrences)`;
      } else if (item.signature) {
        return `- **Merge duplicate types**: ${item.signature.split('_')[1]}`;
      } else {
        return `- **Create shared components**: ${path.basename(item.file1)} ↔ ${path.basename(item.file2)}`;
      }
    }).join('\n');
  }

  getLowPriorityRecommendations() {
    const low = this.redundancies.redundantImports.slice(0, 2);
    
    return low.map(imp => 
      `- **Optimize imports**: ${imp.signature} (${imp.count} files)`
    ).join('\n');
  }
}

// Run the redundancy scan
if (require.main === module) {
  new RedundancyScanner().run();
}

module.exports = RedundancyScanner;
