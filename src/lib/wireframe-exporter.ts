import { WireframeAsset, CabinetPart, CabinetAccessory } from '../types/wireframe';

export interface ExportOptions {
  format: 'json' | 'js' | 'threejs' | 'obj' | 'gcode';
  includeParts: boolean;
  includeAccessories: boolean;
  includeRenderSettings: boolean;
  prettyPrint: boolean;
}

export interface ExportedWireframe {
  metadata: {
    name: string;
    description?: string;
    category: string;
    type: string;
    exportedAt: string;
    version: string;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  parts?: CabinetPart[];
  accessories?: CabinetAccessory[];
  renderSettings?: {
    opacity: number;
    color: string;
    showWireframe: boolean;
    showSolid: boolean;
  };
  geometry?: any;
  materials?: any;
}

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'json',
  includeParts: true,
  includeAccessories: true,
  includeRenderSettings: true,
  prettyPrint: true
};

/**
 * Generate downloadable file content from wireframe asset
 */
export function generateWireframeExport(
  asset: WireframeAsset,
  options: Partial<ExportOptions> = {}
): { content: string; filename: string; mimeType: string } {
  const finalOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  
  switch (finalOptions.format) {
    case 'json':
      return generateJSONExport(asset, finalOptions);
    case 'js':
      return generateJavaScriptExport(asset, finalOptions);
    case 'threejs':
      return generateThreeJSExport(asset, finalOptions);
    case 'obj':
      return generateOBJExport(asset, finalOptions);
    case 'gcode':
      return generateGCodeExport(asset, finalOptions);
    default:
      return generateJSONExport(asset, finalOptions);
  }
}

/**
 * Generate JSON export format
 */
