
import { Point, Rectangle } from '../../atoms'

class PortHandle  {

  owner: any;
  id: string;
  x: number;
  y: number;

  constructor(owner: any, id: string, x: number, y: number) {
    this.owner = owner
    this.id = id
    this.x = x
    this.y = y
  }

  mouseDownCapture = (viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, point: Point) => {
    const PORT_RADIUS = viewport.z * gridSize * 0.25

    const X = x + (width * this.x)
    const Y = y + (height * this.y)

    return Math.sqrt((point.x - X) * (point.x - X) + (point.y - Y) * (point.y - Y)) < PORT_RADIUS
      ? [this]
      : []
  }

  linkCapture = (viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, point: Point) =>
    this.mouseDownCapture(viewport, gridSize, x, y, width, height, point)[0]

  onMouseUp = () => {
    this.owner.portConnectStop()
    return false
  }

  onMouseDown = () => {
    this.owner.portConnectStart()
    return true
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number) => {
    const PORT_RADIUS = viewport.z * gridSize * 0.25
    const X = x + (width * this.x)
    const Y = y + (height * this.y)

    ctx.beginPath()
    ctx.arc(X, Y, PORT_RADIUS, 0, 2 * Math.PI, false)
    ctx.fill();
    ctx.stroke();
  }

  serialize = () => this.owner.serialize()

}

export default PortHandle
