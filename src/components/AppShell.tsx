import ControlPanel from './ControlPanel'
import LeftRail from './LeftRail'
import MapViewer from './MapViewer'

function AppShell() {
  return (
    <main className="min-h-screen bg-[#f3f1eb] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <LeftRail />
        <ControlPanel />
        <MapViewer />
      </div>
    </main>
  )
}

export default AppShell