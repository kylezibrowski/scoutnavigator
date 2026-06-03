import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { ScenarioRegion, ScoutPin, UserPinDraft } from '../types/scout'

type MapViewerProps = {
  activeScenario: ScenarioRegion
  activeScenarioPins: ScoutPin[]
  isAddingPin: boolean
  pendingPinCoordinates: ScoutPin['coordinates'] | null
  onStartAddingPin: () => void
  onCancelAddingPin: () => void
  onChoosePinLocation: (coordinates: ScoutPin['coordinates']) => void
  onSaveUserPin: (pinDraft: UserPinDraft) => void
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
  onStartAddingPin,
  onCancelAddingPin,
  onChoosePinLocation,
  onSaveUserPin,
}: MapViewerProps) {
      const [newPinDraft, setNewPinDraft] = useState<UserPinDraft>({
    name: '',
    type: 'generic-marker',
    notes: '',
  })

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

    activeScenarioPins.forEach((pin) => {
      const markerElement = document.createElement('button')
      markerElement.type = 'button'
      markerElement.className =
  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow-lg hover:bg-orange-600'
      markerElement.setAttribute('aria-label', pin.name)

      const markerDot = document.createElement('span')
      markerDot.className = 'h-2.5 w-2.5 rounded-full bg-white'
      markerElement.appendChild(markerDot)

      const popup = new mapboxgl.Popup({
        offset: 24,
        closeButton: true,
        closeOnClick: true,
      }).setHTML(`
        <div style="min-width: 180px;">
          <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 0.08em;">
            ${formatPinType(pin.type)}
          </p>
          <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #0f172a;">
            ${pin.name}
          </p>
          <p style="margin: 0 0 6px; font-size: 12px; line-height: 1.4; color: #475569;">
            ${pin.notes}
          </p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">
            Source: ${pin.source} · Observed: ${pin.observedAt}
          </p>
        </div>
      `)

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat(pin.coordinates)
        .setPopup(popup)
        .addTo(map)

      markerRefs.current.push(marker)
    })
  }, [activeScenarioPins])

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

      <button
        type="button"
        onClick={onStartAddingPin}
        className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
      >
        Add Pin
      </button>
    </>
  )}
</div>
    </section>
  )
}

export default MapViewer