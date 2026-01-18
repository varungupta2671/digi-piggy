# Build Instructions 🏗️

This guide covers how to build the application for production deployment and PWA generation.

## Standard Build

To create an optimized production build:

```bash
npm run build
```

**Output**: The build artifacts will be generated in the `dist/` directory.
- `index.html`: Entry point.
- `assets/`: Minified CSS and JS.
- `manifest.webmanifest`: PWA manifest.
- `sw.js`: Service Worker.

## Previewing Build

Always test your production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173`.

## PWA Generation

The PWA assets are generated automatically during the build process using `vite-plugin-pwa`.

**Configuration**:
- See `vite.config.js` for manifest details (name, icons, theme colors).
- See `src/main.jsx` for Service Worker registration logic.

**Verification**:
To verify the PWA is working:
1. Run a build and preview it.
2. Open DevTools (F12) -> **Application** tab.
3. Check **Service Workers**: Status should be "Activated and is running".
4. Check **Manifest**: Should show icons and identity details.

## Deployment

The contents of the `dist/` folder are static files. You can deploy them to any static hosting provider:

- **Netlify / Vercel**: Drag and drop the `dist` folder or connect your Git repo (ensure build command is `npm run build` and output dir is `dist`).
- **GitHub Pages**: You may need to set the `base` path in `vite.config.js` if not hosting at the root domain.
