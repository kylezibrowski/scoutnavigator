import type { ScenarioRegion, ScoutPin, ScoutPinType } from '../types/scout'

type PinSeed = {
  name: string
  type: ScoutPinType
  longitudeOffset: number
  latitudeOffset: number
  notes: string
  observedAt: string
}

const fallbackPinSeeds: PinSeed[] = [
  {
    name: 'Primary glassing point',
    type: 'glassing-point',
    longitudeOffset: -0.014,
    latitudeOffset: 0.01,
    notes: 'Simulated vantage point for reviewing the surrounding terrain.',
    observedAt: '2026-08-18',
  },
  {
    name: 'Travel sign marker',
    type: 'sign',
    longitudeOffset: 0.012,
    latitudeOffset: -0.007,
    notes: 'Simulated sign marker for testing scouting workflows.',
    observedAt: '2026-08-19',
  },
  {
    name: 'Water source note',
    type: 'water',
    longitudeOffset: 0.018,
    latitudeOffset: -0.014,
    notes: 'Simulated water source placed for demo purposes.',
    observedAt: '2026-08-20',
  },
  {
    name: 'Cover edge bedding note',
    type: 'bedding',
    longitudeOffset: -0.024,
    latitudeOffset: -0.011,
    notes: 'Simulated bedding-style observation near cover.',
    observedAt: '2026-08-21',
  },
  {
    name: 'Camera check location',
    type: 'trail-camera',
    longitudeOffset: 0.008,
    latitudeOffset: 0.02,
    notes: 'Simulated trail camera location for workflow testing.',
    observedAt: '2026-08-22',
  },
  {
    name: 'Access edge camp option',
    type: 'camp',
    longitudeOffset: -0.03,
    latitudeOffset: 0.004,
    notes: 'Simulated camp candidate, not a real campsite recommendation.',
    observedAt: '2026-08-23',
  },
]

