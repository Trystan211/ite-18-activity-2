import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 6, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for navigation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.5);
scene.add(ambientLight);

// House
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x8b0000 })
);
roof.position.y = 3;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.5),
  new THREE.MeshStandardMaterial({ color: 0x8b4513 })
);
door.position.set(0, 0.75, 2.01);
house.add(door);

// Tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x4b4b4b });
const tombstones = [];
for (let i = 0; i < 10; i++) {
  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.8, 0.2),
    tombstoneMaterial
  );
  tombstone.position.set(
    (Math.random() - 0.5) * 8,
    0.4,
    (Math.random() - 0.5) * 8
  );
  tombstone.rotation.y = (Math.random() - 0.5) * Math.PI * 0.2;
  scene.add(tombstone);
  tombstones.push(tombstone);
}

// Bushes
const bushGeometry = new THREE.SphereGeometry(0.7, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x006400,
  emissive: 0x003300,
});
const bushes = [];
const bushPositions = [
  { x: 2.5, y: 0.35, z: 1.5 },
  { x: -2.5, y: 0.35, z: 1.5 },
  { x: 1.5, y: 0.35, z: -2 },
  { x: -1.5, y: 0.35, z: -2 },
];
bushPositions.forEach((pos) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.position.set(pos.x, pos.y, pos.z);
  scene.add(bush);
  bushes.push(bush);
});

// Bouncing Lights
const bouncingLights = [];
const lightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const lightMaterial = new THREE.MeshStandardMaterial({ emissive: 0xffffff });
for (let i = 0; i < 5; i++) {
  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial.clone());
  lightMesh.material.emissive = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  lightMesh.position.set(
    (Math.random() - 0.5) * 10,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 10
  );

  // Add PointLight to each bouncing light
  const pointLight = new THREE.PointLight(lightMesh.material.emissive, 1, 5);
  lightMesh.add(pointLight);
  scene.add(lightMesh);

  bouncingLights.push({
    mesh: lightMesh,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    ),
  });
}

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  // Update bouncing lights
  bouncingLights.forEach((light) => {
    light.mesh.position.add(light.velocity);

    // Reverse direction when hitting bounds
    if (light.mesh.position.x > 10 || light.mesh.position.x < -10)
      light.velocity.x *= -1;
    if (light.mesh.position.y > 6 || light.mesh.position.y < 1)
      light.velocity.y *= -1;
    if (light.mesh.position.z > 10 || light.mesh.position.z < -10)
      light.velocity.z *= -1;
  });

  controls.update();
  renderer.render(scene, camera);
};

animate();

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



