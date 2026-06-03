# ScoutNavigator Context — Phase 2 Complete

## Project Name

**ScoutNavigator**

## Product Positioning

**Field Intelligence for Outdoor Nav**

ScoutNavigator is a portfolio demo web mapping application designed to demonstrate geospatial product thinking, client-side spatial analysis, and outdoor navigation workflow design.

The intended audience is hiring managers, product leaders, and engineering teams at outdoor navigation and mapping companies such as onX, goHUNT, and adjacent outdoor/geospatial software companies.

The app should feel like a credible outdoor navigation product demo, not a toy app or generic map tutorial.

---

## Strategic Objective

Build a standalone, interactive web mapping app that shows:

1. Strong geospatial product instincts.
2. Practical frontend mapping implementation.
3. User-respecting recommendation workflows.
4. Transparent spatial logic.
5. A polished, portfolio-readable codebase.
6. A demo that can be opened by a reviewer and understood within 30 seconds.

The app should be publicly deployable and easy to review through a live URL and GitHub repo.

---

## Core Product Concept

ScoutNavigator simulates outdoor scouting workflows over real Idaho terrain.

Users can generate realistic scouting scenarios, review scattered scouting pins, run a “Pin Cleanup” recommendation workflow, and explore “Find Feature Terrains” candidates.

The app uses real Mapbox terrain as the visual map foundation. For v1, scouting pins and terrain feature candidates are simulated by a scenario engine for demo reliability.

The system must remain honest about this through a subtle Demo Mode disclaimer.

---

## Demo Mode Disclaimer

Current disclaimer language:

> Scenarios use simulated scouting data layered over real Idaho terrain.

This disclaimer is already present in the app shell and should remain visible.

The app should not claim that it detects authoritative real-world saddles, benches, ridgelines, water sources, animal activity, public-land legality, or hunt recommendations from GIS/elevation datasets in v1.

The architecture should be designed so simulated features could later be replaced by real GIS, elevation-derived, or API-provided datasets.

---

## Target User Experience

### Initial Load

1. User opens app.
2. App loads a simulated Mountain West / Idaho scouting scenario.
3. Real Idaho terrain appears through Mapbox.
4. Scouting pins and scenario data are displayed.
5. The UI uses a light, OnX-inspired layout with a left rail and side content/control panel.
6. The app clearly communicates that the scenario data is simulated.

### Generate New Scenario

1. User clicks **Generate New Scenario**.
2. The map moves to a curated Idaho public-land or public-land-feeling region.
3. Pins and simulated feature candidates regenerate.
4. The scenario should feel believable and outdoors-oriented.

### Pin Cleanup

1. User clicks **Pin Cleanup**.
2. The app analyzes scattered pins.
3. The system recommends 2–3 folder groupings.
4. Each recommendation shows a clear “Why this grouping?” explanation.
5. User can hover over a recommendation and see related pins pulse/highlight on the map.
6. User can accept the grouping.
7. User can override the recommended folder destination.
8. User can save.
9. User can dismiss a recommendation.
10. Dismissed recommendations clear until the next analysis.

### Find Feature Terrains

This is the moonshot feature.

For v1, this should start as a structured selector, not a natural-language prompt.

User clicks **Find Feature Terrains** and selects from feature types such as:

* Saddle
* Water
* Ridgeline
* Bench
* Wallow
* Bedding
* Food
* Glassing

The app highlights possible matching terrain candidates with pins, shapes, or line overlays.

The system should explain why those candidates were highlighted.

---

## Primary MVP Feature

**Pin Cleanup**

This is the most practical and achievable v1 feature.

It demonstrates product thinking, user empathy, spatial reasoning, and a credible outdoor navigation workflow.

Pin Cleanup must never automatically reorganize the user’s data. It recommends, explains, and waits for user confirmation.

---

## Moonshot Feature

**Find Feature Terrains**

This demonstrates spatial intelligence and terrain reasoning.

For v1, it should use simulated-but-plausible feature candidates over real terrain. Later versions may replace simulated candidates with real GIS/elevation-derived terrain data.

---

