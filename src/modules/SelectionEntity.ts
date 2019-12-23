import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import Engine from './Engine'

const RESIZER_SIZE = 10 as const

class ResizerHandle extends Rectangle {
  name: string;

  constructor(name: string) {
    super()
    this.name = name
  }
}

class SelectionEntity extends Rectangle {

  is_resizing?: string;

  L_resizer: ResizerHandle;
  TL_resizer: ResizerHandle;
  BL_resizer: ResizerHandle;
  R_resizer: ResizerHandle;
  TR_resizer: ResizerHandle;
  BR_resizer: ResizerHandle;
  T_resizer: ResizerHandle;
  B_resizer: ResizerHandle;

  constructor() {
    super()
    this.is_resizing = undefined
    this.L_resizer = new ResizerHandle('left')
    this.TL_resizer = new ResizerHandle('top-left')
    this.BL_resizer = new ResizerHandle('bottom-left')
    this.R_resizer = new ResizerHandle('right')
    this.TR_resizer = new ResizerHandle('top-right')
    this.BR_resizer = new ResizerHandle('bottom-right')
    this.T_resizer = new ResizerHandle('top')
    this.B_resizer = new ResizerHandle('bottom')
  }

  mouseDown = (engine: Engine) => {
    if (this.is_resizing) {
      return
    }
    this.x1 = engine.mouse.coordinates.x1 / engine.scale - engine.viewport.x1
    this.y1 = engine.mouse.coordinates.y1 / engine.scale - engine.viewport.y1
    this.x2 = this.x1 + (engine.mouse.coordinates.x2 - engine.mouse.coordinates.x1) / engine.scale
    this.y2 = this.y1 + (engine.mouse.coordinates.y2 - engine.mouse.coordinates.y1) / engine.scale
    this.updateSelected(engine, true)
    this.updateResizers()
  }

  mouseUp = () => {
    this.is_resizing = undefined
  }

