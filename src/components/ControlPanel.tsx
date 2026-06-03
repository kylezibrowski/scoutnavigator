import DemoDisclaimer from './DemoDisclaimer'

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

function ControlPanel() {
  return (
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

      <DemoDisclaimer />

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
  )
}

export default ControlPanel