import React from 'react'

import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

import { Point, Rectangle } from '../../atoms'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
  connecting: boolean;
}

class PortEntity extends React.Component<IProps, IState> {

  ports: Map<string, PortHandle>;

  constructor(props: IProps) {
    super(props)
    this.state = {
      connecting: false,
    }
    this.ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      this.ports.set(port.id, new PortHandle(this, port.id, port.x, port.y, port.outgoing, port.incoming))
    })
  }

  componentDidMount() {
    this.props.parent.addEntity(this.props.id, this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this.props.id)
  }

  addEntity = (_: any) => {}

  removeEntity = (_: any) => {}

  connectionAdded = () => {
    this.props.parent.elementUpdated(this.props.id, this.serialize())
  }

  portConnectStart = (): void => {
    if (this.state.connecting) {
      return
    }
    this.setState({
      connecting: true,
    })
  }

  portConnectStop = (): void => {
    if (!this.state.connecting) {
      return
    }

    this.props.parent.connectEntities()

    this.setState({
      connecting: false,
    })
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number): any => {
    if (!(point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height))) {
      return undefined
    }
    const x = (Math.round(this.props.x) * gridSize) * viewport.z
    const y = (Math.round(this.props.y) * gridSize) * viewport.z
    const w = (Math.round(this.props.width) * gridSize) * viewport.z
    const h = (Math.round(this.props.height) * gridSize) * viewport.z
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

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _timestamp: number) => {
    if (layer === 1) {
      ctx.fillStyle = "orange"

      const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
      const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
      const W = Math.round(width) * gridSize * viewport.z
      const H = Math.round(height) * gridSize * viewport.z

      ctx.fillRect(X, Y, W, H);

      this.ports.forEach((port) => {
        port.draw(ctx, viewport, gridSize, X, Y, W, H)
      })
    }

    if (layer === 3 && this.state.connecting) {
      const line = this.props.parent.currentMouseCoordinates.original
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = 2 * viewport.z;
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  serialize = () => {
    const ports: any[] = []
    this.ports.forEach((port) => {
      ports.push({
        id: port.id,
        x: port.x,
        y: port.y,
        outgoing: port.outgoing,
        incoming: port.incoming,
      })
    })

    return {
      id: this.props.id,
      type: this.props.type,
      x: this.props.x,
      y: this.props.y,
      ports,
      width: this.props.width,
      height: this.props.height,
    }
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.props.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.props.x + this.props.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.props.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.props.y + this.props.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  canBeLinked = () => false

  getCenter = (viewport: Rectangle, gridSize: number, ids: string[]) => {
    const port = this.ports.get(ids[1])
    if (port) {

      const X = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
      const Y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
      const W = Math.round(this.props.width) * gridSize * viewport.z
      const H = Math.round(this.props.height) * gridSize * viewport.z

      const PORT_SIZE = viewport.z * gridSize * 0.5
      const PORT_X = X + (W * port.x) - PORT_SIZE/2
      const PORT_Y = Y + (H * port.y) - PORT_SIZE/2

      return new Point(PORT_X + PORT_SIZE / 2, PORT_Y + PORT_SIZE / 2)
    } else {
      return new Point(this.props.x + this.props.width / 2, this.props.y + this.props.height / 2)
    }
  }

  render() {
    return (
      <React.Fragment/>
    )
  }
}

export default PortEntity
