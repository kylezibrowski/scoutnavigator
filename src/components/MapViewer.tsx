function MapViewer() {
  return (
    <section className="relative flex flex-1 flex-col bg-[#d9d2c4]">
      <div className="absolute left-6 top-6 z-10 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Current Region
        </p>
        <h2 className="mt-1 text-xl font-black text-slate-950">
          Idaho Terrain Preview
        </h2>
        <p className="mt-1 max-w-md text-sm text-slate-600">
          Mapbox terrain loads in Phase 2. This placeholder gives us the final
          product layout before wiring the real map.
        </p>
      </div>

      <div className="grid h-full place-items-center">
        <div className="relative h-[620px] w-[78%] overflow-hidden rounded-[2rem] border border-white/70 bg-[#b9c3a3] shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_35%),radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.5),transparent_18%),radial-gradient(circle_at_65%_70%,rgba(84,104,68,0.35),transparent_24%),radial-gradient(circle_at_75%_20%,rgba(80,96,62,0.3),transparent_18%)]" />

          <div className="absolute left-[26%] top-[34%] h-5 w-5 rounded-full border-4 border-white bg-orange-500 shadow-lg" />
          <div className="absolute left-[52%] top-[48%] h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-lg" />
          <div className="absolute left-[61%] top-[31%] h-5 w-5 rounded-full border-4 border-white bg-emerald-600 shadow-lg" />
          <div className="absolute left-[42%] top-[62%] h-5 w-5 rounded-full border-4 border-white bg-red-500 shadow-lg" />

          <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow">
            Map placeholder · Phase 1
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapViewer