/**
 * @tweakable Physics world settings
 */
const physicsConfig = {
    gravityX: 0,
    gravityY: -980, // Using cm/s^2, but we will mostly have static bodies
    gravityZ: 0,
    solverIterations: 10,
    timeStep: 1 / 60,
};

/**
 * @tweakable Enhanced collision detection settings
 */
const enhancedCollisionConfig = {
    enableBroadPhase: true,
    enableNarrowPhase: true,
    spatialGridSize: 2.0, // meters
    maxCollisionChecks: 200,
    collisionMargin: 0.05 // meters
};

export class PhysicsManager {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(physicsConfig.gravityX, physicsConfig.gravityY, physicsConfig.gravityZ);
        this.world.solver.iterations = physicsConfig.solverIterations;
        
        // Add spatial partitioning for performance
        this.spatialGrid = new Map();
        this.initializeSpatialGrid();
        
        /**
         * @tweakable Physics world integration settings for unused logic implementation
         */
        this.physicsIntegrationConfig = {
            enableRealTimeSync: true,
            syncFrequency: 60, // Hz
            enableDebugVisualization: true,
            collisionLayerMask: 0xFFFFFFFF
        };
        
        this.physicsObjects = new Map();
        this.collisionCallbacks = new Map();
        this.isInitialized = false;
        
