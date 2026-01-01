#!/usr/bin/env node

/**
 * Targeted Interface Fix Script
 * Fixes specific interface properties based on actual interface names found in audit
 */

const fs = require('fs');

class TargetedInterfaceFixer {
  constructor() {
    this.fixes = 0;
  }

  async run() {
    console.log('🔧 Targeted Interface Fixes Based on Actual Interface Names\n');

    // Fix ManufacturingJob interface
    await this.fixManufacturingJob();

    // Fix ToolRequirement interface
    await this.fixToolRequirement();

    // Fix QualityCheck interface
    await this.fixQualityCheck();

    // Fix GCodeProgram interface
    await this.fixGCodeProgram();

    // Fix GCodeCommand interface
    await this.fixGCodeCommand();

    // Fix CabinetMaterial interface
    await this.fixCabinetMaterial();

    // Fix CabinetHardware interface
    await this.fixCabinetHardware();

    console.log(`\n✅ Applied ${this.fixes} targeted interface fixes`);
  }

  async fixManufacturingJob() {
    const file = './src/types/domain/manufacturing.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to ManufacturingJob
    const jobInterfaceStart = content.indexOf('export interface ManufacturingJob extends BaseEntity {');
    if (jobInterfaceStart !== -1) {
      const jobInterfaceEnd = content.indexOf('}', jobInterfaceStart);
      const jobInterfaceContent = content.substring(jobInterfaceStart, jobInterfaceEnd + 1);

      // Check if priority is missing
      if (!jobInterfaceContent.includes('priority:')) {
        const newJobInterface = jobInterfaceContent.replace(
          'type: \'cutting\' | \'drilling\' | \'assembly\' | \'finishing\' | \'quality-check\';',
          `type: 'cutting' | 'drilling' | 'assembly' | 'finishing' | 'quality-check';
  
  // Job details
  priority: Priority;
  estimatedCost?: number;
  actualCost?: number;`
        );
        content = content.replace(jobInterfaceContent, newJobInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed ManufacturingJob interface');
    }
  }

  async fixToolRequirement() {
    const file = './src/types/domain/manufacturing.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to ToolRequirement
    const toolInterfaceStart = content.indexOf('export interface ToolRequirement extends BaseEntity {');
    if (toolInterfaceStart !== -1) {
      const toolInterfaceEnd = content.indexOf('}', toolInterfaceStart);
      const toolInterfaceContent = content.substring(toolInterfaceStart, toolInterfaceEnd + 1);

      // Check if toolId is missing
      if (!toolInterfaceContent.includes('toolId:')) {
        const newToolInterface = toolInterfaceContent.replace(
          'toolType: ToolType;',
          `toolId: string;
  toolType: ToolType;
  quantity?: number;
  estimatedCost?: number;`
        );
        content = content.replace(toolInterfaceContent, newToolInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed ToolRequirement interface');
    }
  }

  async fixQualityCheck() {
    const file = './src/types/domain/manufacturing.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to QualityCheck
    const qualityInterfaceStart = content.indexOf('export interface QualityCheck extends BaseEntity {');
    if (qualityInterfaceStart !== -1) {
      const qualityInterfaceEnd = content.indexOf('}', qualityInterfaceStart);
      const qualityInterfaceContent = content.substring(qualityInterfaceStart, qualityInterfaceEnd + 1);

      // Check if createdAt/updatedAt are missing
      if (!qualityInterfaceContent.includes('createdAt:')) {
        const newQualityInterface = qualityInterfaceContent.replace(
          'required: boolean;',
          `required: boolean;
  createdAt: Date;
  updatedAt: Date;
  performedBy?: string;
  results?: CheckResult[];`
        );
        content = content.replace(qualityInterfaceContent, newQualityInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed QualityCheck interface');
    }
  }

  async fixGCodeProgram() {
    const file = './src/types/domain/cnc.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to GCodeProgram
    const gcodeInterfaceStart = content.indexOf('export interface GCodeProgram extends BaseEntity {');
    if (gcodeInterfaceStart !== -1) {
      const gcodeInterfaceEnd = content.indexOf('}', gcodeInterfaceStart);
      const gcodeInterfaceContent = content.substring(gcodeInterfaceStart, gcodeInterfaceEnd + 1);

      // Check if estimatedRunTime is missing
      if (!gcodeInterfaceContent.includes('estimatedRunTime')) {
        const newGcodeInterface = gcodeInterfaceContent.replace(
          'metadata: ProgramMetadata;',
          `metadata: ProgramMetadata;
  estimatedRunTime?: number;`
        );
        content = content.replace(gcodeInterfaceContent, newGcodeInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed GCodeProgram interface');
    }
  }

  async fixGCodeCommand() {
    const file = './src/types/domain/cnc.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Find and add GCodeCommand interface if it doesn't exist
    if (!content.includes('export interface GCodeCommand')) {
      const gcodeCommandInterface = `
export interface GCodeCommand {
  lineNumber: number;
  command: string;
  parameters: Record<string, number>;
  comment?: string;
  block: string;
  modal: string;
}
`;

      // Insert after GCodeProgram interface
      const insertPoint = content.indexOf('}', content.indexOf('export interface GCodeProgram')) + 1;
      content = content.slice(0, insertPoint) + gcodeCommandInterface + content.slice(insertPoint);
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed GCodeCommand interface');
    }
  }

  async fixCabinetMaterial() {
    const file = './src/types/domain/cabinet.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to CabinetMaterial
    const materialInterfaceStart = content.indexOf('export interface CabinetMaterial extends BaseEntity {');
    if (materialInterfaceStart !== -1) {
      const materialInterfaceEnd = content.indexOf('}', materialInterfaceStart);
      const materialInterfaceContent = content.substring(materialInterfaceStart, materialInterfaceEnd + 1);

      // Check if pricePerSheet is missing
      if (!materialInterfaceContent.includes('pricePerSheet')) {
        const newMaterialInterface = materialInterfaceContent.replace(
          'thickness: number;',
          `thickness: number;
  pricePerSheet?: number;
  costPerUnit?: number;
  supplier?: string;`
        );
        content = content.replace(materialInterfaceContent, newMaterialInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed CabinetMaterial interface');
    }
  }

  async fixCabinetHardware() {
    const file = './src/types/domain/cabinet.types.ts';
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Add missing properties to CabinetHardware
    const hardwareInterfaceStart = content.indexOf('export interface CabinetHardware extends BaseEntity {');
    if (hardwareInterfaceStart !== -1) {
      const hardwareInterfaceEnd = content.indexOf('}', hardwareInterfaceStart);
      const hardwareInterfaceContent = content.substring(hardwareInterfaceStart, hardwareInterfaceEnd + 1);

      // Check if quantity is missing
      if (!hardwareInterfaceContent.includes('quantity')) {
        const newHardwareInterface = hardwareInterfaceContent.replace(
          'finish: string;',
          `finish: string;
  quantity?: number;
  unitPrice?: number;
  totalCost?: number;`
        );
        content = content.replace(hardwareInterfaceContent, newHardwareInterface);
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      this.fixes++;
      console.log('✅ Fixed CabinetHardware interface');
    }
  }
}

// Run the script
if (require.main === module) {
  new TargetedInterfaceFixer().run();
}

module.exports = TargetedInterfaceFixer;
