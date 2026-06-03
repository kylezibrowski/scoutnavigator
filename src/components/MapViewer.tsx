import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { ScenarioRegion } from "../types/scout"

type MapViewerProps = {
  activeScenario: ScenarioRegion
}

function MapViewer({ activeScenario }: MapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

    if (!mapboxToken) {
        setMapError("Missing Mapbox token. Add VITE_MAPBOX_TOKEN to your local .env file.")
        console.error("Missing VITE_MAPBOX_TOKEN environment variable.")
        return
    }

    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    mapboxgl.accessToken = mapboxToken

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: activeScenario.camera.center,
      zoom: activeScenario.camera.zoom,
      pitch: activeScenario.camera.pitch,
      bearing: activeScenario.camera.bearing,
      attributionControl: false,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right")

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      })

      map.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.4,
      })

      map.setFog({
        color: "rgb(245, 247, 250)",
        "high-color": "rgb(210, 220, 235)",
        "horizon-blend": 0.2,
      })
    })

    return () => {
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
        Add your Mapbox public token to a local .env file using VITE_MAPBOX_TOKEN.
        The real token should stay local and should not be committed to GitHub.
      </p>
    </div>
  </div>
)}

      <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
          Idaho Terrain
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Mapbox terrain foundation
        </p>
        <p className="mt-1 max-w-64 text-xs leading-5 text-slate-600">
          Simulated scouting layers will be added over real Idaho terrain in the next phase.
        </p>
      </div>
    </section>
  )
}

export default MapViewer