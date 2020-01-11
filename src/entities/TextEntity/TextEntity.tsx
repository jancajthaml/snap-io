import React from 'react'

import { Point, Rectangle } from '../../atoms'
import { IEntitySchema } from './types'
import TextLibrary from './TextLibrary'
import { ICanvasEntityWrapperSchema } from '../../@types/index'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
}

class TextEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.parent.addEntity(this.props.id, this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this.props.id)
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => {
    if (layer !== 1) {
      return
    }
    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    const image = TextLibrary.get(this.props.text, 12, Math.round(width) * gridSize, Math.round(height) * gridSize)
    ctx.drawImage(image, 0, 0, image.width, image.height, X, Y, W, H);
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.props.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.props.x + this.props.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.props.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.props.y + this.props.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  canBeLinked = () => false

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[]) => {
    return new Point(this.props.x + this.props.width / 2, this.props.y + this.props.height / 2)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    text: this.props.text,
    x: this.props.x,
    y: this.props.y,
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default TextEntity
