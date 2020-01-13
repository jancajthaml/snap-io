
import { Point, Rectangle } from '../../atoms'
import ResizerHandle from './ResizerHandle'
import { ICanvasEntityWrapperSchema, ICanvasEntitySchema } from '../../@types/index'


class ResizableEntityRenderer implements ICanvasEntityWrapperSchema {

  id: string;
  ref: React.MutableRefObject<ICanvasEntitySchema | undefined>;
  parent: ICanvasEntityWrapperSchema;
  xDelta: number;
  yDelta: number;
  wDelta: number;
  hDelta: number;
  mutating: boolean;
  selected: boolean;
  resizers: ResizerHandle[];

  constructor(id: string, ref: React.MutableRefObject<ICanvasEntitySchema | undefined>, parent: ICanvasEntityWrapperSchema) {
    this.id = id;
    this.ref = ref;
    this.parent = parent;
    this.xDelta = 0;
    this.yDelta = 0;
    this.wDelta = 0;
    this.hDelta = 0;
    this.mutating = false
    this.selected = false
    this.resizers = [
      new ResizerHandle(this, 0, 0, (xDelta: number, yDelta: number) => { // top-left
        this.xDelta += xDelta
        this.wDelta -= xDelta
        this.yDelta += yDelta
        this.hDelta -= yDelta
      }),
      new ResizerHandle(this, 0.5, 0, (_xDelta: number, yDelta: number) => { // top
        this.yDelta += yDelta;
        this.hDelta -= yDelta;
      }),
      new ResizerHandle(this, 1, 0, (xDelta: number, yDelta: number) => { //top-right
        this.wDelta += xDelta;
        this.yDelta += yDelta;
        this.hDelta -= yDelta;
      }),
      new ResizerHandle(this, 0, 1, (xDelta: number, yDelta: number) => { // bottom-left
        this.xDelta += xDelta;
        this.wDelta -= xDelta;
        this.hDelta += yDelta;
      }),
      new ResizerHandle(this, 0.5, 1, (_xDelta: number, yDelta: number) => { // bottom
        this.hDelta += yDelta
      }),
      new ResizerHandle(this, 1, 1, (xDelta: number, yDelta: number) => { // bottom-right
        this.wDelta += xDelta;
        this.hDelta += yDelta;
      }),
      new ResizerHandle(this, 1, 0.5, (xDelta: number, _yDelta: number) => { // right
        this.wDelta += xDelta;
      }),
      new ResizerHandle(this, 0, 0.5, (xDelta: number, _yDelta: number) => { // left
        this.xDelta += xDelta;
        this.wDelta -= xDelta;
      }),
    ]
  }

  addNode = (_id: string, _entity: any) => {}
  removeNode = (_id: string) => {}
  entityDeleted = (_id: string) => {}
  linkDeleted = (_id: string) => {}
  linkUpdated = (_id: string, _newSchema: any) => {};

  get currentMouseCoordinates() {
    return this.parent.currentMouseCoordinates
  }

  mutateStart = (): void => {
    if (this.mutating) {
      return
    }

    this.xDelta = 0
    this.yDelta = 0
    this.wDelta = 0
    this.hDelta = 0
    this.mutating = true
  }

