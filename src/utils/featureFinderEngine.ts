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

type TerrainGrid = {
  samples: TerrainSample[]
  samplesByCell: Map<string, TerrainSample>
  minElevationMeters: number
  maxElevationMeters: number
  elevationRangeMeters: number
  rows: number
  columns: number
}

type TerrainAspect =
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest'
  | 'flat'

type TerrainSummary = {
  sample: TerrainSample
  neighbors: TerrainSample[]
  reliefMeters: number
  meanNeighborDeltaMeters: number
  localHighMeters: number
  localLowMeters: number
  elevationPercentile: number
  aspect: TerrainAspect
  slopeStrength: number
  edgeScore: number
  distanceToEdge: number
}

type TerrainCandidate = {
  sample: TerrainSample
  score: number
  distanceToEdge: number
  explanation: string[]
}

const maxTerrainDerivedSuggestionsPerFeature = 12
const fallbackSuggestionsPerFeature = 3
const minimumSuggestionSpacingMeters = 365.76
const minimumTerrainCandidateScore = 45

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
  terrainScore,
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  featureType: FeatureFinderType
  template: FeatureFinderTemplate
  index: number
  terrainScore?: number
}) {
  const baseScore = 72
  const contextScore = getFeatureContextScore(featureType, pins)
  const scenarioScore = getScenarioContextScore(scenario, featureType)
  const indexPenalty = index * 3
  const terrainScoreBonus =
    typeof terrainScore === 'number' ? Math.round((terrainScore - 50) * 0.18) : 0

  return Math.max(
    64,
    Math.min(
      91,
      baseScore +
        contextScore +
        scenarioScore +
        template.suitabilityOffset +
        terrainScoreBonus -
        indexPenalty,
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

function getTerrainCellKey(row: number, column: number) {
  return `${row}:${column}`
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score))
}

function getApproximateDistanceMeters(
  firstCoordinates: ScoutPin['coordinates'],
  secondCoordinates: ScoutPin['coordinates'],
) {
  const [firstLongitude, firstLatitude] = firstCoordinates
  const [secondLongitude, secondLatitude] = secondCoordinates
  const midpointLatitude = ((firstLatitude + secondLatitude) / 2) * (Math.PI / 180)
  const metersPerLatitudeDegree = 111_320
  const metersPerLongitudeDegree =
    metersPerLatitudeDegree * Math.cos(midpointLatitude)
  const deltaLongitudeMeters =
    (secondLongitude - firstLongitude) * metersPerLongitudeDegree
  const deltaLatitudeMeters =
    (secondLatitude - firstLatitude) * metersPerLatitudeDegree

  return Math.hypot(deltaLongitudeMeters, deltaLatitudeMeters)
}

function buildTerrainGrid(terrainSamples: TerrainSample[]): TerrainGrid | null {
  const samplesWithGridPosition = terrainSamples.filter(
    (sample) =>
      typeof sample.row === 'number' &&
      typeof sample.column === 'number' &&
      typeof sample.rows === 'number' &&
      typeof sample.columns === 'number',
  )

  if (samplesWithGridPosition.length < 9) {
    return null
  }

  const firstSample = samplesWithGridPosition[0]
  const rows =
    firstSample.rows ??
    Math.max(...samplesWithGridPosition.map((sample) => sample.row ?? 0)) + 1
  const columns =
    firstSample.columns ??
    Math.max(...samplesWithGridPosition.map((sample) => sample.column ?? 0)) + 1

  if (rows < 3 || columns < 3) {
    return null
  }

  const samplesByCell = new Map<string, TerrainSample>()
  let minElevationMeters = Number.POSITIVE_INFINITY
  let maxElevationMeters = Number.NEGATIVE_INFINITY

  samplesWithGridPosition.forEach((sample) => {
    samplesByCell.set(getTerrainCellKey(sample.row ?? 0, sample.column ?? 0), sample)
    minElevationMeters = Math.min(minElevationMeters, sample.elevationMeters)
    maxElevationMeters = Math.max(maxElevationMeters, sample.elevationMeters)
  })

  return {
    samples: samplesWithGridPosition,
    samplesByCell,
    minElevationMeters,
    maxElevationMeters,
    elevationRangeMeters: Math.max(1, maxElevationMeters - minElevationMeters),
    rows,
    columns,
  }
}

function getGridSample(
  grid: TerrainGrid,
  row: number,
  column: number,
): TerrainSample | null {
  return grid.samplesByCell.get(getTerrainCellKey(row, column)) ?? null
}

function getNeighborSamples({
  grid,
  sample,
  radius = 1,
}: {
  grid: TerrainGrid
  sample: TerrainSample
  radius?: number
}) {
  if (typeof sample.row !== 'number' || typeof sample.column !== 'number') {
    return []
  }

  const neighbors: TerrainSample[] = []

  for (let rowOffset = -radius; rowOffset <= radius; rowOffset += 1) {
    for (let columnOffset = -radius; columnOffset <= radius; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue
      }

      const neighbor = getGridSample(
        grid,
        sample.row + rowOffset,
        sample.column + columnOffset,
      )

      if (neighbor) {
        neighbors.push(neighbor)
      }
    }
  }

  return neighbors
}

