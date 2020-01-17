
import { Point, Rectangle } from '../../atoms'

class PointHandle  {

  owner: any;
  x: number;
  y: number;
  mutating: boolean;

  constructor(owner: any, x: number, y: number) {
    this.owner = owner
    //this.id = id
    this.x = x
    this.y = y
    this.mutating = false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    const PORT_RADIUS = viewport.z * 2

    //const X = x + (width * this.x)
    //const Y = y + (height * this.y)
    const X = ((this.x * gridSize)) * viewport.z
    const Y = ((this.y * gridSize)) * viewport.z

    return Math.sqrt((point.x - X) * (point.x - X) + (point.y - Y) * (point.y - Y)) < PORT_RADIUS
      ? [this]
      : []
  }

  //linkCapture = (viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, point: Point) =>
    //this.mouseDownCapture(viewport, gridSize, x, y, width, height, point)[0]

  onMouseUp = () => {
    this.mutating = false
    //this.owner.portConnectStop()
    //console.log('point mouse down')
    return false
  }

  onMouseDown = () => {
    this.mutating = true
    //this.owner.portConnectStart()
    //console.log('point mouse up')
    return true
  }

  onMouseMove = (xDelta: number, yDelta: number) => {
    //console.log('mouse move')
    if (this.mutating) {
      //console.log('translate point', xDelta, yDelta)
      this.x += xDelta
      this.y += yDelta
    }
    //console.log(this.x, this.y)
    return false
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    const X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    const Y = (viewport.y1 + (this.y * gridSize)) * viewport.z

    if (this.mutating) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = "white"
    }

    const RADIUS = viewport.z * 2

    ctx.beginPath()
    ctx.arc(X, Y, RADIUS, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke();
  }

  serialize = () => this.owner.serialize()

}

export default PointHandle
