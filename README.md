# Calcium Myth & Bone Remodeling — Remotion 1080p 60fps Project

Complete story-driven 2D motion graphics project built with Remotion (React/TypeScript), including offline Bengali fonts (`Noto Sans Bengali`), voiceover audio (`public/voiceover.mp3`), tactile SFX (`public/sfx/`), and automated GitHub Actions cloud rendering.

## Quick Start (Local)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Open Remotion Studio Preview:
   ```bash
   npm start
   ```

3. Render 16:9 1080p 60fps MP4:
   ```bash
   npm run build
   ```

## GitHub Actions Automated Rendering

Push this repository to GitHub (`main` or `master` branch). The workflow in `.github/workflows/render.yml` automatically:
- Installs Ubuntu Bengali font packages and registers local `public/fonts/*.ttf`
- Renders the `Main` composition at `1920x1080` @ `60fps`
- Uploads the finished MP4 artifact (`calcium-myth-bone-loss-1080p60fps`)
