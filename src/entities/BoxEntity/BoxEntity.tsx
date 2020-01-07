import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'
import ResizerHandle from './ResizerHandle'

interface IProps extends IEntitySchema {
  engine: Engine;
}

interface IState {
  selected: boolean;
  isResizing?: string;
}

class BoxEntity extends React.Component<IProps, IState> {

  resizers: ResizerHandle[];

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
    }
    this.resizers = [
      new ResizerHandle(this, 0, 0, () => {}),    // top-left
      new ResizerHandle(this, 0.5, 0, () => {}),  // left
      new ResizerHandle(this, 1, 0, () => {}),    // bottom-left
      new ResizerHandle(this, 0, 1, () => {}),    // top-right
      new ResizerHandle(this, 0.5, 1, () => {}),  // right
      new ResizerHandle(this, 1, 1, () => {}),    // bottom-right
      new ResizerHandle(this, 1, 0.5, () => {}),  // right
      new ResizerHandle(this, 0, 0.5, () => {}),  // left
    ]
  }

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  onMouseDown = (): boolean => {
    if (this.state.selected) {
      //console.log(`BoxEntity ${this.props.id} onMouseDown at ${point.x},${point.y} (selected)`)
      return true
    } else {
      //console.log(`BoxEntity ${this.props.id} onMouseDown at ${point.x},${point.y}`)
      this.props.engine.setSelected(this)
      return true
    }
  }

  onMouseMove = (xDelta: number, yDelta: number): boolean => {
    //console.log(`BoxEntity ${this.props.id} onMouseMove(${xDelta},${yDelta})`)
    if (this.state.selected) {
      const self = this as any
      self.props.x += xDelta
      self.props.y += yDelta
    }
    return false
  }

  onMouseUp = (): boolean => {
    //console.log(`BoxEntity ${this.props.id} onMouseUp`)
    return false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number): any => {
    if (this.state.selected) {
      if (!(point.x >= this.props.x - 1 && point.x <= (this.props.x + this.props.width + 1) && point.y >= this.props.y - 1 && point.y <= (this.props.y + this.props.height + 1))) {
        return undefined
      }
      const x = (Math.round(this.props.x) * gridSize - gridSize/2) * viewport.z
      const y = (Math.round(this.props.y) * gridSize - gridSize/2) * viewport.z
      const w = (Math.round(this.props.width) * gridSize + gridSize) * viewport.z
      const h = (Math.round(this.props.height) * gridSize + gridSize) * viewport.z
      const pointScaled = point.multiply(viewport.z).multiply(gridSize)
      const capture = this.resizers.map((resizer) => resizer.mouseDownCapture(x, y, w, h, pointScaled)).filter((value) => value)[0]
      if (capture) {
        return capture
      }
      if (point.x >= this.props.x - 0.5 && point.x <= (this.props.x + this.props.width + 0.5) && point.y >= this.props.y - 0.5 && point.y <= (this.props.y + this.props.height + 0.5)) {
        return this
      }
      return undefined
    } else {
      if (point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height)) {
        return this
      }
    }
  }

  drawSimple = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
    }

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    ctx.fillRect(x, y, w, h);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
      ctx.strokeStyle = this.props.color
    }

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(x + offset, y + offset, w - 2 * offset, h - 2 * offset);
    ctx.strokeRect(x, y, w, h);
  }

  drawSelection = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);
    const x = (viewport.x1 + Math.round(this.props.x) * gridSize - gridSize/2) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize - gridSize/2) * viewport.z
    const w = (Math.round(this.props.width) * gridSize + gridSize) * viewport.z
    const h = (Math.round(this.props.height) * gridSize + gridSize) * viewport.z

    //const x = (viewport.x1 + this.bounds.x1 - 3) * viewport.z
    //const y = (viewport.y1 + this.bounds.y1 - 3) * viewport.z
    //const w = (this.bounds.x2 - this.bounds.x1 + 6) * viewport.z
    //const h = (this.bounds.y2 - this.bounds.y1 + 6) * viewport.z
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    // resizers
    this.resizers.forEach((resizer) => {
      resizer.draw(ctx, x, y, w, h)
    })

    /*
    // TOP-LEFT
    ctx.clearRect(x - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // TOP
    ctx.clearRect(x + w/2 - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x + w/2 - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // TOP-RIGHT
    ctx.clearRect(x + w - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x + w - (RESIZER_SIZE)/2, y - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // BOTTOM-LEFT
    ctx.clearRect(x - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // BOTTOM
    ctx.clearRect(x + w/2 - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x + w/2 - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // BOTTOM-RIGHT
    ctx.clearRect(x + w - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x + w - (RESIZER_SIZE)/2, y + h - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // LEFT
    ctx.clearRect(x - (RESIZER_SIZE)/2, y + h/2 - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x - (RESIZER_SIZE)/2, y + h/2 - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)

    // RIGHT
    ctx.clearRect(x + w - (RESIZER_SIZE)/2, y + h/2 - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    ctx.strokeRect(x + w - (RESIZER_SIZE)/2, y + h/2 - (RESIZER_SIZE)/2, RESIZER_SIZE, RESIZER_SIZE)
    */
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine
    if (viewport.z <= 0.4) {
      this.drawSimple(ctx, viewport, gridSize)
    } else {
      this.drawDetail(ctx, viewport, gridSize)
    }
    if (this.state.selected) {
      this.drawSelection(ctx, viewport, gridSize)
    }
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    color: this.props.color,
    x: this.props.x,
    y: this.props.y,
    width: this.props.width,
    height: this.props.height,
  })

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
