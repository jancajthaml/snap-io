
import { Point, Rectangle } from '../../atoms'

class PointHandle  {

  owner: any;
  x: number;
  y: number;
  mutating: boolean;

  constructor(owner: any, x: number, y: number) {
    this.owner = owner
    this.x = x
    this.y = y
    this.mutating = false
  }

  onMouseDoubleClick = (_viewport: Rectangle, _gridSize: number, _point: Point) => {
    this.owner.deletePoint(this)
  }

  mouseDownCapture = (point: Point, _viewport: Rectangle, gridSize: number) => {
    const PORT_RADIUS = gridSize * 0.2

    const X = (this.x * gridSize)
    const Y = (this.y * gridSize)

    return Math.sqrt((point.x - X) * (point.x - X) + (point.y - Y) * (point.y - Y)) < PORT_RADIUS
      ? [this]
      : []
  }

  onMouseUp = () => {
    this.mutating = false
    return false
  }

  onMouseDown = () => {
    this.mutating = true
    return true
  }

  onMouseMove = (xDelta: number, yDelta: number) => {
    if (this.mutating) {
      this.x += xDelta
      this.y += yDelta
      this.owner.updateClientCoordinates()
    }
    return false
  }

  draw = (ctx: CanvasRenderingContext2D, gridSize: number) => {
    const X = (this.x * gridSize)
    const Y = (this.y * gridSize)

    if (this.mutating) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = "white"
    }

    const RADIUS = gridSize * 0.2

    ctx.beginPath()
    ctx.arc(X, Y, RADIUS, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke();
  }

  serialize = () => this.owner.serialize()

}

export default PointHandle
