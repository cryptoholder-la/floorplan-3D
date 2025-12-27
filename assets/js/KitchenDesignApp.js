import { SceneManager } from './sceneManager.js';
import { ControlsManager } from './controlsManager.js';
import { ObjectManager } from './objectManager.js';
import { FloorplanEditor } from './floorplanEditor.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { FloorplanManager } from './floorplan/floorplan-manager.js';
import { ElevationControls } from './ui/ElevationControls.js';
import { HintSystem } from './ui/HintSystem.js';

/**
 * Main application class for the Kitchen Designer.
 */
export class KitchenDesignApp {
    constructor() {
        console.log('Initializing Kitchen Design App...');
        
        this.sceneManager = new SceneManager();
        console.log('SceneManager created');
        
        this.objectManager = new ObjectManager(this.sceneManager);
        console.log('ObjectManager created');
        
        this.controlsManager = new ControlsManager(this.sceneManager, this.objectManager);
        console.log('ControlsManager created');
        
        // Initialize floorplan manager
        this.floorplanManager = new FloorplanManager('floorplan-view');
        console.log('FloorplanManager created');
        
        /**
         * @tweakable Hint system integration for guided user experience
         */
        this.hintSystemConfig = {
            enableOnStartup: true,
            showWelcomeSequence: true,
            enableModeHints: true,
            enableInteractionHints: true
        };
        
        if (this.hintSystemConfig.enableOnStartup) {
            this.hintSystem = new HintSystem();
            this.setupHintIntegration();
            console.log('HintSystem created');
        }
        
        // Set up floorplan tool handlers
        const floorplanTools = {
            'add-wall': () => this.floorplanManager.setDrawingMode('wall'),
            'add-door': () => this.floorplanManager.setDrawingMode('door'),
            'add-window': () => this.floorplanManager.setDrawingMode('window')
        };

        Object.entries(floorplanTools).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('click', handler);
        });

        this.initUI();
        this.animate();
        
        // Add after existing initialization
        this.elevationControls = new ElevationControls(
            this.sceneManager,
            document.getElementById('three-d-view'),
            this.controlsManager
        );

        this.syncSettings = {
            autoSync: true,
            syncInterval: 500,
            batchUpdates: true,
            enableRealTimeUpdates: true
        };

        this.setupSceneSync();
        this.setupEnhancedKeyboardShortcuts();
        
        // Initial scene debug
        setTimeout(() => {
            this.debugScene();
        }, 1000);
    }

    /**
     * @tweakable Enhanced keyboard shortcuts for undo/redo and view management
     */
    setupEnhancedKeyboardShortcuts() {
        const keyboardConfig = {
            enableUndoRedo: true,
            enableViewSwitching: true,
            enableQuickActions: true,
            modifierKey: 'ctrlKey'
        };
        
        document.addEventListener('keydown', (event) => {
            const isModifier = event[keyboardConfig.modifierKey] || event.metaKey;
            
            if (keyboardConfig.enableUndoRedo && isModifier) {
                switch (event.key.toLowerCase()) {
                    case 'z':
                        if (event.shiftKey) {
                            event.preventDefault();
                            this.objectManager.redo();
                        } else {
                            event.preventDefault();
                            this.objectManager.undo();
                        }
                        break;
                    case 'y':
                        event.preventDefault();
                        this.objectManager.redo();
                        break;
                }
            }
            
            if (keyboardConfig.enableViewSwitching && isModifier) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        this.sceneManager.setView('perspective');
                        break;
                    case '2':
                        event.preventDefault();
                        this.sceneManager.setView('front');
                        break;
                    case '3':
                        event.preventDefault();
                        this.sceneManager.setView('right');
                        break;
                }
            }
            
            if (keyboardConfig.enableQuickActions) {
                switch (event.key.toLowerCase()) {
                    case 'delete':
                    case 'backspace':
                        if (this.objectManager.selectedObject) {
                            event.preventDefault();
                            this.objectManager.removeSelectedObject();
                        }
                        break;
                    case 'escape':
                        event.preventDefault();
                        this.objectManager.selectedObject = null;
                        this.controlsManager.selectObject(null);
                        break;
                }
            }
        });
    }

    /**
     * @tweakable Hint system integration with application events
     */
    setupHintIntegration() {
        if (!this.hintSystem) return;
        
        const hintIntegrationConfig = {
            trackModeChanges: true,
            trackFirstActions: true,
            trackErrors: true,
            showCompletionHints: true
        };
        
        // Mode change tracking
        if (hintIntegrationConfig.trackModeChanges) {
            document.addEventListener('click', (event) => {
                const button = event.target.closest('[id^="mode-"]');
                if (button) {
                    const mode = button.id.replace('mode-', '');
                    const modeEvent = new CustomEvent('mode-changed', {
                        detail: { mode, previousMode: this.currentMode }
                    });
                    document.dispatchEvent(modeEvent);
                    this.currentMode = mode;
                }
            });
        }
        
        // First action tracking
        if (hintIntegrationConfig.trackFirstActions) {
            let firstWallCreated = false;
            this.floorplanManager.core.subscribe = this.floorplanManager.core.subscribe || (() => {});
            
            const originalAddElement = this.floorplanManager.core.addElement.bind(this.floorplanManager.core);
            this.floorplanManager.core.addElement = (type, data) => {
                const result = originalAddElement(type, data);
                
                if (type === 'wall' && !firstWallCreated) {
                    firstWallCreated = true;
                    const wallEvent = new CustomEvent('wall-created', {
                        detail: { isFirst: true, wallData: data }
                    });
                    document.dispatchEvent(wallEvent);
                }
                
                return result;
            };
        }
        
        // Element selection tracking
        if (hintIntegrationConfig.trackFirstActions) {
            const originalSelectObject = this.controlsManager.selectObject.bind(this.controlsManager);
            this.controlsManager.selectObject = (object) => {
                const result = originalSelectObject(object);
                
                if (object && object.userData.type) {
                    const selectEvent = new CustomEvent('element-selected', {
                        detail: { 
                            type: object.userData.type, 
                            object: object,
                            isFirst: !this.hasSelectedBefore
                        }
                    });
                    document.dispatchEvent(selectEvent);
                    this.hasSelectedBefore = true;
                }
                
                return result;
            };
        }
        
        // Error tracking for helpful hints
        if (hintIntegrationConfig.trackErrors) {
            window.addEventListener('error', (event) => {
                // Show helpful hint based on error type
                if (event.message.includes('collision')) {
                    this.hintSystem.showHint('tips.performance', { type: 'error-help' });
                }
            });
        }
    }

    debugScene() {
        console.log('=== Scene Debug Info ===');
        this.sceneManager.debugSceneVisibility();
        console.log('ObjectManager objects:', this.objectManager.objects.length);
        console.log('Renderer domElement parent:', this.sceneManager.renderer.domElement.parentElement);
    }

    setupSceneSync() {
        if (this.syncSettings.autoSync) {
            setInterval(() => {
                this.syncFloorplanToScene();
            }, this.syncSettings.syncInterval);
        }
    }

    /**
     * Synchronize floorplan elements to 3D scene
     * @tweakable Use direct updateFromFloorplan instead of batch updates
     */
    syncFloorplanToScene() {
        if (!this.floorplanManager || !this.floorplanManager.core || !this.floorplanManager.core.isDirty) return;
        
        const elements3D = this.floorplanManager.core.convertTo3D();
        // Batch updates not supported by ObjectManager; always update directly
        this.objectManager.updateFromFloorplan(elements3D);
        this.floorplanManager.core.isDirty = false;
    }

    initUI() {
        // --- FIX: Append 3D renderer to the correct container ---
        const threeDContainer = document.getElementById('three-d-view');
        if (!threeDContainer) {
            console.error('3D View container not found!');
            return;
        }
        
        console.log('Appending renderer to 3D view container');
        
        // Ensure the container is empty before appending the renderer
        // Preserve the viewport label bar if it exists
        const labelBar = threeDContainer.querySelector('.viewport-label-bar');
        
        while (threeDContainer.firstChild) {
            threeDContainer.removeChild(threeDContainer.firstChild);
        }
        
        if (labelBar) {
            threeDContainer.appendChild(labelBar);
        }
        
        threeDContainer.appendChild(this.sceneManager.renderer.domElement);
        this.sceneManager.onWindowResize(); // Adjust size immediately
        // --- END FIX ---
        
        // Force initial render
        this.sceneManager.render();
        
        // Basic controls
        const basicControls = {
            'add-cabinet': () => this.objectManager.createObject('cabinet'),
            'add-countertop': () => this.objectManager.createObject('countertop'),
            'add-appliance': () => this.objectManager.createObject('appliance'),
            'toggle-grid': () => this.sceneManager.toggleGrid(),
            'remove-selected': () => this.objectManager.removeSelectedObject(),
            'toggle-shadows': () => this.sceneManager.toggleShadows(),
            'toggle-hemisphere-light': () => this.sceneManager.toggleHemisphereLight(),
            'export-scene': () => this.exportScene()
        };

        // Add catalog item controls
        const catalogItems = [
            'kitchenCabinet', 'kitchenFridge', 'chair', 'table', 'kitchenStove',
            'kitchenSink', 'kitchenBlender', 'doorway', 'wall'
        ];

        const catalogConfig = {
            generateButtons: true,
            groupByCategory: true,
            enableTooltips: true
        };

        if (catalogConfig.generateButtons) {
            this.generateCatalogButtons(catalogItems);
        }

        // Add event listeners for basic controls
        Object.entries(basicControls).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });

        // Color controls
        const colorControls = {
            'cabinet-color': 'cabinet',
            'countertop-color': 'countertop',
            'appliance-color': 'appliance',
            'floor-color': 'floor'
        };

        Object.entries(colorControls).forEach(([id, type]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (event) => {
                    if (type === 'floor') {
                        this.objectManager.updateFloorColor(event);
                    } else {
                        this.objectManager.updateObjectColor(event, type);
                    }
                });
            }
        });

        // Object property controls
        ['width', 'height', 'depth'].forEach(prop => {
            const element = document.getElementById(`object-${prop}`);
            if (element) {
                element.addEventListener('change', (event) => 
                    this.objectManager.updateSelectedObject(event, prop)
                );
            }
        });

        // Quality selector
        const qualitySelector = document.getElementById('quality-selector');
        if (qualitySelector) {
            qualitySelector.addEventListener('change', (event) => 
                this.sceneManager.updateRenderQuality(event)
            );
        }

        // Cabinet width selectors and add buttons
        const cabinetTypes = ['base', 'wall', 'tall'];
        cabinetTypes.forEach(type => {
            const widthSelect = document.getElementById(`${type}-cabinet-width`);
            const addButton = document.getElementById(`add-${type}-cabinet`);
            
            if (addButton) {
                addButton.addEventListener('click', () => {
                    const width = widthSelect ? parseInt(widthSelect.value) : 24;
                    this.objectManager.createFromTemplate(`${type}Cabinet`, width);
                });
            }
        });

        // Appliance buttons
        const applianceTypes = ['refrigerator', 'range', 'dishwasher'];
        applianceTypes.forEach(type => {
            const button = document.getElementById(`add-${type}`);
            if (button) {
                button.addEventListener('click', () => 
                    this.objectManager.createFromTemplate(`${type}Enclosure`)
                );
            }
        });

        // Add undo/redo controls
        this.setupUndoRedoControls();
    }

    generateCatalogButtons(catalogItems) {
        const catalogContainer = document.createElement('div');
        catalogContainer.className = 'catalog-items';
        catalogContainer.innerHTML = '<h3>Catalog Items</h3>';

        catalogItems.forEach(itemName => {
            const button = document.createElement('button');
            button.textContent = `Add ${itemName.replace(/([A-Z])/g, ' $1').trim()}`;
            button.addEventListener('click', async () => {
                await this.objectManager.createFromCatalog(itemName);
            });
            catalogContainer.appendChild(button);
        });

        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.appendChild(catalogContainer);
        }
    }

    setupUndoRedoControls() {
        const undoRedoConfig = {
            enableKeyboardShortcuts: true,
            undoKey: 'z',
            redoKey: 'y',
            modifierKey: 'ctrl',
            showUndoRedoButtons: true
        };

        // Add undo/redo buttons to UI
        if (undoRedoConfig.showUndoRedoButtons) {
            const undoButton = document.createElement('button');
            undoButton.textContent = 'Undo (Ctrl+Z)';
            undoButton.addEventListener('click', () => {
                const success = this.objectManager.undo();
                if (!success) {
                    console.log('Nothing to undo');
                }
            });

            const redoButton = document.createElement('button');
            redoButton.textContent = 'Redo (Ctrl+Y)';
            redoButton.addEventListener('click', () => {
                const success = this.objectManager.redo();
                if (!success) {
                    console.log('Nothing to redo');
                }
            });

            const controlGroup = document.createElement('div');
            controlGroup.className = 'control-group';
            controlGroup.innerHTML = '<h2>History</h2>';
            controlGroup.appendChild(undoButton);
            controlGroup.appendChild(redoButton);

            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.appendChild(controlGroup);
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controlsManager.update();
        this.sceneManager.render();
    }

    exportScene() {
        const exporter = new GLTFExporter();
        exporter.parse(this.sceneManager.scene, (gltf) => {
            const dataStr = JSON.stringify(gltf);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportName = 'scene.gltf';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportName);
            linkElement.click();
        }, { binary: false });
    }
}

new KitchenDesignApp();