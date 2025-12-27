import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import nipplejs from 'nipplejs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ========================
// CONSTANTS & CONFIGURATION
// ========================
const CONFIG = Object.freeze({
    SCALE: {
        PIXELS_PER_METER: 20,
        WALL_HEIGHT: 2.7,
        WALL_THICKNESS: 0.2,
        BG_SCALE_RANGE: { MIN: 0.5, MAX: 3, STEP: 0.1 }
    },
    COLORS: {
        BACKGROUND: '#1e293b',
        WALL_2D: '#38bdf8',
        WALL_3D: 0xe2e8f0,
        HIGHLIGHT: '#facc15'
    },
    INTERACTION: {
        SNAP_DISTANCE: 15,
        MIN_WALL_LENGTH: 10
    },
    const CONFIG = {
        ASSETS: {
            MAX_SIZE: 1024 * 1024 * 50, // 50MB
            ALLOWED_TYPES: ['model/gltf-binary', 'model/gltf+json'],
            CORE_ASSETS: ['chair', 'table', 'cabinet']
        }
    };
});

// ========================
// CORE APPLICATION MODULES
// ========================
class StateManager {
    #state = {
        walls: [],
        activeTool: 'wall',
        viewMode: '2d',
        background: null,
        backgroundScale: 1.0
    };
    #listeners = new Map();

    getState(key) {
        return key ? this.#state[key] : { ...this.#state };
    }

    setState(key, value) {
        const oldValue = this.#state[key];
        this.#state[key] = value;
        this.#notify(key, oldValue, value);
    }

    #notify(key, oldValue, newValue) {
        const handlers = this.#listeners.get(key) || [];
        handlers.forEach(handler => handler(newValue, oldValue));
    }

    subscribe(key, callback) {
        if (!this.#listeners.has(key)) this.#listeners.set(key, []);
        this.#listeners.get(key).push(callback);
    }
}

class SceneManager {
    #scene = new THREE.Scene();
    #materialCache = new Map();
    #geometryCache = new Map();

    constructor() {
        this.initEnvironment();
    }

    initEnvironment() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(20, 30, 20);
        directionalLight.castShadow = true;

        // Shadows
        directionalLight.shadow.mapSize.set(2048, 2048);
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.bias = -0.001;

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(200, 200);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.9,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;

        this.#scene.add(ambientLight, directionalLight, floor);
    }

    updateWalls(walls) {
        // Clear existing walls
        this.#scene.children.filter(mesh => mesh.userData?.isWall)
            .forEach(mesh => this.#disposeMesh(mesh));

        // Create new walls
        walls.forEach(wall => {
            const geometry = this.#getGeometry(wall);
            const material = this.#getMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData.isWall = true;
            this.#scene.add(mesh);
        });
    }

    #getGeometry(wall) {
        const key = `${wall.start.x},${wall.start.y}-${wall.end.x},${wall.end.y}`;
        if (!this.#geometryCache.has(key)) {
            const length = Math.hypot(wall.end.x - wall.start.x,
                wall.end.y - wall.start.y);
            const geometry = new THREE.BoxGeometry(
                length / CONFIG.SCALE.PIXELS_PER_METER,
                CONFIG.SCALE.WALL_HEIGHT,
                CONFIG.SCALE.WALL_THICKNESS
            );
            this.#geometryCache.set(key, geometry);
        }
        return this.#geometryCache.get(key);
    }

    #getMaterial() {
        const key = 'wall-material';
        if (!this.#materialCache.has(key)) {
            const material = new THREE.MeshStandardMaterial({
                color: CONFIG.COLORS.WALL_3D,
                roughness: 0.5,
                metalness: 0.1
            });
            this.#materialCache.set(key, material);
        }
        return this.#materialCache.get(key);
    }

    #disposeMesh(mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
        } else {
            mesh.material.dispose();
        }
        this.#scene.remove(mesh);
    }
}


// ========================
// USER INTERACTION MODULES
// ========================
class InputManager {
    #stateManager;
    #activePointer = null;

    constructor(stateManager) {
        this.#stateManager = stateManager;
        this.#initCanvasHandlers();
    }

    #initCanvasHandlers() {
        const canvas = document.getElementById('blueprint-canvas');

        canvas.addEventListener('pointerdown', e =>
            this.#handlePointerStart(e));
        canvas.addEventListener('pointermove', e =>
            this.#handlePointerMove(e));
        canvas.addEventListener('pointerup', () =>
            this.#handlePointerEnd());
    }

    #handlePointerStart(event) {
        if (this.#stateManager.getState('viewMode') !== '2d') return;

        const position = this.#getCanvasPosition(event);
        const tool = this.#stateManager.getState('activeTool');

        if (tool === 'wall') {
            this.#activePointer = {
                start: position,
                current: position
            };
        } else if (tool === 'delete') {
            this.#deleteNearestWall(position);
        }
    }

    #handlePointerMove(event) {
        if (!this.#activePointer) return;
        this.#activePointer.current = this.#getCanvasPosition(event, true);
        this.#stateManager.setState('draftWall', { ...this.#activePointer });
    }

    #handlePointerEnd() {
        if (!this.#activePointer) return;

        const { start, current } = this.#activePointer;
        if (this.#isValidWall(start, current)) {
            this.#commitWall(start, current);
        }

        this.#activePointer = null;
        this.#stateManager.setState('draftWall', null);
    }

    #getCanvasPosition(event, applyConstraints = false) {
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (applyConstraints) {
            // Apply grid snapping and constraints
            const gridSize = CONFIG.SCALE.PIXELS_PER_METER / 2;
            x = Math.round(x / gridSize) * gridSize;
            y = Math.round(y / gridSize) * gridSize;
        }

        return { x, y };
    }

    #isValidWall(start, end) {
        const distance = Math.hypot(end.x - start.x, end.y - start.y);
        return distance > CONFIG.INTERACTION.MIN_WALL_LENGTH;
    }

    #commitWall(start, end) {
        const walls = [...this.#stateManager.getState('walls'), { start, end }];
        this.#stateManager.setState('walls', walls);
    }



    #deleteNearestWall(position) {
        const threshold = 15; // Pixel distance threshold for deletion
        let closestIndex = -1;
        let minDistance = Infinity;

        State.walls.forEach((wall, index) => {
            // Calculate distance from click position to wall segment
            const distance = this.#distanceToSegment(
                position,
                wall.start,
                wall.end
            );

            // Check if this is the closest wall within threshold
            if (distance < threshold && distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex > -1) {
            // Remove wall and update state
            State.walls.splice(closestIndex, 1);
            this.#sceneManager.removeWallGeometry(closestIndex);
            broadcastState();
            updateScene();
        }
    }

    #distanceToSegment(p, v, w) {
        // Vector math implementation for segment distance check
        const vectorToSegment = (point, start, end) => {
            const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);
            if (segmentLength === 0) return Math.hypot(point.x - start.x, point.y - start.y);

            const t = Math.max(0, Math.min(1,
                ((point.x - start.x) * (end.x - start.x) +
                    (point.y - start.y) * (end.y - start.y)) /
                Math.pow(segmentLength, 2)
            ));

            return Math.hypot(
                point.x - (start.x + t * (end.x - start.x)),
                point.y - (start.y + t * (end.y - start.y))
            );
        };

        return vectorToSegment(p, v, w);
    }


canvas2D.addEventListener('pointerdown', e => {
        if (State.mode === 'delete') {
    const pos = getPos(e);
    this.#deleteNearestWall(pos);
}
});


// ========================
// MAIN APPLICATION INIT
// ========================
class FloorplanApp {
    static instance;
    #animationFrame = null;
    #resizeObserver = null;

    constructor() {
        if (FloorplanApp.instance) return FloorplanApp.instance;

        this.state = new StateManager();
        this.scene = new SceneManager();
        this.input = new InputManager(this.state);
        this.renderer = null;
        this.camera = null;
        this.controls = null;

        this.#initStateListeners();
        this.#setupResizeHandling();
        FloorplanApp.instance = this;
    }

    #initStateListeners() {
        this.state.subscribe('walls', walls => {
            this.scene.updateWalls(walls);
            this.#requestRender();
        });

        this.state.subscribe('viewMode', mode => {
            this.#handleViewModeChange(mode);
            this.#updateUIState(mode);
            this.#requestRender();
        });

