# ScoutNavigator Context — Phase 3 Complete

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
2. App loads a simulated Idaho scouting scenario.
3. Real Idaho terrain appears through Mapbox.
4. Scenario metadata appears in the control panel and map overlay.
5. Scouting pins and scenario data will be displayed in the next phase.
6. The UI uses a light, OnX-inspired layout with a left rail and side content/control panel.
7. The app clearly communicates that the scenario data is simulated.

### Generate New Scenario

Current Phase 3 behavior:

1. User clicks **Generate New Scenario**.
2. The app cycles to the next curated Idaho scenario region.
3. The map camera flies to that selected region.
4. The scenario card text updates.
5. The floating map overlay updates to show the active scenario.
6. No pins are added yet.

Backlogged future behavior:

* Change Generate New Scenario from deterministic cycling to a random scenario generator that selects a different region.
* Keep current cycling behavior for Phase 3 because it is predictable and easy to test.

### Pin Cleanup

Future Phase 5 behavior:

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

Pin Cleanup must never automatically reorganize the user’s data. It recommends, explains, and waits for user confirmation.

### Find Feature Terrains

Future Phase 6 behavior:

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

This is backlogged and should not block Phase 4.

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

Current Phase 3 curated scenario regions:

1. Boise National Forest
2. Sawtooth / Stanley Area
3. Payette National Forest / McCall
4. Salmon-Challis Region
5. Southwest Idaho Region
6. Panhandle / Lolo Region

The app should avoid pretending to provide authoritative hunt recommendations for specific real-world units.

The Southwest Idaho Region is inspired by terrain that may feel similar to areas around Idaho hunt areas 54, 55, and 56, but should not be framed as authoritative unit guidance.

The Panhandle / Lolo Region can nod toward North Idaho and Lolo-style terrain, but should not claim to provide authoritative Lolo Zone hunt recommendations.

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

Current structure after Phase 3:

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── ControlPanel.tsx
│   ├── DemoDisclaimer.tsx
│   ├── LeftRail.tsx
│   └── MapViewer.tsx
├── data/
│   └── scenarioRegions.ts
├── types/
│   └── scout.ts
├── utils/
│   └── scenarioEngine.ts
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

Current Phase 3 models in `src/types/scout.ts`:

```ts
export type MapCamera = {
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
}

export type ScenarioRegion = {
  id: string
  name: string
  subtitle: string
  description: string
  terrainNotes: string
  primaryUseCase: string
  camera: MapCamera
}
```

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

## Scenario Engine

Phase 3 created:

```text
src/types/scout.ts
src/data/scenarioRegions.ts
src/utils/scenarioEngine.ts
```

Current scenario engine behavior:

* App loads the first scenario from `scenarioRegions`.
* Active scenario state lives in `AppShell.tsx`.
* `ControlPanel` receives the active scenario and displays its metadata.
* `MapViewer` receives the active scenario and uses its camera settings.
* Clicking **Generate New Scenario** uses `getNextScenario` from `scenarioEngine.ts`.
* The button cycles through the curated Idaho regions in order.
* Mapbox camera flies to the selected region.
* Floating map overlay displays the active scenario name.
* No pins have been added yet.

Current helper:

```ts
export function getNextScenario(
  scenarios: ScenarioRegion[],
  currentScenario: ScenarioRegion,
) {
  const currentIndex = scenarios.findIndex(
    (scenario) => scenario.id === currentScenario.id,
  )

  const nextIndex = (currentIndex + 1) % scenarios.length

  return scenarios[nextIndex]
}
```

Backlog:

* Add random scenario selection later.
* It should choose a different region from the current active region.
* Keep deterministic cycling for now because it is easier to test.

---

## Current Scenario Regions

Current file:

```text
src/data/scenarioRegions.ts
```

The app currently includes six curated Idaho regions:

### Boise National Forest

* ID: `boise-national-forest`
* Use case: Elk scouting and access planning
* Terrain: mixed timber, drainages, ridge access east of Boise

### Sawtooth / Stanley Area

* ID: `sawtooth-stanley`
* Use case: High-country glassing and route planning
* Terrain: high-country basins, alpine relief, ridgelines, benches

### Payette National Forest / McCall

* ID: `mccall-payette`
* Use case: Spring bear notes and elk preseason scouting
* Terrain: timbered mountain country, lakes, creek systems, access corridors

### Salmon-Challis Region

* ID: `salmon-challis`
* Use case: Backcountry scouting and multi-day planning
* Terrain: remote central Idaho terrain, steep drainages, exposed ridges

### Southwest Idaho Region

* ID: `southwest-idaho`
* Use case: Mule deer scouting and glassing routes
* Terrain: open desert breaks, canyon country, sagebrush foothills, rimrock

### Panhandle / Lolo Region

* ID: `panhandle-lolo`
* Use case: Elk scouting in timbered mountain terrain
* Terrain: North Idaho timber, steep drainages, dense cover, creek bottoms

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

