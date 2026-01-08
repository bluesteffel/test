import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

let scene, camera, renderer, mixer, clock;
let ferretModel;

init();
animate();

function init() {

  // setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  
  // Renderer with AR
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  // AR session button
  document.body.appendChild(ARButton.createButton(renderer));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 5);
  scene.add(ambientLight);

// Anim
  clock = new THREE.Clock();

  // Ferret
  const loader = new GLTFLoader();
  loader.load('./models/ferretAR.glb', (gltf) => {
    elevatorOperator = gltf.scene;
    elevatorOperator.scale.set(0.05, 0.05, 0.05);
    elevatorOperator.position.set(0, 0, -0.3); 
    
    mixer = new THREE.AnimationMixer(elevatorOperator);
    const clips = gltf.animations;
    clips.forEach(clip => {
      const action = mixer.clipAction(clip);
      action.play();
    });
    
    scene.add(ferretModel);
  });

  // Resize 
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    
    if (mixer) mixer.update(delta);
    
    renderer.render(scene, camera);
  });
}
