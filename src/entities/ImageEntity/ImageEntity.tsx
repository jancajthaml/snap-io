import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import { IEntitySchema } from './types'
import ImageLibrary from './ImageLibrary'

interface IProps extends IEntitySchema {
  engine: Engine;
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

  draw = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const { viewport, gridSize } = this.props.engine

    let image = ImageLibrary.get(this.props.url, timestamp)

    const w_i = image.width as number
    if (w_i === 0) {
      return
    }
    const h_i = image.height as number
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    const ratio  = Math.min(w / w_i, h / h_i);

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z

    if (this.state.selected) {
      ctx.fillStyle = "black"
      ctx.fillRect(x, y, w, h);
    }
    ctx.drawImage(image, 0, 0, w_i, h_i, x + (w - w_i * ratio) / 2, y + (h - h_i * ratio) / 2, w_i * ratio, h_i * ratio);
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    url: this.props.url,
    x: this.props.x,
    y: this.props.y,
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default ImageEntity
