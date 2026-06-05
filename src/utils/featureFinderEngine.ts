import type {
  FeatureFinderSuggestion,
  FeatureFinderType,
  ScenarioRegion,
  ScoutPin,
  ScoutPinType,
  TerrainSample,
} from '../types/scout'

type FeatureFinderTemplate = {
  title: string
  coordinateOffset: [number, number]
  suitabilityOffset: number
  explanation: string[]
  suggestedAction: string
}

const featureLabels: Record<FeatureFinderType, string> = {
  water: 'Water',
  food: 'Food',
  'bedding-bench': 'Bedding Bench',
  saddle: 'Saddle',
  'glassing-point': 'Glassing Point',
  access: 'Access',
  'wallow-potential': 'Wallow Potential',
}

const relatedPinTypesByFeature: Record<FeatureFinderType, ScoutPinType[]> = {
  water: ['water', 'wallow', 'elk', 'deer', 'sign'],
  food: ['food', 'bedding', 'sign', 'deer', 'elk'],
  'bedding-bench': ['bedding', 'food', 'sign', 'elk', 'deer'],
  saddle: ['sign', 'elk', 'deer', 'food', 'bedding'],
  'glassing-point': ['glassing-point', 'deer', 'elk', 'sign'],
  access: ['access-point', 'truck', 'camp'],
  'wallow-potential': ['wallow', 'water', 'elk', 'sign'],
}

