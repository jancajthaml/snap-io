
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

  mouseDownCapture = (viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, point: Point): any => {
    const PORT_SIZE = viewport.z * gridSize * 0.5

    const X = x + (width * this.x) - PORT_SIZE/2
    const Y = y + (height * this.y) - PORT_SIZE/2

    return (point.x >= X && point.x <= (X + PORT_SIZE) && point.y >= Y && point.y <= (Y + PORT_SIZE))
      ? this
      : undefined
  }

  onMouseUp = (): boolean => {
    this.owner.portConnectStop()
    return false
  }

  onMouseDown = (): boolean => {
    this.owner.portConnectStart()
    return true
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number) => {
    const PORT_SIZE = viewport.z * gridSize * 0.5
    const X = x + (width * this.x) - PORT_SIZE/2
    const Y = y + (height * this.y) - PORT_SIZE/2

    ctx.fillStyle = "blue"
    ctx.fillRect(X, Y, PORT_SIZE, PORT_SIZE)
  }

  canBeLinked = () => true

  serialize = () => this.owner.serialize()

}

export default PortHandle
