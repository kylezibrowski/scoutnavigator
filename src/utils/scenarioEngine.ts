import type { ScenarioRegion } from "../types/scout"

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