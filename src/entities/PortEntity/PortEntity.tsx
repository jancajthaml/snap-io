import React from 'react'

import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

import { Point, Rectangle } from '../../atoms'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
  selected: boolean;
  mutating: boolean;
  /*
  xDelta: number;
  yDelta: number;
  wDelta: number;
  hDelta: number;
  */
}

class PortEntity extends React.Component<IProps, IState> {

  ports: PortHandle[];

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
      mutating: false,
      /*
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
      */
    }

    this.ports = props.ports.map((port) => new PortHandle(this, port.x, port.y))
  }

  componentDidMount() {
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  addEntity = (_: any) => {}

  removeEntity = (_: any) => {}

  mutateStart = (): void => {
    if (this.state.mutating) {
      return
    }
    this.setState({
      mutating: true,
      /*
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
      */
    })
  }

  mutateStop = (): void => {
    if (!this.state.mutating) {
      return
    }
    //let { xDelta, yDelta, wDelta, hDelta } = this.state
    this.setState({
      mutating: false,
      /*
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
      */
    })
  }

  onMouseDown = (): boolean => {
    if (this.state.selected) {
      this.mutateStart()
      return true
    } else {
      this.props.parent.setSelected(this)
      this.mutateStart()
      return true
    }
  }

  onMouseMove = (_xDelta: number, _yDelta: number): boolean => {
    if (this.state.selected) {
      //this.setState((prevState) => ({
        //xDelta: prevState.xDelta + xDelta,
        //yDelta: prevState.yDelta + yDelta,
      //}))
    }
    return false
  }

  onMouseUp = (): boolean => {
    this.mutateStop()
    return false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number): any => {
    if (!(point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height))) {
      return undefined
    }
    const x = (Math.round(this.props.x) * gridSize) * viewport.z
    const y = (Math.round(this.props.y) * gridSize) * viewport.z
    const w = (Math.round(this.props.width) * gridSize) * viewport.z
    const h = (Math.round(this.props.height) * gridSize) * viewport.z
    const pointScaled = point.multiply(viewport.z).multiply(gridSize)
    const capture = this.ports.map((port) => port.mouseDownCapture(viewport, gridSize, x, y, w, h, pointScaled)).filter((value) => value)[0]
    if (capture) {
      return capture
    }

    return undefined
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _timestamp: number) => {
    ctx.fillStyle = "orange"

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    ctx.fillRect(X, Y, W, H);

    this.ports.forEach((port) => {
      port.draw(ctx, viewport, gridSize, X, Y, W, H)
    })
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    x: this.props.x,
    y: this.props.y,
    ports: this.ports.map((port) => port.serialize()),
    width: this.props.width,
    height: this.props.height,
  })

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - this.props.x * gridSize) < 0
    const outOfLeft = (viewport.x1 + (this.props.x + this.props.width) * gridSize) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - this.props.y * gridSize) < 0
    const outOfUp = (viewport.y1 + (this.props.y + this.props.height) * gridSize) < 0
    return !(outOfRight || outOfLeft || outOfBottom || outOfUp)
  }

  render() {
    return (
      <React.Fragment/>
    )
  }
}

export default PortEntity
