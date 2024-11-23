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
  new THREE.MeshStandardMaterial({ color: 0x003300 }) // Dark green for night
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true; // Enable shadow reception
scene.add(ground);

// Adjusted Fog for Spookiness
scene.fog = new THREE.Fog(0x000000, 20, 50); // Black fog for night atmosphere

// Lighting for Nighttime
const ambientLight = new THREE.AmbientLight(0x222222, 0.5); // Dim ambient light
scene.add(ambientLight);

const moonlight = new THREE.DirectionalLight(0xffffff, 0.8);
moonlight.position.set(10, 15, 10);
moonlight.castShadow = true; // Enable shadows
moonlight.shadow.mapSize.width = 1024;
moonlight.shadow.mapSize.height = 1024;
scene.add(moonlight);

// Add tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
for (let i = 0; i < 50; i++) {
  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.2),
    tombstoneMaterial
  );
  tombstone.position.set(
    Math.random() * 20 - 10, // Random X position
    0.5,
    Math.random() * 20 - 10 // Random Z position
  );
  tombstone.rotation.y = Math.random() * Math.PI;
  tombstone.castShadow = true; // Tombstones cast shadows
  scene.add(tombstone);
}

// Bouncing Lights (for Spooky Effects)
const bouncingLights = [];
for (let i = 0; i < 5; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const bouncingLight = new THREE.PointLight(lightColor, 1.5, 15); // Intense small lights
  bouncingLight.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5 + 2,
    Math.random() * 10 - 5
  );
  bouncingLight.castShadow = true; // Bouncing lights cast shadows
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
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
walls.position.y = 1.5;
walls.castShadow = true; // Walls cast shadows
walls.receiveShadow = true; // Receive shadows
house.add(walls);

// Roof (Properly Placed)
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x8b0000 })
);
roof.position.y = 4; // Adjusted position
roof.rotation.y = Math.PI / 4;
roof.castShadow = true; // Roof casts shadow
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshStandardMaterial({ color: 0x3c2f2f })
);
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
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
  bush.castShadow = true; // Bushes cast shadows
  house.add(bush);
});

scene.add(house);

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