        this.state.subscribe('backgroundScale', () => {
            this.#requestRender();
        });
    }

    #handleViewModeChange(mode) {
        if (!this.camera || !this.controls) return;

        switch (mode) {
            case '2d':
                this.controls.enabled = false;
                this.camera.position.set(0, 50, 0);
                this.camera.lookAt(0, 0, 0);
                break;

            case '3d':
                this.controls.enabled = true;
                this.controls.target.set(0, 0, 0);
                this.camera.position.set(15, 15, 15);
                break;

            case 'first-person':
                this.controls.enabled = false;
                this.camera.position.set(0, 1.7, 0);
                this.camera.lookAt(0, 1.7, 5);
                break;
        }

        this.#updateCameraAspect();
    }

    #updateUIState(mode) {
        const uiState = {
            '2d': { canvasVisible: true, controlsVisible: false },
            '3d': { canvasVisible: false, controlsVisible: true },
            'first-person': { canvasVisible: false, controlsVisible: true }
        };

        const state = uiState[mode] || uiState['2d'];
        this.#setElementVisibility('#blueprint-canvas', state.canvasVisible);
        this.#setElementVisibility('.3d-controls', state.controlsVisible);
    }

    #setElementVisibility(selector, visible) {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = visible ? 'block' : 'none';
        });
    }

    initializeRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('cv'),
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.#setupCamera();
        this.#setupControls();
        this.#startRendering();
    }

    #setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.state.setState('camera', this.camera);
    }

    #setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    }

    #startRendering() {
        const animate = () => {
            try {
                this.#animationFrame = requestAnimationFrame(animate);

                // Update controls and camera
                if (this.state.getState('viewMode') === 'first-person') {
                    this.#handleFirstPersonMovement();
                } else {
                    this.controls.update();
                }

                // Update scene and render
                this.renderer.render(this.scene.scene, this.camera);
            } catch (error) {
                console.error('Rendering error:', error);
                this.#stopRendering();
            }
        };

        animate();
    }

    #handleFirstPersonMovement() {
        const moveState = this.state.getState('move');
        const speed = 0.15;
        const direction = new THREE.Vector3();
        const camera = this.camera;

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const side = new THREE.Vector3();
        side.crossVectors(camera.up, direction).normalize();

        if (moveState.f) camera.position.addScaledVector(direction, speed);
        if (moveState.b) camera.position.addScaledVector(direction, -speed);
        if (moveState.l) camera.position.addScaledVector(side, speed);
        if (moveState.r) camera.position.addScaledVector(side, -speed);
    }

    #setupResizeHandling() {
        this.#resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.#updateCameraAspect();
                this.#requestRender();
            }
        });

        this.#resizeObserver.observe(document.documentElement);
    }

    #updateCameraAspect() {
        const { innerWidth, innerHeight } = window;
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(innerWidth, innerHeight);
    }

    #requestRender() {
        if (!this.#animationFrame) {
            this.#animationFrame = requestAnimationFrame(() => {
                this.renderer.render(this.scene.scene, this.camera);
                this.#animationFrame = null;
            });
        }
    }

    #stopRendering() {
        if (this.#animationFrame) {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = null;
        }
    }

    destroy() {
        this.#stopRendering();
        this.#resizeObserver.disconnect();
        this.scene.cleanup();
        this.renderer.dispose();
        FloorplanApp.instance = null;
    }
}

// Initialize application
const app = new FloorplanApp();
app.initializeRenderer();

// Handle window unloading
window.addEventListener('beforeunload', () => app.destroy());



// ========================
// ASSET MANAGEMENT SYSTEM
// ========================
class AssetManager {
    static async initialize() {
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.loader.setDRACOLoader(this.dracoLoader);

        await this.#preloadCoreAssets();
    }

    static async #preloadCoreAssets() {
        this.coreAssets = {
            chair: await this.loadAsset('/assets/core/chair.glb'),
            table: await this.loadAsset('/assets/core/table.glb')
        };
    }

    static async loadAsset(url) {
        try {
            const gltf = await this.loader.loadAsync(url);
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            return gltf;
        } catch (error) {
            console.error('Asset loading failed:', error);
            return null;
        }
    }

    static async loadUserAsset(file) {
        // Validate magic header
        if (!file) return null;
        const header = new Uint32Array(arrayBuffer, 0, 1);
        if (header[0] !== 0x46546C67) throw new Error("Invalid GLB file");
        const validTypes = ['model/gltf-binary', 'model/gltf+json'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file format. Only GLB/GLTF supported');
        }

        const arrayBuffer = await file.arrayBuffer();
        return this.loadAsset(URL.createObjectURL(new Blob([arrayBuffer])));
    }
}





