import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
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

// Add green grass-like floor
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x003300 }) // Darker grass for nighttime
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true; // Ground receives shadows
scene.add(ground);

// Adjusted Fog for Nighttime
scene.fog = new THREE.Fog(0x000011, 10, 50); // Dark blue fog for a nighttime atmosphere

// Lighting (Nighttime Adjustments)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Reduced intensity for night
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // Softer directional light
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true; // Enable shadows
scene.add(directionalLight);

// Add tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, emissive: 0x111111 }); // Dim emissive glow for night
const placedPositions = [];
for (let i = 0; i < 50; i++) {
  let x, z, distance;
  do {
    x = Math.random() * 20 - 10;
    z = Math.random() * 20 - 10;
    distance = placedPositions.some(([px, pz]) => Math.hypot(x - px, z - pz) < 1);
  } while (distance); // Prevent overlap
  placedPositions.push([x, z]);

  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.2),
    tombstoneMaterial
  );
  tombstone.position.set(x, 0.5, z);
  tombstone.rotation.y = Math.random() * Math.PI;
  tombstone.castShadow = true; // Enable shadows
  scene.add(tombstone);
}

// Bouncing Lights (Glowing Lights for Night)
const bouncingLights = [];
for (let i = 0; i < 5; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const bouncingLight = new THREE.PointLight(lightColor, 3, 20); // Increased intensity and range
  bouncingLight.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5 + 2,
    Math.random() * 10 - 5
  );
  bouncingLight.castShadow = true; // Enable shadow casting
  scene.add(bouncingLight);
  bouncingLights.push({
    light: bouncingLight,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
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

// Roof (Adjusted Position)
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x4b0000 })
);
roof.position.y = 3.5; // Aligns the base of the roof with the top of the walls
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshStandardMaterial({ color: 0x3c2f2f, side: THREE.DoubleSide }) // Added side
);
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x006600 });
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushes = [
  [1.5, 0.3, 2.5],
  [2, 0.2, 1.8],
  [-1.5, 0.3, 2.5],
  [-2, 0.2, 1.8],
];
bushes.forEach(([x, y, z]) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.setScalar(0.8 + Math.random() * 0.4); // Random scaling
  bush.position.set(x, y, z);
  bush.castShadow = true; // Enable shadow casting
  house.add(bush);
});

scene.add(house);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

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
