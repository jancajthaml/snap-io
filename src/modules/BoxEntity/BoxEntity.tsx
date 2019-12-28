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

class BoxEntity extends React.PureComponent<IProps> {

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height);
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle) => {
    ctx.fillStyle = this.props.color
    const x = (viewport.x1 + this.props.x) * viewport.z
    const y = (viewport.y1 + this.props.y) * viewport.z
    const w = (this.props.width) * viewport.z
    const h = (this.props.height) * viewport.z

    ctx.fillRect(x, y, w, h);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle) => {
    ctx.fillStyle = this.props.color
    ctx.strokeStyle = this.props.color
    const x = (viewport.x1 + this.props.x) * viewport.z
    const y = (viewport.y1 + this.props.y) * viewport.z
    const w = (this.props.width) * viewport.z
    const h = (this.props.height) * viewport.z

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
    //console.log('now calling render with', this.props)
    return <React.Fragment />
  }
}

export default BoxEntity
