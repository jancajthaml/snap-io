
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

  deletePoint = (point: PointHandle) => {
    this.breaks = this.breaks.filter((item) => !(item.x === point.x && item.y === point.y))
  }

  addPoint = (point: PointHandle, idx: number) => {
    if (idx == 0) {
      this.breaks.unshift(point)
    } else if (idx === this.breaks.length) {
      this.breaks.push(point)
    } else if (!this.breaks.some((item) => item.x === point.x && item.y === point.y)) {
      this.breaks = [...this.breaks.slice(0, idx), point, ...this.breaks.slice(idx)]
    }
  }

  onMouseDoubleClick = (viewport: Rectangle, gridSize: number, point: Point) => {
    const fromRef = this.getEntityByID(this.from[0])
    const toRef = this.getEntityByID(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const pointScaled = new Point((viewport.x1 + (point.x * gridSize)) * viewport.z, (viewport.y1 + (point.y * gridSize)) * viewport.z)

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    const points = [fromPoint, ...this.breaks.map((item) => new Point((viewport.x1 + (item.x * gridSize)) * viewport.z, (viewport.y1 + (item.y * gridSize)) * viewport.z)), toPoint]

    for (let j = 0; j < points.length - 1; j++) {
      const A = points[j];
      const B = points[j + 1];

      const b_x_a = B.x - A.x;
      const b_y_a = B.y - A.y;

      const square_length = b_x_a ** 2 + b_y_a ** 2;

      if (4 < Math.abs(b_y_a * pointScaled.x - b_x_a * pointScaled.y + B.x * A.y - B.y * A.x) / square_length ** 0.5) {
        continue
      }

      const dot = (pointScaled.x - A.x) * b_x_a + (pointScaled.y - A.y) * b_y_a;
      if (dot >= 0 && dot <= square_length) {
        this.addPoint(new PointHandle(this, Math.round(point.x), Math.round(point.y)), j)
        return
      }
    }

    this.breaks.push(new PointHandle(this, Math.round(point.x), Math.round(point.y)))
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    const pointScaled = new Point((viewport.x1 + (point.x * gridSize)) * viewport.z, (viewport.y1 + (point.y * gridSize)) * viewport.z)
    const captures: any[] = []

    this.breaks.forEach((item) => {
      captures.push(...item.mouseDownCapture(pointScaled, viewport, gridSize))
    })

    const fromRef = this.getEntityByID(this.from[0])
    const toRef = this.getEntityByID(this.to[0])

    if (!(fromRef && toRef)) {
      return captures
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    const points = [fromPoint, ...this.breaks.map((item) => new Point((viewport.x1 + (item.x * gridSize)) * viewport.z, (viewport.y1 + (item.y * gridSize)) * viewport.z)), toPoint]

    for (let j = 0; j < points.length - 1; j++) {
      const A = points[j];
      const B = points[j + 1];

      const b_x_a = B.x - A.x;
      const b_y_a = B.y - A.y;

      const square_length = b_x_a ** 2 + b_y_a ** 2;

      if (4 < Math.abs(b_y_a * pointScaled.x - b_x_a * pointScaled.y + B.x * A.y - B.y * A.x) / square_length ** 0.5) {
        continue
      }

      const dot = (pointScaled.x - A.x) * b_x_a + (pointScaled.y - A.y) * b_y_a;
      if (dot >= 0 && dot <= square_length) {
        return captures.concat(this)
      }
    }
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
