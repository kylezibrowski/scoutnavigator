# ScoutNavigator Context — Phase 0 Complete

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

The app uses real Mapbox terrain as the visual map foundation. For v1, scouting pins and terrain feature candidates are simulated by a scenario engine for demo reliability. The system must be honest about this through a subtle Demo Mode disclaimer.

---

## Demo Mode Disclaimer

The app should include a subtle disclaimer such as:

> Demo Mode: Scenarios use simulated scouting data over real Idaho terrain.

The app should not claim that it detects authoritative real-world saddles, benches, ridgelines, water sources, or animal activity from GIS/elevation datasets in v1.

The architecture should be designed so simulated features could later be replaced by real GIS, elevation-derived, or API-provided datasets.

---

## Target User Experience

### Initial Load

1. User opens app.
2. App loads a simulated Mountain West / Idaho scouting scenario.
3. Real Idaho terrain appears through Mapbox.
4. Scouting pins and scenario data are displayed.
5. The UI uses a light, OnX-inspired layout with a left rail and side content panel.

### Generate New Scenario

1. User clicks **Generate New Scenario**.
2. The map moves to a curated Idaho public-land region.
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

- Saddle
- Water
- Ridgeline
- Bench
- Wallow
- Bedding
- Food
- Glassing

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

## Technology Stack

Use:

- React
- Vite
- TypeScript
- Mapbox GL JS
- Turf.js
- Tailwind CSS
- Lucide React
- localStorage
- No backend for v1
- No database for v1
- No authentication for v1

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

- Map-first experience.
- Left vertical app rail.
- Large side content panel.
- Search/scenario controls near the top.
- Light cards with rounded corners.
- Orange or high-visibility primary actions.
- Clear saved folder hierarchy.
- High-visibility map pins.
- Floating map tools where useful.
- Real terrain / 3D terrain feel.

Do not copy onX branding, exact design, logos, or proprietary UI. Borrow only the general outdoor navigation workflow pattern.

---

## Pin Types for V1

V1 should support these pin types:

- Camp
- Sign
- Water
- Glassing Point
- Trail Camera
- Wallow
- Access Point
- Truck
- Food
- Bedding
- Blood
- Shot
- Deer
- Elk
- Generic Marker

Pin icons and colors should be visually distinct enough to support map scanning.

---

## Folder Naming Direction

Folder recommendations should use generic, realistic folder names.

Examples:

- Scouting North Zone
- Scouting Back Basin
- 2026 Elk Hunt
- Weekend Scouting Loop
- Spring Bear Notes
- Central Idaho Markups
- Creek Drainage Set
- Ridge Access Plan

Avoid overly specific or overly clever names.

---

## Geography

Constrain v1 to Idaho.

Use curated Idaho public-land or public-land-feeling regions rather than fully random statewide placement.

Potential regions:

- Boise National Forest
- Sawtooth / Stanley area
- Salmon-Challis region
- Payette National Forest / McCall region
- Clearwater / North Idaho
- Central Idaho mountain zones

The app should avoid pretending to provide authoritative hunt recommendations for specific real-world units.

---

## Terrain and Feature Realism

V1 should use:

- Real Mapbox terrain basemap.
- Simulated scouting pins.
- Simulated-but-plausible terrain feature candidates.

The scenario engine should avoid obviously unrealistic feature placement.

Examples:

- Water should not appear on obvious peaks.
- Wallows should tend to appear near water or lower drainage areas.
- Ridgelines should appear as line features and not random isolated points.
- Benches should appear partway up slope-like areas.
- Saddles should appear near pass/neck-down style areas.
- Camp/truck/access points should usually appear closer to roads, trailheads, or lower-access edges when possible.

Because v1 does not perform true elevation analysis, the app must be transparent that scenarios are simulated.

---

## Core Technical Architecture

Recommended project structure:

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── MapViewer.tsx
│   ├── ControlPanel.tsx
│   ├── GroupingPanel.tsx
│   ├── FeatureTerrainPanel.tsx
│   └── DemoDisclaimer.tsx
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

- ScenarioRegion
- ScoutScenario
- ScoutPin
- ScoutPinType
- TerrainFeature
- TerrainFeatureType
- Folder
- GroupingRecommendation
- RecommendationReason
- SpatialAnalysisResult
- SavedFolderState

Keep the data model clear and readable.

---

## Pin Cleanup Logic

Use a custom weighted similarity engine instead of K-Means or DBSCAN.

The recommendation engine should compare pins and generate grouping suggestions using:

- 50% proximity
- 30% time / season affinity
- 20% metadata context

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

The Mapbox token should be stored in an environment variable:

```text
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Do not hard-code the real token in source code.

Include an `.env.example` file:

```text
VITE_MAPBOX_TOKEN=replace_with_your_mapbox_token
```

Make sure `.env` is included in `.gitignore`.

---

## Build Philosophy

Build in small slices.

Do not try to generate the full app in one pass.

Each phase should produce a working local app before moving on.

Preferred workflow:

1. Generate code for a small slice.
2. Run locally.
3. Fix errors.
4. Commit working state.
5. Move to the next slice.

Use Git from the beginning.

---

## Completed Phase 0 — Account and Tool Setup

Phase 0 was completed from scratch.

### Accounts Created

- GitHub account created and verified.
- Mapbox account created.
- Vercel account created using GitHub login.

### Local Tools Installed and Verified

- Git installed:
  - `git version 2.50.1 (Apple Git-155)`
- Git identity configured:
  - `user.name=Kyle Zibrowski`
  - `user.email=[correct GitHub email]`
- Node.js installed:
  - `v24.16.0`
- npm installed:
  - `11.13.0`
- VS Code installed:
  - `1.122.1`
  - `arm64`
- VS Code `code` terminal command installed and verified.

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

`.gitignore` currently includes:

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# macOS
.DS_Store
```

