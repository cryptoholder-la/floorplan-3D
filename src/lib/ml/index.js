// ML Library Index for Floorplan 3D
// Main export file for all machine learning utilities

// Core ML utilities
export { default as FloorplanMLUtils } from './floorplan-ml-utils.js';

// Analysis and prediction models
export { default as FloorplanAnalyzer } from './floorplan-analyzer.js';

// Training and dataset management
export { default as DatasetGenerator } from './dataset-generator.js';
export { default as MLModelTrainer } from './ml-model-trainer.js';

// Re-export commonly used combinations
export class FloorplanML {
  constructor() {
    this.utils = new FloorplanMLUtils();
    this.analyzer = new FloorplanAnalyzer();
    this.datasetGenerator = new DatasetGenerator();
    this.trainer = new MLModelTrainer();
  }

  async initialize() {
    console.log('Initializing Floorplan ML System...');
    
    await this.analyzer.initialize();
    await this.trainer.initialize();
    
    console.log('Floorplan ML System initialized');
  }

  // Quick analysis methods
  async analyzeFloorplan(floorplanData) {
    const results = {};
    
    try {
      // Layout optimization
      results.layout = await this.analyzer.analyzeLayout(floorplanData);
      
      // Compliance checking
      results.compliance = await this.analyzer.checkCompliance(floorplanData);
      
      // User preference prediction
      results.preferences = await this.analyzer.predictUserPreferences(
        floorplanData, 
        this.getDefaultUserProfile()
      );
      
      console.log('Floorplan analysis completed');
      return results;
      
    } catch (error) {
      console.error('Floorplan analysis failed:', error);
      throw error;
    }
  }

  async trainModels(trainingData = null) {
    return await this.trainer.trainAllModels(trainingData);
  }

  async generateTrainingDataset(size = 1000) {
    return this.datasetGenerator.generateSyntheticDataset(size);
  }

  async evaluateModels(testData) {
    return await this.trainer.evaluateModels(testData);
  }

  getDefaultUserProfile() {
    return {
      age: 35,
      familySize: 4,
      income: 75000,
      location: 'suburban',
      lifestyle: 'family'
    };
  }

  // Utility methods
  getMLStatus() {
    return {
      initialized: this.analyzer.initialized,
      trainingStatus: this.trainer.getTrainingStatus(),
      availableModels: Object.keys(this.trainer.models).filter(key => 
        this.trainer.models[key] !== null
      )
    };
  }

  async saveAllModels() {
    return await this.trainer.saveAllModels();
  }

  async loadAllModels() {
    return await this.trainer.loadAllModels();
  }

  async cleanup() {
    await this.trainer.cleanup();
  }
}

// Version and metadata
export const ML_LIBRARY_VERSION = '1.0.0';
export const ML_LIBRARY_INFO = {
  version: ML_LIBRARY_VERSION,
  name: 'Floorplan 3D ML Library',
  description: 'Comprehensive machine learning utilities for floorplan design and optimization',
  features: [
    'Layout optimization using TensorFlow.js',
    'NKBA compliance checking',
    'User preference learning',
    'Material usage prediction',
    'Synthetic dataset generation',
    'Model training and evaluation',
    'Real-time inference'
  ],
  dependencies: [
    '@tensorflow/tfjs',
    'ml-matrix',
    'ml-random-forest',
    'ml-regression',
    'ml-kmeans',
    'ml-fnn',
    'brain.js',
    'natural',
    'synaptic'
  ],
  author: 'Floorplan 3D Development Team',
  license: 'MIT'
};

// Export constants for easy access
export const ML_CONSTANTS = {
  // NKBA standards
  NKBA: {
    WORK_TRIANGLE_MIN: 12, // feet
    WORK_TRIANGLE_MAX: 26, // feet
    MIN_CLEARANCE: {
      STOVE: 15, // inches
      SINK: 12,
      REFRIGERATOR: 6,
      DISHWASHER: 9,
      OVEN: 12
    },
    MIN_DOOR_WIDTH: 32, // inches
    MIN_ROOM_AREA: 70 // square feet
  },
  
  // Model training
  TRAINING: {
    DEFAULT_EPOCHS: 100,
    DEFAULT_BATCH_SIZE: 32,
    VALIDATION_SPLIT: 0.2,
    EARLY_STOPPING_PATIENCE: 10,
    LEARNING_RATE: 0.001
  },
  
  // Data quality thresholds
  QUALITY: {
    MIN_COMPLETENESS: 0.9,
    MIN_DIVERSITY_ROOMS: 4,
    MIN_CLASS_BALANCE: 0.1,
    MAX_ACCEPTABLE_LOSS: 0.5,
    MIN_ACCEPTABLE_ACCURACY: 0.8
  },
  
  // Confidence thresholds
  CONFIDENCE: {
    HIGH: 0.9,
    MEDIUM: 0.7,
    LOW: 0.5
  }
};

console.log('Floorplan 3D ML Library loaded - Version', ML_LIBRARY_VERSION);
