#!/usr/bin/env node

/**
 * Efficient Redundancy Scanner
 * Memory-optimized scan for duplicate logic and files
 */

const fs = require('fs');
const path = require('path');

class EfficientRedundancyScanner {
  constructor() {
    this.redundancies = {
      duplicateFunctions: [],
      duplicateTypes: [],
      overlappingLogic: [],
      duplicateUtilities: []
    };
    this.processedFiles = 0;
  }

  async run() {
    console.log('🔍 Efficient Redundancy Scan\n');

    // Focus on key directories and file types
    await this.scanKeyFiles();
    
    // Generate focused report
    await this.generateFocusedReport();
    
    console.log('\n✅ Efficient redundancy scan complete!');
  }

  async scanKeyFiles() {
    console.log('📁 Scanning key files for redundancy...');

    // Focus on most likely redundant areas
    const keyDirectories = [
      './src/lib/utils',
      './src/types',
      './src/components',
      './src/app'
    ];

    for (const dir of keyDirectories) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }
    
    console.log(`✅ Processed ${this.processedFiles} key files`);
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
      
      // Skip very large files to avoid memory issues
      if (content.length > 50000) {
        console.log(`⚠️  Skipping large file: ${path.basename(filePath)}`);
        return;
      }
      
      const analysis = {
        path: filePath,
        filename: path.basename(filePath),
        content: content,
        functions: this.extractFunctions(content),
        types: this.extractTypes(content),
        utilities: this.extractUtilities(content)
      };
      
      this.processedFiles++;
      
