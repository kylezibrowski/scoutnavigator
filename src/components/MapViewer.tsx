import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

function MapViewer() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

    if (!mapboxToken) {
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
      center: [-115.1886, 44.2141],
      zoom: 8.2,
      pitch: 55,
      bearing: -18,
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

  return (
    <section className="relative h-full min-h-[640px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
      <div ref={mapContainerRef} className="h-full w-full" />

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

export { MapViewer }
export default MapViewer