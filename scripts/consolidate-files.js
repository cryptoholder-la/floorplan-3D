#!/usr/bin/env node

/**
 * Consolidate Files Script
 * Moves all files into a single organized directory structure
 */

const fs = require('fs');
const path = require('path');

class FileConsolidator {
  constructor() {
    this.moves = 0;
    this.errors = [];
    this.targetStructure = {
      'components': 'src/components',
      'pages': 'src/pages', 
      'lib': 'src/lib',
      'types': 'src/types',
      'data': 'src/data',
      'hooks': 'src/hooks',
      'contexts': 'src/contexts',
      'ui': 'src/ui',
      'assets': 'src/assets',
      'config': 'src/config'
    };
  }

  async run() {
    console.log('🔧 Consolidating Files into Single Directory Structure\n');

    // Create target directories
    await this.createTargetDirectories();

    // Move files from scattered locations
    await this.moveComponentFiles();
    await this.movePageFiles();
    await this.moveLibFiles();
    await this.moveTypeFiles();
    await this.moveDataFiles();
    await this.moveHookFiles();
    await this.moveContextFiles();
    await this.moveUIFiles();
    await this.moveAssetFiles();
    await this.moveConfigFiles();

    // Clean up empty directories
    await this.cleanupEmptyDirectories();

    this.printSummary();
  }

