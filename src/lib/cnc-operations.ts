// CNC Operations Library for Floorplan 3D

import { ManufacturingJob, MachineSettings, ToolRequirement, QualityCheck } from '@/types';
import { CutListItem } from '@/types';
import { CNCOperation, CNCTool, DrillSettings } from '@/types';
import { Tolerance } from '@/types';
import { Priority } from '@/types';

// Standard CNC tools
export const STANDARD_CNC_TOOLS: CNCTool[] = [
  {
    id: 'drill-1-4',
    name: '1/4" Drill Bit',
    type: 'drill-bit',
    diameter: 6.35,
    length: 50,
    shankDiameter: 6.35,
    coating: 'hss',
    material: 'hss',
    maxSpindleSpeed: 3000,
    maxFeedRate: 500,
    recommendedCutDepth: 25,
    status: 'available',
    maxLife: 20,
    currentLife: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'drill-3-8',
    name: '3/8" Drill Bit',
    type: 'drill-bit',
    diameter: 9.525,
    length: 60,
    shankDiameter: 9.525,
    coating: 'hss',
    material: 'hss',
    maxSpindleSpeed: 2500,
    maxFeedRate: 400,
    recommendedCutDepth: 30,
    status: 'available',
    maxLife: 20,
    currentLife: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'endmill-1-2',
    name: '1/2" End Mill',
    type: 'end-mill',
    diameter: 12.7,
    length: 75,
    shankDiameter: 12.7,
    fluteCount: 4,
    coating: 'carbide',
    material: 'carbide',
    maxSpindleSpeed: 18000,
    maxFeedRate: 2000,
    recommendedCutDepth: 6,
    status: 'available',
    maxLife: 40,
    currentLife: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'endmill-1-4',
    name: '1/4" End Mill',
    type: 'end-mill',
    diameter: 6.35,
    length: 50,
    shankDiameter: 6.35,
    fluteCount: 2,
    coating: 'carbide',
    material: 'carbide',
    maxSpindleSpeed: 24000,
    maxFeedRate: 1500,
    recommendedCutDepth: 3,
    status: 'available',
    maxLife: 30,
    currentLife: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Standard machine settings for different operations
export const STANDARD_MACHINE_SETTINGS: Record<string, MachineSettings> = {
  'drill-1-4': {
    machineType: 'cnc-router',
    spindleSpeed: 3000,
    feedRate: 300,
    depthOfCut: 25,
    toolNumber: 1,
    workOffset: { x: 0, y: 0, z: 0 },
    coolant: 'off'
  },
  'drill-3-8': {
    machineType: 'cnc-router',
    spindleSpeed: 2500,
    feedRate: 250,
    depthOfCut: 30,
    toolNumber: 2,
    workOffset: { x: 0, y: 0, z: 0 },
    coolant: 'mist'
  },
  'cut-1-2': {
    machineType: 'cnc-router',
    spindleSpeed: 18000,
    feedRate: 1500,
    depthOfCut: 6,
    passDepth: 3,
    toolNumber: 3,
    workOffset: { x: 0, y: 0, z: 0 },
    coolant: 'mist'
  },
  'cut-1-4': {
    machineType: 'cnc-router',
    spindleSpeed: 24000,
    feedRate: 1200,
    depthOfCut: 3,
    passDepth: 1.5,
    toolNumber: 4,
    workOffset: { x: 0, y: 0, z: 0 },
    coolant: 'off'
  }
};

// Standard quality checks
export const STANDARD_QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'hole-diameter',
    name: 'Hole Diameter Check',
    type: 'dimensional',
    specification: 'Hole diameter within tolerance',
    tolerance: {
      dimension: 'diameter',
      nominal: 6.35,
      plus: 0.1,
      minus: 0.1,
      unit: 'mm',
      critical: true
    },
    method: 'automated',
    required: true
  },
  {
    id: 'hole-depth',
    name: 'Hole Depth Check',
    type: 'dimensional',
    specification: 'Hole depth within tolerance',
    tolerance: {
      dimension: 'depth',
      nominal: 25,
      plus: 1,
      minus: 1,
      unit: 'mm',
      critical: false
    },
    method: 'manual',
    required: true
  },
  {
    id: 'edge-quality',
    name: 'Edge Quality Check',
    type: 'visual',
    specification: 'No burrs, clean edges',
    tolerance: {
      dimension: 'visual',
      nominal: 0,
      plus: 0,
      minus: 0,
      unit: 'mm',
      critical: false
    },
    method: 'visual-inspection',
    required: true
  },
  {
    id: 'dimensional-accuracy',
    name: 'Overall Dimensional Accuracy',
    type: 'dimensional',
    specification: 'Part dimensions within ±0.5mm',
    tolerance: {
      dimension: 'overall',
      nominal: 0,
      plus: 0.5,
      minus: 0.5,
      unit: 'mm',
      critical: true
    },
    method: 'automated',
    required: true
  }
];

