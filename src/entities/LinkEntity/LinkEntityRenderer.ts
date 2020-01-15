
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'

//import { ICanvasEntitySchema } from '../../@types/index'

class LinkEntityRenderer /*implements ICanvasEntitySchema */ {

  id: string;
  from: string[];
  to: string[];
  getEntityByID: any;

  constructor(props: IEntitySchema, getEntityByID: any) {
    this.id = props.id
    this.from = props.from
    this.to = props.to
    this.getEntityByID = getEntityByID
  }

  drawView = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const fromRef = this.getEntityByID(this.from[0])
    const toRef = this.getEntityByID(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.lineWidth = (viewport.z / 3) + 0.5
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.lineWidth = 1
  }

  drawEdit = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const fromRef = this.getEntityByID(this.from[0])
    const toRef = this.getEntityByID(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.lineWidth = (viewport.z / 3) + 0.5
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.lineWidth = 1
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (layer !== 3) {
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

  isVisible = (_gridSize: number, _viewport: Rectangle) => {
    return true
  }

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[], _x: number, _y: number, _width: number, _height: number) => {
    return new Point()
  }

  serialize = () => ({
    id: this.id,
    type: ENTITY_TYPE,
    from: this.from,
    to: this.to,
  })

}

export default LinkEntityRenderer
