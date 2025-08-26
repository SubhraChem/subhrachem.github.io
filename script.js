function createScene(canvasId, modelPath) {
  const canvas = document.getElementById(canvasId);
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  const scene = new BABYLON.Scene(engine);

  // Transparent background → blends with section
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  // Camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2, Math.PI / 2.5, 3,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // Light
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  // Load model
  BABYLON.SceneLoader.Append("models/", modelPath, scene);

  // Render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
}

// Initialize 3 scenes
createScene("modelCanvas1", "model1.glb");
createScene("modelCanvas2", "model2.glb");
createScene("modelCanvas3", "model3.glb");