// ========================
// ENHANCED INPUT MANAGER
// ========================

class InputManager {
    #stateManager;
    #sceneManager;
    #camera;
    #dragStartPosition = new THREE.Vector3();
    #originalRotation = 0;
    #transformMode = 'translate';
    #activePointerType = null;

    constructor(stateManager) {
        this.#stateManager = stateManager;
        this.#initAssetHandling();
        this.#setupGestureRecognizers();
        this.#raycaster = new THREE.Raycaster();
        this.#raycaster.params.Points.threshold = 0.1;
    }

    #initAssetHandling() {
        this.#setupFileUpload();
        this.#setupAssetDrag();
        this.#setupTouchControls();
        this.#setupKeyboardControls();
    }

    #setupFileUpload() {
        const uploadInput = document.getElementById('model-upload');
        uploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            try {
                const asset = await AssetManager.loadUserAsset(file);
                this.#stateManager.setState('selectedAsset', asset);
                this.#showSuccess('Asset loaded successfully!');
            } catch (error) {
                this.#showError(`Upload failed: ${error.message}`);
            }
        });
    }

    #setupAssetDrag() {
        const canvas3D = document.getElementById('cv');

        // Mouse controls
        canvas3D.addEventListener('mousedown', this.#handleDragStart.bind(this));
        canvas3D.addEventListener('mousemove', this.#handleDragUpdate.bind(this));
        canvas3D.addEventListener('mouseup', this.#handleDragEnd.bind(this));

        // Context menu for transformations
        canvas3D.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.#cycleTransformMode();
        });
    }

    #setupTouchControls() {
        const canvas3D = document.getElementById('cv');
        let touchStartTime = 0;

        // Touch event handlers
        canvas3D.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartTime = Date.now();
            this.#handleDragStart(e.touches[0]);
            this.#activePointerType = 'touch';
        });

        canvas3D.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.#handleDragUpdate(e.touches[0]);
        });

        canvas3D.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (Date.now() - touchStartTime < 300) {
                this.#handleQuickTap();
            }
            this.#handleDragEnd();
        });
    }

    #setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r') this.#transformMode = 'rotate';
            if (e.key === 's') this.#transformMode = 'scale';
            if (e.key === 'g') this.#transformMode = 'translate';

            if (e.key === 'z' && e.ctrlKey) this.#undoLastAction();
            if (e.key === 'y' && e.ctrlKey) this.#redoLastAction();
        });
    }

    #handleDragStart(event) {
        const intersects = this.#getRaycastIntersections(event);
        const asset = this.#sceneManager.handleAssetInteraction(intersects);

        if (asset) {
            this.#dragStartPosition.copy(asset.object.position);
            this.#originalRotation = asset.object.rotation.y;
            this.#stateManager.setState('activeAsset', {
                ...asset,
                originalTransform: {
                    position: asset.object.position.clone(),
                    rotation: asset.object.rotation.clone()
                }
            });
        }
    }

    #handleDragUpdate(event) {
        const activeAsset = this.#stateManager.getState('activeAsset');
        if (!activeAsset) return;

        const intersects = this.#getRaycastIntersections(event);
        const floorIntersect = this.#findValidSurface(intersects);

        if (floorIntersect) {
            switch (this.#transformMode) {
                case 'translate':
                    this.#handleTranslation(activeAsset, floorIntersect);
                    break;
                case 'rotate':
                    this.#handleRotation(activeAsset, event);
                    break;
                case 'scale':
                    this.#handleScaling(activeAsset, event);
                    break;
            }
        }
    }

    #handleDragEnd() {
        const activeAsset = this.#stateManager.getState('activeAsset');
        if (activeAsset) {
            this.#commitTransform(activeAsset);
            this.#stateManager.setState('activeAsset', null);
        }
    }

    #handleTranslation(asset, intersect) {
        if (this.#sceneManager.validatePosition(asset.object, intersect.point)) {
            asset.updatePosition(intersect.point);
            this.#showTransformPreview(asset.object);
        }
    }

    #handleRotation(asset, event) {
        const deltaX = event.movementX || 0;
        const rotationSpeed = Math.PI / 180;
        asset.object.rotation.y = this.#originalRotation + (deltaX * rotationSpeed);
        this.#showTransformPreview(asset.object);
    }

    #handleScaling(asset, event) {
        const deltaY = event.movementY || 0;
        const scaleSpeed = 0.01;
        const newScale = Math.max(0.5, asset.object.scale.y + (deltaY * scaleSpeed));
        asset.object.scale.set(newScale, newScale, newScale);
        this.#showTransformPreview(asset.object);
    }

    #cycleTransformMode() {
        const modes = ['translate', 'rotate', 'scale'];
        const currentIndex = modes.indexOf(this.#transformMode);
        this.#transformMode = modes[(currentIndex + 1) % modes.length];
        this.#showTooltip(`Transform mode: ${this.#transformMode}`);
    }

    #findValidSurface(intersects) {
        return intersects.find(i =>
            i.object.userData.isSurface ||
            i.object.name === 'floor'
        );
    }

    #showTransformPreview(object) {
        const previewMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7
        });

        object.material = previewMaterial;
        object.material.needsUpdate = true;
    }

    #commitTransform(asset) {
        const history = this.#stateManager.getState('transformHistory') || [];
        history.push(asset.originalTransform);
        this.#stateManager.setState('transformHistory', history);

        asset.object.material = asset.originalMaterial;
        this.#sceneManager.updatePhysicsBody(asset.object);
    }

    #undoLastAction() {
        const history = [...this.#stateManager.getState('transformHistory')];
        const lastState = history.pop();

        if (lastState) {
            this.#stateManager.setState('transformHistory', history);
            this.#sceneManager.restoreTransform(lastState);
        }
    }

    #setupGestureRecognizers() {
        this.#gestures = {
            isPinching: false,
            startDistance: 0,
            startAngle: 0,
            currentScale: 1,
            currentRotation: 0
        };
    }

    #getRaycastIntersections(event) {
        const coords = this.#getNormalizedCoordinates(event);
        this.#raycaster.setFromCamera(coords, this.#camera);

        return this.#raycaster.intersectObjects(
            this.#sceneManager.getInteractiveObjects(),
            true
        ).filter(intersection => {
            return !intersection.object.userData?.nonInteractive;
        });
    }

    #getNormalizedCoordinates(event) {
        const rect = event.target.getBoundingClientRect();
        const isTouch = event.touches && event.touches.length > 0;
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;
        const clientY = isTouch ? event.touches[0].clientY : event.clientY;

        return new THREE.Vector2(
            ((clientX - rect.left) / rect.width) * 2 - 1,
            -((clientY - rect.top) / rect.height) * 2 + 1
        );
    }

    #setupTouchControls() {
        const canvas3D = document.getElementById('cv');
        let activeTouches = new Map();

        canvas3D.addEventListener('touchstart', (e) => {
            e.preventDefault();
            Array.from(e.touches).forEach(touch => {
                activeTouches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY,
                    timestamp: Date.now()
                });
            });

            if (e.touches.length === 2) {
                this.#handlePinchStart(e.touches);
            }
        });

        canvas3D.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touches = Array.from(e.touches);

            if (touches.length === 1) {
                this.#handleSingleTouchMove(touches[0]);
            } else if (touches.length === 2) {
                this.#handleMultiTouchMove(touches);
            }
        });

        canvas3D.addEventListener('touchend', (e) => {
            e.preventDefault();
            Array.from(e.changedTouches).forEach(touch => {
                activeTouches.delete(touch.identifier);
            });

            if (activeTouches.size === 0) {
                this.#handleTouchEnd();
            }
        });
    }

    #handlePinchStart(touches) {
        const touch1 = touches[0];
        const touch2 = touches[1];

        this.#gestures = {
            isPinching: true,
            startDistance: this.#calculateTouchDistance(touch1, touch2),
            startAngle: this.#calculateTouchAngle(touch1, touch2),
            currentScale: this.#stateManager.getState('selectedAsset')?.scale.x || 1,
            startRotation: this.#stateManager.getState('selectedAsset')?.rotation.y || 0
        };
    }

    #handleSingleTouchMove(touch) {
        const activeAsset = this.#stateManager.getState('activeAsset');
        if (!activeAsset) return;

        const intersects = this.#getRaycastIntersections(touch);
        const surfaceIntersect = this.#findValidSurface(intersects);

        if (surfaceIntersect) {
            activeAsset.updatePosition(surfaceIntersect.point);
            this.#showTransformPreview(activeAsset.object);
        }
    }

    #handleMultiTouchMove(touches) {
        if (!this.#gestures.isPinching) return;

        const currentDistance = this.#calculateTouchDistance(touches[0], touches[1]);
        const currentAngle = this.#calculateTouchAngle(touches[0], touches[1]);

        // Handle scaling
        const scaleDelta = currentDistance / this.#gestures.startDistance;
        const newScale = Math.min(Math.max(
            this.#gestures.currentScale * scaleDelta,
            0.5
        ), 3);

        // Handle rotation
        const angleDelta = currentAngle - this.#gestures.startAngle;
        const newRotation = this.#gestures.startRotation + angleDelta;

        const activeAsset = this.#stateManager.getState('activeAsset');
        if (activeAsset) {
            activeAsset.object.scale.set(newScale, newScale, newScale);
            activeAsset.object.rotation.y = newRotation;
            this.#showTransformPreview(activeAsset.object);
        }
    }

    #calculateTouchDistance(t1, t2) {
        return Math.hypot(
            t2.clientX - t1.clientX,
            t2.clientY - t1.clientY
        );
    }

    #calculateTouchAngle(t1, t2) {
        return Math.atan2(
            t2.clientY - t1.clientY,
            t2.clientX - t1.clientX
        );
    }

    #handleTouchEnd() {
        if (this.#gestures.isPinching) {
            this.#commitTransform(this.#stateManager.getState('activeAsset'));
            this.#gestures.isPinching = false;
        }
    }

    // Enhanced transformation methods
    #handleTranslation(asset, intersect) {
        if (this.#isValidPlacement(asset.object, intersect.point)) {
            asset.updatePosition(intersect.point);
            this.#showTransformPreview(asset.object);
        } else {
            this.#showErrorIndicator(intersect.point);
        }
    }

    #isValidPlacement(object, position) {
        return this.#sceneManager.validatePosition(object, position) &&
            !this.#sceneManager.checkCollisions(object, position);
    }

    #showErrorIndicator(position) {
        const indicator = new THREE.Mesh(
            new THREE.SphereGeometry(0.2),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        indicator.position.copy(position);
        this.#sceneManager.scene.add(indicator);

        setTimeout(() => {
            this.#sceneManager.scene.remove(indicator);
            indicator.geometry.dispose();
            indicator.material.dispose();
        }, 500);
    }

    // Enhanced undo/redo with transaction grouping
    #commitTransform(asset) {
        const transaction = {
            timestamp: Date.now(),
            transforms: [{
                object: asset.object.uuid,
                position: asset.originalTransform.position.clone(),
                rotation: asset.originalTransform.rotation.clone(),
                scale: asset.object.scale.clone()
            }]
        };

        this.#stateManager.logTransformTransaction(transaction);
        this.#updatePhysicsBody(asset.object);
    }

    #updatePhysicsBody(object) {
        this.#sceneManager.syncPhysicsBody(object);
    }

    // Improved raycast-based object selection
    #handleObjectSelection(intersects) {
        const priorityOrder = [
            'interactiveAsset',
            'wall',
            'floor'
        ];

        for (const type of priorityOrder) {
            const found = intersects.find(i =>
                i.object.userData.objectType === type
            );
            if (found) return found;
        }
        return intersects[0];
    }
}

