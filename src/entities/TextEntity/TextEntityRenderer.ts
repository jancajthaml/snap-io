
import { IEntitySchema } from './types'
import { Rectangle } from '../../atoms'
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
  buffer: any;
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
    this.text = props.text
    this.buffer = null
    this.gridSize = 1
    this.viewport = new Rectangle()
    this.clientX = 1
    this.clientY = 1
    this.clientW = 1
    this.clientH = 1
    this.visible = true
  }

  drawEdit = (ctx: CanvasRenderingContext2D) => {
    const image = TextLibrary.get(this.text, 12, 12 * this.clientW / this.gridSize, 12 * this.clientH / this.gridSize)
    if (image) {
      this.buffer = image
    }
    if (this.buffer) {
      ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, this.clientX, this.clientY, this.clientW, this.clientH);
    }
    //ctx.strokeStyle = "black"
    //ctx.strokeRect(this.clientX, this.clientY, this.clientW, this.clientH);
  }

  drawView = (ctx: CanvasRenderingContext2D) => {
    const image = TextLibrary.get(this.text, 12, this.width * 12, this.height * 12)
    if (image) {
      this.buffer = image
    }
    if (this.buffer) {
      ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, this.clientX, this.clientY, this.clientW, this.clientH);
    }
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
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
        this.drawEdit(ctx)
        break
      }
      case EngineMode.VIEW: {
        this.drawView(ctx)
        break
      }
      default: {
        break
      }
    }
  }

  updateClientCoordinates = () => {
    this.clientX = (this.x * this.gridSize)
    this.clientY = (this.y * this.gridSize)
    this.clientW = (this.width * this.gridSize)
    this.clientH = (this.height * this.gridSize)
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
    text: this.text,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })

}

export default TextEntityRenderer
