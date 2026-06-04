export type MapCamera = {
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
}

export type ScenarioRegion = {
  id: string
  name: string
  subtitle: string
  description: string
  terrainNotes: string
  primaryUseCase: string
  camera: MapCamera
}

export type ScoutPinType =
  | 'camp'
  | 'sign'
  | 'water'
  | 'glassing-point'
  | 'trail-camera'
  | 'wallow'
  | 'access-point'
  | 'truck'
  | 'food'
  | 'bedding'
  | 'blood'
  | 'shot'
  | 'deer'
  | 'elk'
  | 'generic-marker'

export type ScoutPinSource = 'simulated' | 'user'

export type ScoutPin = {
  id: string
  scenarioId: string
  name: string
  type: ScoutPinType
  coordinates: [number, number]
  notes: string
  observedAt: string
  source: ScoutPinSource
}

export type UserPinDraft = {
  name: string
  type: ScoutPinType
  notes: string
}

export type PinCleanupSuggestion = {
  id: string
  scenarioId: string
  title: string
  suggestedFolderName: string
  pinIds: string[]
  explanation: string[]
  confidence: number
}

export type PinCleanupDraftAssignment = {
  pinId: string
  destinationFolderId: string | 'recommended' | 'none'
}

export type AcceptCleanupSuggestionInput = {
  suggestionId: string
  folderName: string
  pinAssignments: PinCleanupDraftAssignment[]
}

export type SavedPinFolder = {
  id: string
  name: string
  scenarioId: string
  pinIds: string[]
  createdAt: string
}