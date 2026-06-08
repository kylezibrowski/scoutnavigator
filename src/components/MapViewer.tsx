import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type {
  AcceptCleanupSuggestionInput,
  FeatureFinderBounds,
  FeatureFinderSuggestion,
  FeatureFinderType,
  MapCamera,
  TerrainSample,
  PinCleanupSuggestion,
  SavedPinFolder,
  ScenarioRegion,
  ScoutPin,
  UserPinDraft,
} from '../types/scout'

type CleanupSuggestionDraft = {
  folderName: string
  pinAssignments: Record<string, string | 'recommended' | 'none'>
}

type MapViewerProps = {
  activeScenario: ScenarioRegion
  activeScenarioPins: ScoutPin[]
  isAddingPin: boolean
  pendingPinCoordinates: ScoutPin['coordinates'] | null
  isCleanupPanelOpen: boolean
  isAnalyzingCleanup: boolean
  isFoldersPanelOpen: boolean
  selectedFolderId: string | null
  cleanupSuggestions: PinCleanupSuggestion[]
  hoveredCleanupSuggestionId: string | null
  savedPinFolders: SavedPinFolder[]
  isFeatureFinderPanelOpen: boolean
  isAnalyzingFeatures: boolean
  selectedFeatureFinderTypes: FeatureFinderType[]
  featureFinderSuggestions: FeatureFinderSuggestion[]
  hoveredFeatureFinderSuggestionId: string | null
  onCloseCleanupPanel: () => void
  onCloseFoldersPanel: () => void
  onSelectFolder: (folderId: string | null) => void
  onRemovePinFromFolder: (folderId: string, pinId: string) => void
  onAddPinToFolder: (folderId: string, pinId: string) => void
  onGenerateScenario: () => void
  onStartAddingPin: () => void
  onCancelAddingPin: () => void
  onChoosePinLocation: (coordinates: ScoutPin['coordinates']) => void
  onSaveUserPin: (pinDraft: UserPinDraft) => void
  onRunPinCleanup: () => void
  onDismissCleanupSuggestion: (suggestionId: string) => void
  onAcceptCleanupSuggestion: (input: AcceptCleanupSuggestionInput) => void
  onHoverCleanupSuggestion: (suggestionId: string | null) => void
  onOpenFeatureFinderPanel: () => void
  onCloseFeatureFinderPanel: () => void
  onToggleFeatureFinderType: (featureType: FeatureFinderType) => void
  onRunFeatureFinder: (
  featureTypes: FeatureFinderType[],
  terrainSamples: TerrainSample[],
  bounds: FeatureFinderBounds,
) => void
  onHoverFeatureFinderSuggestion: (suggestionId: string | null) => void
  onSaveFeatureFinderSuggestion: (suggestionId: string) => void
  onDismissFeatureFinderSuggestion: (suggestionId: string) => void
}

const pinTypeOptions: Array<{ value: UserPinDraft['type']; label: string }> = [
  { value: 'camp', label: 'Camp' },
  { value: 'sign', label: 'Sign' },
  { value: 'water', label: 'Water' },
  { value: 'glassing-point', label: 'Glassing Point' },
  { value: 'trail-camera', label: 'Trail Camera' },
  { value: 'wallow', label: 'Wallow' },
  { value: 'access-point', label: 'Access Point' },
  { value: 'truck', label: 'Truck' },
  { value: 'food', label: 'Food' },
  { value: 'bedding', label: 'Bedding' },
  { value: 'saddle', label: 'Saddle' },
  { value: 'blood', label: 'Blood' },
  { value: 'shot', label: 'Shot' },
  { value: 'deer', label: 'Deer' },
  { value: 'elk', label: 'Elk' },
  { value: 'generic-marker', label: 'Generic Marker' },
]

const featureFinderOptions: Array<{ value: FeatureFinderType; label: string }> = [
  { value: 'water', label: 'Water' },
  { value: 'food', label: 'Food' },
  { value: 'bedding-bench', label: 'Bedding Bench' },
  { value: 'saddle', label: 'Saddle' },
  { value: 'glassing-point', label: 'Glassing Point' },
  { value: 'access', label: 'Access' },
  { value: 'wallow-potential', label: 'Wallow Potential' },
]

const featureFinderAreaSourceId = 'feature-finder-area'
const featureFinderAreaFillLayerId = 'feature-finder-area-fill'
const featureFinderAreaLineLayerId = 'feature-finder-area-line'
const terrainSampleSpacingMeters = 91.44
const maxTerrainSampleCount = 100000

type TerrainSampleResult =
  | {
      status: 'ok'
      samples: TerrainSample[]
      rows: number
      columns: number
    }
  | {
      status: 'too-large'
      rows: number
      columns: number
      sampleCount: number
    }

function formatPinType(type: ScoutPin['type']) {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function createBoundsFromCoordinates(
  firstCoordinates: ScoutPin['coordinates'],
  secondCoordinates: ScoutPin['coordinates'],
): FeatureFinderBounds {
  const west = Math.min(firstCoordinates[0], secondCoordinates[0])
  const east = Math.max(firstCoordinates[0], secondCoordinates[0])
  const south = Math.min(firstCoordinates[1], secondCoordinates[1])
  const north = Math.max(firstCoordinates[1], secondCoordinates[1])

  return {
    southwest: [west, south],
    northeast: [east, north],
  }
}

function createFeatureFinderAreaData(bounds: FeatureFinderBounds) {
  const [west, south] = bounds.southwest
  const [east, north] = bounds.northeast

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
      },
    ],
  } as GeoJSON.FeatureCollection
}

