import React from 'react'

import Engine from '../Engine'
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
    this.bounds = new Rectangle(props.x, props.y, props.width, props.height)
  }

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  drawSimple = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine

    if (this.bounds.z >= 1000) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
    }
    const x = (engine.viewport.x1 + this.bounds.x1) * engine.viewport.z
    const y = (engine.viewport.y1 + this.bounds.y1) * engine.viewport.z
    const w = (this.bounds.x2 - this.bounds.x1) * engine.viewport.z
    const h = (this.bounds.y2 - this.bounds.y1) * engine.viewport.z

    ctx.fillRect(x, y, w, h);
  }

  drawDetail = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine

    if (this.bounds.z >= 1000) {
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
      ctx.strokeStyle = this.props.color
    }
    const x = (engine.viewport.x1 + this.bounds.x1) * engine.viewport.z
    const y = (engine.viewport.y1 + this.bounds.y1) * engine.viewport.z
    const w = (this.bounds.x2 - this.bounds.x1) * engine.viewport.z
    const h = (this.bounds.y2 - this.bounds.y1) * engine.viewport.z

    const offset = 3 * engine.viewport.z
    ctx.fillRect(x + offset, y + offset, w - 2*offset, h - 2*offset);
    ctx.strokeRect(x, y, w, h);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine

    if (engine.viewport.z <= 0.4) {
      this.drawSimple(ctx)
    } else {
      this.drawDetail(ctx)
    }
  }

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
