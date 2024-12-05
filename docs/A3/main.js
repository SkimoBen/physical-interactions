import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/MTLLoader.js';

// Initialize the scene, camera, and renderer
const element = document.getElementById('3d-model-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, element.clientWidth / element.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(element.clientWidth, element.clientHeight);
element.appendChild(renderer.domElement);

// Adjust camera on window resize
window.addEventListener('resize', () => {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
});

// Add OrbitControls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set initial camera position
camera.position.set(0, 0, 3);
controls.update();

// Add lights to illuminate the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// Load the MTL and OBJ files
const mtlLoader = new MTLLoader();
mtlLoader.load('assets/RunViz.mtl', (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load(
        'assets/RunViz.obj',
        (object) => {
            // Traverse the object to apply PBR materials
            object.traverse((child) => {
                if (child.isMesh) {
                    const material = child.material;

                    // Convert MTL properties to MeshStandardMaterial for PBR
                    child.material = new THREE.MeshStandardMaterial({
                        color: material.color,
                        roughness: 1 - material.shininess / 100, // Convert shininess to roughness
                        metalness: 0.5, // Approximation based on illum model
                        emissive: material.emissive,
                        opacity: material.opacity,
                        transparent: material.opacity < 1,
                    });

                    child.material.needsUpdate = true;
                }
            });

            object.position.set(0, 0, 0);
            scene.add(object);

            // Center and frame the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3()).length();
            const fitDistance = size / (2 * Math.atan((Math.PI * camera.fov) / 360));

            controls.target.copy(center);
            camera.position.copy(center).add(new THREE.Vector3(0, 0, fitDistance));
            camera.lookAt(center);
            controls.update();
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
        (error) => console.error('Error loading OBJ file:', error)
    );
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

