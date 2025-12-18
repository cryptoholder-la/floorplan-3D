import { Material } from './inventory.types';

export interface CutlistItem {
  id: string;
  partName: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  materialId: string;
  material?: Material;
  edgeBanding: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  grainDirection?: 'horizontal' | 'vertical' | 'none';
  notes?: string;
  cabinetId?: string;
  cabinetName?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'cut' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Cutlist {
  id: string;
  name: string;
  projectName?: string;
  items: CutlistItem[];
  totalSheets: number;
  totalCost: number;
  wastePercentage: number;
  status: 'draft' | 'approved' | 'in_production' | 'completed';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    clientName?: string;
    jobNumber?: string;
    dueDate?: string;
    notes?: string;
  };
}

export interface CutlistSummary {
  totalParts: number;
  totalQuantity: number;
  materialBreakdown: {
    materialId: string;
    materialName: string;
    totalArea: number;
    sheetsNeeded: number;
    cost: number;
  }[];
  edgeBandingRequired: {
    linear: number;
    perimeter: number;
  };
}

export interface SheetOptimization {
  sheetId: string;
  material: Material;
  width: number;
  height: number;
  placements: PlacedPart[];
  efficiency: number;
  wasteArea: number;
  utilized: number;
}

export interface PlacedPart {
  cutlistItemId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  partName: string;
}

export interface CutlistFilters {
  materialType?: string;
  cabinetId?: string;
  status?: CutlistItem['status'];
  priority?: CutlistItem['priority'];
  search?: string;
}

export interface CutlistExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeDrawings?: boolean;
  includeMaterials?: boolean;
  includeOptimization?: boolean;
}
