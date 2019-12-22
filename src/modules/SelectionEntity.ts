import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import Engine from './Engine'

class SelectionEntity extends Rectangle {

  is_resizing?: string;

  L_resizer: Rectangle;
  TL_resizer: Rectangle;
  BL_resizer: Rectangle;
  R_resizer: Rectangle;
  TR_resizer: Rectangle;
  BR_resizer: Rectangle;
  T_resizer: Rectangle;
  B_resizer: Rectangle;

  constructor() {
    super()
    this.is_resizing = undefined
    this.L_resizer = new Rectangle()
    this.TL_resizer = new Rectangle()
    this.BL_resizer = new Rectangle()
    this.R_resizer = new Rectangle()
    this.TR_resizer = new Rectangle()
    this.BR_resizer = new Rectangle()
    this.T_resizer = new Rectangle()
    this.B_resizer = new Rectangle()
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

      case 'top': {
        engine.elements.forEachSelected((element: any) => {
          element.y1 += yDelta
        })
        this.y1 += yDelta
        this.updateResizers()
        break
      }

      case 'top-left': {
        engine.elements.forEachSelected((element: any) => {
          element.y1 += yDelta
          element.x1 += xDelta
        })
        this.y1 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case 'top-right': {
        engine.elements.forEachSelected((element: any) => {
          element.y1 += yDelta
          element.x2 += xDelta
        })
        this.y1 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case 'bottom': {
        engine.elements.forEachSelected((element: any) => {
          element.y2 += yDelta
        })
        this.y2 += yDelta
        this.updateResizers()
        break
      }

      case 'bottom-left': {
        engine.elements.forEachSelected((element: any) => {
          element.y2 += yDelta
          element.x1 += xDelta
        })
        this.y2 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case 'bottom-right': {
        engine.elements.forEachSelected((element: any) => {
          element.y2 += yDelta
          element.x2 += xDelta
        })
        this.y2 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case 'left': {
        engine.elements.forEachSelected((element: any) => {
          element.x1 += xDelta
        })
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case 'right': {
        engine.elements.forEachSelected((element: any) => {
          element.x2 += xDelta
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

    const s = 8

    this.T_resizer.x1 = x + w/2 - s/2
    this.T_resizer.x2 = this.T_resizer.x1 + s
    this.T_resizer.y1 = y - s/2
    this.T_resizer.y2 = this.T_resizer.y1 + s

    this.TL_resizer.x1 = x - s/2
    this.TL_resizer.x2 = this.TL_resizer.x1 + s
    this.TL_resizer.y1 = y - s/2
    this.TL_resizer.y2 = this.TL_resizer.y1 + s

    this.B_resizer.x1 = x + w/2 - s/2
    this.B_resizer.x2 = this.B_resizer.x1 + s
    this.B_resizer.y1 = y + h - s/2
    this.B_resizer.y2 = this.B_resizer.y1 + s

    this.BL_resizer.x1 = x - s/2
    this.BL_resizer.x2 = this.BL_resizer.x1 + s
    this.BL_resizer.y1 = y + h - s/2
    this.BL_resizer.y2 = this.BL_resizer.y1 + s

    this.L_resizer.x1 = x - s/2
    this.L_resizer.x2 = this.L_resizer.x1 + s
    this.L_resizer.y1 = y + h/2 - s/2
    this.L_resizer.y2 = this.L_resizer.y1 + s

    this.R_resizer.x1 = x + w - s/2
    this.R_resizer.x2 = this.R_resizer.x1 + s
    this.R_resizer.y1 = y + h/2 - s/2
    this.R_resizer.y2 = this.R_resizer.y1 + s

    this.TR_resizer.x1 = x + w - s/2
    this.TR_resizer.x2 = this.TR_resizer.x1 + s
    this.TR_resizer.y1 = y - s/2
    this.TR_resizer.y2 = this.TR_resizer.y1 + s

    this.BR_resizer.x1 = x + w - s/2
    this.BR_resizer.x2 = this.BR_resizer.x1 + s
    this.BR_resizer.y1 = y + h - s/2
    this.BR_resizer.y2 = this.BR_resizer.y1 + s
  }

  translate = (x: number, y: number) => {
    super.translate(x, y)

    this.L_resizer.x1 += x
    this.L_resizer.x2 += x
    this.L_resizer.y1 += y
    this.L_resizer.y2 += y

    this.TL_resizer.x1 += x
    this.TL_resizer.x2 += x
    this.TL_resizer.y1 += y
    this.TL_resizer.y2 += y

    this.BL_resizer.x1 += x
    this.BL_resizer.x2 += x
    this.BL_resizer.y1 += y
    this.BL_resizer.y2 += y

    this.R_resizer.x1 += x
    this.R_resizer.x2 += x
    this.R_resizer.y1 += y
    this.R_resizer.y2 += y

    this.TR_resizer.x1 += x
    this.TR_resizer.x2 += x
    this.TR_resizer.y1 += y
    this.TR_resizer.y2 += y

    this.BR_resizer.x1 += x
    this.BR_resizer.x2 += x
    this.BR_resizer.y1 += y
    this.BR_resizer.y2 += y

    this.T_resizer.x1 += x
    this.T_resizer.x2 += x
    this.T_resizer.y1 += y
    this.T_resizer.y2 += y

    this.B_resizer.x1 += x
    this.B_resizer.x2 += x
    this.B_resizer.y1 += y
    this.B_resizer.y2 += y
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

  resizerCapture = (point: Point) => {
    const data = [
      {
        coord: this.T_resizer,
        name: 'top',
      },
      {
        coord: this.L_resizer,
        name: 'left',
      },
      {
        coord: this.TL_resizer,
        name: 'top-left',
      },
      {
        coord: this.B_resizer,
        name: 'bottom',
      },
      {
        coord: this.BL_resizer,
        name: 'bottom-left',
      },
      {
        coord: this.R_resizer,
        name: 'right',
      },
      {
        coord: this.TR_resizer,
        name: 'top-right',
      },
      {
        coord: this.BR_resizer,
        name: 'bottom-right',
      },
    ]

    for (const item of data) {
      const resizer: Rectangle = item.coord
      const position: string = item.name
      if (point.x >= resizer.x1 && point.x <= resizer.x2 && point.y >= resizer.y1 && point.y <= resizer.y2) {
        this.is_resizing = position
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
      [this.T_resizer, 'top'],
      [this.L_resizer, 'left'],
      [this.TL_resizer, 'top-left'],
      [this.B_resizer, 'bottom'],
      [this.BL_resizer, 'bottom-left'],
      [this.R_resizer, 'right'],
      [this.TR_resizer, 'top-right'],
      [this.BR_resizer, 'bottom-right'],
    ].forEach(([resizer, position]) => {
      if (this.is_resizing === position) {
        ctx.fillRect(
          (engine.viewport.x1 + (resizer as Rectangle).x1) * engine.scale,
          (engine.viewport.y1 + (resizer as Rectangle).y1) * engine.scale,
          ((resizer as Rectangle).x2 - (resizer as Rectangle).x1) * engine.scale,
          ((resizer as Rectangle).y2 - (resizer as Rectangle).y1) * engine.scale,
        )
      } else {
        ctx.clearRect(
          (engine.viewport.x1 + (resizer as Rectangle).x1) * engine.scale,
          (engine.viewport.y1 + (resizer as Rectangle).y1) * engine.scale,
          ((resizer as Rectangle).x2 - (resizer as Rectangle).x1) * engine.scale,
          ((resizer as Rectangle).y2 - (resizer as Rectangle).y1) * engine.scale,
        )
        ctx.strokeRect(
          (engine.viewport.x1 + (resizer as Rectangle).x1) * engine.scale,
          (engine.viewport.y1 + (resizer as Rectangle).y1) * engine.scale,
          ((resizer as Rectangle).x2 - (resizer as Rectangle).x1) * engine.scale,
          ((resizer as Rectangle).y2 - (resizer as Rectangle).y1) * engine.scale,
        )
      }
    })

  }
}

export default SelectionEntity
