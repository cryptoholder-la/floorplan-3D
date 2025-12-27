import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export class ControlsManager {
    constructor(sceneManager, objectManager) {
        this.sceneManager = sceneManager;
        this.objectManager = objectManager;
        
        /**
         * @tweakable Transform controls configuration for object manipulation
         */
        this.transformConfig = {
            size: 0.8,
            showX: true,
            showY: false,
            showZ: true,
            space: 'local'
        };
        
        this.initControls();
        this.initRaycaster();
        
        // Add bidirectional sync capability
        this.setupBidirectionalSync();
    }

    initControls() {
        this.orbitControls = new OrbitControls(
            this.sceneManager.camera,
            this.sceneManager.renderer.domElement
        );
        
        this.transformControls = new TransformControls(
            this.sceneManager.camera,
            this.sceneManager.renderer.domElement
        );

        /**
         * @tweakable Wall manipulation settings for transform controls
         */
        this.wallManipulationConfig = {
            rotationSnap: Math.PI / 4,  // 45 degree snap
            translationSnap: 0.3048,    // 1 foot snap
            heightLock: true            // Lock vertical movement
        };

        this.transformControls.size = this.transformConfig.size;
        
        this.transformControls.showY = this.transformConfig.showY; // Disable vertical movement
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;

            if (this.objectManager.selectedObject?.userData.isWall) {
                // Apply wall-specific transform constraints
                this.transformControls.setRotationSnap(this.wallManipulationConfig.rotationSnap);
                this.transformControls.setTranslationSnap(this.wallManipulationConfig.translationSnap);
                this.transformControls.showY = !this.wallManipulationConfig.heightLock;
            }
        });
        
        this.sceneManager.scene.add(this.transformControls);
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.sceneManager.renderer.domElement.addEventListener('click', 
            (event) => this.onMouseClick(event)
        );
    }

    onMouseClick(event) {
        event.preventDefault();

        this.mouse.x = ((event.clientX - 300) / (window.innerWidth - 300)) * 2 - 1;
        this.mouse.y = -((event.clientY / (window.innerHeight - 400))) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.sceneManager.getActiveCamera());
        const objectsToIntersect = [...this.objectManager.objects, ...this.objectManager.wallObjects];
        const intersects = this.raycaster.intersectObjects(objectsToIntersect);

        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            this.selectObject(null);
        }
    }

    selectObject(object) {
        if (this.objectManager.selectedObject) {
            this.objectManager.selectedObject.material.emissive.setHex(0x000000);
        }

        this.objectManager.selectedObject = object;

        if (object) {
            object.material.emissive.setHex(0x333333);
            this.transformControls.attach(object);
        } else {
            this.transformControls.detach();
        }
    }

    /**
     * @tweakable Bidirectional synchronization settings between 2D and 3D views
     */
    setupBidirectionalSync() {
        const bidirectionalConfig = {
            enableSync: true,
            throttleMs: 100,
            syncPosition: true,
            syncRotation: true,
            syncScale: false
        };
        
        if (!bidirectionalConfig.enableSync) return;
        
        let syncThrottle = null;
        
        this.transformControls.addEventListener('objectChange', (event) => {
            if (!event.target.object || !this.objectManager.selectedObject) return;
            
            const object = event.target.object;
            if (object.userData.isFloorplanElement) {
                // Throttle updates to prevent performance issues
                if (syncThrottle) clearTimeout(syncThrottle);
                
                syncThrottle = setTimeout(() => {
                    if (bidirectionalConfig.syncPosition) {
                        // Update 2D floorplan position
                        const designModel = this.objectManager.designModel;
                        if (designModel && designModel.updateElementFrom3D) {
                            designModel.updateElementFrom3D(object.userData.id, object.position);
                        }
                    }
                }, bidirectionalConfig.throttleMs);
            }
        });
        
        // Handle transform control state changes
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;

            if (this.objectManager.selectedObject?.userData.isWall) {
                // Apply wall-specific transform constraints
                this.transformControls.setRotationSnap(this.wallManipulationConfig.rotationSnap);
                this.transformControls.setTranslationSnap(this.wallManipulationConfig.translationSnap);
                this.transformControls.showY = !this.wallManipulationConfig.heightLock;
            }
        });
    }

    enableOrbitControls(enabled) {
        this.orbitControls.enabled = enabled;
    }

    update() {
        this.orbitControls.update();
    }
}