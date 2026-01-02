// ML Model Trainer for Floorplan 3D
import * as tf from '@tensorflow/tfjs';
import FloorplanAnalyzer from './floorplan-analyzer.js';
import DatasetGenerator from './dataset-generator.js';
import { FloorplanMLUtils } from './floorplan-ml-utils.js';

export class MLModelTrainer {
  constructor() {
    this.analyzer = new FloorplanAnalyzer();
    this.datasetGenerator = new DatasetGenerator();
    this.trainingProgress = 0;
    this.isTraining = false;
    this.models = {
      layout: null,
      compliance: null,
      preference: null,
      material: null
    };
    this.trainingHistory = [];
  }

  async initialize() {
    console.log('Initializing ML Model Trainer...');
    await this.analyzer.initialize();
    console.log('ML Model Trainer initialized');
  }

  // Train all models with generated or provided data
  async trainAllModels(trainingData = null) {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    this.isTraining = true;
    this.trainingProgress = 0;

    try {
      console.log('Starting comprehensive ML model training...');

      // Generate or use training data
      const data = trainingData || this.datasetGenerator.generateSyntheticDataset(2000);
      
      // Prepare training datasets
      const { layoutData, complianceData, preferenceData, materialData } = 
        this.prepareTrainingData(data);

      // Train models in parallel for efficiency
      const trainingPromises = [
        this.trainLayoutModel(layoutData),
        this.trainComplianceModel(complianceData),
        this.trainPreferenceModel(preferenceData),
        this.trainMaterialModel(materialData)
      ];

      const results = await Promise.all(trainingPromises);

      // Store trained models
      this.models = {
        layout: results[0],
        compliance: results[1],
        preference: results[2],
        material: results[3]
      };

      // Save models
      await this.saveAllModels();

      // Generate training report
      const report = this.generateTrainingReport(results, data);
      this.trainingHistory.push(report);

      console.log('All models trained successfully!');
      return report;

    } catch (error) {
      console.error('Model training failed:', error);
      throw error;
    } finally {
      this.isTraining = false;
      this.trainingProgress = 100;
    }
  }

