# ScoutNavigator Context — Phase 5 Pin Cleanup

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

We are moving into:

```text
Phase 5 — Pin Cleanup
```

Phase 5 follows the completed Phase 4.1 Map-First Layout Pivot.

Completed phases:

```text
Phase 0 — Account and tool setup
Phase 1 — Project scaffold and shell
Phase 2 — Mapbox integration
Phase 2.1 — Mapbox viewer polish and stability
Phase 3 — Scenario engine
Phase 4 partial — Scenario pins, map rendering, recent pins, Add Pin mode, user pin save flow
Phase 4 Add Pin UX refactor — Add Pin workflow moved into MapViewer
Phase 4.1 — Map-First Layout Pivot
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

## Recently Completed — Phase 4.1 Map-First Layout Pivot

Phase 4.1 is complete and committed/pushed.

Completed behavior:

* The app now opens as map-first.
* The far-left rail remains fixed and visible.
* The large default `ControlPanel` is no longer rendered in the main browser map view.
* `ControlPanel.tsx` was preserved for possible future drawer/panel reuse.
* `MapViewer` expands into the space previously occupied by the large `ControlPanel`.
* The upper-left floating card remains the **Map Tools** card.
* Add Pin still starts from the upper-left floating Map Tools card.
* After clicking the map in Add Pin mode, the New Pin metadata form appears as a floating map card.
* Saving creates a user pin through `AppShell` and exits Add Pin mode.
* `Generate New Scenario` moved into a compact bottom-left floating scenario card inside `MapViewer`.
* The compact scenario card shows:
  * “Scenario”
  * `activeScenario.name`
  * `activeScenario.subtitle`
  * `Generate New Scenario` button
* The compact scenario card does **not** show pin count.
* Demo Mode moved into a subtle, single-line, small-font banner along the bottom-left edge of the map.
* Demo Mode text remains:

```text
Demo Mode · Scenarios use simulated scouting data layered over real Idaho terrain.
```

Phase 4.1 confirmed:

* Visual pass confirmed.
* Build passed.
* Commit/push completed.
* Git status clean.

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

Likely Phase 5 additions:

```text
src/utils/pinCleanupEngine.ts
```

Potential type additions in:

```text
src/types/scout.ts
```

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
* Scenario metadata updates.
* Random scenario generation remains backlogged.

---

## Current Pin Behavior

`AppShell.tsx` owns:

```ts
isAddingPin
pendingPinCoordinates
userPins
```

Current Add Pin behavior:

1. User clicks **Add Pin** in the floating `MapViewer` Map Tools card.
2. Add Pin mode becomes active.
3. User clicks the map.
4. App captures pending coordinates.
5. A pending black/orange marker appears on the map.
6. A floating **New Pin** metadata form appears in `MapViewer`.
7. User enters name, type, and notes.
8. Saving creates a `ScoutPin` with `source: 'user'`.
9. User-created pin is tied to the active scenario only.
10. User-created pin appears on the map.
11. User-created pins persist only in React state for the current session.

Current AppShell concept:

```text
activeScenarioPins =
  simulated pins for active scenario
  +
  user pins where pin.scenarioId === activeScenario.id
