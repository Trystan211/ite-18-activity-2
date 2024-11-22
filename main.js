import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "dat.gui";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 7, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add green grass-like floor
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x00aa00 }) // Plain green material
);
ground.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
scene.add(ground);

// Add fog
scene.fog = new THREE.Fog(0x000000, 10, 50);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const staticLights = [
  { color: 0xff0000, position: [4, 5, -2] },
  { color: 0x00ff00, position: [-4, 5, 2] },
  { color: 0xffa500, position: [0, 5, -4] },
];

staticLights.forEach((light) => {
  const pointLight = new THREE.PointLight(light.color, 1, 10);
  pointLight.position.set(...light.position);
  scene.add(pointLight);
});

// Add tombstones
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
for (let i = 0; i < 50; i++) {
  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.2),
    tombstoneMaterial
  );
  tombstone.position.set(
    Math.random() * 20 - 10, // Random X position
    0.5, // Above ground level
    Math.random() * 20 - 10 // Random Z position
  );
  tombstone.rotation.y = Math.random() * Math.PI; // Random rotation
  scene.add(tombstone);
}

// Bouncing Lights
const bouncingLights = [];
for (let i = 0; i < 5; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const bouncingLight = new THREE.PointLight(lightColor, 1, 5);
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
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
walls.position.y = 1.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x8b0000 })
);
roof.position.y = 4;
roof.rotation.y = Math.PI / 4;
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
  house.add(bush);
});

scene.add(house);

// GUI Controls for static lights
const gui = new GUI();
staticLights.forEach((light, idx) => {
  const folder = gui.addFolder(`Static Light ${idx + 1}`);
  folder.addColor(light, "color").onChange((value) => {
    const color = new THREE.Color(value);
    scene.children.find(
      (obj) =>
        obj instanceof THREE.PointLight &&
        obj.color.getHexString() === color.getHexString()
    ).color.set(value);
  });
  folder.open();
});

// Animation
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update bouncing lights
  bouncingLights.forEach(({ light, velocity }) => {
    light.position.add(velocity);
    // Bounce off the ground and walls
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
