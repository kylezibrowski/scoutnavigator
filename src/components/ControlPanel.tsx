import type { ScenarioRegion, ScoutPin } from '../types/scout'
import DemoDisclaimer from './DemoDisclaimer'

const savedFolders = [
  '2026 Elk Hunt',
  'Scouting North Zone',
  'Ridge Access Plan',
]



function formatPinType(type: ScoutPin['type']) {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

type ControlPanelProps = {
  activeScenario: ScenarioRegion
  activeScenarioPins: ScoutPin[]
  isAddingPin: boolean
  pendingPinCoordinates: ScoutPin['coordinates'] | null
  onGenerateScenario: () => void
  onStartAddingPin: () => void
  onCancelAddingPin: () => void
}

function ControlPanel({
  activeScenario,
  activeScenarioPins,
  isAddingPin,
  pendingPinCoordinates,
  onGenerateScenario,
  onStartAddingPin,
  onCancelAddingPin,
}: ControlPanelProps) {

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
  <p className="mt-1 text-sm font-bold text-slate-800">
    {activeScenario.name}
  </p>
  <p className="mt-1 text-sm text-slate-600">
    {activeScenario.subtitle}
  </p>
  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
    {activeScenario.primaryUseCase}
  </p>
  <p className="mt-2 text-sm leading-6 text-slate-600">
    {activeScenario.description}
  </p>

  <p className="mt-3 text-xs font-semibold text-slate-500">
    {activeScenarioPins.length} simulated pins ready for this scenario.
  </p>

  <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-xs leading-5 text-slate-600">
    {activeScenario.terrainNotes}
  </p>

  <button
    onClick={onGenerateScenario}
    className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
  >
    Generate New Scenario
  </button>
</div>

<div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-bold text-slate-950">Add Pin</h2>
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        isAddingPin
          ? 'bg-orange-50 text-orange-700'
          : 'bg-stone-100 text-slate-500'
      }`}
    >
      {isAddingPin ? 'Active' : 'Ready'}
    </span>
  </div>

  <p className="mt-2 text-sm leading-6 text-slate-600">
    Add a user-created scouting pin to the active scenario. You will choose the
    map location first, then enter the pin details.
  </p>

  {pendingPinCoordinates && (
  <div className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-xs leading-5 text-orange-800">
    <p className="font-bold">Pending pin location selected</p>
    <p>
      Longitude: {pendingPinCoordinates[0].toFixed(5)} · Latitude:{' '}
      {pendingPinCoordinates[1].toFixed(5)}
    </p>
  </div>
)}


  {isAddingPin ? (
    <button
      onClick={onCancelAddingPin}
      className="mt-4 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-stone-50"
    >
      Cancel Add Pin
    </button>
  ) : (
    <button
      onClick={onStartAddingPin}
      className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
    >
      Add Pin
    </button>
  )}
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
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-bold text-slate-950">Recent Pins</h2>
    <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
      {activeScenarioPins.length}
    </span>
  </div>

  <div className="mt-3 space-y-2">
    {activeScenarioPins.map((pin) => (
      <div
        key={pin.id}
        className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">{pin.name}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {formatPinType(pin.type)} · {pin.observedAt}
            </p>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {pin.source}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </section>
  )
}

export default ControlPanel