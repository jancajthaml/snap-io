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
  mutating: boolean;
  xDelta: number;
  yDelta: number;
  wDelta: number;
  hDelta: number;
}

class BoxEntity extends React.Component<IProps, IState> {

  resizers: ResizerHandle[];

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
      mutating: false,
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
    }
    this.resizers = [
      new ResizerHandle(this, 0, 0, (xDelta: number, yDelta: number) => { // top-left
        this.setState((prevState) => ({
          xDelta: prevState.xDelta + xDelta,
          wDelta: prevState.wDelta - xDelta,
          yDelta: prevState.yDelta + yDelta,
          hDelta: prevState.hDelta - yDelta,
        }))
      }),
      new ResizerHandle(this, 0.5, 0, (_: number, yDelta: number) => { // top
        this.setState((prevState) => ({
          yDelta: prevState.yDelta + yDelta,
          hDelta: prevState.hDelta - yDelta,
        }))
      }),
      new ResizerHandle(this, 1, 0, (xDelta: number, yDelta: number) => { //top-right
        this.setState((prevState) => ({
          wDelta: prevState.wDelta + xDelta,
          yDelta: prevState.yDelta + yDelta,
          hDelta: prevState.hDelta - yDelta,
        }))
      }),
      new ResizerHandle(this, 0, 1, (xDelta: number, yDelta: number) => { // bottom-left
        this.setState((prevState) => ({
          xDelta: prevState.xDelta + xDelta,
          wDelta: prevState.wDelta - xDelta,
          hDelta: prevState.hDelta + yDelta,
        }))
      }),
      new ResizerHandle(this, 0.5, 1, (_: number, yDelta: number) => { // bottom
        this.setState((prevState) => ({
          hDelta: prevState.hDelta + yDelta,
        }))
      }),
      new ResizerHandle(this, 1, 1, (xDelta: number, yDelta: number) => { // bottom-right
        this.setState((prevState) => ({
          wDelta: prevState.wDelta + xDelta,
          hDelta: prevState.hDelta + yDelta,
        }))
      }),
      new ResizerHandle(this, 1, 0.5, (xDelta: number, _: number) => { // right
        this.setState((prevState) => ({
          wDelta: prevState.wDelta + xDelta,
        }))
      }),
      new ResizerHandle(this, 0, 0.5, (xDelta: number, _: number) => { // left
        this.setState((prevState) => ({
          xDelta: prevState.xDelta + xDelta,
          wDelta: prevState.wDelta - xDelta,
        }))
      }),
    ]
  }

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  mutateStart = (): void => {
    this.setState({
      mutating: true,
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
    })
  }

  mutateStop = (): void => {
    let { xDelta, yDelta, wDelta, hDelta } = this.state
    this.setState({
      mutating: false,
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
    })

    if (hDelta + this.props.height <= 0) {
      if (yDelta !== 0) {
        yDelta = this.props.height - 1
        hDelta = 1 - this.props.height
      } else {
        hDelta = 1 - this.props.height
      }
    }

    if (wDelta + this.props.width <= 0) {
      if (xDelta !== 0) {
        xDelta = this.props.width - 1
        wDelta = 1 - this.props.width
      } else {
        wDelta = 1 - this.props.width
      }
    }

    if (xDelta === -0) {
      xDelta = 0
    }
    if (yDelta === -0) {
      yDelta = 0
    }
    if (wDelta === -0) {
      wDelta = 0
    }
    if (hDelta === -0) {
      hDelta = 0
    }

    if (xDelta !== 0 || yDelta !== 0 || wDelta !== 0 || hDelta !== 0) {
      let nextSchema = this.serialize()
      nextSchema.x += xDelta
      nextSchema.y += yDelta
      nextSchema.width += wDelta
      nextSchema.height += hDelta
      this.props.engine.elementUpdated(this.props.id, nextSchema)
    }
  }

  onMouseDown = (): boolean => {
    if (this.state.selected) {
      this.mutateStart()
      return true
    } else {
      this.props.engine.setSelected(this)
      this.mutateStart()
      return true
    }
  }

  onMouseMove = (xDelta: number, yDelta: number): boolean => {
    if (this.state.selected) {
      this.setState((prevState) => ({
        xDelta: prevState.xDelta + xDelta,
        yDelta: prevState.yDelta + yDelta,
      }))
    }
    return false
  }

  onMouseUp = (): boolean => {
    this.mutateStop()
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

    let { x, y, width, height } = this.props
    if (this.state.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this.state
      if (hDelta + height <= 0) {
        if (yDelta !== 0) {
          yDelta = height - 1
          hDelta = 1 - height
        } else {
          hDelta = 1 - height
        }
      }

      if (wDelta + width <= 0) {
        if (xDelta !== 0) {
          xDelta = width - 1
          wDelta = 1 - width
        } else {
          wDelta = 1 - width
        }
      }

      y += yDelta
      x += xDelta
      width += wDelta
      height += hDelta
    }

    const X = (viewport.x1 + Math.round(x) * gridSize) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize) * viewport.z
    const W = Math.round(width) * gridSize * viewport.z
    const H = Math.round(height) * gridSize * viewport.z

    const offset = 3 * viewport.z
    ctx.fillRect(X + offset, Y + offset, W - 2 * offset, H - 2 * offset);
    ctx.strokeRect(X, Y, W, H);
  }

  drawSelection = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);

    let { x, y, width, height } = this.props
    if (this.state.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this.state
      if (hDelta + height <= 0) {
        if (yDelta !== 0) {
          yDelta = height - 1
          hDelta = 1 - height
        } else {
          hDelta = 1 - height
        }
      }

      if (wDelta + width <= 0) {
        if (xDelta !== 0) {
          xDelta = width - 1
          wDelta = 1 - width
        } else {
          wDelta = 1 - width
        }
      }

      y += yDelta
      x += xDelta
      width += wDelta
      height += hDelta
    }

    const X = (viewport.x1 + Math.round(x) * gridSize - gridSize/2) * viewport.z
    const Y = (viewport.y1 + Math.round(y) * gridSize - gridSize/2) * viewport.z
    const W = (Math.round(width) * gridSize + gridSize) * viewport.z
    const H = (Math.round(height) * gridSize + gridSize) * viewport.z

    ctx.strokeRect(X, Y, W, H);
    ctx.setLineDash([]);

    this.resizers.forEach((resizer) => {
      resizer.draw(ctx, X, Y, W, H)
    })
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