`MapViewer.tsx` renders a real Mapbox map using:

* `mapbox-gl`
* Mapbox outdoors style
* Mapbox DEM terrain source
* Terrain exaggeration
* Fog
* Navigation control
* Compact attribution control
* Active scenario camera

Map style:

```text
mapbox://styles/mapbox/outdoors-v12
```

Terrain source:

```text
mapbox://mapbox.mapbox-terrain-dem-v1
```

Terrain exaggeration:

```ts
exaggeration: 1.4
```

Current scenario camera pattern:

```ts
center: activeScenario.camera.center,
zoom: activeScenario.camera.zoom,
pitch: activeScenario.camera.pitch,
bearing: activeScenario.camera.bearing,
```

Current scenario-change behavior:

```ts
mapRef.current.flyTo({
  center: activeScenario.camera.center,
  zoom: activeScenario.camera.zoom,
  pitch: activeScenario.camera.pitch,
  bearing: activeScenario.camera.bearing,
  duration: 1200,
  essential: true,
})
```

The user confirmed `zoom: 10.2` is a good default scenario starting point.

Notes:

* `zoom: 8.2` felt too broad, roughly a large regional view.
* `zoom: 10.2` feels more appropriate for a hunting/scouting scenario.
* Feature Finder may eventually use a tighter view, likely around zoom 11–12+ depending on feature type and screen size.

`MapViewer.tsx` also has a visible missing-token fallback UI that tells the user to add `VITE_MAPBOX_TOKEN` to `.env`.

The floating map overlay now shows:

* Active Scenario
* Active scenario name
* “Simulated scouting context over real Idaho terrain.”

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

Do not address this yet. It is a future polish/performance item, not a Phase 4 blocker.

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

* Git identity configured.
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

`.gitignore` includes environment exclusions for:

