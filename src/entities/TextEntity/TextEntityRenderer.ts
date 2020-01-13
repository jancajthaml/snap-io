
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import TextLibrary from './TextLibrary'
import { ENTITY_TYPE } from './constants'
import { ICanvasEntitySchema } from '../../@types/index'

class TextEntityRenderer implements ICanvasEntitySchema {

  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  buffer: HTMLImageElement | null;

  constructor(props: IEntitySchema) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.text = props.text
    this.buffer = null
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (layer !== 1) {
      return
    }
    const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z
    const W = Math.round(this.width) * gridSize * viewport.z
    const H = Math.round(this.height) * gridSize * viewport.z

    const image = TextLibrary.get(this.text, 12, Math.round(this.width) * gridSize, Math.round(this.height) * gridSize)
    if (image) {
      this.buffer = image
    }
    if (this.buffer) {
      ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, X, Y, W, H);
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle) => {
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

  serialize = () => ({
    id: this.id,
    type: ENTITY_TYPE,
    text: this.text,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })

}

export default TextEntityRenderer
