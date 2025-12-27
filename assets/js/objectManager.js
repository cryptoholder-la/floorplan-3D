import * as THREE from 'three';
import { ObjectManagerCore } from './core/object-system/ObjectManagerCore.js';
import { ObjectCreationService } from './services/ObjectCreationService.js';
import { ObjectSyncService } from './services/ObjectSyncService.js';
import { templates, managementConfig, wallDefaults } from './objectManagerConfig.js';

/**
 * @tweakable Main object manager configuration for refactored architecture
 */
const refactoredConfig = {
    enableModularServices: true,
    enableAdvancedObjectSystem: true,
    enablePerformanceMonitoring: true,
    maxObjectsPerBatch: 50
};

export class ObjectManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.objects = [];
        this.wallObjects = [];
        this.selectedObject = null;

        this.managementConfig = managementConfig;
        this.wallDefaults = wallDefaults;
        this.templates = templates;

        /**
         * @tweakable Service initialization for modular architecture
         */
        if (refactoredConfig.enableModularServices) {
            this.core = new ObjectManagerCore(sceneManager);
            this.creationService = new ObjectCreationService(this.core);
            this.syncService = new ObjectSyncService(this.core);
        }

        // Initialize new systems
        this.kitchenCatalog = new KitchenCatalog();
        
        /**
         * @tweakable Enhanced object management configuration for implementing unused features
         */
        this.enhancedManagementConfig = {
            enableAdvancedObjectSystem: true,
            enableStateManagement: true,
            enableBidirectionalSync: true,
            enablePerformanceOptimization: true
        };
        
        if (this.enhancedManagementConfig.enableAdvancedObjectSystem) {
            this.advancedManager = new AdvancedObjectManager(sceneManager);
        }
        
        if (this.enhancedManagementConfig.enableStateManagement) {
            this.setupEnhancedStateManagement();
        }
        
        if (this.enhancedManagementConfig.enableBidirectionalSync) {
            this.setupBidirectionalSync();
        }
        
        // Enhanced state management
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
        
        // Add performance monitoring
        this.performanceMetrics = {
            objectCount: 0,
            renderTime: 0,
            lastUpdate: Date.now()
        };
        
        // Add debug logging
        console.log('ObjectManager initialized with enhanced catalog system');
        console.log('Scene object count:', sceneManager?.scene?.children?.length || 0);
    }

    /**
     * @tweakable Enhanced state management setup for proper undo/redo functionality
     */
    setupEnhancedStateManagement() {
        const stateConfig = {
            autoSaveOnChanges: true,
            saveThrottleMs: 500,
            enableTransactionSupport: true,
            maxStateSize: 50
        };
        
        // Enhanced state management with transactions
        this.currentTransaction = null;
        this.stateManager = new StateManager();
        
        // Auto-save states on object changes
        if (stateConfig.autoSaveOnChanges) {
            let saveTimeout = null;
            
            const scheduleStateSave = () => {
                if (saveTimeout) clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.saveEnhancedState();
                }, stateConfig.saveThrottleMs);
            };
            
            // Monitor object changes
            this.objectChangeObserver = new MutationObserver(scheduleStateSave);
            if (this.sceneManager.scene) {
                this.objectChangeObserver.observe(this.sceneManager.renderer.domElement, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }

    async saveEnhancedState() {
        try {
            if (!this.currentTransaction) {
                this.currentTransaction = await this.stateManager.beginTransaction({
                    action: 'object_modification',
                    timestamp: Date.now()
                });
            }
            
            // Capture current state of all objects
            const objectStates = new Map();
            
            [...this.objects, ...this.wallObjects].forEach((object, index) => {
                const objectId = object.userData.id || `object_${index}`;
                objectStates.set(objectId, {
                    position: object.position.clone(),
                    rotation: object.rotation.clone(),
                    scale: object.scale.clone(),
                    userData: { ...object.userData },
                    visible: object.visible,
                    type: object.userData.type || 'unknown'
                });
            });
            
            // Add states to transaction
            objectStates.forEach((state, objectId) => {
                this.currentTransaction.changes.set(objectId, {
                    type: 'update',
                    data: state,
                    reason: 'user_modification'
                });
            });
            
            await this.stateManager.commitTransaction(this.currentTransaction);
            this.currentTransaction = null;
            
        } catch (error) {
            console.error('Failed to save enhanced state:', error);
            if (this.currentTransaction) {
                await this.stateManager.rollbackTransaction(this.currentTransaction);
                this.currentTransaction = null;
            }
        }
    }

    /**
     * @tweakable Bidirectional synchronization setup for 2D/3D integration
     */
    setupBidirectionalSync() {
        const syncConfig = {
            enablePositionSync: true,
            enableRotationSync: true,
            syncThrottleMs: 100,
            coordinateScale: 20
        };
        
        // Listen for floorplan updates from 3D manipulations
        document.addEventListener('floorplan-update-from-3d', (event) => {
            const { objectId, transformType, floorplanCoords } = event.detail;
            
            if (syncConfig.enablePositionSync && transformType === 'position') {
                // Find corresponding floorplan element and update
                const floorplanUpdateEvent = new CustomEvent('update-floorplan-element', {
                    detail: {
                        objectId,
                        coordinates: floorplanCoords
                    }
                });
                
                document.dispatchEvent(floorplanUpdateEvent);
            }
        });
        
        // Listen for transform control changes
        if (this.sceneManager && this.sceneManager.scene) {
            this.sceneManager.scene.traverse((child) => {
                if (child.isTransformControls) {
                    child.addEventListener('objectChange', (event) => {
                        const object = event.target.object;
                        if (object && object.userData.isFloorplanElement) {
                            const transformEvent = new CustomEvent('object-transformed', {
                                detail: {
                                    object,
                                    transformType: 'position',
                                    newValue: object.position
                                }
                            });
                            
                            document.dispatchEvent(transformEvent);
                        }
                    });
                }
            });
        }
    }

    async createFromTemplate(templateName, width = null) {
        if (refactoredConfig.enableModularServices) {
            return await this.creationService.createFromTemplate(templateName, width);
        }
        // Fallback implementation for legacy support
        return this._legacyCreateFromTemplate(templateName, width);
    }

    _legacyCreateFromTemplate(templateName, width) {
        console.log('Creating from template:', templateName, 'width:', width);
        
        if (!this.templates[templateName]) {
            console.error(`Template ${templateName} not found`);
            return null;
        }

        const template = this.templates[templateName];
        
        // Create a simple mesh for now since AdvancedObjectManager might not be ready
        try {
            const defaultWidth = 2;
            const defaultHeight = 0.9;
            const defaultDepth = 0.6;
            
            const geometry = new THREE.BoxGeometry(
                width ? width/12 : defaultWidth,
                template.dimensions?.height/12 || defaultHeight,
                template.dimensions?.depth/12 || defaultDepth
            );
            
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x8B4513,
                roughness: 0.7,
                metalness: 0.1
            });
            
            const object = new THREE.Mesh(geometry, material);
            object.castShadow = true;
            object.receiveShadow = true;
            object.userData.type = template.type;
            object.userData.templateName = templateName;
            
            object.position.set(0, (template.dimensions?.height/12 || defaultHeight)/2, 0);
            
            // Add to scene and track
            this.sceneManager.scene.add(object);
            this.objects.push(object);
            
            console.log('Created object:', object, 'Position:', object.position);
            console.log('Scene children after creation:', this.sceneManager.scene.children.length);
            
            return object;
        } catch (error) {
            console.error('Error creating object from template:', error);
            return null;
        }
    }

    async createFromCatalog(itemName, options = {}) {
        if (refactoredConfig.enableModularServices) {
            return await this.creationService.createFromCatalog(itemName, options);
        }
        // Fallback implementation for legacy support
        return this._legacyCreateFromCatalog(itemName, options);
    }

    _legacyCreateFromCatalog(itemName, options) {
        try {
            console.log('Creating item from catalog:', itemName);
            
            let item;
            
            // Use advanced object manager if available
            if (this.enhancedManagementConfig.enableAdvancedObjectSystem && this.advancedManager) {
                item = await this.advancedManager.createSmartObject(itemName, {
                    ...options,
                    enablePhysics: true,
                    enableLOD: this.enhancedManagementConfig.enablePerformanceOptimization
                });
            } else {
                // Fallback to kitchen catalog
                item = await this.kitchenCatalog.createItem(itemName, options);
            }
            
            const placementConfig = {
                autoPosition: true,
                snapToGrid: this.managementConfig.enableSmartSnapping,
                findOptimalPosition: true,
                avoidCollisions: this.managementConfig.enableCollisionDetection
            };

            if (placementConfig.autoPosition) {
                this.autoPositionItem(item, placementConfig);
            }

            this.sceneManager.scene.add(item);
            this.objects.push(item);
            
            if (this.enhancedManagementConfig.enableStateManagement) {
                await this.saveEnhancedState();
            }

            console.log('Created catalog item:', itemName, 'at position:', item.position);
            return item;
        } catch (error) {
            console.error('Failed to create catalog item:', error);
            return null;
        }
    }

    autoPositionItem(item, config) {
        const positioningRules = {
            gridSize: 0.5,
            wallDistance: 0.1,
            itemSpacing: 0.2,
            preferredY: 0
        };
        
        let position = new THREE.Vector3(0, positioningRules.preferredY, 0);
        
        // Apply smart snapping if enabled
        if (config.snapToGrid) {
            position.x = Math.round(position.x / positioningRules.gridSize) * positioningRules.gridSize;
            position.z = Math.round(position.z / positioningRules.gridSize) * positioningRules.gridSize;
        }

        // Find optimal position to avoid collisions
        if (config.avoidCollisions) {
            position = this.findNonCollidingPosition(item, position);
        }

        item.position.copy(position);
    }

    findNonCollidingPosition(item, startPosition) {
        const testPositions = [
            startPosition,
            startPosition.clone().add(new THREE.Vector3(1, 0, 0)),
            startPosition.clone().add(new THREE.Vector3(-1, 0, 0)),
            startPosition.clone().add(new THREE.Vector3(0, 0, 1)),
            startPosition.clone().add(new THREE.Vector3(0, 0, -1))
        ];

        for (const testPos of testPositions) {
            if (!this.checkCollisionAtPosition(item, testPos)) {
                return testPos;
            }
        }

        return startPosition; // Fallback to original position
    }

    checkCollisionAtPosition(item, position) {
        const itemBox = new THREE.Box3().setFromObject(item);
        itemBox.translate(position);

        return this.objects.some(existingItem => {
            if (existingItem === item) return false;
            
            const existingBox = new THREE.Box3().setFromObject(existingItem);
            return itemBox.intersectsBox(existingBox);
        });
    }

    updateFromFloorplan(floorplanElements) {
        if (refactoredConfig.enableModularServices) {
            return this.syncService.updateFromFloorplan(floorplanElements);
        }
        // Legacy fallback
        this._legacyUpdateFromFloorplan(floorplanElements);
    }

    _legacyUpdateFromFloorplan(floorplanElements) {
        console.log('Updating from floorplan:', floorplanElements);
        
        // clear existing walls
        this.wallObjects.forEach(wall => {
            this.sceneManager.scene.remove(wall);
            if (wall.geometry) wall.geometry.dispose();
            if (wall.material) wall.material.dispose();
        });
        this.wallObjects = [];

        // Handle floorplan elements safely
        if (!floorplanElements) {
            console.warn('No floorplan elements provided');
            return;
        }

        // Handle walls if they exist
        if (floorplanElements.walls) {
            floorplanElements.walls.forEach((wall, index) => {
                try {
                    const wallHeight = 2.4; // meters
                    const wallThickness = 0.1; // meters
                    
                    const length = Math.hypot(wall.x2 - wall.x1, wall.z2 - wall.z1); // length in pixels
                    const scaleFactor = 1 / 20; // assumes 1 meter = 20 pixels
                    const realLength = length * scaleFactor;
                    
                    const geometry = new THREE.BoxGeometry(realLength, wallHeight, wallThickness);
                    const material = new THREE.MeshStandardMaterial({ 
                        color: 0xcccccc,
                        roughness: 0.9,
                        metalness: 0.1
                    });
                    
                    const wallMesh = new THREE.Mesh(geometry, material);
                    
                    const centerX = (wall.x1 + wall.x2) / 2;
                    const centerZ = (wall.y1 + wall.y2) / 2; // In 2D canvas, y is z
                    const canvasCenter = { x: 400, y: 300}; // Floorplan canvas center
                    
                    wallMesh.position.set(
                        (centerX - canvasCenter.x) * scaleFactor,
                        wallHeight / 2,
                        (centerZ - canvasCenter.y) * scaleFactor
                    );
                    
                    wallMesh.rotation.y = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
                    wallMesh.castShadow = true;
                    wallMesh.receiveShadow = true;
                    wallMesh.userData.type = 'wall';
                    wallMesh.userData.isWall = true;
                    
                    this.sceneManager.scene.add(wallMesh);
                    this.wallObjects.push(wallMesh);
                    
                    console.log('Created wall:', index, 'at position:', wallMesh.position);
                } catch (error) {
                    console.error('Error creating wall:', error);
                }
            });
        }
        
        console.log('Total objects in scene after floorplan update:', this.objects.length + this.wallObjects.length);
        console.log('Scene children count:', this.sceneManager.scene.children.length);
    }

    batchUpdateObjects(elements3D) {
        if (refactoredConfig.enableModularServices) {
            return this.syncService.batchUpdateObjects(elements3D);
        }
        // Legacy fallback
        this._legacyBatchUpdateObjects(elements3D);
    }

    _legacyBatchUpdateObjects(elements3D) {
        console.log('Batch updating objects from 3D elements:', elements3D);
        
        if (!elements3D || !Array.isArray(elements3D)) {
            console.warn('Invalid elements3D provided to batchUpdateObjects');
            return;
        }

        const batchConfig = {
            maxBatchSize: 50,
            processingDelay: 0,
            clearExistingWalls: true,
            enableProgressFeedback: true
        };

        if (batchConfig.clearExistingWalls) {
            this.clearWalls();
        }

        const batches = this.chunkArray(elements3D, batchConfig.maxBatchSize);
        
        batches.forEach((batch, batchIndex) => {
            setTimeout(() => {
                this.processBatch(batch, batchIndex);
                
                if (batchConfig.enableProgressFeedback) {
                    const progress = ((batchIndex + 1) / batches.length) * 100;
                    console.log(`Batch processing progress: ${progress.toFixed(1)}%`);
                }
            }, batchIndex * batchConfig.processingDelay);
        });
    }

    clearWalls() {
        const wallsToRemove = this.wallObjects;
        wallsToRemove.forEach(wall => {
            this.sceneManager.scene.remove(wall);
            if (wall.geometry) wall.geometry.dispose();
            if (wall.material) wall.material.dispose();
        });
        this.wallObjects = [];
    }

    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    processBatch(batch, batchIndex) {
        console.log(`Processing batch ${batchIndex}:`, batch.length, 'elements');
        
        batch.forEach((element, elementIndex) => {
            try {
                this.createElement3D(element, `batch-${batchIndex}-element-${elementIndex}`);
            } catch (error) {
                console.error(`Error processing element in batch ${batchIndex}:`, error);
            }
        });
    }

    createElement3D(element, elementId) {
        if (!element.type || !element.geometry || !element.position) {
            console.warn('Invalid 3D element:', element);
            return null;
        }

        const elementConfig = {
            castShadow: true,
            receiveShadow: true,
            defaultMaterial: {
                color: 0xcccccc,
                roughness: 0.8,
                metalness: 0.2
            }
        };

        let material;
        switch (element.type) {
            case 'wall':
                material = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    roughness: 0.9,
                    metalness: 0.1
                });
                break;
            default:
                material = new THREE.MeshStandardMaterial(elementConfig.defaultMaterial);
        }

        const mesh = new THREE.Mesh(element.geometry, material);
        mesh.position.copy(element.position);
        
        if (element.rotation) {
            mesh.rotation.copy(element.rotation);
        }

        mesh.castShadow = elementConfig.castShadow;
        mesh.receiveShadow = elementConfig.receiveShadow;
        mesh.userData.type = element.type;
        mesh.userData.elementId = elementId;
        mesh.userData.isWall = element.type === 'wall';

        this.sceneManager.scene.add(mesh);
        this.objects.push(mesh);

        return mesh;
    }

    createObject(type) {
        console.log('Creating object of type:', type);
        
        let dimensions;
        let color;
        
        const defaultDimensions = {
            cabinet: { width: 2, height: 0.9, depth: 0.6 },
            countertop: { width: 2, height: 0.05, depth: 0.6 },
            appliance: { width: 0.6, height: 1.8, depth: 0.6 }
        };
        
        switch(type) {
            case 'cabinet':
                dimensions = defaultDimensions.cabinet;
                color = document.getElementById('cabinet-color')?.value || '#8B4513';
                break;
            case 'countertop':
                dimensions = defaultDimensions.countertop;
                color = document.getElementById('countertop-color')?.value || '#D3D3D3';
                break;
            case 'appliance':
                dimensions = defaultDimensions.appliance;
                color = document.getElementById('appliance-color')?.value || '#C0C0C0';
                break;
            default:
                dimensions = defaultDimensions.cabinet;
                color = '#8B4513';
        }

        const geometry = new THREE.BoxGeometry(
            dimensions.width,
            dimensions.height,
            dimensions.depth
        );
        const material = new THREE.MeshStandardMaterial({ color: color });
        const object = new THREE.Mesh(geometry, material);
        
        object.position.y = dimensions.height / 2; // Place on floor
        object.castShadow = true;
        object.receiveShadow = true;
        object.userData.type = type;
        
        this.sceneManager.scene.add(object);
        this.objects.push(object);
        
        console.log('Created object:', object, 'Scene children:', this.sceneManager.scene.children.length);
        
        return object;
    }

    removeObject(object) {
        if (object) {
            this.sceneManager.scene.remove(object);
            this.objects = this.objects.filter(obj => obj !== object);
            if (this.selectedObject === object) {
                this.selectedObject = null;
            }
        }
    }

    removeSelectedObject() {
        if (this.selectedObject) {
            this.removeObject(this.selectedObject);
            this.selectedObject = null;
        }
    }

    updateObjectDimensions(object, width, height, depth) {
        if (object) {
            object.scale.set(
                width || 1,
                height || 1,
                depth || 1
            );
        }
    }

    /**
     * @tweakable Performance monitoring configuration
     */
    updatePerformanceMetrics() {
        const performanceConfig = {
            enableMonitoring: true,
            logInterval: 5000, // ms
            trackRenderTime: true,
            trackMemoryUsage: false
        };
        
        if (!performanceConfig.enableMonitoring) return;
        
        const now = Date.now();
        if (now - this.performanceMetrics.lastUpdate > performanceConfig.logInterval) {
            console.log('Performance Metrics:', {
                objectCount: this.performanceMetrics.objectCount,
                sceneChildren: this.sceneManager.scene.children.length,
                timestamp: new Date().toISOString()
            });
            
            this.performanceMetrics.lastUpdate = now;
        }
    }
}