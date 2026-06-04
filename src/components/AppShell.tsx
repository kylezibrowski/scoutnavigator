import { useState } from 'react'
import LeftRail from './LeftRail'
import MapViewer from './MapViewer'
import { scenarioRegions } from '../data/scenarioRegions'
import { createScenarioPins, getNextScenario } from '../utils/scenarioEngine'
import { createPinCleanupSuggestions } from '../utils/pinCleanupEngine'
import type {
  AcceptCleanupSuggestionInput,
  PinCleanupSuggestion,
  SavedPinFolder,
  ScenarioRegion,
  ScoutPin,
  UserPinDraft,
} from '../types/scout'

function AppShell() {
  const [activeScenario, setActiveScenario] = useState<ScenarioRegion>(
    scenarioRegions[0],
  )
  const [isAddingPin, setIsAddingPin] = useState(false)
  const [pendingPinCoordinates, setPendingPinCoordinates] = useState<
    ScoutPin['coordinates'] | null
  >(null)
  const [userPins, setUserPins] = useState<ScoutPin[]>([])

    const [isCleanupPanelOpen, setIsCleanupPanelOpen] = useState(false)
    const [isAnalyzingCleanup, setIsAnalyzingCleanup] = useState(false)
    const [cleanupSuggestions, setCleanupSuggestions] = useState<
    PinCleanupSuggestion[]
    >([])
  const [hoveredCleanupSuggestionId, setHoveredCleanupSuggestionId] = useState<
    string | null
    >(null)
  const [dismissedCleanupSuggestionIds, setDismissedCleanupSuggestionIds] =
    useState<string[]>([])
  const [savedPinFolders, setSavedPinFolders] = useState<SavedPinFolder[]>([])
  const [isFoldersPanelOpen, setIsFoldersPanelOpen] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const simulatedScenarioPins = createScenarioPins(activeScenario)
  const activeScenarioPins = [
    ...simulatedScenarioPins,
    ...userPins.filter((pin) => pin.scenarioId === activeScenario.id),
  ]

  function handleGenerateScenario() {
  setIsAddingPin(false)
  setPendingPinCoordinates(null)
  setIsCleanupPanelOpen(false)
  setIsFoldersPanelOpen(false)
  setSelectedFolderId(null)
  setCleanupSuggestions([])
  setHoveredCleanupSuggestionId(null)

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
    function handleRunPinCleanup() {
    setIsAddingPin(false)
    setPendingPinCoordinates(null)
    setIsCleanupPanelOpen(true)
    setIsFoldersPanelOpen(false)
    setSelectedFolderId(null)
    setHoveredCleanupSuggestionId(null)
    setIsAnalyzingCleanup(true)


        window.setTimeout(() => {
        const assignedPinIds = new Set(
            savedPinFolders
            .filter((folder) => folder.scenarioId === activeScenario.id)
            .flatMap((folder) => folder.pinIds),
        )

        const unassignedScenarioPins = activeScenarioPins.filter(
            (pin) => !assignedPinIds.has(pin.id),
        )

        const nextSuggestions = createPinCleanupSuggestions({
            scenario: activeScenario,
            pins: unassignedScenarioPins,
            dismissedSuggestionIds: dismissedCleanupSuggestionIds,
        })

        setCleanupSuggestions(nextSuggestions)
        setIsAnalyzingCleanup(false)
        }, 650)
    }

    function handleCloseCleanupPanel() {
    setIsCleanupPanelOpen(false)
    setIsAnalyzingCleanup(false)
    setHoveredCleanupSuggestionId(null)
}

function handleOpenFoldersPanel() {
  setIsAddingPin(false)
  setPendingPinCoordinates(null)
  setIsCleanupPanelOpen(false)
  setIsAnalyzingCleanup(false)
  setHoveredCleanupSuggestionId(null)
  setIsFoldersPanelOpen(true)
  setSelectedFolderId(null)
}

function handleCloseFoldersPanel() {
  setIsFoldersPanelOpen(false)
  setSelectedFolderId(null)
}

function handleSelectFolder(folderId: string | null) {
  setSelectedFolderId(folderId)
}

function handleRemovePinFromFolder(folderId: string, pinId: string) {
  setSavedPinFolders((currentFolders) =>
    currentFolders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            pinIds: folder.pinIds.filter(
              (currentPinId) => currentPinId !== pinId,
            ),
          }
        : folder,
    ),
  )
}

