    // Import necessary modules
    import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
    import { OBJLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/OBJLoader.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

    // Set up scene, camera, and renderer
    const element = document.getElementById("3d-model-container");  // Move this line above
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000);
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
    controls.enableDamping = true; // Optional, for smooth motion
    controls.dampingFactor = 0.05;

    // Position the camera
    camera.position.set(0.2, 0.2, 0.2);
    controls.update();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x262626); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xe28a8a, 0.5);
    const secondLight = new THREE.DirectionalLight(0x8ae0e2, 0.5);
    const thirdLight = new THREE.DirectionalLight(0x98e28a, 0.5);
    scene.add(directionalLight);
    scene.add(secondLight);
    scene.add(thirdLight);
    // Move the directional light
    directionalLight.position.set(1, 0, 0);

    // Move the second light
    secondLight.position.set(0, 1, 0);
    // Move the third light
    secondLight.position.set(0, 0, 1);
 
    scene.background = new THREE.Color(0xedf0f1); // Light blue background

    // Load the OBJ file
    const loader = new OBJLoader();
    loader.load(
        'assets/Case_Design.obj',
        function (object) {
            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error('An error occurred while loading the OBJ file:', error);
        }
    );

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required if controls.enableDamping = true
        renderer.render(scene, camera);
    }
    animate();
