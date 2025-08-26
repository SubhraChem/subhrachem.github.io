function createScene(canvasId, modelPath) {
  const canvas = document.getElementById(canvasId);
  const engine = new BABYLON.Engine(canvas, true);

  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera", Math.PI / 2, Math.PI / 2.5, 3,
    BABYLON.Vector3.Zero(), scene
  );
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight(
    "light", new BABYLON.Vector3(1, 1, 0), scene
  );

  // Load model
  BABYLON.SceneLoader.Append("models/", modelPath, scene, function () {
    console.log(modelPath + " loaded");
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
}

// Create viewers for each model
createScene("modelCanvas1", "model1.glb");
createScene("modelCanvas2", "model2.glb");
createScene("modelCanvas3", "model3.glb");
