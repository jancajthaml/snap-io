
import { IEntitySchema } from './types'
import { Rectangle } from '../../atoms'

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
  gridSize: number;
  viewport: Rectangle;
  clientX: number;
  clientY: number;
  clientW: number;
  clientH: number;
  visible: boolean;

  constructor(props: IEntitySchema) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.url = props.url
    this.gridSize = 1
    this.viewport = new Rectangle()
    this.clientX = 1
    this.clientY = 1
    this.clientW = 1
    this.clientH = 1
    this.visible = true
  }

  drawEdit = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    this.drawView(ctx, timestamp)
    //ctx.strokeStyle = "black"
    //ctx.strokeRect(this.clientX, this.clientY, this.clientW, this.clientH);
  }

  drawView = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const image = ImageLibrary.get(this.url, timestamp)
    if (image === null) {
      ctx.fillStyle = "orange"
      ctx.fillRect(this.clientX, this.clientY, this.clientW, this.clientH)
      return
    }

    const w_i = image.width as number
    const h_i = image.height as number
    const ratio  = Math.min(this.clientW / w_i, this.clientH / h_i);

    ctx.drawImage(image, 0, 0, w_i, h_i, this.clientX + (this.clientW - w_i * ratio) / 2, this.clientY + (this.clientH - h_i * ratio) / 2, w_i * ratio, h_i * ratio);
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    if (layer !== 1) {
      return
    }

    if (viewport !== this.viewport || gridSize !== this.gridSize) {
      this.gridSize = gridSize
      this.viewport = viewport
      this.updateClientCoordinates()
    }

    if (!this.visible) {
      return
    }

    switch (mode) {
      case EngineMode.EDIT: {
        this.drawEdit(ctx, timestamp)
        break
      }
      case EngineMode.VIEW: {
        this.drawView(ctx, timestamp)
        break
      }
      default: {
        break
      }
    }
  }

  updateClientCoordinates = () => {
    this.clientX = (this.viewport.x1 + (this.x * this.gridSize)) * this.viewport.z
    this.clientY = (this.viewport.y1 + (this.y * this.gridSize)) * this.viewport.z
    this.clientW = (this.width * this.gridSize) * this.viewport.z
    this.clientH = (this.height * this.gridSize) * this.viewport.z
    this.visible = this.isVisible()
  }

  isVisible = () => {
    if ((this.viewport.x2 - 2 * this.viewport.x1 - this.x * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.x1 + (this.x + this.width) * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.y2 - 2 * this.viewport.y1 - this.y * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.y1 + (this.y + this.height) * this.gridSize) < 0) {
      return false
    }
    return true
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
