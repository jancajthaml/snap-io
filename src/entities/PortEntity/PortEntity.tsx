import React from 'react'

import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'
import Port from './Port'
import { ICanvasEntityWrapperSchema } from '../../@types/index'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
}

class PortEntity extends React.Component<IProps, IState> {

  ports: Port[];

  constructor(props: IProps) {
    super(props)
    this.state = {
    }
    this.ports = props.ports.map((port) => new Port(port))
  }

  componentDidMount() {
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => {
    ctx.fillStyle = "orange"

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    ctx.fillRect(X, Y, W, H);

    this.ports.forEach((port) => port.draw(ctx, gridSize, viewport.z, X, Y, W, H))
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.props.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.props.x + this.props.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.props.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.props.y + this.props.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    x: this.props.x,
    y: this.props.y,
    ports: this.ports.map((port) => port.serialize()),
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default PortEntity
