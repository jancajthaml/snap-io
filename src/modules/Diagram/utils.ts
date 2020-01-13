import { Rectangle } from '../../atoms'
import { IDiagramSchema } from './reducer'
import { MIN_ZOOM, MAX_ZOOM } from './constants'


export const calculateZoomedViewport = (viewport: Rectangle, resolution: Rectangle, centerX: number, centerY: number, direction: number, power: number): Rectangle => {
  const nextScale = direction >= 1
    ? Math.min(viewport.z * Math.pow(1.03, power), MAX_ZOOM)
    : Math.max(viewport.z / Math.pow(1.03, power), MIN_ZOOM)

  if (nextScale === viewport.z) {
    return viewport
  }

  const nextViewPort = viewport.copy()
  const x = centerX - resolution.x1 / 2
  const y = centerY - resolution.y1 / 2
  const zoomX = (x - nextViewPort.x1 * viewport.z) / viewport.z
  const zoomY = (y - nextViewPort.y1 * viewport.z) / viewport.z

  nextViewPort.x1 = (-zoomX * nextScale + x) / nextScale
  nextViewPort.x2 = nextViewPort.x1 + ((resolution.x2 - resolution.x1) / nextScale)
  nextViewPort.y1 = (-zoomY * nextScale + y) / nextScale
  nextViewPort.y2 = nextViewPort.y1 + ((resolution.y2 - resolution.y1) / nextScale)
  nextViewPort.z = nextScale

  return nextViewPort
}

export const calculateOptimalViewport = (schema: IDiagramSchema, gridSize: number, resolution: Rectangle): Rectangle | null => {
  const viewport = new Rectangle()

  let x1: number | undefined = undefined
  let y1: number | undefined = undefined
  let x2: number | undefined = undefined
  let y2: number | undefined = undefined

  schema.entities.forEach((element) => {
    if (x1 === undefined || element.x < x1) {
      x1 = element.x
    }
    if (x2 === undefined || (element.x + element.width) > x2) {
      x2 = (element.x + element.width)
    }
    if (y1 === undefined || element.y < y1) {
      y1 = element.y
    }
    if (y2 === undefined || (element.y + element.height) > y2) {
      y2 = (element.y + element.height)
    }
  })

  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return null
  }

  x1 = (x1 as number) * gridSize
  x2 = (x2 as number) * gridSize
  y1 = (y1 as number) * gridSize
  y2 = (y2 as number) * gridSize

  const xScale = (resolution.x2 - resolution.x1) / (x2 - x1)
  const yScale = (resolution.y2 - resolution.y1) / (y2 - y1)

  const nextScale = Math.max(Math.min(Math.min(xScale, yScale) / Math.pow(1.03, 2), MAX_ZOOM), MIN_ZOOM)

  const normalizedDiffWidth = (resolution.x2 - resolution.x1) - (x2 - x1) * nextScale
  const normalizedDiffHeight = (resolution.y2 - resolution.y1) - (y2 - y1) * nextScale

  viewport.x1 = -x1 + (normalizedDiffWidth / nextScale) / 2
  viewport.x2 = viewport.x1 + ((resolution.x2 - resolution.x1) / nextScale)
  viewport.y1 = -y1 + (normalizedDiffHeight / nextScale) / 2
  viewport.y2 = viewport.y1 + ((resolution.y2 - resolution.y1) / nextScale)
  viewport.z = nextScale
  return viewport
}
