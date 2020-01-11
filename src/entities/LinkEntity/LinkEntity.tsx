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
        const fromPoint = fromRef.getCenter(viewport, gridSize, this.props.from, fromRef.props.x, fromRef.props.y, fromRef.props.width, fromRef.props.height)
        const toPoint = toRef.getCenter(viewport, gridSize, this.props.to, toRef.props.x, toRef.props.y, toRef.props.width, toRef.props.height)

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
    return true
  }

  canBeLinked = () => false

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[], _x: number, _y: number, _width: number, _height: number) => {
    return new Point()
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