        this.initializePhysicsWorld();
    }

    /**
     * @tweakable Spatial grid initialization for collision optimization
     */
    initializeSpatialGrid() {
        const gridSettings = {
            cellSize: enhancedCollisionConfig.spatialGridSize,
            worldBounds: { min: -50, max: 50 }, // meters
            enableDynamicResize: true
        };
        
        this.gridCellSize = gridSettings.cellSize;
        this.gridBounds = gridSettings.worldBounds;
    }

    getSpatialGridKey(position) {
        const gridX = Math.floor(position.x / this.gridCellSize);
        const gridZ = Math.floor(position.z / this.gridCellSize);
        return `${gridX},${gridZ}`;
    }

    addToSpatialGrid(body) {
        const key = this.getSpatialGridKey(body.position);
        if (!this.spatialGrid.has(key)) {
            this.spatialGrid.set(key, new Set());
        }
        this.spatialGrid.get(key).add(body);
    }

    removeFromSpatialGrid(body) {
        const key = this.getSpatialGridKey(body.position);
        const cell = this.spatialGrid.get(key);
        if (cell) {
            cell.delete(body);
            if (cell.size === 0) {
                this.spatialGrid.delete(key);
            }
        }
    }

    getAdjacentGridKeys(gridKey) {
        const [x, z] = gridKey.split(',').map(Number);
        return [
            `${x-1},${z-1}`, `${x},${z-1}`, `${x+1},${z-1}`,
            `${x-1},${z}`,                   `${x+1},${z}`,
            `${x-1},${z+1}`, `${x},${z+1}`, `${x+1},${z+1}`
        ];
    }

    createBodyForElement(element) {
        let shape;
        const body = new CANNON.Body({ mass: 0 }); // All elements are static for now

        switch (element.type) {
            case 'wall': {
                const center = {
                    x: (element.start.x + element.end.x) / 2,
                    y: (element.start.y + element.end.y) / 2,
                    z: element.height / 2
                };
                const length = Math.hypot(element.end.x - element.start.x, element.end.y - element.start.y);
                shape = new CANNON.Box(new CANNON.Vec3(length / 2, element.thickness / 2, element.height / 2));
                body.position.set(center.x, center.z, center.y); // Y is up in 3D, so we use Z from physics
                const angle = Math.atan2(element.end.y - element.start.y, element.end.x - element.start.x);
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
                break;
            }
            case 'cabinet':
                shape = new CANNON.Box(new CANNON.Vec3(element.width / 2, element.depth / 2, element.height / 2));
                body.position.set(element.x, element.height / 2, element.y);
                break;
            default:
                return null; // No physics for this type yet
        }
        
        if (shape) {
            body.addShape(shape);
            this.world.addBody(body);
            this.addToSpatialGrid(body);
            return body;
        }
        return null;
    }

    checkCollision(body) {
        if (!enhancedCollisionConfig.enableBroadPhase) return false;

        // Use spatial grid for optimized collision detection
        const gridKey = this.getSpatialGridKey(body.position);
        const nearbyBodies = this.spatialGrid.get(gridKey) || new Set();
        
        // Check adjacent cells too
        const adjacentKeys = this.getAdjacentGridKeys(gridKey);
        adjacentKeys.forEach(key => {
            const cell = this.spatialGrid.get(key);
            if (cell) {
                cell.forEach(nearbyBody => nearbyBodies.add(nearbyBody));
            }
        });

        let collisionCount = 0;
        for (const otherBody of nearbyBodies) {
            if (body !== otherBody && collisionCount < enhancedCollisionConfig.maxCollisionChecks) {
                collisionCount++;
                
                // Expand AABB by collision margin
                const expandedAABB = body.aabb.clone();
                const margin = enhancedCollisionConfig.collisionMargin;
                expandedAABB.lowerBound.x -= margin;
                expandedAABB.lowerBound.y -= margin;
                expandedAABB.lowerBound.z -= margin;
                expandedAABB.upperBound.x += margin;
                expandedAABB.upperBound.y += margin;
                expandedAABB.upperBound.z += margin;

                if (expandedAABB.overlaps(otherBody.aabb)) {
                    if (enhancedCollisionConfig.enableNarrowPhase) {
                        return this.performNarrowPhaseCollision(body, otherBody);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    performNarrowPhaseCollision(bodyA, bodyB) {
        /**
         * @tweakable Narrow phase collision detection settings
         */
        const narrowPhaseSettings = {
            useGJK: true,
            tolerance: 0.01,
            maxIterations: 20
        };

        // Simple shape-to-shape collision using distance calculation
        const distanceSquared = bodyA.position.distanceSquared(bodyB.position);
        const minDistance = this.calculateMinDistance(bodyA, bodyB);
        
        return distanceSquared < (minDistance * minDistance);
    }

    calculateMinDistance(bodyA, bodyB) {
        // Calculate minimum distance based on shape types
        let radiusA = 0, radiusB = 0;
        
        if (bodyA.shapes[0] instanceof CANNON.Box) {
            const box = bodyA.shapes[0];
            radiusA = Math.max(box.halfExtents.x, box.halfExtents.y, box.halfExtents.z);
        }
        
        if (bodyB.shapes[0] instanceof CANNON.Box) {
            const box = bodyB.shapes[0];
            radiusB = Math.max(box.halfExtents.x, box.halfExtents.y, box.halfExtents.z);
        }
        
        return radiusA + radiusB;
    }

    updateBody(element) {
        if (!element.physicsBody) return;
        
        // Remove from old spatial grid position
        this.removeFromSpatialGrid(element.physicsBody);
        
        element.physicsBody.position.set(element.x, element.height / 2, element.y);
        
        // Add to new spatial grid position
        this.addToSpatialGrid(element.physicsBody);
    }

    removeBody(body) {
        if (body) {
            this.world.removeBody(body);
            this.removeFromSpatialGrid(body);
        }
    }

    async initializePhysicsWorld() {
        if (this.isInitialized) return;
        
        try {
            // Enhanced physics world setup
            this.world.broadphase = new CANNON.NaiveBroadphase();
            this.world.solver.tolerance = 0.001;
            this.world.defaultContactMaterial.friction = 0.4;
            this.world.defaultContactMaterial.restitution = 0.3;
            
            // Start physics loop
            if (this.physicsIntegrationConfig.enableRealTimeSync) {
                this.startPhysicsLoop();
            }
            
            this.isInitialized = true;
            console.log('Physics world initialized successfully');
        } catch (error) {
            console.error('Failed to initialize physics world:', error);
        }
    }

    /**
     * @tweakable Physics loop configuration for real-time synchronization
     */
    startPhysicsLoop() {
        const loopConfig = {
            timeStep: 1 / this.physicsIntegrationConfig.syncFrequency,
            maxSubSteps: 3,
            enableInterpolation: true
        };
        
        const physicsLoop = () => {
            if (!this.isInitialized) return;
            
            this.world.step(loopConfig.timeStep, loopConfig.timeStep, loopConfig.maxSubSteps);
            
            // Sync physics bodies with Three.js objects
            this.physicsObjects.forEach((threeObject, body) => {
                if (loopConfig.enableInterpolation) {
                    threeObject.position.copy(body.position);
                    threeObject.quaternion.copy(body.quaternion);
                }
            });
            
            requestAnimationFrame(physicsLoop);
        };
        
        physicsLoop();
    }

    enablePhysics(object3D, options = {}) {
        const physicsOptions = {
            mass: options.mass || 0,
            collisionGroup: options.collisionGroup || 1,
            material: options.material || this.world.defaultContactMaterial,
            ...options
        };
        
        let shape;
        if (object3D.geometry) {
            const boundingBox = new THREE.Box3().setFromObject(object3D);
            const size = boundingBox.getSize(new THREE.Vector3());
            shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
        } else {
            shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        }
        
        const body = new CANNON.Body({
            mass: physicsOptions.mass,
            material: physicsOptions.material
        });
        
        body.addShape(shape);
        body.position.copy(object3D.position);
        body.quaternion.copy(object3D.quaternion);
        
        this.world.addBody(body);
        this.physicsObjects.set(body, object3D);
        
        object3D.userData.physicsBody = body;
        return body;
    }

    checkCollisionForPlacement(position, dimensions) {
        /**
         * @tweakable Collision detection settings for object placement validation
         */
        const collisionSettings = {
            checkRadius: Math.max(dimensions.x, dimensions.y, dimensions.z) * 1.2,
            precision: 0.1,
            enableContinuousDetection: true
        };
        
        const testShape = new CANNON.Box(new CANNON.Vec3(
            dimensions.x/2, dimensions.y/2, dimensions.z/2
        ));
        
        const testBody = new CANNON.Body({ mass: 0 });
        testBody.addShape(testShape);
        testBody.position.copy(position);
        
        // Temporarily add to world for collision check
        this.world.addBody(testBody);
        
        let hasCollision = false;
        this.world.contacts.forEach(contact => {
            if (contact.bi === testBody || contact.bj === testBody) {
                hasCollision = true;
            }
        });
        
        this.world.removeBody(testBody);
        return !hasCollision;
    }
}