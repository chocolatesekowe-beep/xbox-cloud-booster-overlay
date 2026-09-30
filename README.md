# Xbox Cloud Booster Overlay

A mobile-first browser app designed as a compact overlay for Xbox Cloud Gaming on lower-end phones. It helps users switch into a potato-graphics mode, reduce render scale, cap FPS, and optimize for battery and network conditions.

## Features

- Potato graphics preset
- Balanced and smooth modes
- FPS and render-scale control sliders
- Battery saver toggle
- Adaptive cooling toggle
- Save preset locally
- Download config as JSON
- Installable as a mobile web app (PWA)

## Run locally

Open `index.html` in a browser, or serve it with a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Download this project

You can download the full source from GitHub as a ZIP archive from the repository page.

## Notes

This is a companion overlay/app, not a direct system-level modification of the Xbox Cloud Gaming app. For mobile use it works best as a standalone installable web app or as a visual controller for cloud-gaming sessions.
