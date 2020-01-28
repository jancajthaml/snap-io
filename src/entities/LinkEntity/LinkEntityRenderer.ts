
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'

import PointHandle from './PointHandle'
//import { ICanvasEntitySchema } from '../../@types/index'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import PortEntityRenderer from '../PortEntity/PortEntityRenderer'

class LinkEntityRenderer /*implements ICanvasEntitySchema*/ {

  id: string;
  from: string[];
  to: string[];
  breaks: PointHandle[];
  getPortById: (id: string) => PortEntityRenderer;
  selected: boolean;
  parent: ICanvasEntityWrapperSchema;

  gridSize: number;
  viewport: Rectangle;

  points: Point[];

  constructor(props: IEntitySchema, getPortById: any, parent: ICanvasEntityWrapperSchema) {
    this.id = props.id
    this.from = props.from
    this.to = props.to
    this.breaks = []
    props.breaks.forEach((point) => {
      this.breaks.push(new PointHandle(this, point.x, point.y))
    })
    this.getPortById = getPortById
    this.selected = false
    this.parent = parent

    this.gridSize = 1
    this.viewport = new Rectangle()
    this.points = []
  }

  drawView = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.beginPath();

    ctx.moveTo(this.points[0].x, this.points[0].y);

    this.points.slice(1).forEach((point) => {
      ctx.lineTo(point.x, point.y);
    })

    ctx.stroke();
  }

  drawEdit = (ctx: CanvasRenderingContext2D) => {
    const fromRef = this.getPortById(this.from[0])
    const toRef = this.getPortById(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const fromPoint = fromRef.getCenter(this.viewport, this.gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(this.viewport, this.gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    ctx.lineCap = "round";
    ctx.strokeStyle = this.selected ? "red" : "black";
    ctx.fillStyle = "white"

    ctx.beginPath();

    ctx.lineTo(fromPoint.x, fromPoint.y);
    this.points.slice(1, this.points.length-1).forEach((point) => {
      ctx.lineTo(point.x, point.y);
    })
    ctx.lineTo(toPoint.x, toPoint.y);

    ctx.stroke();

    this.breaks.forEach((point) => {
      point.draw(ctx, this.gridSize)
    })
  }

  deletePoint = (point: PointHandle) => {
    this.breaks = this.breaks.filter((item) => !(item.x === point.x && item.y === point.y))
    this.updateClientCoordinates()
  }

  addPoint = (point: PointHandle, idx: number) => {
    if (idx == 0) {
      this.breaks.unshift(point)
      this.updateClientCoordinates()
    } else if (idx === this.breaks.length) {
      this.breaks.push(point)
      this.updateClientCoordinates()
    } else if (!this.breaks.some((item) => item.x === point.x && item.y === point.y)) {
      this.breaks = [...this.breaks.slice(0, idx), point, ...this.breaks.slice(idx)]
      this.updateClientCoordinates()
    }
  }

  onMouseDoubleClick = (viewport: Rectangle, gridSize: number, point: Point) => {
    const fromRef = this.getPortById(this.from[0])
    const toRef = this.getPortById(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const pointScaled = new Point(point.x * gridSize, point.y * gridSize)

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    const points = [fromPoint, ...this.breaks.map((item) => new Point(item.x * gridSize, item.y * gridSize)), toPoint]

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

  onMouseDown = () => {
    if (this.selected) {
      return true
    } else {
      this.parent.setSelected(this)
      return true
    }
  }

  selectionCapture = (selected: boolean) => {
    this.selected = selected
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    const pointScaled = new Point(point.x * gridSize, point.y * gridSize)
    const captures: any[] = []

    this.breaks.forEach((item) => {
      captures.push(...item.mouseDownCapture(pointScaled, viewport, gridSize))
    })

    const fromRef = this.getPortById(this.from[0])
    const toRef = this.getPortById(this.to[0])

    if (!(fromRef && toRef)) {
      return captures
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    const points = [fromPoint, ...this.breaks.map((item) => new Point(item.x * gridSize, item.y * gridSize)), toPoint]

    for (let j = 0; j < points.length - 1; j++) {
      const A = points[j];
      const B = points[j + 1];

      const b_x_a = B.x - A.x;
      const b_y_a = B.y - A.y;

      const square_length = b_x_a ** 2 + b_y_a ** 2;

      if (2 < Math.abs(b_y_a * pointScaled.x - b_x_a * pointScaled.y + B.x * A.y - B.y * A.x) / square_length ** 0.5) {
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

    if (viewport !== this.viewport || gridSize !== this.gridSize) {
      this.gridSize = gridSize
      this.viewport = viewport
      this.updateClientCoordinates()
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
    const points = []
    const fromRef = this.getPortById(this.from[0])
    const toRef = this.getPortById(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const fromPoint = fromRef.getCenter(this.viewport, this.gridSize, this.from, fromRef.x, fromRef.y, fromRef.width, fromRef.height)

    points.push(fromPoint)

    this.breaks.forEach((point) => {
      const X = (point.x * this.gridSize)
      const Y = (point.y * this.gridSize)
      points.push(new Point(X, Y))
    })

    const toPoint = toRef.getCenter(this.viewport, this.gridSize, this.to, toRef.x, toRef.y, toRef.width, toRef.height)

    points.push(toPoint)

    this.points = points
  }

  isVisible = (_gridSize: number, _viewport: Rectangle) => {
    return true
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
