import React from 'react'

import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

import { Point, Rectangle } from '../../atoms'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

interface IState {
  //selected: boolean;
  connecting: boolean;
  //startPort: any;
}

class PortEntity extends React.Component<IProps, IState> {

  ports: PortHandle[];

  constructor(props: IProps) {
    super(props)
    this.state = {
      connecting: false,
      //selected: false,
      //mutating: false,
      //startPort: null,
    }
    this.ports = props.ports.map((port) => new PortHandle(this, port.id, port.x, port.y))
  }

  componentDidMount() {
    this.props.parent.addEntity(this)
  }

  componentWillUnmount() {
    this.props.parent.removeEntity(this)
  }

  addEntity = (_: any) => {}

  removeEntity = (_: any) => {}

  portConnectStart = (): void => {
    if (this.state.connecting) {
      return
    }
    this.setState({
      connecting: true,
      //startPort: port,
    })
    //console.log('now notify engine that we are connecting two ports')
    //console.log('start is', port)
    //this.props.parent.start()
  }

  portConnectStop = (): void => {
    if (!this.state.connecting) {
      return
    }
    //if (!this.state.mutating) {
      //return
    //}
    //console.log('now notify engine that we are connecting two ports')
    this.props.parent.connectEntities()
    //console.log(`start: ${this.state.startPort.id} , end: ${port.id}`)
    //this.props.parent.connect()

    this.setState({
      connecting: false,
      //mutating: false,
      //startPort: null,
    })
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

   //onMouseMove = (xDelta: number, yDelta: number): boolean => {
    //console.log('moving mouse over port entity', xDelta, yDelta)
    //if (this.state.selected) {
      //this.setState((prevState) => ({
        //xDelta: prevState.xDelta + xDelta,
        //yDelta: prevState.yDelta + yDelta,
      //}))
    //}
    //return false
  //}

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

    if (this.state.connecting) {
      const line = this.props.parent.currentMouseCoordinates.original
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = 2 * viewport.z;
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.lineWidth = 1;
    }
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
