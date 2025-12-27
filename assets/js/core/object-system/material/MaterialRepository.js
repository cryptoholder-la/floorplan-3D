import * as THREE from 'three';

export class MaterialRepository {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.textures = new Map();
        this.materials = new Map();
        
                this.materialQuality = {
            mipmaps: true,
            anisotropy: 8,
            compression: true
        };
    }

    async preloadTextures() {
        const texturePromises = [
            this.loadTextureSet('cabinet', '/textures/cabinet'),
            this.loadTextureSet('appliance', '/textures/appliance'),
            this.loadTextureSet('wall', '/textures/wall')
        ];

        await Promise.all(texturePromises);
    }

    async loadTextureSet(name, basePath) {
        const textureTypes = ['diffuse', 'normal', 'roughness'];
        const loadedTextures = {};

        for (const type of textureTypes) {
            loadedTextures[type] = await this.loadTexture(
                `${basePath}_${type}.jpg`,
                this.materialQuality
            );
        }

        this.textures.set(name, loadedTextures);
    }

    getSmartMaterial(type) {
        if (this.materials.has(type)) {
            return this.materials.get(type);
        }

        const textures = this.textures.get(type);
        if (!textures) {
            console.warn(`No textures found for type: ${type}`);
            return new THREE.MeshStandardMaterial();
        }

        const material = new THREE.MeshStandardMaterial({
            map: textures.diffuse,
            normalMap: textures.normal,
            roughnessMap: textures.roughness,
            roughness: 0.7,
            metalness: 0.1
        });

        this.materials.set(type, material);
        return material;
    }

    dispose() {
        this.textures.forEach(textureSet => {
            Object.values(textureSet).forEach(texture => texture.dispose());
        });
        this.materials.forEach(material => material.dispose());
        
        this.textures.clear();
        this.materials.clear();
    }

    loadTexture(path, options) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(path, (texture) => {
                if (options.mipmaps) {
                    texture.generateMipmaps = true;
                }
                if (options.anisotropy) {
                    texture.anisotropy = options.anisotropy;
                }
                resolve(texture);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
}