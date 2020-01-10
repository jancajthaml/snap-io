import React from 'react'

import { ICanvasEntityWrapperSchema, ICanvasEntitySchema } from '../../@types/index'

import { Point, Rectangle } from '../../atoms'
import ResizerHandle from './ResizerHandle'

interface IProps {
  parent: ICanvasEntityWrapperSchema;
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

  ref: React.RefObject<ICanvasEntitySchema>;
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

  get currentMouseCoordinates() {
    return this.props.parent.currentMouseCoordinates
  }

  connectEntities = () => this.props.parent.connectEntities()

  addEntity = (_: any) => {}

  removeEntity = (_: any) => {}

  setSelected = (element: any) => {
    this.props.parent.setSelected(element)
  }

  mutateStart = (): void => {
    if (this.state.mutating) {
      return
    }
    this.setState({
      mutating: true,
      xDelta: 0,
      yDelta: 0,
      wDelta: 0,
      hDelta: 0,
    })
  }

  mutateStop = (): void => {
    if (!this.state.mutating) {
      return
    }
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
    const ref = this.ref.current as ICanvasEntitySchema

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

  onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        if (this.state.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.setState((prevState) => ({
            wDelta: prevState.wDelta - 1,
          }))
        } else if (event.shiftKey) {
          this.setState((prevState) => ({
            xDelta: prevState.xDelta - 1,
            wDelta: prevState.wDelta + 1,
          }))
        } else {
          this.setState((prevState) => ({
            xDelta: prevState.xDelta - 1,
          }))
        }
        break
      }
      case 'ArrowRight': {
        if (this.state.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.setState((prevState) => ({
            xDelta: prevState.xDelta + 1,
            wDelta: prevState.wDelta - 1,
          }))
        } else if (event.shiftKey) {
          this.setState((prevState) => ({
            wDelta: prevState.wDelta + 1,
          }))
        } else {
          this.setState((prevState) => ({
            xDelta: prevState.xDelta + 1,
          }))
        }
        break
      }
      case 'ArrowUp': {
        if (this.state.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.setState((prevState) => ({
            hDelta: prevState.hDelta - 1,
          }))
        } else if (event.shiftKey) {
          this.setState((prevState) => ({
            yDelta: prevState.yDelta - 1,
            hDelta: prevState.hDelta + 1,
          }))
        } else {
          this.setState((prevState) => ({
            yDelta: prevState.yDelta - 1,
          }))
        }

        break
      }
      case 'ArrowDown': {
        if (this.state.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.setState((prevState) => ({
            yDelta: prevState.yDelta + 1,
            hDelta: prevState.hDelta - 1,
          }))
        } else if (event.shiftKey) {
          this.setState((prevState) => ({
            hDelta: prevState.hDelta + 1,
          }))
        } else {
          this.setState((prevState) => ({
            yDelta: prevState.yDelta + 1,
          }))
        }
        break
      }
      default: {
        break
      }
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace': {
        if (this.ref.current !== null) {
          this.props.parent.elementDeleted(this.ref.current.props.id)
        }
        break
      }
      default: {
        if (this.state.mutating) {
          this.mutateStop()
        }
        break
      }
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

    const ref = this.ref.current as ICanvasEntitySchema

    if (this.state.selected) {
      if (!(point.x >= ref.props.x - 1 && point.x <= (ref.props.x + ref.props.width + 1) && point.y >= ref.props.y - 1 && point.y <= (ref.props.y + ref.props.height + 1))) {
        return undefined
      }
      if (ref.mouseDownCapture) {
        const capture = ref.mouseDownCapture(point, viewport, gridSize)
        if (capture) {
          return capture
        }
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
      if (!(point.x >= ref.props.x && point.x <= (ref.props.x + ref.props.width) && point.y >= ref.props.y && point.y <= (ref.props.y + ref.props.height))) {
        return undefined
      }
      if (ref.mouseDownCapture) {
        const capture = ref.mouseDownCapture(point, viewport, gridSize)
        if (capture) {
          return capture
        }
      }
      return this
    }
  }

  draw = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, _x: number, _y: number, _width: number, _height: number, timestamp: number) => {
    if (this.ref.current === null) {
      return undefined
    }

    const ref = this.ref.current as ICanvasEntitySchema

    let X = ref.props.x
    let Y = ref.props.y
    let W = ref.props.width
    let H = ref.props.height

    if (this.state.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this.state
      if (hDelta + H <= 0) {
        if (yDelta !== 0) {
          yDelta = H - 1
          hDelta = 1 - H
        } else {
          hDelta = 1 - H
        }
      }

      if (wDelta + W <= 0) {
        if (xDelta !== 0) {
          xDelta = W - 1
          wDelta = 1 - W
        } else {
          wDelta = 1 - W
        }
      }

      X += xDelta
      Y += yDelta
      W += wDelta
      H += hDelta
    }

    ref.draw(ctx, viewport, gridSize, X, Y, W, H, timestamp)

    if (this.state.selected) {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);

      X = (viewport.x1 + Math.round(X) * gridSize - gridSize/2) * viewport.z,
      Y = (viewport.y1 + Math.round(Y) * gridSize - gridSize/2) * viewport.z,
      W = (Math.round(W) * gridSize + gridSize) * viewport.z,
      H = (Math.round(H) * gridSize + gridSize) * viewport.z,

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
    const ref = this.ref.current as ICanvasEntitySchema
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
