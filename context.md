# ScoutNavigator Context — Phase 6 Feature Finder Setup

## Project Name

**ScoutNavigator**

## Product Positioning

**Field Intelligence for Outdoor Nav**

ScoutNavigator is a portfolio demo web mapping application designed to demonstrate geospatial product thinking, client-side spatial/product logic, outdoor navigation workflow design, and practical frontend implementation.

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

## Live Demo

Production URL:

```text
https://scoutnavigator.vercel.app/
```

Deployment platform:

```text
Vercel
```

Repository:

```text
GitHub — scoutnavigator
```

Environment variable used for Mapbox:

```text
VITE_MAPBOX_TOKEN
```

The app is deployed from GitHub to Vercel. Future pushes to `main` should trigger a new Vercel deployment.

Important deployment note:

- The Mapbox token is client-visible because this is a browser Mapbox app. That is expected.
- After deployment, the Mapbox token should be restricted in Mapbox account settings to approved URLs such as:
  - `http://localhost:5173`
  - `https://scoutnavigator.vercel.app`

---

## Current Phase

We are moving into:

```text
Phase 6 — Feature Finder MVP
```

Phase 6 follows the completed Pin Cleanup, Folder Review, and live deployment milestones.

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
Phase 5 — Pin Cleanup MVP
Phase 5.1 — Folder Review + Manual Assignment
Phase 5.2 — Live URL deployment + demo packaging
```

---

## Current Strategic Objective

Continue building a standalone, interactive web mapping app that shows:

1. Strong geospatial product instincts.
2. Practical frontend mapping implementation.
3. User-respecting recommendation workflows.
4. Transparent spatial/product logic.
5. A polished, portfolio-readable codebase.
6. A demo that can be opened by a reviewer and understood within 30 seconds.
7. A live URL that can be shared with hiring managers and product/engineering contacts.

The app uses real Mapbox terrain as the visual map foundation. For v1, scouting pins and terrain intelligence remain simulated for demo reliability.

---

## Current Product Direction

The next feature should be **Feature Finder**.

User preference:

```text
Move into Feature Finder next.
Do not build Scenario Analysis Summary.
Do not build Ask Remi yet.
```

Feature Finder should remain:

- map-native
- visual
- transparent
- grounded in the current simulated scenario
- honest that terrain intelligence is simulated for demo purposes
- focused on outdoor navigation / scouting workflow value

Feature Finder should **not** become a chatbot.

---

## Current Working Demo Flow

The app is live and shareable.

Current confirmed demo flow:

1. User opens ScoutNavigator.
2. App loads a simulated Mountain West / Idaho scouting scenario over real Mapbox terrain.
3. User can generate a new scenario.
4. User can add custom pins directly on the map.
5. User can run Pin Cleanup.
6. Pin Cleanup analyzes active scenario pins:
   - simulated pins
   - user-created pins
   - excluding pins already assigned to saved folders
   - keeping No Folder pins eligible for future cleanup
7. Cleanup recommendations include:
   - suggested folder name
   - editable folder name
   - confidence score
   - plain-language explanation
   - included pins
   - pin-level folder assignment dropdowns
   - Accept Grouping
   - Dismiss
8. Accepting a grouping creates a saved folder in React state.
9. Folders can be opened from the left rail.
10. Opening Folders closes Pin Cleanup.
11. Folder panel lists saved folders for the active scenario.
12. Clicking a folder opens folder detail.
13. Folder detail shows pins in the folder.
14. Each pin row includes:
   - Edit
   - Remove
15. Edit expands a narrow MVP pin detail view:
   - type
   - observed date
   - source
   - notes
   - coordinates
16. Remove removes the pin from the folder.
17. Removed pins become eligible for Pin Cleanup again.
18. Empty folders remain visible.
19. Unassigned pins can be manually added to existing folders from the Mapbox popup.
20. Popup assignment uses Mapbox DOM elements / event listeners through `setDOMContent`, not React handlers inside raw `setHTML`.
21. Selecting a folder in the popup assigns immediately.
22. Assigned pin popups show folder name.

---

## Recently Completed — Phase 4.1 Map-First Layout Pivot

Phase 4.1 is complete and committed/pushed.

Completed behavior:

- The app now opens as map-first.
- The far-left rail remains fixed and visible.
- The large default `ControlPanel` is no longer rendered in the main browser map view.
- `ControlPanel.tsx` was preserved for possible future drawer/panel reuse.
- `MapViewer` expands into the space previously occupied by the large `ControlPanel`.
- The upper-left floating card remains the **Map Tools** card.
- Add Pin still starts from the upper-left floating Map Tools card.
- After clicking the map in Add Pin mode, the New Pin metadata form appears as a floating map card.
- Saving creates a user pin through `AppShell` and exits Add Pin mode.
- `Generate New Scenario` moved into a compact bottom-left floating scenario card inside `MapViewer`.
- The compact scenario card shows:
  - “Scenario”
  - `activeScenario.name`
  - `activeScenario.subtitle`
  - `Generate New Scenario` button
- The compact scenario card does **not** show pin count.
- Demo Mode moved into a subtle, single-line, small-font banner along the bottom-left edge of the map.
- Demo Mode text remains:

```text
Demo Mode · Scenarios use simulated scouting data layered over real Idaho terrain.
```

Phase 4.1 confirmed:

- Visual pass confirmed.
- Build passed.
- Commit/push completed.
- Git status clean.

---

## Recently Completed — Phase 5 Pin Cleanup MVP

Phase 5 is complete and committed/pushed.

Completed behavior:

- `Pin Cleanup` appears in the upper-left **Map Tools** card.
- Clicking Pin Cleanup opens a right-side floating panel.
- A short analysis state appears before recommendations:

```text
Analyzing current scenario pins…
Checking proximity, timing, and pin context.
```

- Cleanup analyzes `activeScenarioPins`, meaning simulated pins plus user-created pins for the active scenario.
- Pins already assigned to saved cleanup folders are excluded from future cleanup analysis.
- Pins set to **No Folder** remain eligible for future cleanup analysis.
- Recommendations appear in the right-side panel.
- Recommendations include:
  - dynamic title / suggested folder name
  - editable folder name
  - confidence score
  - “Why this grouping?” explanation
  - included pins
  - pin-level folder assignment dropdowns
  - Accept Grouping / Dismiss actions
- Recommendation names are generated from pin/scenario context rather than static cards.
- Hovering a recommendation highlights/pulses related pins on the map.
- Hovering a specific included pin row highlights that single marker more strongly.
- Accept creates a saved cleanup group/folder in React state.
- Dismiss hides the suggestion for the current session.
- Saved Cleanup Groups originally appeared in the Pin Cleanup panel.
- Pin popups show folder name when a pin has been assigned to a folder.
- Pin Cleanup panel has a **Close** button.
- Closing the panel hides it without destroying saved React state.
- Re-running Pin Cleanup reopens the panel and saved groups still exist.
- No localStorage yet.
- No Feature Finder yet.
- No Ask Remi yet.
- No full left rail drawer behavior yet.

---

## Recently Completed — Phase 5.1 Folder Review + Manual Assignment

Phase 5.1 is complete and committed/pushed.

Goal completed:

```text
Make saved cleanup groups/folders visible from the left rail Folders entry, allow folder inspection, allow pin removal from folders, and allow unassigned pins to be manually added to existing folders from the pin popup.
```

Completed behavior:

- Clicking **Folders** in the left rail opens a right-side Folders panel.
- Opening Folders closes the Pin Cleanup panel.
- Folder panel lists saved folders for the active scenario.
- Folder list shows folder name and pin count.
- Clicking a folder opens folder detail.
- Folder detail shows included pins.
- Each pin in folder detail has:
  - pin name
  - pin type
  - **Edit**
  - **Remove**
- Edit behavior is narrow MVP:
  - clicking Edit expands the pin row
  - expanded row shows pin metadata/details
  - no full pin metadata editing yet
- Remove removes that pin ID from the saved folder in React state.
- Removed pins become eligible for Pin Cleanup again.
- Empty folders remain visible with empty-state copy.
- Unassigned pins can be added to an existing saved folder from the Mapbox popup.
- Popup add-to-folder uses Mapbox DOM elements / `.setDOMContent(...)` and direct event listeners.
- Selecting a folder in the popup assigns immediately.
- No Save button is needed in the popup.
- Popup add-to-folder only shows existing saved folders for the active scenario.
- Assigned pins show folder name in the popup.
- Unassigned pins show `Folder: No folder` and a dropdown if folders exist.
- No localStorage yet.
- No Feature Finder yet.
- No Ask Remi yet.
- No folder delete, nested folders, map filtering by folder, or full saved folders management.

Confirmed browser test:

- Build passed.
- Folders left rail click opens right-side Folders panel.
- Opening Folders closes Pin Cleanup panel.
- Saved folders are listed.
- Clicking folder opens folder detail.
- Folder detail shows pins.
- Edit option appears for each pin and expands narrow pin details.
- Remove removes pin from folder.
- Removed pin becomes eligible for cleanup again.
- Empty folder stays visible.
- Pin popup shows folder name for assigned pins.
- Unassigned pin popup can add pin to existing folder via dropdown.
- Added pin is excluded from future cleanup analysis.
- Add Pin still works.
- Generate New Scenario still works.
- Pin Cleanup still works.

---

## Recently Completed — Phase 5.2 Live URL Deployment + Demo Packaging

Phase 5.2 deployment work is complete.

Completed behavior / decisions:

- App deployed to Vercel.
- Production URL is live:

```text
https://scoutnavigator.vercel.app/
```

- Vercel project is connected to GitHub.
- Vercel deployment uses `VITE_MAPBOX_TOKEN`.
- Production/Preview environment variable configuration was used.
- User confirmed live app renders and works.
- Vercel sidebar/toolbar appeared for the project owner; this is not part of ScoutNavigator.
- User can test in Incognito to confirm external viewers do not see project-owner toolbar.
- No custom domain purchased.
- No custom domain needed for current portfolio sharing.
- Use Vercel-provided URL for now.
- User sent ScoutNavigator link to an onX contact / referral path.

Recommended README packaging:

- Include live URL.
- Include project positioning.
- Include current demo workflow.
- Include tech stack.
- Include local setup.
- Include deployment note for `VITE_MAPBOX_TOKEN`.

---

## Recent Fix — McCall Region Center

The McCall / Payette scenario center was adjusted because the prior center was too close to McCall city / Payette Lake / airport, causing generated pins to land on poor demo terrain.

Updated center:

```text
Lng: -115.91684
Lat: 45.15980
```

Mapbox coordinate order:

```ts
center: [-115.91684, 45.1598]
```

The fix was committed and pushed.

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
│   ├── pinCleanupEngine.ts
│   └── scenarioEngine.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

Important files:

```text
src/components/AppShell.tsx
src/components/MapViewer.tsx
src/components/LeftRail.tsx
src/data/scenarioRegions.ts
src/types/scout.ts
src/utils/pinCleanupEngine.ts
src/utils/scenarioEngine.ts
```

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
- localStorage eventually
- No backend for v1
- No database for v1
- No authentication for v1

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

- App loads the first scenario.
- Clicking **Generate New Scenario** deterministically cycles through the scenario list.
- The map camera flies to the selected region.
- Scenario metadata updates.
- Scenario pins regenerate for the active scenario.
- Random scenario generation remains backlogged.

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
12. User-created pins are included in Pin Cleanup analysis.

Current AppShell concept:

```text
activeScenarioPins =
  simulated pins for active scenario
  +
  user pins where pin.scenarioId === activeScenario.id
