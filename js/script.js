function initViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(5, 10, 7.5);
  scene.add(light1);

  const light2 = new THREE.AmbientLight(0x404040, 2);
  scene.add(light2);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Load Model
  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Init all viewers
initViewer("viewer1", "models/model1.glb");
initViewer("viewer2", "models/model2.glb");
initViewer("viewer3", "models/model3.glb");
