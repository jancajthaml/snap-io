
import Point from '../../atoms/Point'
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
