
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import TextLibrary from './TextLibrary'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'
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

  drawEdit = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    let W = (this.width * gridSize)
    let H = (this.height * gridSize)

    const image = TextLibrary.get(this.text, 12, W, H)
    if (image) {
      this.buffer = image
    }

    const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
    W *= viewport.z
    H *= viewport.z

    if (this.buffer) {
      ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, X, Y, W, H);
    }

    ctx.strokeStyle = "black"
    ctx.strokeRect(X, Y, W, H);
  }

  drawView = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    let W = (this.width * gridSize)
    let H = (this.height * gridSize)

    const image = TextLibrary.get(this.text, 12, W, H)
    if (image) {
      this.buffer = image
    }
    if (this.buffer) {
      const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
      const Y = (viewport.y1 +(this.y * gridSize)) * viewport.z
      W *= viewport.z
      H *= viewport.z
      ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, X, Y, W, H);
    }
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
        this.drawView(ctx, viewport, gridSize)
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
    text: this.text,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })

}

export default TextEntityRenderer