// ========================
// ENHANCED SCENE MANAGER
// ========================

class SceneManager {
    #scene = new THREE.Scene();
    #assets = new Map();
    #physicsWorld = new CANNON.World();
    #materialCache = new Map();
    #collisionGroups = {
        #navMesh = null;
        #pathfinder = new Pathfinder();
        STATIC: 1,
        DYNAMIC: 2
    };

    constructor() {
        this.initEnvironment();
        this.#initPhysics();
    }


    // ========================
    // ENVIRONMENT INITIALIZATION
    // ========================



    initEnvironment() {
        // Basic lighting setup
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const directional = new THREE.DirectionalLight(0xffffff, 1.0);
        directional.position.set(20, 30, 20);
        directional.castShadow = true;

        // Floor geometry
        const floorGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.9,
            metalness: 0.1
        });

        // Floor mesh
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;

        // Navigation mesh initialization
        this.#navMesh = new THREE.Group();
        this.#createBaseNavMesh();

        this.#scene.add(ambient, directional, floor, this.#navMesh);
    }

    // ========================
    // NAVIGATION MESH UPDATES
    // ========================
    #createBaseNavMesh() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshBasicMaterial({
            visible: false,
            wireframe: true
        });

        const baseMesh = new THREE.Mesh(geometry, material);
        baseMesh.userData = { isNavMesh: true };
        this.#navMesh.add(baseMesh);

        this.#pathfinder.setZoneData('level1', Pathfinder.createZone(geometry));
    }

    updateNavigationMesh(walls) {
        // Remove old wall colliders
        this.#navMesh.children.slice(1).forEach(child => child.geometry.dispose());
        this.#navMesh.children = [this.#navMesh.children[0]];

        // Add new wall colliders
        walls.forEach(wall => {
            const geometry = this.#createWallGeometry(wall);
            const mesh = new THREE.Mesh(geometry);
            this.#navMesh.add(mesh);
        });

        // Regenerate navigation mesh
        const zone = Pathfinder.createZone(this.#navMesh.children[0].geometry);
        this.#pathfinder.setZoneData('level1', zone);
        this.#applyNavigationHoles();
    }

    #createWallGeometry(wall) {
        const points = [
            new THREE.Vector2(wall.start.x, wall.start.z),
            new THREE.Vector2(wall.end.x, wall.end.z),
            new THREE.Vector2(wall.end.x + 0.5, wall.end.z + 0.5),
            new THREE.Vector2(wall.start.x + 0.5, wall.start.z + 0.5)
        ];

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.rotateX(-Math.PI / 2);

        return geometry;
    }

    #applyNavigationHoles() {
        const holes = this.#navMesh.children.slice(1)
            .map(child => ({
                shape: new THREE.Path(child.geometry.attributes.position.array),
                depth: 10
            }));

        Pathfinder.buildNavMesh(this.#navMesh.children[0], holes, 0.1);
    }


    // ========================
    // DEBUG VISUALIZATION
    // ========================
    showNavMesh(visible = true) {
        this.#navMesh.children[0].material.visible = visible;
        this.#navMesh.children[0].material.wireframe = visible;
        this.#navMesh.children[0].material.opacity = visible ? 0.5 : 0;
    }
}

  async addModelAsset(asset, position, userOptions = {}) {
    try {
        const model = await this.#prepareModel(asset, position, userOptions);
        this.#registerPhysicsBody(model, position);
        this.#scene.add(model);
        this.#assets.set(model.uuid, model);
        return model;
    } catch (error) {
        console.error('Failed to add model asset:', error);
        throw new Error('Asset loading failed: ' + error.message);
    }
}

  async #prepareModel(asset, position, options) {
    const model = asset.scene.clone(true);
    model.position.copy(position);

    // Material processing
    model.traverse(child => {
        if (child.isMesh) {
            this.#optimizeMaterials(child);
            this.#enableShadow(child);
        }
    });

    // Set interaction metadata
    model.userData = {
        type: 'asset',
        draggable: options.draggable ?? true,
        resizable: options.resizable ?? false,
        originalPosition: position.clone(),
        physicalBody: null,
        collisionFilterGroup: options.static ?
            this.#collisionGroups.STATIC :
            this.#collisionGroups.DYNAMIC
    };

    return model;
}