function handleAddPinToFolder(folderId: string, pinId: string) {
  setSavedPinFolders((currentFolders) =>
    currentFolders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            pinIds: Array.from(new Set([...folder.pinIds, pinId])),
          }
        : folder,
    ),
  )
}

    function handleDismissCleanupSuggestion(suggestionId: string) {
    setDismissedCleanupSuggestionIds((currentIds) => [
        ...currentIds,
        suggestionId,
    ])
    setCleanupSuggestions((currentSuggestions) =>
        currentSuggestions.filter((suggestion) => suggestion.id !== suggestionId),
    )
    setHoveredCleanupSuggestionId(null)
    }

    function handleAcceptCleanupSuggestion(input: AcceptCleanupSuggestionInput) {
    const suggestion = cleanupSuggestions.find(
        (currentSuggestion) => currentSuggestion.id === input.suggestionId,
    )

    if (!suggestion) {
        return
    }

    const recommendedFolderPinIds = input.pinAssignments
        .filter((assignment) => assignment.destinationFolderId === 'recommended')
        .map((assignment) => assignment.pinId)

    const existingFolderAssignments = input.pinAssignments.filter(
        (assignment) =>
        assignment.destinationFolderId !== 'recommended' &&
        assignment.destinationFolderId !== 'none',
    )

    if (recommendedFolderPinIds.length > 0) {
        const savedFolder: SavedPinFolder = {
        id: `${activeScenario.id}-folder-${Date.now()}`,
        name: input.folderName.trim() || suggestion.suggestedFolderName,
        scenarioId: activeScenario.id,
        pinIds: recommendedFolderPinIds,
        createdAt: new Date().toISOString(),
        }

        setSavedPinFolders((currentFolders) => [...currentFolders, savedFolder])
    }

    if (existingFolderAssignments.length > 0) {
        setSavedPinFolders((currentFolders) =>
        currentFolders.map((folder) => {
            const assignedPinIds = existingFolderAssignments
            .filter((assignment) => assignment.destinationFolderId === folder.id)
            .map((assignment) => assignment.pinId)

            if (assignedPinIds.length === 0) {
            return folder
            }

            return {
            ...folder,
            pinIds: Array.from(new Set([...folder.pinIds, ...assignedPinIds])),
            }
        }),
        )
    }

    setCleanupSuggestions((currentSuggestions) =>
        currentSuggestions.filter(
        (currentSuggestion) => currentSuggestion.id !== input.suggestionId,
        ),
    )
    setHoveredCleanupSuggestionId(null)
    }

  return (
    <main className="flex min-h-screen bg-stone-100 p-3 text-slate-900">
      <LeftRail
        activeSection={isFoldersPanelOpen ? 'folders' : 'map'}
        onOpenFoldersPanel={handleOpenFoldersPanel}
        />

      <MapViewer
        activeScenario={activeScenario}
        activeScenarioPins={activeScenarioPins}
        isAddingPin={isAddingPin}
        pendingPinCoordinates={pendingPinCoordinates}
        isCleanupPanelOpen={isCleanupPanelOpen}
        isAnalyzingCleanup={isAnalyzingCleanup}
        cleanupSuggestions={cleanupSuggestions}
        hoveredCleanupSuggestionId={hoveredCleanupSuggestionId}
        isFoldersPanelOpen={isFoldersPanelOpen}
        selectedFolderId={selectedFolderId}
        savedPinFolders={savedPinFolders.filter(
        (folder) => folder.scenarioId === activeScenario.id,
        )}
        onGenerateScenario={handleGenerateScenario}
        onStartAddingPin={handleStartAddingPin}
        onCancelAddingPin={handleCancelAddingPin}
        onChoosePinLocation={handleChoosePinLocation}
        onSaveUserPin={handleSaveUserPin}
        onRunPinCleanup={handleRunPinCleanup}
        onCloseCleanupPanel={handleCloseCleanupPanel}
        onCloseFoldersPanel={handleCloseFoldersPanel}
        onSelectFolder={handleSelectFolder}
        onRemovePinFromFolder={handleRemovePinFromFolder}
        onAddPinToFolder={handleAddPinToFolder}
        onDismissCleanupSuggestion={handleDismissCleanupSuggestion}
        onAcceptCleanupSuggestion={handleAcceptCleanupSuggestion}
        onHoverCleanupSuggestion={setHoveredCleanupSuggestionId}
        />
    </main>
  )
}

export default AppShell