function createTerrainSamples({
  map,
  bounds,
}: {
  map: mapboxgl.Map
  bounds: FeatureFinderBounds
}): TerrainSampleResult {
  const [west, south] = bounds.southwest
  const [east, north] = bounds.northeast
  const midpointLatitude = (south + north) / 2
  const metersPerLatitudeDegree = 111_320
  const metersPerLongitudeDegree =
    metersPerLatitudeDegree * Math.cos((midpointLatitude * Math.PI) / 180)
  const widthMeters = Math.abs(east - west) * metersPerLongitudeDegree
  const heightMeters = Math.abs(north - south) * metersPerLatitudeDegree
  const columns = Math.max(
    1,
    Math.ceil(widthMeters / terrainSampleSpacingMeters) + 1,
  )
  const rows = Math.max(
    1,
    Math.ceil(heightMeters / terrainSampleSpacingMeters) + 1,
  )
  const sampleCount = rows * columns

  if (sampleCount > maxTerrainSampleCount) {
    return {
      status: 'too-large',
      rows,
      columns,
      sampleCount,
    }
  }

  const samples: TerrainSample[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const coordinates: ScoutPin['coordinates'] = [
        columns === 1
          ? (west + east) / 2
          : west + ((east - west) * column) / (columns - 1),
        rows === 1
          ? (south + north) / 2
          : south + ((north - south) * row) / (rows - 1),
      ]

      const elevationMeters = map.queryTerrainElevation(coordinates)

      if (typeof elevationMeters !== 'number') {
        continue
      }

      samples.push({
        id: `terrain-${row}-${column}`,
        coordinates,
        elevationMeters,
        elevationFeet: Math.round(elevationMeters * 3.28084),
        relativeLngIndex: column - Math.floor(columns / 2),
        relativeLatIndex: row - Math.floor(rows / 2),
        row,
        column,
        rows,
        columns,
      })
    }
  }

  return {
    status: 'ok',
    samples,
    rows,
    columns,
  }
}

