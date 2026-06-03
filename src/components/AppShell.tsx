import { useState } from "react"
import { scenarioRegions } from "../data/scenarioRegions"
import type { ScenarioRegion } from "../types/scout"
import { createScenarioPins, getNextScenario } from '../utils/scenarioEngine'
import ControlPanel from "./ControlPanel"
import LeftRail from "./LeftRail"
import MapViewer from "./MapViewer"


function AppShell() {
  const [activeScenario, setActiveScenario] = useState<ScenarioRegion>(
    scenarioRegions[0],
  )
  const activeScenarioPins = createScenarioPins(activeScenario)

  function handleGenerateScenario() {
    setActiveScenario((currentScenario) =>
  getNextScenario(scenarioRegions, currentScenario),
)
  }

  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <LeftRail />
        <ControlPanel
          activeScenario={activeScenario}
          activeScenarioPins={activeScenarioPins}
          onGenerateScenario={handleGenerateScenario}
        />
        <MapViewer
  activeScenario={activeScenario}
  activeScenarioPins={activeScenarioPins}
/>
      </div>
    </main>
  )
}

export default AppShell