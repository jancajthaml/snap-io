
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'

import PointHandle from './PointHandle'
//import { ICanvasEntitySchema } from '../../@types/index'

class LinkEntityRenderer /*implements ICanvasEntitySchema */ {

  id: string;
  from: string[];
  to: string[];
  breaks: PointHandle[];
  getEntityByID: any;

  constructor(props: IEntitySchema, getEntityByID: any) {
    this.id = props.id
    this.from = props.from
    this.to = props.to
    this.breaks = []
    props.breaks.forEach((point) => {
      this.breaks.push(new PointHandle(this, point.x, point.y))
    })
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

    this.breaks.forEach((point) => {
      point.draw(ctx, viewport, gridSize)
    })

    ctx.lineWidth = 1
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    //console.log('link point down capture')
    //if (!(point.x >= this.x - 1 && point.x <= (this.x + this.width + 1) && point.y >= this.y - 1 && point.y <= (this.y + this.height + 1))) {
      //return []
    //}
    /*
    let X = (this.x * gridSize) * viewport.z
    let Y = (this.y * gridSize) * viewport.z
    let W = (this.width * gridSize) * viewport.z
    let H = (this.height * gridSize) * viewport.z
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2
    */

    const pointScaled = point.multiply(viewport.z).multiply(gridSize)
    const captures: PointHandle[] = []
    this.breaks.forEach((item) => {
      captures.push(...item.mouseDownCapture(pointScaled, viewport, gridSize))
    })
    //console.log(captures)
    return captures
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
