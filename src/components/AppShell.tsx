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
  const [isAddingPin, setIsAddingPin] = useState(false)

  const activeScenarioPins = createScenarioPins(activeScenario)

  function handleGenerateScenario() {
  setIsAddingPin(false)

  setActiveScenario((currentScenario) =>
    getNextScenario(scenarioRegions, currentScenario),
  )
}

function handleStartAddingPin() {
  setIsAddingPin(true)
}

function handleCancelAddingPin() {
  setIsAddingPin(false)
}

  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <LeftRail />
        <ControlPanel
            activeScenario={activeScenario}
            activeScenarioPins={activeScenarioPins}
            isAddingPin={isAddingPin}
            onGenerateScenario={handleGenerateScenario}
            onStartAddingPin={handleStartAddingPin}
            onCancelAddingPin={handleCancelAddingPin}
        />
        <MapViewer
            activeScenario={activeScenario}
            activeScenarioPins={activeScenarioPins}
            isAddingPin={isAddingPin}
        />
      </div>
    </main>
  )
}

export default AppShell