function MapViewer({
  activeScenario,
  activeScenarioPins,
  isAddingPin,
  pendingPinCoordinates,
  isCleanupPanelOpen,
  isAnalyzingCleanup,
  isFoldersPanelOpen,
  selectedFolderId,
  cleanupSuggestions,
  hoveredCleanupSuggestionId,
  savedPinFolders,
  isFeatureFinderPanelOpen,
  isAnalyzingFeatures,
  selectedFeatureFinderTypes,
  featureFinderSuggestions,
  hoveredFeatureFinderSuggestionId,
  onGenerateScenario,
  onStartAddingPin,
  onCancelAddingPin,
  onChoosePinLocation,
  onSaveUserPin,
  onRunPinCleanup,
  onCloseCleanupPanel,
  onCloseFoldersPanel,
  onSelectFolder,
  onRemovePinFromFolder,
  onAddPinToFolder,
  onDismissCleanupSuggestion,
  onAcceptCleanupSuggestion,
  onHoverCleanupSuggestion,
  onOpenFeatureFinderPanel,
  onCloseFeatureFinderPanel,
  onToggleFeatureFinderType,
  onRunFeatureFinder,
  onHoverFeatureFinderSuggestion,
  onSaveFeatureFinderSuggestion,
  onDismissFeatureFinderSuggestion,
}: MapViewerProps) {
      const [newPinDraft, setNewPinDraft] = useState<UserPinDraft>({
    name: '',
    type: 'generic-marker',
    notes: '',
  })
  const [cleanupDrafts, setCleanupDrafts] = useState<
  Record<string, CleanupSuggestionDraft>
>({})

const [hoveredCleanupPinId, setHoveredCleanupPinId] = useState<string | null>(
  null,
)

const [editingFolderPinId, setEditingFolderPinId] = useState<string | null>(
  null,
)
const [featureFinderRunError, setFeatureFinderRunError] = useState<string | null>(
  null,
)
  const handleCancelNewPin = () => {
    setNewPinDraft({
      name: '',
      type: 'generic-marker',
      notes: '',
    })

    onCancelAddingPin()
  }

  const handleSaveNewPin = () => {
    onSaveUserPin({
      name: newPinDraft.name.trim() || 'Untitled Pin',
      type: newPinDraft.type,
      notes: newPinDraft.notes.trim(),
    })

    setNewPinDraft({
      name: '',
      type: 'generic-marker',
      notes: '',
    })
  }

  const handleRunFeatureFinder = () => {
  if (!featureFinderBounds || selectedFeatureFinderTypes.length === 0) {
    return
  }

  restoreFeatureFinderCamera()
  setFeatureFinderRunError(null)

  const terrainSampleResult = mapRef.current
    ? createTerrainSamples({
        map: mapRef.current,
        bounds: featureFinderBounds,
      })
    : { status: 'ok' as const, samples: [], rows: 0, columns: 0 }

  if (terrainSampleResult.status === 'too-large') {
    setHasRunFeatureFinderForSelectedArea(false)
    setFeatureFinderRunError(
      'Selected area is too large to analyze in this demo. Select a smaller area and run Feature Finder again.',
    )
    return
  }

  setHasRunFeatureFinderForSelectedArea(true)

  onRunFeatureFinder(
    selectedFeatureFinderTypes,
    terrainSampleResult.samples,
    featureFinderBounds,
  )
}

function getPinById(pinId: string) {
  return activeScenarioPins.find((pin) => pin.id === pinId)
}

function getCleanupDraft(suggestion: PinCleanupSuggestion) {
  const existingDraft = cleanupDrafts[suggestion.id]

  if (existingDraft) {
    return existingDraft
  }

  return {
    folderName: suggestion.suggestedFolderName,
    pinAssignments: suggestion.pinIds.reduce<
      Record<string, string | 'recommended' | 'none'>
    >((assignments, pinId) => {
      assignments[pinId] = 'recommended'
      return assignments
    }, {}),
  }
}

function updateCleanupFolderName(suggestionId: string, folderName: string) {
  setCleanupDrafts((currentDrafts) => ({
    ...currentDrafts,
    [suggestionId]: {
      folderName,
      pinAssignments: currentDrafts[suggestionId]?.pinAssignments ?? {},
    },
  }))
}

function updateCleanupPinAssignment({
  suggestion,
  pinId,
  destinationFolderId,
}: {
  suggestion: PinCleanupSuggestion
  pinId: string
  destinationFolderId: string | 'recommended' | 'none'
}) {
  const currentDraft = getCleanupDraft(suggestion)

  setCleanupDrafts((currentDrafts) => ({
    ...currentDrafts,
    [suggestion.id]: {
      ...currentDraft,
      pinAssignments: {
        ...currentDraft.pinAssignments,
        [pinId]: destinationFolderId,
      },
    },
  }))
}

function handleAcceptCleanupSuggestion(suggestion: PinCleanupSuggestion) {
  const draft = getCleanupDraft(suggestion)

  onAcceptCleanupSuggestion({
    suggestionId: suggestion.id,
    folderName: draft.folderName,
    pinAssignments: suggestion.pinIds.map((pinId) => ({
      pinId,
      destinationFolderId: draft.pinAssignments[pinId] ?? 'recommended',
    })),
  })

  setCleanupDrafts((currentDrafts) => {
    const nextDrafts = { ...currentDrafts }
    delete nextDrafts[suggestion.id]
    return nextDrafts
  })
  setHoveredCleanupPinId(null)
}


function handleDismissCleanupSuggestion(suggestionId: string) {
  onDismissCleanupSuggestion(suggestionId)

  setCleanupDrafts((currentDrafts) => {
    const nextDrafts = { ...currentDrafts }
    delete nextDrafts[suggestionId]
    return nextDrafts
  })
    setHoveredCleanupPinId(null)

}

    const selectedFolder =
    savedPinFolders.find((folder) => folder.id === selectedFolderId) ?? null

    const selectedFolderPins = selectedFolder
    ? selectedFolder.pinIds
        .map((pinId) => getPinById(pinId))
        .filter((pin): pin is ScoutPin => Boolean(pin))
    : []
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const markerRefs = useRef<mapboxgl.Marker[]>([])
    const featureFinderMarkerRefs = useRef<mapboxgl.Marker[]>([])
    const pendingMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const previousFeatureFinderCameraRef = useRef<MapCamera | null>(null)
    const areaSelectionStartRef = useRef<ScoutPin['coordinates'] | null>(null)
    const wasDragPanEnabledRef = useRef(false)
    const [mapError, setMapError] = useState<string | null>(null)
    const [isSelectingFeatureFinderArea, setIsSelectingFeatureFinderArea] =
      useState(false)
    const [featureFinderBounds, setFeatureFinderBounds] =
      useState<FeatureFinderBounds | null>(null)
    const [
      hasRunFeatureFinderForSelectedArea,
      setHasRunFeatureFinderForSelectedArea,
    ] = useState(false)

function updateFeatureFinderArea(bounds: FeatureFinderBounds | null) {
  const map = mapRef.current

  if (!map || !map.isStyleLoaded()) {
    return
  }

  if (!bounds) {
    if (map.getLayer(featureFinderAreaLineLayerId)) {
      map.removeLayer(featureFinderAreaLineLayerId)
    }

    if (map.getLayer(featureFinderAreaFillLayerId)) {
      map.removeLayer(featureFinderAreaFillLayerId)
    }

    if (map.getSource(featureFinderAreaSourceId)) {
      map.removeSource(featureFinderAreaSourceId)
    }

    return
  }

  const areaData = createFeatureFinderAreaData(bounds)
  const existingSource = map.getSource(featureFinderAreaSourceId)

  if (existingSource) {
    ;(existingSource as mapboxgl.GeoJSONSource).setData(areaData)
    return
  }

  map.addSource(featureFinderAreaSourceId, {
    type: 'geojson',
    data: areaData,
  })

  map.addLayer({
    id: featureFinderAreaFillLayerId,
    type: 'fill',
    source: featureFinderAreaSourceId,
    paint: {
      'fill-color': '#f97316',
      'fill-opacity': 0.12,
    },
  })

  map.addLayer({
    id: featureFinderAreaLineLayerId,
    type: 'line',
    source: featureFinderAreaSourceId,
    paint: {
      'line-color': '#f97316',
      'line-opacity': 0.65,
      'line-width': 2,
    },
  })
}

function restoreFeatureFinderCamera() {
  const map = mapRef.current
  const previousCamera = previousFeatureFinderCameraRef.current

  if (!map || !previousCamera) {
    return
  }

  map.flyTo({
    center: previousCamera.center,
    zoom: previousCamera.zoom,
    pitch: previousCamera.pitch,
    bearing: previousCamera.bearing,
    duration: 900,
    essential: true,
  })

  previousFeatureFinderCameraRef.current = null
}

function handleCloseFeatureFinderPanel() {
  restoreFeatureFinderCamera()
  setIsSelectingFeatureFinderArea(false)
  setFeatureFinderBounds(null)
  setFeatureFinderRunError(null)
  setHasRunFeatureFinderForSelectedArea(false)
  updateFeatureFinderArea(null)
  onCloseFeatureFinderPanel()
}

  useEffect(() => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

    if (!mapboxToken) {
      setMapError(
        'Missing Mapbox token. Add VITE_MAPBOX_TOKEN to your local .env file.',
      )
      console.error('Missing VITE_MAPBOX_TOKEN environment variable.')
      return
    }

    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    mapboxgl.accessToken = mapboxToken

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: activeScenario.camera.center,
      zoom: activeScenario.camera.zoom,
      pitch: activeScenario.camera.pitch,
      bearing: activeScenario.camera.bearing,
      attributionControl: false,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right',
    )

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })

      map.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.4,
      })

      map.setFog({
        color: 'rgb(245, 247, 250)',
        'high-color': 'rgb(210, 220, 235)',
        'horizon-blend': 0.2,
      })
    })

        return () => {
      markerRefs.current.forEach((marker) => marker.remove())
      markerRefs.current = []

      featureFinderMarkerRefs.current.forEach((marker) => marker.remove())
      featureFinderMarkerRefs.current = []

      if (pendingMarkerRef.current) {
        pendingMarkerRef.current.remove()
        pendingMarkerRef.current = null
      }

      map.remove()
      mapRef.current = null
    }
  }, [])

