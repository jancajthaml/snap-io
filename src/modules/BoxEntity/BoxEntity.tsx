import React from 'react'

import Engine from '../Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'

interface IProps {
  engine: Engine;
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface IState {
  selected: boolean;
}

class BoxEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  componentDidMount() {
    // FIXME this slows rendering significantly
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    // FIXME this slows rendering significantly
    this.props.engine.removeEntity(this)
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height);
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
    }

    const x = (viewport.x1 + this.props.x * gridSize) * viewport.z
    const y = (viewport.y1 + this.props.y * gridSize) * viewport.z
    const w = this.props.width * gridSize * viewport.z
    const h = this.props.height * gridSize * viewport.z

    ctx.fillRect(x, y, w, h);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
      ctx.strokeStyle = this.props.color
    }

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(x + offset, y + offset, w - 2 * offset, h - 2 * offset);
    ctx.strokeRect(x, y, w, h);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    if (viewport.z <= 0.4) {
      this.drawSimple(ctx, viewport, gridSize)
    } else {
      this.drawDetail(ctx, viewport, gridSize)
    }
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    x: Math.round(this.props.x),
    y: Math.round(this.props.y),
    width: Math.round(this.props.width),
    height: Math.round(this.props.height),
  })

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
