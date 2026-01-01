
// ============================================================================
// BASE TYPES - Core fundamental types for all logic
// ============================================================================

export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBox {
  min: Point2D;
  max: Point2D;
}

export type Status = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'running' | 'done' | 'finished' | 'error';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Tolerance {
  dimension: string;
  nominal: number;
  plus: number;
  minus: number;
  unit: 'mm' | 'in' | 'cm';
  critical: boolean;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  cost?: number;
  supplier?: string;
}

export interface CabinetDimensions {
  width: number;
  height: number;
  depth: number;
}

export type CabinetWidth = 300 | 450 | 600 | 900 | 1200;
export type CabinetDepth = 300 | 350 | 400 | 450 | 600;
export type CabinetHeight = 720 | 900 | 1200 | 1500 | 2100;
