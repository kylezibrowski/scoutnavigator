# ScoutNavigator

**Field Intelligence for Outdoor Nav**

ScoutNavigator is a portfolio demo web mapping app built with React, Vite, TypeScript, and Mapbox GL JS. It explores how an outdoor navigation product could help users organize and act on messy field data such as scouting pins, observations, access notes, water sources, glassing points, and hunt-season notes.

Live demo:

```text
https://scoutnavigator.vercel.app/
```

---

## What this demo shows

ScoutNavigator is designed to demonstrate:

- Geospatial product thinking
- Map-first UX design
- Outdoor navigation workflow knowledge
- Frontend implementation with React and Mapbox
- Transparent recommendation workflows
- User-controlled organization of scouting data

The app uses real Mapbox terrain as the visual foundation. Scouting scenarios, pins, and intelligence workflows are simulated for demo reliability.

---

## Current demo workflow

A reviewer can use the app in this flow:

1. Open the live demo.
2. Generate a scouting scenario.
3. Review simulated scouting pins on the map.
4. Add a custom user pin.
5. Run **Pin Cleanup**.
6. Review cleanup recommendations.
7. Accept a grouping to create a saved folder.
8. Open **Folders** from the left rail.
9. Inspect folder contents.
10. Expand pin details with **Edit**.
11. Remove a pin from a folder.
12. Add an unassigned pin back to a folder from the map popup.

---

## Core features

### Scenario generation

The app opens to a simulated Idaho / Mountain West scouting scenario. Users can generate new scenarios to move the map and refresh pins.

Current scenario regions include:

- Boise National Forest
- Sawtooth / Stanley Area
- Payette National Forest / McCall
- Salmon-Challis Region
- Southwest Idaho Region
- Panhandle / Lolo Region

### Add Pin

Users can add a custom scouting pin directly on the map. User-created pins are stored in React state for the current session and are included in Pin Cleanup analysis.

### Pin Cleanup

Pin Cleanup analyzes active scenario pins and recommends folder groupings. Recommendations include:

- Suggested folder name
- Editable folder name
- Confidence score
- Explanation of why the grouping was suggested
- Included pins
- Pin-level assignment controls
- Accept / dismiss actions

Pins already assigned to saved folders are excluded from future cleanup recommendations. Pins marked as **No Folder** remain eligible.

### Folder Review

Accepted cleanup groups become saved folders. Users can open **Folders** from the left rail, inspect folder contents, expand pin details, and remove pins from folders.

Removed pins become eligible for Pin Cleanup again. Empty folders remain visible.

### Manual folder assignment

Unassigned pins can be added to existing folders directly from the Mapbox popup. Selecting a folder assigns the pin immediately.

---

## Product principles

ScoutNavigator is built around a few product ideas:

- The map should remain the primary workspace.
- Recommendations should be transparent.
- The user should stay in control.
- Suggested organization should be adjustable, not automatic.
- Simulated demo intelligence should be clearly framed and not overclaim real-world analysis.

---

## Tech stack

- React
- Vite
- TypeScript
- Mapbox GL JS
- Tailwind CSS
- Turf.js

---

## Project structure

```text
src/
├── components/
│   ├── AppShell.tsx        # Owns core app state and workflow handlers
│   ├── LeftRail.tsx        # Fixed left navigation rail
│   └── MapViewer.tsx       # Mapbox map, markers, popups, and floating panels
├── data/
│   └── scenarioRegions.ts  # Curated Idaho scenario regions
├── types/
│   └── scout.ts            # Shared TypeScript types
├── utils/
│   ├── scenarioEngine.ts   # Scenario pin generation
│   └── pinCleanupEngine.ts # Pin Cleanup recommendation logic
└── main.tsx

## Local development

Install dependencies:

```bash
npm install
```

Create a local `.env` file with a Mapbox token:

```text
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

---

## Deployment

The app is deployed on Vercel.

Production URL:

```text
https://scoutnavigator.vercel.app/
```

The production deployment uses this environment variable:

```text
VITE_MAPBOX_TOKEN
```

Because this is a browser-based Mapbox app, the Mapbox token is client-visible. The token should be restricted in Mapbox to approved URLs such as:

```text
http://localhost:5173
https://scoutnavigator.vercel.app
```

---

## Current status

Completed:

- Project scaffold
- Mapbox integration
- Scenario engine
- Map-first layout
- Add Pin workflow
- Pin Cleanup MVP
- Folder Review + Manual Assignment
- Vercel deployment

Next planned phase:

```text
Phase 6 — Feature Finder MVP
```

Feature Finder should be a visual, map-native workflow for identifying simulated scouting opportunities such as water, glassing, and access points. It should not become a chatbot or broad AI summary feature.
