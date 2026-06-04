import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type {
  AcceptCleanupSuggestionInput,
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
  { value: 'blood', label: 'Blood' },
  { value: 'shot', label: 'Shot' },
  { value: 'deer', label: 'Deer' },
  { value: 'elk', label: 'Elk' },
  { value: 'generic-marker', label: 'Generic Marker' },
]

function formatPinType(type: ScoutPin['type']) {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
  const pendingMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

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

        if (pendingMarkerRef.current) {
            pendingMarkerRef.current.remove()
            pendingMarkerRef.current = null
        }

        map.remove()
        mapRef.current = null
}
  }, [])

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