## Post-Moonshot Future Feature Concept

### Ask Remi / Remi-Inspired Scouting Logic

The user wants to add a future LLM-driven feature concept after Feature Finder.

Working concept:

**Ask Remi** would review highlighted terrain and feature candidates and suggest the kinds of areas an experienced backcountry hunter might focus on first.

Example logic:

* A bench on a north-facing slope with a saddle within half a mile may suggest a travel corridor toward bedding.
* Water near cover and lower drainage terrain may support a wallow/bedding interpretation.
* Glassing points may be prioritized based on visibility into adjacent benches, saddles, and feeding zones.

Important future clarifications before building this:

1. Decide whether to use the name **Ask Remi** directly or use safer framing such as **Remi-inspired scouting logic**.
2. Avoid implying Remi Warren’s actual endorsement, voice, private knowledge, or participation unless licensed/authorized.
3. Determine whether public writings can be used only as general inspiration or whether a source-permission/RAG approach is needed.
4. Determine whether the feature is framed as educational, demo-only, or tactical.
5. Determine whether the output should cite authorized sources.
6. Define the feature inputs: selected terrain candidates, slope/aspect, distance between features, pin types, season, target species, prior user pins, and scenario context.
7. Keep all outputs honest and avoid authoritative wildlife prediction claims.

This is not part of v1. Capture it only as future roadmap context.

---

## Technology Stack

Use:

* React
* Vite
* TypeScript
* Mapbox GL JS
* Turf.js
* Tailwind CSS
* Lucide React
* localStorage
* No backend for v1
* No database for v1
* No authentication for v1

---

## TypeScript Decision

Use TypeScript.

Reasoning:

ScoutNavigator uses structured map data, including pins, folders, features, coordinates, recommendations, and scenario objects. TypeScript provides guardrails that help prevent mapping bugs caused by malformed data.

TypeScript should be used in a portfolio-readable way. Avoid excessive abstraction.

---

## Visual Direction

Use a **light OnX-inspired UI**.

Important visual patterns:

* Map-first experience.
* Left vertical app rail.
* Side content/control panel.
* Search/scenario controls near the top.
* Light cards with rounded corners.
* Orange or high-visibility primary actions.
* Clear saved folder hierarchy.
* High-visibility map pins.
* Floating map tools where useful.
* Real terrain / 3D terrain feel.

Do not copy onX branding, exact design, logos, or proprietary UI. Borrow only the general outdoor navigation workflow pattern.

### UI Backlog Item

The user wants to revisit the size and behavior of the middle ScoutNavigator control panel.

Current panel is functional but may be too wide for a map-first product.

Future options:

* Make the panel narrower.
* Make the panel collapsible.
* Make the panel semi-transparent.
* Let the map own more screen space.
* Convert some controls into floating overlays once Mapbox is integrated.

This is backlogged and should not block Phase 3.

---

## Pin Types for V1

V1 should support these pin types:

* Camp
* Sign
* Water
* Glassing Point
* Trail Camera
* Wallow
* Access Point
* Truck
* Food
* Bedding
* Blood
* Shot
* Deer
* Elk
* Generic Marker

Pin icons and colors should be visually distinct enough to support map scanning.

---

## Folder Naming Direction

Folder recommendations should use generic, realistic folder names.

Examples:

* Scouting North Zone
* Scouting Back Basin
* 2026 Elk Hunt
* Weekend Scouting Loop
* Spring Bear Notes
* Central Idaho Markups
* Creek Drainage Set
* Ridge Access Plan

Avoid overly specific or overly clever names.

---

## Geography

Constrain v1 to Idaho.

Use curated Idaho public-land or public-land-feeling regions rather than fully random statewide placement.

Potential regions:

* Boise National Forest
* Sawtooth / Stanley area
* Salmon-Challis region
* Payette National Forest / McCall region
* Clearwater / North Idaho
* Central Idaho mountain zones

The app should avoid pretending to provide authoritative hunt recommendations for specific real-world units.

---

## Terrain and Feature Realism

V1 should use:

* Real Mapbox terrain basemap.
* Simulated scouting pins.
* Simulated-but-plausible terrain feature candidates.

The scenario engine should avoid obviously unrealistic feature placement.

Examples:

* Water should not appear on obvious peaks.
* Wallows should tend to appear near water or lower drainage areas.
* Ridgelines should appear as line features and not random isolated points.
* Benches should appear partway up slope-like areas.
* Saddles should appear near pass/neck-down style areas.
* Camp/truck/access points should usually appear closer to roads, trailheads, or lower-access edges when possible.

Because v1 does not perform true elevation analysis, the app must be transparent that scenarios are simulated.

---

## Current Technical Architecture

Current structure after Phase 2:

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
```

Recommended future structure as the app grows:

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── MapViewer.tsx
│   ├── ControlPanel.tsx
│   ├── GroupingPanel.tsx
│   ├── FeatureTerrainPanel.tsx
│   ├── DemoDisclaimer.tsx
│   └── LeftRail.tsx
├── data/
│   └── scenarioRegions.ts
├── types/
│   └── scout.ts
├── utils/
│   ├── scenarioEngine.ts
│   ├── clusteringEngine.ts
│   ├── spatialAnalysis.ts
│   ├── folderStorage.ts
│   └── mapLayers.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Main Data Models

The app should eventually model:

* ScenarioRegion
* ScoutScenario
* ScoutPin
* ScoutPinType
* TerrainFeature
* TerrainFeatureType
* Folder
* GroupingRecommendation
* RecommendationReason
* SpatialAnalysisResult
* SavedFolderState

Keep the data model clear and readable.

---

## Pin Cleanup Logic

Use a custom weighted similarity engine instead of K-Means or DBSCAN.

The recommendation engine should compare pins and generate grouping suggestions using:

* 50% proximity
* 30% time / season affinity
* 20% metadata context

The app should explain recommendations clearly.

Example explanation:

```text
Why this grouping?
- Pins are clustered within 0.6 miles.
- Most were dropped within 9 days of each other.
- Sign, water, and bedding markers suggest a related scouting pattern.
- Confidence: 84%.
```

Pin Cleanup should create suggestions, not automatically change folders.

---

## Save Behavior

Use `localStorage` for v1.

Accepted folders and saved groupings should persist in the user’s browser after refresh.

No backend persistence in v1.

This can later be replaced with backend persistence, account sync, export/import, or cloud storage.

---

## Mapbox Setup

Use Mapbox GL JS.

The Mapbox token is stored in a local environment variable:

```text
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

The real token lives in:

```text
.env
```

The `.env` file is ignored by Git and should never be committed to GitHub.

The committed example file is:

```text
.env.example
```

It contains placeholder text only:

```text
VITE_MAPBOX_TOKEN=replace_with_your_mapbox_token
```

The app reads the token in `MapViewer.tsx` using:

```ts
import.meta.env.VITE_MAPBOX_TOKEN
```

---

## Current Mapbox Implementation

`MapViewer.tsx` now renders a real Mapbox map using:

* `mapbox-gl`
* Mapbox outdoors style
* Mapbox DEM terrain source
* Terrain exaggeration
* Fog
* Navigation control
* Compact attribution control
* Idaho-centered camera

Current camera:

```ts
center: [-115.1886, 44.2141],
zoom: 10.2,
pitch: 55,
bearing: -18,
```

The user confirmed `zoom: 10.2` is a good default scenario starting point.

Notes:

* `zoom: 8.2` felt too broad, roughly a large regional view.
* `zoom: 10.2` feels more appropriate for a hunting/scouting scenario.
* Feature Finder may eventually use a tighter view, likely around zoom 11–12+ depending on feature type and screen size.

`MapViewer.tsx` also has a visible missing-token fallback UI that tells the user to add `VITE_MAPBOX_TOKEN` to `.env`.

---

## Mapbox Build Warning

Running:

```bash
npm run build
```

succeeds.

A warning appears that some chunks are larger than 500 KB after minification.

This is not a blocker.

Reason:

`mapbox-gl` is a large mapping library.

Future possible optimization:

* lazy-load the map
* dynamic import
* chunking/code-splitting

Do not address this yet. It is a future polish/performance item, not a Phase 3 blocker.

---

## Build Philosophy

Build in small slices.

Do not try to generate the full app in one pass.

Each phase should produce a working local app before moving on.

Preferred workflow:

1. Generate code for a small slice.
2. Run locally.
3. Fix errors.
4. Run build when appropriate.
5. Confirm `git status`.
6. Commit working state.
7. Push to GitHub.
8. Move to the next slice.

Use Git continuously.

Before any commit:

* Confirm the app works locally.
* Confirm `npm run build` passes when relevant.
* Confirm `.env` is not listed in Git status.
* Confirm only intended files are staged.

---

## Completed Phase 0 — Account and Tool Setup

Phase 0 was completed from scratch.

### Accounts Created

* GitHub account created and verified.
* Mapbox account created.
* Vercel account created using GitHub login.

### Local Tools Installed and Verified

* Git installed:

```text
git version 2.50.1 (Apple Git-155)
```

* Git identity configured:

```text
user.name=Kyle Zibrowski
user.email=[correct GitHub email]
```

* Node.js installed:

```text
v24.16.0
```

* npm installed:

```text
11.13.0
```

* VS Code installed:

```text
1.122.1
arm64
```

* VS Code `code` terminal command installed and verified.

### Local Project Folder Created

Project folder:

```text
/Users/kylezibrowski/Projects/scoutnavigator
```

### Local Git Repository Created

Git was initialized inside the project folder:

```bash
git init
```

Default branch:

```text
main
```

### Starter Files Created

The first local files were created:

```text
.gitignore
README.md
context.md
```

`.gitignore` now includes environment exclusions for:

```text
.env
.env.local
.env.*.local
```

Important reason:

* `.env` is ignored so the real Mapbox token will not be committed to GitHub.
* `.env.example` is committed with placeholder text only.

### First Commit Created

First local commit:

```bash
git add .
git commit -m "Initial project setup"
```

Commit message:

```text
Initial project setup
```

### GitHub Repository Created

GitHub repo:

```text
https://github.com/kylezibrowski/scoutnavigator
```

Visibility:

```text
Public
```

Repository description:

```text
Field Intelligence for Outdoor Nav
```

License:

```text
No license
```

Initial GitHub repo was created empty so it would not conflict with local files.

### Local Repo Connected to GitHub

Remote added:

```bash
git remote add origin https://github.com/kylezibrowski/scoutnavigator.git
```

Initial push completed.

Remote verification:

```text
origin  https://github.com/kylezibrowski/scoutnavigator.git (fetch)
origin  https://github.com/kylezibrowski/scoutnavigator.git (push)
```

---

## Completed Phase 1 — Project Scaffold and Shell

Phase 1 is complete.

### Phase 1 Goals

Create:

* Vite React TypeScript app
* Tailwind setup
* Base layout
* README update
* Componentized shell

Success criteria:

* `npm run dev` works.
* App opens locally.
* ScoutNavigator shell appears.
* Repo is committed and pushed.
* Git status is clean.

All criteria were met.

### Vite Scaffold

Scaffolded Vite React TypeScript app inside existing repo folder:

```text
/Users/kylezibrowski/Projects/scoutnavigator
```

Important: no nested `scoutnavigator/scoutnavigator` folder was created.

Command used:

```bash
npm create vite@latest . -- --template react-ts
```

Installed dependencies:

```bash
npm install
```

Confirmed local app ran:

```bash
npm run dev
```

Local URL:

```text
http://localhost:5173/
```

Commit created:

```text
Scaffold Vite React TypeScript app
```

### Tailwind Setup

Tailwind installed:

```bash
npm install tailwindcss @tailwindcss/vite
```

Updated:

```text
vite.config.ts
src/index.css
src/App.css
```