function getContextSamples({
  grid,
  sample,
  radius,
}: {
  grid: TerrainGrid
  sample: TerrainSample
  radius: number
}) {
  return getNeighborSamples({ grid, sample, radius })
}

function getContextMetrics({
  grid,
  sample,
  radius,
}: {
  grid: TerrainGrid
  sample: TerrainSample
  radius: number
}) {
  const contextSamples = getContextSamples({ grid, sample, radius })

  if (contextSamples.length === 0) {
    return null
  }

  const elevations = contextSamples.map((contextSample) => contextSample.elevationMeters)
  const higherSamples = contextSamples.filter(
    (contextSample) => contextSample.elevationMeters > sample.elevationMeters,
  )
  const lowerSamples = contextSamples.filter(
    (contextSample) => contextSample.elevationMeters < sample.elevationMeters,
  )
  const averageElevation =
    elevations.reduce((sum, elevation) => sum + elevation, 0) / elevations.length

  return {
    samples: contextSamples,
    highestElevationMeters: Math.max(...elevations),
    lowestElevationMeters: Math.min(...elevations),
    averageElevationMeters: averageElevation,
    reliefMeters: Math.max(...elevations) - Math.min(...elevations),
    higherSampleRatio: higherSamples.length / contextSamples.length,
    lowerSampleRatio: lowerSamples.length / contextSamples.length,
    similarLowSampleRatio:
      contextSamples.filter(
        (contextSample) =>
          contextSample.elevationMeters <= sample.elevationMeters + 8,
      ).length / contextSamples.length,
  }
}

function getDirectionalHighPoint({
  grid,
  sample,
  rowOffset,
  columnOffset,
  radius = 2,
}: {
  grid: TerrainGrid
  sample: TerrainSample
  rowOffset: number
  columnOffset: number
  radius?: number
}) {
  if (typeof sample.row !== 'number' || typeof sample.column !== 'number') {
    return null
  }

  const row = sample.row
  const column = sample.column
  const directionalSamples = Array.from({ length: radius }, (_, index) => index + 1)
    .map((distance) =>
      getGridSample(
        grid,
        row + rowOffset * distance,
        column + columnOffset * distance,
      ),
    )
    .filter((directionalSample): directionalSample is TerrainSample =>
      Boolean(directionalSample),
    )

  if (directionalSamples.length === 0) {
    return null
  }

  return Math.max(
    ...directionalSamples.map((directionalSample) => directionalSample.elevationMeters),
  )
}

function getDirectionalLowPoint({
  grid,
  sample,
  rowOffset,
  columnOffset,
  radius = 2,
}: {
  grid: TerrainGrid
  sample: TerrainSample
  rowOffset: number
  columnOffset: number
  radius?: number
}) {
  if (typeof sample.row !== 'number' || typeof sample.column !== 'number') {
    return null
  }

  const row = sample.row
  const column = sample.column
  const directionalSamples = Array.from({ length: radius }, (_, index) => index + 1)
    .map((distance) =>
      getGridSample(
        grid,
        row + rowOffset * distance,
        column + columnOffset * distance,
      ),
    )
    .filter((directionalSample): directionalSample is TerrainSample =>
      Boolean(directionalSample),
    )

  if (directionalSamples.length === 0) {
    return null
  }

  return Math.min(
    ...directionalSamples.map((directionalSample) => directionalSample.elevationMeters),
  )
}

