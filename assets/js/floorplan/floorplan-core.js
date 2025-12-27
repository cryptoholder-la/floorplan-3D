import * as THREE from 'three';

export class FloorplanCore {
    constructor() {
        this.elements = {
            walls: [],
            doors: [],
            windows: []
        };
        this.isDirty = false;
        
        this.DEFAULT_WALL_THICKNESS = 4.5;
        
        this.DEFAULT_WALL_HEIGHT = 8;

        this.DEFAULT_SETTINGS = {
            wallThickness: this.DEFAULT_WALL_THICKNESS / 12, // Convert to feet
            wallHeight: this.DEFAULT_WALL_HEIGHT,
            roomSize: { width: 10, length: 10 }, // 20x24 feet
            door: { width: 3, height: 7 }, // 3x7 feet
            window: { width: 4, height: 5, sillHeight: 3 } // 4x5 feet, 3 foot sill
        };
        
        /**
         * @tweakable Element variant support for different types of windows, doors, cabinets
         */
        this.variantConfig = {
            enableVariantTracking: true,
            storeVariantProperties: true,
            validateVariantDimensions: true
        };
        
        this.elementDefaults = {};
        this.currentMode = null;
        this.currentModeOptions = null;
    }

    validateWall(wall) {
        const minLength = 2;
        const length = Math.hypot(wall.x2 - wall.x1, wall.z2 - wall.z1);
        return length >= minLength;
    }

    addElement(type, data) {
        /**
         * @tweakable Enhanced element creation with variant support
         */
        const variantEnhancedData = this.variantConfig.enableVariantTracking ? 
            this.enhanceElementWithVariant(type, data) : data;

        switch(type) {
            case 'wall':
                if (this.validateWall(variantEnhancedData)) this.elements.walls.push(variantEnhancedData);
                break;
            case 'door':
                this.elements.doors.push(variantEnhancedData);
                break;
            case 'window':
                this.elements.windows.push(variantEnhancedData);
                break;
            case 'cabinet':
                this.elements.cabinets = this.elements.cabinets || [];
                this.elements.cabinets.push(variantEnhancedData);
                break;
        }
        this.isDirty = true;

        /**
         * @tweakable Notify listeners about element creation with variant info
         */
        if (this.changeListeners) {
            this.changeListeners.forEach(listener => {
                listener(type, variantEnhancedData);
            });
        }
    }

    /**
     * @tweakable Enhance element data with variant information
     */
    enhanceElementWithVariant(type, data) {
        const enhancementConfig = {
            addVariantId: true,
            addDefaultDimensions: true,
            addTimestamp: true,
            generateUniqueId: true
        };

        const enhancedData = { ...data };

        if (enhancementConfig.generateUniqueId) {
            enhancedData.id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        if (enhancementConfig.addTimestamp) {
            enhancedData.createdAt = Date.now();
        }

        // Add variant information if available
        if (enhancementConfig.addVariantId && this.elementDefaults[type]) {
            const defaults = this.elementDefaults[type];
            enhancedData.variant = defaults.variant;
            
            if (enhancementConfig.addDefaultDimensions) {
                // Merge default dimensions with provided data
                Object.keys(defaults).forEach(key => {
                    if (key !== 'variant' && !enhancedData.hasOwnProperty(key)) {
                        enhancedData[key] = defaults[key];
                    }
                });
            }
        }

        // Add element-specific enhancements
        if (this.variantConfig.validateVariantDimensions) {
            this.validateAndAdjustDimensions(type, enhancedData);
        }

        return enhancedData;
    }

    /**
     * @tweakable Validate and adjust dimensions based on element type and variant
     */
    validateAndAdjustDimensions(type, data) {
        const validationRules = {
            window: {
                minWidth: 60,
                maxWidth: 300,
                minHeight: 60,
                maxHeight: 200,
                minSillHeight: 60,
                maxSillHeight: 150
            },
            door: {
                minWidth: 60,
                maxWidth: 180,
                minHeight: 180,
                maxHeight: 220,
                minThickness: 3,
                maxThickness: 8
            },
            cabinet: {
                minWidth: 30,
                maxWidth: 120,
                minHeight: 30,
                maxHeight: 240,
                minDepth: 30,
                maxDepth: 80
            }
        };

        const rules = validationRules[type];
        if (!rules) return;

        // Apply validation rules
        Object.keys(rules).forEach(key => {
            const dimension = key.replace('min', '').replace('max', '').toLowerCase();
            
            if (data[dimension] !== undefined) {
                if (key.startsWith('min') && data[dimension] < rules[key]) {
                    console.warn(`${type} ${dimension} too small, adjusting to minimum: ${rules[key]}`);
                    data[dimension] = rules[key];
                } else if (key.startsWith('max') && data[dimension] > rules[key]) {
                    console.warn(`${type} ${dimension} too large, adjusting to maximum: ${rules[key]}`);
                    data[dimension] = rules[key];
                }
            }
        });
    }

    convertTo3D() {
        return this.elements;
    }
}