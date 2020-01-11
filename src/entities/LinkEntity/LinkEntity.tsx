import React from 'react'

import { ICanvasEntityWrapperSchema } from '../../@types/index'

import { Point, Rectangle } from '../../atoms'
import { IEntitySchema } from './types'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
}

class LinkEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.parent.addEntity(this.props.id, this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this.props.id)
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _x: number, _y: number, _width: number, _height: number, _timestamp: number) => {
    if (layer === 3) {
      const fromRef = this.props.parent.getEntityByID(this.props.from[0])
      const toRef = this.props.parent.getEntityByID(this.props.to[0])

      if (fromRef && toRef) {
        const fromPoint = fromRef.getCenter(viewport, gridSize, this.props.from)
        const toPoint = toRef.getCenter(viewport, gridSize, this.props.to)
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.lineWidth = 1
        ctx.strokeStyle = "black";
        ctx.stroke();

      }
    }
  }

  isVisible = (_gridSize: number, _viewport: Rectangle): boolean => {
    //console.log('check if link entity is visible')
    /*
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.props.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.props.x + this.props.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.props.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.props.y + this.props.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
    */
    return true
  }

  canBeLinked = () => false

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[]) => {
    return new Point()
    //return new Point(this.props.x + this.props.width / 2, this.props.y + this.props.height / 2)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    from: this.props.from,
    to: this.props.to,
    x: this.props.x,
    y: this.props.y,
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default LinkEntity
