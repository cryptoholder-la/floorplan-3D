// Migrated 10_10 Design System Main Logic
// This file contains the core functionality from the original main.js

export interface AgentTask {
  id: string;
  type: string;
  agent: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  duration?: number;
  timestamp: number;
  payload?: any;
}

export interface CabinetItem {
  id: string;
  type: string;
  width: number;
  height: number;
  depth: number;
  material: string;
  style: string;
  position?: [number, number, number];
  rotation?: number;
}

export interface FloorplanData {
  walls: Array<{
    id: string;
    start: { x: number; y: number };
    end: { x: number; y: number };
    height: number;
    thickness: number;
  }>;
  rooms: Array<{
    id: string;
    name: string;
    points: Array<{ x: number; y: number }>;
    color: string;
  }>;
  openings: Array<{
    id: string;
    type: 'door' | 'window';
    position: { x: number; y: number };
    width: number;
    height: number;
  }>;
}

// Agent System (Simplified version of the original)
export class AgentSystem {
  private queue: AgentTask[] = [];
  private history: AgentTask[] = [];
  private listeners: ((tasks: AgentTask[]) => void)[] = [];

  addTask(task: Omit<AgentTask, 'id' | 'timestamp' | 'status'>): void {
    const newTask: AgentTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'queued'
    };

    this.queue.push(newTask);
    this.notifyListeners();
    
    // Simulate task processing
    setTimeout(() => {
      this.processTask(newTask);
    }, Math.random() * 2000 + 500);
  }

  private processTask(task: AgentTask): void {
    task.status = 'running';
    this.notifyListeners();

    const processingTime = Math.random() * 1500 + 300;
    
    setTimeout(() => {
      task.status = Math.random() > 0.1 ? 'completed' : 'failed';
      task.duration = processingTime;
      
      // Move from queue to history
      this.queue = this.queue.filter(t => t.id !== task.id);
      this.history.push(task);
      
      this.notifyListeners();
    }, processingTime);
  }

  getQueue(): AgentTask[] {
    return [...this.queue];
  }

  getHistory(): AgentTask[] {
    return [...this.history];
  }

  getActiveTasks(): AgentTask[] {
    return this.queue.filter(t => t.status === 'running');
  }

  subscribe(listener: (tasks: AgentTask[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const allTasks = [...this.queue, ...this.history];
    this.listeners.forEach(listener => listener(allTasks));
  }

  log(message: string): void {
    console.log(`[AgentSystem] ${message}`);
  }

  dumpLog(): string {
    return this.history.map(t => `${t.type} (${t.agent}): ${t.status}`).join('\n');
  }
}

// Cabinet Management System
export class CabinetManager {
  private cabinets: CabinetItem[] = [];
  private templates: Map<string, Partial<CabinetItem>> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Standard cabinet templates from 10_10 system
    this.templates.set('Base_D24_Standard', {
      type: 'base',
      width: 610,
      height: 720,
      depth: 305,
      material: 'Plywood',
      style: 'Shaker'
    });

    this.templates.set('Wall_H30_D12_Standard', {
      type: 'wall',
      width: 610,
      height: 350,
      depth: 305,
      material: 'Plywood',
      style: 'Shaker'
    });

    this.templates.set('Tall_Pantry_H84_D24_Standard', {
      type: 'tall',
      width: 610,
      height: 2134,
      depth: 305,
      material: 'Plywood',
      style: 'Shaker'
    });

    this.templates.set('SinkBase_D24_Standard', {
      type: 'base',
      width: 914,
      height: 720,
      depth: 305,
      material: 'Plywood',
      style: 'Shaker'
    });
  }

  createCabinet(templateId: string, overrides: Partial<CabinetItem> = {}): CabinetItem {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Unknown cabinet template: ${templateId}`);
    }

    const cabinet: CabinetItem = {
      id: `cabinet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: template.type || 'base',
      width: template.width || 610,
      height: template.height || 720,
      depth: template.depth || 305,
      material: template.material || 'Plywood',
      style: template.style || 'Shaker',
      ...overrides
    };

    this.cabinets.push(cabinet);
    return cabinet;
  }

  getCabinets(): CabinetItem[] {
    return [...this.cabinets];
  }

  removeCabinet(id: string): boolean {
    const index = this.cabinets.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cabinets.splice(index, 1);
      return true;
    }
    return false;
  }

  updateCabinet(id: string, updates: Partial<CabinetItem>): boolean {
    const cabinet = this.cabinets.find(c => c.id === id);
    if (cabinet) {
      Object.assign(cabinet, updates);
      return true;
    }
    return false;
  }

  getTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}

// Floorplan Scanner System
export class FloorplanScanner {
  async scanFromImage(imageData: File): Promise<FloorplanData> {
    // Simulate AI scanning process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock floorplan data
        const mockFloorplan: FloorplanData = {
          walls: [
            {
              id: 'wall1',
              start: { x: 0, y: 0 },
              end: { x: 6000, y: 0 },
              height: 2400,
              thickness: 120
            },
            {
              id: 'wall2',
              start: { x: 6000, y: 0 },
              end: { x: 6000, y: 4000 },
              height: 2400,
              thickness: 120
            },
            {
              id: 'wall3',
              start: { x: 6000, y: 4000 },
              end: { x: 0, y: 4000 },
              height: 2400,
              thickness: 120
            },
            {
              id: 'wall4',
              start: { x: 0, y: 4000 },
              end: { x: 0, y: 0 },
              height: 2400,
              thickness: 120
            }
          ],
          rooms: [
            {
              id: 'room1',
              name: 'Kitchen',
              points: [
                { x: 100, y: 100 },
                { x: 5900, y: 100 },
                { x: 5900, y: 3900 },
                { x: 100, y: 3900 }
              ],
              color: '#e3f2fd'
            }
          ],
          openings: [
            {
              id: 'door1',
              type: 'door',
              position: { x: 3000, y: 100 },
              width: 900,
              height: 2000
            }
          ]
        };

        resolve(mockFloorplan);
      }, 2000);
    });
  }
}