```text
.env
.env.local
.env.*.local
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

---

## Completed Phase 1 — Project Scaffold and Shell

Phase 1 is complete.

Created:

* Vite React TypeScript app
* Tailwind setup
* Base ScoutNavigator layout
* Componentized shell
* ScoutNavigator README

Success criteria met:

* `npm run dev` works.
* App opens locally.
* ScoutNavigator shell appears.
* GitHub repo is updated.
* Working tree is clean.

Current Phase 1 components:

```text
src/components/
├── AppShell.tsx
├── ControlPanel.tsx
├── DemoDisclaimer.tsx
├── LeftRail.tsx
└── MapViewer.tsx
```

The shell includes:

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

---

## Completed Phase 2 — Mapbox Integration

Phase 2 is complete.

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

---

## Completed Phase 2.1 — Mapbox Viewer Polish and Stability

Phase 2.1 is complete.

Completed:

1. Confirmed `AppShell.tsx` imports `MapViewer` as a default import.
2. Cleaned up `MapViewer.tsx` export style to use only `export default MapViewer`.
3. Added visible missing-token fallback UI.
4. Preserved console error for developer troubleshooting.
5. Tightened default map view from `zoom: 8.2` to `zoom: 10.2`.
6. Ran local app.
7. Confirmed map loads and view feels appropriate.
8. Ran production build.
9. Committed and pushed.

---

## Completed Phase 3 — Scenario Engine

Phase 3 is complete.

### Phase 3 Goals

Create:

* Core TypeScript data models.
* Curated Idaho scenario regions.
* Active scenario state.
* Generate New Scenario behavior.
* Map camera movement to new region.
* Scenario card updates.
* Floating map overlay update.

Success criteria:

* App loads a default scenario.
* Generate New Scenario changes the active Idaho region.
* Map moves to the new Idaho region.
* Scenario panel updates.
* Floating map overlay updates.
* No simulated pins yet.
* Build passes.
* Git status is clean and pushed.

All criteria were met.

### Phase 3 Files Created

```text
src/types/scout.ts
src/data/scenarioRegions.ts
src/utils/scenarioEngine.ts
```

### Phase 3 Files Updated

```text
src/components/AppShell.tsx
src/components/ControlPanel.tsx
src/components/MapViewer.tsx
```

### Phase 3 Behavior

The app now:

1. Loads the first scenario from `scenarioRegions`.
2. Stores active scenario state in `AppShell`.
3. Passes the active scenario into `ControlPanel`.
4. Passes the active scenario into `MapViewer`.
5. Cycles through six curated Idaho regions when the user clicks **Generate New Scenario**.
6. Flies the Mapbox camera to the selected region.
7. Updates the scenario card text.
8. Updates the floating map overlay.
9. Keeps all scouting data honest as simulated.
10. Does not render pins yet.

### Phase 3 Commits

Completed and pushed:

```text
Add scenario region engine
Extract scenario engine helper
Show active scenario on map overlay
```

---

## Recommended Next Phase

### Phase 4 — Scenario Pins and UI Panels

Status: **Next**

Phase 4 should add simulated pins tied to the active scenario.

Recommended Phase 4 approach:

1. Extend `src/types/scout.ts` with:

   * `ScoutPinType`
   * `ScoutPin`
   * Possibly `ScenarioPinSet` or add pins to generated scenario output later.
2. Create simple pin data or a deterministic pin generator.
3. Keep pins simulated and scenario-relative.
4. Render pins on the Mapbox map.
5. Update Recent Pins list to use active scenario pins instead of static placeholders.
6. Keep Saved Folders static or lightly scenario-aware for now.
7. Do not start Pin Cleanup logic yet.
8. Run locally.
9. Build.
10. Commit and push.

### Phase 4 First Slice Recommendation

Start with:

```text
src/types/scout.ts
src/utils/scenarioEngine.ts
```

Then update:

```text
src/components/AppShell.tsx
src/components/ControlPanel.tsx
src/components/MapViewer.tsx
```

Clean first deliverable:

* Each active scenario has a small set of simulated pins.
* Pins render on the map.
* Recent Pins updates based on active scenario.
* Scenario switching regenerates or changes pins.
* No Pin Cleanup logic yet.
* No Feature Finder yet.

### Phase 4 Pin Strategy Recommendation

Use a deterministic generator first, not full randomization.

Reason:

* Easier to test.
* Easier to explain.
* Easier to debug.
* Better for portfolio reviewers because the demo behaves consistently.

Possible strategy:

* Each scenario gets 6–10 simulated pins.
* Pins are created around the scenario camera center using small coordinate offsets.
* Pin types should be plausible for the region.
* Keep pins visually obvious.
* Use simple Mapbox markers first before building custom layers.

Possible first pin types:

* Camp
* Sign
* Water
* Glassing Point
* Trail Camera
* Wallow
* Access Point
* Bedding

Do not overbuild clustering, folders, or cleanup yet.

---

## Recommended Build Phases

### Phase 0 — Account and Tool Setup

Status: **Complete**

### Phase 1 — Project Scaffold

Status: **Complete**

### Phase 2 — Mapbox Integration

Status: **Complete**

### Phase 2.1 — Mapbox Viewer Polish

Status: **Complete**

### Phase 3 — Scenario Engine

Status: **Complete**

Created:

* Core types.
* Curated Idaho scenario regions.
* Scenario engine helper.
* Active scenario state.
* Generate New Scenario behavior.
* Map camera movement to new region.
* Scenario card updates.
* Floating map overlay updates.

### Phase 4 — Scenario Pins and UI Panels

Status: **Next**

Create:

* Pin types and colors.
* Simulated pin generator or deterministic pin sets.
* Pin markers on the map.
* Recent pins list tied to active scenario.
* Saved folders list tied to simulated state.

Success criteria:

* Pins render on the map.
* Pins show in the side panel.
* Scenario changes update pins.
* UI resembles a light outdoor-nav product.
* No Pin Cleanup logic yet.

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

* Add random scenario generation.
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
* Current scenario behavior: deterministic cycling.
* Random scenario behavior: backlogged.
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

Then use this prompt:

```text
Continue the ScoutNavigator build from the uploaded context.md file.

We completed Phase 0, Phase 1, Phase 2, Phase 2.1, and Phase 3.

We are starting Phase 4: Scenario Pins and UI Panels.

Walk me through the next steps slowly, assuming I am comfortable with the terminal but need commands and file changes explained clearly.

Important working style:

* Keep this hand-held and step-by-step.
* Do not jump ahead or collapse multiple actions into vague instructions.
* Explain what each command or file change does in plain English.
* Pause after small chunks so I can confirm before moving forward.
* Build in small slices, run locally, fix errors, run build when appropriate, commit, push, and then continue.
* Before any commit, help me confirm the app works and git status looks right.
* Do not create a nested scoutnavigator/scoutnavigator folder.
* The project lives at /Users/kylezibrowski/Projects/scoutnavigator.
* Preserve the existing ScoutNavigator shell and Mapbox map.
* Keep the app honest that scouting data is simulated.
* The Demo Mode disclaimer should remain: “Scenarios use simulated scouting data layered over real Idaho terrain.”
* The middle control panel may eventually become smaller, collapsible, or semi-transparent, but that is backlogged and should not block Phase 4.

Phase 4 should start with simulated scenario pins:

1. Extend the TypeScript data models for ScoutPin and ScoutPinType.
2. Add deterministic simulated pin data or a simple deterministic pin generator.
3. Tie pins to the active scenario.
4. Render pins on the Mapbox map.
5. Update Recent Pins to use active scenario pins instead of static placeholders.
6. Do not start Pin Cleanup logic yet.
7. Do not start Feature Finder yet.
8. Run locally and verify pins update with scenario switching.
9. Fix errors.
10. Commit and push only after the working pin slice is confirmed.
```
