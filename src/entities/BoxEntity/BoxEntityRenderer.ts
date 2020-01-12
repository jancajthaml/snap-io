
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'

class BoxEntityRenderer {

  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(props: IEntitySchema) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.color = props.color
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _: number) => {
    ctx.fillStyle = this.color

    const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z
    const W = Math.round(this.width) * gridSize * viewport.z
    const H = Math.round(this.height) * gridSize * viewport.z

    ctx.fillRect(X, Y, W, H);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _: number) => {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color

    const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z
    const W = Math.round(this.width) * gridSize * viewport.z
    const H = Math.round(this.height) * gridSize * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(X + offset, Y + offset, W - 2 * offset, H - 2 * offset);
    ctx.strokeRect(X, Y, W, H);
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    if (layer !== 1) {
      return
    }
    if (viewport.z <= 0.4) {
      this.drawSimple(ctx, viewport, gridSize, timestamp)
    } else {
      this.drawDetail(ctx, viewport, gridSize, timestamp)
    }
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
    color: this.color,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })
}

export default BoxEntityRenderer