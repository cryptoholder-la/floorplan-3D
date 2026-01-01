#!/usr/bin/env node

/**
 * Find Redundant Files Script
 * Identifies duplicate, unused, and redundant files for potential cleanup
 * ASKS FOR CONFIRMATION BEFORE ANY DELETION
 */

const fs = require('fs');
const path = require('path');

class RedundantFileFinder {
  constructor() {
    this.redundantFiles = {
      duplicates: [],
      unused: [],
      empty: [],
      oldVersions: [],
      scattered: []
    };
    this.fileHashes = new Map();
    this.importMap = new Map();
  }

  async run() {
    console.log('🔍 Finding Redundant Files - NO DELETION WITHOUT CONFIRMATION\n');

    // Analyze all files
    await this.scanAllFiles();
    
    // Find different types of redundancy
    await this.findDuplicateFiles();
    await this.findEmptyFiles();
    await this.findUnusedFiles();
    await this.findOldVersions();
    await this.findScatteredFiles();
    
    // Generate report
    await this.generateReport();
    
    // Ask for confirmation before any action
    await this.promptForAction();
  }

  async scanAllFiles() {
    console.log('📁 Scanning all files...');
    
    const directories = ['./src'];
    
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }
    
    console.log(`✅ Scanned ${this.fileHashes.size} files`);
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
    const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Create simple hash for duplicate detection
      const hash = this.createHash(content);
      this.fileHashes.set(filePath, {
        hash,
        size: content.length,
        imports: this.extractImports(content),
        exports: this.extractExports(content)
      });
      
