import type {
  AskRemiConsideredPin,
  AskRemiContext,
  AskRemiPinPriority,
  AskRemiPinRelationship,
  AskRemiPinSource,
  SavedPinFolder,
  ScenarioRegion,
  ScoutPin,
  ScoutPinType,
} from '../types/scout'

type BuildAskRemiContextInput = {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  folders?: SavedPinFolder[]
}

const EARTH_RADIUS_MILES = 3958.8

const highValueObservedTypes = new Set<ScoutPinType>([
  'sign',
  'elk',
  'deer',
  'wallow',
  'water',
])

const terrainPlanningTypes = new Set<ScoutPinType>([
  'food',
  'bedding',
  'saddle',
  'glassing-point',
])

const accessPlanningTypes = new Set<ScoutPinType>([
  'access-point',
  'truck',
  'camp',
])

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

function getDistanceMiles(
  firstCoordinates: ScoutPin['coordinates'],
  secondCoordinates: ScoutPin['coordinates'],
) {
  const [firstLng, firstLat] = firstCoordinates
  const [secondLng, secondLat] = secondCoordinates

  const latDelta = toRadians(secondLat - firstLat)
  const lngDelta = toRadians(secondLng - firstLng)

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(firstLat)) *
      Math.cos(toRadians(secondLat)) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_MILES * c
}

function getAskRemiPinSource(pin: ScoutPin): AskRemiPinSource {
  return pin.source === 'simulated' ? 'scenario' : pin.source
}

function getPriorityFromScore(score: number): AskRemiPinPriority {
  if (score >= 85) return 'high'
  if (score >= 70) return 'medium-high'
  if (score >= 45) return 'medium'

  return 'low'
}

function getPinPriorityScore(pin: ScoutPin, folderCount: number) {
  let score = 35

  if (pin.source === 'simulated') {
    score = 50
  }

  if (pin.source === 'user') {
    score = highValueObservedTypes.has(pin.type) ? 88 : 62
  }

  if (pin.source === 'feature-finder') {
    score = 86
  }

  if (terrainPlanningTypes.has(pin.type)) {
    score += 8
  }

  if (accessPlanningTypes.has(pin.type)) {
    score += 4
  }

  if (pin.type === 'generic-marker') {
    score -= 18
  }

  if (folderCount > 0) {
    score += highValueObservedTypes.has(pin.type) ? 8 : 12
  }

  return Math.max(0, Math.min(100, score))
}

function getPlanningReasons(pin: ScoutPin, folderNames: string[]) {
  const reasons: string[] = []

  if (pin.source === 'feature-finder') {
    reasons.push('Saved Feature Finder terrain planning candidate.')
  } else if (pin.source === 'user') {
    reasons.push('User-created scouting pin.')
  } else {
    reasons.push('Scenario context pin.')
  }

  if (highValueObservedTypes.has(pin.type)) {
    reasons.push('Pin type is important for hunt planning context.')
  }

  if (terrainPlanningTypes.has(pin.type)) {
    reasons.push('Terrain-oriented pin type can help shape a route or setup.')
  }

  if (folderNames.length > 0) {
    reasons.push(`Included in folder: ${folderNames.join(', ')}.`)
  }

  if (pin.notes.trim().length > 0) {
    reasons.push('Includes notes that future Ask Remi planning can reference.')
  }

  return reasons
}

function getRelationshipType(
  firstPin: AskRemiConsideredPin,
  secondPin: AskRemiConsideredPin,
): AskRemiPinRelationship['relationship'] {
  const types = new Set([firstPin.type, secondPin.type])

  if (types.has('sign') && types.has('water')) return 'sign-water'
  if (types.has('food') && types.has('bedding')) return 'food-bedding'
  if (types.has('elk') && types.has('wallow')) return 'elk-wallow'
  if (types.has('glassing-point')) return 'glassing-context'
  if (
    types.has('access-point') ||
    types.has('truck') ||
    types.has('camp')
  ) {
    return 'access-context'
  }

  return 'nearby'
}

function getRelationshipSummary(
  firstPin: AskRemiConsideredPin,
  secondPin: AskRemiConsideredPin,
  distanceMiles: number,
) {
  return `${firstPin.name} and ${secondPin.name} are ${distanceMiles.toFixed(
    1,
  )} miles apart and may be useful to compare as planning context.`
}

function buildRelationships(
  pins: AskRemiConsideredPin[],
): AskRemiPinRelationship[] {
  const relationships: AskRemiPinRelationship[] = []

  for (let firstIndex = 0; firstIndex < pins.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < pins.length; secondIndex += 1) {
      const firstPin = pins[firstIndex]
      const secondPin = pins[secondIndex]
      const distanceMiles = getDistanceMiles(
        firstPin.coordinates,
        secondPin.coordinates,
      )

      if (distanceMiles > 1.5) {
        continue
      }

      relationships.push({
        id: `${firstPin.id}-${secondPin.id}`,
        pinIds: [firstPin.id, secondPin.id],
        relationship: getRelationshipType(firstPin, secondPin),
        distanceMiles,
        summary: getRelationshipSummary(firstPin, secondPin, distanceMiles),
      })
    }
  }

  return relationships.sort(
    (firstRelationship, secondRelationship) =>
      firstRelationship.distanceMiles - secondRelationship.distanceMiles ||
      firstRelationship.id.localeCompare(secondRelationship.id),
  )
}

export function buildAskRemiContext({
  scenario,
  pins,
  folders = [],
}: BuildAskRemiContextInput): AskRemiContext {
  const scenarioFolders = folders.filter(
    (folder) => folder.scenarioId === scenario.id,
  )

  const consideredPins = pins
    .filter((pin) => pin.scenarioId === scenario.id)
    .map<AskRemiConsideredPin>((pin) => {
      const pinFolders = scenarioFolders.filter((folder) =>
        folder.pinIds.includes(pin.id),
      )
      const folderIds = pinFolders.map((folder) => folder.id)
      const folderNames = pinFolders.map((folder) => folder.name)
      const priorityScore = getPinPriorityScore(pin, pinFolders.length)

      return {
        id: pin.id,
        scenarioId: pin.scenarioId,
        name: pin.name,
        type: pin.type,
        source: getAskRemiPinSource(pin),
        coordinates: pin.coordinates,
        notes: pin.notes,
        observedAt: pin.observedAt,
        priority: getPriorityFromScore(priorityScore),
        priorityScore,
        folderIds,
        folderNames,
        planningReasons: getPlanningReasons(pin, folderNames),
      }
    })
    .sort(
      (firstPin, secondPin) =>
        secondPin.priorityScore - firstPin.priorityScore ||
        firstPin.name.localeCompare(secondPin.name) ||
        firstPin.id.localeCompare(secondPin.id),
    )

  return {
    scenario,
    pins: consideredPins,
    folders: scenarioFolders,
    relationships: buildRelationships(consideredPins),
  }
}
