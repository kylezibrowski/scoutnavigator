export type MapCamera = {
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
}

export type ScenarioRegion = {
  id: string
  name: string
  subtitle: string
  description: string
  terrainNotes: string
  primaryUseCase: string
  camera: MapCamera
}