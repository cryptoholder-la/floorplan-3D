#!/usr/bin/env node

/**
 * Review Merge Opportunities Script
 * Identifies files that can be merged and purged, keeping the best versions of logic
 */

const fs = require('fs');
const path = require('path');

class MergeOpportunityReviewer {
  constructor() {
    this.mergeOpportunities = {
      similarLogic: [],
      partialDuplicates: [],
      complementaryFiles: [],
      outdatedVersions: [],
      utilityConsolidation: []
    };
    this.fileAnalysis = new Map();
  }

  async run() {
    console.log('🔍 Reviewing Merge and Purge Opportunities\n');

    // Analyze all files for merge opportunities
    await this.analyzeAllFiles();
    
    // Find different types of merge opportunities
    await this.findSimilarLogicFiles();
    await this.findPartialDuplicates();
    await this.findComplementaryFiles();
    await this.findOutdatedVersions();
    await this.findUtilityConsolidation();
    
    // Generate merge recommendations
    await this.generateMergeRecommendations();
    
    console.log('\n✅ Merge opportunity review complete!');
  }

  async analyzeAllFiles() {
    console.log('📁 Analyzing files for merge opportunities...');
    
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
        logic: this.extractLogicPatterns(content),
        dependencies: this.extractDependencies(content),
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

  extractLogicPatterns(content) {
    const patterns = {
      calculations: (content.match(/[\d+\-*/]+/g) || []).length,
      conditions: (content.match(/if\s*\(|else\s+if|switch\s*\(/g) || []).length,
      loops: (content.match(/for\s*\(|while\s*\(|\.forEach\(|\.map\(/g) || []).length,
      asyncOperations: (content.match(/async|await|Promise/g) || []).length,
      eventHandlers: (content.match(/onClick|onChange|onSubmit|addEventListener/g) || []).length,
      apiCalls: (content.match(/fetch\(|axios\.|\.get\(|\.post\(/g) || []).length,
      stateManagement: (content.match(/useState|useEffect|useContext|setState/g) || []).length,
      errorHandling: (content.match(/try\s*\{|catch\s*\(|throw\s+/g) || []).length
    };
    
    return patterns;
  }

  extractDependencies(content) {
    const deps = [];
    const depRegex = /require\(['"]([^'"]+)['"]\)|import.*from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = depRegex.exec(content)) !== null) {
      const dep = match[1] || match[2];
      if (dep && !dep.startsWith('.') && !dep.startsWith('@/')) {
        deps.push(dep);
      }
    }
    
    return deps;
  }

  async findSimilarLogicFiles() {
    console.log('🔍 Finding files with similar logic...');
    
    const files = Array.from(this.fileAnalysis.values());
    
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const file1 = files[i];
        const file2 = files[j];
        
        const similarity = this.calculateLogicSimilarity(file1, file2);
        
        if (similarity > 0.7) { // 70% similarity threshold
          this.mergeOpportunities.similarLogic.push({
            file1: file1.path,
            file2: file2.path,
            similarity: similarity,
            reason: 'Similar logic patterns',
            recommendedKeep: this.selectBestFile(file1, file2),
            mergeStrategy: this.suggestMergeStrategy(file1, file2)
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.mergeOpportunities.similarLogic.length} similar logic pairs`);
  }

  calculateLogicSimilarity(file1, file2) {
    const logic1 = file1.logic;
    const logic2 = file2.logic;
    
    let similarity = 0;
    let totalPatterns = 0;
    
    // Compare logic patterns
    for (const pattern in logic1) {
      totalPatterns++;
      const count1 = logic1[pattern];
      const count2 = logic2[pattern] || 0;
      
      if (count1 > 0 && count2 > 0) {
        similarity += Math.min(count1, count2) / Math.max(count1, count2);
      }
    }
    
    // Compare function names
    const commonFunctions = file1.functions.filter(f => file2.functions.includes(f));
    const totalFunctions = new Set([...file1.functions, ...file2.functions]).size;
    if (totalFunctions > 0) {
      similarity += commonFunctions.length / totalFunctions;
      totalPatterns++;
    }
    
    // Compare class names
    const commonClasses = file1.classes.filter(c => file2.classes.includes(c));
    const totalClasses = new Set([...file1.classes, ...file2.classes]).size;
    if (totalClasses > 0) {
      similarity += commonClasses.length / totalClasses;
      totalPatterns++;
    }
    
    return totalPatterns > 0 ? similarity / totalPatterns : 0;
  }

  selectBestFile(file1, file2) {
    // Criteria for selecting the best file to keep
    let score1 = 0;
    let score2 = 0;
    
    // Prefer larger files (more comprehensive)
    if (file1.size > file2.size) score1 += 1;
    else if (file2.size > file1.size) score2 += 1;
    
    // Prefer more recently modified
    if (file1.lastModified > file2.lastModified) score1 += 1;
    else if (file2.lastModified > file1.lastModified) score2 += 1;
    
    // Prefer more exports
    if (file1.exports.length > file2.exports.length) score1 += 1;
    else if (file2.exports.length > file1.exports.length) score2 += 1;
    
    // Prefer better location (consolidated structure)
    if (this.isInConsolidatedLocation(file1.path)) score1 += 2;
    if (this.isInConsolidatedLocation(file2.path)) score2 += 2;
    
    return score1 > score2 ? file1.path : file2.path;
  }

  isInConsolidatedLocation(filePath) {
    return filePath.includes('/src/components/') ||
           filePath.includes('/src/types/') ||
           filePath.includes('/src/lib/') ||
           filePath.includes('/src/pages/') ||
           filePath.includes('/src/ui/');
  }

  suggestMergeStrategy(file1, file2) {
    const strategies = [];
    
    // If files have same filename but different locations
    if (file1.filename === file2.filename) {
      strategies.push('Same filename - consolidate to single location');
    }
    
    // If one is much larger
    if (file1.size > file2.size * 2) {
      strategies.push('File size difference - merge smaller into larger');
    } else if (file2.size > file1.size * 2) {
      strategies.push('File size difference - merge smaller into larger');
    }
    
    // If they have complementary functions
    const uniqueTo1 = file1.functions.filter(f => !file2.functions.includes(f));
    const uniqueTo2 = file2.functions.filter(f => !file1.functions.includes(f));
    
    if (uniqueTo1.length > 0 && uniqueTo2.length > 0) {
      strategies.push('Complementary functions - merge both');
    }
    
    return strategies.length > 0 ? strategies.join(', ') : 'Manual review required';
  }

  async findPartialDuplicates() {
    console.log('🔍 Finding partial duplicates...');
    
    const files = Array.from(this.fileAnalysis.values());
    
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const file1 = files[i];
        const file2 = files[j];
        
        const overlap = this.calculateOverlap(file1, file2);
        
        if (overlap > 0.5 && overlap < 0.9) { // 50-90% overlap
          this.mergeOpportunities.partialDuplicates.push({
            file1: file1.path,
            file2: file2.path,
            overlap: overlap,
            reason: 'Partial duplicate content',
            recommendedKeep: this.selectBestFile(file1, file2),
            mergeStrategy: 'Extract common parts, keep unique differences'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.mergeOpportunities.partialDuplicates.length} partial duplicates`);
  }

  calculateOverlap(file1, file2) {
    // Calculate overlap based on shared functions, classes, and interfaces
    const sharedFunctions = file1.functions.filter(f => file2.functions.includes(f));
    const sharedClasses = file1.classes.filter(c => file2.classes.includes(c));
    const sharedInterfaces = file1.interfaces.filter(i => file2.interfaces.includes(i));
    const sharedTypes = file1.types.filter(t => file2.types.includes(t));
    
    const totalShared = sharedFunctions.length + sharedClasses.length + sharedInterfaces.length + sharedTypes.length;
    const totalUnique = new Set([
      ...file1.functions, ...file2.functions,
      ...file1.classes, ...file2.classes,
      ...file1.interfaces, ...file2.interfaces,
      ...file1.types, ...file2.types
    ]).size;
    
    return totalUnique > 0 ? totalShared / totalUnique : 0;
  }

  async findComplementaryFiles() {
    console.log('🔍 Finding complementary files...');
    
    const files = Array.from(this.fileAnalysis.values());
    
    for (let i = 0; i < files.length; i++) {
      for (let j = i + 1; j < files.length; j++) {
        const file1 = files[i];
        const file2 = files[j];
        
        // Check if files have complementary functionality
        if (this.areComplementary(file1, file2)) {
          this.mergeOpportunities.complementaryFiles.push({
            file1: file1.path,
            file2: file2.path,
            reason: 'Complementary functionality',
            recommendedAction: 'Merge into single comprehensive file',
            benefits: this.getMergeBenefits(file1, file2)
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.mergeOpportunities.complementaryFiles.length} complementary file pairs`);
  }

  areComplementary(file1, file2) {
    // Check if files have similar names but different implementations
    const nameSimilarity = this.calculateNameSimilarity(file1.filename, file2.filename);
    
    if (nameSimilarity > 0.7) {
      // Check if they have different but complementary functions
      const uniqueTo1 = file1.functions.filter(f => !file2.functions.includes(f));
      const uniqueTo2 = file2.functions.filter(f => !file1.functions.includes(f));
      
      return uniqueTo1.length > 0 && uniqueTo2.length > 0;
    }
    
    return false;
  }

  calculateNameSimilarity(name1, name2) {
    // Simple name similarity based on common words
    const words1 = name1.toLowerCase().split(/[^a-z0-9]+/);
    const words2 = name2.toLowerCase().split(/[^a-z0-9]+/);
    
    const commonWords = words1.filter(w => words2.includes(w));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  getMergeBenefits(file1, file2) {
    const benefits = [];
    
    if (file1.functions.length + file2.functions.length > 5) {
      benefits.push('Consolidate multiple functions');
    }
    
    if (file1.imports.length + file2.imports.length > 3) {
      benefits.push('Reduce duplicate imports');
    }
    
    if (file1.size + file2.size > 5000) {
      benefits.push('Create comprehensive module');
    }
    
    return benefits.length > 0 ? benefits : ['Improved organization'];
  }

  async findOutdatedVersions() {
    console.log('🔍 Finding outdated versions...');
    
    const files = Array.from(this.fileAnalysis.values());
    const fileGroups = new Map();
    
    // Group files by similar names
    for (const file of files) {
      const baseName = this.getBaseName(file.filename);
      
      if (!fileGroups.has(baseName)) {
        fileGroups.set(baseName, []);
      }
      fileGroups.get(baseName).push(file);
    }
    
    // Find groups with multiple files (potential versions)
    for (const [baseName, group] of fileGroups) {
      if (group.length > 1) {
        // Sort by last modified date
        group.sort((a, b) => b.lastModified - a.lastModified);
        
        const latest = group[0];
        const outdated = group.slice(1);
        
        for (const oldFile of outdated) {
          this.mergeOpportunities.outdatedVersions.push({
            outdated: oldFile.path,
            latest: latest.path,
            reason: 'Outdated version',
            ageDiff: this.getAgeDifference(oldFile.lastModified, latest.lastModified),
            recommendedAction: 'Delete outdated version'
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.mergeOpportunities.outdatedVersions.length} outdated versions`);
  }

  getBaseName(filename) {
    // Remove common suffixes and prefixes to get base name
    return filename
      .replace(/-v\d+$/i, '')
      .replace(/-old$/i, '')
      .replace(/-backup$/i, '')
      .replace(/-copy$/i, '')
      .replace(/^old-/i, '')
      .replace(/^backup-/i, '');
  }

  getAgeDifference(date1, date2) {
    const diffMs = Math.abs(date1 - date2);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Less than a day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    return `${Math.floor(diffDays / 30)} months`;
  }

  async findUtilityConsolidation() {
    console.log('🔍 Finding utility consolidation opportunities...');
    
    const files = Array.from(this.fileAnalysis.values());
    const utilityFiles = files.filter(f => 
      f.filename.includes('util') || 
      f.filename.includes('helper') || 
      f.filename.includes('common') ||
      f.functions.length > 0 && f.functions.length < 5 // Small utility files
    );
    
    // Group utility files by functionality
    const utilityGroups = new Map();
    
    for (const file of utilityFiles) {
      const category = this.categorizeUtility(file);
      
      if (!utilityGroups.has(category)) {
        utilityGroups.set(category, []);
      }
      utilityGroups.get(category).push(file);
    }
    
    // Find consolidation opportunities
    for (const [category, group] of utilityGroups) {
      if (group.length > 1) {
        this.mergeOpportunities.utilityConsolidation.push({
          category: category,
          files: group.map(f => f.path),
          reason: 'Multiple utility files with similar functionality',
          recommendedAction: 'Consolidate into single utility module',
          benefits: [
            'Reduced file count',
            'Easier maintenance',
            'Centralized utilities',
            'Better organization'
          ]
        });
      }
    }
    
    console.log(`✅ Found ${this.mergeOpportunities.utilityConsolidation.length} utility consolidation opportunities`);
  }

  categorizeUtility(file) {
    const content = fs.readFileSync(file.path, 'utf8').toLowerCase();
    
    if (content.includes('date') || content.includes('time')) return 'Date/Time utilities';
    if (content.includes('string') || content.includes('text')) return 'String/Text utilities';
    if (content.includes('array') || content.includes('list')) return 'Array/List utilities';
    if (content.includes('object') || content.includes('json')) return 'Object/JSON utilities';
    if (content.includes('math') || content.includes('calculate')) return 'Math/Calculation utilities';
    if (content.includes('validation') || content.includes('check')) return 'Validation utilities';
    if (content.includes('format') || content.includes('convert')) return 'Format/Convert utilities';
    
    return 'General utilities';
  }

  async generateMergeRecommendations() {
    console.log('\n📝 Generating merge recommendations...');

    const totalOpportunities = Object.values(this.mergeOpportunities)
      .reduce((sum, arr) => sum + arr.length, 0);
    
    const report = `# Merge and Purge Opportunities Report

## 📊 **Summary**

**Total Opportunities**: ${totalOpportunities}
- Similar Logic Files: ${this.mergeOpportunities.similarLogic.length}
- Partial Duplicates: ${this.mergeOpportunities.partialDuplicates.length}
- Complementary Files: ${this.mergeOpportunities.complementaryFiles.length}
- Outdated Versions: ${this.mergeOpportunities.outdatedVersions.length}
- Utility Consolidation: ${this.mergeOpportunities.utilityConsolidation.length}

## 🎯 **Merge Opportunities**

### 1. **Similar Logic Files** (${this.mergeOpportunities.similarLogic.length})

${this.mergeOpportunities.similarLogic.length > 0 ? 
  this.mergeOpportunities.similarLogic.slice(0, 5).map(opp => 
    `- **${opp.file1}** ↔ **${opp.file2}** (${(opp.similarity * 100).toFixed(1)}% similar)
  - Keep: \`${opp.recommendedKeep}\`
  - Strategy: ${opp.mergeStrategy}`
  ).join('\n') + 
  (this.mergeOpportunities.similarLogic.length > 5 ? '\n- ... and more' : '') : 
  '✅ No similar logic files found!'}

### 2. **Partial Duplicates** (${this.mergeOpportunities.partialDuplicates.length})

${this.mergeOpportunities.partialDuplicates.length > 0 ? 
  this.mergeOpportunities.partialDuplicates.slice(0, 3).map(opp => 
    `- **${opp.file1}** ↔ **${opp.file2}** (${(opp.overlap * 100).toFixed(1)}% overlap)
  - Keep: \`${opp.recommendedKeep}\`
  - Strategy: ${opp.mergeStrategy}`
  ).join('\n') + 
  (this.mergeOpportunities.partialDuplicates.length > 3 ? '\n- ... and more' : '') : 
  '✅ No partial duplicates found!'}

### 3. **Complementary Files** (${this.mergeOpportunities.complementaryFiles.length})

${this.mergeOpportunities.complementaryFiles.length > 0 ? 
  this.mergeOpportunities.complementaryFiles.slice(0, 3).map(opp => 
    `- **${opp.file1}** ↔ **${opp.file2}**
  - Action: ${opp.recommendedAction}
  - Benefits: ${opp.benefits.join(', ')}`
  ).join('\n') + 
  (this.mergeOpportunities.complementaryFiles.length > 3 ? '\n- ... and more' : '') : 
  '✅ No complementary files found!'}

### 4. **Outdated Versions** (${this.mergeOpportunities.outdatedVersions.length})

${this.mergeOpportunities.outdatedVersions.length > 0 ? 
  this.mergeOpportunities.outdatedVersions.slice(0, 5).map(opp => 
    `- **${opp.outdated}** → **${opp.latest}**
  - Age difference: ${opp.ageDiff}
  - Action: ${opp.recommendedAction}`
  ).join('\n') + 
  (this.mergeOpportunities.outdatedVersions.length > 5 ? '\n- ... and more' : '') : 
  '✅ No outdated versions found!'}

### 5. **Utility Consolidation** (${this.mergeOpportunities.utilityConsolidation.length})

${this.mergeOpportunities.utilityConsolidation.length > 0 ? 
  this.mergeOpportunities.utilityConsolidation.map(opp => 
    `- **${opp.category}** (${opp.files.length} files)
  - Files: ${opp.files.slice(0, 3).map(f => f.split('/').pop()).join(', ')}${opp.files.length > 3 ? '...' : ''}
  - Action: ${opp.recommendedAction}
  - Benefits: ${opp.benefits.join(', ')}`
  ).join('\n') : 
  '✅ No utility consolidation opportunities found!'}

## 🚀 **Recommended Action Plan**

### **Phase 1: Safe Merges** (Low Risk)
1. **Merge similar logic files** - Keep best version, merge unique parts
2. **Consolidate utility files** - Group by functionality
3. **Delete outdated versions** - Clear old versions

### **Phase 2: Strategic Merges** (Medium Risk)
1. **Merge partial duplicates** - Extract common parts
2. **Combine complementary files** - Create comprehensive modules

### **Phase 3: Review-Based Merges** (Manual Review)
1. **Review complex merges** - Manual intervention required
2. **Test merged functionality** - Ensure no breaking changes

## 📋 **Merge Commands**

### **Safe Merges**
\`\`\`bash
# Merge similar logic files
node scripts/merge-similar-logic.js

# Consolidate utilities
node scripts/consolidate-utilities.js

# Delete outdated versions
node scripts/delete-outdated-versions.js
\`\`\`

### **Strategic Merges**
\`\`\`bash
# Merge partial duplicates
node scripts/merge-partial-duplicates.js

# Combine complementary files
node scripts/combine-complementary.js
\`\`\`

## 🎯 **Expected Benefits**

- **Reduced file count**: ${totalOpportunities} fewer files
- **Cleaner codebase**: Better organization
- **Easier maintenance**: Centralized logic
- **Improved performance**: Less file overhead
- **Better developer experience**: Easier navigation

---

**Status**: Analysis complete - ${totalOpportunities} merge opportunities identified
**Next Step**: Review recommendations and execute merge plan
`;

    fs.writeFileSync('./MERGE_OPPORTUNITIES_REPORT.md', report, 'utf8');
    console.log('✅ Merge opportunities report created: MERGE_OPPORTUNITIES_REPORT.md');
    
    // Show summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MERGE OPPORTUNITIES SUMMARY');
    console.log('='.repeat(60));
    console.log(`🎯 Total opportunities: ${totalOpportunities}`);
    console.log(`🔗 Similar logic: ${this.mergeOpportunities.similarLogic.length}`);
    console.log(`📄 Partial duplicates: ${this.mergeOpportunities.partialDuplicates.length}`);
    console.log(`🤝 Complementary files: ${this.mergeOpportunities.complementaryFiles.length}`);
    console.log(`📅 Outdated versions: ${this.mergeOpportunities.outdatedVersions.length}`);
    console.log(`🔧 Utility consolidation: ${this.mergeOpportunities.utilityConsolidation.length}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. 📖 Review detailed report (MERGE_OPPORTUNITIES_REPORT.md)');
    console.log('2. 🗑️  Execute safe merges first');
    console.log('3. 🧪 Test merged functionality');
    console.log('4. 🔄 Review and iterate');
  }
}

// Run the analysis
if (require.main === module) {
  new MergeOpportunityReviewer().run();
}

module.exports = MergeOpportunityReviewer;
