import { useState } from 'react'
import LeftRail from './LeftRail'
import MapViewer from './MapViewer'
import { scenarioRegions } from '../data/scenarioRegions'
import { createScenarioPins, getNextScenario } from '../utils/scenarioEngine'
import { createPinCleanupSuggestions } from '../utils/pinCleanupEngine'
import {
  createFeatureFinderSuggestions,
  getScoutPinTypeForFeature,
} from '../utils/featureFinderEngine'
import type {
  AcceptCleanupSuggestionInput,
  FeatureFinderSuggestion,
  FeatureFinderType,
  PinCleanupSuggestion,
  SavedPinFolder,
  ScenarioRegion,
  ScoutPin,
  TerrainSample,
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

  const [isFeatureFinderPanelOpen, setIsFeatureFinderPanelOpen] = useState(false)
  const [isAnalyzingFeatures, setIsAnalyzingFeatures] = useState(false)
  const [selectedFeatureFinderType, setSelectedFeatureFinderType] =
  useState<FeatureFinderType | null>(null)
  const [featureFinderSuggestions, setFeatureFinderSuggestions] = useState<
  FeatureFinderSuggestion[]
  >([])
const [
  hoveredFeatureFinderSuggestionId,
  setHoveredFeatureFinderSuggestionId,
] = useState<string | null>(null)

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
  setIsFeatureFinderPanelOpen(false)
  setIsAnalyzingFeatures(false)
  setSelectedFeatureFinderType(null)
  setFeatureFinderSuggestions([])
  setHoveredFeatureFinderSuggestionId(null)
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
    setIsFeatureFinderPanelOpen(false)
    setIsAnalyzingFeatures(false)
    setHoveredFeatureFinderSuggestionId(null)
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
  setIsFeatureFinderPanelOpen(false)
  setIsAnalyzingFeatures(false)
  setHoveredFeatureFinderSuggestionId(null)
  setIsFoldersPanelOpen(true)
  setSelectedFolderId(null)
}

function handleCloseFoldersPanel() {
  setIsFoldersPanelOpen(false)
  setSelectedFolderId(null)
}

function handleOpenFeatureFinderPanel() {
  setIsAddingPin(false)
  setPendingPinCoordinates(null)
  setIsCleanupPanelOpen(false)
  setIsAnalyzingCleanup(false)
  setHoveredCleanupSuggestionId(null)
  setIsFoldersPanelOpen(false)
  setSelectedFolderId(null)
  setIsFeatureFinderPanelOpen(true)
}

function handleCloseFeatureFinderPanel() {
  setIsFeatureFinderPanelOpen(false)
  setIsAnalyzingFeatures(false)
  setHoveredFeatureFinderSuggestionId(null)
}

function handleRunFeatureFinder(
  featureType: FeatureFinderType,
  terrainSamples: TerrainSample[],
) {
  setSelectedFeatureFinderType(featureType)
  setFeatureFinderSuggestions([])
  setHoveredFeatureFinderSuggestionId(null)
  setIsAnalyzingFeatures(true)

  window.setTimeout(() => {
    const nextSuggestions = createFeatureFinderSuggestions({
      scenario: activeScenario,
      pins: activeScenarioPins,
      featureType,
      terrainSamples,
    })

    setFeatureFinderSuggestions(nextSuggestions)
    setIsAnalyzingFeatures(false)
  }, 650)
}

function handleSaveFeatureFinderSuggestion(suggestionId: string) {
  const suggestion = featureFinderSuggestions.find(
    (currentSuggestion) => currentSuggestion.id === suggestionId,
  )

  if (!suggestion) {
    return
  }

  const newPin: ScoutPin = {
    id: `${activeScenario.id}-feature-pin-${Date.now()}`,
    scenarioId: activeScenario.id,
    name: suggestion.title,
    type: getScoutPinTypeForFeature(suggestion.type),
    coordinates: suggestion.coordinates,
    notes: [
      'Saved from Feature Finder.',
      `Suitability: ${suggestion.suitability}%.`,
      ...suggestion.explanation,
      `Suggested action: ${suggestion.suggestedAction}`,
    ].join(' '),
    observedAt: new Date().toISOString().slice(0, 10),
    source: 'feature-finder',
  }

  setUserPins((currentPins) => [...currentPins, newPin])
  setFeatureFinderSuggestions((currentSuggestions) =>
    currentSuggestions.filter(
      (currentSuggestion) => currentSuggestion.id !== suggestionId,
    ),
  )
  setHoveredFeatureFinderSuggestionId(null)
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
        isFeatureFinderPanelOpen={isFeatureFinderPanelOpen}
        isAnalyzingFeatures={isAnalyzingFeatures}
        selectedFeatureFinderType={selectedFeatureFinderType}
        featureFinderSuggestions={featureFinderSuggestions}
        hoveredFeatureFinderSuggestionId={hoveredFeatureFinderSuggestionId}
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
        onOpenFeatureFinderPanel={handleOpenFeatureFinderPanel}
        onCloseFeatureFinderPanel={handleCloseFeatureFinderPanel}
        onRunFeatureFinder={handleRunFeatureFinder}
        onHoverFeatureFinderSuggestion={setHoveredFeatureFinderSuggestionId}
        onSaveFeatureFinderSuggestion={handleSaveFeatureFinderSuggestion}
        />
    </main>
  )
}

export default AppShell