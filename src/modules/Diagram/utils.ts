import Rectangle from '../../atoms/Rectangle'
import { IDiagramSchema } from './reducer'


export const calculateOptimalViewport = (schema: IDiagramSchema, resolution: Rectangle): Rectangle | null => {
  const viewport = new Rectangle()

  let x1: number | undefined = undefined
  let y1: number | undefined = undefined
  let x2: number | undefined = undefined
  let y2: number | undefined = undefined

  Object.values(schema.root).forEach((element) => {
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

  const xScale = (resolution.x2 - resolution.x1) / (x2 - x1)
  const yScale = (resolution.y2 - resolution.y1) / (y2 - y1)

  const nextScale = Math.max(Math.min(Math.min(xScale, yScale) / Math.pow(1.03, 2), 8), 0.3)

  const normalizedDiffWidth = (resolution.x2 - resolution.x1) - (x2 - x1) * nextScale
  const normalizedDiffHeight = (resolution.y2 - resolution.y1) - (y2 - y1) * nextScale

  viewport.x1 = -x1 + (normalizedDiffWidth / nextScale) / 2
  viewport.x2 = viewport.x1 + ((resolution.x2 - resolution.x1) / nextScale)
  viewport.y1 = -y1 + (normalizedDiffHeight / nextScale) / 2
  viewport.y2 = viewport.y1 + ((resolution.y2 - resolution.y1) / nextScale)
  viewport.z = nextScale
  return viewport
}
