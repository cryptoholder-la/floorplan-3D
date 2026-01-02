// ML Training Dataset Generator for Floorplan 3D
import natural from 'natural';
import { FloorplanMLUtils } from './floorplan-ml-utils.js';

export class DatasetGenerator {
  constructor() {
    this.datasets = {
      layouts: [],
      compliance: [],
      preferences: [],
      materials: [],
      costs: []
    };
    this.syntheticData = true;
  }

  // Generate synthetic training data for ML models
  generateSyntheticDataset(size = 1000) {
    console.log(`Generating synthetic dataset with ${size} samples...`);
    
    for (let i = 0; i < size; i++) {
      const floorplan = this.generateRandomFloorplan();
      const compliance = FloorplanMLUtils.checkNKBACompliance(floorplan);
      const optimization = this.generateOptimizationData(floorplan);
      const preferences = this.generatePreferenceData(floorplan);
      const materials = this.generateMaterialData(floorplan);
      const costs = FloorplanMLUtils.estimateCost(floorplan, materials);

      this.datasets.layouts.push({
        id: `sample_${i}`,
        floorplan,
        compliance,
        optimization,
        preferences,
        materials,
        costs,
        timestamp: Date.now()
      });
    }

    console.log(`Generated ${this.datasets.layouts.length} synthetic samples`);
    return this.datasets;
  }

  generateRandomFloorplan() {
    const roomCount = Math.floor(Math.random() * 6) + 1; // 1-6 rooms
    const rooms = this.generateRooms(roomCount);
    const furniture = this.generateFurniture(rooms);
    const appliances = this.generateAppliances(rooms);
    const doors = this.generateDoors(rooms);
    const windows = this.generateWindows(rooms);

    return {
      id: `floorplan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.getRandomRoomType(),
      style: this.getRandomStyle(),
      totalArea: this.calculateTotalArea(rooms),
      roomCount,
      dimensions: this.getOverallDimensions(rooms),
      rooms,
      furniture,
      appliances,
      doors,
      windows,
      budget: Math.random() * 100000 + 20000, // $20k-$120k
      priority: this.getRandomPriority(),
      complexity: Math.random() * 5 + 1 // 1-5 complexity score
    };
  }

  generateRooms(count) {
    const rooms = [];
    const roomTypes = ['kitchen', 'bedroom', 'bathroom', 'living', 'dining', 'office'];
    
    for (let i = 0; i < count; i++) {
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const room = {
        id: `room_${i}`,
        type: roomType,
        name: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${i + 1}`,
        x: Math.random() * 80 + 10, // 10-90% position
        y: Math.random() * 80 + 10,
        width: Math.random() * 200 + 100, // 100-300 sq ft
        height: Math.random() * 200 + 100,
        depth: 8, // Standard ceiling height
        hasPlumbing: ['kitchen', 'bathroom'].includes(roomType),
        hasElectrical: true,
        hasWindows: Math.random() > 0.2,
        connections: this.generateRoomConnections(i, count)
      };
      rooms.push(room);
    }
    
