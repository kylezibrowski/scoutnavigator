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
  | 'saddle'
  | 'blood'
  | 'shot'
  | 'deer'
  | 'elk'
  | 'generic-marker'

export type ScoutPinSource = 'simulated' | 'user' | 'feature-finder'

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

export type FeatureFinderType =
  | 'water'
  | 'food'
  | 'bedding-bench'
  | 'saddle'
  | 'glassing-point'
  | 'access'
  | 'wallow-potential'

export type FeatureFinderSuggestion = {
  id: string
  scenarioId: string
  type: FeatureFinderType
  title: string
  coordinates: [number, number]
  explanation: string[]
  suggestedAction: string
  suitability: number
}

export type FeatureFinderBounds = {
  southwest: [number, number]
  northeast: [number, number]
}

export type TerrainSample = {
  id: string
  coordinates: [number, number]
  elevationMeters: number
  elevationFeet: number
  relativeLngIndex: number
  relativeLatIndex: number
  row?: number
  column?: number
  rows?: number
  columns?: number
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
