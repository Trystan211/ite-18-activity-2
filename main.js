import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x111111, 0.02); // Fog for mystic effect

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(10, 8, 20);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111111); // Matches fog for seamless effect
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light (for general scene illumination)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// House
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
walls.position.y = 1.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 2, 4),
  new THREE.MeshStandardMaterial({ color: 0x663300 })
);
roof.position.y = 4;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshStandardMaterial({ color: 0x4B3621 })
);
door.position.set(0, 1, 2.01);
house.add(door);

// Add house to scene
scene.add(house);

// Garden (ground)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// Bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });

const bushes = [];
for (let i = 0; i < 10; i++) {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.position.set(
    (Math.random() - 0.5) * 20, // Random positions in the garden
    0.3,
    (Math.random() - 0.5) * 20
  );
  scene.add(bush);
  bushes.push(bush);
}

// Trees
const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

const foliageGeometry = new THREE.SphereGeometry(1.5, 16, 16);
const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });

for (let i = 0; i < 5; i++) {
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

  trunk.position.set((Math.random() - 0.5) * 20, 1, (Math.random() - 0.5) * 20);
  foliage.position.set(trunk.position.x, trunk.position.y + 2, trunk.position.z);

  scene.add(trunk);
  scene.add(foliage);
}

// Bouncing lights
const lights = [];
for (let i = 0; i < 10; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const pointLight = new THREE.PointLight(lightColor, 1, 10);
  pointLight.position.set(
    (Math.random() - 0.5) * 30,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 30
  );

  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: lightColor })
  );
  pointLight.add(lightSphere);
  scene.add(pointLight);

  lights.push({
    light: pointLight,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    ),
  });
}

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Move lights
  lights.forEach((bouncingLight) => {
    bouncingLight.light.position.add(bouncingLight.velocity);

    // Reverse direction if out of bounds
    if (bouncingLight.light.position.x < -25 || bouncingLight.light.position.x > 25) bouncingLight.velocity.x *= -1;
    if (bouncingLight.light.position.y < 1 || bouncingLight.light.position.y > 10) bouncingLight.velocity.y *= -1;
    if (bouncingLight.light.position.z < -25 || bouncingLight.light.position.z > 25) bouncingLight.velocity.z *= -1;
  });

  controls.update();
  renderer.render(scene, camera);
};
animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

