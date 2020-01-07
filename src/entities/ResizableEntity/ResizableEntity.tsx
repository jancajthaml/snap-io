import React from 'react'

import { IParentSchema, IChildSchema } from '../../@types/index'

import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
//import { IEntitySchema } from './types'
import ResizerHandle from './ResizerHandle'

interface IProps {
  parent: IParentSchema;
  children: React.ReactElement;
}

interface IState {
  selected: boolean;
  mutating: boolean;
  xDelta: number;
  yDelta: number;
  wDelta: number;
  hDelta: number;
}

class ResizableEntity extends React.Component<IProps, IState> {

  ref: React.RefObject<IChildSchema>;
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
    this.ref = React.createRef()
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

    if (this.ref.current === null) {
      return
    }
    const ref = this.ref.current as IChildSchema

    if (hDelta + ref.props.height <= 0) {
      if (yDelta !== 0) {
        yDelta = ref.props.height - 1
        hDelta = 1 - ref.props.height
      } else {
        hDelta = 1 - ref.props.height
      }
    }

    if (wDelta + ref.props.width <= 0) {
      if (xDelta !== 0) {
        xDelta = ref.props.width - 1
        wDelta = 1 - ref.props.width
      } else {
        wDelta = 1 - ref.props.width
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
      this.props.parent.elementUpdated(ref.props.id, nextSchema)
    }
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
    if (this.ref.current === null) {
      return undefined
    }

    const ref = this.ref.current as IChildSchema

    if (this.state.selected) {
      if (!(point.x >= ref.props.x - 1 && point.x <= (ref.props.x + ref.props.width + 1) && point.y >= ref.props.y - 1 && point.y <= (ref.props.y + ref.props.height + 1))) {
        return undefined
      }
      const x = (Math.round(ref.props.x) * gridSize - gridSize/2) * viewport.z
      const y = (Math.round(ref.props.y) * gridSize - gridSize/2) * viewport.z
      const w = (Math.round(ref.props.width) * gridSize + gridSize) * viewport.z
      const h = (Math.round(ref.props.height) * gridSize + gridSize) * viewport.z
      const pointScaled = point.multiply(viewport.z).multiply(gridSize)
      const capture = this.resizers.map((resizer) => resizer.mouseDownCapture(x, y, w, h, pointScaled)).filter((value) => value)[0]
      if (capture) {
        return capture
      }
      if (point.x >= ref.props.x - 0.5 && point.x <= (ref.props.x + ref.props.width + 0.5) && point.y >= ref.props.y - 0.5 && point.y <= (ref.props.y + ref.props.height + 0.5)) {
        return this
      }
      return undefined
    } else {
      if (point.x >= ref.props.x && point.x <= (ref.props.x + ref.props.width) && point.y >= ref.props.y && point.y <= (ref.props.y + ref.props.height)) {
        return this
      }
    }
  }

  draw = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    if (this.ref.current === null) {
      return undefined
    }
    const { viewport, gridSize } = this.props.parent
    const ref = this.ref.current as IChildSchema

    let { x, y, width, height } = ref.props
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

    ref.proxyDraw(ctx, viewport, gridSize, x, y, width, height, timestamp)

    if (this.state.selected) {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);

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
  }

  serialize = () => {
    if (this.ref.current === null) {
      return null
    }
    return this.ref.current.serialize()
  }

  isVisible = (gridSize: number, viewport: Rectangle): boolean => {
    if (this.ref.current === null) {
      return false
    }
    const ref = this.ref.current as IChildSchema
    return ref.isVisible(gridSize, viewport)
  }

  render() {
    return (
      <React.Fragment>
        {React.cloneElement(this.props.children, {
          ref: this.ref,
          parent: this,
        })}
      </React.Fragment>
    )
  }
}

export default ResizableEntity