const scenarioPinSeedsByRegion: Record<string, PinSeed[]> = {
  'boise-national-forest': [
    {
      name: 'Ridge access glassing point',
      type: 'glassing-point',
      longitudeOffset: -0.022,
      latitudeOffset: 0.009,
      notes: 'Simulated glassing point along a ridge-access pattern east of Boise.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Drainage crossing sign',
      type: 'sign',
      longitudeOffset: 0.011,
      latitudeOffset: -0.013,
      notes: 'Simulated tracks and movement near a lower drainage crossing.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Creek-bottom water note',
      type: 'water',
      longitudeOffset: 0.018,
      latitudeOffset: -0.022,
      notes: 'Simulated water note biased toward lower creek-bottom terrain.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Timber pocket bedding edge',
      type: 'bedding',
      longitudeOffset: -0.028,
      latitudeOffset: -0.017,
      notes: 'Simulated bedding-style note near timber and broken foothill terrain.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Road-adjacent access point',
      type: 'access-point',
      longitudeOffset: 0.026,
      latitudeOffset: 0.006,
      notes: 'Simulated access marker near the outside edge of the scouting area.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Spike camp pullout',
      type: 'camp',
      longitudeOffset: -0.037,
      latitudeOffset: 0.003,
      notes: 'Simulated camp option for demo workflow testing only.',
      observedAt: '2026-08-23',
    },
  ],

  'sawtooth-stanley': [
    {
      name: 'Basin glassing knob',
      type: 'glassing-point',
      longitudeOffset: -0.02,
      latitudeOffset: 0.012,
      notes: 'Simulated high-country vantage point overlooking basin terrain.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Alpine lake water note',
      type: 'water',
      longitudeOffset: 0.015,
      latitudeOffset: -0.009,
      notes: 'Simulated water marker placed near lake-and-basin terrain.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Bench travel sign',
      type: 'sign',
      longitudeOffset: 0.024,
      latitudeOffset: 0.002,
      notes: 'Simulated sign note along a bench-like travel feature.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Upper basin bedding edge',
      type: 'bedding',
      longitudeOffset: -0.029,
      latitudeOffset: -0.014,
      notes: 'Simulated bedding-style observation near high-country cover.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Route planning waypoint',
      type: 'generic-marker',
      longitudeOffset: 0.006,
      latitudeOffset: 0.022,
      notes: 'Simulated waypoint used to test route-planning context.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Trailhead access marker',
      type: 'access-point',
      longitudeOffset: -0.034,
      latitudeOffset: 0.004,
      notes: 'Simulated access marker near the edge of the scenario area.',
      observedAt: '2026-08-23',
    },
  ],

  'mccall-payette': [
    {
      name: 'Bear drainage glassing point',
      type: 'glassing-point',
      longitudeOffset: -0.016,
      latitudeOffset: 0.013,
      notes: 'Simulated glassing point for checking timbered drainage terrain.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Creek system water note',
      type: 'water',
      longitudeOffset: 0.013,
      latitudeOffset: -0.011,
      notes: 'Simulated water note associated with a creek-system workflow.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Fresh sign on trail',
      type: 'sign',
      longitudeOffset: 0.025,
      latitudeOffset: -0.002,
      notes: 'Simulated sign marker near a timbered travel corridor.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Trail camera on pinch',
      type: 'trail-camera',
      longitudeOffset: -0.026,
      latitudeOffset: -0.015,
      notes: 'Simulated trail camera set near a terrain pinch point.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Spring bear food note',
      type: 'food',
      longitudeOffset: 0.004,
      latitudeOffset: 0.021,
      notes: 'Simulated food-source note for spring bear scouting context.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Lake access camp option',
      type: 'camp',
      longitudeOffset: -0.032,
      latitudeOffset: 0.005,
      notes: 'Simulated camp candidate near an access edge.',
      observedAt: '2026-08-23',
    },
  ],

  'salmon-challis': [
    {
      name: 'Backcountry glassing ridge',
      type: 'glassing-point',
      longitudeOffset: -0.019,
      latitudeOffset: 0.014,
      notes: 'Simulated glassing ridge for remote backcountry scenario testing.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Steep drainage water note',
      type: 'water',
      longitudeOffset: 0.012,
      latitudeOffset: -0.016,
      notes: 'Simulated water marker associated with a steep drainage.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Exposed ridge sign',
      type: 'sign',
      longitudeOffset: 0.026,
      latitudeOffset: 0.001,
      notes: 'Simulated sign note near exposed ridge-and-basin terrain.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Remote bedding pocket',
      type: 'bedding',
      longitudeOffset: -0.03,
      latitudeOffset: -0.013,
      notes: 'Simulated bedding-style observation in remote broken terrain.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Pack route waypoint',
      type: 'generic-marker',
      longitudeOffset: 0.006,
      latitudeOffset: 0.023,
      notes: 'Simulated waypoint for multi-day scouting route context.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Backcountry camp option',
      type: 'camp',
      longitudeOffset: -0.036,
      latitudeOffset: 0.004,
      notes: 'Simulated camp marker for demo purposes only.',
      observedAt: '2026-08-23',
    },
  ],

  'southwest-idaho': [
    {
      name: 'Rimrock glassing point',
      type: 'glassing-point',
      longitudeOffset: -0.024,
      latitudeOffset: 0.01,
      notes: 'Simulated mule deer glassing point along open rimrock terrain.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Canyon bottom water note',
      type: 'water',
      longitudeOffset: 0.014,
      latitudeOffset: -0.015,
      notes: 'Simulated water note placed for canyon-country scouting context.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Sage flat deer sign',
      type: 'deer',
      longitudeOffset: 0.027,
      latitudeOffset: -0.004,
      notes: 'Simulated deer observation in open sagebrush foothill terrain.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Breaks bedding edge',
      type: 'bedding',
      longitudeOffset: -0.031,
      latitudeOffset: -0.012,
      notes: 'Simulated bedding-style note along broken desert breaks.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Glassing route marker',
      type: 'generic-marker',
      longitudeOffset: 0.006,
      latitudeOffset: 0.021,
      notes: 'Simulated waypoint for a glassing route through open terrain.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Truck access pullout',
      type: 'truck',
      longitudeOffset: -0.038,
      latitudeOffset: 0.003,
      notes: 'Simulated truck access marker near the scenario edge.',
      observedAt: '2026-08-23',
    },
  ],

  'panhandle-lolo': [
    {
      name: 'Timbered glassing cut',
      type: 'glassing-point',
      longitudeOffset: -0.017,
      latitudeOffset: 0.013,
      notes: 'Simulated glassing cut in dense North Idaho-style timber.',
      observedAt: '2026-08-18',
    },
    {
      name: 'Creek bottom wallow',
      type: 'wallow',
      longitudeOffset: 0.012,
      latitudeOffset: -0.013,
      notes: 'Simulated wallow-style marker near creek-bottom terrain.',
      observedAt: '2026-08-19',
    },
    {
      name: 'Elk track crossing',
      type: 'elk',
      longitudeOffset: 0.024,
      latitudeOffset: -0.002,
      notes: 'Simulated elk sign near a timbered crossing pattern.',
      observedAt: '2026-08-20',
    },
    {
      name: 'Dark timber bedding pocket',
      type: 'bedding',
      longitudeOffset: -0.029,
      latitudeOffset: -0.016,
      notes: 'Simulated bedding-style note in dense cover.',
      observedAt: '2026-08-21',
    },
    {
      name: 'Trail camera on funnel',
      type: 'trail-camera',
      longitudeOffset: 0.005,
      latitudeOffset: 0.022,
      notes: 'Simulated trail camera set on a terrain funnel.',
      observedAt: '2026-08-22',
    },
    {
      name: 'Logging road access',
      type: 'access-point',
      longitudeOffset: -0.034,
      latitudeOffset: 0.005,
      notes: 'Simulated access marker for a timber-road style workflow.',
      observedAt: '2026-08-23',
    },
  ],
}

