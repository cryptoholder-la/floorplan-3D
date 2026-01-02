export interface HardwareItem {
  id: string;
  name: string;
  type: string;
  specifications: Record<string, any>;
  price?: number;
  manufacturer?: string;
}

export interface DrillingPattern {
  id: string;
  name: string;
  spacing: number;
  holeDiameter: number;
  edgeDistance: number;
  description: string;
  standard: string;
}

export const hardwareStore = {
  hardware: [] as HardwareItem[],
  patterns: [] as DrillingPattern[],
  
  getHardwareById(id: string): HardwareItem | undefined {
    return this.hardware.find(item => item.id === id);
  },
  
  getPatternById(id: string): DrillingPattern | undefined {
    return this.patterns.find(pattern => pattern.id === id);
  },
  
  getAllHardware(): HardwareItem[] {
    return this.hardware;
  },
  
  getAllPatterns(): DrillingPattern[] {
    return this.patterns;
  }
};