useEffect(() => {
  const map = mapRef.current

  if (!map) {
    return
  }

  if (isFeatureFinderPanelOpen) {
    if (!previousFeatureFinderCameraRef.current) {
      const center = map.getCenter()

      previousFeatureFinderCameraRef.current = {
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      }
    }

    areaSelectionStartRef.current = null
    setFeatureFinderBounds(null)
    setFeatureFinderRunError(null)
    setIsSelectingFeatureFinderArea(true)
    setHasRunFeatureFinderForSelectedArea(false)
    updateFeatureFinderArea(null)

    const center = map.getCenter()

    map.flyTo({
      center: [center.lng, center.lat],
      zoom: map.getZoom(),
      pitch: 0,
      bearing: 0,
      duration: 900,
      essential: true,
    })

    return
  }

  areaSelectionStartRef.current = null
  setFeatureFinderBounds(null)
  setFeatureFinderRunError(null)
  setIsSelectingFeatureFinderArea(false)
  setHasRunFeatureFinderForSelectedArea(false)
  updateFeatureFinderArea(null)
  restoreFeatureFinderCamera()
}, [isFeatureFinderPanelOpen])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    mapRef.current.flyTo({
      center: activeScenario.camera.center,
      zoom: activeScenario.camera.zoom,
      pitch: activeScenario.camera.pitch,
      bearing: activeScenario.camera.bearing,
      duration: 1200,
      essential: true,
    })
  }, [activeScenario])

useEffect(() => {
  updateFeatureFinderArea(featureFinderBounds)
}, [featureFinderBounds])

useEffect(() => {
  if (!mapRef.current || !isFeatureFinderPanelOpen || !isSelectingFeatureFinderArea) {
    return
  }

  const map = mapRef.current
  const canvas = map.getCanvas()

  canvas.style.cursor = 'crosshair'

  function handleAreaMouseDown(event: mapboxgl.MapMouseEvent) {
    const startCoordinates: ScoutPin['coordinates'] = [
      event.lngLat.lng,
      event.lngLat.lat,
    ]

    areaSelectionStartRef.current = startCoordinates
    wasDragPanEnabledRef.current = map.dragPan.isEnabled()
    map.dragPan.disable()
    event.originalEvent.preventDefault()
  }

  function handleAreaMouseMove(event: mapboxgl.MapMouseEvent) {
    const startCoordinates = areaSelectionStartRef.current

    if (!startCoordinates) {
      return
    }

    updateFeatureFinderArea(
      createBoundsFromCoordinates(startCoordinates, [
        event.lngLat.lng,
        event.lngLat.lat,
      ]),
    )
  }

  function handleAreaMouseUp(event: mapboxgl.MapMouseEvent) {
    const startCoordinates = areaSelectionStartRef.current

    if (!startCoordinates) {
      return
    }

    const nextBounds = createBoundsFromCoordinates(startCoordinates, [
      event.lngLat.lng,
      event.lngLat.lat,
    ])

    areaSelectionStartRef.current = null

    if (wasDragPanEnabledRef.current) {
      map.dragPan.enable()
    }

    canvas.style.cursor = ''
    setFeatureFinderBounds(nextBounds)
    setFeatureFinderRunError(null)
    setHasRunFeatureFinderForSelectedArea(false)
    setIsSelectingFeatureFinderArea(false)
  }

  map.on('mousedown', handleAreaMouseDown)
  map.on('mousemove', handleAreaMouseMove)
  map.on('mouseup', handleAreaMouseUp)

  return () => {
    map.off('mousedown', handleAreaMouseDown)
    map.off('mousemove', handleAreaMouseMove)
    map.off('mouseup', handleAreaMouseUp)

    areaSelectionStartRef.current = null

    if (wasDragPanEnabledRef.current) {
      map.dragPan.enable()
    }

    canvas.style.cursor = ''
  }
}, [isFeatureFinderPanelOpen, isSelectingFeatureFinderArea])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    const map = mapRef.current

      markerRefs.current.forEach((marker) => marker.remove())
      markerRefs.current = []

const hoveredSuggestion = cleanupSuggestions.find(
  (suggestion) => suggestion.id === hoveredCleanupSuggestionId,
)


const highlightedPinIds = new Set(hoveredSuggestion?.pinIds ?? [])

const pinFolderNamesById = savedPinFolders.reduce<Record<string, string[]>>(
  (folderNamesByPinId, folder) => {
    folder.pinIds.forEach((pinId) => {
      folderNamesByPinId[pinId] = [
        ...(folderNamesByPinId[pinId] ?? []),
        folder.name,
      ]
    })

    return folderNamesByPinId
  },
  {},
)

