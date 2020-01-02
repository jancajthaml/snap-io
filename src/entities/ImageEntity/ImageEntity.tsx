import React from 'react'

import Engine from '../../modules/Engine'
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
  url: string;
}

interface IState {
  selected: boolean;
}

class ImageEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
    }
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

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    ctx.fillStyle = "orange"

    const x = (viewport.x1 + this.props.x * gridSize) * viewport.z
    const y = (viewport.y1 + this.props.y * gridSize) * viewport.z
    const w = this.props.width * gridSize * viewport.z
    const h = this.props.height * gridSize * viewport.z

    ctx.fillRect(x, y, w, h);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    this.drawDetail(ctx, viewport, gridSize)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    url: this.props.url,
    x: Math.round(this.props.x),
    y: Math.round(this.props.y),
    width: Math.round(this.props.width),
    height: Math.round(this.props.height),
  })

  render() {
    return <React.Fragment />
  }
}

export default ImageEntity
