import React from 'react'

import Engine from '../Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'

interface IProps {
  engine: Engine;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

class BoxEntity extends React.PureComponent<IProps> {

  bounds: Rectangle;

  constructor(props: IProps) {
    super(props)
    // FIXME this does not update if entity is recycled, probably better to use a hook here
    this.bounds = new Rectangle(props.x, props.y, props.width, props.height)
  }

  componentDidMount() {
    // FIXME this lags application if too many entities are on screen (>10k)
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.bounds.x1 && point.x <= this.bounds.x2 && point.y >= this.bounds.y1 && point.y <= this.bounds.y2;
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle) => {
    if (this.bounds.z >= 1000) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
    }
    const x = (viewport.x1 + this.bounds.x1) * viewport.z
    const y = (viewport.y1 + this.bounds.y1) * viewport.z
    const w = (this.bounds.x2 - this.bounds.x1) * viewport.z
    const h = (this.bounds.y2 - this.bounds.y1) * viewport.z

    ctx.fillRect(x, y, w, h);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle) => {
    if (this.bounds.z >= 1000) {
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
      ctx.strokeStyle = this.props.color
    }
    const x = (viewport.x1 + this.bounds.x1) * viewport.z
    const y = (viewport.y1 + this.bounds.y1) * viewport.z
    const w = (this.bounds.x2 - this.bounds.x1) * viewport.z
    const h = (this.bounds.y2 - this.bounds.y1) * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(x + offset, y + offset, w - 2 * offset, h - 2 * offset);
    ctx.strokeRect(x, y, w, h);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport } = this.props.engine

    if (viewport.z <= 0.4) {
      this.drawSimple(ctx, viewport)
    } else {
      this.drawDetail(ctx, viewport)
    }
  }

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