Important reason:

- `.env` is ignored so the real Mapbox token will not be committed to GitHub.
- A future `.env.example` file should be committed with placeholder text only.

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

Initial push completed. GitHub authentication was handled through VS Code/GitHub authorization after Terminal password auth became confusing.

Verification output:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Remote verification:

```text
origin  https://github.com/kylezibrowski/scoutnavigator.git (fetch)
origin  https://github.com/kylezibrowski/scoutnavigator.git (push)
```

GitHub repo now shows:

```text
.gitignore
README.md
context.md
```

---

## Recommended Build Phases

### Phase 0 — Account and Tool Setup

Status: **Complete**

Set up:

- GitHub account
- Git installed locally
- Node.js installed locally
- VS Code
- Mapbox account
- Vercel account
- Local project folder
- GitHub repository

### Phase 1 — Project Scaffold

Status: **Next**

Create:

- Vite React TypeScript app
- Tailwind setup
- Base layout
- Initial `context.md`
- Basic README
- Git repo

Success criteria:

- `npm run dev` works.
- App opens locally.
- ScoutNavigator shell appears.

Important Phase 1 caution:

The folder and Git repo already exist. Scaffold Vite **inside the existing folder**:

```text
/Users/kylezibrowski/Projects/scoutnavigator
```

Do **not** create a nested folder like:

```text
/Users/kylezibrowski/Projects/scoutnavigator/scoutnavigator
```

### Phase 2 — Mapbox Integration

Create:

- Mapbox token setup.
- `.env` and `.env.example`.
- `MapViewer.tsx`.
- Initial Idaho map view.
- Terrain/pitched map feel.

Success criteria:

- Map loads locally.
- No token errors.
- Camera starts in Idaho.

### Phase 3 — Scenario Engine

Create:

- Curated Idaho scenario regions.
- Scenario generator.
- Pin generator.
- Simulated feature generator.

Success criteria:

- App loads a scenario.
- Generate New Scenario moves to a different Idaho region.
- New pins and features generate.

### Phase 4 — Map Pins and UI Panels

Create:

- Pin icons and colors.
- Left rail.
- Side panel.
- Folder list.
- Pin list.
- Demo Mode disclaimer.

Success criteria:

- Pins render on the map.
- Pins show in the side panel.
- UI resembles a light outdoor-nav product.

### Phase 5 — Pin Cleanup

Create:

- Weighted similarity engine.
- Recommendation cards.
- Why explanations.
- Hover highlight/pulse behavior.
- Accept grouping.
- Override folder.
- Save to localStorage.
- Dismiss recommendation.

Success criteria:

- User can run Pin Cleanup.
- 2–3 recommendations appear.
- Hovering highlights pins.
- Accepted folders persist after refresh.

### Phase 6 — Find Feature Terrains

Create:

- Structured feature selector.
- Candidate terrain highlighting.
- Spatial explanation.
- Optional Turf.js buffers or overlays.

Success criteria:

- User selects a feature type.
- Candidate matches appear on map.
- Explanation is shown.

### Phase 7 — Polish

Create:

- Improved spacing and layout.
- Better empty states.
- Better icons.
- Scenario labels.
- README screenshots.
- Demo script.
- Known limitations section.

Success criteria:

- App feels portfolio-ready.
- Reviewer can understand the value quickly.

### Phase 8 — Testing

Add tests for:

- scenarioEngine
- clusteringEngine
- spatialAnalysis
- folderStorage

Success criteria:

- Core utility logic has tests.
- Tests run successfully.

### Phase 9 — Deployment

Deploy to Vercel.

Success criteria:

- Public URL works.
- Mapbox token configured in Vercel environment variables.
- GitHub README links to live demo.

### Phase 10 — Iteration

Potential future improvements:

- Add real GIS layers.
- Add public land overlay.
- Add trail/road-aware placement.
- Add natural-language prompt wrapper.
- Add export/import.
- Add screenshot/GIF demo.
- Add portfolio case study writeup.

---

## Current Locked Decisions

- App name: ScoutNavigator.
- Positioning: Field Intelligence for Outdoor Nav.
- UI: Light OnX-inspired.
- Map: Mapbox GL JS.
- Language: TypeScript.
- Framework: React + Vite.
- Styling: Tailwind CSS.
- Spatial math: Turf.js.
- Persistence: localStorage.
- Backend: none for v1.
- Geography: Idaho.
- Scenario strategy: curated public-land regions.
- Terrain strategy: real map terrain plus simulated scenario intelligence.
- Primary feature: Pin Cleanup.
- Moonshot feature: Find Feature Terrains.
- Testing: backlog until after working demo.
- Code style: portfolio-readable.

---

## Important Product Guardrails

1. Do not overclaim AI.
2. Do not imply authoritative real terrain detection in v1.
3. Do not auto-organize user data without confirmation.
4. Always keep the user in control.
5. Always explain the “why” behind recommendations.
6. Avoid brittle external dependencies beyond Mapbox.
7. Keep the app demo-friendly and reliable.
8. Keep code readable for portfolio review.
9. Use small build increments.
10. Keep the README honest about simulated data.

---

## How to Resume in a New Chat

Start a new chat and paste/upload this context file, then say:

> Continue the ScoutNavigator build from this context. We completed Phase 0 and are starting Phase 1. Walk me through the next steps slowly, assuming I am comfortable with the terminal but need commands explained clearly.

Phase 1 should begin by scaffolding the Vite React TypeScript app inside the existing local folder:

```text
/Users/kylezibrowski/Projects/scoutnavigator
```

Do not create a second nested `scoutnavigator` folder.
