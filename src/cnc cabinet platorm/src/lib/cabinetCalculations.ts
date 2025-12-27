import { CabinetDesign, CutListItem, NestingSheet, NestingPart, CostBreakdown, PricingConfig } from './cabinetTypes';

const SHEET_WIDTH = 2440;
const SHEET_HEIGHT = 1220;
const SAW_KERF = 3;

export function generateCutList(design: CabinetDesign): CutListItem[] {
  const { dimensions, doorCount, shelfCount, includeBack, material } = design;
  const { width, height, depth, thickness } = dimensions;
  
  const cutList: CutListItem[] = [];

  // Cabinet sides (2)
  cutList.push({
    id: 'sides',
    name: 'Cabinet Sides',
    width: depth,
    height: height,
    thickness,
    quantity: 2,
    material,
    edgeBanding: ['front']
  });

  // Top and Bottom (2)
  cutList.push({
    id: 'top-bottom',
    name: 'Top & Bottom',
    width: width - (thickness * 2),
    height: depth,
    thickness,
    quantity: 2,
    material,
    edgeBanding: ['front']
  });

  // Back panel (1)
  if (includeBack) {
    cutList.push({
      id: 'back',
      name: 'Back Panel',
      width: width - (thickness * 2),
      height: height - (thickness * 2),
      thickness: thickness / 2,
      quantity: 1,
      material,
      edgeBanding: []
    });
  }

  // Shelves
  if (shelfCount > 0) {
    cutList.push({
      id: 'shelves',
      name: 'Adjustable Shelves',
      width: width - (thickness * 2) - 4,
      height: depth - 4,
      thickness,
      quantity: shelfCount,
      material,
      edgeBanding: ['front']
    });
  }

  // Doors
  if (doorCount > 0) {
    const doorWidth = (width / doorCount) - (design.style === 'euro' ? 4 : 6);
    const doorHeight = height - (design.style === 'inset' ? 4 : 8);
    
    cutList.push({
      id: 'doors',
      name: 'Cabinet Doors',
      width: doorWidth,
      height: doorHeight,
      thickness,
      quantity: doorCount,
      material,
      edgeBanding: ['all']
    });
  }

  return cutList;
}

export function optimizeNesting(cutList: CutListItem[]): NestingSheet[] {
  const sheets: NestingSheet[] = [];
  const parts: NestingPart[] = [];

  // Expand cut list items into individual parts
  cutList.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      parts.push({
        id: `${item.id}-${i}`,
        x: 0,
        y: 0,
        width: item.width,
        height: item.height,
        rotation: 0,
        name: item.name
      });
    }
  });

  // Simple nesting algorithm - first fit decreasing
  parts.sort((a, b) => (b.width * b.height) - (a.width * a.height));

  let currentSheet: NestingSheet = {
    id: `sheet-${sheets.length + 1}`,
    width: SHEET_WIDTH,
    height: SHEET_HEIGHT,
    parts: [],
    wastePercentage: 0
  };

  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;

  parts.forEach(part => {
    // Try to fit in current position
    if (currentX + part.width + SAW_KERF <= SHEET_WIDTH) {
      part.x = currentX;
      part.y = currentY;
      currentSheet.parts.push(part);
      currentX += part.width + SAW_KERF;
      rowHeight = Math.max(rowHeight, part.height);
    } else {
      // Move to next row
      currentX = 0;
      currentY += rowHeight + SAW_KERF;
      rowHeight = 0;

      if (currentY + part.height + SAW_KERF <= SHEET_HEIGHT) {
        part.x = currentX;
        part.y = currentY;
        currentSheet.parts.push(part);
        currentX += part.width + SAW_KERF;
        rowHeight = part.height;
      } else {
        // Start new sheet
        currentSheet.wastePercentage = calculateWaste(currentSheet);
        sheets.push(currentSheet);
        
        currentSheet = {
          id: `sheet-${sheets.length + 1}`,
          width: SHEET_WIDTH,
          height: SHEET_HEIGHT,
          parts: [],
          wastePercentage: 0
        };
        
        currentX = 0;
        currentY = 0;
        rowHeight = 0;
        
        part.x = currentX;
        part.y = currentY;
        currentSheet.parts.push(part);
        currentX += part.width + SAW_KERF;
        rowHeight = part.height;
      }
    }
  });

  if (currentSheet.parts.length > 0) {
    currentSheet.wastePercentage = calculateWaste(currentSheet);
    sheets.push(currentSheet);
  }

  return sheets;
}

function calculateWaste(sheet: NestingSheet): number {
  const totalSheetArea = sheet.width * sheet.height;
  const usedArea = sheet.parts.reduce((sum, part) => sum + (part.width * part.height), 0);
  return ((totalSheetArea - usedArea) / totalSheetArea) * 100;
}

export function calculateCost(
  cutList: CutListItem[],
  nestingSheets: NestingSheet[],
  pricing: PricingConfig,
  doorCount: number
): CostBreakdown {
  const sheetArea = (SHEET_WIDTH * SHEET_HEIGHT) / 1000000; // Convert to square meters
  const materialCost = nestingSheets.length * sheetArea * pricing.pricePerSquareMeter;
  
  const hardwareCost = (doorCount * 2 * pricing.hingePrice) + (doorCount * pricing.handlePrice);
  
  const totalWaste = nestingSheets.reduce((sum, sheet) => sum + sheet.wastePercentage, 0) / nestingSheets.length;

  return {
    materialCost,
    hardwareCost,
    totalCost: materialCost + hardwareCost,
    sheetCount: nestingSheets.length,
    wastePercentage: totalWaste
  };
}

export function exportCutListToCSV(cutList: CutListItem[]): string {
  const headers = ['Part Name', 'Width (mm)', 'Height (mm)', 'Thickness (mm)', 'Quantity', 'Material', 'Edge Banding'];
  const rows = cutList.map(item => [
    item.name,
    item.width.toString(),
    item.height.toString(),
    item.thickness.toString(),
    item.quantity.toString(),
    item.material,
    item.edgeBanding.join(', ')
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}