      // Build import map for unused file detection
      const imports = this.extractImports(content);
      imports.forEach(imp => {
        if (!this.importMap.has(imp)) {
          this.importMap.set(imp, []);
        }
        this.importMap.get(imp).push(filePath);
      });
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  createHash(content) {
    // Simple hash function for content comparison
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
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

  async findDuplicateFiles() {
    console.log('🔍 Finding duplicate files...');
    
    const hashGroups = new Map();
    
    // Group files by content hash
    for (const [filePath, fileInfo] of this.fileHashes) {
      const hash = fileInfo.hash;
      if (!hashGroups.has(hash)) {
        hashGroups.set(hash, []);
      }
      hashGroups.get(hash).push(filePath);
    }
    
    // Find duplicates (same hash, different files)
    for (const [hash, files] of hashGroups) {
      if (files.length > 1) {
        // Keep the one in the most logical location, mark others as redundant
        const primaryFile = this.selectPrimaryFile(files);
        const duplicates = files.filter(f => f !== primaryFile);
        
        duplicates.forEach(duplicate => {
          this.redundantFiles.duplicates.push({
            file: duplicate,
            primary: primaryFile,
            reason: 'Duplicate content',
            size: this.fileHashes.get(duplicate).size
          });
        });
      }
    }
    
    console.log(`✅ Found ${this.redundantFiles.duplicates.length} duplicate files`);
  }

  selectPrimaryFile(files) {
    // Prefer files in consolidated structure
    const consolidatedPaths = files.filter(f => 
      f.includes('/src/components/') || 
      f.includes('/src/types/') || 
      f.includes('/src/lib/') ||
      f.includes('/src/pages/') ||
      f.includes('/src/ui/')
    );
    
    if (consolidatedPaths.length > 0) {
      return consolidatedPaths[0];
    }
    
    // Prefer shorter paths (more likely to be primary)
    return files.reduce((shortest, current) => 
      current.length < shortest.length ? current : shortest
    );
  }

  async findEmptyFiles() {
    console.log('🔍 Finding empty files...');
    
    for (const [filePath, fileInfo] of this.fileHashes) {
      if (fileInfo.size === 0 || fileInfo.size < 50) {
        // Check if it's truly empty or just minimal
        const content = fs.readFileSync(filePath, 'utf8').trim();
        if (content.length === 0 || content === 'export {};') {
          this.redundantFiles.empty.push({
            file: filePath,
            reason: 'Empty or minimal file',
            size: fileInfo.size
          });
        }
      }
    }
    
    console.log(`✅ Found ${this.redundantFiles.empty.length} empty files`);
  }

  async findUnusedFiles() {
    console.log('🔍 Finding potentially unused files...');
    
    for (const [filePath, fileInfo] of this.fileHashes) {
      const exports = fileInfo.exports;
      
      // Skip if no exports (likely utility files)
      if (exports.length === 0) continue;
      
      // Check if exports are imported elsewhere
      let isUsed = false;
      for (const exp of exports) {
        const importers = this.importMap.get(`./${path.basename(filePath, path.extname(filePath))}`) || [];
        if (importers.length > 0) {
          isUsed = true;
          break;
        }
      }
      
      if (!isUsed && !filePath.includes('/index.')) {
        this.redundantFiles.unused.push({
          file: filePath,
          reason: 'No imports found',
          exports: exports
        });
      }
    }
    
    console.log(`✅ Found ${this.redundantFiles.unused.length} potentially unused files`);
  }

  async findOldVersions() {
    console.log('🔍 Finding old version files...');
    
    for (const [filePath, fileInfo] of this.fileHashes) {
      const filename = path.basename(filePath);
      
      // Look for patterns indicating old versions
      const oldVersionPatterns = [
        /old/i,
        /backup/i,
        /v\d+/,
        /-\d+\./,
        /copy/i,
        /duplicate/i
      ];
      
      for (const pattern of oldVersionPatterns) {
        if (pattern.test(filename)) {
          this.redundantFiles.oldVersions.push({
            file: filePath,
            reason: `Matches pattern: ${pattern.source}`,
            size: fileInfo.size
          });
          break;
        }
      }
    }
    
    console.log(`✅ Found ${this.redundantFiles.oldVersions.length} old version files`);
  }

  async findScatteredFiles() {
    console.log('🔍 Finding scattered files that should be consolidated...');
    
    for (const [filePath, fileInfo] of this.fileHashes) {
      // Look for files in old scattered locations
      const scatteredPatterns = [
        /src\/components\/10_10\//,
        /src\/components\/ui\//,
        /src\/types\/core\//,
        /src\/types\/domain\//,
        /src\/types\/integration\//,
        /src\/lib\/catalog\//,
        /src\/lib\/hooks\//
      ];
      
      for (const pattern of scatteredPatterns) {
        if (pattern.test(filePath)) {
          // Check if equivalent file exists in consolidated location
          const filename = path.basename(filePath);
          const consolidatedPath = this.getConsolidatedPath(filePath, filename);
          
          if (fs.existsSync(consolidatedPath)) {
            this.redundantFiles.scattered.push({
              file: filePath,
              consolidated: consolidatedPath,
              reason: 'Scattered file with consolidated equivalent',
              size: fileInfo.size
            });
          }
          break;
        }
      }
    }
    
    console.log(`✅ Found ${this.redundantFiles.scattered.length} scattered files`);
  }

  getConsolidatedPath(originalPath, filename) {
    if (originalPath.includes('/components/10_10/') || originalPath.includes('/components/')) {
      return `./src/components/${filename}`;
    }
    if (originalPath.includes('/components/ui/')) {
      return `./src/ui/${filename}`;
    }
    if (originalPath.includes('/types/')) {
      return `./src/types/${filename}`;
    }
    if (originalPath.includes('/lib/')) {
      return `./src/lib/${filename}`;
    }
    return originalPath;
  }

  async generateReport() {
    console.log('\n📝 Generating redundant files report...');

    const totalRedundant = Object.values(this.redundantFiles).reduce((sum, arr) => sum + arr.length, 0);
    
    const report = `# Redundant Files Analysis Report

## 📊 **Summary**

**Total Redundant Files**: ${totalRedundant}
- Duplicate Files: ${this.redundantFiles.duplicates.length}
- Empty Files: ${this.redundantFiles.empty.length}
- Potentially Unused: ${this.redundantFiles.unused.length}
- Old Versions: ${this.redundantFiles.oldVersions.length}
- Scattered Files: ${this.redundantFiles.scattered.length}

## 🎯 **Redundant Files Found**

### 1. **Duplicate Files** (${this.redundantFiles.duplicates.length})

${this.redundantFiles.duplicates.length > 0 ? 
  this.redundantFiles.duplicates.map(f => 
    `- **${f.file}** (duplicate of \`${f.primary}\`) - ${f.size} bytes`
  ).join('\n') : 
  '✅ No duplicate files found!'}

### 2. **Empty Files** (${this.redundantFiles.empty.length})

${this.redundantFiles.empty.length > 0 ? 
  this.redundantFiles.empty.map(f => 
    `- **${f.file}** - ${f.reason} (${f.size} bytes)`
  ).join('\n') : 
  '✅ No empty files found!'}

### 3. **Potentially Unused Files** (${this.redundantFiles.unused.length})

${this.redundantFiles.unused.length > 0 ? 
  this.redundantFiles.unused.map(f => 
    `- **${f.file}** - ${f.reason} (exports: ${f.exports.join(', ')})`
  ).join('\n') : 
  '✅ No unused files found!'}

### 4. **Old Version Files** (${this.redundantFiles.oldVersions.length})

${this.redundantFiles.oldVersions.length > 0 ? 
  this.redundantFiles.oldVersions.map(f => 
    `- **${f.file}** - ${f.reason} (${f.size} bytes)`
  ).join('\n') : 
  '✅ No old version files found!'}

### 5. **Scattered Files** (${this.redundantFiles.scattered.length})

${this.redundantFiles.scattered.length > 0 ? 
  this.redundantFiles.scattered.map(f => 
    `- **${f.file}** (should use \`${f.consolidated}\`) - ${f.reason} (${f.size} bytes)`
  ).join('\n') : 
  '✅ No scattered files found!'}

## 🚀 **Recommendations**

### **Safe to Delete** (Low Risk)
- Empty files
- Clear duplicates with confirmed primary
- Old version files with clear naming

### **Review Before Delete** (Medium Risk)
- Potentially unused files (verify no dynamic imports)
- Scattered files (verify consolidated version is complete)

### **Keep for Now** (High Risk)
- Files with unclear usage
- Files that might be dynamically imported
- Files referenced in configuration

## 📋 **Cleanup Commands**

### **Safe Cleanup**
\`\`\`bash
# Delete empty files
node scripts/cleanup-empty-files.js

# Delete confirmed duplicates
node scripts/cleanup-duplicates.js

# Delete old versions
node scripts/cleanup-old-versions.js
\`\`\`

### **Review-Based Cleanup**
\`\`\`bash
# Review unused files
node scripts/review-unused-files.js

# Review scattered files
node scripts/review-scattered-files.js
\`\`\`

---

**Status**: Analysis complete - ${totalRedundant} redundant files identified
**Next Step**: Review and approve deletions
`;

    fs.writeFileSync('./REDUNDANT_FILES_REPORT.md', report, 'utf8');
    console.log('✅ Report generated: REDUNDANT_FILES_REPORT.md');
  }

