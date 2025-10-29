# Billions Network – 12-step Technical Flow

An immersive single-page experience that walks through the Billions Network identity lifecycle. Each stage is paired with bespoke animation, ambient background scenes, and contextual audio to explain how AI agents are registered, verified, and governed.

## Features
- **Scroll-driven storytelling** with 12 sequential steps, each highlighting a different part of the technical flow.
- **Dynamic background canvases** that transition between scenes to reinforce the current step.
- **Contextual soundscape** that blends looping ambience with per-step audio cues.
- **Keyboard-friendly navigation** (`J`/`Arrow Down` and `K`/`Arrow Up`) and accessible reduced-motion mode.
- **Hash-based deep linking** via the progress navigator so sections can be shared directly.

## Tech stack
- **HTML5** for semantic structure and navigation landmarks.
- **CSS3** for layered gradients, glassmorphism panels, and keyframe animations.
- **Vanilla JavaScript** (`script.js`) orchestrating scroll detection, animation states, and audio playback.
- **Google Fonts** (Inter family) for typography.
- **Local audio assets** stored in `/audio` and loaded on demand.

## Project structure
```
class3/
├── index.html      # Page layout and step content
├── style.css       # Styling, animations, and background scenes
├── script.js       # Scroll observer, navigation, and soundscape logic
└── audio/          # MP3 assets for background bed and step themes
```

## Getting started
1. Download or clone the project files into a local directory.
2. Open `index.html` in any modern desktop browser.
   - For best results, serve the folder with a lightweight static server (e.g., `python -m http.server`) to avoid autoplay restrictions on some browsers.
3. Interact with the progress nav or scroll to move through the 12-step journey.

## Controls and accessibility
- Click a number in the progress navigation to jump to that step (audio chime confirms navigation).
- Use `J` / `Arrow Down` to advance and `K` / `Arrow Up` to go back.
- If the system preference is set to **reduced motion**, animations pause automatically.
- Audio starts once the page receives a pointer interaction (per browser autoplay policies); background audio pauses when the tab loses focus.

## Customization tips
- Edit the `STEP_DATA` array in `script.js` to change step titles, captions, or associated graphics.
- Replace MP3 files in `/audio` to adjust the soundtrack or per-step cues.
- Tune animation timings, colors, and backgrounds by modifying the corresponding CSS blocks (e.g., `.background-scene--*`).

## License
This project does not currently include an explicit license. Add one if you plan to distribute or open-source the work.
