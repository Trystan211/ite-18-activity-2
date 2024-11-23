import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background for nighttime

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(10, 10, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add dark grass-like floor
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x003300 }) // Dark green for nighttime
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Adjusted Fog for Spooky Night
scene.fog = new THREE.Fog(0x111122, 5, 30); // Dark bluish-gray fog

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Very dim ambient light
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x88aaff, 0.2); // Moonlight effect
moonLight.position.set(10, 20, -10);
moonLight.castShadow = true;
scene.add(moonLight);

// Add Fireflies
const fireflies = [];
const fireflyGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
for (let i = 0; i < 100; i++) {
  const firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);
  firefly.position.set(Math.random() * 40 - 20, Math.random() * 4 + 2, Math.random() * 40 - 20);
  fireflies.push(firefly);
  scene.add(firefly);
}

// Add Trees (simple cone shapes with trunks)
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x003300 }); // Dark green for leaves
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2a0e }); // Brown for trunks

for (let i = 0; i < 5; i++) {
  // Tree trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 4),
    trunkMaterial
  );
  trunk.position.set(Math.random() * 40 - 20, 2, Math.random() * 40 - 20);
  trunk.castShadow = true;
  scene.add(trunk);

  // Tree leaves (cone)
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(3, 6, 8),
    treeMaterial
  );
  leaves.position.set(trunk.position.x, trunk.position.y + 4, trunk.position.z);
  leaves.castShadow = true;
  scene.add(leaves);
}

// Add Pulsing Orb (using MeshStandardMaterial for emissive glow)
const orbGeometry = new THREE.SphereGeometry(2, 32, 32);
const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0xff2200,
  emissive: 0xff2200, // Set emissive color directly
  emissiveIntensity: 1 // This will make the orb glow
});
const orb = new THREE.Mesh(orbGeometry, orbMaterial);
orb.position.set(0, 4, 0);
orb.castShadow = true;
scene.add(orb);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add some smoothing
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update firefly positions for random movement
  fireflies.forEach(firefly => {
    firefly.position.y += Math.sin(elapsedTime + firefly.position.x + firefly.position.z) * 0.1;
  });

  // Update orb pulsing
  const intensity = Math.sin(elapsedTime * 2) * 0.5 + 0.5;
  orb.material.emissiveIntensity = intensity; // Adjust emissive intensity to create pulsing effect

  // Update controls
  controls.update(); // Update the controls

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

