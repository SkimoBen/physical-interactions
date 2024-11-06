    // Import necessary modules
    import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
    import { OBJLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/OBJLoader.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
    import { MTLLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/MTLLoader.js';

// Set up scene, camera, and renderer
const element = document.getElementById("3d-model-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, element.clientWidth / element.clientHeight, 0.1, 1000); // Adjusted FOV
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(element.clientWidth, element.clientHeight);
element.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
});

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set initial camera position (closer to the object)
camera.position.set(0, 0, 0.5);
controls.update();

// Add balanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
mainLight.position.set(2, 2, 2);
scene.add(mainLight);

scene.background = new THREE.Color(0x212121);

// Load the MTL and OBJ files
const mtlLoader = new MTLLoader();
mtlLoader.load('assets/TopoViz.mtl', (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
        'assets/TopoViz.obj',
        (object) => {
            // Adjust object's rotation if necessary
            // Remove or modify the rotation to face the front
            // object.rotation.x = Math.PI; // Commented out or adjust as needed

            object.position.set(0, 0, 0);
            scene.add(object);

            // Compute object's bounding box to center camera and controls
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());

            // Adjust controls target and camera position based on the object's center
            controls.target.copy(center);
            controls.update();

            // Optionally, adjust camera to frame the object
            const size = box.getSize(new THREE.Vector3()).length();
            const fitDistance = size / (2 * Math.atan((Math.PI * camera.fov) / 360));
            camera.position.copy(center);
            camera.position.z += fitDistance * 0.8; // Adjust multiplier as needed
            camera.lookAt(center);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred while loading the OBJ file:', error);
        }
    );
});

// Render loop and camera position display
const positionDisplay = document.getElementById("position-display");

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

