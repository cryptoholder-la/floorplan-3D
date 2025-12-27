import { PhysicsManager } from '../physics/PhysicsManager.js';

/**
 * @tweakable Configuration for element properties.
 */
const elementConfig = {
    wall: {
        height: 240, // cm
        thickness: 15 // cm
    },
    cabinet: {
        width: 60,
        height: 80,
        depth: 60
    },
    door: {
        width: 90,
        height: 200,
        thickness: 15,
    },
    window: {
        width: 120,
        height: 100,
        sillHeight: 90,
        thickness: 14,
    }
};

/**
 * @tweakable Configuration for bi-directional data synchronization
 */
const syncConfig = {
    enableBidirectionalSync: true,
    coordinate3Dto2DScale: 20, // pixels per meter
    updateThrottleMs: 100,
    enableVersionTracking: true
};

export class DesignModel {
    constructor() {
        this.elements = [];
        this.listeners = new Set();
        this.physicsManager = new PhysicsManager();
        this.selectedElement = null;
        
        // Add state management
        this.stateStack = [];
        this.currentStateIndex = -1;
        this.stateLock = false;
        
        // Add element versioning for bi-directional sync
        this.elementVersions = new Map();
    }

    addElement(type, properties) {
        const id = `${type}-${Date.now()}`;
        
        let elementData;
        switch(type) {
            case 'wall':
                elementData = { id, type, ...properties, ...elementConfig.wall };
                break;
            case 'cabinet':
                elementData = { id, type, ...properties, ...elementConfig.cabinet };
                break;
            case 'door':
                elementData = { id, type, ...properties, ...elementConfig.door };
                break;
            case 'window':
                 elementData = { id, type, ...properties, ...elementConfig.window };
                break;
            default:
                console.error(`Unknown element type: ${type}`);
                return;
        }

        const physicsBody = this.physicsManager.createBodyForElement(elementData);
        elementData.physicsBody = physicsBody;
        
        if (this.physicsManager.checkCollision(physicsBody)) {
            console.warn("Collision detected. Element not added.", elementData);
            this.physicsManager.removeBody(physicsBody);
            return null;
        }
        
        this.elements.push(elementData);
        this.notify('add', elementData);
        return elementData;
    }

    updateElement(id, properties) {
        const element = this.elements.find(el => el.id === id);
        if (element) {
            // Store previous state for undo
            this.commitState();
            
            Object.assign(element, properties);
            
            // Update version tracking
            if (syncConfig.enableVersionTracking) {
                const currentVersion = this.elementVersions.get(id) || 0;
                this.elementVersions.set(id, currentVersion + 1);
                element.version = currentVersion + 1;
            }
            
            this.physicsManager.updateBody(element);
            this.notify('update', element);
        }
    }

    removeElement(id) {
        const index = this.elements.findIndex(el => el.id === id);
        if (index > -1) {
            const element = this.elements[index];
            this.physicsManager.removeBody(element.physicsBody);
            this.elements.splice(index, 1);
            this.notify('remove', { id });
        }
    }
    
    clearAll() {
        this.elements.forEach(el => this.physicsManager.removeBody(el.physicsBody));
        this.elements = [];
        this.notify('clear');
    }

    selectElement(element) {
        this.selectedElement = element;
        this.notify('select', element);
    }

    subscribe(callback) {
        this.listeners.add(callback);
    }

    unsubscribe(callback) {
        this.listeners.delete(callback);
    }

    notify(event, data) {
        this.listeners.forEach(cb => cb(event, data));
    }

    /**
     * @tweakable State management commit settings
     */
    commitState() {
        if (this.stateLock) return;
        
        const stateConfig = {
            maxStackSize: 50,
            includePhysicsBodies: false,
            deepCloneElements: true
        };
        
        // Remove future states if we're not at the end
        this.stateStack = this.stateStack.slice(0, this.currentStateIndex + 1);
        
        // Create state snapshot
        const state = {
            elements: stateConfig.deepCloneElements ? 
                JSON.parse(JSON.stringify(this.elements.map(el => ({ ...el, physicsBody: undefined })))) :
                this.elements.map(el => ({ ...el })),
            timestamp: Date.now(),
            elementVersions: new Map(this.elementVersions)
        };
        
        this.stateStack.push(state);
        this.currentStateIndex++;
        
        // Limit stack size
        if (this.stateStack.length > stateConfig.maxStackSize) {
            this.stateStack.shift();
            this.currentStateIndex--;
        }
    }

    undo() {
        if (this.currentStateIndex > 0) {
            this.currentStateIndex--;
            this.restoreState(this.stateStack[this.currentStateIndex]);
            this.notify('undo', this.stateStack[this.currentStateIndex]);
            return true;
        }
        return false;
    }

    redo() {
        if (this.currentStateIndex < this.stateStack.length - 1) {
            this.currentStateIndex++;
            this.restoreState(this.stateStack[this.currentStateIndex]);
            this.notify('redo', this.stateStack[this.currentStateIndex]);
            return true;
        }
        return false;
    }

    restoreState(state) {
        this.stateLock = true;
        
        // Clear current elements
        this.elements.forEach(el => {
            if (el.physicsBody) {
                this.physicsManager.removeBody(el.physicsBody);
            }
        });
        
        // Restore elements
        this.elements = state.elements.map(el => ({ ...el }));
        this.elementVersions = new Map(state.elementVersions);
        
        // Recreate physics bodies
        this.elements.forEach(el => {
            if (el.type === 'wall' || el.type === 'cabinet') {
                el.physicsBody = this.physicsManager.createBodyForElement(el);
            }
        });
        
        this.stateLock = false;
        this.notify('restore', state);
    }

    /**
     * @tweakable 3D to 2D coordinate conversion settings
     */
    convert3DTo2D(position3D) {
        const conversionSettings = {
            scale: syncConfig.coordinate3Dto2DScale,
            offsetX: 400, // Canvas center
            offsetY: 300,
            flipY: true
        };
        
        return {
            x: position3D.x * conversionSettings.scale + conversionSettings.offsetX,
            y: conversionSettings.flipY ? 
                conversionSettings.offsetY - (position3D.z * conversionSettings.scale) :
                position3D.z * conversionSettings.scale + conversionSettings.offsetY
        };
    }

    /**
     * @tweakable 2D to 3D coordinate conversion settings
     */
    convert2DTo3D(position2D) {
        const conversionSettings = {
            scale: 1 / syncConfig.coordinate3Dto2DScale,
            offsetX: 400,
            offsetY: 300,
            defaultHeight: 0
        };
        
        return {
            x: (position2D.x - conversionSettings.offsetX) * conversionSettings.scale,
            y: conversionSettings.defaultHeight,
            z: (conversionSettings.offsetY - position2D.y) * conversionSettings.scale
        };
    }

    updateElementFrom3D(id, position3D) {
        if (!syncConfig.enableBidirectionalSync) return;
        
        const element = this.elements.find(el => el.id === id);
        if (element && element.type === 'wall') {
            // Convert 3D position back to 2D coordinates
            const center2D = this.convert3DTo2D(position3D);
            
            // Update wall coordinates (this is simplified - real implementation would need rotation handling)
            const length = Math.hypot(element.end.x - element.start.x, element.end.y - element.start.y);
            element.start.x = center2D.x - length / 2;
            element.start.y = center2D.y;
            element.end.x = center2D.x + length / 2;
            element.end.y = center2D.y;
            
            this.notify('updateFrom3D', element);
        }
    }
}