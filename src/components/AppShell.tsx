import { useState } from "react"
import { scenarioRegions } from "../data/scenarioRegions"
import type { ScenarioRegion } from "../types/scout"
import ControlPanel from "./ControlPanel"
import LeftRail from "./LeftRail"
import MapViewer from "./MapViewer"

function getNextScenario(currentScenario: ScenarioRegion) {
  const currentIndex = scenarioRegions.findIndex(
    (scenario) => scenario.id === currentScenario.id,
  )

  const nextIndex = (currentIndex + 1) % scenarioRegions.length

  return scenarioRegions[nextIndex]
}

function AppShell() {
  const [activeScenario, setActiveScenario] = useState<ScenarioRegion>(
    scenarioRegions[0],
  )

  function handleGenerateScenario() {
    setActiveScenario((currentScenario) => getNextScenario(currentScenario))
  }

  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <LeftRail />
        <ControlPanel
          activeScenario={activeScenario}
          onGenerateScenario={handleGenerateScenario}
        />
        <MapViewer activeScenario={activeScenario} />
      </div>
    </main>
  )
}

export default AppShell