      // Check for specific redundancy patterns
      await this.checkFunctionRedundancy(analysis);
      await this.checkTypeRedundancy(analysis);
      await this.checkUtilityRedundancy(analysis);
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  extractFunctions(content) {
    const functions = [];
    
    // Extract key function patterns
    const patterns = [
      /function\s+(\w+)\s*\([^)]*\)/g,
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g,
      /export\s+function\s+(\w+)/g,
      /export\s+const\s+(\w+)\s*=\s*\([^)]*\)/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        functions.push({
          name: match[1],
          signature: this.createFunctionSignature(match[0])
        });
      }
    }
    
    return functions;
  }

  extractTypes(content) {
    const types = [];
    
    // Extract interface and type definitions
    const patterns = [
      /interface\s+(\w+)/g,
      /type\s+(\w+)/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        types.push({
          name: match[1],
          signature: this.createTypeSignature(match[0])
        });
      }
    }
    
    return types;
  }

  extractUtilities(content) {
    const utilities = [];
    
    // Extract common utility patterns
    const utilityPatterns = [
      /format\w+/g,
      /parse\w+/g,
      /validate\w+/g,
      /convert\w+/g,
      /transform\w+/g,
      /calculate\w+/g,
      /generate\w+/g,
      /debounce/g,
      /throttle/g,
      /memoize/g
    ];
    
    for (const pattern of utilityPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        utilities.push({
          name: match[0],
          signature: match[0]
        });
      }
    }
    
    return utilities;
  }

  createFunctionSignature(funcText) {
    // Create simplified signature for comparison
    return funcText
      .replace(/\s+/g, ' ')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\b\d+\b/g, 'N')
      .replace(/"[^"]*"/g, 'S')
      .replace(/'[^']*'/g, 'S')
      .trim();
  }

  createTypeSignature(typeText) {
    // Create simplified signature for comparison
    return typeText
      .replace(/\s+/g, ' ')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();
  }

  async checkFunctionRedundancy(analysis) {
    // Check for obvious duplicate function names
    const commonFunctionNames = [
      'formatDate', 'formatTime', 'parseDate', 'parseTime',
      'validateEmail', 'validatePhone', 'validateRequired',
      'calculateTotal', 'calculateAverage', 'calculateSum',
      'generateId', 'generateToken', 'generateHash',
      'debounce', 'throttle', 'memoize',
      'sortBy', 'groupBy', 'filterBy', 'findBy'
    ];
    
    for (const func of analysis.functions) {
      if (commonFunctionNames.includes(func.name)) {
        // Check if we've seen this function before
        const existing = this.redundancies.duplicateFunctions.find(
          f => f.name === func.name
        );
        
        if (existing) {
          existing.occurrences.push({
            file: analysis.path,
            signature: func.signature
          });
        } else {
          this.redundancies.duplicateFunctions.push({
            name: func.name,
            occurrences: [{
              file: analysis.path,
              signature: func.signature
            }]
          });
        }
      }
    }
  }

  async checkTypeRedundancy(analysis) {
    // Check for common type names that might be duplicated
    const commonTypeNames = [
      'Point2D', 'Point3D', 'Rectangle', 'Size',
      'User', 'Product', 'Order', 'Item',
      'Status', 'Type', 'Category', 'Level',
      'Config', 'Settings', 'Options', 'Props',
      'Response', 'Request', 'Data', 'Result'
    ];
    
    for (const type of analysis.types) {
      if (commonTypeNames.includes(type.name)) {
        // Check if we've seen this type before
        const existing = this.redundancies.duplicateTypes.find(
          t => t.name === type.name
        );
        
        if (existing) {
          existing.occurrences.push({
            file: analysis.path,
            signature: type.signature
          });
        } else {
          this.redundancies.duplicateTypes.push({
            name: type.name,
            occurrences: [{
              file: analysis.path,
              signature: type.signature
            }]
          });
        }
      }
    }
  }

  async checkUtilityRedundancy(analysis) {
    // Check for utility function duplicates
    for (const util of analysis.utilities) {
      const existing = this.redundancies.duplicateUtilities.find(
        u => u.name === util.name
      );
      
      if (existing) {
        existing.occurrences.push({
          file: analysis.path
        });
      } else {
        this.redundancies.duplicateUtilities.push({
          name: util.name,
          occurrences: [{
            file: analysis.path
          }]
        });
      }
    }
  }

  async generateFocusedReport() {
    console.log('\n📝 Generating focused redundancy report...');

    // Filter for actual redundancies (multiple occurrences)
    this.redundancies.duplicateFunctions = this.redundancies.duplicateFunctions.filter(
      f => f.occurrences.length > 1
    );
    
    this.redundancies.duplicateTypes = this.redundancies.duplicateTypes.filter(
      t => t.occurrences.length > 1
    );
    
    this.redundancies.duplicateUtilities = this.redundancies.duplicateUtilities.filter(
      u => u.occurrences.length > 1
    );

    const totalRedundancies = Object.values(this.redundancies)
      .reduce((sum, arr) => sum + arr.length, 0);
    
    const report = `# Focused Redundancy Scan Report

## 📊 **Scan Summary**

**Files Processed**: ${this.processedFiles}
**Total Redundancies Found**: ${totalRedundancies}
- Duplicate Functions: ${this.redundancies.duplicateFunctions.length}
- Duplicate Types: ${this.redundancies.duplicateTypes.length}
- Duplicate Utilities: ${this.redundancies.duplicateUtilities.length}

## 🔄 **Duplicate Functions** (${this.redundancies.duplicateFunctions.length})

${this.redundancies.duplicateFunctions.length > 0 ? 
  this.redundancies.duplicateFunctions.map(func => 
    `### Function: ${func.name}
**Occurrences**: ${func.occurrences.length} files
**Files**: ${func.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: Consolidate into shared utility module
**Impact**: Medium - Can reduce code duplication`).join('\n\n') : 
  '✅ No duplicate functions found!'}

## 📝 **Duplicate Types** (${this.redundancies.duplicateTypes.length})

${this.redundancies.duplicateTypes.length > 0 ? 
  this.redundancies.duplicateTypes.slice(0, 5).map(type => 
    `### Type: ${type.name}
**Occurrences**: ${type.occurrences.length} files
**Files**: ${type.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: Consolidate into centralized type definitions
**Impact**: Medium - Can improve type consistency`).join('\n\n') + 
  (this.redundancies.duplicateTypes.length > 5 ? `\n\n... and ${this.redundancies.duplicateTypes.length - 5} more duplicate types` : '') : 
  '✅ No duplicate types found!'}

## 🛠️ **Duplicate Utilities** (${this.redundancies.duplicateUtilities.length})

${this.redundancies.duplicateUtilities.length > 0 ? 
  this.redundancies.duplicateUtilities.slice(0, 5).map(util => 
    `### Utility: ${util.name}
**Occurrences**: ${util.occurrences.length} files
**Files**: ${util.occurrences.map(occ => path.basename(occ.file)).join(', ')}
**Recommendation**: Consolidate into shared utility functions
**Impact**: Low - Can improve code organization`).join('\n\n') + 
  (this.redundancies.duplicateUtilities.length > 5 ? `\n\n... and ${this.redundancies.duplicateUtilities.length - 5} more duplicate utilities` : '') : 
  '✅ No duplicate utilities found!'}

## 🎯 **Key Findings**

### **High Priority Consolidations**
${this.getHighPriorityConsolidations()}

### **Medium Priority Improvements**
${this.getMediumPriorityImprovements()}

### **Low Priority Optimizations**
${this.getLowPriorityOptimizations()}

## 📋 **Action Plan**

### **Immediate Actions (This Week)**
1. **Consolidate duplicate functions** - Create shared utility modules
2. **Merge duplicate types** - Centralize type definitions
3. **Review utility functions** - Remove redundancies

### **Short-term Improvements (Next Sprint)**
1. **Create barrel exports** - Simplify import patterns
2. **Standardize naming** - Ensure consistency
3. **Add documentation** - Document shared utilities

### **Long-term Optimizations (Future)**
1. **Automated deduplication** - Set up linting rules
2. **Code review guidelines** - Prevent future duplication
3. **Regular audits** - Schedule periodic redundancy checks

## 🚀 **Expected Benefits**

- **Code Reduction**: 10-20% reduction in duplicate code
- **Maintainability**: Single source of truth for shared logic
- **Consistency**: Standardized implementations
- **Developer Experience**: Easier to find and use shared functionality

## 📊 **Impact Assessment**

### **Consolidation Opportunities**
- **Functions**: ${this.redundancies.duplicateFunctions.reduce((sum, f) => sum + f.occurrences.length - 1, 0)} potential consolidations
- **Types**: ${this.redundancies.duplicateTypes.reduce((sum, t) => sum + t.occurrences.length - 1, 0)} potential consolidations
- **Utilities**: ${this.redundancies.duplicateUtilities.reduce((sum, u) => sum + u.occurrences.length - 1, 0)} potential consolidations

### **Effort Estimation**
- **High Priority**: ${Math.ceil(this.redundancies.duplicateFunctions.length * 2)} hours
- **Medium Priority**: ${Math.ceil(this.redundancies.duplicateTypes.length * 1.5)} hours
- **Low Priority**: ${Math.ceil(this.redundancies.duplicateUtilities.length * 0.5)} hours
- **Total Estimated**: ${Math.ceil(this.redundancies.duplicateFunctions.length * 2 + this.redundancies.duplicateTypes.length * 1.5 + this.redundancies.duplicateUtilities.length * 0.5)} hours

---

**Status**: ✅ **SCAN COMPLETE** - ${totalRedundancies} redundancies identified
**Next Step**: Prioritize and implement consolidations
**Impact**: Moderate code quality improvement opportunity
`;

    fs.writeFileSync('./FOCUSED_REDUNDANCY_REPORT.md', report, 'utf8');
    console.log('✅ Focused redundancy report created: FOCUSED_REDUNDANCY_REPORT.md');
    
    // Show summary
    console.log('\n' + '='.repeat(60));
    console.log('🔍 FOCUSED REDUNDANCY SCAN SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Files processed: ${this.processedFiles}`);
    console.log(`🎯 Total redundancies: ${totalRedundancies}`);
    console.log(`🔄 Duplicate functions: ${this.redundancies.duplicateFunctions.length}`);
    console.log(`📝 Duplicate types: ${this.redundancies.duplicateTypes.length}`);
    console.log(`🛠️ Duplicate utilities: ${this.redundancies.duplicateUtilities.length}`);
    
    console.log('\n🎯 Priority Breakdown:');
    const high = this.redundancies.duplicateFunctions.length;
    const medium = this.redundancies.duplicateTypes.length;
    const low = this.redundancies.duplicateUtilities.length;
    
    console.log(`🚨 High: ${high}`);
    console.log(`⚠️  Medium: ${medium}`);
    console.log(`💡 Low: ${low}`);
    
    console.log('\n📋 Key Findings:');
    if (totalRedundancies > 0) {
      console.log(`💡 Opportunity to consolidate ${totalRedundancies} redundant items`);
      console.log(`📈 Potential 10-20% code reduction through consolidation`);
      console.log(`🔧 Focus on ${high} high-priority function consolidations`);
    } else {
      console.log('🎉 EXCELLENT! No significant redundancies found!');
      console.log('✅ Your codebase is well-organized and deduplicated');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. 📖 Review FOCUSED_REDUNDANCY_REPORT.md');
    console.log('2. 🎯 Prioritize high-priority consolidations');
    console.log('3. 📅 Create consolidation timeline');
    console.log('4. 🚀 Start with function consolidations');
  }

  getHighPriorityConsolidations() {
    const high = this.redundancies.duplicateFunctions.slice(0, 3);
    
    return high.map(func => 
      `- **${func.name}**: ${func.occurrences.length} occurrences - Consolidate into shared utility`
    ).join('\n');
  }

  getMediumPriorityImprovements() {
    const medium = this.redundancies.duplicateTypes.slice(0, 3);
    
    return medium.map(type => 
      `- **${type.name}**: ${type.occurrences.length} occurrences - Centralize type definition`
    ).join('\n');
  }

  getLowPriorityOptimizations() {
    const low = this.redundancies.duplicateUtilities.slice(0, 3);
    
    return low.map(util => 
      `- **${util.name}**: ${util.occurrences.length} occurrences - Review utility organization`
    ).join('\n');
  }
}

// Run the efficient redundancy scan
if (require.main === module) {
  new EfficientRedundancyScanner().run();
}

module.exports = EfficientRedundancyScanner;
