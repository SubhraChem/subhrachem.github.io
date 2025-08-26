window.addEventListener("DOMContentLoaded", function () {
    function createViewer(canvasId, color) {
        const canvas = document.getElementById(canvasId);
        const engine = new BABYLON.Engine(canvas, true);

        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera",
            Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        // Add a simple mesh (replace with your GLTF model if you want)
        BABYLON.MeshBuilder.CreateBox("box", {}, scene);

        // Match section background
        scene.clearColor = BABYLON.Color3.FromHexString(color);

        // Prevent page scroll when zooming in the canvas
        canvas.addEventListener("wheel", function (evt) {
            if (canvas.matches(":hover")) {
                evt.preventDefault();
            }
        }, { passive: false });

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());
    }

    // Three viewers, matching CSS backgrounds
    createViewer("renderCanvas1", "#f2f2f2");
    createViewer("renderCanvas2", "#e6f0ff");
    createViewer("renderCanvas3", "#e6ffe6");
});
