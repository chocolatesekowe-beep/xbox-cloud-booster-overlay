const state = {
  preset: 'potato',
  renderScale: 60,
  fps: 30,
  latency: 25,
  batterySaver: true,
  cooling: true
};

const presets = {
  potato: {
    renderScale: 60,
    fps: 30,
    latency: 25,
    batterySaver: true,
    cooling: true
  },
  balanced: {
    renderScale: 75,
    fps: 45,
    latency: 50,
    batterySaver: false,
    cooling: true
  },
  smooth: {
    renderScale: 92,
    fps: 60,
    latency: 70,
    batterySaver: false,
    cooling: false
  }
};

const renderScaleInput = document.getElementById('renderScale');
const fpsCapInput = document.getElementById('fpsCap');
const latencyInput = document.getElementById('latency');
const batterySaverInput = document.getElementById('batterySaver');
const coolingInput = document.getElementById('cooling');
const boostBtn = document.getElementById('boostBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const installBtn = document.getElementById('installBtn');

const renderScaleValue = document.getElementById('renderScaleValue');
const fpsCapValue = document.getElementById('fpsCapValue');
const latencyValue = document.getElementById('latencyValue');
const resolutionText = document.getElementById('resolutionText');
const powerText = document.getElementById('powerText');
const networkText = document.getElementById('networkText');
const presetText = document.getElementById('presetText');
const fpsStatus = document.getElementById('fpsStatus');

let deferredPrompt = null;

function updateUI() {
  renderScaleValue.textContent = `${state.renderScale}%`;
  fpsCapValue.textContent = `${state.fps} FPS`;
  fpsStatus.textContent = String(state.fps);
  latencyValue.textContent = state.latency < 35 ? 'Low latency' : state.latency < 70 ? 'Balanced' : 'High quality';

  const width = Math.round(1280 * (state.renderScale / 100));
  const height = Math.round(720 * (state.renderScale / 100));
  resolutionText.textContent = `${width}x${height}`;

  powerText.textContent = state.batterySaver ? 'Eco' : 'Performance';
  networkText.textContent = state.latency < 35 ? '5G' : state.latency < 70 ? '4G' : 'Wi‑Fi';
  presetText.textContent = state.preset.charAt(0).toUpperCase() + state.preset.slice(1);

  renderScaleInput.value = state.renderScale;
  fpsCapInput.value = state.fps;
  latencyInput.value = state.latency;
  batterySaverInput.checked = state.batterySaver;
  coolingInput.checked = state.cooling;
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  state.preset = name;
  state.renderScale = preset.renderScale;
  state.fps = preset.fps;
  state.latency = preset.latency;
  state.batterySaver = preset.batterySaver;
  state.cooling = preset.cooling;

  document.querySelectorAll('.preset').forEach((button) => {
    button.classList.toggle('active', button.dataset.preset === name);
  });

  updateUI();
}

function savePreset() {
  const payload = {
    name: state.preset,
    renderScale: state.renderScale,
    fps: state.fps,
    latency: state.latency,
    batterySaver: state.batterySaver,
    cooling: state.cooling,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem('xbox-cloud-booster-preset', JSON.stringify(payload));
  alert('Preset saved to this device.');
}

function downloadProfile() {
  const payload = {
    preset: state.preset,
    renderScale: state.renderScale,
    fps: state.fps,
    latency: state.latency,
    batterySaver: state.batterySaver,
    cooling: state.cooling
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'xbox-cloud-booster-profile.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function loadSavedPreset() {
  const saved = localStorage.getItem('xbox-cloud-booster-preset');
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.preset = parsed.name || 'potato';
    state.renderScale = parsed.renderScale || state.renderScale;
    state.fps = parsed.fps || state.fps;
    state.latency = parsed.latency || state.latency;
    state.batterySaver = Boolean(parsed.batterySaver);
    state.cooling = Boolean(parsed.cooling);
  } catch (error) {
    console.warn('Could not load saved preset', error);
  }
}

boostBtn.addEventListener('click', () => {
  applyPreset('potato');
  alert('Potato mode enabled. Lower rendering, lower FPS, and battery-saving settings active.');
});

saveBtn.addEventListener('click', savePreset);
downloadBtn.addEventListener('click', downloadProfile);

renderScaleInput.addEventListener('input', (event) => {
  state.renderScale = Number(event.target.value);
  state.preset = 'custom';
  updateUI();
});

fpsCapInput.addEventListener('input', (event) => {
  state.fps = Number(event.target.value);
  state.preset = 'custom';
  updateUI();
});

latencyInput.addEventListener('input', (event) => {
  state.latency = Number(event.target.value);
  state.preset = 'custom';
  updateUI();
});

batterySaverInput.addEventListener('change', (event) => {
  state.batterySaver = event.target.checked;
  updateUI();
});

coolingInput.addEventListener('change', (event) => {
  state.cooling = event.target.checked;
  updateUI();
});

document.querySelectorAll('.preset').forEach((button) => {
  button.addEventListener('click', () => {
    applyPreset(button.dataset.preset);
  });
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) {
    alert('Install is not available in this browser yet. You can still open the app from the repo or use the Add to Home Screen option.');
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

loadSavedPreset();
updateUI();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
