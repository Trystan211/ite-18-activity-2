import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Dark background for nighttime

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

// Add dark forest-like floor
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x003300 }) // Dark green
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Fog for nighttime
scene.fog = new THREE.Fog(0x111122, 5, 50);

// Moonlight (Directional Light)
const moonLight = new THREE.DirectionalLight(0x6666ff, 0.6); // Adjusted intensity
moonLight.position.set(10, 30, -10);
moonLight.castShadow = true;

// Expand the shadow area
moonLight.shadow.mapSize.width = 4096; // Higher resolution for sharper shadows
moonLight.shadow.mapSize.height = 4096;

moonLight.shadow.camera.near = 1; // Start rendering shadows close to the light
moonLight.shadow.camera.far = 100; // Render shadows farther away
moonLight.shadow.camera.left = -50; // Extend the shadow area left
moonLight.shadow.camera.right = 50; // Extend the shadow area right
moonLight.shadow.camera.top = 50; // Extend the shadow area up
moonLight.shadow.camera.bottom = -50; // Extend the shadow area down

scene.add(moonLight);

// Helper to visualize shadow area (optional, remove when not needed)
const shadowCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera);
scene.add(shadowCameraHelper);

// Glowing Orb
const orbGeometry = new THREE.SphereGeometry(1, 32, 32);
const orbMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffff00, // Bright yellow glow
  emissiveIntensity: 5,
});
const orb = new THREE.Mesh(orbGeometry, orbMaterial);
orb.position.set(0, 5, 0);
orb.castShadow = true;
scene.add(orb);

// Fireflies
const fireflies = [];
const fireflyMaterial = new THREE.PointsMaterial({
  size: 0.2,
  color: 0xffffaa,
  transparent: true,
  opacity: 0.8,
});
const fireflyGeometry = new THREE.BufferGeometry();
const fireflyCount = 100; // Add more fireflies
const positions = [];
for (let i = 0; i < fireflyCount; i++) {
  positions.push(
    Math.random() * 20 - 10,
    Math.random() * 10 + 1,
    Math.random() * 20 - 10
  );
}
fireflyGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
const fireflyPoints = new THREE.Points(fireflyGeometry, fireflyMaterial);
scene.add(fireflyPoints);

// Mushrooms
const mushroomMaterial = new THREE.MeshStandardMaterial({ color: 0xff2200 });
const mushroomStemMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
for (let i = 0; i < 20; i++) {
  const mushroomCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 0.5, 16),
    mushroomMaterial
  );
  const mushroomStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
    mushroomStemMaterial
  );

  const mushroom = new THREE.Group();
  mushroomCap.position.y = 0.5;
  mushroom.add(mushroomCap);
  mushroom.add(mushroomStem);

  mushroom.position.set(
    Math.random() * 20 - 10,
    0.1,
    Math.random() * 20 - 10
  );
  mushroom.castShadow = true;
  scene.add(mushroom);
}

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add some smoothing
controls.dampingFactor = 0.25;

// Animation Loop
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Firefly movement
  const positions = fireflyGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += Math.sin(elapsedTime + i) * 0.005; // Sway up and down
  }
  fireflyGeometry.attributes.position.needsUpdate = true;

  controls.update(); // Update controls
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

