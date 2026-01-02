// ============================================================================
// CENTRALIZED TYPE SYSTEM - Complete type definitions
// ============================================================================

// Base entity interface
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// React component props interface
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

// Catalog item interface
export interface CatalogItem extends BaseEntity {
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  cost?: number;
  qty?: number;
  parts?: any[];
  attachments?: any[];
}

// Re-export all types for easy importing
export * from './base.types';
export { CabinetHeight } from './domain/cabinet.types';
export { sortBy } from "@/lib/utils/array";
export * from './geometry.types';
export * from './cabinet.types';
export * from './cnc.types';
export * from './floorplan.types';
export * from './manufacturing.types';
export * from './master.types';
export * from './unified.types';