`vite.config.ts` uses:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css` imports Tailwind:

```css
@import "tailwindcss";
```

### Initial ScoutNavigator Shell

The default Vite starter page was replaced with a ScoutNavigator application shell.

Current UI includes:

* Left rail with `SN` mark.
* Map / Pins / Folders / Tools placeholders.
* Middle ScoutNavigator control panel.
* Demo Mode disclaimer.
* Scenario card.
* Generate New Scenario button.
* Pin Cleanup placeholder card.
* Find Feature Terrains placeholder card.
* Saved Folders placeholder list.
* Recent Pins placeholder list.
* Right-side map area.
* Phase 1 placeholder was replaced by Mapbox in Phase 2.

Commit created:

```text
Build initial ScoutNavigator shell
```

### Component Refactor

The large initial `App.tsx` was refactored into smaller components:

```text
src/components/
├── AppShell.tsx
├── ControlPanel.tsx
├── DemoDisclaimer.tsx
├── LeftRail.tsx
└── MapViewer.tsx
```

`App.tsx` is now a small entry point that renders `AppShell`.

Refactor purpose:

* Improve readability.
* Prepare for Mapbox integration.
* Make future features easier to slot into focused files.
* Keep the repo portfolio-readable.

Commit created:

```text
Refactor shell into components
```

### Demo Disclaimer Fix

Fixed typo/redundant wording in demo disclaimer.

Final copy:

```text
Scenarios use simulated scouting data layered over real Idaho terrain.
```

Commit created:

```text
Fix demo disclaimer copy
```

### README Update

README was updated from default Vite content to ScoutNavigator-specific documentation.

README now includes:

* Project name and positioning.
* Current status.
* Product direction.
* Demo Mode disclaimer.
* Tech stack.
* Development commands.
* Build philosophy.
* Known limitations.

Commit created:

```text
Update README for Phase 1 ScoutNavigator shell
```

Final verified status after Phase 1:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

## Completed Phase 2 — Mapbox Integration

Phase 2 is complete.

### Phase 2 Goals

Create:

* Mapbox token setup.
* `.env` and `.env.example`.
* `MapViewer.tsx` real Mapbox integration.
* Initial Idaho map view.
* Terrain/pitched map feel.

Success criteria:

* Map loads locally.
* No token errors.
* Camera starts in Idaho.
* Existing shell remains intact.
* Real Mapbox map replaces placeholder area.
* `.env` remains uncommitted.
* `.env.example` is committed with placeholder token text.

All criteria were met.

### Environment Files

Created local private `.env`:

```text
VITE_MAPBOX_TOKEN=[real Mapbox public token]
```

Created committed `.env.example`:

```text
VITE_MAPBOX_TOKEN=replace_with_your_mapbox_token
```

Updated `.gitignore` to include:

```text
# Environment variables
.env
.env.local
.env.*.local
```

Verified:

```bash
git check-ignore -v .env
```

Output confirmed `.env` is ignored by `.gitignore`.

### Mapbox GL JS Installed

Installed:

```bash
npm install mapbox-gl
```

Files changed:

```text
package.json
package-lock.json
```

### Real Mapbox Map Added

`src/components/MapViewer.tsx` was updated to use:

```ts
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
```

The placeholder map was replaced with a real Mapbox map.

Map style:

```text
mapbox://styles/mapbox/outdoors-v12
```

Initial broad Phase 2 camera:

```ts
center: [-115.1886, 44.2141],
zoom: 8.2,
pitch: 55,
bearing: -18,
```

Terrain source:

```text
mapbox://mapbox.mapbox-terrain-dem-v1
```

Terrain exaggeration:

```ts
exaggeration: 1.4
```

Map controls:

* Navigation control at top-right.
* Compact attribution control at bottom-right.

Build check:

```bash
npm run build
```

Succeeded.

Commit created:

```text
Integrate Mapbox terrain map
```

Push completed.

Final status was clean.

---

## Completed Phase 2.1 — Mapbox Viewer Polish and Stability

Phase 2.1 is complete.

### Purpose

Phase 2.1 was an optimization and stability slice before moving into scenario logic.

It was not a new feature phase.

### Completed Changes

1. Confirmed `AppShell.tsx` imports `MapViewer` as a default import:

```ts
import MapViewer from './MapViewer'
```

2. Cleaned up `MapViewer.tsx` export style to use only:

```ts
export default MapViewer
```

3. Added a visible missing-token fallback UI.

If `VITE_MAPBOX_TOKEN` is missing, the map area now shows a readable setup message rather than leaving the app blank.

4. Preserved console error for developer troubleshooting:

```ts
console.error("Missing VITE_MAPBOX_TOKEN environment variable.")
```

5. Tightened the default map view from:

```ts
zoom: 8.2
```

to:

```ts
zoom: 10.2
```

The user confirmed `zoom: 10.2` is a good default starting point for a hunting/scouting scenario and is easy to modify later.

6. Ran local app.

Confirmed:

* ScoutNavigator shell loads.
* Mapbox map loads.
* Idaho terrain view is tighter and visually appropriate.
* Demo Mode disclaimer remains correct.
* No token/rendering errors.

7. Ran production build:

```bash
npm run build
```

Build succeeded.

The Mapbox bundle-size warning appeared again and remains non-blocking.

Commit created:

```text
Polish Mapbox viewer setup
```

Push completed.

Final status:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

## Recommended Next Phase

### Phase 3 — Scenario Engine

Status: **Next**

Start Phase 3 in a new chat using this updated context file.

Recommended Phase 3 approach:

1. Create TypeScript data models first.
2. Create curated Idaho scenario regions.
3. Keep region data simple and readable.
4. Wire the existing **Generate New Scenario** button to select a different region.
5. Move the Mapbox camera to the selected region.
6. Update the scenario name/description in the control panel.
7. Do not add pins until the scenario region switching works.
8. Run locally.
9. Build.
10. Commit and push.

### Phase 3 First Slice Recommendation

Start with these files:

```text
src/types/scout.ts
src/data/scenarioRegions.ts
```

Then minimally update:

```text
src/App.tsx or src/components/AppShell.tsx
src/components/ControlPanel.tsx
src/components/MapViewer.tsx
```

But do not overbuild.

The clean first deliverable should be:

* App loads an initial scenario region.
* **Generate New Scenario** changes the active scenario.
* Map camera flies to the new scenario region.
* Scenario card text updates.
* No pins yet.
* No feature candidates yet.
* No Pin Cleanup logic yet.

---

## Recommended Build Phases

### Phase 0 — Account and Tool Setup

Status: **Complete**

Set up:

* GitHub account
* Git installed locally
* Node.js installed locally
* VS Code
* Mapbox account
* Vercel account
* Local project folder
* GitHub repository

### Phase 1 — Project Scaffold

Status: **Complete**

Created:

* Vite React TypeScript app
* Tailwind setup
* Base ScoutNavigator layout
* Componentized shell
* ScoutNavigator README
* Updated context file

Success criteria met:

* `npm run dev` works.
* App opens locally.
* ScoutNavigator shell appears.
* GitHub repo is updated.
* Working tree is clean.

### Phase 2 — Mapbox Integration

Status: **Complete**

Created:

* Mapbox token setup.
* `.env` and `.env.example`.
* Confirmed `.env` is ignored.
* Installed Mapbox GL JS.
* Replaced placeholder map with real Mapbox map.
* Started the camera in Idaho.
* Preserved the existing ScoutNavigator shell.
* Ran locally.
* Fixed blank page import/export issue.
* Built successfully.
* Committed and pushed.

### Phase 2.1 — Mapbox Viewer Polish

Status: **Complete**

Created:

* Clean default export in `MapViewer.tsx`.
* Missing-token fallback UI.
* Tighter scouting-oriented default zoom.
* Production build verification.
* Commit and push.

### Phase 3 — Scenario Engine

Status: **Next**

Create:

* Core types.
* Curated Idaho scenario regions.
* Active scenario state.
* Generate New Scenario behavior.
* Map camera movement to new region.
* Scenario card updates.

Success criteria:

* App loads a default scenario.
* Generate New Scenario changes the active Idaho region.
* Map moves to the new Idaho region.
* Scenario panel updates.
* No simulated pins yet.
* Build passes.
* Git status is clean and pushed.

### Phase 4 — Scenario Pins and UI Panels

Create:

* Pin types and colors.
* Simulated pin generator.
* Pin markers on the map.
* Recent pins list tied to active scenario.
* Saved folders list tied to simulated state.

Success criteria:

* Pins render on the map.
* Pins show in the side panel.
* Scenario changes regenerate pins.
* UI resembles a light outdoor-nav product.

### Phase 5 — Pin Cleanup

Create:

* Weighted similarity engine.
* Recommendation cards.
* Why explanations.
* Hover highlight/pulse behavior.
* Accept grouping.
* Override folder.
* Save to localStorage.
* Dismiss recommendation.

Success criteria:

* User can run Pin Cleanup.
* 2–3 recommendations appear.
* Hovering highlights pins.
* Accepted folders persist after refresh.

### Phase 6 — Find Feature Terrains

Create:

* Structured feature selector.
* Candidate terrain highlighting.
* Spatial explanation.
* Optional Turf.js buffers or overlays.

Success criteria:

* User selects a feature type.
* Candidate matches appear on map.
* Explanation is shown.

### Phase 7 — Polish

Create:

* Improved spacing and layout.
* Better empty states.
* Better icons.
* Scenario labels.
* README screenshots.
* Demo script.
* Known limitations section.

Success criteria:

* App feels portfolio-ready.
* Reviewer can understand the value quickly.

### Phase 8 — Testing

Add tests for:

* scenarioEngine
* clusteringEngine
* spatialAnalysis
* folderStorage

Success criteria:

* Core utility logic has tests.
* Tests run successfully.

Testing is intentionally backlogged until after the app works.

### Phase 9 — Deployment

Deploy to Vercel.

Success criteria:

* Public URL works.
* Mapbox token configured in Vercel environment variables.
* GitHub README links to live demo.

### Phase 10 — Iteration

Potential future improvements:

* Add real GIS layers.
* Add public land overlay.
* Add trail/road-aware placement.
* Add natural-language prompt wrapper.
* Add export/import.
* Add screenshot/GIF demo.
* Add portfolio case study writeup.
* Add post-moonshot Ask Remi / terrain interpretation feature.

---

## Current Locked Decisions

* App name: ScoutNavigator.
* Positioning: Field Intelligence for Outdoor Nav.
* UI: Light OnX-inspired.
* Map: Mapbox GL JS.
* Language: TypeScript.
* Framework: React + Vite.
* Styling: Tailwind CSS.
* Spatial math: Turf.js.
* Persistence: localStorage.
* Backend: none for v1.
* Geography: Idaho.
* Scenario strategy: curated public-land/public-land-feeling regions.
* Terrain strategy: real map terrain plus simulated scenario intelligence.
* Primary feature: Pin Cleanup.
* Moonshot feature: Find Feature Terrains.
* Post-moonshot concept: Ask Remi / Remi-inspired scouting logic.
* Testing: backlog until after working demo.
* Code style: portfolio-readable.
* Build approach: small slices with clean commits.
* Default scenario map zoom: 10.2 for now.
* Feature Finder can use tighter zoom later.
* Middle control panel resizing/collapsing is backlogged.

---

## Important Product Guardrails

1. Do not overclaim AI.
2. Do not imply authoritative real terrain detection in v1.
3. Do not imply authoritative wildlife prediction in v1.
4. Do not imply real hunt recommendations or public-land legality validation in v1.
5. Do not auto-organize user data without confirmation.
6. Always keep the user in control.
7. Always explain the “why” behind recommendations.
8. Avoid brittle external dependencies beyond Mapbox.
9. Keep the app demo-friendly and reliable.
10. Keep code readable for portfolio review.
11. Use small build increments.
12. Keep the README honest about simulated data.
13. Avoid implying Remi Warren endorsement, voice, or licensed involvement unless explicitly authorized in the future.
14. Keep `.env` private and uncommitted.
15. Commit `.env.example` only with placeholder token text.

---

## How to Resume in a New Chat

Start a new chat and upload this `context.md` file.

Then use the prompt below.