activeScenarioPins.forEach((pin) => {
  const isHighlighted = highlightedPinIds.has(pin.id)
  const isFocusedCleanupPin = hoveredCleanupPinId === pin.id
  const pinFolderNames = pinFolderNamesById[pin.id] ?? []
  const isPinAssignedToFolder = pinFolderNames.length > 0
      const markerElement = document.createElement('button')
      markerElement.type = 'button'
     markerElement.className = isFocusedCleanupPin
  ? 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-950 shadow-2xl ring-8 ring-orange-300 animate-pulse'
  : isHighlighted
    ? 'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-950 shadow-xl ring-4 ring-orange-300 animate-pulse'
    : 'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow-lg hover:bg-orange-600'
      markerElement.setAttribute('aria-label', pin.name)

      const markerDot = document.createElement('span')
      markerDot.className = 'h-2.5 w-2.5 rounded-full bg-white'
      markerElement.appendChild(markerDot)

      const popupContent = document.createElement('div')
popupContent.style.minWidth = '190px'

const typeLabel = document.createElement('p')
typeLabel.style.margin = '0 0 4px'
typeLabel.style.fontSize = '12px'
typeLabel.style.fontWeight = '700'
typeLabel.style.color = '#f97316'
typeLabel.style.textTransform = 'uppercase'
typeLabel.style.letterSpacing = '0.08em'
typeLabel.textContent = formatPinType(pin.type)
popupContent.appendChild(typeLabel)

const pinName = document.createElement('p')
pinName.style.margin = '0 0 6px'
pinName.style.fontSize = '14px'
pinName.style.fontWeight = '700'
pinName.style.color = '#0f172a'
pinName.textContent = pin.name
popupContent.appendChild(pinName)

const pinNotes = document.createElement('p')
pinNotes.style.margin = '0 0 6px'
pinNotes.style.fontSize = '12px'
pinNotes.style.lineHeight = '1.4'
pinNotes.style.color = '#475569'
pinNotes.textContent = pin.notes
popupContent.appendChild(pinNotes)

const folderSummary = document.createElement('p')
folderSummary.style.margin = '0 0 6px'
folderSummary.style.fontSize = '11px'
folderSummary.style.color = '#334155'

const folderLabel = document.createElement('strong')
folderLabel.textContent = 'Folder: '
folderSummary.appendChild(folderLabel)
folderSummary.appendChild(
  document.createTextNode(
    isPinAssignedToFolder ? pinFolderNames.join(', ') : 'No folder',
  ),
)
popupContent.appendChild(folderSummary)

if (!isPinAssignedToFolder && savedPinFolders.length > 0) {
  const addFolderWrapper = document.createElement('label')
  addFolderWrapper.style.display = 'block'
  addFolderWrapper.style.margin = '0 0 8px'
  addFolderWrapper.style.fontSize = '11px'
  addFolderWrapper.style.fontWeight = '700'
  addFolderWrapper.style.color = '#334155'
  addFolderWrapper.textContent = 'Add to folder'

  const folderSelect = document.createElement('select')
  folderSelect.style.display = 'block'
  folderSelect.style.width = '100%'
  folderSelect.style.marginTop = '4px'
  folderSelect.style.border = '1px solid #cbd5e1'
  folderSelect.style.borderRadius = '8px'
  folderSelect.style.padding = '6px 8px'
  folderSelect.style.fontSize = '12px'
  folderSelect.style.color = '#0f172a'
  folderSelect.style.background = '#ffffff'

  const placeholderOption = document.createElement('option')
  placeholderOption.value = ''
  placeholderOption.textContent = 'Choose folder...'
  folderSelect.appendChild(placeholderOption)

  savedPinFolders.forEach((folder) => {
    const folderOption = document.createElement('option')
    folderOption.value = folder.id
    folderOption.textContent = folder.name
    folderSelect.appendChild(folderOption)
  })

  folderSelect.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement

    if (!target.value) {
      return
    }

    onAddPinToFolder(target.value, pin.id)
    popup.remove()
  })

  addFolderWrapper.appendChild(folderSelect)
  popupContent.appendChild(addFolderWrapper)
}

const pinMeta = document.createElement('p')
pinMeta.style.margin = '0'
pinMeta.style.fontSize = '11px'
pinMeta.style.color = '#64748b'
pinMeta.textContent = `Source: ${pin.source} · Observed: ${pin.observedAt}`
popupContent.appendChild(pinMeta)

const popup = new mapboxgl.Popup({
  offset: 24,
  closeButton: true,
  closeOnClick: true,
}).setDOMContent(popupContent)

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat(pin.coordinates)
        .setPopup(popup)
        .addTo(map)

      markerRefs.current.push(marker)
    })
  }, [
  activeScenarioPins,
  cleanupSuggestions,
  hoveredCleanupPinId,
  hoveredCleanupSuggestionId,
  savedPinFolders,
  onAddPinToFolder,
])

