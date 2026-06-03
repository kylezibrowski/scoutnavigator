import { useState } from 'react'
import ControlPanel from './ControlPanel'
import LeftRail from './LeftRail'
import MapViewer from './MapViewer'
import { scenarioRegions } from '../data/scenarioRegions'
import { createScenarioPins, getNextScenario } from '../utils/scenarioEngine'
import type { ScenarioRegion, ScoutPin, UserPinDraft } from '../types/scout'

function AppShell() {
  const [activeScenario, setActiveScenario] = useState<ScenarioRegion>(
    scenarioRegions[0],
  )
  const [isAddingPin, setIsAddingPin] = useState(false)
  const [pendingPinCoordinates, setPendingPinCoordinates] = useState<
    ScoutPin['coordinates'] | null
  >(null)
  const [userPins, setUserPins] = useState<ScoutPin[]>([])

  const simulatedScenarioPins = createScenarioPins(activeScenario)
  const activeScenarioPins = [
    ...simulatedScenarioPins,
    ...userPins.filter((pin) => pin.scenarioId === activeScenario.id),
  ]

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

  function handleSaveUserPin(pinDraft: UserPinDraft) {
    if (!pendingPinCoordinates) {
      return
    }

    const newPin: ScoutPin = {
      id: `${activeScenario.id}-user-pin-${Date.now()}`,
      scenarioId: activeScenario.id,
      name: pinDraft.name,
      type: pinDraft.type,
      coordinates: pendingPinCoordinates,
      notes: pinDraft.notes,
      observedAt: new Date().toISOString().slice(0, 10),
      source: 'user',
    }

    setUserPins((currentPins) => [...currentPins, newPin])
    setPendingPinCoordinates(null)
    setIsAddingPin(false)
  }

  return (
    <main className="flex min-h-screen bg-stone-100 p-3 text-slate-900">
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
        onStartAddingPin={handleStartAddingPin}
        onCancelAddingPin={handleCancelAddingPin}
        onChoosePinLocation={handleChoosePinLocation}
        onSaveUserPin={handleSaveUserPin}
        />
    </main>
  )
}

export default AppShell