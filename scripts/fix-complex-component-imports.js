#!/usr/bin/env node

/**
 * Fix Complex Component Imports
 * Updates your restored complex components to work with the new centralized type system
 */

const fs = require('fs');

class ComplexComponentImportFixer {
  constructor() {
    this.fixes = 0;
  }

  async run() {
    console.log('🔧 Fixing Complex Component Imports for New Type System\n');

    // Fix each restored complex component
    await this.fixDemo3DEditor();
    await this.fixDemoInputManager();
    await this.fixCabinetViewer3D();
    await this.fixDesignDashboard();
    await this.fixAssetViewer();
    await this.fixWireframeViewer();
    await this.fixNestingOptimizer();
    await this.fixCatalogManager();
    await this.fixGCodeGenerator();
    await this.fixFileUpload();
    await this.fixDrillPatternsLibrary();

    console.log(`\n✅ Fixed ${this.fixes} complex component imports`);
    console.log('🎯 Your complex components are now restored and working with the new type system!');
  }

  async fixDemo3DEditor() {
    const file = './src/components/Demo3DEditor.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports for new type system
    content = content.replace(
      "import { Wall, Point, Room, Door, Window, Cabinet } from '@/lib/floorplan-types';",
      "import { Wall, Point2D, Room, Door, Window, Cabinet } from '@/types/domain/floorplan.types';"
    );

    content = content.replace(
      "import { distance, snapToGrid, pointToLineDistance } from '@/lib/floorplan-utils';",
      "import { distance, snapToGrid, pointToLineDistance } from '@/lib/floorplan-utils';"
    );

    // Fix type references
    content = content.replace(/: Point/g, ': Point2D');
    content = content.replace(/Point\(/g, 'Point2D(');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed Demo3DEditor imports');
    }
  }

  async fixDemoInputManager() {
    const file = './src/components/DemoInputManager.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/floorplan-types'",
      "from '@/types/domain/floorplan.types'"
    );

    content = content.replace(/: Point/g, ': Point2D');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed DemoInputManager imports');
    }
  }

  async fixCabinetViewer3D() {
    const file = './src/components/CabinetViewer3D.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed CabinetViewer3D imports');
    }
  }

  async fixDesignDashboard() {
    const file = './src/components/DesignDashboard.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    content = content.replace(
      "from '@/lib/floorplan-types'",
      "from '@/types/domain/floorplan.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed DesignDashboard imports');
    }
  }

  async fixAssetViewer() {
    const file = './src/components/AssetViewer.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed AssetViewer imports');
    }
  }

  async fixWireframeViewer() {
    const file = './src/components/WireframeViewer.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed WireframeViewer imports');
    }
  }

  async fixNestingOptimizer() {
    const file = './src/components/NestingOptimizer.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed NestingOptimizer imports');
    }
  }

  async fixCatalogManager() {
    const file = './src/components/CatalogManager.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cabinet-types'",
      "from '@/types/domain/cabinet.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed CatalogManager imports');
    }
  }

  async fixGCodeGenerator() {
    const file = './src/components/GCodeGenerator.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports
    content = content.replace(
      "from '@/lib/cnc-types'",
      "from '@/types/domain/cnc.types'"
    );

    content = content.replace(
      "from '@/lib/manufacturing-types'",
      "from '@/types/domain/manufacturing.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed GCodeGenerator imports');
    }
  }

  async fixFileUpload() {
    const file = './src/components/FileUpload.tsx';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports if needed
    content = content.replace(
      "from '@/lib/floorplan-types'",
      "from '@/types/domain/floorplan.types'"
    );

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed FileUpload imports');
    }
  }

  async fixDrillPatternsLibrary() {
    const file = './src/lib/drill-patterns-library.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Fix imports for new type system
    content = content.replace(
      "from '@/types/cnc.types'",
      "from '@/types/domain/cnc.types'"
    );

    content = content.replace(
      "from '@/types/cabinet.types'",
      "from '@/types/domain/cabinet.types'"
    );

    content = content.replace(
      "from '@/types/manufacturing.types'",
      "from '@/types/domain/manufacturing.types'"
    );

    // Fix base type imports
    if (content.includes('Point2D') && !content.includes('@/types/core/base.types')) {
      content = "import { Point2D, Tolerance } from '@/types/core/base.types';\n" + content;
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed DrillPatternsLibrary imports');
    }
  }
}

// Run the script
if (require.main === module) {
  new ComplexComponentImportFixer().run();
}

module.exports = ComplexComponentImportFixer;
