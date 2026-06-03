# ScoutNavigator Context — Phase 4 Continuation

## Project Name

**ScoutNavigator**

## Product Positioning

**Field Intelligence for Outdoor Nav**

ScoutNavigator is a portfolio demo web mapping application designed to demonstrate geospatial product thinking, client-side spatial analysis, and outdoor navigation workflow design.

The intended audience is hiring managers, product leaders, and engineering teams at outdoor navigation and mapping companies such as onX, goHUNT, and adjacent outdoor/geospatial software companies.

The app should feel like a credible outdoor navigation product demo, not a toy app or generic map tutorial.

---

## Project Path

Local project folder:

```text
/Users/kylezibrowski/Projects/scoutnavigator
```

Do **not** create a nested `scoutnavigator/scoutnavigator` folder.

---

## Current Phase

We are in:

```text
Phase 4 — Scenario Pins and UI Panels
```

Phase 4 is partially complete and should continue from the current working codebase.

Completed phases:

```text
Phase 0 — Account and tool setup
Phase 1 — Project scaffold and shell
Phase 2 — Mapbox integration
Phase 2.1 — Mapbox viewer polish and stability
Phase 3 — Scenario engine
Phase 4 partial — Scenario pins, map rendering, recent pins, Add Pin mode, user pin save flow
```

---

## Current Strategic Objective

Continue building a standalone, interactive web mapping app that shows:

1. Strong geospatial product instincts.
2. Practical frontend mapping implementation.
3. User-respecting recommendation workflows.
4. Transparent spatial logic.
5. A polished, portfolio-readable codebase.
6. A demo that can be opened by a reviewer and understood within 30 seconds.

The app uses real Mapbox terrain as the visual map foundation. For v1, scouting pins and terrain intelligence remain simulated for demo reliability.

---

## Demo Mode Disclaimer

This disclaimer should remain visible:

```text
Scenarios use simulated scouting data layered over real Idaho terrain.
```

The app must stay honest that simulated scouting data is not authoritative real terrain detection, wildlife prediction, public-land legality validation, or hunt recommendation logic.

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
* localStorage eventually
* No backend for v1
* No database for v1
* No authentication for v1

---

## Current Technical Architecture

Current structure:

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

---

## Current Scenario Regions

The app has six curated Idaho scenario regions:

1. Boise National Forest
2. Sawtooth / Stanley Area
3. Payette National Forest / McCall
4. Salmon-Challis Region
5. Southwest Idaho Region
6. Panhandle / Lolo Region

Current behavior:

* App loads the first scenario.
* Clicking **Generate New Scenario** deterministically cycles through the scenario list.
* The map camera flies to the selected region.
* Scenario metadata updates in the control panel and map overlay.
* Random scenario generation remains backlogged.

---

## Mapbox Implementation

`MapViewer.tsx` renders a Mapbox map using:

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

Mapbox token:

```text
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

The real token lives in `.env`, which is ignored by Git.

`.env.example` contains only:

```text
VITE_MAPBOX_TOKEN=replace_with_your_mapbox_token
```

Build warning:

`npm run build` succeeds but shows the known Mapbox chunk-size warning because `mapbox-gl` is large. This is not a blocker.

---

## Current Data Models

`src/types/scout.ts` now includes:

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

export type ScoutPinType =
  | 'camp'
  | 'sign'
  | 'water'
  | 'glassing-point'
  | 'trail-camera'
  | 'wallow'
  | 'access-point'
  | 'truck'
  | 'food'
  | 'bedding'
  | 'blood'
  | 'shot'
  | 'deer'
  | 'elk'
  | 'generic-marker'

export type ScoutPinSource = 'simulated' | 'user'

export type ScoutPin = {
  id: string
  scenarioId: string
  name: string
  type: ScoutPinType
  coordinates: [number, number]
  notes: string
  observedAt: string
  source: ScoutPinSource
}

export type UserPinDraft = {
  name: string
  type: ScoutPinType
  notes: string
}
```

---

## Completed Phase 4 Work

### 1. Scout pin models added

Added:

* `ScoutPinType`
* `ScoutPinSource`
* `ScoutPin`
* `UserPinDraft`

Pin type is currently metadata only. All pins use a single shared visual marker style for MVP.

---

### 2. Simulated scenario pins added

`src/utils/scenarioEngine.ts` now generates simulated scenario pins.

The initial six-pin shared pattern was replaced with scenario-specific simulated pin sets.

Then the generator was expanded to create deterministic pseudo-random pin counts between:

```text
minimum: 6
maximum: 30
```

Important behavior:

