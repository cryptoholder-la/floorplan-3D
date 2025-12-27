import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MaterialManager } from './utils/materialManager.js';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        
        /**
         * @tweakable Camera configuration for the scene manager
         */
        this.cameraConfig = {
            fov: 75,
            near: 0.1,
            far: 1000,
            initialPosition: { x: 10, y: 10, z: 10 }
        };
        
        this.camera = new THREE.PerspectiveCamera(
            this.cameraConfig.fov, 
            (window.innerWidth - 300) / window.innerHeight, 
            this.cameraConfig.near, 
            this.cameraConfig.far
        );
        
        this.camera.position.set(
            this.cameraConfig.initialPosition.x, 
            this.cameraConfig.initialPosition.y, 
            this.cameraConfig.initialPosition.z
        );
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth - 300, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.activeCamera = this.camera;
        
        /**
         * @tweakable Light intensity settings for the scene manager
         */
        this.lightIntensitySettings = {
            ambient: 0.6,
            directional: 0.8,
            hemisphere: 0.4
        };
        
        this.initLights();
        this.initFloor();
        this.initGrid();
        
        this.materialManager = new MaterialManager();
        
        // Initialize orbit controls for scene navigation
        this.initOrbitControls();
        
        window.addEventListener('resize', () => this.onWindowResize());

        this.cameraTransition = {
            duration: 1000, // ms
            easing: 'easeInOutQuad',
            heightBuffer: 2 // feet
        };

        this.elevationSettings = {
            orthographicScale: 15,
            near: 0.1,
            far: 100
        };

        this.elevationViews = {
            front: { 
                position: { x: 0, y: 5, z: 10 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            right: { 
                position: { x: 10, y: 5, z: 0 },
                rotation: { x: 0, y: Math.PI/2, z: 0 }
            },
            back: { 
                position: { x: 0, y: 5, z: -10 },
                rotation: { x: 0, y: Math.PI, z: 0 }
            },
            left: { 
                position: { x: -10, y: 5, z: 0 },
                rotation: { x: 0, y: -Math.PI/2, z: 0 }
            }
        };

        this.initElevationCamera();
    }

    initOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        /**
         * @tweakable OrbitControls configuration settings
         */
        this.orbitControlsConfig = {
            enableDamping: true,
            dampingFactor: 0.05,
            minDistance: 2,
            maxDistance: 50,
            maxPolarAngle: Math.PI / 2
        };
        
        this.orbitControls.enableDamping = this.orbitControlsConfig.enableDamping;
        this.orbitControls.dampingFactor = this.orbitControlsConfig.dampingFactor;
        this.orbitControls.minDistance = this.orbitControlsConfig.minDistance;
        this.orbitControls.maxDistance = this.orbitControlsConfig.maxDistance;
        this.orbitControls.maxPolarAngle = this.orbitControlsConfig.maxPolarAngle;
        this.orbitControls.target.set(0, 0, 0);
    }

    initLights() {
        // Remove existing lights if any
        this.scene.children.filter(child => child.isLight).forEach(light => {
            this.scene.remove(light);
        });

        this.ambientLight = new THREE.AmbientLight(0x404040, this.lightIntensitySettings.ambient);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, this.lightIntensitySettings.directional);
        this.directionalLight.position.set(10, 10, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -20;
        this.directionalLight.shadow.camera.right = 20;
        this.directionalLight.shadow.camera.top = 20;
        this.directionalLight.shadow.camera.bottom = -20;
        this.scene.add(this.directionalLight);

        this.hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, this.lightIntensitySettings.hemisphere);
        this.scene.add(this.hemisphereLight);
    }

    initFloor() {
        // Remove existing floor if any
        if (this.floor) {
            this.scene.remove(this.floor);
        }

        this.floorSize = 20;
        const floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            side: THREE.DoubleSide
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.position.y = 0;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
    }

    initGrid() {
        // Remove existing grid if any
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
        }

        this.gridSize = 20;
        this.gridDivisions = 20;
        this.gridHelper = new THREE.GridHelper(this.gridSize, this.gridDivisions, 0x444444, 0x888888);
        this.gridHelper.position.y = 0.01; // Slightly above floor to prevent z-fighting
        this.scene.add(this.gridHelper);
    }

    initElevationCamera() {
        const aspect = (window.innerWidth - 300) / (window.innerHeight - 400);
        const scale = this.elevationSettings.orthographicScale;
        
        this.elevationCamera = new THREE.OrthographicCamera(
            -scale * aspect, scale * aspect,
            scale, -scale,
            this.elevationSettings.near,
            this.elevationSettings.far
        );
        this.scene.add(this.elevationCamera);
    }
    
    getActiveCamera() {
        return this.activeCamera;
    }

    onWindowResize() {
        const width = window.innerWidth - 300;
        const height = window.innerHeight - 400;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        if (this.elevationCamera) {
            const aspect = width / height;
            const scale = this.elevationSettings.orthographicScale;
            this.elevationCamera.left = -scale * aspect;
            this.elevationCamera.right = scale * aspect;
            this.elevationCamera.top = scale;
            this.elevationCamera.bottom = -scale;
            this.elevationCamera.updateProjectionMatrix();
        }
    }

    setView(view) {
        if (view === 'perspective') {
            this.activeCamera = this.camera;
            this.transitionToView({ 
                position: new THREE.Vector3(this.cameraConfig.initialPosition.x, this.cameraConfig.initialPosition.y, this.cameraConfig.initialPosition.z),
                rotation: new THREE.Euler(0,0,0) // look at origin
            });
            this.camera.lookAt(0,0,0);
        } else {
             if (!this.elevationViews[view]) {
                console.warn(`Unknown elevation view: ${view}`);
                return;
            }
            this.activeCamera = this.elevationCamera;
            const viewConfig = this.getElevationViewCamera(view);
            this.transitionToView(viewConfig);
        }
    }

    getElevationViewCamera(view) {
        const viewData = this.elevationViews[view];
        if (!viewData) {
            console.warn(`Unknown elevation view: ${view}`);
            return this.elevationViews.front;
        }
        
        return {
            position: new THREE.Vector3(
                viewData.position.x,
                viewData.position.y,
                viewData.position.z
            ),
            rotation: new THREE.Euler(
                viewData.rotation.x,
                viewData.rotation.y,
                viewData.rotation.z
            )
        };
    }

    async transitionToView(viewConfig) {
        const startPos = this.activeCamera.position.clone();
        const startRot = this.activeCamera.rotation.clone();
        const startTime = performance.now();

        // For perspective, we need to lerp quaternion, not euler
        const startQuaternion = new THREE.Quaternion().copy(this.activeCamera.quaternion);
        const endQuaternion = new THREE.Quaternion().setFromEuler(viewConfig.rotation);

        return new Promise(resolve => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.cameraTransition.duration, 1);
                
                if (progress < 1) {
                    this.updateCameraTransition(startPos, startQuaternion, viewConfig, endQuaternion, progress);
                    requestAnimationFrame(animate);
                } else {
                    this.activeCamera.position.copy(viewConfig.position);
                    if (this.activeCamera.isPerspectiveCamera) {
                       this.activeCamera.lookAt(0,0,0);
                    } else {
                       this.activeCamera.rotation.copy(viewConfig.rotation);
                    }
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }

    updateCameraTransition(startPos, startQuaternion, targetConfig, endQuaternion, progress) {
        const eased = this.easeInOutQuad(progress);
        
        this.activeCamera.position.lerpVectors(
            startPos,
            targetConfig.position,
            eased
        );
        
        if (this.activeCamera.isPerspectiveCamera) {
            this.activeCamera.quaternion.slerpQuaternions(startQuaternion, endQuaternion, eased);
            this.activeCamera.lookAt(0,0,0);
        } else {
            // Orthographic doesn't need complex rotation interpolation for these views
            this.activeCamera.rotation.copy(targetConfig.rotation);
        }
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    render() {
        if (this.orbitControls) {
            this.orbitControls.update();
        }
        this.renderer.render(this.scene, this.activeCamera);
    }

    toggleGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = !this.gridHelper.visible;
        }
    }

    toggleShadows() {
        this.renderer.shadowMap.enabled = !this.renderer.shadowMap.enabled;
    }

    toggleHemisphereLight() {
        if (this.hemisphereLight) {
            this.hemisphereLight.visible = !this.hemisphereLight.visible;
        }
    }

    updateRenderQuality(event) {
        const quality = event.target.value;
        
        const qualitySettings = {
            low: { 
                shadowMapSize: 512, 
                antialias: false,
                pixelRatio: 0.5 
            },
            medium: { 
                shadowMapSize: 1024, 
                antialias: true,
                pixelRatio: 1.0 
            },
            high: { 
                shadowMapSize: 2048, 
                antialias: true,
                pixelRatio: window.devicePixelRatio || 1 
            }
        };

        const settings = qualitySettings[quality];
        if (settings) {
            this.renderer.setPixelRatio(settings.pixelRatio);
            
            if (this.directionalLight?.shadow) {
                this.directionalLight.shadow.mapSize.setScalar(settings.shadowMapSize);
            }
        }
    }
}