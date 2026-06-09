import type {
  AskRemiConsideredPin,
  AskRemiContext,
  AskRemiPlan,
  AskRemiPlanSection,
} from '../types/scout'

const sectionTitles: Record<AskRemiPlanSection['id'], string> = {
  'best-plan': 'Best Plan',
  'morning-approach': 'Morning Approach',
  'evening-approach': 'Evening Approach',
  'why-this-area': 'Why This Area',
  'key-pins-considered': 'Key Pins Considered',
  'risks-unknowns': 'Risks / Unknowns',
  'next-pins-to-verify': 'Next Pins to Verify',
}

function formatPinType(type: AskRemiConsideredPin['type']) {
  return type.replaceAll('-', ' ')
}

function createSection(
  id: AskRemiPlanSection['id'],
  items: string[],
): AskRemiPlanSection {
  return {
    id,
    title: sectionTitles[id],
    items,
  }
}

function getTopPins(context: AskRemiContext) {
  return [...context.pins]
    .sort(
      (firstPin, secondPin) =>
        secondPin.priorityScore - firstPin.priorityScore ||
        firstPin.name.localeCompare(secondPin.name) ||
        firstPin.id.localeCompare(secondPin.id),
    )
    .slice(0, 6)
}

function describePin(pin: AskRemiConsideredPin) {
  return `${pin.name} (${formatPinType(pin.type)}, ${pin.priority} priority, ${pin.source}).`
}

export function createAskRemiPlan(context: AskRemiContext): AskRemiPlan {
  const topPins = getTopPins(context)
  const primaryPin = topPins[0]
  const keyPinItems =
    topPins.length > 0
      ? topPins.map((pin) => describePin(pin))
      : ['No active pins are available yet. Add or save pins before relying on this planning candidate.']

  const relationshipItems = context.relationships
    .slice(0, 3)
    .map((relationship) => relationship.summary)

  const bestPlanItems = primaryPin
    ? [
        `Use ${primaryPin.name} as the first planning candidate, then compare it against the next highest-priority pins before committing to a route.`,
        'Treat this as a map-planning pass only and verify in field before making hunt decisions.',
      ]
    : [
        'Build the first planning candidate after adding user pins, saving Feature Finder terrain pins, or generating scenario context.',
      ]

  const nextPinsToVerify = topPins
    .filter((pin) => pin.source !== 'scenario')
    .slice(0, 4)
    .map(
      (pin) =>
        `Verify ${pin.name} in field and update notes if the ${formatPinType(
          pin.type,
        )} context is still useful.`,
    )

  return {
    id: `${context.scenario.id}-ask-remi-plan`,
    scenarioId: context.scenario.id,
    title: `Ask Remi Planning Candidate: ${context.scenario.name}`,
    summary:
      'Deterministic planning scaffold based on active scenario pins, user pins, saved Feature Finder pins, and folders.',
    consideredPinIds: topPins.map((pin) => pin.id),
    sections: [
      createSection('best-plan', bestPlanItems),
      createSection('morning-approach', [
        'Start with the highest-priority planning candidate and choose a conservative route only after checking legal access, terrain, wind, weather, and pressure outside this scaffold.',
        'Use nearby access, camp, truck, or glassing pins only as planning context, not as confirmed route or visibility information.',
      ]),
      createSection('evening-approach', [
        'Re-check the same candidate pins for an evening setup, especially potential food, water, bedding, saddle, wallow, elk, deer, or sign context.',
        'Avoid treating any simulated or terrain-derived pin as confirmed animal behavior without field verification.',
      ]),
      createSection('why-this-area', [
        `${context.scenario.name} is active, with ${context.pins.length} considered pins and ${context.folders.length} folders available for planning.`,
        ...(relationshipItems.length > 0
          ? relationshipItems
          : ['No close pin relationships were identified in this deterministic pass.']),
      ]),
      createSection('key-pins-considered', keyPinItems),
      createSection('risks-unknowns', [
        'This scaffold does not know current weather, wind, legal access, private land status, road or trail conditions, hunting pressure, or confirmed animal movement.',
        'Feature Finder pins are potential terrain-derived planning candidates and should be verified in field.',
      ]),
      createSection(
        'next-pins-to-verify',
        nextPinsToVerify.length > 0
          ? nextPinsToVerify
          : ['Add or save user-observed pins, then verify the strongest planning candidates in field.'],
      ),
    ],
  }
}
