import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { ScenarioRegion, ScoutPin } from '../types/scout'

type MapViewerProps = {
  activeScenario: ScenarioRegion
  activeScenarioPins: ScoutPin[]
  isAddingPin: boolean
  pendingPinCoordinates: ScoutPin['coordinates'] | null
  onChoosePinLocation: (coordinates: ScoutPin['coordinates']) => void
}

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
  onChoosePinLocation,
}: MapViewerProps) {
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
    <section className="relative h-full min-h-[640px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
      <div ref={mapContainerRef} className="h-full w-full" />

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

      <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
          Active Scenario
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {activeScenario.name}
        </p>
        <p className="mt-1 max-w-64 text-xs leading-5 text-slate-600">
          Simulated scouting context over real Idaho terrain.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {activeScenarioPins.length} simulated pins loaded.
        </p>
        {isAddingPin && (
            <p className="mt-2 rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
            Add Pin mode active — click the map to choose a location.
            </p>
            )}
      </div>
    </section>
  )
}

export default MapViewer