/**
 * Generate manufacturing jobs from a cut list
 */
export function generateJobsForCabinet(cutList: CutListItem[]): ManufacturingJob[] {
  const jobs: ManufacturingJob[] = [];
  
  // Group cut list items by material and operation type
  const groupedItems = groupCutListItems(cutList);
  
  // Generate jobs for each group
  Object.entries(groupedItems).forEach(([key, items]) => {
    const [materialId, thickness] = key.split('-');
    
    // Generate drilling jobs
    const drillingJobs = generateDrillingJobs(items, materialId, thickness);
    jobs.push(...drillingJobs);
    
    // Generate cutting jobs
    const cuttingJobs = generateCuttingJobs(items, materialId, thickness);
    jobs.push(...cuttingJobs);
    
    // Generate edge banding jobs if needed
    const edgeBandingJobs = generateEdgeBandingJobs(items, materialId, thickness);
    jobs.push(...edgeBandingJobs);
  });
  
  // Sort jobs by priority and estimated time
  return jobs.sort((a, b) => {
    const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return a.estimatedTime - b.estimatedTime;
  });
}

/**
 * Group cut list items by material and thickness
 */
function groupCutListItems(cutList: CutListItem[]): Record<string, CutListItem[]> {
  return cutList.reduce((groups, item) => {
    const key = `${item.material.id}-${item.thickness}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, CutListItem[]>);
}

/**
 * Generate drilling operations for cabinet hardware
 */
function generateDrillingJobs(items: CutListItem[], materialId: string, thickness: string): ManufacturingJob[] {
  const jobs: ManufacturingJob[] = [];
  
  // Standard drilling patterns for cabinet hardware
  const drillingPatterns = [
    {
      name: 'Shelf Pin Holes',
      description: 'Drill shelf pin holes for adjustable shelves',
      holeDiameter: 5, // 5mm
      holeSpacing: 32, // 32mm spacing (European standard)
      edgeOffset: 25, // 25mm from edge
      estimatedTime: 15, // minutes per cabinet
      priority: 'medium' as const
    },
    {
      name: 'Hinge Plate Holes',
      description: 'Drill holes for concealed hinge plates',
      holeDiameter: 35, // 35mm for European hinge plate
      holeDepth: 13, // 13mm depth
      estimatedTime: 10,
      priority: 'high' as const
    },
    {
      name: 'Handle Mount Holes',
      description: 'Drill holes for handle/knob mounting',
      holeDiameter: 3, // 3mm for screws
      holeDepth: 15,
      estimatedTime: 5,
      priority: 'medium' as const
    }
  ];
  
  // Generate a job for each drilling pattern
  drillingPatterns.forEach((pattern, index) => {
    const tool = getToolForHoleDiameter(pattern.holeDiameter);
    const machineSettings = getMachineSettingsForTool(tool.id);
    
    const job: ManufacturingJob = {
      id: `drill-${materialId}-${thickness}-${index}`,
      name: pattern.name,
      type: 'drilling',
      status: 'pending',
      priority: pattern.priority,
      cutListItems: items,
      estimatedTime: pattern.estimatedTime * items.length,
      machineSettings,
      toolRequirements: [createToolRequirement(tool)],
      qualityChecks: getQualityChecksForDrilling(),
      tolerances: getTolerancesForDrilling(pattern.holeDiameter),
      estimatedCost: calculateJobCost(pattern.estimatedTime, tool),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    jobs.push(job);
  });
  
  return jobs;
}

/**
 * Generate cutting operations for cabinet parts
 */
function generateCuttingJobs(items: CutListItem[], materialId: string, thickness: string): ManufacturingJob[] {
  const jobs: ManufacturingJob[] = [];
  
  // Group items by size for optimization
  const sizeGroups = groupItemsBySize(items);
  
  Object.entries(sizeGroups).forEach(([size, groupItems]) => {
    const tool = getToolForCutting(parseFloat(thickness));
    const machineSettings = getMachineSettingsForTool(tool.id);
    
    // Calculate cutting time based on total length and complexity
    const totalLength = groupItems.reduce((sum, item) => {
      return sum + (2 * item.width + 2 * item.height) * item.quantity;
    }, 0);
    
    const estimatedTime = Math.ceil(totalLength / 1000 * 2); // 2 minutes per meter of cut
    
    const job: ManufacturingJob = {
      id: `cut-${materialId}-${thickness}-${size}`,
      name: `Cut ${groupItems.length} parts (${size})`,
      type: 'cutting',
      status: 'pending',
      priority: 'high',
      cutListItems: groupItems,
      estimatedTime,
      machineSettings,
      toolRequirements: [createToolRequirement(tool)],
      qualityChecks: getQualityChecksForCutting(),
      tolerances: getTolerancesForCutting(),
      estimatedCost: calculateJobCost(estimatedTime, tool),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    jobs.push(job);
  });
  
  return jobs;
}

/**
 * Generate edge banding operations
 */
function generateEdgeBandingJobs(items: CutListItem[], materialId: string, thickness: string): ManufacturingJob[] {
  const jobs: ManufacturingJob[] = [];
  
  // Filter items that need edge banding
  const itemsNeedingBanding = items.filter(item => 
    item.edgeBanding.top || item.edgeBanding.bottom || 
    item.edgeBanding.left || item.edgeBanding.right
  );
  
  if (itemsNeedingBanding.length === 0) {
    return jobs;
  }
  
  // Calculate total edge length
  const totalEdgeLength = itemsNeedingBanding.reduce((sum, item) => {
    let edgeLength = 0;
    if (item.edgeBanding.top || item.edgeBanding.bottom) {
      edgeLength += item.width * 2;
    }
    if (item.edgeBanding.left || item.edgeBanding.right) {
      edgeLength += item.height * 2;
    }
    return sum + edgeLength * item.quantity;
  }, 0);
  
  const estimatedTime = Math.ceil(totalEdgeLength / 1000 * 3); // 3 minutes per meter
  
  const job: ManufacturingJob = {
    id: `edge-band-${materialId}-${thickness}`,
    name: `Edge Banding (${itemsNeedingBanding.length} parts)`,
    type: 'cutting', // Edge banding is a cutting operation
    status: 'pending',
    priority: 'medium',
    cutListItems: itemsNeedingBanding,
    estimatedTime,
    machineSettings: {
      machineType: 'edge-bander',
      feedRate: 5000, // mm/min
      workOffset: { x: 0, y: 0, z: 0 },
      coolant: 'off'
    },
    toolRequirements: [], // Edge bander uses pre-configured tools
    qualityChecks: getQualityChecksForEdgeBanding(),
    tolerances: getTolerancesForEdgeBanding(),
    estimatedCost: calculateJobCost(estimatedTime, null, 25), // $25/hour for edge banding
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  jobs.push(job);
  
  return jobs;
}

/**
 * Group items by approximate size for optimization
 */
function groupItemsBySize(items: CutListItem[]): Record<string, CutListItem[]> {
  const groups: Record<string, CutListItem[]> = {};
  
  items.forEach(item => {
    // Determine size category based on the larger dimension
    const maxSize = Math.max(item.width, item.height);
    let sizeCategory: string;
    
    if (maxSize <= 300) {
      sizeCategory = 'small';
    } else if (maxSize <= 600) {
      sizeCategory = 'medium';
    } else if (maxSize <= 900) {
      sizeCategory = 'large';
    } else {
      sizeCategory = 'xlarge';
    }
    
    if (!groups[sizeCategory]) {
      groups[sizeCategory] = [];
    }
    groups[sizeCategory].push(item);
  });
  
  return groups;
}

/**
 * Get appropriate tool for hole diameter
 */
function getToolForHoleDiameter(diameter: number): CNCTool {
  // Find closest drill bit
  const drillBits = STANDARD_CNC_TOOLS.filter(tool => tool.type === 'drill-bit');
  const closest = drillBits.reduce((prev, curr) => 
    Math.abs(curr.diameter - diameter) < Math.abs(prev.diameter - diameter) ? curr : prev
  );
  
  return closest;
}

/**
 * Get appropriate tool for cutting based on material thickness
 */
function getToolForCutting(thickness: number): CNCTool {
  // Use larger end mill for thicker materials
  if (thickness >= 0.75) {
    return STANDARD_CNC_TOOLS.find(tool => tool.id === 'endmill-1-2')!;
  } else {
    return STANDARD_CNC_TOOLS.find(tool => tool.id === 'endmill-1-4')!;
  }
}

/**
 * Get machine settings for a specific tool
 */
function getMachineSettingsForTool(toolId: string): MachineSettings {
  const settingKey = toolId.includes('drill') ? `drill-${toolId.split('-')[1]}` : `cut-${toolId.split('-')[1]}`;
  return STANDARD_MACHINE_SETTINGS[settingKey] || STANDARD_MACHINE_SETTINGS['cut-1-4'];
}

/**
 * Create tool requirement from tool
 */
function createToolRequirement(tool: CNCTool): ToolRequirement {
  return {
    toolId: tool.id,
    toolName: tool.name,
    toolType: tool.type,
    diameter: tool.diameter,
    length: tool.length,
    coating: tool.coating || 'none',
    condition: 'good',
    estimatedLife: tool.maxLife || 20,
    currentUsage: tool.currentLife || 0
  };
}

/**
 * Get quality checks for drilling operations
 */
function getQualityChecksForDrilling(): QualityCheck[] {
  return STANDARD_QUALITY_CHECKS.filter(check => 
    check.name.includes('Hole') || check.type === 'dimensional'
  );
}

/**
 * Get quality checks for cutting operations
 */
function getQualityChecksForCutting(): QualityCheck[] {
  return STANDARD_QUALITY_CHECKS.filter(check => 
    check.name.includes('Edge') || check.name.includes('Dimensional')
  );
}

/**
 * Get quality checks for edge banding
 */
function getQualityChecksForEdgeBanding(): QualityCheck[] {
  return [
    {
      id: 'edge-band-adhesion',
      name: 'Edge Band Adhesion Check',
      type: 'functional',
      specification: 'Edge band properly adhered, no gaps',
      tolerance: {
        dimension: 'adhesion',
        nominal: 0,
        plus: 0,
        minus: 0,
        unit: 'mm',
        critical: true
      },
      method: 'manual',
      required: true
    }
  ];
}

/**
 * Get tolerances for drilling operations
 */
function getTolerancesForDrilling(holeDiameter: number): Tolerance[] {
  return [
    {
      dimension: 'diameter',
      nominal: holeDiameter,
      plus: 0.1,
      minus: 0.1,
      unit: 'mm',
      critical: true
    },
    {
      dimension: 'position',
      nominal: 0,
      plus: 0.5,
      minus: 0.5,
      unit: 'mm',
      critical: false
    }
  ];
}

/**
 * Get tolerances for cutting operations
 */
function getTolerancesForCutting(): Tolerance[] {
  return [
    {
      dimension: 'length',
      nominal: 0,
      plus: 0.5,
      minus: 0.5,
      unit: 'mm',
      critical: true
    },
    {
      dimension: 'width',
      nominal: 0,
      plus: 0.5,
      minus: 0.5,
      unit: 'mm',
      critical: true
    }
  ];
}

/**
 * Get tolerances for edge banding
 */
function getTolerancesForEdgeBanding(): Tolerance[] {
  return [
    {
      dimension: 'band-width',
      nominal: 22,
      plus: 0.5,
      minus: 0.5,
      unit: 'mm',
      critical: false
    }
  ];
}

/**
 * Calculate job cost based on time and tool
 */
function calculateJobCost(estimatedTime: number, tool: CNCTool | null, hourlyRate: number = 50): number {
  const laborCost = (estimatedTime / 60) * hourlyRate;
  
  let toolCost = 0;
  if (tool) {
    // Estimate tool wear cost
    const toolUsageHours = estimatedTime / 60;
    const toolWearPercentage = (toolUsageHours / (tool.maxLife || 20)) * 100;
    toolCost = (toolCostPercentage / 100) * 100; // Assume $100 tool replacement cost
  }
  
  const overhead = (laborCost + toolCost) * 0.15; // 15% overhead
  
  return laborCost + toolCost + overhead;
}

/**
 * Optimize job sequence for efficiency
 */
export function optimizeJobSequence(jobs: ManufacturingJob[]): ManufacturingJob[] {
  // Sort by tool changes to minimize setup time
  const optimized = [...jobs].sort((a, b) => {
    // Same machine type
    if (a.machineSettings.machineType !== b.machineSettings.machineType) {
      const machineOrder = ['cnc-router', 'edge-bander', 'drill-press'];
      const aIndex = machineOrder.indexOf(a.machineSettings.machineType);
      const bIndex = machineOrder.indexOf(b.machineSettings.machineType);
      return aIndex - bIndex;
    }
    
    // Same tool
    if (a.toolRequirements.length > 0 && b.toolRequirements.length > 0) {
      const aTool = a.toolRequirements[0].toolId;
      const bTool = b.toolRequirements[0].toolId;
      if (aTool !== bTool) {
        return aTool.localeCompare(bTool);
      }
    }
    
    // Priority
    const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
    
    return bPriority - aPriority;
  });
  
  return optimized;
}

/**
 * Calculate total manufacturing time and cost
 */
export function calculateManufacturingSummary(jobs: ManufacturingJob[]): {
  totalTime: number;
  totalCost: number;
  jobBreakdown: Record<string, {
    count: number;
    time: number;
    cost: number;
  }>;
} {
  const jobBreakdown: Record<string, {
    count: number;
    time: number;
    cost: number;
  }> = {};
  
  let totalTime = 0;
  let totalCost = 0;
  
  jobs.forEach(job => {
    totalTime += job.estimatedTime;
    totalCost += job.estimatedCost;
    
    const jobType = job.type;
    if (!jobBreakdown[jobType]) {
      jobBreakdown[jobType] = { count: 0, time: 0, cost: 0 };
    }
    jobBreakdown[jobType].count++;
    jobBreakdown[jobType].time += job.estimatedTime;
    jobBreakdown[jobType].cost += job.estimatedCost;
  });
  
  return {
    totalTime,
    totalCost,
    jobBreakdown
  };
}