function generateJSONExport(
  asset: WireframeAsset,
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  const exported: ExportedWireframe = {
    metadata: {
      name: asset.name,
      description: asset.description,
      category: asset.category,
      type: asset.type,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  if (asset.dimensions) {
    exported.dimensions = asset.dimensions;
  }

  if (options.includeParts && asset.parts) {
    exported.parts = asset.parts;
  }

  if (options.includeAccessories && asset.accessories) {
    exported.accessories = asset.accessories;
  }

  if (options.includeRenderSettings && asset.renderSettings) {
    exported.renderSettings = asset.renderSettings;
  }

  const content = options.prettyPrint 
    ? JSON.stringify(exported, null, 2)
    : JSON.stringify(exported);

  return {
    content,
    filename: `${asset.name.replace(/\s+/g, '_')}.json`,
    mimeType: 'application/json'
  };
}

/**
 * Generate JavaScript module export
 */
function generateJavaScriptExport(
  asset: WireframeAsset,
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  const exported = generateJSONExport(asset, options);
  const jsonContent = JSON.parse(exported.content);
  
  const jsContent = `// ${asset.name} Wireframe Asset
// Generated on ${new Date().toISOString()}

export const wireframeAsset = ${JSON.stringify(jsonContent, null, 2)};

// Three.js Geometry Generator
export function generateGeometry() {
  const group = new THREE.Group();
  
  ${asset.parts && options.includeParts ? generatePartsThreeJSCode(asset.parts) : ''}
  ${asset.accessories && options.includeAccessories ? generateAccessoriesThreeJSCode(asset.accessories) : ''}
  
  return group;
}

// Utility Functions
export function getDimensions() {
  return ${JSON.stringify(asset.dimensions || {})};
}

export function getParts() {
  return ${JSON.stringify(asset.parts || [])};
}

export function getAccessories() {
  return ${JSON.stringify(asset.accessories || [])};
}
`;

  return {
    content: jsContent,
    filename: `${asset.name.replace(/\s+/g, '_')}.js`,
    mimeType: 'application/javascript'
  };
}

/**
 * Generate Three.js specific export
 */
function generateThreeJSExport(
  asset: WireframeAsset,
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  const content = `// Three.js Scene for ${asset.name}
// Generated on ${new Date().toISOString()}

import * as THREE from 'three';

export class ${asset.name.replace(/\s+/g, '')}Wireframe {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      scale: 0.001,
      material: options.material || new THREE.MeshBasicMaterial({
        color: ${asset.renderSettings?.color || 0x4a5568},
        wireframe: ${asset.renderSettings?.showWireframe || true},
        opacity: ${asset.renderSettings?.opacity || 0.8},
        transparent: true
      }),
      ...options
    };
    
    this.group = new THREE.Group();
    this.createGeometry();
  }
  
  createGeometry() {
    const scale = this.options.scale;
    ${asset.dimensions ? `
    const width = ${asset.dimensions.width} * scale;
    const height = ${asset.dimensions.height} * scale;
    const depth = ${asset.dimensions.depth} * scale;
    ` : ''}
    
    ${asset.parts && options.includeParts ? generatePartsThreeJSMethods(asset.parts) : ''}
    ${asset.accessories && options.includeAccessories ? generateAccessoriesThreeJSMethods(asset.accessories) : ''}
    
    this.scene.add(this.group);
  }
  
  dispose() {
    this.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
`;

  return {
    content,
    filename: `${asset.name.replace(/\s+/g, '_')}_threejs.js`,
    mimeType: 'application/javascript'
  };
}

/**
 * Generate OBJ format export
 */
function generateOBJExport(
  asset: WireframeAsset,
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  let objContent = `# ${asset.name} Wireframe
# Generated on ${new Date().toISOString()}

`;
  
  let vertexCount = 1;
  const scale = 0.001; // Convert mm to meters
  
  if (asset.parts && options.includeParts) {
    asset.parts.forEach((part, index) => {
      objContent += `\n# ${part.name}\n`;
      const w = part.dimensions.width * scale;
      const h = part.dimensions.height * scale;
      const t = part.dimensions.thickness * scale;
      
      // Define vertices for a box
      objContent += `v ${-w/2} ${-h/2} ${-t/2}\n`;
      objContent += `v ${w/2} ${-h/2} ${-t/2}\n`;
      objContent += `v ${w/2} ${h/2} ${-t/2}\n`;
      objContent += `v ${-w/2} ${h/2} ${-t/2}\n`;
      objContent += `v ${-w/2} ${-h/2} ${t/2}\n`;
      objContent += `v ${w/2} ${-h/2} ${t/2}\n`;
      objContent += `v ${w/2} ${h/2} ${t/2}\n`;
      objContent += `v ${-w/2} ${h/2} ${t/2}\n`;
      
      // Define faces
      objContent += `f ${vertexCount} ${vertexCount+1} ${vertexCount+2} ${vertexCount+3}\n`;
      objContent += `f ${vertexCount+4} ${vertexCount+7} ${vertexCount+6} ${vertexCount+5}\n`;
      objContent += `f ${vertexCount} ${vertexCount+4} ${vertexCount+5} ${vertexCount+1}\n`;
      objContent += `f ${vertexCount+1} ${vertexCount+5} ${vertexCount+6} ${vertexCount+2}\n`;
      objContent += `f ${vertexCount+2} ${vertexCount+6} ${vertexCount+7} ${vertexCount+3}\n`;
      objContent += `f ${vertexCount+3} ${vertexCount+7} ${vertexCount+4} ${vertexCount}\n`;
      
      vertexCount += 8;
    });
  }

  return {
    content: objContent,
    filename: `${asset.name.replace(/\s+/g, '_')}.obj`,
    mimeType: 'model/obj'
  };
}

/**
 * Generate basic G-code for CNC manufacturing
 */
function generateGCodeExport(
  asset: WireframeAsset,
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  let gcode = `; ${asset.name} CNC Program
; Generated on ${new Date().toISOString()}
; Material: ${asset.parts?.[0]?.material || 'Plywood'}
; Tool: 6mm End Mill
; Feed Rate: 1000 mm/min
; Plunge Rate: 300 mm/min

G21 ; Set units to millimeters
G90 ; Absolute positioning
G94 ; Feed rate per minute

; --- Tool Change ---
T1 M6
S18000 M3 ; Start spindle
G0 Z10 ; Raise tool

`;

  if (asset.parts && options.includeParts) {
    asset.parts.forEach((part, index) => {
      gcode += `
; --- ${part.name} ---
; Dimensions: ${part.dimensions.width}x${part.dimensions.height}x${part.dimensions.thickness}mm
; Material: ${part.material}

; Pocket operation
G0 X0 Y0 ; Move to start position
G1 Z-5 F300 ; Plunge to cutting depth
G1 X${part.dimensions.width} F1000 ; Cut along X
G1 Y${part.dimensions.height} ; Cut along Y
G1 X0 F1000 ; Cut back along X
G1 Y0 F1000 ; Cut back along Y
G0 Z10 ; Retract tool

`;
    });
  }

  gcode += `
; --- Program End ---
G0 Z10 ; Raise tool
M5 ; Stop spindle
M30 ; Program end
`;

  return {
    content: gcode,
    filename: `${asset.name.replace(/\s+/g, '_')}.nc`,
    mimeType: 'text/plain'
  };
}

/**
 * Generate Three.js code for parts
 */
function generatePartsThreeJSCode(parts: CabinetPart[]): string {
  return parts.map((part, index) => {
    const scale = 0.001;
    const w = part.dimensions.width * scale;
    const h = part.dimensions.height * scale;
    const t = part.dimensions.thickness * scale;
    
    return `  // ${part.name}
  const part${index}Geometry = new THREE.BoxGeometry(${w}, ${h}, ${t});
  const part${index}Material = new THREE.MeshBasicMaterial({
    color: ${part.color ? `0x${part.color.replace('#', '')}` : '0x4a5568'},
    wireframe: true,
    opacity: 0.8,
    transparent: true
  });
  const part${index} = new THREE.Mesh(part${index}Geometry, part${index}Material);
  part${index}.position.set(${(part.position?.x || 0) * scale}, ${(part.position?.y || 0) * scale}, ${(part.position?.z || 0) * scale});
  group.add(part${index});`;
  }).join('\n\n');
}

/**
 * Generate ThreeJS methods for parts
 */
function generatePartsThreeJSMethods(parts: CabinetPart[]): string {
  return parts.map((part, index) => {
    const scale = 0.001;
    const w = part.dimensions.width * scale;
    const h = part.dimensions.height * scale;
    const t = part.dimensions.thickness * scale;
    
    return `    // ${part.name}
    const part${index}Geometry = new THREE.BoxGeometry(${w}, ${h}, ${t});
    const part${index} = new THREE.Mesh(part${index}Geometry, this.options.material);
    part${index}.position.set(${(part.position?.x || 0) * scale}, ${(part.position?.y || 0) * scale}, ${(part.position?.z || 0) * scale});
    this.group.add(part${index});`;
  }).join('\n\n');
}

/**
 * Generate Three.js code for accessories
 */
function generateAccessoriesThreeJSCode(accessories: CabinetAccessory[]): string {
  return accessories.map((accessory, index) => {
    const scale = 0.001;
    const w = accessory.dimensions.width * scale;
    const h = accessory.dimensions.height * scale;
    const d = accessory.dimensions.depth * scale;
    
    return `  // ${accessory.name}
  const acc${index}Geometry = new THREE.BoxGeometry(${w}, ${h}, ${d});
  const acc${index}Material = new THREE.MeshBasicMaterial({
    color: ${accessory.color ? `0x${accessory.color.replace('#', '')}` : '0xc0c0c0'},
    wireframe: true,
    opacity: 0.8,
    transparent: true
  });
  const acc${index} = new THREE.Mesh(acc${index}Geometry, acc${index}Material);
  acc${index}.position.set(${(accessory.position.x) * scale}, ${(accessory.position.y) * scale}, ${(accessory.position.z) * scale});
  group.add(acc${index});`;
  }).join('\n\n');
}

/**
 * Generate ThreeJS methods for accessories
 */
function generateAccessoriesThreeJSMethods(accessories: CabinetAccessory[]): string {
  return accessories.map((accessory, index) => {
    const scale = 0.001;
    const w = accessory.dimensions.width * scale;
    const h = accessory.dimensions.height * scale;
    const d = accessory.dimensions.depth * scale;
    
    return `    // ${accessory.name}
    const acc${index}Geometry = new THREE.BoxGeometry(${w}, ${h}, ${d});
    const acc${index} = new THREE.Mesh(acc${index}Geometry, this.options.material);
    acc${index}.position.set(${(accessory.position.x) * scale}, ${(accessory.position.y) * scale}, ${(accessory.position.z) * scale});
    this.group.add(acc${index});`;
  }).join('\n\n');
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export multiple assets as a bundle
 */
export function exportAssetBundle(
  assets: WireframeAsset[],
  options: Partial<ExportOptions> = {}
): { content: string; filename: string; mimeType: string } {
  const bundle = {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      assetCount: assets.length
    },
    assets: assets.map(asset => {
      const exported = generateWireframeExport(asset, options);
      return JSON.parse(exported.content);
    })
  };

  const content = JSON.stringify(bundle, null, 2);
  
  return {
    content,
    filename: `wireframe_bundle_${Date.now()}.json`,
    mimeType: 'application/json'
  };
}