  async createTargetDirectories() {
    console.log('📁 Creating target directory structure...');
    
    for (const [dirName, dirPath] of Object.entries(this.targetStructure)) {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created: ${dirPath}`);
      }
    }
  }

  async moveComponentFiles() {
    console.log('\n🔧 Moving component files...');
    
    // Move from subdirectories to main components directory
    const sourceDirs = [
      'src/components/10_10',
      'src/components/ui',
      'src/app' // Move page components from app to components
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.tsx');
        files.push(...this.findFiles(sourceDir, '.ts'));
        
        for (const file of files) {
          const fileName = path.basename(file);
          let targetPath;
          
          if (sourceDir.includes('ui')) {
            targetPath = path.join('src/ui', fileName);
          } else if (sourceDir.includes('10_10')) {
            targetPath = path.join('src/components', fileName);
          } else if (sourceDir.includes('app')) {
            // Move app components to components directory
            targetPath = path.join('src/components', fileName);
          } else {
            targetPath = path.join('src/components', fileName);
          }

          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async movePageFiles() {
    console.log('\n🔧 Moving page files...');
    
    // Move all page files from app directory to pages directory
    const appDir = 'src/app';
    if (fs.existsSync(appDir)) {
      const files = this.findFiles(appDir, '.tsx');
      files.push(...this.findFiles(appDir, '.ts'));
      
      for (const file of files) {
        const fileName = path.basename(file);
        const targetPath = path.join('src/pages', fileName);
        await this.moveFile(file, targetPath);
      }
    }
  }

  async moveLibFiles() {
    console.log('\n🔧 Moving library files...');
    
    // Move all lib files to single lib directory
    const sourceDirs = [
      'src/lib',
      'src/lib/catalog'
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.ts');
        files.push(...this.findFiles(sourceDir, '.js'));
        
        for (const file of files) {
          const fileName = path.basename(file);
          const targetPath = path.join('src/lib', fileName);
          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async moveTypeFiles() {
    console.log('\n🔧 Moving type files...');
    
    // Move all type files to single types directory
    const sourceDirs = [
      'src/types/core',
      'src/types/domain',
      'src/types/integration'
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.ts');
        
        for (const file of files) {
          const fileName = path.basename(file);
          const targetPath = path.join('src/types', fileName);
          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async moveDataFiles() {
    console.log('\n🔧 Moving data files...');
    
    // Move all data files to single data directory
    const sourceDirs = [
      'src/data',
      'src/data/sample'
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.ts');
        files.push(...this.findFiles(sourceDir, '.json'));
        
        for (const file of files) {
          const fileName = path.basename(file);
          const targetPath = path.join('src/data', fileName);
          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async moveHookFiles() {
    console.log('\n🔧 Moving hook files...');
    
    // Move all hook files to single hooks directory
    const sourceDirs = [
      'src/hooks',
      'src/lib/hooks'
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.ts');
        
        for (const file of files) {
          const fileName = path.basename(file);
          const targetPath = path.join('src/hooks', fileName);
          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async moveContextFiles() {
    console.log('\n🔧 Moving context files...');
    
    // Move all context files to single contexts directory
    const sourceDir = 'src/contexts';
    if (fs.existsSync(sourceDir)) {
      const files = this.findFiles(sourceDir, '.tsx');
      files.push(...this.findFiles(sourceDir, '.ts'));
      
      for (const file of files) {
        const fileName = path.basename(file);
        const targetPath = path.join('src/contexts', fileName);
        await this.moveFile(file, targetPath);
      }
    }
  }

  async moveUIFiles() {
    console.log('\n🔧 Moving UI files...');
    
    // UI files are already in the right place, but let's ensure they're organized
    const uiDir = 'src/ui';
    if (fs.existsSync(uiDir)) {
      // UI files are already consolidated
      console.log('✅ UI files already consolidated');
    }
  }

  async moveAssetFiles() {
    console.log('\n🔧 Moving asset files...');
    
    // Move any asset files to assets directory
    const sourceDirs = [
      'src/assets',
      'src/public',
      'public'
    ];

    for (const sourceDir of sourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const files = this.findFiles(sourceDir, '.png');
        files.push(...this.findFiles(sourceDir, '.jpg'));
        files.push(...this.findFiles(sourceDir, '.jpeg'));
        files.push(...this.findFiles(sourceDir, '.gif'));
        files.push(...this.findFiles(sourceDir, '.svg'));
        files.push(...this.findFiles(sourceDir, '.ico'));
        
        for (const file of files) {
          const fileName = path.basename(file);
          const targetPath = path.join('src/assets', fileName);
          await this.moveFile(file, targetPath);
        }
      }
    }
  }

  async moveConfigFiles() {
    console.log('\n🔧 Moving config files...');
    
    // Move config files to single config directory
    const configFiles = [
      'package.json',
      'tsconfig.json', 
      'tailwind.config.js',
      'postcss.config.js',
      '.env',
      '.env.local',
      '.env.example'
    ];

    for (const configFile of configFiles) {
      if (fs.existsSync(configFile)) {
        const targetPath = path.join('src/config', configFile);
        await this.moveFile(configFile, targetPath);
      }
    }
  }

  async moveFile(sourcePath, targetPath) {
    try {
      // Ensure target directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Check if target already exists
      if (fs.existsSync(targetPath)) {
        const sourceStats = fs.statSync(sourcePath);
        const targetStats = fs.statSync(targetPath);
        
        // Only move if source is newer or different size
        if (sourceStats.mtime > targetStats.mtime || sourceStats.size !== targetStats.size) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ Updated: ${targetPath}`);
          this.moves++;
        }
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Moved: ${sourcePath} → ${targetPath}`);
        this.moves++;
      }
    } catch (error) {
      this.errors.push({ file: sourcePath, error: error.message });
      console.log(`❌ Error moving ${sourcePath}: ${error.message}`);
    }
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

  async cleanupEmptyDirectories() {
    console.log('\n🧹 Cleaning up empty directories...');
    
    const dirsToClean = [
      'src/components/10_10',
      'src/components/ui',
      'src/types/core',
      'src/types/domain', 
      'src/types/integration',
      'src/lib/catalog',
      'src/lib/hooks',
      'src/data/sample'
    ];

    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmdirSync(dir);
          console.log(`🗑️  Removed empty: ${dir}`);
        } catch (error) {
          // Directory not empty, skip
        }
      }
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FILE CONSOLIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Files moved: ${this.moves}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Errors:');
      this.errors.forEach(err => {
        console.log(`  ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎯 New Directory Structure:');
    console.log('  src/');
    console.log('  ├── components/     (All components)');
    console.log('  ├── pages/          (All pages)');
    console.log('  ├── lib/            (All library files)');
    console.log('  ├── types/          (All type definitions)');
    console.log('  ├── data/           (All data files)');
    console.log('  ├── hooks/          (All custom hooks)');
    console.log('  ├── contexts/       (All React contexts)');
    console.log('  ├── ui/             (UI components)');
    console.log('  ├── assets/         (All assets)');
    console.log('  └── config/         (All config files)');
    
    console.log('\n✨ File consolidation completed!');
  }
}

// Run the script
if (require.main === module) {
  new FileConsolidator().run();
}

module.exports = FileConsolidator;
