// Unified Workflow System with Self-Learning Capabilities
// Merges all 5 modules into an organized, intelligent workflow

import { AgentTask, CabinetItem, FloorplanData, DrillingPattern, TemplatePart } from './10_10-complete';

// Learning and Analytics Types
export interface LearningData {
  userId: string;
  sessionId: string;
  timestamp: number;
  module: string;
  action: string;
  data: any;
  outcome: 'success' | 'error' | 'partial';
  duration: number;
  context: any;
}

export interface UserPreference {
  userId: string;
  category: string;
  preferences: Record<string, any>;
  frequency: number;
  lastUsed: number;
  confidence: number;
}

export interface WorkflowPattern {
  id: string;
  name: string;
  steps: WorkflowStep[];
  successRate: number;
  averageDuration: number;
  usageCount: number;
  createdBy: string;
  isRecommended: boolean;
}

export interface WorkflowStep {
  id: string;
  module: 'photo2plan' | 'inventory' | 'drilling' | 'templates' | 'cnc';
  action: string;
  parameters: Record<string, any>;
  estimatedDuration: number;
  dependencies: string[];
  outcomes: string[];
}

export interface IntelligentRecommendation {
  id: string;
  type: 'workflow' | 'cabinet' | 'pattern' | 'template' | 'setting';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  data: any;
  priority: 'low' | 'medium' | 'high';
}

// Self-Learning Agent System
export class SelfLearningAgentSystem {
  private learningData: LearningData[] = [];
  private userPreferences: Map<string, UserPreference[]> = new Map();
  private workflowPatterns: WorkflowPattern[] = [];
  private recommendations: IntelligentRecommendation[] = [];
  private agentPerformance: Map<string, any> = new Map();

  constructor() {
    this.initializeWorkflowPatterns();
    this.loadLearningData();
  }

  // Initialize common workflow patterns
  private initializeWorkflowPatterns(): void {
    this.workflowPatterns = [
      {
        id: 'kitchen-design-complete',
        name: 'Complete Kitchen Design Workflow',
        steps: [
          {
            id: 'scan-floorplan',
            module: 'photo2plan',
            action: 'scan_and_detect',
            parameters: { quality: 'high', autoDetect: true },
            estimatedDuration: 120000,
            dependencies: [],
            outcomes: ['floorplan_data']
          },
          {
            id: 'create-cabinets',
            module: 'inventory',
            action: 'create_from_floorplan',
            parameters: { autoPlace: true, optimizeLayout: true },
            estimatedDuration: 60000,
            dependencies: ['floorplan_data'],
            outcomes: ['cabinets_created']
          },
          {
            id: 'generate-drilling',
            module: 'drilling',
            action: 'generate_for_cabinets',
            parameters: { system: '32mm', includeCenterRow: false },
            estimatedDuration: 30000,
            dependencies: ['cabinets_created'],
            outcomes: ['drilling_patterns']
          },
          {
            id: 'create-templates',
            module: 'templates',
            action: 'generate_from_cabinets',
            parameters: { includeHardware: true, optimizeMaterials: true },
            estimatedDuration: 45000,
            dependencies: ['cabinets_created'],
            outcomes: ['templates_created']
          },
          {
            id: 'generate-cnc',
            module: 'cnc',
            action: 'create_cutlist',
            parameters: { format: 'gcode', optimize: true },
            estimatedDuration: 90000,
            dependencies: ['drilling_patterns', 'templates_created'],
            outcomes: ['cnc_files']
          }
        ],
        successRate: 0.92,
        averageDuration: 345000,
        usageCount: 0,
        createdBy: 'system',
        isRecommended: true
      },
      {
        id: 'quick-cabinet-add',
        name: 'Quick Cabinet Addition',
        steps: [
          {
            id: 'select-template',
            module: 'inventory',
            action: 'select_template',
            parameters: { category: 'base' },
            estimatedDuration: 15000,
            dependencies: [],
            outcomes: ['template_selected']
          },
          {
            id: 'customize-cabinet',
            module: 'inventory',
            action: 'customize_properties',
            parameters: { showAdvanced: false },
            estimatedDuration: 30000,
            dependencies: ['template_selected'],
            outcomes: ['cabinet_customized']
          },
          {
            id: 'add-to-design',
            module: 'inventory',
            action: 'add_to_scene',
            parameters: { autoPosition: true },
            estimatedDuration: 10000,
            dependencies: ['cabinet_customized'],
            outcomes: ['cabinet_added']
          }
        ],
        successRate: 0.95,
        averageDuration: 55000,
        usageCount: 0,
        createdBy: 'system',
        isRecommended: false
      },
      {
        id: 'custom-template-workflow',
        name: 'Custom Template Creation',
        steps: [
          {
            id: 'design-template',
            module: 'templates',
            action: 'create_custom',
            parameters: { cabinetType: 'base' },
            estimatedDuration: 120000,
            dependencies: [],
            outcomes: ['template_design']
          },
          {
            id: 'add-parts',
            module: 'templates',
            action: 'add_standard_parts',
            parameters: { includeHardware: true },
            estimatedDuration: 60000,
            dependencies: ['template_design'],
            outcomes: ['parts_added']
          },
          {
            id: 'generate-drilling',
            module: 'drilling',
            action: 'generate_for_template',
            parameters: { system: '32mm' },
            estimatedDuration: 30000,
            dependencies: ['parts_added'],
            outcomes: ['template_drilling']
          }
        ],
        successRate: 0.88,
        averageDuration: 210000,
        usageCount: 0,
        createdBy: 'system',
        isRecommended: false
      }
    ];
  }

