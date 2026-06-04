import type {
  PinCleanupSuggestion,
  ScenarioRegion,
  ScoutPin,
  ScoutPinType,
} from '../types/scout'

type PinPairScore = {
  pins: [ScoutPin, ScoutPin]
  score: number
  distanceMiles: number
  daysApart: number
  typeAffinity: number
}

const EARTH_RADIUS_MILES = 3958.8

const relatedPinTypes: Array<Set<ScoutPinType>> = [
  new Set(['sign', 'water', 'bedding']),
  new Set(['bedding', 'food', 'sign']),
  new Set(['access-point', 'truck', 'camp']),
  new Set(['glassing-point', 'deer', 'elk', 'sign']),
  new Set(['blood', 'shot', 'sign']),
  new Set(['wallow', 'water', 'elk']),
]

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

function getDaysApart(firstDate: string, secondDate: string) {
  const firstTime = new Date(firstDate).getTime()
  const secondTime = new Date(secondDate).getTime()

  if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) {
    return 30
  }

  const millisecondsApart = Math.abs(firstTime - secondTime)
  return Math.round(millisecondsApart / (1000 * 60 * 60 * 24))
}

function getProximityScore(distanceMiles: number) {
  if (distanceMiles <= 0.25) return 100
  if (distanceMiles <= 0.5) return 90
  if (distanceMiles <= 0.75) return 80
  if (distanceMiles <= 1) return 70
  if (distanceMiles <= 1.5) return 55
  if (distanceMiles <= 2) return 40

  return 20
}

function getTimeScore(daysApart: number) {
  if (daysApart <= 3) return 100
  if (daysApart <= 7) return 90
  if (daysApart <= 14) return 80
  if (daysApart <= 30) return 65
  if (daysApart <= 60) return 45

  return 25
}

function getTypeAffinity(firstType: ScoutPinType, secondType: ScoutPinType) {
  if (firstType === secondType) {
    return 80
  }

  const isRelated = relatedPinTypes.some(
    (typeSet) => typeSet.has(firstType) && typeSet.has(secondType),
  )

  return isRelated ? 90 : 40
}

function scorePinPair(firstPin: ScoutPin, secondPin: ScoutPin): PinPairScore {
  const distanceMiles = getDistanceMiles(firstPin.coordinates, secondPin.coordinates)
  const daysApart = getDaysApart(firstPin.observedAt, secondPin.observedAt)
  const typeAffinity = getTypeAffinity(firstPin.type, secondPin.type)

  const proximityScore = getProximityScore(distanceMiles)
  const timeScore = getTimeScore(daysApart)

  const score = Math.round(
    proximityScore * 0.5 + timeScore * 0.3 + typeAffinity * 0.2,
  )

  return {
    pins: [firstPin, secondPin],
    score,
    distanceMiles,
    daysApart,
    typeAffinity,
  }
}

function createStableSuggestionId(scenarioId: string, pinIds: string[]) {
  return `${scenarioId}-cleanup-${[...pinIds].sort().join('-')}`
}

function formatDistance(distanceMiles: number) {
  if (distanceMiles < 0.1) {
    return 'less than 0.1 miles'
  }

  return `${distanceMiles.toFixed(1)} miles`
}

function getDominantTypes(pins: ScoutPin[]) {
  const typeCounts = pins.reduce<Record<string, number>>((counts, pin) => {
    counts[pin.type] = (counts[pin.type] ?? 0) + 1
    return counts
  }, {})

  return Object.entries(typeCounts)
    .sort((firstType, secondType) => secondType[1] - firstType[1])
    .map(([type]) => type as ScoutPinType)
}

function hasEveryType(pins: ScoutPin[], types: ScoutPinType[]) {
  const pinTypes = new Set(pins.map((pin) => pin.type))
  return types.every((type) => pinTypes.has(type))
}

function createSuggestionName(pins: ScoutPin[], scenario: ScenarioRegion) {
  if (hasEveryType(pins, ['water', 'sign'])) return 'Water + Sign Corridor'
  if (hasEveryType(pins, ['elk', 'wallow'])) return 'Elk + Wallow Pattern'
  if (hasEveryType(pins, ['bedding', 'food'])) return 'Food + Bedding Pattern'
  if (pins.some((pin) => ['access-point', 'truck', 'camp'].includes(pin.type))) {
    return 'Access + Camp Plan'
  }
  if (pins.some((pin) => ['glassing-point', 'deer', 'elk'].includes(pin.type))) {
    return 'Glassing Set'
  }

  const dominantType = getDominantTypes(pins)[0]

  if (dominantType === 'sign') return 'Sign Cluster'
  if (dominantType === 'water') return 'Water Pattern'
  if (dominantType === 'bedding') return 'Bedding Pattern'

  return `${scenario.name.split('/')[0].trim()} Scouting Zone`
}

