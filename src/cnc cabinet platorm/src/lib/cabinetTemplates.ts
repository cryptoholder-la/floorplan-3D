import { CabinetTemplate } from './cabinetTypes';
import catsData from './cats_cabinet_templates.json';

interface CatsUnit {
  name: string;
  height: number;
  doors: number;
  drawers: number;
  pull_outs?: number;
  style: string;
  type: string;
}

// Convert CATS data to our template format
const convertCatsToTemplate = (catsUnit: CatsUnit, index: number): CabinetTemplate => {
  // Calculate dimensions based on height units (1U ≈ 100mm)
  const heightMM = catsUnit.height * 100;
  
  // Standard widths based on door/drawer configuration
  let widthMM = 600; // default
  if (catsUnit.doors === 2 || catsUnit.drawers >= 3) widthMM = 800;
  if (catsUnit.doors === 3 || catsUnit.drawers >= 4) widthMM = 1000;
  if (catsUnit.doors >= 4) widthMM = 1200;
  
  // Depth based on type
  let depthMM = 600; // base units
  if (catsUnit.type === 'wall') depthMM = 350;
  if (catsUnit.type === 'tall') depthMM = 600;
  if (catsUnit.style === 'shallow') depthMM = 400;
  
  // Map to our template structure
  const style = catsUnit.type === 'base' ? 'euro' : 'euro';
  const thickness = 18;
  
  return {
    id: `cats-${catsUnit.type}-${index}`,
    name: catsUnit.name,
    type: catsUnit.type as 'base' | 'wall' | 'tall',
    style: style as 'euro' | 'inset' | 'faceframe',
    dimensions: {
      width: widthMM,
      height: heightMM,
      depth: depthMM,
      thickness: thickness
    },
    doorCount: catsUnit.doors || 0,
    shelfCount: catsUnit.type === 'wall' ? 2 : 1
  };
};

// Generate templates from CATS data - limit to most common configurations
const catsBaseTemplates = (catsData.base_units as CatsUnit[])
  .filter(u => u.height >= 3 && u.height <= 6) // Standard heights only
  .filter(u => u.style === 'standard' || u.style === 'sink' || u.style === 'corner')
  .slice(0, 20) // Limit to 20 most relevant
  .map((unit, idx) => convertCatsToTemplate(unit, idx));

const catsTallTemplates = (catsData.tall_units as CatsUnit[])
  .filter(u => u.height >= 13 && u.height <= 16)
  .filter(u => u.style === 'standard' || u.style === 'broom')
  .slice(0, 15)
  .map((unit, idx) => convertCatsToTemplate(unit, idx + 100));

const catsWallTemplates = (catsData.wall_units as CatsUnit[])
  .filter(u => u.height >= 5 && u.height <= 7)
  .slice(0, 10)
  .map((unit, idx) => convertCatsToTemplate(unit, idx + 200));

// Original curated templates for common use cases
export const CABINET_TEMPLATES: CabinetTemplate[] = [
  // Base Cabinets - Euro Style
  {
    id: 'euro-base-600',
    name: 'Euro Base 600mm',
    type: 'base',
    style: 'euro',
    dimensions: { width: 600, height: 720, depth: 560, thickness: 18 },
    doorCount: 1,
    shelfCount: 1
  },
  {
    id: 'euro-base-800',
    name: 'Euro Base 800mm',
    type: 'base',
    style: 'euro',
    dimensions: { width: 800, height: 720, depth: 560, thickness: 18 },
    doorCount: 2,
    shelfCount: 1
  },
  {
    id: 'euro-base-900',
    name: 'Euro Base 900mm',
    type: 'base',
    style: 'euro',
    dimensions: { width: 900, height: 720, depth: 560, thickness: 18 },
    doorCount: 2,
    shelfCount: 1
  },
  
  // Wall Cabinets - Euro Style
  {
    id: 'euro-wall-300',
    name: 'Euro Wall 300mm',
    type: 'wall',
    style: 'euro',
    dimensions: { width: 300, height: 720, depth: 320, thickness: 18 },
    doorCount: 1,
    shelfCount: 2
  },
  {
    id: 'euro-wall-600',
    name: 'Euro Wall 600mm',
    type: 'wall',
    style: 'euro',
    dimensions: { width: 600, height: 720, depth: 320, thickness: 18 },
    doorCount: 2,
    shelfCount: 2
  },
  {
    id: 'euro-wall-800',
    name: 'Euro Wall 800mm',
    type: 'wall',
    style: 'euro',
    dimensions: { width: 800, height: 720, depth: 320, thickness: 18 },
    doorCount: 2,
    shelfCount: 2
  },

  // Inset Style Cabinets
  {
    id: 'inset-base-600',
    name: 'Inset Base 600mm',
    type: 'base',
    style: 'inset',
    dimensions: { width: 600, height: 720, depth: 560, thickness: 19 },
    doorCount: 1,
    shelfCount: 1
  },
  {
    id: 'inset-base-800',
    name: 'Inset Base 800mm',
    type: 'base',
    style: 'inset',
    dimensions: { width: 800, height: 720, depth: 560, thickness: 19 },
    doorCount: 2,
    shelfCount: 1
  },

  // Face Frame Style Cabinets
  {
    id: 'faceframe-base-600',
    name: 'Face Frame Base 600mm',
    type: 'base',
    style: 'faceframe',
    dimensions: { width: 600, height: 720, depth: 560, thickness: 19 },
    doorCount: 1,
    shelfCount: 1
  },
  {
    id: 'faceframe-base-800',
    name: 'Face Frame Base 800mm',
    type: 'base',
    style: 'faceframe',
    dimensions: { width: 800, height: 720, depth: 560, thickness: 19 },
    doorCount: 2,
    shelfCount: 1
  },

  // Tall Cabinets
  {
    id: 'euro-tall-600',
    name: 'Euro Tall 600mm',
    type: 'tall',
    style: 'euro',
    dimensions: { width: 600, height: 2100, depth: 560, thickness: 18 },
    doorCount: 2,
    shelfCount: 4
  },

  // Add CATS templates
  ...catsBaseTemplates,
  ...catsTallTemplates,
  ...catsWallTemplates
];