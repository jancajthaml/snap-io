
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'
import { ICanvasEntitySchema } from '../../@types/index'

class BoxEntityRenderer implements ICanvasEntitySchema {

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

  drawEdit = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
    const W = (this.width * gridSize) * viewport.z
    const H = (this.height * gridSize) * viewport.z

    ctx.strokeStyle = "black"
    ctx.strokeRect(X, Y, W, H);
  }

  drawViewSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
    const W = (this.width * gridSize) * viewport.z
    const H = (this.height * gridSize) * viewport.z

    ctx.fillStyle = this.color
    ctx.fillRect(X, Y, W, H);
  }

  drawViewDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
    const W = (this.width * gridSize) * viewport.z
    const H = (this.height * gridSize) * viewport.z

    const offset = 3 * viewport.z

    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.fillRect(X + offset, Y + offset, W - 2 * offset, H - 2 * offset);
    ctx.strokeRect(X, Y, W, H);
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (layer !== 1) {
      return
    }
    switch (mode) {
      case EngineMode.EDIT: {
        this.drawEdit(ctx, viewport, gridSize)
        break
      }
      case EngineMode.VIEW: {
        if (viewport.z <= 0.4) {
          this.drawViewSimple(ctx, viewport, gridSize)
        } else {
          this.drawViewDetail(ctx, viewport, gridSize)
        }
        break
      }
      default: {
        break
      }
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle) => {
    if ((viewport.x2 - 2 * viewport.x1 - this.x * gridSize) < 0) {
      return false
    }
    if ((viewport.x1 + (this.x + this.width) * gridSize) < 0) {
      return false
    }
    if ((viewport.y2 - 2 * viewport.y1 - this.y * gridSize) < 0) {
      return false
    }
    if ((viewport.y1 + (this.y + this.height) * gridSize) < 0) {
      return false
    }
    return true
  }

  getCenter = (viewport: Rectangle, gridSize: number, _ids: string[], x: number, y: number, width: number, height: number) => {
    const X = (viewport.x1 + (x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (y * gridSize)) * viewport.z
    const W = (width * gridSize) * viewport.z
    const H = (height * gridSize) * viewport.z
    return new Point(X + W / 2, Y + H / 2)
  }

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
