import './App.css'

const savedFolders = [
  '2026 Elk Hunt',
  'Scouting North Zone',
  'Ridge Access Plan',
]

const recentPins = [
  'Water - Creek Crossing',
  'Sign - Fresh Tracks',
  'Glassing Point - East Knob',
  'Bedding - Timber Pocket',
]

function App() {
  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <aside className="flex w-20 flex-col items-center border-r border-stone-200 bg-white py-5 shadow-sm">
          <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-white shadow-sm">
            SN
          </div>

          <nav className="flex flex-1 flex-col gap-4 text-xs font-semibold text-slate-500">
            <button className="rounded-xl bg-orange-50 px-3 py-2 text-orange-700">
              Map
            </button>
            <button className="rounded-xl px-3 py-2 hover:bg-stone-100">
              Pins
            </button>
            <button className="rounded-xl px-3 py-2 hover:bg-stone-100">
              Folders
            </button>
            <button className="rounded-xl px-3 py-2 hover:bg-stone-100">
              Tools
            </button>
          </nav>

          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Demo
          </div>
        </aside>

        <section className="w-[390px] overflow-y-auto border-r border-stone-200 bg-[#faf9f5] p-5">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
              Field Intelligence
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              ScoutNavigator
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Simulated Idaho scouting workflows over real terrain. Organize pins,
              review terrain clues, and keep the hunter in control.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">
            <p className="font-bold">Demo Mode</p>
            <p className="mt-1 leading-5">
              Scenarios use simulated scouting data over real Idaho terrain.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Scenario</h2>
            <p className="mt-1 text-sm text-slate-600">
              Boise National Forest scouting loop
            </p>

            <button className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600">
              Generate New Scenario
            </button>
          </div>

          <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-950">Pin Cleanup</h2>
              <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-slate-500">
                Coming soon
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Recommend folder groupings based on proximity, timing, and context.
              Nothing moves without confirmation.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-950">
                Find Feature Terrains
              </h2>
              <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-slate-500">
                Moonshot
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Highlight simulated saddles, benches, water, ridgelines, bedding,
              food, wallows, and glassing areas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-950">Saved Folders</h2>
              <div className="mt-3 space-y-2">
                {savedFolders.map((folder) => (
                  <div
                    key={folder}
                    className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {folder}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-950">Recent Pins</h2>
              <div className="mt-3 space-y-2">
                {recentPins.map((pin) => (
                  <div
                    key={pin}
                    className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {pin}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex flex-1 flex-col bg-[#d9d2c4]">
          <div className="absolute left-6 top-6 z-10 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Current Region
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Idaho Terrain Preview
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Mapbox terrain loads in Phase 2. This placeholder gives us the
              final product layout before wiring the real map.
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
      </div>
    </main>
  )
}

export default App