  mouseMove = (engine: Engine, xDelta: number, yDelta: number) => {
    switch (this.is_resizing) {

      case this.T_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_h = (this.y2 - this.y1)
          const ele_h = (element.y2 - element.y1)
          const h_percentage = ele_h / sel_h
          const y_percentage = (element.y1 - this.y1) / sel_h
          element.y1 += yDelta * (1-y_percentage)
          element.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.y1 += yDelta
        this.updateResizers()
        break
      }

      case this.TL_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_w = (this.x2 - this.x1)
          const ele_w = (element.x2 - element.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.x1 - this.x1) / sel_w

          const sel_h = (this.y2 - this.y1)
          const ele_h = (element.y2 - element.y1)
          const h_percentage = ele_h / sel_h
          const y_percentage = (element.y1 - this.y1) / sel_h

          element.x1 += xDelta * (1-x_percentage)
          element.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.y1 += yDelta * (1-y_percentage)
          element.y2 += yDelta * (1-(h_percentage + y_percentage))

        })
        this.y1 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.TR_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_w = (this.x2 - this.x1)
          const ele_w = (element.x2 - element.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.x1 - this.x1) / sel_w

          const sel_h = (this.y2 - this.y1)
          const ele_h = (element.y2 - element.y1)
          const h_percentage = ele_h / sel_h
          const y_percentage = (element.y1 - this.y1) / sel_h

          element.x1 += xDelta * x_percentage
          element.x2 += xDelta * (w_percentage + x_percentage)
          element.y1 += yDelta * (1-y_percentage)
          element.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.y1 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case this.B_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_h = (this.y2 - this.y1)
          const ele_h = (element.y2 - element.y1)
          const h_percentage = ele_h / sel_h
          const y_percentage = (element.y1 - this.y1) / sel_h
          element.y1 += yDelta * y_percentage
          element.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.updateResizers()
        break
      }

      case this.BL_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_h = (this.y2 - this.y1)
          const ele_h = (element.y2 - element.y1)
          const h_percentage = ele_h / sel_h
          const y_percentage = (element.y1 - this.y1) / sel_h

          const sel_w = (this.x2 - this.x1)
          const ele_w = (element.x2 - element.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.x1 - this.x1) / sel_w
          element.x1 += xDelta * (1-x_percentage)
          element.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.y1 += yDelta * y_percentage
          element.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.BR_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_w = (this.x2 - this.x1)
          const sel_h = (this.y2 - this.y1)
          const ele_w = (element.x2 - element.x1)
          const ele_h = (element.y2 - element.y1)
          const w_percentage = ele_w / sel_w
          const h_percentage = ele_h / sel_h
          const x_percentage = (element.x1 - this.x1) / sel_w
          const y_percentage = (element.y1 - this.y1) / sel_h
          element.x1 += xDelta * x_percentage
          element.x2 += xDelta * (w_percentage + x_percentage)
          element.y1 += yDelta * y_percentage
          element.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case this.L_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_w = (this.x2 - this.x1)
          const ele_w = (element.x2 - element.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.x1 - this.x1) / sel_w
          element.x1 += xDelta * (1-x_percentage)
          element.x2 += xDelta * (1-(w_percentage + x_percentage))
        })
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.R_resizer.name: {
        engine.elements.forEachSelected((element: any) => {
          const sel_w = (this.x2 - this.x1)
          const ele_w = (element.x2 - element.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.x1 - this.x1) / sel_w
          element.x1 += xDelta * x_percentage
          element.x2 += xDelta * (w_percentage + x_percentage)
        })
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      default: {
        this.updateSelected(engine, true)
        this.updateResizers()
        break
      }
    }
  }

  updateSelected = (engine: Engine, clearPrevious: boolean) => {
    this.x1 = (engine.mouse.coordinates.x1 > engine.mouse.coordinates.x2
      ? engine.mouse.coordinates.x2
      : engine.mouse.coordinates.x1) / engine.scale - engine.viewport.x1
    this.y1 = (engine.mouse.coordinates.y1 > engine.mouse.coordinates.y2
      ? engine.mouse.coordinates.y2
      : engine.mouse.coordinates.y1) / engine.scale - engine.viewport.y1
    this.x2 = this.x1 + (
      engine.mouse.coordinates.x1 > engine.mouse.coordinates.x2
        ? (engine.mouse.coordinates.x1 - engine.mouse.coordinates.x2)
        : (engine.mouse.coordinates.x2 - engine.mouse.coordinates.x1)
      ) / engine.scale
    this.y2 = this.y1 + (
      engine.mouse.coordinates.y1 > engine.mouse.coordinates.y2
        ? (engine.mouse.coordinates.y1 - engine.mouse.coordinates.y2)
        : (engine.mouse.coordinates.y2 - engine.mouse.coordinates.y1)
      ) / engine.scale
    engine.elements.updateSelected(this, clearPrevious)
  }

  updateResizers = () => {
    if (this.x1 === undefined) {
      return
    }

    const x = this.x1 - 3
    const y = this.y1 - 3

    const w = (this.x2 - this.x1 + 6)
    const h = (this.y2 - this.y1 + 6)


    this.T_resizer.x1 = x + w/2 - RESIZER_SIZE/2
    this.T_resizer.x2 = this.T_resizer.x1 + RESIZER_SIZE
    this.T_resizer.y1 = y - RESIZER_SIZE/2
    this.T_resizer.y2 = this.T_resizer.y1 + RESIZER_SIZE

    this.TL_resizer.x1 = x - RESIZER_SIZE/2
    this.TL_resizer.x2 = this.TL_resizer.x1 + RESIZER_SIZE
    this.TL_resizer.y1 = y - RESIZER_SIZE/2
    this.TL_resizer.y2 = this.TL_resizer.y1 + RESIZER_SIZE

    this.B_resizer.x1 = x + w/2 - RESIZER_SIZE/2
    this.B_resizer.x2 = this.B_resizer.x1 + RESIZER_SIZE
    this.B_resizer.y1 = y + h - RESIZER_SIZE/2
    this.B_resizer.y2 = this.B_resizer.y1 + RESIZER_SIZE

    this.BL_resizer.x1 = x - RESIZER_SIZE/2
    this.BL_resizer.x2 = this.BL_resizer.x1 + RESIZER_SIZE
    this.BL_resizer.y1 = y + h - RESIZER_SIZE/2
    this.BL_resizer.y2 = this.BL_resizer.y1 + RESIZER_SIZE

    this.L_resizer.x1 = x - RESIZER_SIZE/2
    this.L_resizer.x2 = this.L_resizer.x1 + RESIZER_SIZE
    this.L_resizer.y1 = y + h/2 - RESIZER_SIZE/2
    this.L_resizer.y2 = this.L_resizer.y1 + RESIZER_SIZE

    this.R_resizer.x1 = x + w - RESIZER_SIZE/2
    this.R_resizer.x2 = this.R_resizer.x1 + RESIZER_SIZE
    this.R_resizer.y1 = y + h/2 - RESIZER_SIZE/2
    this.R_resizer.y2 = this.R_resizer.y1 + RESIZER_SIZE

    this.TR_resizer.x1 = x + w - RESIZER_SIZE/2
    this.TR_resizer.x2 = this.TR_resizer.x1 + RESIZER_SIZE
    this.TR_resizer.y1 = y - RESIZER_SIZE/2
    this.TR_resizer.y2 = this.TR_resizer.y1 + RESIZER_SIZE

    this.BR_resizer.x1 = x + w - RESIZER_SIZE/2
    this.BR_resizer.x2 = this.BR_resizer.x1 + RESIZER_SIZE
    this.BR_resizer.y1 = y + h - RESIZER_SIZE/2
    this.BR_resizer.y2 = this.BR_resizer.y1 + RESIZER_SIZE
  }

  translate = (x: number, y: number) => {
    super.translate(x, y)

    const data = [
      this.T_resizer,
      this.L_resizer,
      this.TL_resizer,
      this.B_resizer,
      this.BL_resizer,
      this.R_resizer,
      this.TR_resizer,
      this.BR_resizer,
    ] as ResizerHandle[]

    data.forEach((resizer: ResizerHandle) => {
      resizer.translate(x, y)
    })
  }

  compressSelected = (engine: Engine) => {
    let x1: number | undefined = undefined
    let y1: number | undefined = undefined
    let x2: number | undefined = undefined
    let y2: number | undefined = undefined
    engine.elements.forEachSelected((element: any) => {
      if (x1 === undefined || x1 > element.x1) {
        x1 = element.x1
      }
      if (y1 === undefined || y1 > element.y1) {
        y1 = element.y1
      }
      if (x2 === undefined || x2 < element.x2) {
        x2 = element.x2
      }
      if (y2 === undefined || y2 < element.y2) {
        y2 = element.y2
      }
    })
    this.x1 = x1 || 0
    this.y1 = y1 || 0
    this.x2 = x2 || 0
    this.y2 = y2 || 0
  }

  selectionCapture = (point: Point) => {
    return point.x >= this.x1 && point.x <= this.x2 && point.y >= this.y1 && point.y <= this.y2;
  }

  resizerCapture = (engine: Engine, point: Point) => {
    const data = [
      this.T_resizer,
      this.L_resizer,
      this.TL_resizer,
      this.B_resizer,
      this.BL_resizer,
      this.R_resizer,
      this.TR_resizer,
      this.BR_resizer,
    ] as ResizerHandle[]

    const pointScaled = point.multiply(engine.scale)

    for (const resizer of data) {
      const w = (resizer.x2 - resizer.x1) * engine.scale
      const h = (resizer.y2 - resizer.y1) * engine.scale

      const x1 = (resizer.x1 * engine.scale) + (w - RESIZER_SIZE)/2
      const y1 = (resizer.y1 * engine.scale) + (h - RESIZER_SIZE)/2
      const x2 = x1 + (resizer.x2 - resizer.x1)
      const y2 = y1 + (resizer.y2 - resizer.y1)

      if (pointScaled.x >= x1 && pointScaled.x <= x2 && pointScaled.y >= y1 && pointScaled.y <= y2) {
        this.is_resizing = resizer.name
        return true
      }
    }
    return false
  }

  draw(ctx: CanvasRenderingContext2D, engine: Engine) {
    if (engine.mouse.currentEvent === 'selection') {
      return
    }

    if (this.x1 === undefined) {
      return
    }

    ctx.strokeStyle = "black";
    ctx.setLineDash([4 * engine.scale, 4 * engine.scale]);

    const x = (engine.viewport.x1 + this.x1 - 3) * engine.scale
    const y = (engine.viewport.y1 + this.y1 - 3) * engine.scale
    const w = (this.x2 - this.x1 + 6) * engine.scale
    const h = (this.y2 - this.y1 + 6) * engine.scale
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    [
      this.T_resizer,
      this.L_resizer,
      this.TL_resizer,
      this.B_resizer,
      this.BL_resizer,
      this.R_resizer,
      this.TR_resizer,
      this.BR_resizer,
    ].forEach((resizer: ResizerHandle) => {
      const w = (resizer.x2 - resizer.x1) * engine.scale
      const h = (resizer.y2 - resizer.y1) * engine.scale

      if (this.is_resizing === resizer.name) {
        ctx.fillRect(
          ((engine.viewport.x1 + resizer.x1) * engine.scale) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.scale) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      } else {
        ctx.clearRect(
          ((engine.viewport.x1 + resizer.x1) * engine.scale) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.scale) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )

        ctx.strokeRect(
          ((engine.viewport.x1 + resizer.x1) * engine.scale) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.scale) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      }
    })

  }
}

export default SelectionEntity
