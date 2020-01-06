import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema, IPortSchema } from './types'
//import Port from './Port'

interface IProps extends IEntitySchema {
  engine: Engine;
  children?: React.ReactElement<IPortSchema>[] | React.ReactElement<IPortSchema>;
}

interface IState {
  selected: boolean;
}

class PortEntity extends React.Component<Omit<IProps, "ports">, IState> {

  children: {[key: string]: any};

  constructor(props: Omit<IProps, "ports">) {
    super(props)
    this.state = {
      selected: false,
    }
    this.children = {}
  }

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height);
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = "orange"
    }

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    ctx.fillRect(x, y, w, h);

    Object.values(this.children).map((port: any) => port.draw(ctx))
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    this.drawSimple(ctx, viewport, gridSize)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    x: this.props.x,
    y: this.props.y,
    ports: Object.values(this.children).map((port: any) => port.serialize()),
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return (
      <React.Fragment>
        {React.Children.map(this.props.children, (child: any) => React.cloneElement(child, { parent: this }))}
      </React.Fragment>
    )
  }
}

export default PortEntity