    return rooms;
  }

  generateFurniture(rooms) {
    const furniture = [];
    const furnitureTypes = {
      kitchen: ['sink', 'stove', 'refrigerator', 'dishwasher', 'cabinet', 'island'],
      bedroom: ['bed', 'dresser', 'nightstand', 'closet', 'desk', 'chair'],
      bathroom: ['toilet', 'sink', 'shower', 'bathtub', 'vanity', 'cabinet'],
      living: ['sofa', 'chair', 'table', 'tv_stand', 'bookshelf', 'coffee_table'],
      dining: ['table', 'chair', 'buffet', 'china_cabinet'],
      office: ['desk', 'chair', 'bookshelf', 'filing_cabinet', 'printer_stand']
    };

    rooms.forEach((room, roomIndex) => {
      const roomFurniture = furnitureTypes[room.type] || [];
      const itemCount = Math.floor(Math.random() * 5) + 2; // 2-6 items per room
      
      for (let i = 0; i < itemCount; i++) {
        const furnitureType = roomFurniture[Math.floor(Math.random() * roomFurniture.length)];
        const item = {
          id: `furniture_${roomIndex}_${i}`,
          type: furnitureType,
          room: room.id,
          x: room.x + Math.random() * room.width,
          y: room.y + Math.random() * room.height,
          width: this.getFurnitureDimensions(furnitureType).width,
          height: this.getFurnitureDimensions(furnitureType).height,
          depth: this.getFurnitureDimensions(furnitureType).depth,
          style: this.getRandomStyle(),
          material: this.getRandomMaterial(),
          movable: ['chair', 'table', 'desk'].includes(furnitureType)
        };
        furniture.push(item);
      }
    });

    return furniture;
  }

  generateAppliances(rooms) {
    const appliances = [];
    const applianceTypes = {
      kitchen: ['stove', 'refrigerator', 'dishwasher', 'microwave', 'oven'],
      bathroom: ['toilet', 'sink', 'shower', 'bathtub'],
      laundry: ['washer', 'dryer']
    };

    rooms.forEach(room => {
      const roomAppliances = applianceTypes[room.type] || [];
      const applianceCount = Math.floor(Math.random() * 3) + 1; // 1-3 appliances
      
      for (let i = 0; i < applianceCount; i++) {
        const applianceType = roomAppliances[Math.floor(Math.random() * roomAppliances.length)];
        const appliance = {
          id: `appliance_${room.id}_${i}`,
          type: applianceType,
          room: room.id,
          x: room.x + Math.random() * room.width,
          y: room.y + Math.random() * room.height,
          width: this.getApplianceDimensions(applianceType).width,
          height: this.getApplianceDimensions(applianceType).height,
          depth: this.getApplianceDimensions(applianceType).depth,
          energy: Math.random() * 2000 + 500, // 500-2500 watts
          age: Math.floor(Math.random() * 15) + 1, // 1-15 years old
          brand: this.getRandomBrand()
        };
        appliances.push(appliance);
      }
    });

    return appliances;
  }

  generateDoors(rooms) {
    const doors = [];
    
    rooms.forEach((room, index) => {
      const doorCount = Math.floor(Math.random() * 2) + 1; // 1-2 doors per room
      
      for (let i = 0; i < doorCount; i++) {
        const door = {
          id: `door_${room.id}_${i}`,
          room: room.id,
          type: index === 0 ? 'exterior' : 'interior',
          x: room.x + (i === 0 ? room.width / 2 : Math.random() * room.width),
          y: room.y + (i === 1 ? room.height : 0),
          width: Math.random() * 12 + 30, // 30-42 inches
          height: 80, // Standard door height
          swing: Math.random() > 0.5 ? 'inward' : 'outward',
          material: 'wood'
        };
        doors.push(door);
      }
    });

    return doors;
  }

  generateWindows(rooms) {
    const windows = [];
    
    rooms.forEach(room => {
      if (room.hasWindows) {
        const windowCount = Math.floor(Math.random() * 3) + 1; // 1-3 windows per room
        
        for (let i = 0; i < windowCount; i++) {
          const window = {
            id: `window_${room.id}_${i}`,
            room: room.id,
            x: room.x + Math.random() * room.width,
            y: room.y + Math.random() * room.height,
            width: Math.random() * 36 + 24, // 24-60 inches
            height: Math.random() * 24 + 36, // 36-60 inches
            operable: Math.random() > 0.3,
            type: this.getRandomWindowType(),
            material: 'glass'
          };
          windows.push(window);
        }
      }
    });

    return windows;
  }

  generateRoomConnections(roomIndex, totalRooms) {
    const connections = [];
    const connectionCount = Math.min(3, Math.floor(Math.random() * 3) + 1); // 1-3 connections
    
    for (let i = 0; i < connectionCount; i++) {
      let targetRoom;
      do {
        targetRoom = Math.floor(Math.random() * totalRooms);
      } while (targetRoom === roomIndex);
      
      connections.push(`room_${targetRoom}`);
    }
    
    return [...new Set(connections)]; // Remove duplicates
  }

  generateOptimizationData(floorplan) {
    return {
      trafficFlow: Math.random() * 0.5 + 0.5, // 0.5-1.0 efficiency
      spaceUtilization: Math.random() * 0.4 + 0.6, // 0.6-1.0 utilization
      accessibility: Math.random() * 0.3 + 0.7, // 0.7-1.0 accessibility
      naturalLight: Math.random() * 0.4 + 0.6, // 0.6-1.0 natural light
      storageEfficiency: Math.random() * 0.3 + 0.7, // 0.7-1.0 storage
      workflow: Math.random() * 0.4 + 0.6 // 0.6-1.0 workflow
    };
  }

  generatePreferenceData(floorplan) {
    return {
      style: this.getRandomStyle(),
      functionality: Math.random() * 0.4 + 0.6,
      aesthetics: Math.random() * 0.3 + 0.7,
      budget: Math.random() * 0.3 + 0.7,
      satisfaction: Math.random() * 0.4 + 0.6,
      wouldRecommend: Math.random() > 0.3,
      userDemographics: {
        age: Math.floor(Math.random() * 50) + 25, // 25-75 years
        familySize: Math.floor(Math.random() * 5) + 1, // 1-6 people
        income: Math.floor(Math.random() * 150000) + 30000, // $30k-$180k
        location: this.getRandomLocation(),
        lifestyle: this.getRandomLifestyle()
      }
    };
  }

  generateMaterialData(floorplan) {
    const materials = ['wood', 'metal', 'glass', 'stone', 'composite', 'plastic'];
    const materialCosts = {};
    
    materials.forEach(material => {
      materialCosts[material] = {
        cost: Math.random() * 50 + 10, // $10-60 per unit
        durability: Math.random() * 10 + 5, // 5-15 years
        maintenance: Math.random() * 0.3 + 0.1, // 10-40% annual maintenance
        sustainability: Math.random() * 0.8 + 0.2, // 20-100% sustainable
        availability: Math.random() * 0.3 + 0.7 // 70-100% available
      };
    });

    return materialCosts;
  }

  // Helper methods
  getRandomRoomType() {
    const types = ['kitchen', 'bedroom', 'bathroom', 'living', 'dining', 'office', 'laundry'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getRandomStyle() {
    const styles = ['modern', 'traditional', 'minimal', 'industrial', 'rustic', 'contemporary'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  getRandomMaterial() {
    const materials = ['wood', 'metal', 'glass', 'stone', 'fabric', 'plastic'];
    return materials[Math.floor(Math.random() * materials.length)];
  }

  getRandomPriority() {
    const priorities = ['functionality', 'aesthetics', 'budget', 'sustainability', 'accessibility'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  getRandomBrand() {
    const brands = ['Samsung', 'LG', 'Whirlpool', 'GE', 'Bosch', 'KitchenAid', 'Frigidaire'];
    return brands[Math.floor(Math.random() * brands.length)];
  }

  getRandomWindowType() {
    const types = ['single_hung', 'double_hung', 'casement', 'slider', 'bay', 'picture'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getRandomLocation() {
    const locations = ['urban', 'suburban', 'rural', 'coastal', 'mountain'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getRandomLifestyle() {
    const lifestyles = ['minimal', 'family', 'entertaining', 'remote_work', 'retirement'];
    return lifestyles[Math.floor(Math.random() * lifestyles.length)];
  }

  getFurnitureDimensions(type) {
    const dimensions = {
      sink: { width: 24, height: 18, depth: 22 },
      stove: { width: 30, height: 36, depth: 26 },
      refrigerator: { width: 36, height: 70, depth: 30 },
      dishwasher: { width: 24, height: 35, depth: 24 },
      cabinet: { width: 36, height: 84, depth: 24 },
      island: { width: 48, height: 36, depth: 36 },
      bed: { width: 60, height: 80, depth: 80 },
      dresser: { width: 48, height: 36, depth: 20 },
      nightstand: { width: 24, height: 24, depth: 18 },
      closet: { width: 72, height: 84, depth: 24 },
      desk: { width: 48, height: 30, depth: 24 },
      chair: { width: 24, height: 36, depth: 24 },
      sofa: { width: 84, height: 36, depth: 36 },
      table: { width: 48, height: 30, depth: 36 },
      tv_stand: { width: 48, height: 24, depth: 16 }
    };
    return dimensions[type] || { width: 36, height: 36, depth: 24 };
  }

  getApplianceDimensions(type) {
    const dimensions = {
      stove: { width: 30, height: 36, depth: 26 },
      refrigerator: { width: 36, height: 70, depth: 30 },
      dishwasher: { width: 24, height: 35, depth: 24 },
      microwave: { width: 24, height: 14, depth: 18 },
      oven: { width: 30, height: 36, depth: 26 },
      toilet: { width: 30, height: 30, depth: 28 },
      shower: { width: 36, height: 72, depth: 36 },
      bathtub: { width: 60, height: 30, depth: 60 },
      washer: { width: 27, height: 36, depth: 30 },
      dryer: { width: 27, height: 36, depth: 30 }
    };
    return dimensions[type] || { width: 30, height: 36, depth: 30 };
  }

  calculateTotalArea(rooms) {
    return rooms.reduce((sum, room) => sum + (room.width * room.height), 0);
  }

  getOverallDimensions(rooms) {
    const maxX = Math.max(...rooms.map(r => r.x + r.width));
    const maxY = Math.max(...rooms.map(r => r.y + r.height));
    return { width: maxX, height: maxY };
  }

  // Export datasets for training
  exportDatasets(format = 'json') {
    const exportData = {
      metadata: {
        generated: new Date().toISOString(),
        sampleCount: this.datasets.layouts.length,
        synthetic: this.syntheticData,
        version: '1.0.0'
      },
      datasets: this.datasets
    };

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        return this.convertToCSV(exportData);
      case 'tensorflow':
        return this.convertToTensorFlowFormat(exportData);
      default:
        return exportData;
    }
  }

  convertToCSV(data) {
    const headers = [
      'id', 'room_count', 'total_area', 'style', 'budget',
      'compliance_score', 'traffic_flow', 'space_utilization',
      'functionality', 'aesthetics', 'satisfaction'
    ];

    const rows = data.datasets.layouts.map(sample => [
      sample.id,
      sample.floorplan.roomCount,
      sample.floorplan.totalArea,
      sample.floorplan.style,
      sample.floorplan.budget,
      sample.compliance.score,
      sample.optimization.trafficFlow,
      sample.optimization.spaceUtilization,
      sample.preferences.functionality,
      sample.preferences.aesthetics,
      sample.preferences.satisfaction
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  convertToTensorFlowFormat(data) {
    return {
      features: data.datasets.layouts.map(sample => ({
        roomCount: sample.floorplan.roomCount,
        totalArea: sample.floorplan.totalArea,
        budget: sample.floorplan.budget,
        style: this.encodeStyle(sample.floorplan.style)
      })),
      labels: {
        compliance: data.datasets.layouts.map(sample => sample.compliance.score / 100),
        optimization: data.datasets.layouts.map(sample => sample.optimization.trafficFlow),
        satisfaction: data.datasets.layouts.map(sample => sample.preferences.satisfaction / 100)
      }
    };
  }

  encodeStyle(style) {
    const styles = ['modern', 'traditional', 'minimal', 'industrial', 'rustic', 'contemporary'];
    const encoding = new Array(styles.length).fill(0);
    const index = styles.indexOf(style);
    if (index !== -1) encoding[index] = 1;
    return encoding;
  }

  // Load real user data (placeholder for future implementation)
  async loadUserData() {
    // This would load real user interaction data
    // For now, return synthetic data
    return this.generateSyntheticDataset(100);
  }

  // Save training data
  async saveTrainingData(filename = 'floorplan-training-data') {
    const data = this.exportDatasets('json');
    
    try {
      // In browser environment, use localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(filename, data);
        console.log(`Training data saved to localStorage: ${filename}`);
      } else {
        // In Node.js environment, save to file
        const fs = require('fs');
        fs.writeFileSync(`${filename}.json`, data);
        console.log(`Training data saved to file: ${filename}.json`);
      }
    } catch (error) {
      console.error('Failed to save training data:', error);
    }
  }

  // Generate training reports
  generateTrainingReport() {
    const report = {
      summary: {
        totalSamples: this.datasets.layouts.length,
        generationDate: new Date().toISOString(),
        syntheticData: this.syntheticData,
        dataQuality: this.assessDataQuality()
      },
      statistics: {
        roomTypes: this.calculateRoomTypeStats(),
        styles: this.calculateStyleStats(),
        compliance: this.calculateComplianceStats(),
        budgets: this.calculateBudgetStats()
      },
      recommendations: this.generateTrainingRecommendations()
    };

    return report;
  }

  assessDataQuality() {
    const samples = this.datasets.layouts;
    
    return {
      completeness: samples.filter(s => s.floorplan && s.compliance && s.preferences).length / samples.length,
      diversity: {
        roomTypes: [...new Set(samples.map(s => s.floorplan.type))].length,
        styles: [...new Set(samples.map(s => s.floorplan.style))].length,
        budgets: this.calculateBudgetRange(samples)
      },
      balance: this.calculateClassBalance(samples)
    };
  }

  calculateRoomTypeStats() {
    const samples = this.datasets.layouts;
    const typeCounts = {};
    
    samples.forEach(sample => {
      const type = sample.floorplan.type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return typeCounts;
  }

  calculateStyleStats() {
    const samples = this.datasets.layouts;
    const styleCounts = {};
    
    samples.forEach(sample => {
      const style = sample.floorplan.style;
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });

    return styleCounts;
  }

  calculateComplianceStats() {
    const samples = this.datasets.layouts;
    const scores = samples.map(s => s.compliance.score);
    
    return {
      mean: scores.reduce((a, b) => a + b, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores),
      median: this.calculateMedian(scores)
    };
  }

  calculateBudgetStats() {
    const samples = this.datasets.layouts;
    const budgets = samples.map(s => s.floorplan.budget);
    
    return {
      mean: budgets.reduce((a, b) => a + b, 0) / budgets.length,
      min: Math.min(...budgets),
      max: Math.max(...budgets),
      median: this.calculateMedian(budgets)
    };
  }

  calculateBudgetRange(samples) {
    const budgets = samples.map(s => s.floorplan.budget);
    return {
      min: Math.min(...budgets),
      max: Math.max(...budgets),
      range: Math.max(...budgets) - Math.min(...budgets)
    };
  }

  calculateClassBalance(samples) {
    const styles = [...new Set(samples.map(s => s.floorplan.style))];
    const balance = {};
    
    styles.forEach(style => {
      const count = samples.filter(s => s.floorplan.style === style).length;
      balance[style] = count / samples.length;
    });

    return balance;
  }

  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  generateTrainingRecommendations() {
    const quality = this.assessDataQuality();
    const recommendations = [];

    if (quality.completeness < 0.9) {
      recommendations.push({
        type: 'data_quality',
        priority: 'high',
        message: 'Some samples have incomplete data. Consider data cleaning.',
        impact: 'model_accuracy'
      });
    }

    if (quality.diversity.roomTypes < 4) {
      recommendations.push({
        type: 'data_diversity',
        priority: 'medium',
        message: 'Limited room type diversity. Generate more varied samples.',
        impact: 'model_generalization'
      });
    }

    Object.entries(quality.balance).forEach(([style, ratio]) => {
      if (ratio < 0.1) {
        recommendations.push({
          type: 'class_balance',
          priority: 'medium',
          message: `Underrepresented style: ${style}. Balance the dataset.`,
          impact: 'model_bias'
        });
      }
    });

    return recommendations;
  }
}

export default DatasetGenerator;
