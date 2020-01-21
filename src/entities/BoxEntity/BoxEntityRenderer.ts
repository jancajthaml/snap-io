
import { IEntitySchema } from './types'
import { Rectangle } from '../../atoms'
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
    this.color = props.color
    this.gridSize = 1
    this.viewport = new Rectangle()
    this.clientX = 1
    this.clientY = 1
    this.clientW = 1
    this.clientH = 1
    this.visible = true
  }

  drawEdit = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "black"
    ctx.strokeRect(this.clientX, this.clientY, this.clientW, this.clientH);
  }

  drawViewSimple = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.color
    ctx.fillRect(this.clientX, this.clientY, this.clientW, this.clientH);
  }

  drawViewDetail = (ctx: CanvasRenderingContext2D) => {
    const offset = 3 * this.viewport.z

    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.fillRect(this.clientX + offset, this.clientY + offset, this.clientW - 2 * offset, this.clientH - 2 * offset);
    ctx.strokeRect(this.clientX, this.clientY, this.clientW, this.clientH);
  }

  updateClientCoordinates = () => {
    this.clientX = (this.viewport.x1 + (this.x * this.gridSize)) * this.viewport.z
    this.clientY = (this.viewport.y1 + (this.y * this.gridSize)) * this.viewport.z
    this.clientW = (this.width * this.gridSize) * this.viewport.z
    this.clientH = (this.height * this.gridSize) * this.viewport.z
    this.visible = this.isVisible()
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
        if (viewport.z <= 0.4) {
          this.drawViewSimple(ctx)
        } else {
          this.drawViewDetail(ctx)
        }
        break
      }
      default: {
        break
      }
    }
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
    color: this.color,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  })

}

export default BoxEntityRenderer
