#!/usr/bin/env node

/**
 * Fix Missing Component Imports
 * Addresses import errors where components are imported but don't exist
 */

const fs = require('fs');

class MissingComponentImportFixer {
  constructor() {
    this.fixes = 0;
    this.missingComponents = new Set();
    this.existingComponents = new Set();
  }

  async run() {
    console.log('🔧 Fixing Missing Component Imports\n');

    // First, scan existing components
    await this.scanExistingComponents();

    // Then fix import issues in application files
    await this.fixApplicationFiles();

    console.log(`\n✅ Fixed ${this.fixes} missing component imports`);
    console.log(`📝 Found ${this.missingComponents.size} missing components`);
  }

  async scanExistingComponents() {
    console.log('📁 Scanning existing components...');
    
    const componentsDir = './src/components';
    if (!fs.existsSync(componentsDir)) return;

    const componentFiles = this.findFiles(componentsDir, '.tsx');
    
    for (const file of componentFiles) {
      const componentName = path.basename(file, '.tsx');
      this.existingComponents.add(componentName);
    }

    console.log(`✅ Found ${this.existingComponents.size} existing components`);
  }

  findFiles(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    function traverse(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (item.endsWith(extension)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    traverse(dir);
    return files;
  }

  async fixApplicationFiles() {
    console.log('🔧 Fixing application files...');
    
    const appFiles = this.findFiles('./src/app', '.tsx');
    
    for (const file of appFiles) {
      await this.fixFile(file);
    }
  }

  async fixFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) return;

      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Find all component imports
      const importRegex = /import\s+(\w+)\s+from\s+['"]@\/components\/([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const [fullMatch, importName, componentPath] = match;
        const componentName = componentPath.split('/').pop();
        
        // Check if component exists
        if (!this.existingComponents.has(componentName)) {
          this.missingComponents.add(componentName);
          
          // Comment out the missing import
          content = content.replace(fullMatch, `// ${fullMatch} // Component missing`);
          
          // Also comment out usage of this component
          content = this.commentOutComponentUsage(content, importName);
        }
      }

      // Also check for default imports
      const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]@\/components\/([^'"]+)['"]/g;
      
      while ((match = defaultImportRegex.exec(content)) !== null) {
        const [fullMatch, importName, componentPath] = match;
        const componentName = componentPath.split('/').pop();
        
        // Check if component exists
        if (!this.existingComponents.has(componentName)) {
          this.missingComponents.add(componentName);
          
          // Comment out the missing import
          content = content.replace(fullMatch, `// ${fullMatch} // Component missing`);
          
          // Also comment out usage of this component
          content = this.commentOutComponentUsage(content, importName);
        }
      }

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixes++;
        console.log(`✅ Fixed missing imports in ${filePath}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    }
  }

  commentOutComponentUsage(content, importName) {
    // Comment out JSX usage
    content = content.replace(
      new RegExp(`<${importName}([^>]*)>`, 'g'),
      `{/* <${importName}$1> // Component missing */}`
    );
    
    content = content.replace(
      new RegExp(`</${importName}>`, 'g'),
      `{/* </${importName}> // Component missing */}`
    );

    // Comment out variable usage
    content = content.replace(
      new RegExp(`${importName}\\s*:`, 'g'),
      `// ${importName}: // Component missing`
    );

    return content;
  }
}

// Add path module
const path = require('path');

// Run the script
if (require.main === module) {
  new MissingComponentImportFixer().run();
}

module.exports = MissingComponentImportFixer;