```

No localStorage yet.

---

## Existing Data Models

`src/types/scout.ts` includes the base map/scenario/pin types:

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

Phase 5 added cleanup/folder types similar to:

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

export type PinCleanupDraftAssignment = {
  pinId: string
  destinationFolderId: string | 'recommended' | 'none'
}

export type AcceptCleanupSuggestionInput = {
  suggestionId: string
  folderName: string
  pinAssignments: PinCleanupDraftAssignment[]
}

export type SavedPinFolder = {
  id: string
  name: string
  scenarioId: string
  pinIds: string[]
  createdAt: string
}
```

Only add shared types when needed across components.

---

## Current AppShell Responsibilities

`AppShell.tsx` owns primary workflow state:

```text
activeScenario
isAddingPin
pendingPinCoordinates
userPins
isCleanupPanelOpen
isAnalyzingCleanup
cleanupSuggestions
hoveredCleanupSuggestionId
dismissedCleanupSuggestionIds
savedPinFolders
isFoldersPanelOpen
selectedFolderId
```

`activeScenarioPins` is computed from:

```text
simulated scenario pins
+
user-created pins for the active scenario
```

Pin Cleanup filters assigned pins before analysis:

```ts
const assignedPinIds = new Set(
  savedPinFolders
    .filter((folder) => folder.scenarioId === activeScenario.id)
    .flatMap((folder) => folder.pinIds),
)

const unassignedScenarioPins = activeScenarioPins.filter(
  (pin) => !assignedPinIds.has(pin.id),
)
```