function estimateSlopeAspect(grid: TerrainGrid, sample: TerrainSample): {
  aspect: TerrainAspect
  slopeStrength: number
} {
  if (typeof sample.row !== 'number' || typeof sample.column !== 'number') {
    return { aspect: 'flat', slopeStrength: 0 }
  }

  const west = getGridSample(grid, sample.row, sample.column - 1)
  const east = getGridSample(grid, sample.row, sample.column + 1)
  const south = getGridSample(grid, sample.row - 1, sample.column)
  const north = getGridSample(grid, sample.row + 1, sample.column)

  const westElevation = west?.elevationMeters ?? sample.elevationMeters
  const eastElevation = east?.elevationMeters ?? sample.elevationMeters
  const southElevation = south?.elevationMeters ?? sample.elevationMeters
  const northElevation = north?.elevationMeters ?? sample.elevationMeters
  const eastGradient = eastElevation - westElevation
  const northGradient = northElevation - southElevation
  const downhillEast = -eastGradient
  const downhillNorth = -northGradient
  const slopeStrength = Math.hypot(downhillEast, downhillNorth)

  if (slopeStrength < 1) {
    return { aspect: 'flat', slopeStrength }
  }

  const angle = (Math.atan2(downhillEast, downhillNorth) * 180) / Math.PI
  const compassAngle = (angle + 360) % 360
  const aspectLabels: TerrainAspect[] = [
    'north',
    'northeast',
    'east',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
  ]
  const aspectIndex = Math.round(compassAngle / 45) % aspectLabels.length

  return {
    aspect: aspectLabels[aspectIndex],
    slopeStrength,
  }
}

function isNorthFacingAspect(aspect: TerrainAspect) {
  return aspect === 'north' || aspect === 'northeast' || aspect === 'northwest'
}

function summarizeTerrainSample(
  grid: TerrainGrid,
  sample: TerrainSample,
): TerrainSummary | null {
  const neighbors = getNeighborSamples({ grid, sample, radius: 1 })

  if (neighbors.length < 3) {
    return null
  }

  const neighborElevations = neighbors.map((neighbor) => neighbor.elevationMeters)
  const highestNeighbor = Math.max(...neighborElevations)
  const lowestNeighbor = Math.min(...neighborElevations)
  const meanNeighborElevation =
    neighborElevations.reduce((sum, elevation) => sum + elevation, 0) /
    neighborElevations.length
  const meanNeighborDeltaMeters =
    neighborElevations.reduce(
      (sum, elevation) => sum + Math.abs(elevation - sample.elevationMeters),
      0,
    ) / neighborElevations.length
  const { aspect, slopeStrength } = estimateSlopeAspect(grid, sample)
  const row = sample.row ?? 0
  const column = sample.column ?? 0
  const distanceToEdge = Math.min(
    row,
    column,
    grid.rows - 1 - row,
    grid.columns - 1 - column,
  )
  const maxDistanceToEdge = Math.max(1, Math.min(grid.rows, grid.columns) / 2)

  return {
    sample,
    neighbors,
    reliefMeters: highestNeighbor - lowestNeighbor,
    meanNeighborDeltaMeters,
    localHighMeters: sample.elevationMeters - meanNeighborElevation,
    localLowMeters: meanNeighborElevation - sample.elevationMeters,
    elevationPercentile:
      (sample.elevationMeters - grid.minElevationMeters) / grid.elevationRangeMeters,
    aspect,
    slopeStrength,
    edgeScore: 1 - Math.min(1, distanceToEdge / maxDistanceToEdge),
    distanceToEdge,
  }
}

function getFeatureContextRadius(featureType: FeatureFinderType) {
  if (featureType === 'glassing-point') return 4
  if (featureType === 'saddle') return 6
  if (featureType === 'bedding-bench') return 3
  if (featureType === 'water' || featureType === 'wallow-potential') return 5

  return 3
}

function getFeatureInteriorBuffer(featureType: FeatureFinderType) {
  if (featureType === 'water') return 3
  if (
    featureType === 'saddle' ||
    featureType === 'bedding-bench' ||
    featureType === 'glassing-point' ||
    featureType === 'wallow-potential'
  ) {
    return 2
  }

  return 0
}

function isTooCloseToGridEdge({
  featureType,
  grid,
  summary,
}: {
  featureType: FeatureFinderType
  grid: TerrainGrid
  summary: TerrainSummary
}) {
  const buffer = getFeatureInteriorBuffer(featureType)

  if (buffer === 0) {
    return false
  }

  if (Math.min(grid.rows, grid.columns) <= buffer * 2 + 3) {
    return false
  }

  return summary.distanceToEdge < buffer
}

