// =============== EDIT THIS LIST ===============
// Put your .glb filenames here (they must live in /models next to this file structure)
const MODELS = [
  "orbital_2_1_0.glb",
  "orbital_2_1_1.glb",
  "anim_test.glb",
];

// Optional: human-friendly titles (otherwise we use the filename)
const TITLES = {
  // "bunny.glb": "Stanford Bunny",
};

// ========== You usually don't need to edit below ==========
function createCard(filename) {
  const title = TITLES[filename] || filename;
  const card = document.createElement('div');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'card-header';
  header.textContent = title;
  card.appendChild(header);

  const body = document.createElement('div');
  body.className = 'card-body';

  const mv = document.createElement('model-viewer');
  mv.setAttribute('src', `models/${filename}`);
  mv.setAttribute('alt', title);
  mv.setAttribute('camera-controls', '');
  mv.setAttribute('auto-rotate', '');
  mv.setAttribute('shadow-intensity', '1');
  mv.setAttribute('exposure', '1.0');
  mv.setAttribute('touch-action', 'pan-y'); // lets page scroll vertically on touch
  body.appendChild(mv);

  card.appendChild(body);

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const size = document.createElement('span');
  size.className = 'mono';
  size.textContent = `models/${filename}`;
  footer.appendChild(size);

  const open = document.createElement('a');
  open.href = `models/${filename}`;
  open.target = '_blank';
  open.rel = 'noopener';
  open.textContent = 'Open file';
  footer.appendChild(open);

  card.appendChild(footer);
  return card;
}

function renderGallery() {
  const grid = document.getElementById('gallery');
  grid.innerHTML = '';

  if (!Array.isArray(MODELS) || MODELS.length === 0) {
    const help = document.createElement('div');
    help.className = 'hero';
    help.innerHTML = `
      <h2>No models yet</h2>
      <p>Upload your <code>.glb</code> files to the <code>/models</code> folder, then edit <code>script.js</code>
         and add their filenames to <code>MODELS</code>. Example:</p>
      <pre><code>const MODELS = [
  "my_first_model.glb",
  "my_second_model.glb"
];</code></pre>
    `;
    grid.appendChild(help);
    return;
  }

  MODELS.forEach(name => grid.appendChild(createCard(name)));
}

document.addEventListener('DOMContentLoaded', renderGallery);