* Pin counts vary by scenario.
* Pin layouts are deterministic and stable.
* Pins do not reshuffle every render.
* Scenario-specific base pins are combined with supplemental deterministic pins.
* This gives enough density to later test Pin Cleanup without starting Pin Cleanup logic yet.

Known realism note:

* Some simulated pins may still land on terrain that is not perfectly realistic.
* True terrain-aware placement is not implemented yet.
* Later improvement could use scenario-specific placement zones or real GIS/elevation-derived filtering.
* The app remains honest that pins are simulated.

---

### 3. Pins render on the Mapbox map

`MapViewer.tsx` now renders all `activeScenarioPins` on the Mapbox map.

Current marker style:

```text
single shared orange circular marker
white border
white center dot
```

There are no type-specific marker colors or icons yet.

This was intentional for MVP simplicity. Pin type is shown in metadata, not visual style.

Mapbox marker hover jitter was fixed by removing Tailwind transform-based hover scaling. Mapbox uses CSS transforms for marker placement, so `hover:scale-110` caused markers to jump.

---

### 4. Marker popups added

Clicking a marker opens a popup showing:

* Pin type
* Pin name
* Notes
* Source
* Observed date

The popup currently uses simple Mapbox popup HTML.

---

### 5. Recent Pins wired to active pins

`ControlPanel.tsx` no longer uses static placeholder recent pins.

Recent Pins now uses:

```text
activeScenarioPins
```

Behavior:

* Recent Pins count matches map overlay count.
* Recent Pins changes with the active scenario.
* User-created pins appear in Recent Pins during the session.
* Recent Pins shows `SIMULATED` or `USER` based on `pin.source`.

---

### 6. Add Pin mode added

`AppShell.tsx` owns:

```ts
isAddingPin
pendingPinCoordinates
userPins
```

Current Add Pin behavior:

1. User clicks **Add Pin** in the middle control panel.
2. Add Pin mode becomes active.
3. Map overlay shows Add Pin mode.
4. User clicks the map.
5. App captures pending coordinates.
6. A pending black/orange marker appears on the map.
7. ControlPanel shows pending longitude/latitude.
8. A user pin metadata form currently appears in ControlPanel.
9. User enters name, type, and notes.
10. Saving creates a `ScoutPin` with `source: 'user'`.
11. User-created pin is tied to the active scenario only.
12. User-created pin appears on map and in Recent Pins.
13. User-created pins persist only in React state for the current session.

Current AppShell concept:

```text
activeScenarioPins =
  simulated pins for active scenario
  +
  user pins where pin.scenarioId === activeScenario.id
```

No localStorage yet.

---

## Current UX Issue To Fix Next

The Add Pin metadata form currently lives in the scrollable middle `ControlPanel`.

This creates a bad UX:

```text
User clicks map to place a pin
↓
User has to scroll down in the side panel
↓
User loses visual context of the map location
```

The desired behavior is closer to an onX-style waypoint editor:

```text
User clicks map
Pending marker appears
Metadata editor stays visually connected to the map
```

Do not copy onX branding or UI exactly. Use it only as product inspiration.

---

## Next Task

Move the Add Pin metadata form out of `ControlPanel` and into a floating map panel inside `MapViewer`.

### Desired behavior

* `ControlPanel` keeps the Add Pin / Cancel Add Pin card.
* `ControlPanel` may still show pending coordinates.
* `ControlPanel` should no longer contain the full metadata form.
* `MapViewer` should show a floating **New Pin** form when:

  ```text
  isAddingPin === true
  pendingPinCoordinates exists
  ```
* The floating map form should allow:

  * Pin Name
  * Pin Type dropdown
  * Notes
  * Save Pin
  * Cancel
* The floating form should call:

  ```ts
  onSaveUserPin(pinDraft: UserPinDraft)
  ```
* Cancel should clear pending coordinates and exit Add Pin mode through existing `onCancelAddingPin`.
* Save should create the user pin and exit Add Pin mode through existing AppShell behavior.
* Keep the form simple and stable first.
* Do not try to perfectly anchor it to the marker yet.
* A floating map card is good enough for this next slice.

Suggested location for first version:

```text
floating card inside MapViewer, maybe left/bottom or right/bottom within map area
```

Avoid blocking core Mapbox controls.

---

## Important Current UX/Layout Note

After the most recent form work, the app can require vertical scrolling, and the user can lose the map while editing the pin form.

Later layout polish should move toward:

```text
left rail fixed
middle control panel scrolls
map stays fully visible
```

But the immediate next task is to move the Add Pin metadata form into `MapViewer`.

---

## Current Left Rail Status

Left rail labels remain mostly visual placeholders:

```text
Map
Pins
Folders
Tools
```

