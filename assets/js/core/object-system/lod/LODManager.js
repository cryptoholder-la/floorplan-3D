import * as THREE from 'three';

export class LODManager {
    constructor() {
        this.lodLevels = {
            high: { distance: 0, vertexReduction: 0 },
            medium: { distance: 50, vertexReduction: 0.5 },
            low: { distance: 100, vertexReduction: 0.75 }
        };

        this.qualitySettings = {
            preserveUVs: true,
            preserveNormals: true,
            smoothNormals: true,
            generateTangents: true
        };
    }

    setupLOD(object, config) {
        const lod = new THREE.LOD();
        
        const lodParams = {
            geometrySimplification: {
                method: 'quadric',
                preserveTextures: true,
                boundaryWeight: 1.0
            },
            materialSimplification: {
                combineTextures: true,
                maxTextureSize: 1024,
                compressTextures: true
            }
        };

        Object.entries(this.lodLevels).forEach(([level, settings]) => {
            const lodMesh = this.createLODLevel(object, level, lodParams);
            lod.addLevel(lodMesh, settings.distance);
        });

        return lod;
    }

    createLODLevel(object, level, params) {
        const originalGeometry = object.geometry;
        const reduction = this.lodLevels[level].vertexReduction;

        const simplificationSettings = {
            targetVertices: originalGeometry.attributes.position.count * (1 - reduction),
            aggressiveness: 7,
            maxIterations: 100,
            ...params.geometrySimplification
        };

        return new THREE.Mesh(
            this.simplifyGeometry(originalGeometry, simplificationSettings),
            this.createSimplifiedMaterial(object.material, level, params.materialSimplification)
        );
    }

    optimizeScene(scene, options = {}) {
        scene.traverse(object => {
            if (object.isMesh) {
                const optimizedLOD = this.setupLOD(object, {
                    ...this.qualitySettings,
                    ...options
                });
                
                object.parent.add(optimizedLOD);
                object.parent.remove(object);
            }
        });
    }

    simplifyGeometry(geometry, settings) {
        /**
         * @tweakable Geometry simplification parameters
         */
        const simplificationParams = {
            preserveUVs: settings.preserveUVs || true,
            preserveNormals: settings.preserveNormals || true,
            edgeThreshold: 0.1,
            uvThreshold: 0.1,
            normalThreshold: 0.9
        };

        if (!geometry.attributes.position) {
            return geometry;
        }

        const positionAttribute = geometry.attributes.position;
        const originalVertexCount = positionAttribute.count;
        const targetVertexCount = Math.max(
            settings.targetVertices || originalVertexCount * 0.5,
            4 // Minimum vertices for a valid geometry
        );

        if (targetVertexCount >= originalVertexCount) {
            return geometry;
        }

        // Simple vertex decimation algorithm
        const vertices = [];
        const faces = [];
        const uvs = simplificationParams.preserveUVs && geometry.attributes.uv ? [] : null;
        const normals = simplificationParams.preserveNormals && geometry.attributes.normal ? [] : null;

        // Extract vertices
        for (let i = 0; i < originalVertexCount; i++) {
            vertices.push(new THREE.Vector3(
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
            ));

            if (uvs && geometry.attributes.uv) {
                uvs.push(new THREE.Vector2(
                    geometry.attributes.uv.getX(i),
                    geometry.attributes.uv.getY(i)
                ));
            }

            if (normals && geometry.attributes.normal) {
                normals.push(new THREE.Vector3(
                    geometry.attributes.normal.getX(i),
                    geometry.attributes.normal.getY(i),
                    geometry.attributes.normal.getZ(i)
                ));
            }
        }

        // Simple decimation: keep every nth vertex
        const step = Math.ceil(originalVertexCount / targetVertexCount);
        const simplifiedVertices = [];
        const simplifiedUVs = uvs ? [] : null;
        const simplifiedNormals = normals ? [] : null;

        for (let i = 0; i < originalVertexCount; i += step) {
            simplifiedVertices.push(vertices[i]);
            if (uvs) simplifiedUVs.push(uvs[i]);
            if (normals) simplifiedNormals.push(normals[i]);
        }

        // Create new geometry
        const simplifiedGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(simplifiedVertices.length * 3);
        for (let i = 0; i < simplifiedVertices.length; i++) {
            positions[i * 3] = simplifiedVertices[i].x;
            positions[i * 3 + 1] = simplifiedVertices[i].y;
            positions[i * 3 + 2] = simplifiedVertices[i].z;
        }
        simplifiedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        if (simplifiedUVs) {
            const uvArray = new Float32Array(simplifiedUVs.length * 2);
            for (let i = 0; i < simplifiedUVs.length; i++) {
                uvArray[i * 2] = simplifiedUVs[i].x;
                uvArray[i * 2 + 1] = simplifiedUVs[i].y;
            }
            simplifiedGeometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
        }

        if (simplifiedNormals) {
            const normalArray = new Float32Array(simplifiedNormals.length * 3);
            for (let i = 0; i < simplifiedNormals.length; i++) {
                normalArray[i * 3] = simplifiedNormals[i].x;
                normalArray[i * 3 + 1] = simplifiedNormals[i].y;
                normalArray[i * 3 + 2] = simplifiedNormals[i].z;
            }
            simplifiedGeometry.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
        } else if (simplificationParams.preserveNormals) {
            simplifiedGeometry.computeVertexNormals();
        }

        return simplifiedGeometry;
    }

    createSimplifiedMaterial(material, level, settings) {
        /**
         * @tweakable Material simplification settings
         */
        const materialSimplification = {
            reduceTextureResolution: true,
            combineTextures: settings.combineTextures || false,
            removeDetailMaps: level === 'low',
            simplifyShader: level === 'low'
        };

        if (!material) {
            return new THREE.MeshBasicMaterial({ color: 0x888888 });
        }

        const simplifiedMaterial = material.clone();

        // Reduce texture resolution for distant LOD levels
        if (materialSimplification.reduceTextureResolution && level !== 'high') {
            const textureScale = level === 'medium' ? 0.5 : 0.25;
            
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(mapType => {
                if (simplifiedMaterial[mapType]) {
                    const originalTexture = simplifiedMaterial[mapType];
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = Math.max(1, originalTexture.image.width * textureScale);
                    canvas.height = Math.max(1, originalTexture.image.height * textureScale);
                    
                    ctx.drawImage(originalTexture.image, 0, 0, canvas.width, canvas.height);
                    
                    const simplifiedTexture = new THREE.CanvasTexture(canvas);
                    simplifiedTexture.wrapS = originalTexture.wrapS;
                    simplifiedTexture.wrapT = originalTexture.wrapT;
                    simplifiedTexture.repeat.copy(originalTexture.repeat);
                    
                    simplifiedMaterial[mapType] = simplifiedTexture;
                }
            });
        }

        // Remove detail maps for low quality
        if (materialSimplification.removeDetailMaps) {
            simplifiedMaterial.normalMap = null;
            simplifiedMaterial.roughnessMap = null;
            simplifiedMaterial.metalnessMap = null;
            simplifiedMaterial.aoMap = null;
        }

        // Use basic material for lowest quality
        if (materialSimplification.simplifyShader) {
            return new THREE.MeshLambertMaterial({
                color: simplifiedMaterial.color,
                map: simplifiedMaterial.map
            });
        }

        return simplifiedMaterial;
    }
}