```

This is important for Phase 5:

```text
Pin Cleanup should analyze activeScenarioPins.
```

That means both simulated pins and user-created pins are included in cleanup analysis.

No localStorage yet.

---

## Existing Data Models

`src/types/scout.ts` currently includes:

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

## Phase 5 Objective — Pin Cleanup

Build a visible, demo-worthy **Pin Cleanup** recommendation workflow.

The goal is not perfect clustering math. The goal is to show product thinking:

* The app recognizes related pins.
* The app recommends cleanup groupings.
* The app explains why.
* The user keeps control.
* Nothing is automatically reorganized without approval.

Pin Cleanup must be user-respecting, transparent, and reversible in feel.

---

## Phase 5 Scope

### Include

* Add a **Pin Cleanup** entry point inside the existing upper-left **Map Tools** card.
* Consider shrinking/toning down button styling in Map Tools to avoid button clutter.
* When clicked, show a short analysis state before suggestions appear.
* Analyze both simulated and user-created pins through `activeScenarioPins`.
* Generate 2–3 smart grouping suggestions when enough related pins exist.
* Show suggestions in a right-side floating map panel.
* Each suggestion should include:
  * Suggested folder/group name
  * Pins included
  * Why explanation
  * Confidence score
  * Accept action
  * Dismiss action
* User can hover a suggestion to highlight/pulse related pins on the map.
* User can accept a grouping.
* User can dismiss a grouping.
* Accepted groups appear immediately in the same right-side panel under a simple **Saved Cleanup Groups** section.
* Accepted/dismissed state is React state only for now.

### Exclude

Do **not** start these unless explicitly asked:

* Feature Finder
* Ask Remi
* localStorage persistence
* Left rail drawer behavior
* Saved Folders full UI
* Recent Pins drawer/panel
* Type-specific marker icons/colors
* Exact marker-anchored editor
* True terrain analysis
* Public land or legality validation
* Real GIS data integration
* Random scenario switching
* Tests unless requested

---

## Pin Cleanup Entry Point

Phase 5 entry point:

```text
Upper-left Map Tools card
```

Suggested UI:

```text
Map Tools
[Add Pin]
[Pin Cleanup]
```

Potential button style note:

* Avoid large button clutter.
* Consider slightly smaller buttons or a tighter stacked layout.
* Do not spend too much time on polish before the workflow works.

Do **not** build the left rail Tools drawer yet.

---

## Pin Cleanup Analysis State

When user clicks **Pin Cleanup**, use Option B:

```text
brief analysis state first
```

Recommended copy:

```text
Analyzing current scenario pins…
Checking proximity, timing, and pin context.
```

Important product note:

* This should demonstrate that analysis is taking place.
* Keep it short and grounded.
* Avoid a long fake spinner.
* A brief 500–800ms delay is enough for demo feel.

This does **not** mean suggestions are static.

The cleanup engine should analyze:

```ts
activeScenarioPins
```

which includes:

```text
simulated pins + user-created pins for the active scenario
```

---

## Suggestion Placement

Use:

```text
Right-side floating map panel
```

Reason:

* Gives recommendations enough room.
* Avoids competing with the bottom-left Scenario card and Demo Mode banner.
* Avoids building a left rail drawer before it is needed.

---

## Pins Included in Analysis

Analyze both:

```text
simulated pins
user-created pins
```

Implementation guidance:

Use `activeScenarioPins` from `AppShell`.

This matters because the user should be able to:

1. Add a pin manually.
2. Run Pin Cleanup.
3. See that user-created pin appear in or influence cleanup recommendations when relevant.

The demo should not feel like canned/static recommendations.

---

## Source Labels

Do not emphasize `SIMULATED` / `USER` labels in the cleanup panel.

Source can remain available in existing pin data and map popups, but it should not be central to the recommendation card UX.

---

## Recommendation Engine Direction

Use a custom weighted similarity engine, not K-Means or DBSCAN.

Weighting target:

```text
50% proximity
30% time / season affinity
20% metadata context
```

The engine does not need to be mathematically perfect for MVP, but it should be deterministic, explainable, and portfolio-readable.

Recommendation engine should consider:

* Distance/proximity between pins
* Observed date proximity
* Metadata/type affinity
* Scenario context
* Dominant pin types in a group
* Number of pins in group
* Whether the group includes combinations like:
  * sign + water
  * bedding + food
  * access + truck + camp
  * glassing + deer/elk/sign
  * blood + shot + sign
  * wallow + water + elk

The engine should generate names dynamically, not rely on static scenario-specific cards.

---

## Dynamic Suggestion Names

Avoid static canned names like:

```text
Always show North Ridge Pattern
Always show Creek Bottom Sign Cluster
```

Instead, generate names from the group context.

Examples:

```text
Water + Sign Corridor
North Slope Glassing Set
Access Cluster
Bedding Pattern
Ridge Scouting Zone
Creek Bottom Activity
Elk + Wallow Pattern
Food + Bedding Pattern
Shot Follow-Up Cluster
```

Names may differ by scenario and by the pins present.

The engine can use simple rules for MVP:

* If group contains water + sign: `Water + Sign Corridor`
* If group contains elk + wallow: `Elk + Wallow Pattern`
* If group contains bedding + food: `Food + Bedding Pattern`
* If group contains access/truck/camp: `Access + Camp Plan`
* If group contains glassing/deer/elk: `Glassing Set`
* Else use a generic but scenario-aware name like `Scouting Zone`

---

## Why Explanations

Each suggestion should explain itself.

Recommended level:

```text
Why this grouping?
- 5 pins are clustered within 0.7 miles.
- Observations were dropped within 12 days.
- Sign, water, and bedding suggest a related scouting pattern.
- Confidence: 84%.
```

The “why” is one of the strongest portfolio signals.

Use clear, non-hype language.

Do not imply real wildlife prediction, legality validation, or true terrain intelligence.

---

## Confidence Score

Include a confidence score.

MVP guidance:

* Deterministic, calculated from the same weighted logic.
* Should generally fall within a reasonable range like 65–90%.
* Avoid 99% confidence.

Example:

```text
Confidence: 84%
```

---

## Folder Override Behavior

Pin Cleanup should recommend groupings, but the user keeps pin-level control.

When reviewing a suggested cleanup group, each pin should be individually adjustable.

Each pin can be assigned to:

```text
recommended folder
existing saved folder
no folder
```

For Phase 5 MVP use Option B:

```text
Dropdown with existing folders
```

Each pin can choose:

```text
Recommended Folder
Existing Saved Folder(s)
No Folder
```

Group-level behavior:

* Suggested folder name should be editable/renamable at the group level.
* The renamed group folder should become the recommended folder destination for that suggestion.

Pin-level behavior:

* Each pin defaults to the recommended folder.
* User can override a pin into an existing saved folder.
* User can choose **No Folder** for a pin.
* Pins marked **No Folder** are not assigned when the recommendation is accepted.

Custom pin-level new-folder creation is not required for Phase 5 MVP.

---

## Accept Behavior

When user clicks **Accept Grouping**:

* Create/save the folder/group using the group-level folder name.
* Assign only pins selected for that folder/group.
* Pins set to **No Folder** remain unassigned.
* Pins assigned to existing saved folders should be added to that existing folder.
* Remove the accepted suggestion from active recommendations.
* Show the accepted folder/group in the same right-side panel under **Saved Cleanup Groups**.
* Keep all state in React only for now.

Simple saved group display:

```text
Saved Cleanup Groups
- Water + Sign Corridor · 4 pins
- North Ridge Pattern · 3 pins
```

Do not build the full Folders drawer yet.

---

## Dismiss Behavior

Dismiss behavior should be:

```text
Dismiss for the current session.
```

Dismissed suggestions should stay hidden even if Pin Cleanup is clicked again during the session.

No persistence yet.

---

## Empty State / Minimum Threshold

Approved empty state copy:

```text
Not enough related pins found.
Add more pins or switch scenarios to run cleanup again.
```

However, the system should only show this when Pin Cleanup truly cannot run.

Implementation guidance:

* Set the threshold low enough that Phase 5 usually produces recommendations for current scenario data.
* Recommended threshold:
  * Need at least 3 pins total to attempt cleanup.
  * Need at least one related group of 2+ or 3+ pins depending on the algorithm.
* Given current scenario data, the app should generally be able to produce at least one suggestion.
* Do not force a bad suggestion if data is genuinely too sparse.
* Avoid empty state in normal current demo scenarios.

---

## Hover Highlighting / Pulse Behavior

When user hovers a suggestion card:

* Related pins on the map should visually highlight or pulse.
* This helps connect the recommendation to spatial reality.

Implementation note:

* Current markers are created manually in Mapbox within `MapViewer`.
* Existing marker hover scaling was avoided because Mapbox uses CSS transforms for marker placement and transform-based Tailwind scaling caused jitter.
* Do not use Tailwind `hover:scale-*` on Mapbox markers.
* Use a safe visual treatment such as:
  * ring
  * border color
  * background color
  * CSS animation that does not fight Mapbox positioning
  * rebuilding marker class based on highlighted pin IDs

---

## Recommended Types to Add

Likely additions to `src/types/scout.ts`:

```ts
export type PinCleanupSuggestion = {
  id: string
  scenarioId: string
  title: string
  suggestedFolderName: string
  pinIds: string[]
  explanation: string[]
  confidence: number
}

