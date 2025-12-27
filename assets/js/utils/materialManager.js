import * as THREE from 'three';

export class MaterialManager {
    constructor() {
                this.defaultMaterialProps = {
            roughness: 0.7,
            metalness: 0.3
        };
        
        this.textureLoader = new THREE.TextureLoader();
        this.materials = new Map();
    }

    createMaterial(type, color) {
        const material = new THREE.MeshStandardMaterial({
            color: color,
            ...this.defaultMaterialProps
        });
        
        this.materials.set(type, material);
        return material;
    }

    loadTexture(path) {
        return this.textureLoader.load(path);
    }
}