  mutateStop = (): void => {
    if (!this.mutating) {
      return
    }
    let { xDelta, yDelta, wDelta, hDelta } = this

    this.mutating = false
    this.xDelta = 0
    this.yDelta = 0
    this.wDelta = 0
    this.hDelta = 0

    if (!this.ref.current) {
      return
    }

    if (hDelta + this.ref.current.height <= 0) {
      if (yDelta !== 0) {
        yDelta = this.ref.current.height - 1
        hDelta = 1 - this.ref.current.height
      } else {
        hDelta = 1 - this.ref.current.height
      }
    }

    if (wDelta + this.ref.current.width <= 0) {
      if (xDelta !== 0) {
        xDelta = this.ref.current.width - 1
        wDelta = 1 - this.ref.current.width
      } else {
        wDelta = 1 - this.ref.current.width
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
      this.parent.entityUpdated(this.ref.current.id, nextSchema)
      this.ref.current.x += xDelta
      this.ref.current.y += yDelta
      this.ref.current.width += wDelta
      this.ref.current.height += hDelta
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        if (this.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.wDelta--
        } else if (event.shiftKey) {
          this.xDelta--
          this.wDelta++
        } else {
          this.xDelta--
        }
        break
      }
      case 'ArrowRight': {
        if (this.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.xDelta++
          this.wDelta--
        } else if (event.shiftKey) {
          this.wDelta++
        } else {
          this.xDelta++
        }
        break
      }
      case 'ArrowUp': {
        if (this.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.hDelta--
        } else if (event.shiftKey) {
          this.yDelta--
          this.hDelta++
        } else {
          this.yDelta--
        }

        break
      }
      case 'ArrowDown': {
        if (this.selected) {
          this.mutateStart()
        }
        if (event.altKey) {
          this.yDelta++
          this.hDelta--
        } else if (event.shiftKey) {
          this.hDelta++
        } else {
          this.yDelta++
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
        if (this.ref.current) {
          // FIXME make work for links also
          this.parent.entityDeleted(this.ref.current.id)
        }
        break
      }
      default: {
        if (this.mutating) {
          this.mutateStop()
        }
        break
      }
    }
  }

  onMouseDown = () => {
    if (this.selected) {
      this.mutateStart()
      return true
    } else {
      this.parent.setSelected(this)
      this.mutateStart()
      return true
    }
  }

  onMouseMove = (xDelta: number, yDelta: number) => {
    if (this.selected) {
      this.xDelta += xDelta
      this.yDelta += yDelta
    }
    return false
  }

  onMouseUp = () => {
    this.mutateStop()
    return false
  }

  mouseDownCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!this.ref.current) {
      return undefined
    }

