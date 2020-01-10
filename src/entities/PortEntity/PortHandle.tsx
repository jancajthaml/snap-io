/*
import { Point } from '../../atoms'
import { IPortSchema } from './types'

class Port  {

  props: IPortSchema;

  constructor(props: IPortSchema) {
    this.props = props
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + 1) && point.y >= this.props.y && point.y <= (this.props.y + 1);
  }

  draw = (ctx: CanvasRenderingContext2D, gridSize: number, scale: number, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = "blue"
    const s = scale * gridSize * 0.5

    ctx.fillRect(x + (width * this.props.x) - s/2, y + (height * this.props.y) - s/2, s, s);
  }

  serialize = () => ({
    id: this.props.id,
    x: this.props.x,
    y: this.props.y,
    in: this.props.in,
    out: this.props.out,
  })

}

export default Port
*/


import { Point, Rectangle } from '../../atoms'

class PortHandle  {

  owner: any;
  id: string;
  x: number;
  y: number;
  //selected: boolean;

  constructor(owner: any, id: string, x: number, y: number) {
    this.owner = owner
    this.id = id
    this.x = x
    this.y = y
    //this.selected = false
  }

  mouseDownCapture = (viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, point: Point): any => {
    const PORT_SIZE = viewport.z * gridSize * 0.5

    const X = x + (width * this.x) - PORT_SIZE/2
    const Y = y + (height * this.y) - PORT_SIZE/2

    return (point.x >= X && point.x <= (X + PORT_SIZE) && point.y >= Y && point.y <= (Y + PORT_SIZE))
      ? this
      : undefined
  }

  //onMouseMove = (xDelta: number, yDelta: number): boolean => {
    //this.owner.onMouseMove(xDelta, yDelta)
    //console.log('handle mouse moving', xDelta, yDelta)
    //return false
  //}

  onMouseUp = (): boolean => {
    //this.selected = false

    this.owner.portConnectStop()
    return false
  }

  onMouseDown = (): boolean => {
    //this.owner.ports.forEach((port: any) => {
      //port.selected = false
    //})
    //this.selected = true
    this.owner.portConnectStart()
    return true
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number) => {
    const PORT_SIZE = viewport.z * gridSize * 0.5
    const X = x + (width * this.x) - PORT_SIZE/2
    const Y = y + (height * this.y) - PORT_SIZE/2

    //if (this.selected) {
      //ctx.fillStyle = "black"
      //ctx.fillRect(X, Y, PORT_SIZE, PORT_SIZE)
    //} else {
    ctx.fillStyle = "blue"
    ctx.fillRect(X, Y, PORT_SIZE, PORT_SIZE)
    //}
  }

  serialize = () => ({

  })

}

export default PortHandle
