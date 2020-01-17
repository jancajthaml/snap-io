
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

  portConnectStart = () => {
    this.connecting = true
  }

  portConnectStop = () => {
    if (!this.connecting) {
      return
    }
    this.connectEntities()
    this.connecting = false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!(point.x >= this.x - 1 && point.x <= (this.x + this.width + 1) && point.y >= this.y - 1 && point.y <= (this.y + this.height + 1))) {
      return []
    }
    let X = (this.x * gridSize) * viewport.z
    let Y = (this.y * gridSize) * viewport.z
    let W = (this.width * gridSize) * viewport.z
    let H = (this.height * gridSize) * viewport.z
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2

    const pointScaled = point.multiply(viewport.z).multiply(gridSize)
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
    let X = (this.x * gridSize) * viewport.z
    let Y = (this.y * gridSize) * viewport.z
    let W = (this.width * gridSize) * viewport.z
    let H = (this.height * gridSize) * viewport.z
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2

    const pointScaled = point.multiply(viewport.z).multiply(gridSize)
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

  drawView = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (layer !== 1) {
      return
    }
    let X = (viewport.x1 + (this.x * gridSize)) * viewport.z
    let Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
    let W = (this.width * gridSize) * viewport.z
    let H = (this.height * gridSize) * viewport.z
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = H = RADIUS * 2

    ctx.lineWidth = (viewport.z / 3) + 0.5

    ctx.fillStyle = "orange"
    ctx.strokeStyle = "blue"
    ctx.beginPath()
    ctx.arc(X + W / 2, Y + H / 2, RADIUS, 0, 2 * Math.PI, false)
    ctx.fill();
    ctx.stroke();

    this.ports.forEach((port) => {
      port.draw(ctx, viewport, gridSize, X, Y, W, H)
    })

    ctx.lineWidth = 1
  }

  drawEdit = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (layer === 1) {
      let X = (viewport.x1 + (this.x * gridSize)) * viewport.z
      let Y = (viewport.y1 + (this.y * gridSize)) * viewport.z
      let W = (this.width * gridSize) * viewport.z
      let H = (this.height * gridSize) * viewport.z
      const RADIUS = Math.min(W, H) / 2

      ctx.strokeStyle = "black"
      ctx.strokeRect(X, Y, W, H);

      X += W / 2 - RADIUS
      Y += H / 2 - RADIUS
      W = RADIUS * 2
      H = RADIUS * 2
      ctx.lineWidth = (viewport.z / 3) + 0.5

      ctx.strokeStyle = "blue"

      ctx.beginPath()
      ctx.arc(X + W / 2, Y + H / 2, RADIUS, 0, 2 * Math.PI, false)
      ctx.stroke();

      this.ports.forEach((port) => {
        port.draw(ctx, viewport, gridSize, X, Y, W, H)
      })

      ctx.lineWidth = 1
    }
    if (layer === 3 && this.connecting) {
      const line = this.getCurrentMouseCoordinates()
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = 2 * viewport.z;
      ctx.lineCap = "round";
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.lineCap = "square";
      ctx.lineWidth = 1;
    }
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    switch (mode) {
      case EngineMode.EDIT: {
        this.drawEdit(layer, ctx, viewport, gridSize)
        break
      }
      case EngineMode.VIEW: {
        this.drawView(layer, ctx, viewport, gridSize)
        break
      }
      default: {
        break
      }
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle) => {
    if ((viewport.x2 - 2 * viewport.x1 - this.x * gridSize) < 0) {
      return false
    }
    if ((viewport.x1 + (this.x + this.width) * gridSize) < 0) {
      return false
    }
    if ((viewport.y2 - 2 * viewport.y1 - this.y * gridSize) < 0) {
      return false
    }
    if ((viewport.y1 + (this.y + this.height) * gridSize) < 0) {
      return false
    }
    return true
  }

  getCenter = (viewport: Rectangle, gridSize: number, ids: string[], x: number, y: number, width: number, height: number) => {
    let X = (viewport.x1 + (x * gridSize)) * viewport.z
    let Y = (viewport.y1 + (y * gridSize)) * viewport.z
    let W = (width * gridSize) * viewport.z
    let H = (height * gridSize) * viewport.z
    const RADIUS = Math.min(W, H) / 2

    X += W / 2 - RADIUS
    Y += H / 2 - RADIUS
    W = RADIUS * 2
    H = RADIUS * 2

    const port = this.ports.get(ids[1])
    if (port) {
      const PORT_SIZE = viewport.z * gridSize * 0.5
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