  // Train individual models
  async trainLayoutModel(trainingData) {
    console.log('Training Layout Optimization Model...');
    this.trainingProgress = 10;

    const model = this.createLayoutModel();
    const { features, labels } = this.prepareLayoutData(trainingData);

    // Train with early stopping and validation
    const history = await model.fit(features, labels, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress = 10 + (epoch / 100) * 20;
          console.log(`Layout Model - Epoch ${epoch}: loss = ${logs.loss?.toFixed(4)}, val_loss = ${logs.val_loss?.toFixed(4)}`);
        },
        onTrainEnd: () => {
          console.log('Layout model training completed');
        }
      }
    });

    this.trainingProgress = 30;
    return { model, history, type: 'layout' };
  }

  async trainComplianceModel(trainingData) {
    console.log('Training NKBA Compliance Model...');
    this.trainingProgress = 30;

    const model = this.createComplianceModel();
    const { features, labels } = this.prepareComplianceData(trainingData);

    const history = await model.fit(features, labels, {
      epochs: 80,
      batchSize: 16,
      validationSplit: 0.25,
      classWeight: { 0: 1, 1: 2 }, // Weight compliance violations higher
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress = 30 + (epoch / 80) * 20;
          console.log(`Compliance Model - Epoch ${epoch}: loss = ${logs.loss?.toFixed(4)}, accuracy = ${logs.acc?.toFixed(4)}`);
        }
      }
    });

    this.trainingProgress = 50;
    return { model, history, type: 'compliance' };
  }

  async trainPreferenceModel(trainingData) {
    console.log('Training User Preference Model...');
    this.trainingProgress = 50;

    const model = this.createPreferenceModel();
    const { features, labels } = this.preparePreferenceData(trainingData);

    const history = await model.fit(features, labels, {
      epochs: 120,
      batchSize: 24,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress = 50 + (epoch / 120) * 20;
          console.log(`Preference Model - Epoch ${epoch}: loss = ${logs.loss?.toFixed(4)}, accuracy = ${logs.acc?.toFixed(4)}`);
        }
      }
    });

    this.trainingProgress = 70;
    return { model, history, type: 'preference' };
  }

  async trainMaterialModel(trainingData) {
    console.log('Training Material Usage Model...');
    this.trainingProgress = 70;

    const model = this.createMaterialModel();
    const { features, labels } = this.prepareMaterialData(trainingData);

    const history = await model.fit(features, labels, {
      epochs: 60,
      batchSize: 32,
      validationSplit: 0.15,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress = 70 + (epoch / 60) * 20;
          console.log(`Material Model - Epoch ${epoch}: loss = ${logs.loss?.toFixed(4)}, mae = ${logs.mae?.toFixed(4)}`);
        }
      }
    });

    this.trainingProgress = 90;
    return { model, history, type: 'material' };
  }

  // Model architecture definitions
  createLayoutModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [12], units: 32, activation: 'relu', name: 'input_layer' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 24, activation: 'relu', name: 'hidden_1' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu', name: 'hidden_2' }),
        tf.layers.dense({ units: 8, activation: 'relu', name: 'hidden_3' }),
        tf.layers.dense({ units: 4, activation: 'linear', name: 'output_layer' }) // x, y, rotation, scale
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse'],
      name: 'LayoutOptimizationModel'
    });

    return model;
  }

  createComplianceModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 48, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid', name: 'compliance_score' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.0005),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy', 'precision', 'recall'],
      name: 'ComplianceModel'
    });

    return model;
  }

  createPreferenceModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 48, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 36, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 24, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 6, activation: 'softmax', name: 'style_preferences' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy', 'topKAccuracy'],
      name: 'PreferenceModel'
    });

    return model;
  }

  createMaterialModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 24, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.batchNormalization({}),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear', name: 'material_usage' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse'],
      name: 'MaterialModel'
    });

    return model;
  }

  // Data preparation methods
  prepareTrainingData(rawData) {
    return {
      layoutData: this.prepareLayoutData(rawData),
      complianceData: this.prepareComplianceData(rawData),
      preferenceData: this.preparePreferenceData(rawData),
      materialData: this.prepareMaterialData(rawData)
    };
  }

  prepareLayoutData(data) {
    const features = [];
    const labels = [];

    data.datasets.layouts.forEach(sample => {
      const layoutFeatures = this.analyzer.extractLayoutFeatures(sample.floorplan);
      const optimizationTargets = [
        sample.optimization.trafficFlow,
        sample.optimization.spaceUtilization,
        sample.optimization.accessibility,
        sample.optimization.naturalLight
      ];

      features.push(layoutFeatures);
      labels.push(optimizationTargets);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  prepareComplianceData(data) {
    const features = [];
    const labels = [];

    data.datasets.layouts.forEach(sample => {
      const complianceFeatures = this.analyzer.extractComplianceFeatures(sample.floorplan);
      const isCompliant = sample.compliance.score >= 80; // 80% threshold

      features.push(complianceFeatures);
      labels.push([isCompliant ? 1 : 0]);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  preparePreferenceData(data) {
    const features = [];
    const labels = [];

    const styleCategories = ['modern', 'traditional', 'minimal', 'industrial', 'rustic'];

    data.datasets.layouts.forEach(sample => {
      const preferenceFeatures = this.analyzer.extractPreferenceFeatures(
        sample.floorplan, 
        sample.preferences.userDemographics
      );
      
      const styleIndex = styleCategories.indexOf(sample.preferences.style);
      const styleOneHot = new Array(styleCategories.length).fill(0);
      if (styleIndex !== -1) styleOneHot[styleIndex] = 1;

      features.push(preferenceFeatures);
      labels.push(styleOneHot);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  prepareMaterialData(data) {
    const features = [];
    const labels = [];

    data.datasets.layouts.forEach(sample => {
      const materialFeatures = [
        sample.floorplan.totalArea,
        sample.floorplan.roomCount,
        sample.floorplan.complexity,
        this.encodeMaterialType(sample.materials),
        sample.preferences.budget,
        sample.preferences.functionality
      ];

      const predictedUsage = this.calculateTargetMaterialUsage(sample);

      features.push(materialFeatures);
      labels.push([predictedUsage]);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  encodeMaterialType(materials) {
    // Encode primary material type
    const materialTypes = ['wood', 'metal', 'glass', 'stone', 'composite'];
    const primaryMaterial = this.getPrimaryMaterial(materials);
    const encoding = new Array(materialTypes.length).fill(0);
    const index = materialTypes.indexOf(primaryMaterial);
    if (index !== -1) encoding[index] = 1;
    return encoding[0]; // Return single value
  }

  getPrimaryMaterial(materials) {
    // Find the material with highest usage/cost
    let primaryMaterial = 'wood';
    let maxCost = 0;

    Object.entries(materials).forEach(([material, data]) => {
      if (data.cost > maxCost) {
        maxCost = data.cost;
        primaryMaterial = material;
      }
    });

    return primaryMaterial;
  }

  calculateTargetMaterialUsage(sample) {
    // Calculate target material usage based on actual data
    const totalMaterialCost = Object.values(sample.materials)
      .reduce((sum, material) => sum + material.cost, 0);
    
    return totalMaterialCost / sample.floorplan.budget;
  }

  // Model evaluation
  async evaluateModels(testData) {
    console.log('Evaluating trained models...');
    
    const evaluationResults = {};

    // Evaluate layout model
    if (this.models.layout) {
      const layoutEval = await this.evaluateLayoutModel(testData);
      evaluationResults.layout = layoutEval;
    }

    // Evaluate compliance model
    if (this.models.compliance) {
      const complianceEval = await this.evaluateComplianceModel(testData);
      evaluationResults.compliance = complianceEval;
    }

    // Evaluate preference model
    if (this.models.preference) {
      const preferenceEval = await this.evaluatePreferenceModel(testData);
      evaluationResults.preference = preferenceEval;
    }

    // Evaluate material model
    if (this.models.material) {
      const materialEval = await this.evaluateMaterialModel(testData);
      evaluationResults.material = materialEval;
    }

    return evaluationResults;
  }

  async evaluateLayoutModel(testData) {
    const { features, labels } = this.prepareLayoutData(testData);
    const predictions = await this.models.layout.model.predict(features);
    const predictionData = await predictions.data();

    const mse = tf.losses.meanSquaredError(labels, predictions).dataSync()[0];
    const mae = tf.losses.meanAbsoluteError(labels, predictions).dataSync()[0];

    return {
      mse,
      mae,
      accuracy: this.calculateRegressionAccuracy(predictionData, labels.dataSync()),
      type: 'layout'
    };
  }

  async evaluateComplianceModel(testData) {
    const { features, labels } = this.prepareComplianceData(testData);
    const predictions = await this.models.compliance.model.predict(features);
    const predictionData = await predictions.data();

    const accuracy = this.calculateClassificationAccuracy(predictionData, labels.dataSync());
    const precision = this.calculatePrecision(predictionData, labels.dataSync());
    const recall = this.calculateRecall(predictionData, labels.dataSync());

    return {
      accuracy,
      precision,
      recall,
      f1Score: 2 * (precision * recall) / (precision + recall),
      type: 'compliance'
    };
  }

  async evaluatePreferenceModel(testData) {
    const { features, labels } = this.preparePreferenceData(testData);
    const predictions = await this.models.preference.model.predict(features);
    const predictionData = await predictions.data();

    const accuracy = this.calculateClassificationAccuracy(predictionData, labels.dataSync());
    const topKAccuracy = this.calculateTopKAccuracy(predictionData, labels.dataSync(), 3);

    return {
      accuracy,
      topKAccuracy,
      type: 'preference'
    };
  }

  async evaluateMaterialModel(testData) {
    const { features, labels } = this.prepareMaterialData(testData);
    const predictions = await this.models.material.model.predict(features);
    const predictionData = await predictions.data();

    const mse = tf.losses.meanSquaredError(labels, predictions).dataSync()[0];
    const mae = tf.losses.meanAbsoluteError(labels, predictions).dataSync()[0];
    const r2 = this.calculateR2Score(predictionData, labels.dataSync());

    return {
      mse,
      mae,
      r2Score: r2,
      type: 'material'
    };
  }

  calculateRegressionAccuracy(predictions, labels) {
    const errors = predictions.map((pred, i) => Math.abs(pred - labels[i][0]));
    const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
    const maxError = Math.max(...errors);
    
    return {
      meanError,
      maxError,
      accuracy: Math.max(0, 1 - meanError)
    };
  }

  calculateClassificationAccuracy(predictions, labels) {
    const correct = predictions.map((pred, i) => {
      const predIndex = pred.indexOf(Math.max(...pred));
      const trueIndex = labels[i].indexOf(1);
      return predIndex === trueIndex ? 1 : 0;
    });

    return correct.reduce((sum, val) => sum + val, 0) / correct.length;
  }

  calculatePrecision(predictions, labels) {
    // Calculate precision for each class
    const classes = predictions[0].length;
    const precisions = [];

    for (let i = 0; i < classes; i++) {
      const truePositives = predictions.filter((pred, idx) => 
        pred.indexOf(Math.max(...pred)) === i && labels[idx][i] === 1
      ).length;
      
      const falsePositives = predictions.filter((pred, idx) => 
        pred.indexOf(Math.max(...pred)) === i && labels[idx][i] === 0
      ).length;

      precisions.push(truePositives / (truePositives + falsePositives));
    }

    return precisions.reduce((sum, p) => sum + p, 0) / precisions.length;
  }

  calculateRecall(predictions, labels) {
    const classes = predictions[0].length;
    const recalls = [];

    for (let i = 0; i < classes; i++) {
      const truePositives = predictions.filter((pred, idx) => 
        pred.indexOf(Math.max(...pred)) === i && labels[idx][i] === 1
      ).length;
      
      const falseNegatives = predictions.filter((pred, idx) => 
        pred.indexOf(Math.max(...pred)) !== i && labels[idx][i] === 1
      ).length;

      recalls.push(truePositives / (truePositives + falseNegatives));
    }

    return recalls.reduce((sum, r) => sum + r, 0) / recalls.length;
  }

  calculateTopKAccuracy(predictions, labels, k) {
    let correct = 0;
    
    predictions.forEach((pred, i) => {
      const topK = this.getTopKIndices(pred, k);
      const trueIndex = labels[i].indexOf(1);
      
      if (topK.includes(trueIndex)) {
        correct++;
      }
    });

    return correct / predictions.length;
  }

  calculateR2Score(predictions, labels) {
    const yTrue = labels.map(label => label[0]);
    const yPred = predictions.map(pred => pred[0]);
    
    const yMean = yTrue.reduce((sum, y) => sum + y, 0) / yTrue.length;
    const ssTotal = yTrue.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssResidual = yTrue.reduce((sum, y, i) => {
      return sum + Math.pow(y - yPred[i], 2);
    }, 0);

    return 1 - (ssResidual / ssTotal);
  }

  getTopKIndices(array, k) {
    const indexed = array.map((value, index) => ({ value, index }));
    indexed.sort((a, b) => b.value - a.value);
    return indexed.slice(0, k).map(item => item.index);
  }

  // Model management
  async saveAllModels() {
    console.log('Saving trained models...');
    
    try {
      const savedModels = {
        layout: await this.models.layout.model.save('localstorage://floorplan-layout-model'),
        compliance: await this.models.compliance.model.save('localstorage://floorplan-compliance-model'),
        preference: await this.models.preference.model.save('localstorage://floorplan-preference-model'),
        material: await this.models.material.model.save('localstorage://floorplan-material-model')
      };

      console.log('All models saved successfully');
      return savedModels;
    } catch (error) {
      console.error('Failed to save models:', error);
      throw error;
    }
  }

  async loadAllModels() {
    console.log('Loading trained models...');
    
    try {
      const models = {
        layout: await tf.loadLayersModel('localstorage://floorplan-layout-model'),
        compliance: await tf.loadLayersModel('localstorage://floorplan-compliance-model'),
        preference: await tf.loadLayersModel('localstorage://floorplan-preference-model'),
        material: await tf.loadLayersModel('localstorage://floorplan-material-model')
      };

      this.models = models;
      console.log('All models loaded successfully');
      return models;
    } catch (error) {
      console.warn('Could not load models:', error);
      return null;
    }
  }

  generateTrainingReport(results, trainingData) {
    return {
      timestamp: new Date().toISOString(),
      trainingData: {
        sampleCount: trainingData.datasets.layouts.length,
        syntheticData: trainingData.metadata?.synthetic || false,
        dataQuality: this.datasetGenerator.assessDataQuality()
      },
      models: {
        layout: this.summarizeModelTraining(results[0]),
        compliance: this.summarizeModelTraining(results[1]),
        preference: this.summarizeModelTraining(results[2]),
        material: this.summarizeModelTraining(results[3])
      },
      performance: {
        overallTrainingTime: results.reduce((sum, r) => 
          sum + (r.history?.history?.epochs || 0), 0
        ),
        bestPerformingModel: this.getBestPerformingModel(results)
      },
      recommendations: this.generateModelRecommendations(results)
    };
  }

  summarizeModelTraining(result) {
    if (!result || !result.history) return null;

    const finalEpoch = result.history.history;
    const finalLoss = finalEpoch.loss?.[finalEpoch.loss.length - 1] || 0;
    const bestLoss = Math.min(...finalEpoch.loss);
    const finalAccuracy = finalEpoch.acc?.[finalEpoch.acc.length - 1] || 0;
    const bestAccuracy = Math.max(...finalEpoch.acc || [0]);

    return {
      epochs: finalEpoch.loss.length,
      finalLoss,
      bestLoss,
      finalAccuracy,
      bestAccuracy,
      convergence: finalEpoch.loss.length > 1 && 
                Math.abs(finalLoss - bestLoss) < 0.01
    };
  }

  getBestPerformingModel(results) {
    const performanceScores = results.map(result => {
      if (!result || !result.history) return 0;
      
      const finalLoss = result.history.history.loss?.[result.history.history.loss.length - 1] || 1;
      const finalAccuracy = result.history.history.acc?.[result.history.history.acc.length - 1] || 0;
      
      return finalAccuracy / finalLoss; // Higher accuracy and lower loss is better
    });

    const bestIndex = performanceScores.indexOf(Math.max(...performanceScores));
    const modelNames = ['layout', 'compliance', 'preference', 'material'];
    
    return modelNames[bestIndex];
  }

  generateModelRecommendations(results) {
    const recommendations = [];

    results.forEach((result, index) => {
      const modelNames = ['Layout', 'Compliance', 'Preference', 'Material'];
      const summary = this.summarizeModelTraining(result);
      
      if (!summary) return;

      if (summary.finalLoss > 0.5) {
        recommendations.push({
          model: modelNames[index],
          type: 'training',
          priority: 'high',
          message: `High final loss (${summary.finalLoss.toFixed(3)}). Consider more training.`,
          action: 'increase_epochs'
        });
      }

      if (summary.finalAccuracy < 0.8) {
        recommendations.push({
          model: modelNames[index],
          type: 'accuracy',
          priority: 'medium',
          message: `Low accuracy (${(summary.finalAccuracy * 100).toFixed(1)}%). Check data quality.`,
          action: 'improve_data'
        });
      }

      if (!summary.convergence) {
        recommendations.push({
          model: modelNames[index],
          type: 'convergence',
          priority: 'medium',
          message: 'Model did not converge properly.',
          action: 'adjust_learning_rate'
        });
      }
    });

    return recommendations;
  }

  // Get training status
  getTrainingStatus() {
    return {
      isTraining: this.isTraining,
      progress: this.trainingProgress,
      modelsTrained: Object.values(this.models).some(model => model !== null),
      trainingHistory: this.trainingHistory
    };
  }

  // Cleanup
  async cleanup() {
    console.log('Cleaning up ML Model Trainer...');
    
    // Dispose of tensors
    Object.values(this.models).forEach(model => {
      if (model && model.model) {
        model.model.dispose();
      }
    });

    this.models = {
      layout: null,
      compliance: null,
      preference: null,
      material: null
    };

    this.trainingProgress = 0;
    this.isTraining = false;
    
    console.log('ML Model Trainer cleaned up');
  }
}

export default MLModelTrainer;
