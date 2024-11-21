import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

// Scene setup
const scene = new THREE.Scene();

// Add fog
scene.fog = new THREE.Fog(0x000000, 5, 20);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(7, 7, 15);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for interactivity
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// House
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({ color: 0x8B0000 })
);
walls.position.y = 1.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3, 2, 4),
  new THREE.MeshStandardMaterial({ color: 0x654321 })
);
roof.position.y = 4;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshStandardMaterial({ color: 0x964B00 })
);
door.position.set(0, 1, 2.01);
house.add(door);

// Add house to scene
scene.add(house);

// Garden
const garden = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
garden.rotation.x = -Math.PI / 2;
scene.add(garden);

// Tombstones (optional extra detail)
const tombstones = [];
for (let i = 0; i < 10; i++) {
  const tombstone = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  );
  tombstone.position.set(
    (Math.random() - 0.5) * 10,
    0.5,
    (Math.random() - 0.5) * 10
  );
  scene.add(tombstone);
  tombstones.push(tombstone);
}

// Add bouncing lights
const bouncingLights = [];
for (let i = 0; i < 5; i++) {
  const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  const pointLight = new THREE.PointLight(lightColor, 1, 10);
  pointLight.position.set(
    (Math.random() - 0.5) * 10,
    Math.random() * 5,
    (Math.random() - 0.5) * 10
  );
  scene.add(pointLight);
  bouncingLights.push({ light: pointLight, velocity: new THREE.Vector3(Math.random(), Math.random(), Math.random()) });
}

// Add controls for lights
const gui = new GUI();
const lightControls = gui.addFolder('Lights');
bouncingLights.forEach((bouncingLight, index) => {
  const folder = lightControls.addFolder(`Light ${index + 1}`);
  folder.addColor({ color: bouncingLight.light.color.getHex() }, 'color').onChange((value) => {
    bouncingLight.light.color.set(value);
  });
  folder.add(bouncingLight.light, 'intensity', 0, 2, 0.01);
});
lightControls.open();

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Animate bouncing lights
  bouncingLights.forEach((bouncingLight) => {
    bouncingLight.light.position.add(bouncingLight.velocity);
    if (bouncingLight.light.position.x < -10 || bouncingLight.light.position.x > 10) {
      bouncingLight.velocity.x *= -1;
    }
    if (bouncingLight.light.position.y < 1 || bouncingLight.light.position.y > 5) {
      bouncingLight.velocity.y *= -1;
    }
    if (bouncingLight.light.position.z < -10 || bouncingLight.light.position.z > 10) {
      bouncingLight.velocity.z *= -1;
    }
  });

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
};
animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

