// Floorplan Analysis Models
import * as tf from '@tensorflow/tfjs';
import { FloorplanMLUtils } from './floorplan-ml-utils.js';

export class FloorplanAnalyzer {
  constructor() {
    this.layoutModel = null;
    this.complianceModel = null;
    this.preferenceModel = null;
    this.initialized = false;
  }

  async initialize() {
    console.log('Initializing Floorplan Analyzer...');
    
    // Create models
    this.layoutModel = this.createLayoutOptimizationModel();
    this.complianceModel = this.createComplianceModel();
    this.preferenceModel = this.createPreferenceModel();
    
    this.initialized = true;
    console.log('Floorplan Analyzer initialized');
  }

  createLayoutOptimizationModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 2 }) // x, y optimization
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  createComplianceModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [12], units: 24, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }) // compliance score
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  createPreferenceModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 20, activation: 'relu' }),
        tf.layers.dense({ units: 15, activation: 'relu' }),
        tf.layers.dense({ units: 10, activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'softmax' }) // preference categories
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  async analyzeLayout(floorplanData) {
    if (!this.initialized) {
      throw new Error('FloorplanAnalyzer not initialized');
    }

    try {
      // Extract features from floorplan
      const features = this.extractLayoutFeatures(floorplanData);
      const inputTensor = FloorplanMLUtils.createTensor([features]);

      // Get optimization suggestions
      const optimization = await this.layoutModel.predict(inputTensor);
      const optimizationData = await optimization.data();

      // Convert back to coordinates
      const suggestions = this.convertToOptimizationSuggestions(optimizationData, floorplanData);

      return {
        suggestions,
        confidence: this.calculateConfidence(optimizationData),
        originalFeatures: features
      };
    } catch (error) {
      console.error('Layout analysis failed:', error);
      throw error;
    }
  }

  async checkCompliance(floorplanData, standards = 'NKBA') {
    if (!this.initialized) {
      throw new Error('FloorplanAnalyzer not initialized');
    }

    try {
      const features = this.extractComplianceFeatures(floorplanData);
      const inputTensor = FloorplanMLUtils.createTensor([features]);

      const compliance = await this.complianceModel.predict(inputTensor);
      const complianceData = await compliance.data();

      // Also run rule-based checks
      const ruleBasedCompliance = FloorplanMLUtils.checkNKBACompliance(floorplanData);

      return {
        mlScore: complianceData[0],
        ruleBased: ruleBasedCompliance,
        overallScore: (complianceData[0] + ruleBasedCompliance.score) / 2,
        violations: ruleBasedCompliance.violations,
        compliant: ruleBasedCompliance.compliant && complianceData[0] > 0.7
      };
    } catch (error) {
      console.error('Compliance check failed:', error);
      throw error;
    }
  }

  async predictUserPreferences(floorplanData, userProfile) {
    if (!this.initialized) {
      throw new Error('FloorplanAnalyzer not initialized');
    }

    try {
      const features = this.extractPreferenceFeatures(floorplanData, userProfile);
      const inputTensor = FloorplanMLUtils.createTensor([features]);

      const preferences = await this.preferenceModel.predict(inputTensor);
      const preferenceData = await preferences.data();

      return this.convertToPreferences(preferenceData);
    } catch (error) {
      console.error('Preference prediction failed:', error);
      throw error;
    }
  }

  extractLayoutFeatures(floorplanData) {
    const { rooms, furniture, dimensions } = floorplanData;
    
    return [
      dimensions.width / dimensions.height, // aspect ratio
      rooms.length, // room count
      furniture.length, // furniture count
      this.calculateAverageRoomSize(rooms), // avg room size
      this.calculateFurnitureDensity(furniture, dimensions), // furniture density
      this.calculateOpenSpaceRatio(furniture, dimensions), // open space ratio
      this.calculateConnectivity(rooms), // room connectivity
      this.calculateNaturalLightAccess(floorplanData) // natural light
    ];
  }

  extractComplianceFeatures(floorplanData) {
    const { rooms, appliances, doors, windows } = floorplanData;
    
    return [
      this.calculateWorkTriangleScore(appliances),
      this.calculateClearanceScore(appliances, furniture),
      this.calculateAccessibilityScore(doors, rooms),
      this.calculateVentilationScore(windows, rooms),
      this.calculateSafetyScore(appliances, rooms),
      this.calculateEgressScore(doors, rooms),
      rooms.length,
      appliances.length,
      this.getTotalSquareFootage(rooms),
      this.calculateCirculationPath(doors, rooms),
      this.calculatePlumbingAccess(appliances, rooms),
      this.calculateElectricalAccess(appliances, rooms),
      this.calculateStorageAdequacy(floorplanData)
    ];
  }

  extractPreferenceFeatures(floorplanData, userProfile) {
    return [
      userProfile.age || 35,
      userProfile.familySize || 4,
      userProfile.income || 75000,
      floorplanData.style === 'modern' ? 1 : 0,
      floorplanData.style === 'traditional' ? 1 : 0,
      floorplanData.style === 'minimal' ? 1 : 0,
      this.calculateFunctionalityScore(floorplanData),
      this.calculateAestheticScore(floorplanData),
      this.calculateBudgetEfficiency(floorplanData, userProfile.budget)
    ];
  }

  // Helper methods
  calculateAverageRoomSize(rooms) {
    const totalArea = rooms.reduce((sum, room) => sum + (room.width * room.height), 0);
    return totalArea / rooms.length;
  }

  calculateFurnitureDensity(furniture, dimensions) {
    const furnitureArea = furniture.reduce((sum, item) => sum + (item.width * item.height), 0);
    const totalArea = dimensions.width * dimensions.height;
    return furnitureArea / totalArea;
  }

  calculateOpenSpaceRatio(furniture, dimensions) {
    const furnitureArea = furniture.reduce((sum, item) => sum + (item.width * item.height), 0);
    const totalArea = dimensions.width * dimensions.height;
    return (totalArea - furnitureArea) / totalArea;
  }

  calculateConnectivity(rooms) {
    let connections = 0;
    const maxConnections = rooms.length * (rooms.length - 1) / 2;
    
    rooms.forEach((room, i) => {
      rooms.forEach((otherRoom, j) => {
        if (i < j && this.areRoomsConnected(room, otherRoom)) {
          connections++;
        }
      });
    });

    return connections / maxConnections;
  }

  calculateNaturalLightAccess(floorplanData) {
    const { windows, rooms } = floorplanData;
    let litRooms = 0;
    
    rooms.forEach(room => {
      const hasWindow = windows.some(window => 
        this.isWindowInRoom(window, room)
      );
      if (hasWindow) litRooms++;
    });

    return litRooms / rooms.length;
  }

  calculateWorkTriangleScore(appliances) {
    const workTriangle = FloorplanMLUtils.calculateWorkTriangle({ appliances });
    if (!workTriangle) return 0;
    
    // Score based on NKBA standards (optimal: 12-26 feet)
    if (workTriangle.perimeter >= 12 && workTriangle.perimeter <= 26) {
      return 1.0;
    } else if (workTriangle.perimeter < 12) {
      return workTriangle.perimeter / 12;
    } else {
      return Math.max(0, 1 - (workTriangle.perimeter - 26) / 20);
    }
  }

  calculateClearanceScore(appliances, furniture) {
    let totalClearance = 0;
    let applianceCount = 0;

    appliances.forEach(appliance => {
      const clearance = FloorplanMLUtils.checkClearance(appliance, furniture);
      const required = FloorplanMLUtils.getRequiredClearance(appliance.type);
      totalClearance += Math.min(1, clearance / required);
      applianceCount++;
    });

    return applianceCount > 0 ? totalClearance / applianceCount : 1;
  }

  calculateAccessibilityScore(doors, rooms) {
    let accessibleRooms = 0;
    
    rooms.forEach(room => {
      const hasAccessibleDoor = doors.some(door => 
        this.isDoorAccessible(door, room)
      );
      if (hasAccessibleDoor) accessibleRooms++;
    });

    return accessibleRooms / rooms.length;
  }

  calculateVentilationScore(windows, rooms) {
    let ventilatedRooms = 0;
    
    rooms.forEach(room => {
      const hasVentilation = windows.some(window => 
        this.isWindowInRoom(window, room) && window.operable
      );
      if (hasVentilation) ventilatedRooms++;
    });

    return ventilatedRooms / rooms.length;
  }

  calculateSafetyScore(appliances, rooms) {
    // Check for safety hazards
    let safetyScore = 1.0;
    
    appliances.forEach(appliance => {
      if (this.isSafetyHazard(appliance, rooms)) {
        safetyScore -= 0.2;
      }
    });

    return Math.max(0, safetyScore);
  }

  calculateEgressScore(doors, rooms) {
    // Check emergency egress paths
    const exteriorDoors = doors.filter(door => door.type === 'exterior');
    return Math.min(1, exteriorDoors.length / Math.ceil(rooms.length / 3));
  }

  calculateTotalSquareFootage(rooms) {
    return rooms.reduce((sum, room) => sum + (room.width * room.height), 0);
  }

  calculateCirculationPath(doors, rooms) {
    // Simplified circulation analysis
    return doors.length >= 2 ? 1 : 0.5;
  }

  calculatePlumbingAccess(appliances, rooms) {
    const plumbingAppliances = appliances.filter(a => 
      ['sink', 'toilet', 'shower', 'bathtub'].includes(a.type)
    );
    
    let accessiblePlumbing = 0;
    plumbingAppliances.forEach(appliance => {
      if (this.hasPlumbingAccess(appliance, rooms)) {
        accessiblePlumbing++;
      }
    });

    return plumbingAppliances.length > 0 ? accessiblePlumbing / plumbingAppliances.length : 1;
  }

  calculateElectricalAccess(appliances, rooms) {
    const electricalAppliances = appliances.filter(a => 
      ['stove', 'oven', 'refrigerator', 'dishwasher', 'microwave'].includes(a.type)
    );
    
    let accessibleElectrical = 0;
    electricalAppliances.forEach(appliance => {
      if (this.hasElectricalAccess(appliance, rooms)) {
        accessibleElectrical++;
      }
    });

    return electricalAppliances.length > 0 ? accessibleElectrical / electricalAppliances.length : 1;
  }

  calculateStorageAdequacy(floorplanData) {
    const { rooms, furniture } = floorplanData;
    const storageFurniture = furniture.filter(item => 
      ['cabinet', 'shelf', 'drawer', 'closet'].includes(item.type)
    );
    
    const totalStorage = storageFurniture.reduce((sum, item) => 
      sum + (item.width * item.height * item.depth), 0
    );
    
    const totalVolume = rooms.reduce((sum, room) => 
      sum + (room.width * room.height * 8), 0
    ); // Assuming 8ft ceiling height

    return Math.min(1, totalStorage / (totalVolume * 0.1)); // 10% of volume for storage
  }

  areRoomsConnected(room1, room2) {
    return room1.connections && room1.connections.includes(room2.id);
  }

  isWindowInRoom(window, room) {
    return window.roomId === room.id;
  }

  isDoorAccessible(door, room) {
    return door.roomId === room.id && door.width >= 32; // 32 inches minimum
  }

  isSafetyHazard(appliance, rooms) {
    // Check for hazardous placements
    return appliance.type === 'stove' && 
           this.isNearFlammable(appliance, rooms);
  }

  isNearFlammable(appliance, rooms) {
    // Simplified check for flammable materials nearby
    return false; // Would need more detailed room data
  }

  hasPlumbingAccess(appliance, rooms) {
    // Check if appliance has access to plumbing
    return rooms.some(room => 
      room.id === appliance.roomId && room.hasPlumbing
    );
  }

  hasElectricalAccess(appliance, rooms) {
    // Check if appliance has access to electrical
    return rooms.some(room => 
      room.id === appliance.roomId && room.hasElectrical
    );
  }

  calculateFunctionalityScore(floorplanData) {
    const { rooms, furniture } = floorplanData;
    
    // Score based on functional layout
    let score = 0.5; // Base score
    
    // Bonus for good room flow
    score += this.calculateConnectivity(rooms) * 0.2;
    
    // Bonus for adequate storage
    score += this.calculateStorageAdequacy(floorplanData) * 0.2;
    
    // Bonus for good circulation
    score += this.calculateCirculationPath([], rooms) * 0.1;
    
    return Math.min(1, score);
  }

  calculateAestheticScore(floorplanData) {
    // Simplified aesthetic scoring
    const { rooms, furniture } = floorplanData;
    
    let score = 0.5; // Base score
    
    // Bonus for balanced room proportions
    const avgAspect = rooms.reduce((sum, room) => 
      sum + (room.width / room.height), 0) / rooms.length;
    if (avgAspect >= 0.8 && avgAspect <= 1.5) score += 0.2;
    
    // Bonus for furniture arrangement
    const balance = this.calculateFurnitureBalance(furniture);
    score += balance * 0.2;
    
    // Bonus for style consistency
    const consistency = this.calculateStyleConsistency(furniture);
    score += consistency * 0.1;
    
    return Math.min(1, score);
  }

  calculateBudgetEfficiency(floorplanData, budget) {
    const estimatedCost = FloorplanMLUtils.estimateCost(floorplanData, {});
    return budget >= estimatedCost.total ? 1 : budget / estimatedCost.total;
  }

  calculateFurnitureBalance(furniture) {
    // Simple balance calculation
    const leftSide = furniture.filter(item => item.x < 50).length;
    const rightSide = furniture.filter(item => item.x >= 50).length;
    const total = furniture.length;
    
    return total > 0 ? 1 - Math.abs(leftSide - rightSide) / total : 1;
  }

  calculateStyleConsistency(furniture) {
    const styles = furniture.map(item => item.style).filter(Boolean);
    if (styles.length === 0) return 1;
    
    const mostCommon = this.getMostCommon(styles);
    const consistent = styles.filter(style => style === mostCommon).length;
    
    return consistent / styles.length;
  }

  getMostCommon(array) {
    const counts = {};
    array.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );
  }

  convertToOptimizationSuggestions(optimizationData, originalData) {
    const [optX, optY] = optimizationData;
    
    return [
      {
        type: 'position',
        item: 'furniture_group',
        current: { x: 50, y: 50 },
        suggested: { x: optX * 100, y: optY * 100 },
        impact: 'traffic_flow',
        confidence: 0.8
      }
    ];
  }

  convertToPreferences(preferenceData) {
    const categories = ['modern', 'traditional', 'minimal', 'industrial', 'rustic'];
    const maxIndex = preferenceData.indexOf(Math.max(...preferenceData));
    
    return {
      preferredStyle: categories[maxIndex],
      confidence: preferenceData[maxIndex],
      allScores: categories.map((cat, i) => ({
        style: cat,
        score: preferenceData[i]
      }))
    };
  }

  calculateConfidence(predictionData) {
    // Simple confidence calculation based on prediction variance
    const variance = this.calculateVariance(predictionData);
    return Math.max(0.5, 1 - variance);
  }

  calculateVariance(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  }

  async trainModels(trainingData) {
    console.log('Training Floorplan Analyzer models...');
    
    // Train layout optimization model
    const layoutFeatures = trainingData.map(d => this.extractLayoutFeatures(d.floorplan));
    const layoutLabels = trainingData.map(d => d.optimization);
    
    await FloorplanMLUtils.trainModel(
      this.layoutModel,
      FloorplanMLUtils.createTensor(layoutFeatures),
      FloorplanMLUtils.createTensor(layoutLabels),
      50
    );

    // Train compliance model
    const complianceFeatures = trainingData.map(d => this.extractComplianceFeatures(d.floorplan));
    const complianceLabels = trainingData.map(d => d.compliant ? 1 : 0);
    
    await FloorplanMLUtils.trainModel(
      this.complianceModel,
      FloorplanMLUtils.createTensor(complianceFeatures),
      FloorplanMLUtils.createTensor(complianceLabels),
      30
    );

    // Train preference model
    const preferenceFeatures = trainingData.map(d => 
      this.extractPreferenceFeatures(d.floorplan, d.userProfile)
    );
    const preferenceLabels = trainingData.map(d => d.preferredStyle);
    
    await FloorplanMLUtils.trainModel(
      this.preferenceModel,
      FloorplanMLUtils.createTensor(preferenceFeatures),
      FloorplanMLUtils.createTensor(preferenceLabels),
      40
    );

    console.log('Model training completed');
  }

  async saveModels() {
    const models = {
      layout: await this.layoutModel.save('localstorage://layout-model'),
      compliance: await this.complianceModel.save('localstorage://compliance-model'),
      preference: await this.preferenceModel.save('localstorage://preference-model')
    };
    
    console.log('Models saved to local storage');
    return models;
  }

  async loadModels() {
    try {
      this.layoutModel = await tf.loadLayersModel('localstorage://layout-model');
      this.complianceModel = await tf.loadLayersModel('localstorage://compliance-model');
      this.preferenceModel = await tf.loadLayersModel('localstorage://preference-model');
      
      console.log('Models loaded from local storage');
      return true;
    } catch (error) {
      console.warn('Could not load models from storage:', error);
      return false;
    }
  }
}

export default FloorplanAnalyzer;
