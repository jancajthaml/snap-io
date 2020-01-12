
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import PortHandle from './PortHandle'
import { ENTITY_TYPE } from './constants'

class PortEntityRenderer {

  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ports: Map<string, PortHandle>;
  connecting: boolean;
  getCurrentMouseCoordinates: any;
  connectEntities: any;

  constructor(props: IEntitySchema, getCurrentMouseCoordinates: any, connectEntities: any) {
    this.connecting = false
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      this.ports.set(port.id, new PortHandle(this, port.id, port.x, port.y))
    })
    this.getCurrentMouseCoordinates = getCurrentMouseCoordinates
    this.connectEntities = connectEntities
  }

  addNode = (_: any) => {}

  removeNode = (_: any) => {}

  portConnectStart = (): void => {
    if (this.connecting) {
      return
    }
    this.connecting = true
  }

  portConnectStop = (): void => {
    if (!this.connecting) {
      return
    }
    this.connectEntities()
    this.connecting = false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number): any => {
    if (!(point.x >= this.x && point.x <= (this.x + this.width) && point.y >= this.y && point.y <= (this.y + this.height))) {
      return undefined
    }
    const x = (Math.round(this.x) * gridSize) * viewport.z
    const y = (Math.round(this.y) * gridSize) * viewport.z
    const w = (Math.round(this.width) * gridSize) * viewport.z
    const h = (Math.round(this.height) * gridSize) * viewport.z
    const pointScaled = point.multiply(viewport.z).multiply(gridSize)
    const captures: PortHandle[] = []
    this.ports.forEach((port) => {
      const candidate = port.mouseDownCapture(viewport, gridSize, x, y, w, h, pointScaled)
      if (candidate) {
        captures.push(candidate)
      }
    })
    const capture = captures[0]

    if (captures) {
      return capture
    }

    return undefined
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (layer === 1) {
      ctx.fillStyle = "orange"

      const X = (viewport.x1 + Math.round(this.x) * gridSize) * viewport.z
      const Y = (viewport.y1 + Math.round(this.y) * gridSize) * viewport.z
      const W = Math.round(this.width) * gridSize * viewport.z
      const H = Math.round(this.height) * gridSize * viewport.z

      ctx.fillRect(X, Y, W, H);

      this.ports.forEach((port) => {
        port.draw(ctx, viewport, gridSize, X, Y, W, H)
      })
    }

    if (layer === 3 && this.connecting) {
      const line = this.getCurrentMouseCoordinates()
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = 2 * viewport.z;
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.x + this.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.y + this.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  canBeLinked = () => false

  getCenter = (viewport: Rectangle, gridSize: number, ids: string[], x: number, y: number, width: number, height: number) => {
    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    const port = this.ports.get(ids[1])
    if (port) {
      const PORT_SIZE = viewport.z * gridSize * 0.5
      const PORT_X = X + (W * port.x) - PORT_SIZE/2
      const PORT_Y = Y + (H * port.y) - PORT_SIZE/2

      return new Point(PORT_X + PORT_SIZE / 2, PORT_Y + PORT_SIZE / 2)
    } else {
      return new Point(X + W / 2, Y + H / 2)
    }
  }

  serialize = () => {
    const ports: any[] = []
    this.ports.forEach((port) => {
      ports.push({
        id: port.id,
        x: port.x,
        y: port.y,
      })
    })

    return {
      id: this.id,
      type: ENTITY_TYPE,
      x: this.x,
      y: this.y,
      ports,
      width: this.width,
      height: this.height,
    }
  }
}

export default PortEntityRenderer
