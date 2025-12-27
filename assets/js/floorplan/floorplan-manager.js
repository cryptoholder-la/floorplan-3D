import { FloorplanCore } from './floorplan-core.js';
import { FloorplanCanvas } from './floorplan-canvas.js';
import { FloorplanInteraction } from './interaction-handler.js';

export class FloorplanManager {
    constructor(containerId) {
        this.core = new FloorplanCore();
        this.canvas = new FloorplanCanvas(containerId, this.core);
        this.interaction = new FloorplanInteraction(
            this.canvas.canvas,
            this.core,
            this.canvas
        );

        this.defaultLayout = {
            createDefaultWalls: true,
            roomWidth: 20 * 20, // feet to pixels
            roomLength: 24 * 20, // feet to pixels
            margin: 5 * 20 // feet from canvas edge
        };

        /**
         * @tweakable Wall interaction mode configuration for floorplan editing
         */
        this.wallEditingConfig = {
            enableWallSelection: true,
            enableAttributeEditing: true,
            enableWallMovement: true,
            defaultSelectionMode: true // Start in selection mode by default
        };

        /**
         * @tweakable Bidirectional sync configuration for 2D/3D integration
         */
        this.bidirectionalSyncConfig = {
            enableRealTimeSync: true,
            throttleUpdates: true,
            updateThrottleMs: 100,
            enablePositionValidation: true
        };
        
        this.pendingUpdates = new Map();
        this.updateThrottleTimeout = null;
        
        /**
         * @tweakable Integration with UI mode selection for element creation
         */
        this.modeSelectionConfig = {
            enableUIIntegration: true,
            listenToModeChanges: true,
            supportElementVariants: true,
            defaultVariantBehavior: 'use-first'
        };
        
        this.elementVariants = new Map();
        this.currentModeSelection = {};
        
        if (this.bidirectionalSyncConfig.enableRealTimeSync) {
            this.setupBidirectionalSync();
        }
        
        // Initialize with wall selection mode if enabled
        if (this.wallEditingConfig.defaultSelectionMode) {
            this.setDrawingMode('select');
        }
        
        if (this.defaultLayout.createDefaultWalls) {
            this.createDefaultLayout();
        }
        
        if (this.modeSelectionConfig.enableUIIntegration) {
            this.setupModeSelectionIntegration();
        }
    }

    /**
     * @tweakable Drawing mode configuration including wall selection mode
     */
    setDrawingMode(mode) {
        const supportedModes = ['wall', 'door', 'window', 'select'];
        
        if (supportedModes.includes(mode)) {
            this.interaction.currentTool = mode;
            
            // Update canvas cursor based on mode
            const cursorMap = {
                'wall': 'crosshair',
                'door': 'copy',
                'window': 'copy',
                'select': 'pointer'
            };
            
            this.canvas.canvas.style.cursor = cursorMap[mode] || 'default';
        } else {
            console.warn(`Unsupported drawing mode: ${mode}`);
        }
    }

    /**
     * @tweakable Setup for bidirectional synchronization between 2D and 3D views
     */
    setupBidirectionalSync() {
        // Listen for updates from 3D view
        document.addEventListener('update-floorplan-element', (event) => {
            const { objectId, coordinates } = event.detail;
            
            if (this.bidirectionalSyncConfig.throttleUpdates) {
                this.scheduleFloorplanUpdate(objectId, coordinates);
            } else {
                this.updateElementFromThreeD(objectId, coordinates);
            }
        });
        
        // Listen for floorplan changes to update 3D
        this.core.subscribe = this.core.subscribe || (() => {});
        this.core.addChangeListener = (callback) => {
            this.core.changeListeners = this.core.changeListeners || [];
            this.core.changeListeners.push(callback);
        };
        
        this.core.addChangeListener((elementType, elementData) => {
            if (this.bidirectionalSyncConfig.enableRealTimeSync) {
                this.notifyThreeDOfChange(elementType, elementData);
            }
        });
    }

    scheduleFloorplanUpdate(objectId, coordinates) {
        this.pendingUpdates.set(objectId, {
            coordinates,
            timestamp: Date.now()
        });
        
        if (this.updateThrottleTimeout) {
            clearTimeout(this.updateThrottleTimeout);
        }
        
        this.updateThrottleTimeout = setTimeout(() => {
            this.processPendingUpdates();
        }, this.bidirectionalSyncConfig.updateThrottleMs);
    }

    processPendingUpdates() {
        this.pendingUpdates.forEach((updateData, objectId) => {
            this.updateElementFromThreeD(objectId, updateData.coordinates);
        });
        
        this.pendingUpdates.clear();
    }

