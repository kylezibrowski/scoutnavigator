# ScoutNavigator

**Field Intelligence for Outdoor Nav**

ScoutNavigator is a portfolio demo web mapping application designed to demonstrate geospatial product thinking, client-side spatial analysis, and outdoor navigation workflow design.

The app simulates Idaho scouting workflows over real terrain, helping users review scouting pins, evaluate terrain clues, and organize field intelligence without automatically changing user data.

## Current Status

ScoutNavigator is currently in early build.

Completed:

- Vite React TypeScript project scaffold
- Tailwind CSS setup
- Initial light outdoor-navigation-inspired app shell
- Left rail navigation placeholder
- Control panel placeholder
- Map viewer placeholder
- Demo Mode disclaimer
- Componentized layout structure

Current app structure:

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── ControlPanel.tsx
│   ├── DemoDisclaimer.tsx
│   ├── LeftRail.tsx
│   └── MapViewer.tsx
├── App.tsx
├── App.css
├── index.css
└── main.tsx