Then it passes `unassignedScenarioPins` to `createPinCleanupSuggestions`.

AppShell handlers include or should include equivalents of:

```ts
function handleGenerateScenario() {}
function handleStartAddingPin() {}
function handleCancelAddingPin() {}
function handleChoosePinLocation(coordinates: ScoutPin['coordinates']) {}
function handleSaveUserPin(pinDraft: UserPinDraft) {}

function handleRunPinCleanup() {}
function handleCloseCleanupPanel() {}
function handleDismissCleanupSuggestion(suggestionId: string) {}
function handleAcceptCleanupSuggestion(input: AcceptCleanupSuggestionInput) {}

function handleOpenFoldersPanel() {}
function handleCloseFoldersPanel() {}
function handleSelectFolder(folderId: string | null) {}
function handleRemovePinFromFolder(folderId: string, pinId: string) {}
function handleAddPinToFolder(folderId: string, pinId: string) {}
```

Saved folders are stored in React state only. No localStorage yet.

---

## Current MapViewer Responsibilities

`MapViewer.tsx` owns the map UI and local temporary drafts:

```text
newPinDraft
cleanupDrafts
hoveredCleanupPinId
editingFolderPinId
map refs / marker refs / pending marker refs
```

Current visible UI includes:

- Map Tools card in upper-left.
- Add Pin flow and metadata form in the upper-left map card.
- Pin Cleanup button in Map Tools.
- Pin Cleanup right-side floating panel.
- Folders right-side floating panel.
- Scenario card bottom-left.
- Demo Mode banner bottom-left.
- Mapbox markers and popups.