function getPerimeterPenalty({
  featureType,
  summary,
}: {
  featureType: FeatureFinderType
  summary: TerrainSummary
}) {
  const buffer = getFeatureInteriorBuffer(featureType)

  if (buffer === 0 || summary.distanceToEdge >= buffer + 2) {
    return 0
  }

  if (featureType === 'water') return 42
  if (featureType === 'saddle') return 28
  if (featureType === 'bedding-bench') return 22
  if (featureType === 'glassing-point') return 18
  if (featureType === 'wallow-potential') return 30

  return 0
}

function getSaddleTerrainPattern(grid: TerrainGrid, sample: TerrainSample) {
  const directionOffsets = [
    { rowOffset: 1, columnOffset: 0 },
    { rowOffset: 1, columnOffset: 1 },
    { rowOffset: 0, columnOffset: 1 },
    { rowOffset: -1, columnOffset: 1 },
    { rowOffset: -1, columnOffset: 0 },
    { rowOffset: -1, columnOffset: -1 },
    { rowOffset: 0, columnOffset: -1 },
    { rowOffset: 1, columnOffset: -1 },
  ]
  const directionProfiles = directionOffsets.map((offset) => ({
    high: getDirectionalHighPoint({
      grid,
      sample,
      rowOffset: offset.rowOffset,
      columnOffset: offset.columnOffset,
      radius: 6,
    }),
    low: getDirectionalLowPoint({
      grid,
      sample,
      rowOffset: offset.rowOffset,
      columnOffset: offset.columnOffset,
      radius: 6,
    }),
  }))
  const axisPairs = [
    { ridge: [0, 4], fall: [2, 6] },
    { ridge: [2, 6], fall: [0, 4] },
    { ridge: [1, 5], fall: [3, 7] },
    { ridge: [3, 7], fall: [1, 5] },
  ]
  const axisScores = axisPairs.map((axisPair) => {
    const ridgeHighs = axisPair.ridge.map((directionIndex) => directionProfiles[directionIndex].high)
    const fallLows = axisPair.fall.map((directionIndex) => directionProfiles[directionIndex].low)
    const opposingRiseMeters = ridgeHighs.every((elevation) => elevation !== null)
      ? Math.min(...ridgeHighs.map((elevation) => elevation ?? sample.elevationMeters)) -
        sample.elevationMeters
      : 0
    const crossDropMeters = fallLows.every((elevation) => elevation !== null)
      ? sample.elevationMeters -
        Math.max(...fallLows.map((elevation) => elevation ?? sample.elevationMeters))
      : 0

    return {
      opposingRiseMeters: Math.max(0, opposingRiseMeters),
      crossDropMeters: Math.max(0, crossDropMeters),
      passShapeMeters: Math.min(
        Math.max(0, opposingRiseMeters),
        Math.max(0, crossDropMeters),
      ),
    }
  })
  const bestAxisScore = axisScores.sort(
    (firstAxis, secondAxis) =>
      secondAxis.passShapeMeters - firstAxis.passShapeMeters ||
      secondAxis.opposingRiseMeters - firstAxis.opposingRiseMeters,
  )[0]
  const risingDirectionCount = directionProfiles.filter(
    (profile) =>
      profile.high !== null && profile.high - sample.elevationMeters >= 25,
  ).length
  const fallingDirectionCount = directionProfiles.filter(
    (profile) =>
      profile.low !== null && sample.elevationMeters - profile.low >= 18,
  ).length

  return {
    opposingRiseMeters: bestAxisScore?.opposingRiseMeters ?? 0,
    crossDropMeters: bestAxisScore?.crossDropMeters ?? 0,
    passShapeMeters: bestAxisScore?.passShapeMeters ?? 0,
    risingDirectionCount,
    fallingDirectionCount,
  }
}

