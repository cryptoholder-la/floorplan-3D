export interface Material {
  id: string;
  name: string;
  type: 'plywood' | 'mdf' | 'hardwood' | 'particle_board' | 'melamine' | 'other';
  thickness: number;
  width: number;
  height: number;
  color: string;
  pricePerSheet: number;
  grain?: 'horizontal' | 'vertical' | 'none';
  supplier?: string;
  sku?: string;
  category?: string;
  finish?: string;
  core?: string;
  grade?: string;
  inStock: boolean;
  stockQuantity: number;
  minStockLevel?: number;
  reorderPoint?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  type: 'material' | 'hardware' | 'edge_banding' | 'finish' | 'tool' | 'consumable';
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  unitOfMeasure: 'sheet' | 'piece' | 'linear_foot' | 'square_foot' | 'box' | 'gallon' | 'each';
  quantity: number;
  minQuantity?: number;
  reorderQuantity?: number;
  costPerUnit: number;
  pricePerUnit?: number;
  supplier?: string;
  supplierPartNumber?: string;
  location?: string;
  bin?: string;
  aisle?: string;
  imageUrl?: string;
  specifications?: Record<string, any>;
  inStock: boolean;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hardware extends InventoryItem {
  type: 'hardware';
  hardwareType: 'hinge' | 'slide' | 'handle' | 'knob' | 'connector' | 'screw' | 'dowel' | 'cam' | 'bracket' | 'other';
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
  };
  material?: string;
  finish?: string;
  weight?: number;
  packSize?: number;
}

export interface EdgeBanding extends InventoryItem {
  type: 'edge_banding';
  thickness: number;
  width: number;
  rollLength: number;
  color: string;
  adhesiveType: 'hot_melt' | 'pressure_sensitive' | 'iron_on';
  materialType: 'pvc' | 'abs' | 'wood_veneer' | 'melamine' | 'acrylic';
}

export interface FinishProduct extends InventoryItem {
  type: 'finish';
  finishType: 'stain' | 'paint' | 'lacquer' | 'varnish' | 'oil' | 'wax' | 'other';
  color?: string;
  sheen?: 'flat' | 'satin' | 'semi_gloss' | 'gloss' | 'high_gloss';
  coverage?: number;
  dryTime?: number;
  recoatTime?: number;
  application?: 'spray' | 'brush' | 'wipe' | 'roller';
}

export interface Tool extends InventoryItem {
  type: 'tool';
  toolType: 'drill_bit' | 'saw_blade' | 'router_bit' | 'sanding' | 'clamp' | 'measuring' | 'power_tool' | 'hand_tool' | 'other';
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition?: 'new' | 'good' | 'fair' | 'needs_maintenance' | 'retired';
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
  calibrationDate?: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'purchase' | 'use' | 'return' | 'adjustment' | 'waste' | 'transfer';
  quantityChange: number;
  quantityAfter: number;
  cost?: number;
  reason?: string;
  reference?: string;
  performedBy?: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryFilters {
  type?: InventoryItem['type'];
  category?: string;
  inStock?: boolean;
  lowStock?: boolean;
  supplier?: string;
  location?: string;
  search?: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: {
    category: string;
    count: number;
    value: number;
  }[];
  recentActivity: InventoryTransaction[];
}
