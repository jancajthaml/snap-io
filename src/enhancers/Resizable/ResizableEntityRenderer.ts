import { Point, Rectangle } from '../../atoms'
import ResizerHandle from './ResizerHandle'
import { ICanvasEntityWrapperSchema, ICanvasEntitySchema } from '../../@types/index'

import { EngineMode } from '../../modules/Diagram/constants'

class ResizableEntityRenderer implements ICanvasEntityWrapperSchema {

  id: string;
  child: ICanvasEntitySchema;
  parent: ICanvasEntityWrapperSchema;
  xDelta: number;
  yDelta: number;
  wDelta: number;
  hDelta: number;
  mutating: boolean;
  selected: boolean;
  resizers: ResizerHandle[];

  constructor(id: string, child: ICanvasEntitySchema, parent: ICanvasEntityWrapperSchema) {
    this.id = id;
    this.child = child;
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

    if (hDelta + this.child.height <= 0) {
      if (yDelta !== 0) {
        yDelta = this.child.height - 1
        hDelta = 1 - this.child.height
      } else {
        hDelta = 1 - this.child.height
      }
    }

    if (wDelta + this.child.width <= 0) {
      if (xDelta !== 0) {
        xDelta = this.child.width - 1
        wDelta = 1 - this.child.width
      } else {
        wDelta = 1 - this.child.width
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
      this.parent.entityUpdated(this.child.id, nextSchema)
      this.child.x += xDelta
      this.child.y += yDelta
      this.child.width += wDelta
      this.child.height += hDelta
      const ref = this.child as any
      ref.updateClientCoordinates()
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
          // FIXME make work for links also
        this.parent.entityDeleted(this.child.id)
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
    if (!(point.x >= this.child.x - 1 && point.x <= (this.child.x + this.child.width + 1) && point.y >= this.child.y - 1 && point.y <= (this.child.y + this.child.height + 1))) {
      return []
    }

    if (this.selected) {
      const captures = [] as any[]

      const x = this.child.x * gridSize - gridSize / 2
      const y = this.child.y * gridSize - gridSize / 2
      const w = this.child.width * gridSize + gridSize
      const h = this.child.height * gridSize + gridSize

      const pointScaled = new Point(point.x * gridSize, point.y * gridSize)

      captures.push(...this.resizers.reduce(function(flat, resizer) {
        return flat.concat(resizer.mouseDownCapture(x, y, w, h, pointScaled));
      }, []))

      if (captures.length) {
        return captures.concat(this)
      }

      if (this.child.mouseDownCapture) {
        captures.push(...this.child.mouseDownCapture(point, viewport, gridSize))
      }

      if (captures.length) {
        return captures.concat(this)
      }

      if (point.x >= this.child.x - 0.5 && point.x <= (this.child.x + this.child.width + 0.5) && point.y >= this.child.y - 0.5 && point.y <= (this.child.y + this.child.height + 0.5)) {
        return [this]
      }
      return []
    } else {
      if (this.child.mouseDownCapture) {
        return this.child.mouseDownCapture(point, viewport, gridSize).concat(this)
      }
      return [this]
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
    const ref = this.child as any
    if (!ref.getCenter) {
      return new Point()
    }

    if (this.mutating) {
      let { xDelta, yDelta, wDelta, hDelta } = this
      if (hDelta + ref.height <= 0) {
        if (yDelta !== 0) {
          yDelta = ref.height - 1
          hDelta = 1 - ref.height
        } else {
          hDelta = 1 - ref.height
        }
      }

      if (wDelta + ref.width <= 0) {
        if (xDelta !== 0) {
          xDelta = ref.width - 1
          wDelta = 1 - ref.width
        } else {
          wDelta = 1 - ref.width
        }
      }

      return ref.getCenter(viewport, gridSize, ids, ref.x + xDelta, ref.y + yDelta, ref.width + wDelta, ref.height + hDelta)
    } else {
      return ref.getCenter(viewport, gridSize, ids, ref.x, ref.y, ref.width, ref.height)
    }
  }

  linkCapture = (point: Point, viewport: Rectangle, gridSize: number) => {
    if (!(point.x >= this.child.x - 1 && point.x <= (this.child.x + this.child.width + 1) && point.y >= this.child.y - 1 && point.y <= (this.child.y + this.child.height + 1))) {
      return undefined
    }
    if (this.child.linkCapture) {
      const capture = this.child.linkCapture(point, viewport, gridSize)
      if (capture) {
        return capture
      }
    }
    return undefined
  }

  draw = (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => {
    /*
    const ref = this.child as any
    if (!ref.visible) {
      return
    }
    */

    let X = this.child.x
    let Y = this.child.y
    let W = this.child.width
    let H = this.child.height

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

      const ref = this.child as any
      ref.clientX += xDelta * gridSize
      ref.clientY += yDelta * gridSize
      ref.clientW += wDelta * gridSize
      ref.clientH += hDelta * gridSize
      this.child.draw(this.selected ? layer - 1 : layer, mode, ctx, viewport, gridSize, timestamp)
      ref.clientX -= xDelta * gridSize
      ref.clientY -= yDelta * gridSize
      ref.clientW -= wDelta * gridSize
      ref.clientH -= hDelta * gridSize
    } else {
      this.child.draw(this.selected ? layer - 1 : layer, mode, ctx, viewport, gridSize, timestamp)
    }

    if (mode !== EngineMode.EDIT) {
      return
    }

    if (layer === 2 && this.selected) {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1 / viewport.z
      X = X * gridSize - gridSize / 2
      Y = Y * gridSize - gridSize / 2
      W = W * gridSize + gridSize
      H = H * gridSize + gridSize

      ctx.strokeRect(X, Y, W, H);
      ctx.setLineDash([]);

      this.resizers.forEach((resizer) => {
        resizer.draw(ctx, X, Y, W, H, viewport.z)
      })
      ctx.lineWidth = 1
    } else if (layer === 1 && !this.selected) {
      ctx.strokeStyle = "#ccc";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1 / viewport.z
      X = X * gridSize - gridSize / 2
      Y = Y * gridSize - gridSize / 2
      W = W * gridSize + gridSize
      H = H * gridSize + gridSize

      ctx.strokeRect(X, Y, W, H);
      ctx.setLineDash([]);
      ctx.lineWidth = 1
    }
  }

  serialize = () => this.child.serialize()

  selectionCapture = (selected: boolean) => {
    this.selected = selected
  }

}

export default ResizableEntityRenderer
