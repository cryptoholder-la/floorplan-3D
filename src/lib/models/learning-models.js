// Learning Models Manager
import { 
  UserPreferenceModel, 
  LayoutOptimizationModel, 
  NkbaComplianceModel, 
  MaterialUsageModel 
} from './model-classes.js';
import { EventEmitter } from 'events';

export class LearningModels extends EventEmitter {
  constructor() {
    super();
    this.models = new Map();
    this.activeModels = [];
    this.initialized = false;
  }

  async initialize() {
    console.log('Initializing Learning Models...');
    
    // Initialize all models
    const modelClasses = [
      new UserPreferenceModel(),
      new LayoutOptimizationModel(),
      new NkbaComplianceModel(),
      new MaterialUsageModel()
    ];

    for (const model of modelClasses) {
      await model.initialize();
      this.models.set(model.id, model);
      this.activeModels.push(model);
      console.log(`✅ ${model.id} initialized`);
    }

    this.initialized = true;
    this.emit('models_initialized', this.activeModels);
    console.log('🧠 Learning Models fully initialized');
  }

  getActiveModels() {
    return this.activeModels;
  }

  getModel(modelId) {
    return this.models.get(modelId);
  }

  async trainModel(modelId, trainingData) {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    console.log(`Training model: ${modelId}`);
    const result = await model.train(trainingData);
    this.emit('model_trained', { modelId, result });
    return result;
  }

  async predictWithModel(modelId, input) {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const prediction = await model.predict(input);
    this.emit('prediction_made', { modelId, input, prediction });
    return prediction;
  }

  async evaluateModel(modelId, testData) {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const evaluation = await model.evaluate(testData);
    this.emit('model_evaluated', { modelId, evaluation });
    return evaluation;
  }

  async trainAllModels(trainingDatasets) {
    const results = [];
    
    for (const model of this.activeModels) {
      if (trainingDatasets[model.id]) {
        const result = await this.trainModel(model.id, trainingDatasets[model.id]);
        results.push({ modelId: model.id, result });
      }
    }

    return results;
  }

  async shutdown() {
    console.log('Shutting down Learning Models...');
    this.models.clear();
    this.activeModels = [];
    this.initialized = false;
    this.emit('models_shutdown');
  }
}

export default LearningModels;
