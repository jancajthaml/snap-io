import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'
import TextLibrary from './TextLibrary'

interface IProps extends IEntitySchema {
  engine: Engine;
}

interface IState {
  selected: boolean;
}

class TextEntity extends React.Component<IProps, IState> {

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
    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    const image = TextLibrary.get(this.props.text, 12, w, h)
    ctx.drawImage(image, 0, 0, image.width, image.height, x, y, w, h);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    this.drawDetail(ctx, viewport, gridSize)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    text: this.props.text,
    x: Math.round(this.props.x),
    y: Math.round(this.props.y),
    width: Math.round(this.props.width),
    height: Math.round(this.props.height),
  })

  render() {
    return <React.Fragment />
  }
}

export default TextEntity
