
import { IEntitySchema } from './types'
import { Point, Rectangle } from '../../atoms'
import { ENTITY_TYPE } from './constants'

class LinkEntityRenderer {

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
      console.log('from or to references are missing')
      console.log('fromRef', fromRef, this.from)
      console.log('toRef', toRef, this.to)
      return
    }

    const fromPoint = fromRef.getCenter(viewport, gridSize, this.from, fromRef.props.x, fromRef.props.y, fromRef.props.width, fromRef.props.height)
    const toPoint = toRef.getCenter(viewport, gridSize, this.to, toRef.props.x, toRef.props.y, toRef.props.width, toRef.props.height)

    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.lineWidth = 1
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  isVisible = (_gridSize: number, _viewport: Rectangle): boolean => {
    return true
  }

  canBeLinked = () => false

  getCenter = (_viewport: Rectangle, _gridSize: number, _ids: string[], _x: number, _y: number, _width: number, _height: number) => {
    return new Point()
  }

  serialize = () => ({
    id: this.id,
    type: ENTITY_TYPE,
    from: this.from,
    to: this.to,
  })
}

export default LinkEntityRenderer
