
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import PortHandle from './PortHandle'
import { ENTITY_TYPE } from './constants'
import { EngineMode } from '../../modules/Diagram/constants'
import { ICanvasEntitySchema } from '../../@types/index'

class PortEntityRenderer implements ICanvasEntitySchema {

  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ports: Map<string, PortHandle>;
  connecting: boolean;
  getCurrentMouseCoordinates: any;
  connectEntities: any;
  gridSize: number;
  viewport: Rectangle;
  clientX: number;
  clientY: number;
  clientW: number;
  clientH: number;
  visible: boolean;

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
    this.gridSize = 1
    this.viewport = new Rectangle()
    this.clientX = 1
    this.clientY = 1
    this.clientW = 1
    this.clientH = 1
    this.visible = true
  }

  portConnectStart = () => {
    this.connecting = true
  }

  portConnectStop = () => {
    if (this.connecting) {
      this.connectEntities()
      this.connecting = false
    }
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!(point.x >= this.x - 1 && point.x <= (this.x + this.width + 1) && point.y >= this.y - 1 && point.y <= (this.y + this.height + 1))) {
      return []
    }
    let X = (this.x * gridSize)
    let Y = (this.y * gridSize)
    let W = (this.width * gridSize)
    let H = (this.height * gridSize)
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2

    const pointScaled = new Point(point.x * gridSize, point.y * gridSize)

    const captures: PortHandle[] = []
    this.ports.forEach((port) => {
      captures.push(...port.mouseDownCapture(viewport, gridSize, X, Y, W, H, pointScaled))
    })
    return captures
  }

  linkCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!(point.x >= this.x - 1 && point.x <= (this.x + this.width + 1) && point.y >= this.y - 1 && point.y <= (this.y + this.height + 1))) {
      return undefined
    }
    let X = (this.x * gridSize)
    let Y = (this.y * gridSize)
    let W = (this.width * gridSize)
    let H = (this.height * gridSize)
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2

    const pointScaled = new Point((point.x * gridSize), (point.y * gridSize))

    const captures: PortHandle[] = []
    this.ports.forEach((port) => {
      if (captures.length) {
        return
      }
      const candidate = port.linkCapture(viewport, gridSize, X, Y, W, H, pointScaled)
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

  drawView = (layer: number, ctx: CanvasRenderingContext2D) => {
    if (layer !== 1) {
      return
    }

    const RADIUS = Math.min(this.clientW, this.clientH) / 2

    const X = this.clientX + this.clientW / 2 - RADIUS
    const Y = this.clientY + this.clientH / 2 - RADIUS
    const W = RADIUS * 2
    const H = W

    ctx.fillStyle = "orange"
    ctx.strokeStyle = "blue"
    ctx.beginPath()
    ctx.arc(X + W / 2, Y + H / 2, RADIUS, 0, 2 * Math.PI, false)
    ctx.fill();
    ctx.stroke();

    this.ports.forEach((port) => {
      port.draw(ctx, this.viewport, this.gridSize, X, Y, W, H)
    })
  }

  drawEdit = (layer: number, ctx: CanvasRenderingContext2D) => {
    if (layer === 1) {
      const RADIUS = Math.min(this.clientW, this.clientH) / 2

      const X = this.clientX + this.clientW / 2 - RADIUS
      const Y = this.clientY + this.clientH / 2 - RADIUS
      const W = RADIUS * 2
      const H = RADIUS * 2

      ctx.strokeStyle = "blue"

      ctx.beginPath()
      ctx.arc(X + W / 2, Y + H / 2, RADIUS, 0, 2 * Math.PI, false)
      ctx.stroke();

      this.ports.forEach((port) => {
        port.draw(ctx, this.viewport, this.gridSize, X, Y, W, H)
      })

    }
    if (layer === 3 && this.connecting) {
      const line = this.getCurrentMouseCoordinates()
      ctx.beginPath();
      ctx.moveTo(line.x1 / this.viewport.z - this.viewport.x1, line.y1 / this.viewport.z - this.viewport.y1);
      ctx.lineTo(line.x2 / this.viewport.z - this.viewport.x1, line.y2 / this.viewport.z - this.viewport.y1);
      ctx.lineCap = "round";
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.lineCap = "square";
    }
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (viewport !== this.viewport || gridSize !== this.gridSize) {
      this.gridSize = gridSize
      this.viewport = viewport
      this.updateClientCoordinates()
    }

    if (!this.visible) {
      return
    }
    switch (mode) {
      case EngineMode.EDIT: {
        this.drawEdit(layer, ctx)
        break
      }
      case EngineMode.VIEW: {
        this.drawView(layer, ctx)
        break
      }
      default: {
        break
      }
    }
  }

  updateClientCoordinates = () => {
    this.clientX = (this.x * this.gridSize)
    this.clientY = (this.y * this.gridSize)
    this.clientW = (this.width * this.gridSize)
    this.clientH = (this.height * this.gridSize)
    this.visible = this.isVisible()
  }

  isVisible = () => {
    if ((this.viewport.x2 - 2 * this.viewport.x1 - this.x * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.x1 + (this.x + this.width) * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.y2 - 2 * this.viewport.y1 - this.y * this.gridSize) < 0) {
      return false
    }
    if ((this.viewport.y1 + (this.y + this.height) * this.gridSize) < 0) {
      return false
    }
    return true
  }

  getCenter = (_viewport: Rectangle, gridSize: number, ids: string[], x: number, y: number, width: number, height: number) => {
    let X = (x * gridSize)
    let Y = (y * gridSize)
    let W = (width * gridSize)
    let H = (height * gridSize)
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = RADIUS * 2
    H = RADIUS * 2

    const port = this.ports.get(ids[1])
    if (port) {
      const PORT_SIZE = gridSize * 0.5
      const PORT_X = X + (W * port.x) - PORT_SIZE / 2
      const PORT_Y = Y + (H * port.y) - PORT_SIZE / 2
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
