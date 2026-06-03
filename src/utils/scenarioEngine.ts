import type { ScenarioRegion, ScoutPin, ScoutPinType } from '../types/scout'

type PinSeed = {
  name: string
  type: ScoutPinType
  longitudeOffset: number
  latitudeOffset: number
  notes: string
  observedAt: string
}

const scenarioPinSeeds: PinSeed[] = [
  {
    name: 'North ridge glassing knob',
    type: 'glassing-point',
    longitudeOffset: -0.018,
    latitudeOffset: 0.012,
    notes: 'Simulated vantage point overlooking adjacent benches and timber pockets.',
    observedAt: '2026-08-18',
  },
  {
    name: 'Creek crossing sign',
    type: 'sign',
    longitudeOffset: 0.014,
    latitudeOffset: -0.009,
    notes: 'Simulated tracks and trail activity near a drainage crossing.',
    observedAt: '2026-08-19',
  },
  {
    name: 'Lower drainage water',
    type: 'water',
    longitudeOffset: 0.026,
    latitudeOffset: -0.018,
    notes: 'Simulated water source placed near lower terrain for demo purposes.',
    observedAt: '2026-08-20',
  },
  {
    name: 'Evening bedding edge',
    type: 'bedding',
    longitudeOffset: -0.032,
    latitudeOffset: -0.015,
    notes: 'Simulated bedding-style observation near cover and broken terrain.',
    observedAt: '2026-08-21',
  },
  {
    name: 'Trail camera set',
    type: 'trail-camera',
    longitudeOffset: 0.006,
    latitudeOffset: 0.023,
    notes: 'Simulated camera location near a travel corridor.',
    observedAt: '2026-08-22',
  },
  {
    name: 'Spike camp option',
    type: 'camp',
    longitudeOffset: -0.041,
    latitudeOffset: 0.005,
    notes: 'Simulated camp candidate near access edge, not a real campsite recommendation.',
    observedAt: '2026-08-23',
  },
]

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

  return scenarioPinSeeds.map((pinSeed, index) => ({
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