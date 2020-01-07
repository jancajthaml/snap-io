import React from 'react'

import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'
import ImageLibrary from './ImageLibrary'
import { IParentSchema } from '../../@types/index'

interface IProps extends IEntitySchema {
  parent: IParentSchema;
}

interface IState {
}

class ImageEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  proxyDraw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, timestamp: number) => {
    let image = ImageLibrary.get(this.props.url, timestamp)

    const w_i = image.width as number
    if (w_i === 0) {
      return
    }
    const h_i = image.height as number
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    const ratio  = Math.min(W / w_i, H / h_i);

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z

    ctx.drawImage(image, 0, 0, w_i, h_i, X + (W - w_i * ratio) / 2, Y + (H - h_i * ratio) / 2, w_i * ratio, h_i * ratio);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.parent
    this.proxyDraw(ctx, viewport, gridSize, this.props.x, this.props.y, this.props.width, this.props.height, 0)
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