export type PinFolderAssignment = {
  pinId: string
  folderId: string | null
}

export type SavedPinFolder = {
  id: string
  name: string
  scenarioId: string
  pinIds: string[]
  createdAt: string
}
```

Possible refinement:

If pin-level dropdown state needs to support the “recommended folder before it exists,” use a draft assignment type in component state rather than saved folder state.

Example:

```ts
export type PinCleanupDraftAssignment = {
  pinId: string
  destinationFolderId: string | 'recommended' | 'none'
}
```

Keep types simple and readable.

---

## Recommended New Utility File

Create:

```text
src/utils/pinCleanupEngine.ts
```

Likely exported function:

```ts
export function createPinCleanupSuggestions(
  scenario: ScenarioRegion,
  pins: ScoutPin[],
  dismissedSuggestionIds: string[],
): PinCleanupSuggestion[]
```

Alternative:

```ts
export function createPinCleanupSuggestions({
  scenario,
  pins,
  dismissedSuggestionIds,
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  dismissedSuggestionIds: string[]
}): PinCleanupSuggestion[]
```

Recommended behavior:

* Deterministic.
* No randomness.
* Based on actual input pins.
* Returns 0–3 suggestions.
* Filters out dismissed suggestions.
* Generates stable IDs from scenario ID and pin IDs.
* Generates dynamic names based on pin types/context.
* Calculates confidence from proximity, time affinity, and metadata affinity.

---

## Recommended AppShell State

Likely new state in `AppShell.tsx`:

```ts
const [isAnalyzingCleanup, setIsAnalyzingCleanup] = useState(false)
const [cleanupSuggestions, setCleanupSuggestions] = useState<PinCleanupSuggestion[]>([])
const [hoveredCleanupSuggestionId, setHoveredCleanupSuggestionId] = useState<string | null>(null)
const [dismissedCleanupSuggestionIds, setDismissedCleanupSuggestionIds] = useState<string[]>([])
const [savedPinFolders, setSavedPinFolders] = useState<SavedPinFolder[]>([])
```

Potential handlers:

```ts
function handleRunPinCleanup() {}
function handleDismissCleanupSuggestion(suggestionId: string) {}
function handleAcceptCleanupSuggestion(...) {}
function handleHoverCleanupSuggestion(suggestionId: string | null) {}
```

Important:

* If active scenario changes, consider clearing current cleanup suggestions and hover state.
* Do not necessarily clear saved folders unless they are scenario-specific and filtered by active scenario.
* Dismissed suggestions can be session-wide but should probably be scenario-specific through stable suggestion IDs.

---

## Recommended MapViewer Props

Likely additions:

```ts
isAnalyzingCleanup: boolean
cleanupSuggestions: PinCleanupSuggestion[]
hoveredCleanupSuggestionId: string | null
savedPinFolders: SavedPinFolder[]
onRunPinCleanup: () => void
onDismissCleanupSuggestion: (suggestionId: string) => void
onAcceptCleanupSuggestion: (...) => void
onHoverCleanupSuggestion: (suggestionId: string | null) => void
```

Pin assignment handling may require either:

* local draft state inside `MapViewer`, or
* state in `AppShell`

Recommended MVP:

* Keep temporary dropdown/folder-name draft state inside `MapViewer`.
* Send a clean accept payload back to `AppShell`.

Possible accept payload:

```ts
type AcceptCleanupSuggestionInput = {
  suggestionId: string
  folderName: string
  pinAssignments: Array<{
    pinId: string
    destinationFolderId: string | 'recommended' | 'none'
  }>
}
```

This type can live in `src/types/scout.ts` if shared.

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

## Recommended Phase 5 Implementation Slices

### Slice 1 — Inspect current files and baseline

Run:

```bash
cd /Users/kylezibrowski/Projects/scoutnavigator
git status
npm run build
```

Inspect:

```bash
sed -n '1,260p' src/types/scout.ts
sed -n '1,280p' src/components/AppShell.tsx
sed -n '1,520p' src/components/MapViewer.tsx
sed -n '1,360p' src/utils/scenarioEngine.ts
```

---

### Slice 2 — Add cleanup/folder types only

Likely file:

```text
src/types/scout.ts
```

Add simple types for:

* `PinCleanupSuggestion`
* `SavedPinFolder`
* cleanup accept payload / draft assignment if needed

Run build.

---

### Slice 3 — Add `pinCleanupEngine.ts`

Create:

```text
src/utils/pinCleanupEngine.ts
```

Start with deterministic, explainable logic.

Engine should:

* take active scenario and active pins
* return 0–3 suggestions
* use proximity/time/type metadata
* generate dynamic names
* generate why explanations
* produce confidence scores
* filter dismissed suggestions

Run build.

---

### Slice 4 — Wire cleanup state into AppShell

Add state and handlers to `AppShell`.

Pass needed props into `MapViewer`.

Run build.

---

### Slice 5 — Add Pin Cleanup entry point and analysis state

In `MapViewer`:

* Add **Pin Cleanup** button to upper-left Map Tools card.
* Consider slightly smaller button styling to avoid clutter.
* On click, call `onRunPinCleanup`.
* Show brief analysis state in right-side floating panel.

Run build and visually confirm.

---

### Slice 6 — Render recommendation panel

In right-side floating panel:

* Show active suggestions.
* Show dynamic title/folder name.
* Show Why explanation.
* Show confidence.
* Show pins included.
* Include Accept and Dismiss buttons.
* Include editable group-level folder name.
* Include pin-level dropdowns:
  * Recommended Folder
  * Existing Saved Folder(s)
  * No Folder

Run build.

---

### Slice 7 — Add hover highlighting

Hovering a suggestion should highlight/pulse related map markers.

Avoid transform-based scaling on Mapbox markers.

Run build and visually confirm.

---

### Slice 8 — Add Accept/Dismiss behavior

Accept:

* Create/save folder/group.
* Assign included pins according to dropdowns.
* Leave No Folder pins unassigned.
* Add accepted groups to Saved Cleanup Groups section.
* Remove accepted suggestion from active suggestions.

Dismiss:

* Hide suggestion for current session.
* Keep hidden if Pin Cleanup is clicked again.

Run build and visually confirm.

---

### Slice 9 — Final Phase 5 browser test

Confirm:

* Pin Cleanup button appears in Map Tools.
* Click shows brief analysis state.
* Suggestions appear in right-side floating panel.
* Suggestions are generated from current `activeScenarioPins`.
* User-created pins are included when relevant.
* Why explanations appear.
* Confidence appears.
* Hovering suggestion highlights/pulses related pins.
* Group-level folder name can be changed.
* Pin-level folder overrides work.
* Pins can be set to No Folder.
* Accept creates Saved Cleanup Group.
* Dismiss hides suggestion for the session.
* Generate New Scenario still works.
* Add Pin still works.
* No Feature Finder / Ask Remi / localStorage work started.
* Build passes.
* Git status clean after commit/push.

---

## User Working Style Preference

The user wants a hand-held build process.

Important:

* Go slowly.
* Use small slices.
* Do not collapse multiple actions into vague instructions.
* Explain what each command or file change does in plain English.
* Give exact file names and specific code block boundaries whenever possible.
* Use terminal checks often.
* Run `npm run build` after meaningful changes.
* Pause after small chunks.
* Ask for file contents/screenshots when needed instead of guessing.
* Do not jump ahead.
* Do not start Feature Finder or Ask Remi yet.
* Preserve the existing ScoutNavigator shell and Mapbox map.
* Keep all demo data honest as simulated.
* Keep code portfolio-readable.

---

## Prompt To Start Phase 5 Chat

Use this prompt with this updated `context.md`:

```text
Continue the ScoutNavigator build from the uploaded context.md file.