const templatesByFeature: Record<FeatureFinderType, FeatureFinderTemplate[]> = {
  water: [
    {
      title: 'Drainage Water Check',
      coordinateOffset: [0.018, -0.012],
      suitabilityOffset: 4,
      explanation: [
        'Positioned along a simulated drainage corridor in the active scenario.',
        'Nearby scouting context suggests this would be worth checking for water availability.',
        'Treat this as a map-planning candidate, not confirmed water.',
      ],
      suggestedAction:
        'Save as a water pin and verify seasonal flow or standing water in the field.',
    },
    {
      title: 'Benchside Water Candidate',
      coordinateOffset: [-0.014, 0.016],
      suitabilityOffset: -2,
      explanation: [
        'Placed near terrain that could connect bedding, travel, and water-seeking movement.',
        'Useful as a planning waypoint when comparing nearby sign, bedding, or wallow context.',
        'Seasonality and actual water presence are not validated in this demo.',
      ],
      suggestedAction:
        'Save as a water candidate and confirm with imagery, recent conditions, or field scouting.',
    },
    {
      title: 'Lower Draw Water Candidate',
      coordinateOffset: [0.006, 0.022],
      suitabilityOffset: -5,
      explanation: [
        'Located lower in the simulated terrain pattern where runoff or drainage collection may matter.',
        'Could support nearby travel or wallow scouting if water is present.',
        'This is a simulated opportunity marker only.',
      ],
      suggestedAction:
        'Save as a water pin if it helps anchor your next scouting pass.',
    },
  ],
  food: [
    {
      title: 'South Slope Feed Candidate',
      coordinateOffset: [0.02, 0.014],
      suitabilityOffset: 3,
      explanation: [
        'Represents a simulated open-slope food opportunity within the current scenario.',
        'Useful when compared against nearby bedding, cover, saddle, or access context.',
        'The app is not validating vegetation or forage quality yet.',
      ],
      suggestedAction:
        'Save as a food pin and compare it against bedding benches, saddles, and access routes.',
    },
    {
      title: 'Open Basin Feed Zone',
      coordinateOffset: [-0.017, -0.014],
      suitabilityOffset: 0,
      explanation: [
        'Placed in a likely planning area for open-country feeding movement.',
        'Food value increases when paired with secure bedding or a saddle between terrain features.',
        'This is simulated and should be field-verified.',
      ],
      suggestedAction:
        'Save as a food candidate and look for nearby bedding or travel features.',
    },
    {
      title: 'Edge Feed Opportunity',
      coordinateOffset: [0.012, -0.024],
      suitabilityOffset: -4,
      explanation: [
        'Represents a possible edge habitat planning point in the active scenario.',
        'May be useful if it sits between access, bedding, and glassing opportunities.',
        'No real forage layer is being analyzed in this MVP.',
      ],
      suggestedAction:
        'Save as a food pin if it helps build the broader scouting pattern.',
    },
  ],
  'bedding-bench': [
    {
      title: 'Upper Finger Bench',
      coordinateOffset: [-0.018, 0.012],
      suitabilityOffset: 5,
      explanation: [
        'Represents a bench-like position branching off a larger ridge system.',
        'Bedding value is strongest when paired with nearby food, water, and escape terrain.',
        'This is a simulated terrain feature and should not be treated as confirmed bedding.',
      ],
      suggestedAction:
        'Save as a bedding pin and compare it against wind, access pressure, and nearby feed.',
    },
    {
      title: 'Secluded Bench Candidate',
      coordinateOffset: [0.016, 0.018],
      suitabilityOffset: 1,
      explanation: [
        'Placed in a simulated flatter pocket within steeper surrounding terrain.',
        'Could represent a secure bedding candidate if visibility and escape routes make sense.',
        'Actual bedding use is not predicted by the demo.',
      ],
      suggestedAction:
        'Save as a bedding bench candidate and inspect surrounding approach routes.',
    },
    {
      title: 'Sidehill Bedding Bench',
      coordinateOffset: [-0.008, -0.022],
      suitabilityOffset: -3,
      explanation: [
        'Represents a possible bedding position along broken sidehill terrain.',
        'This type of point becomes more useful when related to saddles, food, and glassing pins.',
        'Field sign would be needed to confirm real animal use.',
      ],
      suggestedAction:
        'Save as a bedding pin if it helps organize the terrain story.',
    },
  ],
  saddle: [
    {
      title: 'Ridge Saddle Connector',
      coordinateOffset: [0.014, 0.02],
      suitabilityOffset: 6,
      explanation: [
        'Represents a low point between ridge features that could connect movement across terrain.',
        'Saddles become especially important when they sit between food and bedding context.',
        'This is a simulated terrain interpretation, not a validated animal movement route.',
      ],
      suggestedAction:
        'Save as a saddle pin and compare it against nearby food, bedding, and access pressure.',
    },
    {
      title: 'Food-to-Bedding Saddle',
      coordinateOffset: [-0.022, 0.006],
      suitabilityOffset: 3,
      explanation: [
        'Placed as a potential connector between feeding and bedding-oriented terrain.',
        'This kind of feature can become a strong Ask Remi input later when paired with other pins.',
        'Actual use depends on wind, pressure, species behavior, and field sign.',
      ],
      suggestedAction:
        'Save as a saddle pin and look for sign or trails crossing the low point.',
    },
    {
      title: 'Side Ridge Saddle',
      coordinateOffset: [0.022, -0.01],
      suitabilityOffset: -2,
      explanation: [
        'Represents a smaller terrain pinch or crossing point along a secondary ridge.',
        'May help explain how animals move between adjacent basins or slopes.',
        'The current MVP does not validate this against real elevation contours.',
      ],
      suggestedAction:
        'Save as a saddle candidate and verify against topo lines before relying on it.',
    },
  ],
  'glassing-point': [
    {
      title: 'Opposing Slope Glassing Set',
      coordinateOffset: [-0.016, -0.018],
      suitabilityOffset: 4,
      explanation: [
        'Placed to represent a vantage point looking across likely movement terrain.',
        'Useful when evaluating food, bedding benches, saddles, and water candidates from a distance.',
        'Visibility is not actually calculated in this MVP.',
      ],
      suggestedAction:
        'Save as a glassing pin and verify sightlines with map layers or in-person scouting.',
    },
    {
      title: 'Ridge-End Glassing Point',
      coordinateOffset: [0.024, 0.004],
      suitabilityOffset: 1,
      explanation: [
        'Represents a possible observation point near the end of a ridge or terrain edge.',
        'Could help monitor travel between drainages or across open slopes.',
        'This is a simulated planning marker, not a confirmed vantage point.',
      ],
      suggestedAction:
        'Save as a glassing pin and check whether it avoids skyline exposure.',
    },
    {
      title: 'Basin Viewpoint Candidate',
      coordinateOffset: [-0.006, 0.026],
      suitabilityOffset: -4,
      explanation: [
        'Placed as a possible viewpoint over a basin or broken terrain pocket.',
        'Most useful if it can watch food, bedding, or saddle features without disturbing them.',
        'Actual line-of-sight is not being measured yet.',
      ],
      suggestedAction:
        'Save as a glassing candidate and verify visibility before planning around it.',
    },
  ],
  access: [
    {
      title: 'Low-Impact Approach',
      coordinateOffset: [0.026, -0.004],
      suitabilityOffset: 2,
      explanation: [
        'Represents a possible approach route into the active scenario area.',
        'Access value depends on avoiding bedding areas, wind issues, and unnecessary exposure.',
        'This demo does not validate public/private access or legal route status.',
      ],
      suggestedAction:
        'Save as an access pin and verify legality, route conditions, and land ownership separately.',
    },
    {
      title: 'Ridge Access Candidate',
      coordinateOffset: [-0.024, -0.006],
      suitabilityOffset: 0,
      explanation: [
        'Placed as a potential ridge-based access point for scouting or glassing.',
        'Could support a low-disturbance approach if it avoids core bedding and feeding areas.',
        'Legal access and route safety are not analyzed in this MVP.',
      ],
      suggestedAction:
        'Save as an access candidate and validate the approach before field use.',
    },
    {
      title: 'Drainage Entry Option',
      coordinateOffset: [0.004, -0.028],
      suitabilityOffset: -5,
      explanation: [
        'Represents a possible drainage-based entry point into the scenario.',
        'May be useful if the route keeps wind and visibility in your favor.',
        'This is a planning marker only and does not confirm access rights.',
      ],
      suggestedAction:
        'Save as an access pin only after checking land status and route practicality.',
    },
  ],
  'wallow-potential': [
    {
      title: 'Drainage Flat Wallow Candidate',
      coordinateOffset: [-0.012, 0.024],
      suitabilityOffset: 5,
      explanation: [
        'Represents an area where a drainage may flatten enough to create wallow potential.',
        'Most useful when paired with water, elk sign, bedding, and rut movement context.',
        'This is not a confirmed wallow or real water validation.',
      ],
      suggestedAction:
        'Save as a wallow pin and verify moisture, tracks, rubs, and recent use in the field.',
    },
    {
      title: 'Timbered Wallow Candidate',
      coordinateOffset: [0.018, 0.018],
      suitabilityOffset: 1,
      explanation: [
        'Placed as a potential wallow feature near simulated security terrain.',
        'Wallow value depends heavily on season, water availability, and elk activity.',
        'The current demo does not inspect imagery or real hydrology.',
      ],
      suggestedAction:
        'Save as a wallow candidate and confirm with field sign before prioritizing.',
    },
    {
      title: 'Creek Bend Wallow Potential',
      coordinateOffset: [-0.026, -0.002],
      suitabilityOffset: -3,
      explanation: [
        'Represents a possible wet or flatter point near a drainage bend.',
        'Could become more important if nearby elk, water, or bedding pins exist.',
        'This suggestion is simulated for demo workflow purposes.',
      ],
      suggestedAction:
        'Save as a wallow pin if it helps guide a future scouting loop.',
    },
  ],
}

