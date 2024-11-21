import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 20); // Add fog for atmospheric effect

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(4, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for zooming and orbiting
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const redLight = new THREE.PointLight(0xff0000, 0.8, 10);
redLight.position.set(4, 5, -2);
scene.add(redLight);

const greenLight = new THREE.PointLight(0x00ff00, 0.6, 10);
greenLight.position.set(-4, 1, 0);
scene.add(greenLight);

const orangeLight = new THREE.PointLight(0xffa500, 0.7, 10);
orangeLight.position.set(0, 2, -5);
scene.add(orangeLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// House
const houseBodyGeometry = new THREE.BoxGeometry(4, 4, 4);
const houseBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const houseBody = new THREE.Mesh(houseBodyGeometry, houseBodyMaterial);
houseBody.position.y = 2;
scene.add(houseBody);

const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 5;
roof.rotation.y = Math.PI / 4;
scene.add(roof);

const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 1, 2.05);
scene.add(door);

// Tombstones
const tombstoneGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
for (let i = 0; i < 15; i++) {
  const tombstone = new THREE.Mesh(tombstoneGeometry, tombstoneMaterial);
  tombstone.position.set(
    (Math.random() - 0.5) * 10,
    0.5,
    (Math.random() - 0.5) * 10
  );
  tombstone.rotation.y = Math.random() * Math.PI;
  scene.add(tombstone);
}

// GUI Controls for Lights
const gui = new GUI();
const redFolder = gui.addFolder('Red Light');
redFolder.add(redLight, 'intensity', 0, 2, 0.01);
redFolder.add(redLight.position, 'x', -10, 10, 0.1);
redFolder.add(redLight.position, 'y', -10, 10, 0.1);
redFolder.add(redLight.position, 'z', -10, 10, 0.1);

const greenFolder = gui.addFolder('Green Light');
greenFolder.add(greenLight, 'intensity', 0, 2, 0.01);
greenFolder.add(greenLight.position, 'x', -10, 10, 0.1);
greenFolder.add(greenLight.position, 'y', -10, 10, 0.1);
greenFolder.add(greenLight.position, 'z', -10, 10, 0.1);

const orangeFolder = gui.addFolder('Orange Light');
orangeFolder.add(orangeLight, 'intensity', 0, 2, 0.01);
orangeFolder.add(orangeLight.position, 'x', -10, 10, 0.1);
orangeFolder.add(orangeLight.position, 'y', -10, 10, 0.1);
orangeFolder.add(orangeLight.position, 'z', -10, 10, 0.1);

// Animation
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