  async promptForAction() {
    console.log('\n' + '='.repeat(60));
    console.log('🤔 ACTION REQUIRED - Redundant Files Found');
    console.log('='.repeat(60));
    
    const totalRedundant = Object.values(this.redundantFiles).reduce((sum, arr) => sum + arr.length, 0);
    
    console.log(`\n📊 Found ${totalRedundant} redundant files:`);
    console.log(`  - ${this.redundantFiles.duplicates.length} duplicates`);
    console.log(`  - ${this.redundantFiles.empty.length} empty files`);
    console.log(`  - ${this.redundantFiles.unused.length} potentially unused`);
    console.log(`  - ${this.redundantFiles.oldVersions.length} old versions`);
    console.log(`  - ${this.redundantFiles.scattered.length} scattered files`);
    
    console.log('\n📋 Available Actions:');
    console.log('1. 📖 View detailed report (REDUNDANT_FILES_REPORT.md)');
    console.log('2. 🗑️  Delete empty files (safe)');
    console.log('3. 🗑️  Delete confirmed duplicates (safe)');
    console.log('4. 🗑️  Delete old versions (safe)');
    console.log('5. 👀 Review potentially unused files (manual)');
    console.log('6. 👀 Review scattered files (manual)');
    console.log('7. ❌ Do nothing (keep all files)');
    
    console.log('\n⚠️  IMPORTANT: No files will be deleted without explicit confirmation!');
    console.log('📖 Check REDUNDANT_FILES_REPORT.md for detailed file lists');
    
    console.log('\n✅ Analysis complete. Review the report and choose your action.');
  }
}

// Run the analysis
if (require.main === module) {
  new RedundantFileFinder().run();
}

module.exports = RedundantFileFinder;