Clicking **Pins** does not yet change the middle panel. This is expected.

Backlog:

```text
Left rail navigation
- Map tab shows scenario controls and map-focused workflow.
- Pins tab could eventually show a full pin manager.
- Folders tab could eventually show saved folders and accepted cleanup groups.
- Tools tab could eventually show Pin Cleanup and Feature Finder.
```

Do not start left rail navigation yet unless explicitly requested.

---

## Current Backlog / Not Yet Started

Do not start these until asked:

* Pin Cleanup logic
* Feature Finder
* localStorage persistence
* Left rail navigation
* Type-specific marker icons/colors
* Exact marker-anchored editor
* True terrain analysis
* Public land or legality validation
* Real GIS data integration
* Random scenario switching
* Tests

---

## Pin Cleanup Future Direction

Future Phase 5 should use a custom weighted similarity engine, not K-Means or DBSCAN.

Recommendation weighting:

```text
50% proximity
30% time / season affinity
20% metadata context
```

Pin Cleanup must:

* Recommend groupings.
* Explain why.
* Let user accept/dismiss.
* Let user override folder destination.
* Never automatically reorganize user data.

Example explanation:

```text
Why this grouping?
- Pins are clustered within 0.6 miles.
- Most were dropped within 9 days of each other.
- Sign, water, and bedding markers suggest a related scouting pattern.
- Confidence: 84%.
```

---

## Feature Finder Future Direction

Future Phase 6 should start as a structured selector, not a natural-language prompt.

Feature types may include:

* Saddle
* Water
* Ridgeline
* Bench
* Wallow
* Bedding
* Food
* Glassing

The system should highlight simulated-but-plausible terrain candidates and explain why.

Do not start Feature Finder yet.

---

## Build Philosophy

Work in small slices.

Preferred workflow:

1. Make one small code change.
2. Run `npm run build`.
3. Run locally with `npm run dev`.
4. Visually confirm.
5. Fix errors.
6. Commit and push only after a working checkpoint.

Before commits:

* Confirm local app works.
* Confirm `npm run build` passes.
* Confirm `.env` is not listed in `git status`.
* Confirm only intended files are staged.

---

## User Working Style Preference

The user wants a hand-held build process.

Important:

* Go slowly.
* Do not collapse multiple actions into vague instructions.
* Explain what each command or file change does in plain English.
* Pause after small chunks.
* Ask for file contents/screenshots when needed instead of guessing.
* Do not jump ahead.
* Do not start Pin Cleanup or Feature Finder yet.
* Preserve the existing ScoutNavigator shell and Mapbox map.
* Keep all demo data honest as simulated.
* Keep code portfolio-readable.

---

## Last Known Good Checkpoints

Recent commits completed before this context update included:

* Render simulated scenario pins
* Show active scenario pins in Recent Pins
* Add scenario-specific simulated pins
* Generate varied simulated scenario pins
* Add pin creation mode UI
* Capture pending pin location
* Save user-created pins with metadata

The current working state should be committed and pushed before continuing.

---

## Prompt To Start Next Chat

Use this prompt with this updated `context.md`:

```text
Continue the ScoutNavigator Phase 4 build from the uploaded context.md file.

Project path:
/Users/kylezibrowski/Projects/scoutnavigator

We are continuing Phase 4: Scenario Pins and UI Panels.

The immediate next task is to improve the Add Pin UX.

Current issue:
The Add Pin metadata form currently lives in the scrollable middle ControlPanel. When the user clicks the map to place a pin, they may have to scroll down and lose the map context.

Next task:
Move the Add Pin metadata form out of ControlPanel and into a floating map panel inside MapViewer.

Desired behavior:
- ControlPanel keeps the Add Pin / Cancel Add Pin card.
- ControlPanel may still show pending coordinates.
- ControlPanel should not contain the full pin metadata form.
- MapViewer shows a floating “New Pin” form when isAddingPin is true and pendingPinCoordinates exists.
- The floating form includes Pin Name, Pin Type, Notes, Save Pin, and Cancel.
- The floating form calls onSaveUserPin with UserPinDraft.
- Cancel uses the existing onCancelAddingPin flow.
- Save should create the user pin and exit Add Pin mode using the existing AppShell behavior.
- Keep the form simple and stable first; do not anchor it exactly to the marker yet.
- Do not start localStorage.
- Do not start Pin Cleanup.
- Do not start Feature Finder.

Important working style:
- Walk me through this slowly.
- Use small slices.
- Explain where code goes based on my actual files.
- Pause after each small chunk.
- Expect me to paste code/screenshots if something looks different.
- Run build after each meaningful change.
- Commit and push only after the refactor is working.
```
