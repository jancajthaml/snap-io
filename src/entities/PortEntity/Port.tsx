import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
import { IPortSchema } from './types'

interface IProps extends IPortSchema {
  engine: Engine;
}

interface IState {
  selected: boolean;
}

class Port extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  componentDidMount() {
    const self = this as any
    self.props.parent.children[this.props.id] = this
  }

  componentWillUnmount() {
    const self = this as any
    delete self.props.parent.children[this.props.id]
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + 1) && point.y >= this.props.y && point.y <= (this.props.y + 1);
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = "blue"
    }

    const self = this as any
    const s = 5 * viewport.z
    const x = (viewport.x1 + Math.round(self.props.parent.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(self.props.parent.props.y) * gridSize) * viewport.z
    const w = Math.round(self.props.parent.props.width) * this.props.x * gridSize * viewport.z
    const h = Math.round(self.props.parent.props.height) * this.props.y * gridSize * viewport.z

    ctx.fillRect(x + w - s/2, y + h - s/2, s, s);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    //const s = this.props as any
    //s.x += 0.01
    this.drawSimple(ctx, viewport, gridSize)
  }

  serialize = () => ({
    id: this.props.id,
    x: this.props.x,
    y: this.props.y,
    in: this.props.in,
    out: this.props.out,
  })

  render() {
    return <React.Fragment />
  }
}

export default Port
