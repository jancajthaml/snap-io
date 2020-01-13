
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'

//import { ICanvasEntitySchema } from '../../@types/index'

class LinkEntityRenderer /*implements ICanvasEntitySchema */ {

  id: string;
  from: string[];
  to: string[];
  getEntityByID: any;

  constructor(props: IEntitySchema, getEntityByID: any) {
    this.id = props.id
    this.from = props.from
    this.to = props.to
    this.getEntityByID = getEntityByID
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _timestamp: number) => {
    if (layer !== 3) {
      return
    }
    const fromRef = this.getEntityByID(this.from[0])
    const toRef = this.getEntityByID(this.to[0])

    if (!(fromRef && toRef)) {
      return
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.props.x, fromRef.props.y, fromRef.props.width, fromRef.props.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.props.x, toRef.props.y, toRef.props.width, toRef.props.height)

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.lineWidth = (viewport.z / 3) + 0.5
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.lineWidth = 1
  }

  isVisible = (_gridSize: number, _viewport: Rectangle): boolean => {
    return true
  }

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[], _x: number, _y: number, _width: number, _height: number) => {
    return new Point()
  }

  serialize = () => ({
    id: this.id,
    type: ENTITY_TYPE,
    from: this.from,
    to: this.to,
  })

  // FIXME deleted
  setState = (_nextState: any) => {}

}

export default LinkEntityRenderer
