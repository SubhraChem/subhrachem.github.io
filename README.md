# GitHub Pages 3D Gallery Starter (GLB + model-viewer)

This is a minimal, no-build static site you can deploy to **GitHub Pages** for free. It displays your
Blender-exported `.glb` models interactively using [`<model-viewer>`](https://modelviewer.dev/).

## Quick Start

1. **Create your user site repo** on GitHub (no premium needed):
   - Name the repo exactly: `USERNAME.github.io` (replace `USERNAME` with your GitHub username).
   - Choose "Public". No template needed.

2. **Upload the starter files** from this folder into the repo root (the top level):
   - `index.html`, `script.js`, `assets/styles.css`, `.nojekyll`
   - The `models/` folder (keep the `README.txt` file or add your `.glb` files).

3. **Commit & Deploy**:
   - After you push/commit, go to **Settings → Pages**.
   - Under **Build and deployment**, set **Source = Deploy from a branch**.
   - Select **Branch: `main`** and **Folder: `/`** (root).
   - Save. Your site will be at `https://USERNAME.github.io`.

4. **Add your models**:
   - Export from Blender: `File → Export → glTF 2.0 (.glb)`.
     - Recommended options:
       - **Format**: `glTF Binary (.glb)`
       - **Apply Modifiers**: ✓ (if needed)
       - **+Y Up** (default)
       - **Include**: Selected Objects (optional)
       - **Transform**: Apply (optional; keeps scale/rotation baked)
       - **Geometry → Compression**: **Draco** (try quantization defaults)
   - Put your `.glb` files into the `models/` folder.
   - Edit `script.js` and add the filenames to the `MODELS` array, for example:
     ```js
     const MODELS = [
       "chair.glb",
       "robot.glb",
       "molecule.glb",
     ];
     ```
   - Commit the changes. Refresh your site — you’ll see the models.

## FAQ

### Is this really free?
Yes. GitHub Pages hosting is free. You only pay if you choose to buy a custom domain (optional).

### Can visitors rotate/zoom on desktop and mobile?
Yes. `<model-viewer>` gives you orbit rotation and zoom by default with `camera-controls`.

### Any file size limits?
GitHub enforces a per-file limit of **100 MB**. Try to keep assets smaller (ideally under 20–30 MB) for fast loading.

### Performance tips
- Use **Draco compression**.
- Prefer textures ≤ 2K where possible, compressed to web-friendly formats.
- Keep polygon count reasonable for real-time viewing.

### Can I use Three.js instead?
Absolutely. This starter uses `<model-viewer>` for simplicity. You can switch to Three.js later if you need more control.

---

Happy publishing! 🎉
