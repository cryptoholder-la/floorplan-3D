// Machine Learning Utilities for Floorplan 3D
import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression as RandomForest } from 'ml-random-forest';
import { LinearRegression } from 'ml-regression';
import { kmeans } from 'ml-kmeans';
import { NeuralNetwork } from 'ml-fnn';
import brain from 'brain.js';
import natural from 'natural';

export class FloorplanMLUtils {
  // TensorFlow.js utilities
  static createTensor(data, shape) {
    return tf.tensor(data, shape);
  }

  static async trainModel(model, data, labels, epochs = 100) {
    const history = await model.fit(data, labels, {
      epochs: epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });
    return history;
  }

  // Layout optimization using clustering
  static optimizeLayout(roomDimensions, furniture) {
    // Convert furniture positions to numerical features
    const features = furniture.map(item => [
      item.x / roomDimensions.width,
      item.y / roomDimensions.height,
      item.width / roomDimensions.width,
      item.height / roomDimensions.height
    ]);

    // Use K-means clustering to group similar items
    const clusters = kmeans(features, 3);
    
    // Optimize positions based on clusters
    const optimizedLayout = furniture.map((item, index) => {
      const cluster = clusters[index];
      return {
        ...item,
        x: cluster[0] * roomDimensions.width,
        y: cluster[1] * roomDimensions.height
      };
    });

    return optimizedLayout;
  }

  // NKBA compliance checking
  static checkNKBACompliance(design) {
    const violations = [];
    
    // Check work triangle in kitchen
    if (design.type === 'kitchen') {
      const workTriangle = this.calculateWorkTriangle(design);
      if (workTriangle.perimeter > 26 * 3) { // 26 feet max total
        violations.push({
          type: 'work_triangle',
          severity: 'warning',
          message: 'Work triangle exceeds NKBA recommended 26 feet',
          value: workTriangle.perimeter
        });
      }
    }

    // Check clearances
    design.appliances?.forEach(appliance => {
      const clearance = this.checkClearance(appliance, design.obstacles);
      if (clearance < this.getRequiredClearance(appliance.type)) {
        violations.push({
          type: 'clearance',
          severity: 'error',
          message: `Insufficient clearance for ${appliance.type}`,
          required: this.getRequiredClearance(appliance.type),
          actual: clearance
        });
      }
    });

    return {
      compliant: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      score: Math.max(0, 100 - violations.length * 10)
    };
  }

  static calculateWorkTriangle(kitchenDesign) {
    const sink = kitchenDesign.appliances.find(a => a.type === 'sink');
    const stove = kitchenDesign.appliances.find(a => a.type === 'stove');
    const fridge = kitchenDesign.appliances.find(a => a.type === 'refrigerator');

    if (!sink || !stove || !fridge) return null;

    const distances = [
      this.getDistance(sink.position, stove.position),
      this.getDistance(stove.position, fridge.position),
      this.getDistance(fridge.position, sink.position)
    ];

    return {
      perimeter: distances.reduce((a, b) => a + b, 0),
      sides: distances
    };
  }

  static getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  static checkClearance(appliance, obstacles) {
    const requiredClearance = this.getRequiredClearance(appliance.type);
    let minClearance = Infinity;

    obstacles?.forEach(obstacle => {
      const clearance = this.getDistance(appliance.position, obstacle.position) - 
                     (appliance.width / 2) - (obstacle.width / 2);
      minClearance = Math.min(minClearance, clearance);
    });

    return minClearance === Infinity ? requiredClearance : minClearance;
  }

  static getRequiredClearance(applianceType) {
    const clearances = {
      stove: 15, // 15 inches
      sink: 12, // 12 inches  
      refrigerator: 6, // 6 inches
      dishwasher: 9, // 9 inches
      oven: 12 // 12 inches
    };
    return clearances[applianceType] || 12;
  }

  // User preference learning
  static createUserPreferenceModel() {
    return new brain.js.NeuralNetwork({
      hiddenLayers: [10, 8, 6],
      activation: 'sigmoid',
      learningRate: 0.01
    });
  }

  static trainUserPreferences(model, userInteractions) {
    const trainingData = userInteractions.map(interaction => ({
      input: this.extractFeatures(interaction.design),
      output: this.extractPreferences(interaction.feedback)
    }));

    model.train(trainingData, {
      iterations: 1000,
      errorThresh: 0.005,
      log: true
    });

    return model;
  }

  static extractFeatures(design) {
    return [
      design.roomCount || 1,
      design.totalArea || 0,
      design.style === 'modern' ? 1 : 0,
      design.style === 'traditional' ? 1 : 0,
      design.style === 'minimal' ? 1 : 0,
      design.budget || 0,
      design.priority === 'functionality' ? 1 : 0,
      design.priority === 'aesthetics' ? 1 : 0
    ];
  }

  static extractPreferences(feedback) {
    return [
      feedback.satisfaction || 0.5,
      feedback.wouldRecommend ? 1 : 0,
      feedback.styleRating || 0.5,
      feedback.functionalityRating || 0.5,
      feedback.budgetSatisfaction || 0.5
    ];
  }

