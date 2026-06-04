type LeftRailProps = {
  activeSection: 'map' | 'folders'
  onOpenFoldersPanel: () => void
}

function LeftRail({ activeSection, onOpenFoldersPanel }: LeftRailProps) {
  const mapButtonClassName =
    activeSection === 'map'
      ? 'rounded-xl bg-orange-50 px-3 py-2 text-orange-700'
      : 'rounded-xl px-3 py-2 hover:bg-stone-100'

  const foldersButtonClassName =
    activeSection === 'folders'
      ? 'rounded-xl bg-orange-50 px-3 py-2 text-orange-700'
      : 'rounded-xl px-3 py-2 hover:bg-stone-100'

  return (
    <aside className="flex w-20 flex-col items-center border-r border-stone-200 bg-white py-5 shadow-sm">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-white shadow-sm">
        SN
      </div>

      <nav className="flex flex-1 flex-col gap-4 text-xs font-semibold text-slate-500">
        <button type="button" className={mapButtonClassName}>
          Map
        </button>

        <button
          type="button"
          className="rounded-xl px-3 py-2 hover:bg-stone-100"
        >
          Pins
        </button>

        <button
          type="button"
          onClick={onOpenFoldersPanel}
          className={foldersButtonClassName}
        >
          Folders
        </button>

        <button
          type="button"
          className="rounded-xl px-3 py-2 hover:bg-stone-100"
        >
          Tools
        </button>
      </nav>

      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Demo
      </div>
    </aside>
  )
}

export default LeftRail