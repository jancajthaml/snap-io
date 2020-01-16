
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import ImageLibrary from './ImageLibrary'
import { ENTITY_TYPE } from './constants'

import { EngineMode } from '../../modules/Diagram/constants'
import { ICanvasEntitySchema } from '../../@types/index'

class ImageEntityRenderer implements ICanvasEntitySchema {

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

  drawEdit = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    const W = Math.round(this.width) * gridSize * viewport.z
    const H = Math.round(this.height) * gridSize * viewport.z
    const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z

    const image = ImageLibrary.get(this.url, timestamp)

    const w_i = image.width as number
    if (w_i !== 0) {
      const h_i = image.height as number
      const ratio  = Math.min(W / w_i, H / h_i);

      ctx.drawImage(image, 0, 0, w_i, h_i, X + (W - w_i * ratio) / 2, Y + (H - h_i * ratio) / 2, w_i * ratio, h_i * ratio);
    }

    ctx.strokeStyle = "black"
    ctx.strokeRect(X, Y, W, H);
  }

  drawView = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    const image = ImageLibrary.get(this.url, timestamp)
    if (image === null) {
      return
    }
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

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    if (layer !== 1) {
      return
    }
    switch (mode) {
      case EngineMode.EDIT: {
        this.drawEdit(ctx, viewport, gridSize, timestamp)
        break
      }
      case EngineMode.VIEW: {
        this.drawView(ctx, viewport, gridSize, timestamp)
        break
      }
      default: {
        break
      }
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
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
    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z
    return new Point(X + W / 2, Y + H / 2)
  }

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