Current marker popup:

- shows pin type
- pin name
- notes
- folder name if assigned
- `Folder: No folder` if unassigned
- add-to-folder dropdown for unassigned pins when saved folders exist
- source
- observed date

Important implementation note:

- Mapbox popups with clickable controls should use `.setDOMContent(...)` and direct DOM event listeners.
- Do not rely on React JSX handlers inside `.setHTML(...)`.
- Current popup assignment implementation follows this approach.

---

## Pin Cleanup Recommendation Engine

Utility file:

```text
src/utils/pinCleanupEngine.ts
```

The engine should remain:

- deterministic
- explainable
- based on actual input pins
- readable for portfolio review
- honest about simulated/demo nature

Recommendation engine considers:

- Distance/proximity between pins
- Observed date proximity
- Metadata/type affinity
- Scenario context
- Dominant pin types in a group
- Number of pins in group
- Whether the group includes combinations like:
  - sign + water
  - bedding + food
  - access + truck + camp
  - glassing + deer/elk/sign
  - blood + shot + sign
  - wallow + water + elk

The engine should generate names dynamically, not rely on static scenario-specific cards.

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

---

## Current Product Decisions

Keep:

```text
Map-first layout
Right-side floating panels for now
Simulated scouting data for demo reliability
Transparent recommendations
User control over accept/dismiss/adjust
Browser-first demo experience
Vercel-provided URL for sharing
```