  // Material usage prediction
  static predictMaterialUsage(projectData) {
    const features = [
      projectData.totalArea,
      projectData.roomCount,
      projectData.complexity || 1,
      projectData.materialType === 'wood' ? 1 : 0,
      projectData.materialType === 'metal' ? 1 : 0,
      projectData.materialType === 'composite' ? 1 : 0
    ];

    // Simple linear regression for material estimation
    const coefficients = {
      area: 1.15,
      rooms: 0.8,
      complexity: 0.3,
      wood: 1.2,
      metal: 0.9,
      composite: 1.0
    };

    const predictedUsage = features.reduce((sum, feature, index) => {
      const coefficient = Object.values(coefficients)[index] || 0;
      return sum + (feature * coefficient);
    }, 0);

    return {
      predicted: predictedUsage,
      confidence: 0.85,
      wasteFactor: 1.1 // 10% waste allowance
    };
  }

  // Cost estimation
  static estimateCost(projectData, materialCosts) {
    const materialUsage = this.predictMaterialUsage(projectData);
    const laborCost = projectData.totalArea * 25; // $25 per sq ft
    const materialCost = Object.entries(materialCosts).reduce((total, [material, cost]) => {
      const usage = materialUsage.predicted * 
                   (projectData.materialType === material ? 1 : 0);
      return total + (usage * cost);
    }, 0);

    return {
      materials: materialCost,
      labor: laborCost,
      total: materialCost + laborCost,
      perSquareFoot: (materialCost + laborCost) / projectData.totalArea
    };
  }

  // Design recommendations
  static generateRecommendations(design, userPreferences) {
    const recommendations = [];

    // Analyze traffic flow
    const trafficFlow = this.analyzeTrafficFlow(design);
    if (trafficFlow.efficiency < 0.7) {
      recommendations.push({
        type: 'layout',
        priority: 'high',
        title: 'Improve Traffic Flow',
        description: 'Consider rearranging furniture to create better pathways',
        impact: 'medium'
      });
    }

    // Storage optimization
    const storageAnalysis = this.analyzeStorage(design);
    if (storageAnalysis.utilization < 0.6) {
      recommendations.push({
        type: 'storage',
        priority: 'medium',
        title: 'Optimize Storage',
        description: 'Add vertical storage solutions to maximize space',
        impact: 'low'
      });
    }

    // Style consistency
    const styleAnalysis = this.analyzeStyle(design);
    if (styleAnalysis.consistency < 0.8) {
      recommendations.push({
        type: 'style',
        priority: 'low',
        title: 'Improve Style Consistency',
        description: 'Consider elements that match your preferred style',
        impact: 'aesthetic'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  static analyzeTrafficFlow(design) {
    // Simplified traffic flow analysis
    const pathways = this.findPathways(design);
    const intersections = this.countIntersections(pathways);
    const efficiency = Math.max(0, 1 - (intersections * 0.1));

    return { efficiency, pathways, intersections };
  }

  static analyzeStorage(design) {
    const storageAreas = design.furniture?.filter(item => 
      item.type === 'cabinet' || item.type === 'shelf' || item.type === 'drawer'
    ) || [];

    const totalStorage = storageAreas.reduce((sum, item) => 
      sum + (item.width * item.height * item.depth), 0
    );

    const roomVolume = design.roomDimensions.width * 
                    design.roomDimensions.height * 
                    design.roomDimensions.depth;

    const utilization = totalStorage / roomVolume;

    return { utilization, totalStorage, roomVolume };
  }

  static analyzeStyle(design) {
    const styleElements = design.furniture?.map(item => item.style) || [];
    const uniqueStyles = [...new Set(styleElements)];
    const mostCommon = this.getMostCommon(styleElements);
    const consistency = mostCommon ? 
      styleElements.filter(s => s === mostCommon).length / styleElements.length : 0;

    return { consistency, mostCommon, uniqueStyles };
  }

  static findPathways(design) {
    // Simplified pathway detection
    const pathways = [];
    design.furniture?.forEach(item => {
      if (item.type === 'door' || item.type === 'opening') {
        pathways.push({
          from: item.position,
          to: this.findNearestOpening(item.position, design.furniture)
        });
      }
    });
    return pathways;
  }

  static countIntersections(pathways) {
    let intersections = 0;
    for (let i = 0; i < pathways.length; i++) {
      for (let j = i + 1; j < pathways.length; j++) {
        if (this.doIntersect(pathways[i], pathways[j])) {
          intersections++;
        }
      }
    }
    return intersections;
  }

  static doIntersect(path1, path2) {
    // Simplified intersection check
    return Math.abs(path1.from.x - path2.from.x) < 10 && 
           Math.abs(path1.from.y - path2.from.y) < 10;
  }

  static findNearestOpening(position, furniture) {
    const openings = furniture.filter(item => 
      item.type === 'door' || item.type === 'opening'
    );
    
    let nearest = null;
    let minDistance = Infinity;

    openings.forEach(opening => {
      const distance = this.getDistance(position, opening.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = opening;
      }
    });

    return nearest;
  }

  static getMostCommon(array) {
    const counts = {};
    array.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );
  }
}

export default FloorplanMLUtils;