function getFeatureContextScore(featureType: FeatureFinderType, pins: ScoutPin[]) {
  const relatedTypes = relatedPinTypesByFeature[featureType]

  const relatedPins = pins.filter((pin) => relatedTypes.includes(pin.type))

  if (relatedPins.length >= 3) return 9
  if (relatedPins.length === 2) return 6
  if (relatedPins.length === 1) return 3

  return 0
}

function getScenarioContextScore(scenario: ScenarioRegion, featureType: FeatureFinderType) {
  const context = `${scenario.name} ${scenario.subtitle} ${scenario.terrainNotes} ${scenario.primaryUseCase}`.toLowerCase()

  if (featureType === 'glassing-point' && context.includes('glassing')) return 6
  if (featureType === 'water' && (context.includes('creek') || context.includes('water'))) return 6
  if (featureType === 'access' && context.includes('access')) return 6
  if (featureType === 'bedding-bench' && context.includes('benches')) return 6
  if (featureType === 'saddle' && (context.includes('ridge') || context.includes('ridgeline'))) return 6
  if (featureType === 'wallow-potential' && context.includes('elk')) return 5
  if (featureType === 'food' && (context.includes('basin') || context.includes('open'))) return 5

  return 2
}

function createStableFeatureId({
  scenarioId,
  featureType,
  index,
}: {
  scenarioId: string
  featureType: FeatureFinderType
  index: number
}) {
  return `${scenarioId}-feature-${featureType}-${index + 1}`
}

function getSuitability({
  scenario,
  pins,
  featureType,
  template,
  index,
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  featureType: FeatureFinderType
  template: FeatureFinderTemplate
  index: number
}) {
  const baseScore = 72
  const contextScore = getFeatureContextScore(featureType, pins)
  const scenarioScore = getScenarioContextScore(scenario, featureType)
  const indexPenalty = index * 3

  return Math.max(
    64,
    Math.min(
      91,
      baseScore + contextScore + scenarioScore + template.suitabilityOffset - indexPenalty,
    ),
  )
}