function getTerrainExplanation({
  featureType,
  summary,
  score,
}: {
  featureType: FeatureFinderType
  summary: TerrainSummary
  score: number
}) {
  const elevationText = `${summary.sample.elevationFeet.toLocaleString()} ft`
  const explanation = [
    `Terrain sample ranked as a likely planning candidate based on local elevation and surrounding relief near ${elevationText}.`,
  ]

  if (featureType === 'glassing-point') {
    if (summary.aspect === 'northwest') {
      explanation.push(
        'Potential glassing knob/shoulder with nearby terrain relief.',
      )
      explanation.push(
        'Favorable viewing aspect for a morning glassing plan.',
      )
    } else if (summary.aspect === 'northeast') {
      explanation.push(
        'Potential glassing knob/shoulder with nearby terrain relief.',
      )
      explanation.push(
        'Favorable viewing aspect for an evening glassing plan.',
      )
    } else {
      explanation.push(
        'Potential glassing knob/shoulder with nearby terrain relief.',
      )
    }
  }

  if (featureType === 'saddle') {
    explanation.push(
      'Potential saddle-like connector identified from opposing terrain rises.',
    )
  }

  if (featureType === 'bedding-bench') {
    explanation.push(
      'Potential sidehill bench based on flatter relief within surrounding slope.',
    )

    if (isNorthFacingAspect(summary.aspect)) {
      explanation.push(
        'North-facing slope context increases bedding potential in this planning pass.',
      )
    }
  }

  if (featureType === 'water') {
    explanation.push(
      'Potential drainage/low terrain corridor from sampled elevation pattern.',
    )
  }

  if (featureType === 'access') {
    explanation.push(
      'Lower-gradient or edge-adjacent terrain may support a lower-impact approach, subject to legal access checks.',
    )
  }

  if (featureType === 'food') {
    explanation.push(
      'Moderate terrain position may be useful for comparing feed, bedding, and travel context in this planning pass.',
    )
  }

  if (featureType === 'wallow-potential') {
    explanation.push(
      'Low, flatter terrain may indicate wallow or moisture potential, but this is not confirmed water or sign.',
    )
  }

  explanation.push(`Terrain-shape score for this planning pass: ${Math.round(score)}%.`)

  return explanation
}