#optimizeMaterials(mesh) {
    const cachedMat = this.#materialCache.get(mesh.material.uuid);
    if (cachedMat) {
        mesh.material = cachedMat;
        return;
    }

    mesh.material = mesh.material.clone();
    mesh.material.roughness = 0.6;
    mesh.material.metalness = 0.1;
    mesh.material.needsUpdate = true;
    this.#materialCache.set(mesh.material.uuid, mesh.material);
}

#initPhysics() {
    this.#physicsWorld.gravity.set(0, 0, 0);
    this.#physicsWorld.solver.iterations = 10;
    this.#physicsWorld.defaultContactMaterial.friction = 0.5;
}

#registerPhysicsBody(model, position) {
    const shape = this.#createCollisionShape(model);
    const body = new CANNON.Body({
        mass: model.userData.static ? 0 : 1,
        material: new CANNON.Material(),
        position: new CANNON.Vec3(
            position.x,
            position.y,
            position.z
        )
    });

    body.addShape(shape);
    body.collisionFilterGroup = model.userData.collisionFilterGroup;
    model.userData.physicalBody = body;
    this.#physicsWorld.addBody(body);
}

#createCollisionShape(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);

    return new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
    );
}

handleAssetInteraction(intersections) {
    const asset = intersections.find(i =>
        i.object.userData.draggable &&
        i.object.visible
    );

    if (!asset) return null;

    return this.#createAssetController(asset);
}

