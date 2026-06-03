import { useState } from "react"
import { scenarioRegions } from "../data/scenarioRegions"
import type { ScenarioRegion, ScoutPin } from '../types/scout'
import { createScenarioPins, getNextScenario } from '../utils/scenarioEngine'
import ControlPanel from "./ControlPanel"
import LeftRail from "./LeftRail"
import MapViewer from "./MapViewer"


function AppShell() {
    const [activeScenario, setActiveScenario] = useState<ScenarioRegion>(
    scenarioRegions[0],
    )
    const [isAddingPin, setIsAddingPin] = useState(false)
    const [pendingPinCoordinates, setPendingPinCoordinates] = useState<
    ScoutPin['coordinates'] | null
    >(null)

    const activeScenarioPins = createScenarioPins(activeScenario)

  function handleGenerateScenario() {
        setIsAddingPin(false)
        setPendingPinCoordinates(null)

        setActiveScenario((currentScenario) =>
            getNextScenario(scenarioRegions, currentScenario),
        )
        }

function handleStartAddingPin() {
  setPendingPinCoordinates(null)
  setIsAddingPin(true)
}

function handleCancelAddingPin() {
  setIsAddingPin(false)
  setPendingPinCoordinates(null)
}

function handleChoosePinLocation(coordinates: ScoutPin['coordinates']) {
  setPendingPinCoordinates(coordinates)
}

  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <LeftRail />
        <ControlPanel
            activeScenario={activeScenario}
            activeScenarioPins={activeScenarioPins}
            isAddingPin={isAddingPin}
            pendingPinCoordinates={pendingPinCoordinates}
            onGenerateScenario={handleGenerateScenario}
            onStartAddingPin={handleStartAddingPin}
            onCancelAddingPin={handleCancelAddingPin}
            />
        <MapViewer
            activeScenario={activeScenario}
            activeScenarioPins={activeScenarioPins}
            isAddingPin={isAddingPin}
            pendingPinCoordinates={pendingPinCoordinates}
            onChoosePinLocation={handleChoosePinLocation}
            />
      </div>
    </main>
  )
}

export default AppShell