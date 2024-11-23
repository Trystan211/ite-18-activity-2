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

// Add tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, emissive: 0x111111 });
for (let i = 0; i < 50; i++) {
  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.2),
    tombstoneMaterial
  );
  tombstone.position.set(
    Math.random() * 20 - 10,
    0.5,
    Math.random() * 20 - 10
  );
  tombstone.rotation.y = Math.random() * Math.PI;
  tombstone.castShadow = true;
  scene.add(tombstone);
}

// Spooky Bouncing Lights
const bouncingLights = [];
const eerieColors = [0x00ff88, 0xff2200, 0x2200ff];
for (let i = 0; i < 5; i++) {
  const lightColor = eerieColors[i % eerieColors.length];
  const bouncingLight = new THREE.PointLight(lightColor, 2, 15); // Spooky glow
  bouncingLight.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5 + 2,
    Math.random() * 10 - 5
  );
  bouncingLight.castShadow = true;
  scene.add(bouncingLight);
  bouncingLights.push({
    light: bouncingLight,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
  });
}

// House
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({ color: 0x5a2f2f })
);
walls.position.y = 1.5;
walls.castShadow = true;
house.add(walls);

// Roof (adjusted y-position)
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x4b0000 })
);
roof.position.y = 3.5 + 1.5; // Corrected roof position
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshStandardMaterial({ color: 0x3c2f2f })
);
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x003300 });
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushes = [
  [1.5, 0.3, 2.5],
  [2, 0.2, 1.8],
  [-1.5, 0.3, 2.5],
  [-2, 0.2, 1.8],
];
bushes.forEach(([x, y, z]) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.set(1, 1, 1);
  bush.position.set(x, y, z);
  bush.castShadow = true;
  house.add(bush);
});

scene.add(house);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add some smoothing
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update(); // Update the controls

  // Update bouncing lights
  bouncingLights.forEach(({ light, velocity }) => {
    light.position.add(velocity);
    if (light.position.y < 0.5 || light.position.y > 5) velocity.y *= -1;
    if (light.position.x < -10 || light.position.x > 10) velocity.x *= -1;
    if (light.position.z < -10 || light.position.z > 10) velocity.z *= -1;
  });

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


