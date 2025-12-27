import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class GLBAssetLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.loadedAssets = new Map();

        /**
         * @tweakable Asset loading configuration
         */
        this.loadingConfig = {
            enableDracoDecoding: true,
            enableKTX2Support: true,
            maxConcurrentLoads: 4,
            loadTimeout: 30000
        };
    }

    async loadAsset(path, options = {}) {
        // Check cache first
        if (this.loadedAssets.has(path)) {
            return this.loadedAssets.get(path).clone();
        }

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Asset loading timeout: ${path}`));
            }, this.loadingConfig.loadTimeout);

            this.loader.load(
                path,
                (gltf) => {
                    clearTimeout(timeout);
                    const asset = gltf.scene;
                    this.loadedAssets.set(path, asset);
                    resolve(asset.clone());
                },
                (progress) => {
                    // Loading progress callback
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    clearTimeout(timeout);
                    console.error(`Error loading asset: ${path}`, error);
                    reject(error);
                }
            );
        });
    }

    dispose() {
        this.loadedAssets.forEach(asset => {
            asset.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        this.loadedAssets.clear();
    }
}