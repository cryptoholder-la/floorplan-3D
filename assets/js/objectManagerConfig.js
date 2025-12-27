/**
 * @tweakable Central configuration for ObjectManager behavior
 */
export const managementConfig = {
    enableSmartSnapping: true,
    autoSaveState: true,
    maxUndoSteps: 20,
    enableCollisionDetection: true
};

/**
 * @tweakable Default wall properties for ObjectManager
 */
export const wallDefaults = {
    height: 8,           // 8 feet tall
    thickness: 0.375,    // 4.5 inches thick
    color: 0xcccccc,
    roughness: 0.9,
    metalness: 0.1,
    opacity: 0.8
};

/**
 * @tweakable Object templates moved to config for maintainability
 */
export const templates = {
    baseCabinet: {
        type: 'cabinet',
        defaultWidth: 24,
        dimensions: { height: 34.5, depth: 24 }
    },
    wallCabinet: {
        type: 'cabinet',
        defaultWidth: 24,
        dimensions: { height: 30, depth: 12 }
    },
    tallCabinet: {
        type: 'cabinet',
        defaultWidth: 24,
        dimensions: { height: 84, depth: 24 }
    },
    refrigeratorEnclosure: {
        type: 'appliance',
        dimensions: { width: 36, height: 84, depth: 24 }
    },
    rangeEnclosure: {
        type: 'appliance',
        dimensions: { width: 30, height: 36, depth: 24 }
    },
    dishwasherEnclosure: {
        type: 'appliance',
        dimensions: { width: 24, height: 34, depth: 24 }
    }
};