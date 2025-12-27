import { GLBAssetLoader } from '../asset-loader/GLBLoader.js';
import { catalogConfig, itemProperties } from './kitchen-catalog-config.js';

export class KitchenCatalog {
    constructor() {
        this.assetLoader = new GLBAssetLoader();
        
        this.config = catalogConfig;
        this.itemProperties = itemProperties;

        this.initializeCatalog();
    }

    async initializeCatalog() {
        console.log('Initializing kitchen catalog...');
        
        // Pre-load commonly used items
        const preloadItems = [
            'kitchenCabinet', 'kitchenFridge', 'chair', 'table'
        ];

        try {
            await Promise.all(
                preloadItems.map(item => 
                    this.assetLoader.loadAsset(`/${item}.glb`)
                )
            );
            console.log('Catalog preloading complete');
        } catch (error) {
            console.warn('Some catalog items failed to preload:', error);
        }
    }

    async createItem(itemName, options = {}) {
        try {
            const asset = await this.assetLoader.loadAsset(`/${itemName}.glb`, options);
            const itemProps = this.itemProperties[itemName] || {};
            
                        const creationConfig = {
                autoPosition: true,
                applyDefaultMaterial: true,
                enablePhysics: true,
                generateCollisionMesh: true,
                ...options
            };

            // Apply item-specific properties
            if (itemProps.defaultHeight) {
                asset.position.y = itemProps.defaultHeight / 2;
            }

            asset.userData.itemName = itemName;
            asset.userData.category = itemProps.category;
            asset.userData.properties = itemProps;

            return asset;
        } catch (error) {
            console.error(`Failed to create item ${itemName}:`, error);
            return this.createFallbackItem(itemName);
        }
    }

    createFallbackItem(itemName) {
                const fallbackConfig = {
            color: 0x888888,
            wireframe: true,
            opacity: 0.7
        };

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial(fallbackConfig);
        const fallback = new THREE.Mesh(geometry, material);
        
        fallback.userData.itemName = itemName;
        fallback.userData.isFallback = true;
        
        return fallback;
    }

    getItemsByCategory(category, subcategory = null) {
        if (subcategory) {
            return this.config.categories[category]?.[subcategory] || [];
        }
        
        const categoryItems = this.config.categories[category];
        if (!categoryItems) return [];
        
        return Object.values(categoryItems).flat();
    }

    searchItems(query) {
        const allItems = Object.values(this.config.categories)
            .map(cat => Object.values(cat).flat())
            .flat();
            
        return allItems.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );
    }

    getSmartPlacementSuggestions(itemName, sceneObjects) {
        const itemProps = this.itemProperties[itemName];
        if (!itemProps || !this.config.enableSmartPlacement) {
            return [];
        }

        const suggestions = [];
        
        // Find suitable placement locations based on item type
        if (itemProps.snapToWall) {
            suggestions.push(...this.findWallPlacementSuggestions(sceneObjects));
        }
        
        return suggestions;
    }

    findWallPlacementSuggestions(sceneObjects) {
        return sceneObjects
            .filter(obj => obj.userData.type === 'wall')
            .map(wall => ({
                position: wall.position.clone(),
                rotation: wall.rotation.clone(),
                type: 'wall_adjacent'
            }));
    }

    dispose() {
        this.assetLoader.dispose();
    }
}