    if (this.selected) {
      if (!(point.x >= this.ref.current.x - 1 && point.x <= (this.ref.current.x + this.ref.current.width + 1) && point.y >= this.ref.current.y - 1 && point.y <= (this.ref.current.y + this.ref.current.height + 1))) {
        return undefined
      }
      if (this.ref.current.mouseDownCapture) {
        const capture = this.ref.current.mouseDownCapture(point, viewport, gridSize)
        if (capture) {
          return capture
        }
      }
      const x = (Math.round(this.ref.current.x) * gridSize - gridSize/2) * viewport.z
      const y = (Math.round(this.ref.current.y) * gridSize - gridSize/2) * viewport.z
      const w = (Math.round(this.ref.current.width) * gridSize + gridSize) * viewport.z
      const h = (Math.round(this.ref.current.height) * gridSize + gridSize) * viewport.z
      const pointScaled = point.multiply(viewport.z).multiply(gridSize)
      const capture = this.resizers.map((resizer) => resizer.mouseDownCapture(x, y, w, h, pointScaled)).filter((value) => value)[0]
      if (capture) {
        return capture
      }
      if (point.x >= this.ref.current.x - 0.5 && point.x <= (this.ref.current.x + this.ref.current.width + 0.5) && point.y >= this.ref.current.y - 0.5 && point.y <= (this.ref.current.y + this.ref.current.height + 0.5)) {
        return this
      }
      return undefined
    } else {
      if (!(point.x >= this.ref.current.x && point.x <= (this.ref.current.x + this.ref.current.width) && point.y >= this.ref.current.y && point.y <= (this.ref.current.y + this.ref.current.height))) {
        return undefined
      }
      if (this.ref.current.mouseDownCapture) {
        const capture = this.ref.current.mouseDownCapture(point, viewport, gridSize)
        if (capture) {
          return capture
        }
      }
      return this
    }
  }

  connectEntities = () => {
    this.parent.connectEntities()
  }

  entityUpdated = (id: string, newSchema: any) => {
    this.parent.entityUpdated(id, newSchema)
  }

  setSelected = (element?: any) => {
    this.parent.setSelected(element)
  }

  getEntityByID = (id: string) => this.parent.getEntityByID(id)

  getCenter = (viewport: Rectangle, gridSize: number, ids: string[], _x: number, _y: number, _width: number, _height: number) => {
    if (!this.ref.current) {
      return new Point()
    }

    if (this.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this
      if (hDelta + this.ref.current.height <= 0) {
        if (yDelta !== 0) {
          yDelta = this.ref.current.height - 1
          hDelta = 1 - this.ref.current.height
        } else {
          hDelta = 1 - this.ref.current.height
        }
      }

      if (wDelta + this.ref.current.width <= 0) {
        if (xDelta !== 0) {
          xDelta = this.ref.current.width - 1
          wDelta = 1 - this.ref.current.width
        } else {
          wDelta = 1 - this.ref.current.width
        }
      }

      return this.ref.current.getCenter(viewport, gridSize, ids, this.ref.current.x + xDelta, this.ref.current.y + yDelta, this.ref.current.width + wDelta, this.ref.current.height + hDelta)
    } else {
      return this.ref.current.getCenter(viewport, gridSize, ids, this.ref.current.x, this.ref.current.y, this.ref.current.width, this.ref.current.height)
    }
  }

  linkCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!this.ref.current) {
      return undefined
    }

    if (!(point.x >= this.ref.current.x && point.x <= (this.ref.current.x + this.ref.current.width) && point.y >= this.ref.current.y && point.y <= (this.ref.current.y + this.ref.current.height))) {
      return undefined
    }
    if (this.ref.current.linkCapture) {
      const capture = this.ref.current.linkCapture(point, viewport, gridSize)
      if (capture) {
        return capture
      }
    }
    return undefined
  }

  isVisible = (gridSize: number, viewport: Rectangle) => {
    if (!this.ref.current) {
      return false
    }
    return this.ref.current.isVisible(gridSize, viewport)
  }

  draw = (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    if (!this.ref.current) {
      return undefined
    }

    let X = this.ref.current.x
    let Y = this.ref.current.y
    let W = this.ref.current.width
    let H = this.ref.current.height

    if (this.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this
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

      this.ref.current.x += xDelta
      this.ref.current.y += yDelta
      this.ref.current.width += wDelta
      this.ref.current.height += hDelta
      this.ref.current.draw(this.selected ? layer - 1 : layer, ctx, viewport, gridSize, timestamp)
      this.ref.current.x -= xDelta
      this.ref.current.y -= yDelta
      this.ref.current.width -= wDelta
      this.ref.current.height -= hDelta
    } else {
      this.ref.current.draw(this.selected ? layer - 1 : layer, ctx, viewport, gridSize, timestamp)
    }

    if (layer === 2 && this.selected) {
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
    } /* else if (layer === 2 && !this.selected) {
      ctx.strokeStyle = "#ccc";
      ctx.fillStyle = "#ccc";
      ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);

      X = (viewport.x1 + Math.round(X) * gridSize - gridSize/2) * viewport.z,
      Y = (viewport.y1 + Math.round(Y) * gridSize - gridSize/2) * viewport.z,
      W = (Math.round(W) * gridSize + gridSize) * viewport.z,
      H = (Math.round(H) * gridSize + gridSize) * viewport.z,

      ctx.strokeRect(X, Y, W, H);
      ctx.setLineDash([]);
    } */ // FIXME only in engine mode edit
  }

  serialize = () => {
    return this.ref.current
      ? this.ref.current.serialize()
      : {}
  }

  selectionCapture = (selected: boolean) => {
    this.selected = selected
  }

}

export default ResizableEntityRenderer