#createAssetController(asset) {
    return {
        object: asset.object,
        position: asset.point,
        updatePosition: (newPosition) => {
            if (this.#validatePosition(asset.object, newPosition)) {
                asset.object.position.copy(newPosition);
                asset.object.userData.physicalBody.position.copy(newPosition);
                asset.object.userData.originalPosition.copy(newPosition);
            }
        },
        rotate: (angle) => {
            asset.object.rotation.y = angle;
            asset.object.userData.physicalBody.quaternion.setFromEuler(
                0, angle, 0
            );
        },
        reset: () => {
            this.updatePosition(asset.object.userData.originalPosition);
        }
    };
}

#validatePosition(object, newPosition) {
    // Check collisions
    const overlaps = this.#checkCollisions(object, newPosition);
    if (overlaps.length > 0) return false;

    // Check bounds
    const bounds = this.#scene.userData.bounds;
    return newPosition.x >= bounds.min.x &&
        newPosition.x <= bounds.max.x &&
        newPosition.z >= bounds.min.z &&
        newPosition.z <= bounds.max.z;
}

#checkCollisions(object, position) {
    object.userData.physicalBody.position.copy(position);
    this.#physicsWorld.step(1 / 60);

    return this.#physicsWorld.contacts
        .filter(contact =>
            contact.bi.id === object.userData.physicalBody.id ||
            contact.bj.id === object.userData.physicalBody.id
        );
}