  // Learning Data Management
  async recordLearningData(data: Omit<LearningData, 'timestamp'>): Promise<void> {
    const learningEntry: LearningData = {
      ...data,
      timestamp: Date.now()
    };

    this.learningData.push(learningEntry);
    await this.saveLearningData();
    
    // Trigger learning processes
    this.updateUserPreferences(learningEntry);
    this.updateWorkflowPatterns(learningEntry);
    this.generateRecommendations(learningEntry);
    
    console.log(`🧠 Learning recorded: ${data.module}.${data.action} (${data.outcome})`);
  }

  private updateUserPreferences(data: LearningData): void {
    const userId = data.userId;
    const category = `${data.module}_${data.action}`;
    
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, []);
    }
    
    const preferences = this.userPreferences.get(userId)!;
    let preference = preferences.find(p => p.category === category);
    
    if (!preference) {
      preference = {
        userId,
        category,
        preferences: {},
        frequency: 0,
        lastUsed: 0,
        confidence: 0
      };
      preferences.push(preference);
    }
    
    // Update preference based on outcome
    preference.frequency++;
    preference.lastUsed = data.timestamp;
    
    if (data.outcome === 'success') {
      preference.confidence = Math.min(1, preference.confidence + 0.1);
      
      // Learn from successful parameters
      if (data.data && typeof data.data === 'object') {
        Object.assign(preference.preferences, data.data);
      }
    } else {
      preference.confidence = Math.max(0, preference.confidence - 0.05);
    }
    
    this.userPreferences.set(userId, preferences);
  }

  private updateWorkflowPatterns(data: LearningData): void {
    // Find workflows that contain this step
    this.workflowPatterns.forEach(pattern => {
      const step = pattern.steps.find(s => s.module === data.module && s.action === data.action);
      if (step) {
        pattern.usageCount++;
        
        // Update success rate
        if (data.outcome === 'success') {
          pattern.successRate = (pattern.successRate * 0.9) + (1.0 * 0.1);
        } else {
          pattern.successRate = (pattern.successRate * 0.9) + (0.0 * 0.1);
        }
        
        // Update average duration
        pattern.averageDuration = (pattern.averageDuration * 0.8) + (data.duration * 0.2);
      }
    });
  }

  private generateRecommendations(data: LearningData): void {
    const userId = data.userId;
    const preferences = this.userPreferences.get(userId) || [];
    
    // Clear old recommendations
    this.recommendations = this.recommendations.filter(r => r.priority === 'high');
    
    // Generate new recommendations based on patterns
    if (data.module === 'photo2plan' && data.outcome === 'success') {
      this.recommendations.push({
        id: `rec_${Date.now()}_1`,
        type: 'workflow',
        title: 'Complete Kitchen Design',
        description: 'Based on your successful floorplan scan, try the complete kitchen design workflow',
        confidence: 0.85,
        reasoning: 'You just completed a floorplan scan, next logical step is cabinet creation',
        data: { workflowId: 'kitchen-design-complete' },
        priority: 'high'
      });
    }
    
    if (data.module === 'inventory' && data.action.includes('create')) {
      this.recommendations.push({
        id: `rec_${Date.now()}_2`,
        type: 'cabinet',
        title: 'Similar Cabinet Suggestions',
        description: 'Based on your recent cabinet creation, here are similar options',
        confidence: 0.75,
        reasoning: 'Users who create this cabinet often also like these variants',
        data: { category: data.data?.category || 'base' },
        priority: 'medium'
      });
    }
    
    // Recommend frequently used patterns
    const frequentPatterns = preferences
      .filter(p => p.frequency > 3 && p.confidence > 0.7)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);
    
    frequentPatterns.forEach(pref => {
      this.recommendations.push({
        id: `rec_${Date.now()}_${pref.category}`,
        type: 'workflow',
        title: `Quick ${pref.category.replace('_', ' ')}`,
        description: 'Your frequently used workflow',
        confidence: pref.confidence,
        reasoning: `Used ${pref.frequency} times with ${Math.round(pref.confidence * 100)}% success rate`,
        data: { action: pref.category, parameters: pref.preferences },
        priority: 'medium'
      });
    });
  }

  // Workflow Execution with Learning
  async executeWorkflow(workflowId: string, userId: string, parameters: Record<string, any> = {}): Promise<any> {
    const workflow = this.workflowPatterns.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const results: any = {};
    const startTime = Date.now();
    
    try {
      for (const step of workflow.steps) {
        // Check dependencies
        for (const dependency of step.dependencies) {
          if (!results[dependency]) {
            throw new Error(`Missing dependency: ${dependency}`);
          }
        }
        
        // Execute step with learning
        const stepStartTime = Date.now();
        const stepResult = await this.executeStepWithLearning(step, userId, parameters, results);
        const stepDuration = Date.now() - stepStartTime;
        
        results[step.outcomes[0]] = stepResult;
        
        // Record learning data
        await this.recordLearningData({
          userId,
          sessionId: `workflow_${workflowId}`,
          module: step.module,
          action: step.action,
          data: { ...step.parameters, ...parameters, result: stepResult },
          outcome: 'success',
          duration: stepDuration,
          context: { workflowId, stepId: step.id }
        });
      }
      
      const totalDuration = Date.now() - startTime;
      
      // Record workflow completion
      await this.recordLearningData({
        userId,
        sessionId: `workflow_${workflowId}`,
        module: 'workflow',
        action: 'execute',
        data: { workflowId, results },
        outcome: 'success',
        duration: totalDuration,
        context: { steps: workflow.steps.length }
      });
      
      return results;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      await this.recordLearningData({
        userId,
        sessionId: `workflow_${workflowId}`,
        module: 'workflow',
        action: 'execute',
        data: { workflowId, error: error.message },
        outcome: 'error',
        duration,
        context: { failed: true }
      });
      
      throw error;
    }
  }

  private async executeStepWithLearning(
    step: WorkflowStep, 
    userId: string, 
    parameters: Record<string, any>,
    context: any
  ): Promise<any> {
    // Get user preferences for this step
    const preferences = this.userPreferences.get(userId) || [];
    const pref = preferences.find(p => p.category === `${step.module}_${step.action}`);
    
    // Merge parameters with learned preferences
    const finalParameters = {
      ...step.parameters,
      ...parameters,
      ...(pref ? pref.preferences : {})
    };
    
    // Execute the step based on module and action
    switch (step.module) {
      case 'photo2plan':
        return this.executePhoto2PlanStep(step.action, finalParameters, context);
      case 'inventory':
        return this.executeInventoryStep(step.action, finalParameters, context);
      case 'drilling':
        return this.executeDrillingStep(step.action, finalParameters, context);
      case 'templates':
        return this.executeTemplateStep(step.action, finalParameters, context);
      case 'cnc':
        return this.executeCNCStep(step.action, finalParameters, context);
      default:
        throw new Error(`Unknown module: ${step.module}`);
    }
  }

  // Module Step Executors
  private async executePhoto2PlanStep(action: string, parameters: any, context: any): Promise<any> {
    switch (action) {
      case 'scan_and_detect':
        // Simulate photo scanning with AI
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          floorplanData: {
            walls: [],
            rooms: [],
            openings: [],
            detectedFeatures: {}
          },
          confidence: 0.92
        };
      default:
        throw new Error(`Unknown photo2plan action: ${action}`);
    }
  }

  private async executeInventoryStep(action: string, parameters: any, context: any): Promise<any> {
    switch (action) {
      case 'create_from_floorplan':
        // Simulate cabinet creation from floorplan
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          cabinets: [
            { id: 'cab_1', type: 'base', width: 24, height: 34.5, depth: 24 },
            { id: 'cab_2', type: 'wall', width: 30, height: 30, depth: 12 }
          ],
          layout: 'optimized'
        };
      case 'select_template':
        return { templateId: 'base_standard_24', template: {} };
      case 'customize_properties':
        return { customized: true, properties: parameters };
      case 'add_to_scene':
        return { added: true, position: { x: 0, y: 0, z: 0 } };
      default:
        throw new Error(`Unknown inventory action: ${action}`);
    }
  }

  private async executeDrillingStep(action: string, parameters: any, context: any): Promise<any> {
    switch (action) {
      case 'generate_for_cabinets':
        // Simulate drilling pattern generation
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          patterns: [
            { cabinetId: 'cab_1', holes: [] },
            { cabinetId: 'cab_2', holes: [] }
          ],
          system: parameters.system || '32mm'
        };
      case 'generate_for_template':
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
          templatePattern: { holes: [], system: '32mm' }
        };
      default:
        throw new Error(`Unknown drilling action: ${action}`);
    }
  }

  private async executeTemplateStep(action: string, parameters: any, context: any): Promise<any> {
    switch (action) {
      case 'create_custom':
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          template: {
            id: `custom_${Date.now()}`,
            type: parameters.cabinetType || 'base',
            parts: []
          }
        };
      case 'add_standard_parts':
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          parts: [
            { type: 'baseTop', width: 24, height: 24 },
            { type: 'baseSide', width: 24, height: 34.5 }
          ]
        };
      case 'generate_from_cabinets':
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          templates: [
            { cabinetId: 'cab_1', template: {} },
            { cabinetId: 'cab_2', template: {} }
          ]
        };
      default:
        throw new Error(`Unknown template action: ${action}`);
    }
  }

  private async executeCNCStep(action: string, parameters: any, context: any): Promise<any> {
    switch (action) {
      case 'create_cutlist':
        // Simulate CNC cutlist generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
          cutlist: {
            materials: [],
            cuts: [],
            totalLength: 0,
            optimization: parameters.optimize || false
          },
          gcode: parameters.format === 'gcode' ? 'G-code generated' : null
        };
      default:
        throw new Error(`Unknown CNC action: ${action}`);
    }
  }

  // Getters for UI
  getWorkflowPatterns(): WorkflowPattern[] {
    return this.workflowPatterns.sort((a, b) => {
      // Sort by recommendation and success rate
      if (a.isRecommended !== b.isRecommended) {
        return a.isRecommended ? -1 : 1;
      }
      return b.successRate - a.successRate;
    });
  }

  getRecommendations(userId: string): IntelligentRecommendation[] {
    return this.recommendations
      .filter(r => r.confidence > 0.5)
      .sort((a, b) => {
        // Sort by priority and confidence
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.confidence - a.confidence;
      });
  }

  getUserPreferences(userId: string): UserPreference[] {
    return this.userPreferences.get(userId) || [];
  }

  getLearningInsights(userId: string): any {
    const userLearningData = this.learningData.filter(d => d.userId === userId);
    const preferences = this.userPreferences.get(userId) || [];
    
    return {
      totalActions: userLearningData.length,
      successRate: userLearningData.filter(d => d.outcome === 'success').length / userLearningData.length,
      mostUsedModule: this.getMostUsedModule(userLearningData),
      averageDuration: userLearningData.reduce((sum, d) => sum + d.duration, 0) / userLearningData.length,
      preferences: preferences.sort((a, b) => b.frequency - a.frequency).slice(0, 5),
      workflowUsage: this.workflowPatterns.filter(w => w.usageCount > 0)
    };
  }

  private getMostUsedModule(data: LearningData[]): string {
    const moduleCounts = data.reduce((acc, d) => {
      acc[d.module] = (acc[d.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(moduleCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
  }

  // Persistence
  private async saveLearningData(): Promise<void> {
    try {
      const data = {
        learningData: this.learningData.slice(-1000), // Keep last 1000 entries
        userPreferences: Array.from(this.userPreferences.entries()),
        workflowPatterns: this.workflowPatterns,
        agentPerformance: Array.from(this.agentPerformance.entries())
      };
      
      localStorage.setItem('unified_workflow_learning', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }

  private loadLearningData(): void {
    try {
      const saved = localStorage.getItem('unified_workflow_learning');
      if (saved) {
        const data = JSON.parse(saved);
        this.learningData = data.learningData || [];
        this.userPreferences = new Map(data.userPreferences || []);
        this.workflowPatterns = data.workflowPatterns || this.workflowPatterns;
        this.agentPerformance = new Map(data.agentPerformance || []);
      }
    } catch (error) {
      console.error('Failed to load learning data:', error);
    }
  }

  // Agent Performance Tracking
  updateAgentPerformance(agentId: string, performance: any): void {
    this.agentPerformance.set(agentId, {
      ...this.agentPerformance.get(agentId),
      ...performance,
      lastUpdated: Date.now()
    });
  }

  getAgentPerformance(): Map<string, any> {
    return new Map(this.agentPerformance);
  }
}

// Global instance
export const selfLearningSystem = new SelfLearningAgentSystem();
