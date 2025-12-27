import * as THREE from 'three';
import { MaterialRepository } from './material/MaterialRepository.js';
import { ObjectPoolManager } from './pool/ObjectPoolManager.js';
import { PhysicsManager } from '../physics/PhysicsManager.js';
import { StateManager } from '../state/StateManager.js';
import { CatalogManager } from './catalog/CatalogManager.js';
import { LODManager } from './lod/LODManager.js';

/**
 * @tweakable Advanced object manager integration settings for refactored architecture
 */
const advancedConfig = {
    enablePerformanceOptimization: true,
    enableModularIntegration: true,
    maxObjectCount: 1000,
    enableAutoCleanup: true,
    debugMode: false
};

export class AdvancedObjectManager {
    static #instance = null;
    #objectRegistry = new Map();
    
    constructor(sceneManager) {
        if (AdvancedObjectManager.#instance) {
            return AdvancedObjectManager.#instance;
        }
        
        this.sceneManager = sceneManager;
        
        if (advancedConfig.enableModularIntegration) {
            this.initializeModularSystems();
        }
        
        AdvancedObjectManager.#instance = this;
    }

    initializeModularSystems() {
        this.materialRepo = new MaterialRepository();
        this.objectPool = new ObjectPoolManager();
        this.physics = new PhysicsManager();
        this.stateManager = new StateManager();
        this.catalog = new CatalogManager();
        this.lodManager = new LODManager();
    }

    async createSmartObject(type, config = {}) {
        try {
            let object;
            
            if (this.objectPool && this.objectPool.pools && this.objectPool.pools.has(type)) {
                object = await this.objectPool.acquire(type);
            } else {
                object = this.#createSimpleObject(type, config);
            }
            
            const objectId = this.#registerObject(object);
            
            return object;
        } catch (error) {
            console.error('Error creating smart object:', error);
            return this.#createSimpleObject(type, config);
        }
    }

    #createSimpleObject(type, config) {
        const dimensions = config.dimensions || { width: 2, height: 0.9, depth: 0.6 };
        
        const geometry = new THREE.BoxGeometry(
            dimensions.width, 
            dimensions.height, 
            dimensions.depth
        );
        const material = new THREE.MeshStandardMaterial({ 
            color: config.color || 0x8B4513 
        });
        
        const object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        object.userData.type = type;
        
        return object;
    }

    #registerObject(object) {
        const objectId = crypto.randomUUID();
        this.#objectRegistry.set(objectId, object);
        object.userData.systemId = objectId;
        return objectId;
    }

    dispose() {
        if (this.objectPool) this.objectPool.dispose();
        if (this.materialRepo) this.materialRepo.dispose();
        this.#objectRegistry.clear();
        this.sceneManager = null;
        AdvancedObjectManager.#instance = null;
    }
}