
import { Point } from '../../atoms'
import { RESIZER_SIZE } from './constants'

class ResizerHandle  {

  owner: any;
  x: number;
  y: number;
  selected: boolean;
  mutator: (xDelta: number, yDelta: number) => void;

  constructor(owner: any, x: number, y: number, mutator: (xDelta: number, yDelta: number) => void) {
    this.owner = owner
    this.x = x
    this.y = y
    this.selected = false
    this.mutator = mutator
  }

  mouseDownCapture = (x: number, y: number, width: number, height: number, point: Point): any => {
    const X = x + (width * this.x) - RESIZER_SIZE / 2
    const Y = y + (height * this.y) - RESIZER_SIZE / 2
    return (point.x >= X && point.x <= (X + RESIZER_SIZE) && point.y >= Y && point.y <= (Y + RESIZER_SIZE))
      ? [this]
      : []
  }

  onMouseMove = (xDelta: number, yDelta: number): boolean => {
    this.mutator(xDelta, yDelta)
    return false
  }

  onMouseUp = (): boolean => {
    this.selected = false
    this.owner.mutateStop()
    return false
  }

  onMouseDown = (): boolean => {
    this.owner.resizers.forEach((resizer: any) => {
      resizer.selected = false
    })
    this.selected = true
    this.owner.mutateStart()
    return true
  }

  draw = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const X = x + (width * this.x) - RESIZER_SIZE/2
    const Y = y + (height * this.y) - RESIZER_SIZE/2

    if (this.selected) {
      ctx.fillStyle = "black"
      ctx.fillRect(X, Y, RESIZER_SIZE, RESIZER_SIZE)
    } else {
      ctx.strokeStyle = "black"
      ctx.clearRect(X, Y, RESIZER_SIZE, RESIZER_SIZE)
      ctx.strokeRect(X, Y, RESIZER_SIZE, RESIZER_SIZE)
    }
  }

}

export default ResizerHandle
