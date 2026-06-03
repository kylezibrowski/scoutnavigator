# ScoutNavigator Context — Phase 1 Complete

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

Current disclaimer language:

> Scenarios use simulated scouting data layered over real Idaho terrain.

The app should not claim that it detects authoritative real-world saddles, benches, ridgelines, water sources, animal activity, public-land legality, or hunt recommendations from GIS/elevation datasets in v1.

The architecture should be designed so simulated features could later be replaced by real GIS, elevation-derived, or API-provided datasets.

---

## Target User Experience

### Initial Load

1. User opens app.
2. App loads a simulated Mountain West / Idaho scouting scenario.
3. Real Idaho terrain appears through Mapbox.
4. Scouting pins and scenario data are displayed.
5. The UI uses a light, OnX-inspired layout with a left rail and side content panel.
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

### Ask Remi

The user wants to add a future LLM-driven feature concept after Feature Finder.

Working concept:

**Ask Remi** would review highlighted terrain and feature candidates and suggest the kinds of areas an experienced backcountry hunter might focus on first.

Example logic:

* A bench on a north-facing slope with a saddle within half a mile may suggest a travel corridor toward bedding.
* Water near cover and lower drainage terrain may support a wallow/bedding interpretation.
* Glassing points may be prioritized based on visibility into adjacent benches, saddles, and feeding zones.

The user specifically mentioned Remi Warren because Remi has written and spoken extensively about using mapping software for scouting and backcountry hunting strategy.

Important future clarifications before building this:

1. Decide whether to use the name **Ask Remi** directly or use safer framing such as **Remi-inspired scouting logic**.
2. Avoid implying Remi Warren’s actual endorsement, voice, private knowledge, or participation unless licensed/authorized.
3. Determine whether public writings can be used only as general inspiration or whether a source-permission/RAG approach is needed.
4. Determine whether the feature is framed as educational, demo-only, or tactical.
5. Determine whether the output should cite authorized sources.
6. Define the feature inputs: selected terrain candidates, slope/aspect, distance between features, pin types, season, target species, prior user pins, and scenario context.
7. Keep all outputs honest and avoid authoritative wildlife prediction claims.

This is not part of v1. Capture it in future roadmap context.

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

This is backlogged and should not block Phase 2.

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

## Core Technical Architecture

Current structure after Phase 1:

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

`.env` should never be committed to GitHub.

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
5. Push to GitHub.
6. Move to the next slice.

Use Git from the beginning.

---

## Completed Phase 0 — Account and Tool Setup

Phase 0 was completed from scratch.

### Accounts Created

* GitHub account created and verified.
* Mapbox account created.
* Vercel account created using GitHub login.

### Local Tools Installed and Verified

* Git installed:

  * `git version 2.50.1 (Apple Git-155)`
* Git identity configured:

  * `user.name=Kyle Zibrowski`
  * `user.email=[correct GitHub email]`
* Node.js installed:

  * `v24.16.0`
* npm installed:

  * `11.13.0`
* VS Code installed:

  * `1.122.1`
  * `arm64`
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

`.gitignore` currently includes environment exclusions for `.env`, `.env.local`, and `.env.*.local`.

Important reason:

* `.env` is ignored so the real Mapbox token will not be committed to GitHub.
* A future `.env.example` file should be committed with placeholder text only.

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

`vite.config.ts` now uses:

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
* Right-side map/terrain placeholder.
* Example colored pin markers.
* Phase 1 map placeholder label.

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

### Current Git Status

Final verified status after Phase 1:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

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

Status: **Next**

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

### Phase 3 — Scenario Engine

Create:

* Curated Idaho scenario regions.
* Scenario generator.
* Pin generator.
* Simulated feature generator.

Success criteria:

* App loads a scenario.
* Generate New Scenario moves to a different Idaho region.
* New pins and features generate.

### Phase 4 — Map Pins and UI Panels

Create:

* Pin icons and colors.
* Folder list.
* Pin list.
* Demo Mode disclaimer integration with scenario data.

Success criteria:

* Pins render on the map.
* Pins show in the side panel.
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

---

## How to Resume in a New Chat

Start a new chat and paste/upload this context file, then say:

> Continue the ScoutNavigator build from this context. We completed Phase 1 and are starting Phase 2 Mapbox Integration. Walk me through the next steps slowly, assuming I am comfortable with the terminal but need commands explained clearly.

Phase 2 should begin by setting up the Mapbox token safely:

1. Create `.env` with the real token.
2. Create `.env.example` with placeholder text.
3. Confirm `.env` is ignored by Git.
4. Install Mapbox GL JS.
5. Replace the map placeholder in `MapViewer.tsx` with a real Mapbox map.
6. Start the camera in Idaho.
7. Preserve the existing ScoutNavigator shell.
8. Run locally.
9. Fix any errors.
10. Commit and push a working Mapbox integration.
