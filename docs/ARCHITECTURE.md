# Architecture Overview 🏛️

## Code Structure

```
src/
├── components/      # UI Components (Dashboard, GoalForm, PlanList)
├── context/         # React Context (State Management)
├── utils/           # Helpers (IndexedDB wrapper, styling)
├── App.jsx          # Main Layout & Routing
├── main.jsx         # Entry Point & SW Registration
└── index.css        # Global Styles & Theme Definitions
```

## State Management (`PiggyContext`)

The application uses a central `PiggyContext` to manage global state. To keep the app "Local First" and offline-capable, we use a dual-layer approach:

1.  **React State (`useState`)**: For immediate UI reactivity.
2.  **IndexedDB (`idb`)**: For persistent storage.

**Data Flow**:
- On load (`useEffect`), data is fetched from IndexedDB into React State.
- Actions (Create, Update, Pay) update React State **immediately** (optimistic UI) and then write to IndexedDB asynchronously.

## Themes

The application supports hot-swappable themes using CSS variables and `data-theme` attributes on the `body` tag.

- **Retro**: Default pixel-art style.
- **Cyberpunk**: Neon, glowing effects, futuristic fonts.
- **Minimal**: High-contrast, black & white, brutalist aesthetic.

**Implementation**:
Theme styles are defined in `src/index.css`. We use TailwindCSS for layout but rely on vanilla CSS overrides within `@layer base` to radically change the look and feel per theme.

## PWA & Offline Support

- **Service Worker**: Uses `vite-plugin-pwa` (Workbox) to cache assets.
- **Data Persistence**: Since data is in IndexedDB, the app works fully offline. Changes sync locally and persist across reloads.