updateWalls(walls) {
    super.updateWalls(walls);
    this.#updateNavigationMesh();
}

#updateNavigationMesh() {
    // ========================
    // PATHFINDING IMPLEMENTATION
    // ========================
    findPath(start, end) {
        const group = this.#pathfinder.getGroup('level1', start);
        const path = [];

        this.#pathfinder.findPath(
            start,
            end,
            'level1',
            group,
            (path) => {
                path.forEach(node => {
                    path.push(new THREE.Vector3(
                        node.centroid.x,
                        start.y,
                        node.centroid.z
                    ));
                });
            }
        );

        return path;
    }




    cleanup() {
        this.#assets.forEach(asset => {
            this.#physicsWorld.remove(asset.userData.physicalBody);
            asset.geometry.dispose();
            asset.material.dispose();
        });
        this.#assets.clear();
        this.#materialCache.clear();
    }
}
// ========================
// UI COMPONENTS
// ========================
class AssetLibraryUI {
    static async initialize() {
        await AssetManager.initialize();
        this.#renderCoreAssets();
    }

    static #renderCoreAssets() {
        const container = document.getElementById('asset-library');

        Object.entries(AssetManager.coreAssets).forEach(([name, asset]) => {
            const thumbnail = this.#createAssetThumbnail(name, asset);
            container.appendChild(thumbnail);
        });
    }

    static #createAssetThumbnail(name, asset) {
        const element = document.createElement('div');
        element.className = 'asset-thumbnail';
        element.innerHTML = `
      <img src="/assets/thumbnails/${name}.jpg" alt="${name}">
      <span>${name}</span>
    `;

        element.addEventListener('click', () => {
            const position = new THREE.Vector3(
                Math.random() * 10 - 5,
                0,
                Math.random() * 10 - 5
            );
            SceneManager.addModelAsset(asset, position);
        });

        return element;
    }
}