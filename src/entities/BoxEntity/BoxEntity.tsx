import React from 'react'

import { ICanvasEntityWrapperSchema } from '../../@types/index'

import { Rectangle } from '../../atoms'
import { IEntitySchema } from './types'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
}

class BoxEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => {
    ctx.fillStyle = this.props.color

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    ctx.fillRect(X, Y, W, H);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => {
    ctx.fillStyle = this.props.color
    ctx.strokeStyle = this.props.color

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(X + offset, Y + offset, W - 2 * offset, H - 2 * offset);
    ctx.strokeRect(X, Y, W, H);
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, timestamp: number) => {
    if (viewport.z <= 0.4) {
      this.drawSimple(ctx, viewport, gridSize, x, y, width, height, timestamp)
    } else {
      this.drawDetail(ctx, viewport, gridSize, x, y, width, height, timestamp)
    }
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
    color: this.props.color,
    x: this.props.x,
    y: this.props.y,
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
