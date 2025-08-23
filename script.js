function initViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(2, 2, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Load model
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Play animations if present
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

      // Update loop with animations
      function animate() {
        requestAnimationFrame(animate);
        mixer.update(0.01);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    } else {
      // No animation, just render loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }
  });
}

// Initialize 3 viewers
initViewer("viewer1", "models/orbital_2_1_1.glb");
initViewer("viewer2", "models/model2.glb");
initViewer("viewer3", "models/model3.glb");