Avoid for now:

```text
Ask Remi
AI chat assistant
Scenario Analysis Summary
localStorage persistence
full left rail drawer behavior
full saved folder management
folder delete
nested folders
full pin metadata editing
map filtering by folder
real terrain intelligence
public land or legality validation
real GIS data integration
random scenario switching
```

---

## Phase 6 Objective — Feature Finder MVP

Build a visible, map-native **Feature Finder** workflow.

The goal is to show how ScoutNavigator could help a user identify likely scouting opportunities from the current map/scenario context without turning the product into a chatbot.

Feature Finder should answer a user need like:

```text
I’m scouting this area. Help me find likely places to investigate next.
```

It should feel like outdoor navigation product functionality, not a generic AI feature.

### High-Level Desired Behavior

Potential MVP flow:

1. User clicks **Feature Finder** in the upper-left Map Tools card.
2. A right-side floating Feature Finder panel opens.
3. Opening Feature Finder should close Pin Cleanup and Folders panels.
4. User selects a feature/opportunity type to look for.
5. The app highlights or suggests 2–3 simulated opportunity areas/points on the map.
6. Each suggestion includes:
   - name/title
   - feature type
   - why explanation
   - confidence or suitability score
   - suggested action
7. Hovering a suggestion highlights the corresponding map opportunity.
8. User can save a suggested opportunity as a pin.
9. Saved suggested pins become normal user pins and are included in later Pin Cleanup analysis.

### Potential Feature Types

Potential categories:

```text
Water
Glassing
Access
Bedding
Food
Trail camera setup
Camp location
```

Do not overbuild all categories at once. Start with a tight MVP.

Recommended first MVP categories:

```text
Water
Glassing
Access
```

These are easier to understand visually and can be simulated credibly without real terrain/GIS analysis.

### Feature Finder Product Posture

Feature Finder should be:

- map-native
- visual
- transparent
- scenario-aware
- easy to demo in under one minute
- believable as an outdoor navigation workflow
- honest that insights are simulated for demo purposes

Feature Finder should not:

- make real hunting predictions
- imply legal access validation
- imply real terrain intelligence unless actually implemented
- become Ask Remi
- require a backend
- require localStorage
- require external GIS data
- require real public/private land overlays

### Suggested MVP Language

Entry point:

```text
Feature Finder
```

Panel title:

```text
Feature Finder
```

Panel helper copy:

```text
Find simulated scouting opportunities based on the current scenario context.
```

Category selector:

```text
What are you looking for?
[Water] [Glassing] [Access]
```

Analysis state:

```text
Scanning current scenario context…
Checking terrain position, nearby pins, and access patterns.
```

Important: this is demo language. Keep it honest as simulated.

Example suggestion card:

```text
North Bench Glassing Point
Type: Glassing
Suitability: 82%

Why this spot?
- Sits above the main drainage.
- Near recent elk/sign observations.
- Gives visual coverage across likely movement corridors.

Suggested action:
Save as a glassing pin and verify visibility in the field.
```

### Suggested Feature Finder Data Model

Only add if needed:

```ts
export type FeatureFinderType =
  | 'water'
  | 'glassing'
  | 'access'

export type FeatureFinderSuggestion = {
  id: string
  scenarioId: string
  type: FeatureFinderType
  title: string
  coordinates: [number, number]
  explanation: string[]
  suggestedAction: string
  suitability: number
}
```

Potential save payload:

```ts
export type SaveFeatureFinderSuggestionInput = {
  suggestionId: string
}
```

When saved, a Feature Finder suggestion can become a `ScoutPin` with:

```ts
source: 'user'
type: appropriate ScoutPinType
```

Examples:

```text
Feature Finder water suggestion → ScoutPin type `water`
Feature Finder glassing suggestion → ScoutPin type `glassing-point`
Feature Finder access suggestion → ScoutPin type `access-point`
```

### Suggested Feature Finder Utility

Potential new file:

```text
src/utils/featureFinderEngine.ts
```

Potential function:

```ts
export function createFeatureFinderSuggestions({
  scenario,
  pins,
  featureType,
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  featureType: FeatureFinderType
}): FeatureFinderSuggestion[]
```