function createCoordinates(
  scenario: ScenarioRegion,
  coordinateOffset: FeatureFinderTemplate['coordinateOffset'],
): ScoutPin['coordinates'] {
  const [centerLng, centerLat] = scenario.camera.center
  const [lngOffset, latOffset] = coordinateOffset

  return [centerLng + lngOffset, centerLat + latOffset]
}

function getSortedTerrainSamples(terrainSamples: TerrainSample[]) {
  return [...terrainSamples].sort(
    (firstSample, secondSample) =>
      secondSample.elevationMeters - firstSample.elevationMeters,
  )
}

function getHighTerrainCandidate(
  terrainSamples: TerrainSample[],
  index: number,
): TerrainSample | null {
  const sortedSamples = getSortedTerrainSamples(terrainSamples)

  return sortedSamples[index] ?? null
}

function getMidElevationTerrainCandidate(
  terrainSamples: TerrainSample[],
  index: number,
): TerrainSample | null {
  const sortedSamples = getSortedTerrainSamples(terrainSamples)

  if (sortedSamples.length === 0) {
    return null
  }

  const middleIndex = Math.floor(sortedSamples.length / 2)
  const candidateIndex = Math.min(
    sortedSamples.length - 1,
    middleIndex + index - 1,
  )

  return sortedSamples[candidateIndex] ?? null
}

function getBenchTerrainCandidate(
  terrainSamples: TerrainSample[],
  index: number,
): TerrainSample | null {
  const sortedSamples = getSortedTerrainSamples(terrainSamples)

  if (sortedSamples.length === 0) {
    return null
  }

  const upperBandStartIndex = Math.floor(sortedSamples.length * 0.2)
  const upperBandEndIndex = Math.floor(sortedSamples.length * 0.55)
  const benchCandidates = sortedSamples.slice(
    upperBandStartIndex,
    upperBandEndIndex,
  )

  return benchCandidates[index] ?? benchCandidates[0] ?? null
}

function getTerrainCandidateForFeature({
  featureType,
  terrainSamples,
  index,
}: {
  featureType: FeatureFinderType
  terrainSamples: TerrainSample[]
  index: number
}): TerrainSample | null {
  if (terrainSamples.length === 0) {
    return null
  }

  if (featureType === 'glassing-point') {
    return getHighTerrainCandidate(terrainSamples, index)
  }

  if (featureType === 'bedding-bench') {
    return getBenchTerrainCandidate(terrainSamples, index)
  }

  if (featureType === 'saddle') {
    return getMidElevationTerrainCandidate(terrainSamples, index)
  }

  return null
}

export function getFeatureFinderLabel(featureType: FeatureFinderType) {
  return featureLabels[featureType]
}

export function getScoutPinTypeForFeature(featureType: FeatureFinderType): ScoutPinType {
  if (featureType === 'bedding-bench') return 'bedding'
  if (featureType === 'glassing-point') return 'glassing-point'
  if (featureType === 'access') return 'access-point'
  if (featureType === 'wallow-potential') return 'wallow'

  return featureType
}

export function createFeatureFinderSuggestions({
  scenario,
  pins,
  featureType,
  terrainSamples = [],
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  featureType: FeatureFinderType
  terrainSamples?: TerrainSample[]
}): FeatureFinderSuggestion[] {
      const templates = templatesByFeature[featureType]

  return templates.slice(0, 3).map((template, index) => {
    const terrainCandidate = getTerrainCandidateForFeature({
      featureType,
      terrainSamples,
      index,
    })

    return {
      id: createStableFeatureId({
        scenarioId: scenario.id,
        featureType,
        index,
      }),
      scenarioId: scenario.id,
      type: featureType,
      title: template.title,
      coordinates:
        terrainCandidate?.coordinates ??
        createCoordinates(scenario, template.coordinateOffset),
      explanation: terrainCandidate
        ? [
            `Terrain-sampled candidate at approximately ${terrainCandidate.elevationFeet.toLocaleString()} ft.`,
            ...template.explanation,
          ]
        : template.explanation,
      suggestedAction: template.suggestedAction,
      suitability: getSuitability({
        scenario,
        pins,
        featureType,
        template,
        index,
      }),
    }
  })
}