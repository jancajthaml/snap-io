
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'

//import { ICanvasEntitySchema } from '../../@types/index'

class LinkEntityRenderer /*implements ICanvasEntitySchema */ {

  id: string;
  from: string[];
  to: string[];
  breaks: Point[];
  getEntityByID: any;

  constructor(props: IEntitySchema, getEntityByID: any) {
    this.id = props.id
    this.from = props.from
    this.to = props.to
    this.breaks = props.breaks
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

    ctx.lineWidth = (viewport.z / 3) + 0.5
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);

    this.breaks.forEach((point) => {
      const X = (viewport.x1 + (point.x * gridSize)) * viewport.z
      const Y = (viewport.y1 + (point.y * gridSize)) * viewport.z
      ctx.lineTo(X, Y);
    })

    ctx.lineTo(toPoint.x, toPoint.y);


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

    ctx.lineWidth = (viewport.z / 3) + 0.5
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white"

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);

    const points = [] as any[]

    this.breaks.forEach((point) => {
      const X = (viewport.x1 + (point.x * gridSize)) * viewport.z
      const Y = (viewport.y1 + (point.y * gridSize)) * viewport.z
      points.push([X, Y])
      ctx.lineTo(X, Y);
    })

    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.stroke();

    const RADIUS = viewport.z * 2

    points.forEach(([X, Y]) => {
      //const X = (viewport.x1 + (point.x * gridSize)) * viewport.z
      //const Y = (viewport.y1 + (point.y * gridSize)) * viewport.z
      ctx.beginPath()
      ctx.arc(X, Y, RADIUS, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.stroke();
    })

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
    breaks: this.breaks,
  })

}

export default LinkEntityRenderer
