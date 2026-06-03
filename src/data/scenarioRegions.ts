import type { ScenarioRegion } from "../types/scout"

export const scenarioRegions: ScenarioRegion[] = [
  {
    id: "boise-national-forest",
    name: "Boise National Forest",
    subtitle: "Mixed timber, drainages, and ridge access east of Boise",
    description:
      "A simulated scouting scenario built around steep foothill-to-mountain terrain, creek drainages, and practical access decisions.",
    terrainNotes:
      "Expect broken ridgelines, timber pockets, narrow drainages, and glassing opportunities across adjacent slopes.",
    primaryUseCase: "Elk scouting and access planning",
    camera: {
      center: [-115.7765, 44.0822],
      zoom: 10.2,
      pitch: 55,
      bearing: -18,
    },
  },
  {
    id: "sawtooth-stanley",
    name: "Sawtooth / Stanley Area",
    subtitle: "High-country basins and alpine terrain near Stanley",
    description:
      "A simulated high-country scenario focused on basin access, elevation change, and terrain features that shape movement.",
    terrainNotes:
      "Expect dramatic relief, open basins, ridgelines, benches, and long sightlines across rugged mountain terrain.",
    primaryUseCase: "High-country glassing and route planning",
    camera: {
      center: [-115.0839, 44.2176],
      zoom: 10.2,
      pitch: 58,
      bearing: -24,
    },
  },
  {
    id: "mccall-payette",
    name: "Payette National Forest / McCall",
    subtitle: "Timbered mountain country, lakes, and access corridors",
    description:
      "A simulated scouting scenario with dense timber, water features, and realistic access tradeoffs around central Idaho terrain.",
    terrainNotes:
      "Expect timbered slopes, lake and creek systems, benches, and access points that reward careful map review.",
    primaryUseCase: "Spring bear notes and elk preseason scouting",
    camera: {
      center: [-116.1035, 44.911],
      zoom: 10.2,
      pitch: 55,
      bearing: -12,
    },
  },
  {
    id: "salmon-challis",
    name: "Salmon-Challis Region",
    subtitle: "Remote central Idaho terrain with big elevation swings",
    description:
      "A simulated backcountry scenario centered on remote drainages, exposed ridges, and longer approach planning.",
    terrainNotes:
      "Expect steep drainages, open slopes, ridge systems, and terrain that makes route choice and grouping notes important.",
    primaryUseCase: "Backcountry scouting and multi-day planning",
    camera: {
      center: [-114.0332, 44.9735],
      zoom: 10.2,
      pitch: 58,
      bearing: -20,
    },
  },
  {
    id: "southwest-idaho",
    name: "Southwest Idaho Region",
    subtitle: "Open desert breaks, canyon country, and sagebrush foothills",
    description:
      "A simulated scouting scenario inspired by southwest Idaho terrain, with more open country, broken draws, and glassing-oriented movement.",
    terrainNotes:
      "Expect sagebrush basins, canyon edges, dry drainages, rimrock, and terrain where visibility and access lines matter.",
    primaryUseCase: "Mule deer scouting and glassing routes",
    camera: {
      center: [-116.9026, 42.8366],
      zoom: 10.2,
      pitch: 52,
      bearing: -16,
    },
  },
  {
    id: "panhandle-lolo",
    name: "Panhandle / Lolo Region",
    subtitle: "North Idaho timber, steep drainages, and dense cover",
    description:
      "A simulated north Idaho scenario focused on timbered ridges, thick cover, narrow drainages, and lower-visibility scouting decisions.",
    terrainNotes:
      "Expect heavy timber, creek bottoms, steep sidehills, ridge systems, and terrain where pin organization matters because visibility is limited.",
    primaryUseCase: "Elk scouting in timbered mountain terrain",
    camera: {
      center: [-115.7065, 46.4932],
      zoom: 10.2,
      pitch: 56,
      bearing: -22,
    },
  },
]