function scoreTerrainSampleForFeature({
  featureType,
  summary,
  grid,
}: {
  featureType: FeatureFinderType
  summary: TerrainSummary
  grid: TerrainGrid
}) {
  const reliefScore = Math.min(1, summary.reliefMeters / 60)
  const localHighScore = Math.max(0, Math.min(1, summary.localHighMeters / 45))
  const localLowScore = Math.max(0, Math.min(1, summary.localLowMeters / 45))
  const flatnessScore = 1 - Math.min(1, summary.meanNeighborDeltaMeters / 18)
  const contextRadius = getFeatureContextRadius(featureType)
  const contextMetrics = getContextMetrics({
    grid,
    sample: summary.sample,
    radius: contextRadius,
  })
  const contextReliefScore = Math.min(1, (contextMetrics?.reliefMeters ?? 0) / 120)
  const terrainDropsAwayScore = Math.min(
    1,
    Math.max(0, summary.sample.elevationMeters - (contextMetrics?.lowestElevationMeters ?? summary.sample.elevationMeters)) / 80,
  )
  const shoulderScore = Math.min(
    contextMetrics?.higherSampleRatio ?? 0,
    contextMetrics?.lowerSampleRatio ?? 0,
  ) * 2
  const sidehillScore = Math.min(
    1,
    Math.min(
      contextMetrics?.higherSampleRatio ?? 0,
      contextMetrics?.lowerSampleRatio ?? 0,
    ) * 2.8,
  )
  const localProminenceScore = Math.min(
    1,
    Math.max(
      0,
      summary.sample.elevationMeters -
        (contextMetrics?.averageElevationMeters ?? summary.sample.elevationMeters),
    ) / 55,
  )
  const localDropPatternScore = Math.min(
    1,
    terrainDropsAwayScore * 0.7 +
      Math.min(1, (contextMetrics?.lowerSampleRatio ?? 0) * 1.6) * 0.3,
  )
  const benchShelfScore = Math.min(
    1,
    flatnessScore * 0.45 + sidehillScore * 0.35 + contextReliefScore * 0.2,
  )
  const surroundingSlopeScore =
    contextReliefScore > 0.22 ? Math.min(1, contextReliefScore * 1.35) : 0
  const corridorLowScore = Math.min(1, (contextMetrics?.similarLowSampleRatio ?? 0) * 2.5)
  const elevatedScore = summary.elevationPercentile
  const midElevationScore = 1 - Math.abs(summary.elevationPercentile - 0.55) / 0.55
  const lowerMidElevationScore =
    1 - Math.abs(summary.elevationPercentile - 0.35) / 0.35
  const valleyBottomPenalty = summary.elevationPercentile < 0.12 ? 18 : 0
  const ridgeTopPenalty = summary.elevationPercentile > 0.88 ? 24 : 0
  const peakPenalty =
    summary.elevationPercentile > 0.9 && (contextMetrics?.higherSampleRatio ?? 0) < 0.08
      ? 32
      : 0
  const perimeterPenalty = getPerimeterPenalty({ featureType, summary })
  const northAspectScore = isNorthFacingAspect(summary.aspect) ? 1 : 0
  const glassingAspectScore =
    summary.aspect === 'northwest' || summary.aspect === 'northeast'
      ? 1
      : isNorthFacingAspect(summary.aspect)
        ? 0.55
        : 0

  if (featureType === 'glassing-point') {
    const manageableSlopeScore =
      summary.slopeStrength >= 2 && summary.slopeStrength <= 28 ? 1 : 0.35
    const broadPeakPenalty =
      summary.elevationPercentile > 0.82 &&
      (contextMetrics?.higherSampleRatio ?? 0) < 0.16 &&
      shoulderScore < 0.45
        ? 18
        : 0

    return clampScore(
      localProminenceScore * 22 +
        localDropPatternScore * 22 +
        shoulderScore * 18 +
        contextReliefScore * 14 +
        localHighScore * 10 +
        manageableSlopeScore * 8 +
        glassingAspectScore * 8 -
        peakPenalty -
        broadPeakPenalty -
        perimeterPenalty,
    )
  }

  if (featureType === 'saddle') {
    const saddlePattern = getSaddleTerrainPattern(grid, summary.sample)
    const opposingRiseScore = Math.min(1, saddlePattern.opposingRiseMeters / 70)
    const crossDropScore = Math.min(1, saddlePattern.crossDropMeters / 45)
    const passShapeScore = Math.min(1, saddlePattern.passShapeMeters / 42)
    const localPositionScore = Math.min(
      1,
      Math.max(
        0,
        summary.sample.elevationMeters -
          (contextMetrics?.lowestElevationMeters ?? summary.sample.elevationMeters),
      ) / 95,
    )
    const ridgeContextScore =
      saddlePattern.risingDirectionCount >= 2 && saddlePattern.fallingDirectionCount >= 2
        ? 1
        : 0.35
    const drainageBottomPenalty =
      localLowScore > 0.25 && (contextMetrics?.lowerSampleRatio ?? 0) < 0.18
        ? 34
        : 0
    const tooManyRisesPenalty =
      saddlePattern.risingDirectionCount >= 6 && saddlePattern.fallingDirectionCount <= 2
        ? 26
        : 0
    const weakPassPenalty = passShapeScore < 0.28 ? 22 : 0

    return clampScore(
      passShapeScore * 34 +
        crossDropScore * 22 +
        opposingRiseScore * 18 +
        localPositionScore * 12 +
        ridgeContextScore * 8 +
        Math.max(0, midElevationScore) * 6 +
        contextReliefScore * 6 -
        drainageBottomPenalty -
        tooManyRisesPenalty -
        weakPassPenalty -
        valleyBottomPenalty -
        ridgeTopPenalty -
        perimeterPenalty,
    )
  }

  if (featureType === 'bedding-bench') {
    const gentleSlopeScore =
      summary.slopeStrength >= 1 && summary.slopeStrength <= 20 ? 1 : 0.35
    const broadFlatPenalty =
      flatnessScore > 0.72 && contextReliefScore < 0.28 ? 18 : 0

    return clampScore(
      benchShelfScore * 30 +
        flatnessScore * 18 +
        sidehillScore * 18 +
        surroundingSlopeScore * 14 +
        gentleSlopeScore * 10 +
        northAspectScore * 14 +
        Math.max(0, lowerMidElevationScore) * 4 -
        valleyBottomPenalty -
        ridgeTopPenalty -
        broadFlatPenalty -
        perimeterPenalty,
    )
  }

  if (featureType === 'water') {
    const directionalLowPatternScore =
      corridorLowScore > 0.25 && localLowScore > 0.12 ? 1 : corridorLowScore

    return clampScore(
      (1 - elevatedScore) * 28 +
        directionalLowPatternScore * 34 +
        localLowScore * 18 +
        flatnessScore * 10 +
        contextReliefScore * 10 -
        ridgeTopPenalty -
        perimeterPenalty,
    )
  }

  if (featureType === 'access') {
    return clampScore(
      flatnessScore * 36 +
        lowerMidElevationScore * 26 +
        summary.edgeScore * 22 +
        (1 - Math.min(1, summary.slopeStrength / 35)) * 16 -
        ridgeTopPenalty,
    )
  }

  if (featureType === 'wallow-potential') {
    return clampScore(
      (1 - elevatedScore) * 28 +
        corridorLowScore * 22 +
        localLowScore * 18 +
        flatnessScore * 18 +
        northAspectScore * 8 +
        contextReliefScore * 6 -
        ridgeTopPenalty -
        perimeterPenalty,
    )
  }

  return clampScore(
    lowerMidElevationScore * 30 +
      flatnessScore * 26 +
      reliefScore * 16 +
      summary.edgeScore * 10 +
      midElevationScore * 18 -
      valleyBottomPenalty,
  )
}

