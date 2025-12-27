import { PhysicsManager } from '../physics/PhysicsManager.js';
import { StateManager } from '../state/StateManager.js';

/**
 * @tweakable Core object management configuration for centralized state
 */
const coreConfig = {
    enableAdvancedStateManagement: true,
    enablePhysicsIntegration: true,
    maxUndoSteps: 50,
    enablePerformanceTracking: true
};

export class ObjectManagerCore {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        
        if (coreConfig.enablePhysicsIntegration) {
            this.physicsManager = new PhysicsManager();
        }
        
        if (coreConfig.enableAdvancedStateManagement) {
            this.stateManager = new StateManager();
            this.setupStateManagement();
        }
        
        /**
         * @tweakable Performance monitoring for object operations
         */
        this.performanceMetrics = {
            objectCount: 0,
            renderTime: 0,
            lastUpdate: Date.now(),
            enableMonitoring: coreConfig.enablePerformanceTracking
        };
        
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = coreConfig.maxUndoSteps;
    }

    setupStateManagement() {
        const stateConfig = {
            autoSaveOnChanges: true,
            saveThrottleMs: 500,
            enableTransactionSupport: true,
            maxStateSize: 50
        };
        
        this.currentTransaction = null;
        
        if (stateConfig.autoSaveOnChanges) {
            this.setupAutoSave(stateConfig.saveThrottleMs);
        }
    }

    setupAutoSave(throttleMs) {
        let saveTimeout = null;
        
        const scheduleStateSave = () => {
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                this.saveEnhancedState();
            }, throttleMs);
        };
        
        document.addEventListener('object-modified', scheduleStateSave);
    }

    async saveEnhancedState() {
        try {
            if (!this.currentTransaction) {
                this.currentTransaction = await this.stateManager.beginTransaction({
                    action: 'object_modification',
                    timestamp: Date.now()
                });
            }
            
            const objectStates = new Map();
            
            // Capture current state - simplified for core
            this.sceneManager.scene.children.forEach((object, index) => {
                if (object.userData.type) {
                    const objectId = object.userData.id || `object_${index}`;
                    objectStates.set(objectId, {
                        position: object.position.clone(),
                        rotation: object.rotation.clone(),
                        scale: object.scale.clone(),
                        userData: { ...object.userData },
                        visible: object.visible,
                        type: object.userData.type || 'unknown'
                    });
                }
            });
            
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

    async undo() {
        try {
            const success = await this.stateManager.undo();
            if (success) {
                await this.restoreStateFromManager();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Undo operation failed:', error);
            return false;
        }
    }

    async redo() {
        try {
            const success = await this.stateManager.redo();
            if (success) {
                await this.restoreStateFromManager();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Redo operation failed:', error);
            return false;
        }
    }

    async restoreStateFromManager() {
        // Implementation for state restoration
        console.log('Restoring state from state manager');
    }

    updatePerformanceMetrics() {
        if (!this.performanceMetrics.enableMonitoring) return;
        
        const now = Date.now();
        if (now - this.performanceMetrics.lastUpdate > 5000) {
            this.performanceMetrics.objectCount = this.sceneManager.scene.children.length;
            this.performanceMetrics.lastUpdate = now;
        }
    }
}