const supplementalPinTemplates: Array<
  Omit<PinSeed, 'longitudeOffset' | 'latitudeOffset' | 'observedAt'>
> = [
  {
    name: 'Secondary glassing point',
    type: 'glassing-point',
    notes: 'Simulated secondary vantage point for comparing terrain visibility.',
  },
  {
    name: 'Fresh sign note',
    type: 'sign',
    notes: 'Simulated field sign added to create a denser scouting pattern.',
  },
  {
    name: 'Water check',
    type: 'water',
    notes: 'Simulated water-related observation for testing pin cleanup density.',
  },
  {
    name: 'Bedding edge note',
    type: 'bedding',
    notes: 'Simulated bedding-style marker near cover-oriented terrain.',
  },
  {
    name: 'Travel corridor marker',
    type: 'generic-marker',
    notes: 'Simulated waypoint representing a possible movement corridor.',
  },
  {
    name: 'Camera candidate',
    type: 'trail-camera',
    notes: 'Simulated trail camera candidate used for workflow testing.',
  },
  {
    name: 'Access note',
    type: 'access-point',
    notes: 'Simulated access marker near the edge of a scouting route.',
  },
  {
    name: 'Food source note',
    type: 'food',
    notes: 'Simulated food-source marker for future grouping tests.',
  },
  {
    name: 'Elk observation',
    type: 'elk',
    notes: 'Simulated elk observation used to test mixed pin metadata.',
  },
  {
    name: 'Deer observation',
    type: 'deer',
    notes: 'Simulated deer observation used to test mixed pin metadata.',
  },
  {
    name: 'Shot opportunity note',
    type: 'shot',
    notes: 'Simulated shot marker for testing hunt-log style metadata.',
  },
  {
    name: 'Blood trail note',
    type: 'blood',
    notes: 'Simulated blood marker for testing recovery-style pin grouping.',
  },
]

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value += 0x6d2b79f5

    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)

    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function createObservedDate(index: number) {
  const day = 18 + (index % 10)

  return `2026-08-${String(day).padStart(2, '0')}`
}

function createSupplementalPinSeed(
  scenario: ScenarioRegion,
  index: number,
  random: () => number,
): PinSeed {
  const template = supplementalPinTemplates[index % supplementalPinTemplates.length]
  const angle = random() * Math.PI * 2
  const distance = 0.008 + random() * 0.038

  const longitudeOffset = Math.cos(angle) * distance
  const latitudeOffset = Math.sin(angle) * distance

  return {
    ...template,
    name: template.name,
    longitudeOffset,
    latitudeOffset,
    notes: `${template.notes} Scenario context: ${scenario.name}.`,
    observedAt: createObservedDate(index),
  }
}

function getScenarioPinCount(scenario: ScenarioRegion) {
  const random = createSeededRandom(hashString(`${scenario.id}-pin-count`))

  return 6 + Math.floor(random() * 25)
}

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

export function createScenarioPins(scenario: ScenarioRegion): ScoutPin[] {
  const [centerLongitude, centerLatitude] = scenario.camera.center
  const basePinSeeds = scenarioPinSeedsByRegion[scenario.id] ?? fallbackPinSeeds
  const targetPinCount = getScenarioPinCount(scenario)
  const random = createSeededRandom(hashString(`${scenario.id}-pin-layout`))

  const supplementalPinSeeds = Array.from(
    { length: Math.max(targetPinCount - basePinSeeds.length, 0) },
    (_, index) => createSupplementalPinSeed(scenario, index, random),
  )

  const pinSeeds = [...basePinSeeds, ...supplementalPinSeeds]

  return pinSeeds.map((pinSeed, index) => ({
    id: `${scenario.id}-pin-${index + 1}`,
    scenarioId: scenario.id,
    name: pinSeed.name,
    type: pinSeed.type,
    coordinates: [
      centerLongitude + pinSeed.longitudeOffset,
      centerLatitude + pinSeed.latitudeOffset,
    ],
    notes: pinSeed.notes,
    observedAt: pinSeed.observedAt,
    source: 'simulated',
  }))
}