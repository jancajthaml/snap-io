
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import ImageLibrary from './ImageLibrary'
import { ENTITY_TYPE } from './constants'

class ImageEntityRenderer {

  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;

  constructor(props: IEntitySchema) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.url = props.url
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    if (layer !== 1) {
      return
    }
    let image = ImageLibrary.get(this.url, timestamp)

    const w_i = image.width as number
    if (w_i === 0) {
      return
    }
    const h_i = image.height as number
    const W = Math.round(this.width) * gridSize * viewport.z
    const H = Math.round(this.height) * gridSize * viewport.z

    const ratio  = Math.min(W / w_i, H / h_i);

    const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z

    ctx.drawImage(image, 0, 0, w_i, h_i, X + (W - w_i * ratio) / 2, Y + (H - h_i * ratio) / 2, w_i * ratio, h_i * ratio);
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.x + this.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.y + this.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  getCenter = (viewport: Rectangle, gridSize: number, _ids: string[], x: number, y: number, width: number, height: number) => {
    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z
    return new Point(X + W / 2, Y + H / 2)
  }

  canBeLinked = () => false

  serialize = () => ({
    id: this.id,
    type: ENTITY_TYPE,
    url: this.url,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })
}

export default ImageEntityRenderer