Project path:
/Users/kylezibrowski/Projects/scoutnavigator

We are starting Phase 5: Pin Cleanup.

Current status:
- Phase 4.1 Map-First Layout Pivot is complete and committed/pushed.
- App now opens map-first: fixed left rail + full-width MapViewer.
- The default large ControlPanel is no longer rendered in the main browser view.
- ControlPanel.tsx is preserved for future drawer/panel reuse.
- Add Pin remains in the upper-left floating Map Tools card.
- Generate New Scenario is in a compact bottom-left Scenario card inside MapViewer.
- Demo Mode is a subtle single-line bottom-left map banner.
- Build passed and git status was clean after Phase 4.1.

Phase 5 goal:
Build a visible, demo-worthy Pin Cleanup recommendation workflow.

Desired behavior:
- Add Pin Cleanup to the upper-left Map Tools card.
- Use a short analysis state before showing results:
  “Analyzing current scenario pins… Checking proximity, timing, and pin context.”
- Analyze activeScenarioPins, meaning both simulated pins and user-created pins.
- Show 2–3 recommendations when enough related pins exist.
- Show recommendations in a right-side floating map panel.
- Each recommendation should include dynamic suggested folder name, included pins, Why explanation, and confidence score.
- Recommendation names should be generated from pin/scenario context, not static canned cards.
- Hovering a recommendation should highlight/pulse related pins on the map.
- User can accept or dismiss each recommendation.
- Dismiss hides the suggestion for the current session.
- Accept creates a saved cleanup group/folder in React state.
- Accepted groups should appear immediately in the same right-side panel under Saved Cleanup Groups.
- User must retain pin-level control:
  - group-level folder name can be renamed
  - each pin can stay in the recommended folder
  - each pin can be moved to an existing saved folder
  - each pin can be set to No Folder
- Pins set to No Folder are not assigned when accepted.
- No localStorage yet.
- Do not start Feature Finder.
- Do not start Ask Remi.
- Do not build left rail drawer behavior yet.

Working style:
- Walk me through this slowly.
- Use small slices.
- Explain exact files and line/block targets based on my actual files.
- Use terminal checks often.
- Run npm run build after meaningful changes.
- Commit and push only after the Pin Cleanup MVP works.
```
