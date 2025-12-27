import * as THREE from 'three';
import { PDFParser } from './PDFParser.js';

export class CatalogManager {
    constructor() {
        this.catalogs = new Map();
        this.loadedAssets = new Map();
        this.pdfParser = new PDFParser();

                this.meshQuality = {
            segments: 32,
            detailLevel: 'high',
            smoothNormals: true 
        };

                this.importSettings = {
            autoGenerateThumbnails: true,
            generateCollisionMeshes: true,
            thumbnailSize: 256,
            maxConcurrentLoads: 4
        };
    }

    async loadCatalogFromPDF(pdfUrl, options = {}) {
        try {
            const parsedData = await this.pdfParser.parse(pdfUrl);

            const catalog = {
                url: pdfUrl,
                items: new Map(),
                metadata: parsedData.metadata,
                textures: new Map(), // Placeholder for now
                materialPresets: {
                    cabinet: {
                        roughness: 0.7,
                        metalness: 0.1,
                        clearcoat: 0.2
                    },
                    appliance: {
                        roughness: 0.2,
                        metalness: 0.8,
                        clearcoat: 0.4
                    }
                }
            };
            
            // Populate catalog from parsed PDF items
            parsedData.items.forEach(item => {
                // Find a matching thumbnail from the extracted images
                const thumbnail = parsedData.images.find(img => img.width > 50 && img.height > 50);

                const catalogItem = {
                    id: item.name,
                    name: item.name,
                    dimensions: item.dimensions,
                    description: item.description,
                    thumbnail: thumbnail ? thumbnail.url : null,
                    type: item.name.startsWith('B') ? 'cabinet' : 'appliance' // Simple type inference
                };
                catalog.items.set(catalogItem.id, catalogItem);
            });
            
            this.catalogs.set(pdfUrl, catalog);
            console.log(`Catalog loaded from ${pdfUrl}:`, catalog);
            return catalog;
        } catch (error) {
            console.error(`Failed to load catalog from PDF ${pdfUrl}:`, error);
            // Return a default empty catalog on failure
            const catalog = {
                url: pdfUrl,
                items: new Map(),
                metadata: {},
                textures: new Map(),
                materialPresets: {}
            };
            this.catalogs.set(pdfUrl, catalog);
            return catalog;
        }
    }

    async createCatalogItem(catalogUrl, itemData) {
        const catalog = this.catalogs.get(catalogUrl);
        if (!catalog) throw new Error('Catalog not found');

        const item = {
            id: crypto.randomUUID(),
            ...itemData,
                        variants: {
                lod: {
                    high: { segments: 32 },
                    medium: { segments: 16 },
                    low: { segments: 8 }
                },
                materials: catalog.materialPresets
            }
        };

        catalog.items.set(item.id, item);
        return item;
    }

    async generateItemMesh(catalogUrl, itemId, options = {}) {
        const catalog = this.catalogs.get(catalogUrl);
        const item = catalog.items.get(itemId);
        
        if (!item) throw new Error('Item not found');

                const meshSettings = {
            segments: options.quality === 'high' ? 32 : 16,
            smoothShading: options.quality !== 'low',
            generateUVs: true,
            ...options
        };

        // Generate mesh based on item type
        let geometry;
        switch(item.type) {
            case 'cabinet':
                geometry = this.generateCabinetGeometry(item, meshSettings);
                break;
            case 'appliance':
                geometry = this.generateApplianceGeometry(item, meshSettings);
                break;
            default:
                throw new Error('Unsupported item type');
        }

        const material = await this.createItemMaterial(catalog, item);
        return new THREE.Mesh(geometry, material);
    }

    async createItemMaterial(catalog, item) {
        const preset = catalog.materialPresets[item.type];
        const material = new THREE.MeshStandardMaterial({
            ...preset,
            map: catalog.textures.get(item.textureId)
        });

                const materialEnhancements = {
            normalMapIntensity: 1.0,
            roughnessMapIntensity: 0.8,
            aoMapIntensity: 0.5,
            envMapIntensity: 0.3
        };

        return material;
    }

    async extractMetadataFromPDF(pdfUrl) {
        // This method is now handled by PDFParser
        return (await this.pdfParser.parse(pdfUrl)).metadata;
    }

    async extractTexturesFromPDF(pdfUrl) {
        // This method is now handled by PDFParser
        return (await this.pdfParser.parse(pdfUrl)).images;
    }

    generateCabinetGeometry(item, meshSettings) {
        /**
         * @tweakable Cabinet geometry generation parameters
         */
        const cabinetGeometry = {
            frameThickness: 0.75, // inches
            doorOverlap: 0.5, // inches
            drawerFrontThickness: 0.75, // inches
            backPanelThickness: 0.25 // inches
        };

        const width = item.dimensions?.width || 24;
        const height = item.dimensions?.height || 34.5;
        const depth = item.dimensions?.depth || 24;

        // Create main cabinet box
        const geometry = new THREE.BoxGeometry(
            width / 12, // Convert inches to feet
            height / 12,
            depth / 12
        );

        // Apply mesh quality settings
        if (meshSettings.smoothShading) {
            geometry.computeVertexNormals();
        }

        // Generate detailed geometry for high quality
        if (meshSettings.segments > 16) {
            const detailedGeometry = new THREE.BufferGeometry();
            
            // Add frame details
            const frameGeometry = new THREE.BoxGeometry(
                (width - cabinetGeometry.frameThickness * 2) / 12,
                (height - cabinetGeometry.frameThickness * 2) / 12,
                cabinetGeometry.frameThickness / 12
            );
            
            detailedGeometry.merge(geometry);
            detailedGeometry.merge(frameGeometry);
            
            return detailedGeometry;
        }

        return geometry;
    }

    generateApplianceGeometry(item, meshSettings) {
        /**
         * @tweakable Appliance geometry generation parameters
         */
        const applianceGeometry = {
            handleDepth: 1.5, // inches
            ventGrillHeight: 6, // inches
            controlPanelHeight: 4 // inches
        };

        const width = item.dimensions?.width || 30;
        const height = item.dimensions?.height || 36;
        const depth = item.dimensions?.depth || 24;

        const mainGeometry = new THREE.BoxGeometry(
            width / 12,
            height / 12,
            depth / 12
        );

        // Add appliance-specific details for high quality
        if (meshSettings.segments > 16) {
            const group = new THREE.Group();
            const mainMesh = new THREE.Mesh(mainGeometry);
            group.add(mainMesh);

            // Add handle
            const handleGeometry = new THREE.CylinderGeometry(
                0.5 / 12, 0.5 / 12, 
                (width * 0.6) / 12, 
                8
            );
            const handleMesh = new THREE.Mesh(handleGeometry);
            handleMesh.position.z = (depth + applianceGeometry.handleDepth) / 24;
            handleMesh.rotation.z = Math.PI / 2;
            group.add(handleMesh);

            return group;
        }

        return mainGeometry;
    }
}