useEffect(() => {
  if (!mapRef.current) {
    return
  }

  const map = mapRef.current

  featureFinderMarkerRefs.current.forEach((marker) => marker.remove())
  featureFinderMarkerRefs.current = []

  if (
    !isFeatureFinderPanelOpen ||
    !featureFinderBounds ||
    !hasRunFeatureFinderForSelectedArea ||
    featureFinderSuggestions.length === 0
  ) {
    return
  }

  featureFinderSuggestions.forEach((suggestion) => {
    const isHighlighted = hoveredFeatureFinderSuggestionId === suggestion.id
    const featureLabel =
      featureFinderOptions.find((option) => option.value === suggestion.type)
        ?.label ?? 'Feature'

    const markerElement = document.createElement('button')
    markerElement.type = 'button'
    markerElement.className = isHighlighted
      ? 'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-950 shadow-2xl ring-8 ring-orange-300 animate-pulse'
      : 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-800 shadow-xl ring-4 ring-orange-200 hover:bg-slate-950'
    markerElement.setAttribute('aria-label', suggestion.title)

    const markerDot = document.createElement('span')
    markerDot.className = 'h-2.5 w-2.5 rounded-full bg-orange-400'
    markerElement.appendChild(markerDot)

    markerElement.addEventListener('mouseenter', () => {
      onHoverFeatureFinderSuggestion(suggestion.id)
    })

    markerElement.addEventListener('mouseleave', () => {
      onHoverFeatureFinderSuggestion(null)
    })

    const popupContent = document.createElement('div')
    popupContent.style.minWidth = '210px'

    const typeLabel = document.createElement('p')
    typeLabel.style.margin = '0 0 4px'
    typeLabel.style.fontSize = '12px'
    typeLabel.style.fontWeight = '700'
    typeLabel.style.color = '#f97316'
    typeLabel.style.textTransform = 'uppercase'
    typeLabel.style.letterSpacing = '0.08em'
    typeLabel.textContent = featureLabel
    popupContent.appendChild(typeLabel)

    const title = document.createElement('p')
    title.style.margin = '0 0 6px'
    title.style.fontSize = '14px'
    title.style.fontWeight = '700'
    title.style.color = '#0f172a'
    title.textContent = suggestion.title
    popupContent.appendChild(title)

    const suitability = document.createElement('p')
    suitability.style.margin = '0 0 6px'
    suitability.style.fontSize = '12px'
    suitability.style.fontWeight = '700'
    suitability.style.color = '#334155'
    suitability.textContent = `Suitability: ${suggestion.suitability}%`
    popupContent.appendChild(suitability)

    const note = document.createElement('p')
    note.style.margin = '0'
    note.style.fontSize = '11px'
    note.style.lineHeight = '1.4'
    note.style.color = '#64748b'
    note.textContent =
      'Simulated Feature Finder marker. Save from the panel to convert this into a normal pin.'
    popupContent.appendChild(note)

    const popup = new mapboxgl.Popup({
      offset: 24,
      closeButton: true,
      closeOnClick: true,
    }).setDOMContent(popupContent)

    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat(suggestion.coordinates)
      .setPopup(popup)
      .addTo(map)

    featureFinderMarkerRefs.current.push(marker)
  })
}, [
  featureFinderSuggestions,
  featureFinderBounds,
  hasRunFeatureFinderForSelectedArea,
  hoveredFeatureFinderSuggestionId,
  isFeatureFinderPanelOpen,
  onHoverFeatureFinderSuggestion,
])

  useEffect(() => {
  if (!mapRef.current) {
    return
  }

  const map = mapRef.current

  function handleMapClick(event: mapboxgl.MapMouseEvent) {
    if (!isAddingPin) {
      return
    }

    onChoosePinLocation([event.lngLat.lng, event.lngLat.lat])
  }

  map.on('click', handleMapClick)

  return () => {
    map.off('click', handleMapClick)
  }
}, [isAddingPin, onChoosePinLocation])

useEffect(() => {
  if (!mapRef.current) {
    return
  }

  const map = mapRef.current

  if (pendingMarkerRef.current) {
    pendingMarkerRef.current.remove()
    pendingMarkerRef.current = null
  }

  if (!pendingPinCoordinates) {
    return
  }

  const markerElement = document.createElement('div')
  markerElement.className =
    'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-950 shadow-lg'

  const markerDot = document.createElement('span')
  markerDot.className = 'h-2.5 w-2.5 rounded-full bg-orange-400'
  markerElement.appendChild(markerDot)

  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'center',
  })
    .setLngLat(pendingPinCoordinates)
    .addTo(map)

  pendingMarkerRef.current = marker
}, [pendingPinCoordinates])

return (
  <section className="relative h-[calc(100vh-1.5rem)] min-h-[640px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
    <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              Map Setup Needed
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              Mapbox token missing
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add your Mapbox public token to a local .env file using
              VITE_MAPBOX_TOKEN. The real token should stay local and should
              not be committed to GitHub.
            </p>
          </div>
        </div>
      )}

{isFeatureFinderPanelOpen && isSelectingFeatureFinderArea && !featureFinderBounds && (
  <div className="pointer-events-none absolute left-1/2 top-5 w-80 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
    <p className="text-sm font-bold text-slate-900">
      Select an analysis area
    </p>
    <p className="mt-1 text-xs leading-5 text-slate-600">
      Click and drag on the map to draw the area you want Feature Finder to evaluate.
    </p>
  </div>
)}