// NKBA Compliance Checker
export class NKBAComplianceChecker {
  checkDesign(cabinets: CabinetItem[], floorplan: FloorplanData): {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check clearance requirements
    cabinets.forEach(cabinet => {
      if (cabinet.type === 'base') {
        // Check work triangle compliance
        const otherBaseCabinets = cabinets.filter(c => c.type === 'base' && c.id !== cabinet.id);
        if (otherBaseCabinets.length > 0) {
          // Simplified distance check
          recommendations.push('Verify work triangle distances between key appliances');
        }
      }
    });

    // Check landing areas
    const hasLandingAreas = floorplan.rooms.some(room => 
      room.name.toLowerCase().includes('kitchen') && 
      this.hasAdequateLandingArea(room, cabinets)
    );

    if (!hasLandingAreas) {
      issues.push('Insufficient landing areas near appliances');
      recommendations.push('Add at least 15" landing area next to refrigerator and cooking areas');
    }

    return {
      compliant: issues.length === 0,
      issues,
      recommendations
    };
  }

  private hasAdequateLandingArea(room: any, cabinets: CabinetItem[]): boolean {
    // Simplified landing area check
    return true; // Placeholder for actual implementation
  }
}

// CNC Cutlist Generator
export class CNCGenerator {
  generateCutlist(cabinets: CabinetItem[]): {
    parts: Array<{
      id: string;
      name: string;
      material: string;
      dimensions: { width: number; height: number; thickness: number };
      quantity: number;
      operations: string[];
    }>;
    totalMaterial: number;
    estimatedTime: number;
  } {
    const parts: any[] = [];

    cabinets.forEach(cabinet => {
      // Generate parts for each cabinet
      const cabinetParts = this.generateCabinetParts(cabinet);
      parts.push(...cabinetParts);
    });

    return {
      parts,
      totalMaterial: parts.reduce((sum, part) => sum + (part.dimensions.width * part.dimensions.height * part.dimensions.thickness * part.quantity), 0),
      estimatedTime: parts.length * 15 // 15 minutes per part
    };
  }

  private generateCabinetParts(cabinet: CabinetItem): any[] {
    const parts = [];
    
    // Side panels
    parts.push({
      id: `${cabinet.id}_side_left`,
      name: 'Left Side Panel',
      material: cabinet.material,
      dimensions: { width: cabinet.depth, height: cabinet.height, thickness: 18 },
      quantity: 1,
      operations: ['cut', 'drill', 'edgeband']
    });

    parts.push({
      id: `${cabinet.id}_side_right`,
      name: 'Right Side Panel',
      material: cabinet.material,
      dimensions: { width: cabinet.depth, height: cabinet.height, thickness: 18 },
      quantity: 1,
      operations: ['cut', 'drill', 'edgeband']
    });

    // Back panel
    parts.push({
      id: `${cabinet.id}_back`,
      name: 'Back Panel',
      material: cabinet.material,
      dimensions: { width: cabinet.width - 32, height: cabinet.height - 32, thickness: 6 },
      quantity: 1,
      operations: ['cut', 'drill']
    });

    // Bottom panel
    parts.push({
      id: `${cabinet.id}_bottom`,
      name: 'Bottom Panel',
      material: cabinet.material,
      dimensions: { width: cabinet.width - 36, height: cabinet.depth - 18, thickness: 18 },
      quantity: 1,
      operations: ['cut', 'drill', 'edgeband']
    });

    // Top panel (for wall cabinets)
    if (cabinet.type === 'wall') {
      parts.push({
        id: `${cabinet.id}_top`,
        name: 'Top Panel',
        material: cabinet.material,
        dimensions: { width: cabinet.width - 36, height: cabinet.depth - 18, thickness: 18 },
        quantity: 1,
        operations: ['cut', 'drill', 'edgeband']
      });
    }

    return parts;
  }
}

// Main 10_10 System Export
export class TenTenSystem {
  private agentSystem: AgentSystem;
  private cabinetManager: CabinetManager;
  private floorplanScanner: FloorplanScanner;
  private nkbaChecker: NKBAComplianceChecker;
  private cncGenerator: CNCGenerator;

  constructor() {
    this.agentSystem = new AgentSystem();
    this.cabinetManager = new CabinetManager();
    this.floorplanScanner = new FloorplanScanner();
    this.nkbaChecker = new NKBAComplianceChecker();
    this.cncGenerator = new CNCGenerator();
  }

  get agents() {
    return this.agentSystem;
  }

  get cabinets() {
    return this.cabinetManager;
  }

  get scanner() {
    return this.floorplanScanner;
  }

  get compliance() {
    return this.nkbaChecker;
  }

  get cnc() {
    return this.cncGenerator;
  }

  // Initialize the system
  init(): void {
    console.log('🚀 10_10 Design System initialized');
    this.agentSystem.log('System boot complete');
  }
}

// Global instance
export const tenTenSystem = new TenTenSystem();
