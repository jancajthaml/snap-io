import React from 'react'

import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'
import TextLibrary from './TextLibrary'
import { IParentSchema } from '../../@types/index'

interface IProps extends IEntitySchema {
  parent: IParentSchema;
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
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => {
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