<div className="absolute left-5 top-5 w-72 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
  {isAddingPin ? (
    <>
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
    {pendingPinCoordinates ? 'New Pin' : 'Add Pin Mode'}
  </p>

  {!pendingPinCoordinates ? (
    <>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        Click the map to place a pin
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        Drop a waypoint on the map, then add the pin details without leaving the map view.
      </p>

      <button
        type="button"
        onClick={handleCancelNewPin}
        className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cancel Add Pin
      </button>
    </>
  ) : (
    <>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        Add pin details
      </p>

      <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        <p>Lng: {pendingPinCoordinates[0].toFixed(5)}</p>
        <p>Lat: {pendingPinCoordinates[1].toFixed(5)}</p>
      </div>

      <label className="mt-3 block text-xs font-semibold text-slate-700">
        Pin Name
        <input
          type="text"
          value={newPinDraft.name}
          onChange={(event) =>
            setNewPinDraft((currentDraft) => ({
              ...currentDraft,
              name: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="Example: North ridge glassing"
        />
      </label>

      <label className="mt-3 block text-xs font-semibold text-slate-700">
        Pin Type
        <select
          value={newPinDraft.type}
          onChange={(event) =>
            setNewPinDraft((currentDraft) => ({
              ...currentDraft,
              type: event.target.value as UserPinDraft['type'],
            }))
          }
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          {pinTypeOptions.map((pinType) => (
            <option key={pinType.value} value={pinType.value}>
              {pinType.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-3 block text-xs font-semibold text-slate-700">
        Notes
        <textarea
          value={newPinDraft.notes}
          onChange={(event) =>
            setNewPinDraft((currentDraft) => ({
              ...currentDraft,
              notes: event.target.value,
            }))
          }
          className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          placeholder="Add context about why this spot matters."
        />
      </label>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleSaveNewPin}
          className="flex-1 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
        >
          Save Pin
        </button>

        <button
          type="button"
          onClick={handleCancelNewPin}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </>
  )}
</>
  ) : (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
        Map Tools
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        Add a scouting pin
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        Click Add Pin, then choose a location on the map.
      </p>

    <div className="mt-4 grid gap-2">
  <button
    type="button"
    onClick={onStartAddingPin}
    className="w-full rounded-xl bg-orange-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
  >
    Add Pin
  </button>

  <button
    type="button"
    onClick={onRunPinCleanup}
    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-100"
  >
    Pin Cleanup
  </button>

  <button
  type="button"
  onClick={onOpenFeatureFinderPanel}
  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-100"
  >
  Feature Finder
  </button>
</div>
    </>
  )}
</div>

<div className="absolute bottom-14 left-5 w-80 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
    Scenario
  </p>

  <p className="mt-1 text-sm font-bold text-slate-900">
    {activeScenario.name}
  </p>

  <p className="mt-1 text-xs leading-5 text-slate-600">
    {activeScenario.subtitle}
  </p>

  <button
    type="button"
    onClick={onGenerateScenario}
    className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
  >
    Generate New Scenario
  </button>
</div>

{isCleanupPanelOpen &&
  (isAnalyzingCleanup ||
    cleanupSuggestions.length > 0 ||
    savedPinFolders.length > 0) && (
  <div className="absolute right-5 top-5 max-h-[calc(100%-2.5rem)] w-96 overflow-y-auto rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
    <div className="flex items-start justify-between gap-3">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
      Pin Cleanup
    </p>
    <p className="mt-1 text-sm font-bold text-slate-900">
      Cleanup recommendations
    </p>
  </div>

  <button
    type="button"
    onClick={onCloseCleanupPanel}
    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
  >
    Close
  </button>
</div>

    {isAnalyzingCleanup ? (
      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          Analyzing current scenario pins…
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Checking proximity, timing, and pin context.
        </p>
      </div>
    ) : (
      <>
        {cleanupSuggestions.length === 0 && savedPinFolders.length === 0 && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-sm font-bold text-slate-900">
              Not enough related pins found.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Add more pins or switch scenarios to run cleanup again.
            </p>
          </div>
        )}

        {cleanupSuggestions.length > 0 && (
  <div className="mt-4 space-y-3">
    {cleanupSuggestions.map((suggestion) => {
      const cleanupDraft = getCleanupDraft(suggestion)

      return (
        <div
          key={suggestion.id}
          onMouseEnter={() => onHoverCleanupSuggestion(suggestion.id)}
          onMouseLeave={() => {
            onHoverCleanupSuggestion(null)
            setHoveredCleanupPinId(null)
            }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">
                {suggestion.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-orange-600">
                Confidence: {suggestion.confidence}%
              </p>
            </div>

            {hoveredCleanupSuggestionId === suggestion.id && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-700">
                Highlighting
              </span>
            )}
          </div>

          <label className="mt-3 block text-xs font-semibold text-slate-700">
            Folder Name
            <input
              type="text"
              value={cleanupDraft.folderName}
              onChange={(event) =>
                updateCleanupFolderName(suggestion.id, event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Why this grouping?
            </p>

            <ul className="mt-2 space-y-1">
              {suggestion.explanation.map((explanationItem) => (
                <li
                  key={explanationItem}
                  className="text-xs leading-5 text-slate-600"
                >
                  • {explanationItem}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Included Pins
            </p>

            {suggestion.pinIds.map((pinId) => {
              const pin = getPinById(pinId)

              if (!pin) {
                return null
              }

              return (
                    <div
                        key={pin.id}
                        onMouseEnter={() => setHoveredCleanupPinId(pin.id)}
                        onMouseLeave={() => setHoveredCleanupPinId(null)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {pin.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                        {formatPinType(pin.type)}
                      </p>
                    </div>
                  </div>

                  <label className="mt-2 block text-[11px] font-semibold text-slate-600">
                    Folder Assignment
                    <select
                      value={
                        cleanupDraft.pinAssignments[pin.id] ?? 'recommended'
                      }
                      onChange={(event) =>
                        updateCleanupPinAssignment({
                          suggestion,
                          pinId: pin.id,
                          destinationFolderId: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-normal text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="recommended">
                        Recommended Folder
                      </option>

                      {savedPinFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}

                      <option value="none">No Folder</option>
                    </select>
                  </label>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleAcceptCleanupSuggestion(suggestion)}
              className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Accept Grouping
            </button>

            <button
              type="button"
              onClick={() => handleDismissCleanupSuggestion(suggestion.id)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )
    })}
  </div>
 )}

        {savedPinFolders.length > 0 && (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saved Cleanup Groups
            </p>

            <div className="mt-3 space-y-2">
              {savedPinFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {folder.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {folder.pinIds.length} pins
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </div>
)}

{isFeatureFinderPanelOpen && (
  <div className="absolute right-5 top-5 max-h-[calc(100%-2.5rem)] w-96 overflow-y-auto rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
          Feature Finder
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          Find scouting features
        </p>
      </div>

      <button
        type="button"
        onClick={handleCloseFeatureFinderPanel}
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
      >
        Close
      </button>
    </div>

    {featureFinderBounds ? (
      <>
    <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50 px-3 py-3">
      <p className="text-sm font-bold text-slate-900">
        Area selected
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        Choose one or more hunt-specific features to search for, then hit Run.
      </p>
    </div>

    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        What are you looking for?
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {featureFinderOptions.map((option) => {
          const isSelected = selectedFeatureFinderTypes.includes(option.value)

          return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggleFeatureFinderType(option.value)}
            aria-pressed={isSelected}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
              isSelected
                ? 'border-orange-300 bg-orange-50 text-orange-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50'
            }`}
          >
            {option.label}
          </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleRunFeatureFinder}
        disabled={!featureFinderBounds || selectedFeatureFinderTypes.length === 0}
        className="mt-3 w-full rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Run Feature Finder
      </button>
    </div>

    {featureFinderRunError ? (
      <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          Select a smaller area
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {featureFinderRunError}
        </p>
      </div>
    ) : isAnalyzingFeatures ? (
      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          Analyzing selected terrain…
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          ScoutNavigator is sampling elevation, comparing terrain shape, and ranking likely hunt-specific feature candidates.
        </p>
      </div>
    ) : hasRunFeatureFinderForSelectedArea && featureFinderSuggestions.length > 0 ? (
      <div className="mt-4 space-y-3">
        {featureFinderSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            onMouseEnter={() => onHoverFeatureFinderSuggestion(suggestion.id)}
            onMouseLeave={() => onHoverFeatureFinderSuggestion(null)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {suggestion.title}
                </p>
                <p className="mt-1 text-xs font-semibold text-orange-600">
                  Suitability: {suggestion.suitability}%
                </p>
              </div>

              {hoveredFeatureFinderSuggestionId === suggestion.id && (
                <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-700">
                  Highlighting
                </span>
              )}
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Why this spot?
              </p>

              <ul className="mt-2 space-y-1">
                {suggestion.explanation.map((explanationItem) => (
                  <li
                    key={explanationItem}
                    className="text-xs leading-5 text-slate-600"
                  >
                    • {explanationItem}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Suggested action
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {suggestion.suggestedAction}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onSaveFeatureFinderSuggestion(suggestion.id)}
                className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Save as Pin
              </button>

              <button
                type="button"
                onClick={() => onDismissFeatureFinderSuggestion(suggestion.id)}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          Choose a feature type.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Feature Finder will generate simulated opportunity markers for the active scenario.
        </p>
      </div>
    )}
      </>
    ) : (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          Select an area on the map
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Draw a rectangle to define where Feature Finder should look.
        </p>
      </div>
    )}
  </div>
)}

{isFoldersPanelOpen && (
  <div className="absolute right-5 top-5 max-h-[calc(100%-2.5rem)] w-96 overflow-y-auto rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
          Folders
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          {selectedFolder ? selectedFolder.name : 'Saved folders'}
        </p>
      </div>

      <button
        type="button"
        onClick={onCloseFoldersPanel}
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
      >
        Close
      </button>
    </div>

    {selectedFolder ? (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setEditingFolderPinId(null)
            onSelectFolder(null)
          }}
          className="text-xs font-bold text-orange-700 hover:text-orange-800"
        >
          ← Back to folders
        </button>

        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Folder contents
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Review accepted cleanup pins. Removing a pin makes it eligible for Pin Cleanup again.
          </p>
        </div>

        {selectedFolderPins.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4">
            <p className="text-sm font-bold text-slate-900">
              No pins in this folder.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              The folder stays visible, but removed pins can be analyzed again.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {selectedFolderPins.map((pin) => {
              const isEditing = editingFolderPinId === pin.id

              return (
                <div
                  key={pin.id}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {pin.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {formatPinType(pin.type)}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingFolderPinId(isEditing ? null : pin.id)
                        }
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100"
                      >
                        {isEditing ? 'Done' : 'Edit'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingFolderPinId(null)
                          onRemovePinFromFolder(selectedFolder.id, pin.id)
                        }}
                        className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-bold text-slate-900">
                        Pin details
                      </p>
                      <dl className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                        <div>
                          <dt className="inline font-bold text-slate-700">
                            Type:{' '}
                          </dt>
                          <dd className="inline">{formatPinType(pin.type)}</dd>
                        </div>
                        <div>
                          <dt className="inline font-bold text-slate-700">
                            Observed:{' '}
                          </dt>
                          <dd className="inline">{pin.observedAt}</dd>
                        </div>
                        <div>
                          <dt className="inline font-bold text-slate-700">
                            Source:{' '}
                          </dt>
                          <dd className="inline">{pin.source}</dd>
                        </div>
                        <div>
                          <dt className="inline font-bold text-slate-700">
                            Notes:{' '}
                          </dt>
                          <dd className="inline">
                            {pin.notes || 'No notes provided.'}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-bold text-slate-700">
                            Coordinates:{' '}
                          </dt>
                          <dd className="inline">
                            {pin.coordinates[1].toFixed(5)},{' '}
                            {pin.coordinates[0].toFixed(5)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    ) : savedPinFolders.length === 0 ? (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <p className="text-sm font-bold text-slate-900">
          No saved folders yet.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Run Pin Cleanup and accept a recommendation to create your first folder.
        </p>
      </div>
    ) : (
      <div className="mt-4 space-y-2">
        {savedPinFolders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => {
              setEditingFolderPinId(null)
              onSelectFolder(folder.id)
            }}
            className={`w-full rounded-xl border px-3 py-3 text-left shadow-sm transition ${
              selectedFolderId === folder.id
                ? 'border-orange-300 bg-orange-50'
                : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50'
            }`}
          >
            <p className="text-sm font-bold text-slate-900">{folder.name}</p>
            <p className="mt-1 text-xs text-slate-600">
              {folder.pinIds.length} pins
            </p>
          </button>
        ))}
      </div>
    )}
  </div>
)}

<div className="absolute bottom-4 left-5 rounded-full border border-white/60 bg-white/75 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
  Demo Mode · Scenarios use simulated scouting data layered over real Idaho terrain.
</div>
    </section>
  )
}

export default MapViewer