function getTerrainCandidatesForFeature({
  featureType,
  terrainSamples,
}: {
  featureType: FeatureFinderType
  terrainSamples: TerrainSample[]
}): TerrainCandidate[] {
  const grid = buildTerrainGrid(terrainSamples)

  if (!grid) {
    return []
  }

  return grid.samples
    .map((sample) => {
      const summary = summarizeTerrainSample(grid, sample)

      if (!summary) {
        return null
      }

      if (isTooCloseToGridEdge({ featureType, grid, summary })) {
        return null
      }

      const score = scoreTerrainSampleForFeature({
        featureType,
        summary,
        grid,
      })

      return {
        sample,
        score,
        distanceToEdge: summary.distanceToEdge,
        explanation: getTerrainExplanation({
          featureType,
          summary,
          score,
        }),
      }
    })
    .filter((candidate): candidate is TerrainCandidate => Boolean(candidate))
    .sort((firstCandidate, secondCandidate) => {
      if (secondCandidate.score !== firstCandidate.score) {
        return secondCandidate.score - firstCandidate.score
      }

      return secondCandidate.distanceToEdge - firstCandidate.distanceToEdge
    })
}

function getSpacedTerrainCandidates(
  terrainCandidates: TerrainCandidate[],
): TerrainCandidate[] {
  const selectedCandidates: TerrainCandidate[] = []

  for (const candidate of terrainCandidates) {
    if (candidate.score < minimumTerrainCandidateScore) {
      continue
    }

    const isTooCloseToSelectedCandidate = selectedCandidates.some(
      (selectedCandidate) =>
        getApproximateDistanceMeters(
          candidate.sample.coordinates,
          selectedCandidate.sample.coordinates,
        ) < minimumSuggestionSpacingMeters,
    )

    if (isTooCloseToSelectedCandidate) {
      continue
    }

    selectedCandidates.push(candidate)

    if (selectedCandidates.length >= maxTerrainDerivedSuggestionsPerFeature) {
      break
    }
  }

  return selectedCandidates
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
  const terrainCandidates = getTerrainCandidatesForFeature({
    featureType,
    terrainSamples,
  })
  const spacedTerrainCandidates = getSpacedTerrainCandidates(terrainCandidates)

  if (spacedTerrainCandidates.length > 0) {
    return spacedTerrainCandidates.map((terrainCandidate, index) => {
      const template = templates[index % templates.length]

      return {
        id: createStableFeatureId({
          scenarioId: scenario.id,
          featureType,
          index,
        }),
        scenarioId: scenario.id,
        type: featureType,
        title:
          index < templates.length
            ? template.title
            : `${template.title} ${Math.floor(index / templates.length) + 1}`,
        coordinates: terrainCandidate.sample.coordinates,
        explanation: [...terrainCandidate.explanation, ...template.explanation],
        suggestedAction: template.suggestedAction,
        suitability: getSuitability({
          scenario,
          pins,
          featureType,
          template,
          index,
          terrainScore: terrainCandidate.score,
        }),
      }
    })
  }

  return templates.slice(0, fallbackSuggestionsPerFeature).map((template, index) => {
    return {
      id: createStableFeatureId({
        scenarioId: scenario.id,
        featureType,
        index,
      }),
      scenarioId: scenario.id,
      type: featureType,
      title: template.title,
      coordinates: createCoordinates(scenario, template.coordinateOffset),
      explanation: template.explanation,
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
