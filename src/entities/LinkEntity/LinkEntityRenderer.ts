
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

    this.breaks.forEach((point) => {
      const X = (viewport.x1 + (point.x * gridSize)) * viewport.z
      const Y = (viewport.y1 + (point.y * gridSize)) * viewport.z
      ctx.lineTo(X, Y);
    })

    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.stroke();

    this.breaks.forEach((point) => {
      point.draw(ctx, viewport, gridSize)
    })

    ctx.lineWidth = 1
  }

  onMouseDoubleClick = (point: Point) => {
    // FIXME find a par between whose the point should be created, dont append as last
    this.breaks.push(new PointHandle(this, Math.round(point.x), Math.round(point.y)))
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    const pointScaled = point.multiply(viewport.z).multiply(gridSize)

    const captures: PointHandle[] = []

    // FIXME detect if point lies on line

    this.breaks.forEach((item) => {
      captures.push(...item.mouseDownCapture(pointScaled, viewport, gridSize))
    })
    //console.log(captures)
    //return captures
    return [...captures, this]
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
    // FIXME implement line visual center
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
