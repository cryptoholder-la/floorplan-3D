import { KitchenCatalog } from '../core/catalog/KitchenCatalog.js';
import * as THREE from 'three';

/**
 * @tweakable Object creation service configuration for catalog and template management
 */
const creationConfig = {
    enableCatalogIntegration: true,
    enableSmartPlacement: true,
    enableCollisionDetection: true,
    defaultMaterialQuality: 'standard'
};

export class ObjectCreationService {
    constructor(core) {
        this.core = core;
        
        if (creationConfig.enableCatalogIntegration) {
            this.kitchenCatalog = new KitchenCatalog();
        }
        
        this.materialPresets = {
            oak: { color: '#8B4513', roughness: 0.7, metalness: 0.1 },
            maple: { color: '#DEB887', roughness: 0.7, metalness: 0.1 },
            cherry: { color: '#800000', roughness: 0.7, metalness: 0.1 },
            stainlessSteel: { color: '#C0C0C0', roughness: 0.4, metalness: 0.8 }
        };
    }

    async createFromTemplate(templateName, width = null) {
        try {
            const template = this.getTemplate(templateName);
            if (!template) {
                console.error(`Template ${templateName} not found`);
                return null;
            }

            const object = this.createTemplateObject(template, width);
            
            if (creationConfig.enableSmartPlacement) {
                this.applySmartPlacement(object);
            }
            
            this.core.sceneManager.scene.add(object);
            
            return object;
        } catch (error) {
            console.error('Error creating object from template:', error);
            return null;
        }
    }

    async createFromCatalog(itemName, options = {}) {
        if (!creationConfig.enableCatalogIntegration) {
            console.warn('Catalog integration disabled');
            return null;
        }
        
        try {
            const item = await this.kitchenCatalog.createItem(itemName, options);
            
            if (creationConfig.enableSmartPlacement) {
                this.applySmartPlacement(item);
            }
            
            return item;
        } catch (error) {
            console.error('Failed to create catalog item:', error);
            return null;
        }
    }

    getTemplate(templateName) {
        const templates = {
            baseCabinet: { type: 'cabinet', defaultWidth: 24, dimensions: { height: 34.5, depth: 24 } },
            wallCabinet: { type: 'cabinet', defaultWidth: 24, dimensions: { height: 30, depth: 12 } },
            tallCabinet: { type: 'cabinet', defaultWidth: 24, dimensions: { height: 84, depth: 24 } }
        };
        return templates[templateName];
    }

    createTemplateObject(template, width) {
        const defaultWidth = 2;
        const defaultHeight = 0.9;
        const defaultDepth = 0.6;
        
        const geometry = new THREE.BoxGeometry(
            width ? width/12 : defaultWidth,
            template.dimensions?.height/12 || defaultHeight,
            template.dimensions?.depth/12 || defaultDepth
        );
        
        const material = new THREE.MeshStandardMaterial(
            this.getMaterialPreset(creationConfig.defaultMaterialQuality)
        );
        
        const object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        object.userData.type = template.type;
        object.userData.templateName = template.name;
        
        object.position.set(0, (template.dimensions?.height/12 || defaultHeight)/2, 0);
        
        return object;
    }

    getMaterialPreset(quality) {
        switch (quality) {
            case 'high':
                return { color: 0x8B4513, roughness: 0.6, metalness: 0.2 };
            case 'standard':
                return { color: 0x8B4513, roughness: 0.7, metalness: 0.1 };
            default:
                return { color: 0x8B4513, roughness: 0.8, metalness: 0.0 };
        }
    }

    applySmartPlacement(object) {
        /**
         * @tweakable Smart placement configuration for object positioning
         */
        const placementSettings = {
            snapToGrid: true,
            gridSize: 0.5,
            avoidCollisions: creationConfig.enableCollisionDetection,
            preferredY: 0
        };
        
        let position = new THREE.Vector3(0, placementSettings.preferredY, 0);
        
        if (placementSettings.snapToGrid) {
            position.x = Math.round(position.x / placementSettings.gridSize) * placementSettings.gridSize;
            position.z = Math.round(position.z / placementSettings.gridSize) * placementSettings.gridSize;
        }
        
        object.position.copy(position);
    }
}