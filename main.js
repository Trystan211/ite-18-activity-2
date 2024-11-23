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
document.body.appendChild(renderer.domElement);

// Darker ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x003300 }) // Very dark green
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Spooky fog
scene.fog = new THREE.Fog(0x000000, 5, 50); // Start close and fade to black

// Lighting
const ambientLight = new THREE.AmbientLight(0x333366, 0.3); // Low intensity and cool tint
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x666666, 0.5); // Reduced intensity
directionalLight.position.set(10, 15, 10);
scene.add(directionalLight);

// Add tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  emissive: 0x333333,
});
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
  scene.add(tombstone);
}

// Bouncing Lights
const bouncingLights = [];
for (let i = 0; i < 5; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const bouncingLight = new THREE.PointLight(lightColor, 3, 20); // Stronger intensity
  bouncingLight.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5 + 2,
    Math.random() * 10 - 5
  );
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
  new THREE.MeshStandardMaterial({ color: 0x5a3e36 })
);
walls.position.y = 1.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x8b0000 })
);
roof.position.y = 3.5; // Corrected height
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshStandardMaterial({ color: 0x2b1f1f })
);
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x1a6628 });
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushes = [
  [1.5, 0.3, 2.5],
  [2, 0.2, 1.8],
  [-1.5, 0.3, 2.5],
  [-2, 0.2, 1.8],
];
bushes.forEach(([x, y, z]) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.position.set(x, y, z);
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

    // Add flicker effect
    light.intensity = 1 + Math.sin(elapsedTime * Math.random()) * 0.5;
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