    updateElementFromThreeD(objectId, coordinates) {
        /**
         * @tweakable Element update validation for 3D to 2D sync
         */
        const updateValidation = {
            enableBoundsChecking: true,
            canvasWidth: this.canvas.canvas.width,
            canvasHeight: this.canvas.canvas.height,
            margin: 20
        };
        
        // Validate coordinates are within canvas bounds
        if (updateValidation.enableBoundsChecking) {
            if (coordinates.x < updateValidation.margin || 
                coordinates.x > updateValidation.canvasWidth - updateValidation.margin ||
                coordinates.y < updateValidation.margin || 
                coordinates.y > updateValidation.canvasHeight - updateValidation.margin) {
                console.warn('Update coordinates out of bounds:', coordinates);
                return;
            }
        }
        
        // Find and update the element in floorplan core
        const element = this.core.elements.walls.find(wall => wall.id === objectId) ||
                        this.core.elements.doors.find(door => door.id === objectId) ||
                        this.core.elements.windows.find(window => window.id === objectId);
        
        if (element) {
            // Update element position
            const centerX = (element.x1 + element.x2) / 2;
            const centerY = (element.y1 + element.y2) / 2;
            const deltaX = coordinates.x - centerX;
            const deltaY = coordinates.y - centerY;
            
            element.x1 += deltaX;
            element.x2 += deltaX;
            element.y1 += deltaY;
            element.y2 += deltaY;
            
            // Mark as dirty and redraw
            this.core.isDirty = true;
            this.canvas.drawElements();
            
            console.log('Updated floorplan element from 3D:', objectId, coordinates);
        }
    }

    notifyThreeDOfChange(elementType, elementData) {
        const threeDUpdateEvent = new CustomEvent('floorplan-element-changed', {
            detail: {
                elementType,
                elementData,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(threeDUpdateEvent);
    }

    createDefaultLayout() {
        const marginX = (this.canvas.canvas.width - this.defaultLayout.roomWidth) / 2;
        const marginY = (this.canvas.canvas.height - this.defaultLayout.roomLength) / 2;
        const width = this.defaultLayout.roomWidth;
        const length = this.defaultLayout.roomLength;

        // Create four walls in clockwise order
        const walls = [
            // Front wall
            { x1: marginX, y1: marginY, x2: marginX + width, y2: marginY, z1: 0, z2: 0 },
            // Right wall  
            { x1: marginX + width, y1: marginY, x2: marginX + width, y2: marginY + length, z1: 0, z2: 0 },
            // Back wall
            { x1: marginX + width, y1: marginY + length, x2: marginX, y2: marginY + length, z1: 0, z2: 0 },
            // Left wall
            { x1: marginX, y1: marginY + length, x2: marginX, y2: marginY, z1: 0, z2: 0 }
        ];

        walls.forEach(wall => this.core.addElement('wall', wall));
        this.canvas.drawElements();
        this.core.isDirty = true;
    }

    /**
     * @tweakable Setup integration with UI mode selection system
     */
    setupModeSelectionIntegration() {
        const integrationConfig = {
            updateOnModeChange: true,
            updateOnSelectionChange: true,
            storeSelectedVariants: true
        };

        if (integrationConfig.updateOnModeChange) {
            document.addEventListener('ui-mode-changed', (event) => {
                const { mode, selectedOption } = event.detail;
                this.handleModeChange(mode, selectedOption);
            });
        }

        if (integrationConfig.updateOnSelectionChange) {
            document.addEventListener('mode-selection-changed', (event) => {
                const { mode, selectedId, option, dimensions } = event.detail;
                this.handleModeSelectionChange(mode, selectedId, option, dimensions);
            });
        }
    }

    /**
     * @tweakable Handle mode changes from UI controller
     */
    handleModeChange(mode, selectedOption) {
        const modeHandlingConfig = {
            updateDrawingMode: true,
            storeSelection: true,
            notifyCore: true
        };

        if (modeHandlingConfig.updateDrawingMode) {
            this.setDrawingMode(mode);
        }

        if (modeHandlingConfig.storeSelection && selectedOption) {
            this.currentModeSelection[mode] = selectedOption;
        }

        if (modeHandlingConfig.notifyCore) {
            // Update core with current mode
            this.core.currentMode = mode;
            this.core.currentModeOptions = this.currentModeSelection[mode] || null;
        }
    }

    /**
     * @tweakable Handle specific mode selection changes with variants
     */
    handleModeSelectionChange(mode, selectedId, option, dimensions) {
        const selectionConfig = {
            updateElementDefaults: true,
            storeVariantInfo: true,
            updateInteractionMode: true
        };

        if (selectionConfig.storeVariantInfo) {
            this.elementVariants.set(mode, {
                id: selectedId,
                name: option.name,
                icon: option.icon,
                description: option.description,
                dimensions: dimensions
            });
        }

        if (selectionConfig.updateElementDefaults) {
            // Update default properties for new elements of this type
            this.core.elementDefaults = this.core.elementDefaults || {};
            this.core.elementDefaults[mode] = {
                variant: selectedId,
                ...dimensions
            };
        }

        if (selectionConfig.updateInteractionMode && this.interaction) {
            this.interaction.currentElementVariant = this.elementVariants.get(mode);
        }
    }

    update3DScene(objectManager) {
        const elements3D = this.core.convertTo3D();
        objectManager.updateFromFloorplan(elements3D);
    }
}