Recommended behavior:

- deterministic
- scenario-aware
- uses active scenario pins as context
- returns 2–3 suggestions
- generates stable IDs
- generates explanation bullets
- generates suitability scores in a believable range
- does not claim real terrain analysis

### Suggested Feature Finder State

Likely `AppShell.tsx` state:

```ts
const [isFeatureFinderPanelOpen, setIsFeatureFinderPanelOpen] = useState(false)
const [isAnalyzingFeatures, setIsAnalyzingFeatures] = useState(false)
const [selectedFeatureFinderType, setSelectedFeatureFinderType] =
  useState<FeatureFinderType | null>(null)
const [featureFinderSuggestions, setFeatureFinderSuggestions] =
  useState<FeatureFinderSuggestion[]>([])
const [hoveredFeatureFinderSuggestionId, setHoveredFeatureFinderSuggestionId] =
  useState<string | null>(null)
```

Potential handlers:

```ts
function handleOpenFeatureFinderPanel() {}
function handleCloseFeatureFinderPanel() {}
function handleRunFeatureFinder(featureType: FeatureFinderType) {}
function handleHoverFeatureFinderSuggestion(suggestionId: string | null) {}
function handleSaveFeatureFinderSuggestion(suggestionId: string) {}
```

Panel interaction rules:

- Opening Feature Finder closes Pin Cleanup.
- Opening Feature Finder closes Folders.
- Opening Pin Cleanup closes Feature Finder.
- Opening Folders closes Feature Finder.
- Generate New Scenario closes Feature Finder and clears feature suggestions.

### Suggested Feature Finder Marker Behavior

Feature suggestions can be rendered as temporary opportunity markers.

Potential visual treatment:

- Slate/dark marker with orange ring
- Different from normal pins but not overly noisy
- Highlight/pulse on suggestion hover
- Clicking suggestion marker can show a popup with title/explanation/action
- MVP can avoid marker popups if panel-card hover/save is clear enough

Avoid transform-based marker scaling because Mapbox marker positioning uses transforms and prior scaling caused jitter.

---

## Phase 6 Implementation Slices

### Slice 6A — Baseline and scope confirmation

Run:

```bash
cd /Users/kylezibrowski/Projects/scoutnavigator
git status
npm run build
```

Confirm clean state.

Discuss and lock MVP scope before editing:

- Feature types for MVP
- panel placement
- whether suggestion markers are points only or zones
- whether saving creates user pins
- whether Feature Finder suggestions use current active pins as context
- whether suggestions reset on scenario change

Recommended MVP decision:

```text
Feature Finder starts with three types:
Water, Glassing, Access.

Suggestions are point markers, not polygons/zones.
Saving creates a user pin.
Suggestions use activeScenarioPins.
Suggestions reset on scenario change.
Panel is right-side floating.
```

### Slice 6B — Add Feature Finder types

Likely file:

```text
src/types/scout.ts
```

Add:

- `FeatureFinderType`
- `FeatureFinderSuggestion`
- optional save payload type if useful

Run build.

### Slice 6C — Add feature finder engine

Create:

```text
src/utils/featureFinderEngine.ts
```

Engine should:

- take scenario, pins, and selected feature type
- return deterministic suggestions
- produce coordinates near the active scenario
- use active pins as context where possible
- generate title, explanation, suitability, suggested action
- return 2–3 suggestions
- avoid real predictive claims

Run build.

### Slice 6D — Wire Feature Finder state in AppShell

Add state and handlers.

Pass needed props into `MapViewer`.

Opening Feature Finder should close other right-side panels.

Run build.

### Slice 6E — Add Feature Finder entry point

In `MapViewer` upper-left Map Tools card:

```text
[Add Pin]
[Pin Cleanup]
[Feature Finder]
```

Keep button clutter reasonable.

Clicking Feature Finder opens the right-side panel.

Run build and browser test.

### Slice 6F — Render Feature Finder panel

Panel should show:

- title
- short helper copy
- category buttons
- analysis state
- suggestions after category run
- suggestion cards with why/suitability/action
- save-as-pin button

Run build and browser test.

### Slice 6G — Render suggestion markers and hover highlight

Temporary Feature Finder markers should appear on the map.

Hovering a suggestion card should highlight/pulse the associated marker.

Run build and browser test.

### Slice 6H — Save suggestion as pin

Clicking Save should create a normal user pin.

Saved pin should appear on map as a regular pin.

Saved pin should be included in future Pin Cleanup analysis.

Run build and browser test.

### Slice 6I — Final Phase 6 browser test

Confirm:

- Feature Finder button appears.
- Opening Feature Finder closes Pin Cleanup and Folders.
- Feature Finder panel opens right side.
- User can choose Water, Glassing, Access.
- Analysis state appears briefly.
- Suggestions appear.
- Suggestions are scenario-aware and deterministic.
- Suggestion markers appear.
- Hovering suggestion highlights marker.
- Saving suggestion creates normal user pin.
- Saved pin appears in map popup.
- Saved pin is included in Pin Cleanup.
- Generate New Scenario still works.
- Add Pin still works.
- Pin Cleanup still works.
- Folders workflow still works.
- Build passes.
- Git status clean after commit/push.

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

- Confirm local app works.
- Confirm `npm run build` passes.
- Confirm `.env` is not listed in `git status`.
- Confirm only intended files are staged.

---

## User Working Style Preference

The user wants a hand-held build process.

Important:

- Go slowly.
- Use small slices.
- Do not collapse multiple actions into vague instructions.
- Explain what each command or file change does in plain English.
- Give exact file names and specific code block boundaries whenever possible.
- Use terminal checks often.
- Run `npm run build` after meaningful changes.
- Pause after small chunks.
- Ask for file contents/screenshots when needed instead of guessing.
- Do not jump ahead.
- Preserve the existing ScoutNavigator shell and Mapbox map.
- Keep all demo data honest as simulated.
- Keep code portfolio-readable.
- Do not build Scenario Analysis Summary.
- Do not build Ask Remi until explicitly requested.

---

## Prompt To Start Phase 6 Chat

Use this prompt with this updated `context.md`:

```text
Continue the ScoutNavigator build from the uploaded context.md file.

Project path:
/Users/kylezibrowski/Projects/scoutnavigator

We are starting Phase 6: Feature Finder MVP.

Current status:
- App is live at https://scoutnavigator.vercel.app/
- Phase 5 Pin Cleanup MVP is complete and committed/pushed.
- Phase 5.1 Folder Review + Manual Assignment is complete and committed/pushed.
- McCall scenario center was fixed and pushed.
- Vercel deployment is complete.
- Current live demo works: Generate Scenario, Add Pin, Pin Cleanup, Folders, folder detail, remove pin, add unassigned pin back to folder from popup.
- No localStorage yet.
- No Ask Remi yet.
- No Scenario Analysis Summary; user does not want that feature.

Phase 6 goal:
Build a map-native Feature Finder MVP.

Desired direction:
- Feature Finder should be a visual map workflow, not a chatbot.
- Start with three feature types if feasible: Water, Glassing, Access.
- Feature Finder opens from the upper-left Map Tools card.
- Opening Feature Finder should close Pin Cleanup and Folders.
- Show a right-side floating panel.
- User chooses what they are looking for.
- Show a brief analysis state.
- Generate 2–3 simulated feature/opportunity suggestions for the active scenario.
- Suggestions should include title, type, suitability/confidence, why explanation, and suggested action.
- Suggestions should be honest as simulated and should not claim real terrain/legal validation.
- Render suggestion markers on the map.
- Hovering a suggestion should highlight the related marker.
- User can save a suggestion as a normal pin.
- Saved Feature Finder pins should be included in future Pin Cleanup analysis.

Working style:
- Walk me through slowly.
- Use small slices.
- Explain exact files and line/block targets based on my actual files.
- Use terminal checks often.
- Run npm run build after meaningful changes.
- Commit and push only after working checkpoints.
- Ask for file contents/screenshots when needed instead of guessing.
```
