import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export class ThreeDView {
    constructor(container, model) {
        this.container = container;
        this.model = model;
        this.objects = new Map();

        /**
         * @tweakable Three.js rendering configuration for the 3D view
         */
        this.renderConfig = {
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance"
        };

        this.initScene();
        this.initControls();

        this.model.subscribe(this.onModelUpdate.bind(this));
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000);
        this.camera.position.set(500, 400, 500);

        this.renderer = new THREE.WebGLRenderer(this.renderConfig);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    initControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.transformControls);

        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });

        this.transformControls.addEventListener('mouseUp', () => {
            const object = this.transformControls.object;
            if (object) {
                this.model.updateElement(object.userData.id, {
                    x: object.position.x,
                    y: object.position.z // Map 3D z back to 2D y
                });
            }
        });
    }

    onModelUpdate(event, data) {
        switch (event) {
            case 'add':
                this.addElement(data);
                break;
            case 'update':
                this.updateElement(data);
                break;
            case 'remove':
                this.removeElement(data.id);
                break;
            case 'select':
                this.selectElement(data);
                break;
            case 'clear':
                this.clearScene();
                break;
        }
    }

    addElement(element) {
        let mesh;
        const material = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });

        if (element.type === 'wall') {
            const length = Math.hypot(element.end.x - element.start.x, element.end.y - element.start.y);
            const geometry = new THREE.BoxGeometry(length, element.height, element.thickness);
            mesh = new THREE.Mesh(geometry, material);
            const center = { x: (element.start.x + element.end.x) / 2, y: (element.start.y + element.end.y) / 2 };
            mesh.position.set(center.x, element.height / 2, center.y);
            mesh.rotation.y = -Math.atan2(element.end.y - element.start.y, element.end.x - element.start.x);
        } else if (element.type === 'cabinet') {
             const geometry = new THREE.BoxGeometry(element.width, element.height, element.depth);
             mesh = new THREE.Mesh(geometry, material);
             mesh.position.set(element.x, element.height / 2, element.y);
        } else {
            return;
        }

        mesh.userData.id = element.id;
        this.objects.set(element.id, mesh);
        this.scene.add(mesh);
    }
    
    updateElement(element) {
        const mesh = this.objects.get(element.id);
        if(mesh) {
            // Update position, rotation, scale
        }
    }

    removeElement(id) {
        const mesh = this.objects.get(id);
        if (mesh) {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.objects.delete(id);
        }
    }
    
    selectElement(element) {
        if(element && this.objects.has(element.id)) {
            this.transformControls.attach(this.objects.get(element.id));
        } else {
            this.transformControls.detach();
        }
    }

    clearScene() {
        this.objects.forEach(obj => {
            this.scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        });
        this.objects.clear();
        this.transformControls.detach();
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}