import * as THREE from 'three';

/**
 * @tweakable Synchronization service configuration for 2D/3D data binding
 */
const syncConfig = {
    enableBidirectionalSync: true,
    throttleUpdates: true,
    updateThrottleMs: 100,
    coordinateScale: 20,
    enableBatchUpdates: true
};

export class ObjectSyncService {
    constructor(core) {
        this.core = core;
        this.pendingUpdates = new Set();
        this.updateTimeout = null;
        
        if (syncConfig.enableBidirectionalSync) {
            this.setupBidirectionalSync();
        }
    }

    setupBidirectionalSync() {
        document.addEventListener('floorplan-update-from-3d', (event) => {
            const { objectId, transformType, floorplanCoords } = event.detail;
            
            if (syncConfig.throttleUpdates) {
                this.scheduleUpdate(objectId, transformType, floorplanCoords);
            } else {
                this.updateFloorplanElement(objectId, transformType, floorplanCoords);
            }
        });
    }

    scheduleUpdate(objectId, transformType, floorplanCoords) {
        this.pendingUpdates.add({ objectId, transformType, floorplanCoords });
        
        if (this.updateTimeout) clearTimeout(this.updateTimeout);
        
        this.updateTimeout = setTimeout(() => {
            this.processPendingUpdates();
        }, syncConfig.updateThrottleMs);
    }

    processPendingUpdates() {
        this.pendingUpdates.forEach(update => {
            this.updateFloorplanElement(update.objectId, update.transformType, update.floorplanCoords);
        });
        this.pendingUpdates.clear();
    }

    updateFloorplanElement(objectId, transformType, floorplanCoords) {
        const updateEvent = new CustomEvent('update-floorplan-element', {
            detail: { objectId, coordinates: floorplanCoords }
        });
        document.dispatchEvent(updateEvent);
    }

    updateFromFloorplan(floorplanElements) {
        if (!floorplanElements) {
            console.warn('No floorplan elements provided');
            return;
        }

        if (syncConfig.enableBatchUpdates) {
            this.batchUpdateWalls(floorplanElements.walls || []);
        } else {
            this.updateWallsSequentially(floorplanElements.walls || []);
        }
    }

    batchUpdateWalls(walls) {
        // Clear existing walls
        this.clearExistingWalls();
        
        // Create new walls in batch
        const wallMeshes = walls.map(wall => this.createWallMesh(wall)).filter(Boolean);
        
        wallMeshes.forEach(wallMesh => {
            this.core.sceneManager.scene.add(wallMesh);
        });
    }

    updateWallsSequentially(walls) {
        this.clearExistingWalls();
        
        walls.forEach(wall => {
            try {
                const wallMesh = this.createWallMesh(wall);
                if (wallMesh) {
                    this.core.sceneManager.scene.add(wallMesh);
                }
            } catch (error) {
                console.error('Error creating wall:', error);
            }
        });
    }

    clearExistingWalls() {
        const wallsToRemove = this.core.sceneManager.scene.children.filter(
            child => child.userData.isWall
        );
        
        wallsToRemove.forEach(wall => {
            this.core.sceneManager.scene.remove(wall);
            if (wall.geometry) wall.geometry.dispose();
            if (wall.material) wall.material.dispose();
        });
    }

    createWallMesh(wall) {
        const wallHeight = 2.4;
        const wallThickness = 0.1;
        
        const length = Math.hypot(wall.x2 - wall.x1, wall.z2 - wall.z1);
        const scaleFactor = 1 / syncConfig.coordinateScale;
        const realLength = length * scaleFactor;
        
        const geometry = new THREE.BoxGeometry(realLength, wallHeight, wallThickness);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const wallMesh = new THREE.Mesh(geometry, material);
        
        const centerX = (wall.x1 + wall.x2) / 2;
        const centerZ = (wall.y1 + wall.y2) / 2;
        const canvasCenter = { x: 400, y: 300 };
        
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
        
        return wallMesh;
    }
}