function createExplanation({
  pins,
  averageDistanceMiles,
  maxDaysApart,
  dominantTypes,
}: {
  pins: ScoutPin[]
  averageDistanceMiles: number
  maxDaysApart: number
  dominantTypes: ScoutPinType[]
}) {
  const formattedTypes = dominantTypes
    .slice(0, 3)
    .map((type) => type.replace('-', ' '))
    .join(', ')

  return [
    `${pins.length} pins are clustered within about ${formatDistance(
      averageDistanceMiles,
    )} on average.`,
    `Observations were dropped within ${maxDaysApart} days of each other.`,
    `${formattedTypes} context suggests these pins may belong in one cleanup group.`,
  ]
}

function getSuggestionConfidence(pairScores: PinPairScore[]) {
  const averageScore =
    pairScores.reduce((total, pairScore) => total + pairScore.score, 0) /
    pairScores.length

  return Math.max(65, Math.min(90, Math.round(averageScore)))
}

function getAverageDistance(pairScores: PinPairScore[]) {
  return (
    pairScores.reduce((total, pairScore) => total + pairScore.distanceMiles, 0) /
    pairScores.length
  )
}

function getMaxDaysApart(pairScores: PinPairScore[]) {
  return Math.max(...pairScores.map((pairScore) => pairScore.daysApart))
}

function buildGroupFromSeedPair(seedPair: PinPairScore, allPins: ScoutPin[]) {
  const groupPins = [...seedPair.pins]

  allPins.forEach((candidatePin) => {
    const alreadyIncluded = groupPins.some((pin) => pin.id === candidatePin.id)

    if (alreadyIncluded) {
      return
    }

    const candidateScores = groupPins.map((groupPin) =>
      scorePinPair(candidatePin, groupPin),
    )

    const averageScore =
      candidateScores.reduce((total, pairScore) => total + pairScore.score, 0) /
      candidateScores.length

    if (averageScore >= 68) {
      groupPins.push(candidatePin)
    }
  })

  return groupPins
}

function getPairScoresForGroup(pins: ScoutPin[]) {
  const pairScores: PinPairScore[] = []

  for (let firstIndex = 0; firstIndex < pins.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < pins.length;
      secondIndex += 1
    ) {
      pairScores.push(scorePinPair(pins[firstIndex], pins[secondIndex]))
    }
  }

  return pairScores
}

export function createPinCleanupSuggestions({
  scenario,
  pins,
  dismissedSuggestionIds,
}: {
  scenario: ScenarioRegion
  pins: ScoutPin[]
  dismissedSuggestionIds: string[]
}): PinCleanupSuggestion[] {
  if (pins.length < 3) {
    return []
  }

  const scoredPairs: PinPairScore[] = []

  for (let firstIndex = 0; firstIndex < pins.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < pins.length;
      secondIndex += 1
    ) {
      const pairScore = scorePinPair(pins[firstIndex], pins[secondIndex])

      if (pairScore.score >= 65) {
        scoredPairs.push(pairScore)
      }
    }
  }

  const sortedPairs = scoredPairs.sort(
    (firstPair, secondPair) => secondPair.score - firstPair.score,
  )

  const suggestions: PinCleanupSuggestion[] = []
  const usedPinIds = new Set<string>()

  sortedPairs.forEach((seedPair) => {
    if (suggestions.length >= 3) {
      return
    }

    const seedPinIds = seedPair.pins.map((pin) => pin.id)
    const seedAlreadyUsed = seedPinIds.some((pinId) => usedPinIds.has(pinId))

    if (seedAlreadyUsed) {
      return
    }

    const groupPins = buildGroupFromSeedPair(seedPair, pins)
    const groupPinIds = groupPins.map((pin) => pin.id)

    if (groupPins.length < 2) {
      return
    }

    const suggestionId = createStableSuggestionId(scenario.id, groupPinIds)

    if (dismissedSuggestionIds.includes(suggestionId)) {
      return
    }

    const pairScores = getPairScoresForGroup(groupPins)

    if (pairScores.length === 0) {
      return
    }

    const dominantTypes = getDominantTypes(groupPins)
    const title = createSuggestionName(groupPins, scenario)
    const confidence = getSuggestionConfidence(pairScores)

    suggestions.push({
      id: suggestionId,
      scenarioId: scenario.id,
      title,
      suggestedFolderName: title,
      pinIds: groupPinIds,
      explanation: createExplanation({
        pins: groupPins,
        averageDistanceMiles: getAverageDistance(pairScores),
        maxDaysApart: getMaxDaysApart(pairScores),
        dominantTypes,
      }),
      confidence,
    })

    groupPinIds.forEach((pinId) => usedPinIds.add(pinId))
  })

  return suggestions
}