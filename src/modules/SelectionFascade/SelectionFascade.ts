import Engine from '../Engine'
import Rectangle from '../../atoms/Rectangle'
import Point from '../../atoms/Point'

import { MODE_SELECTION } from '../../global/constants'
import ResizerHandle from './ResizerHandle'
import SelectionBounds from './SelectionBounds'
import { RESIZER_SIZE } from './constants'

class SelectionFascade  {

  bounds: SelectionBounds;
  is_resizing?: string;
  engine: Engine;

  constructor(engine: Engine) {
    this.bounds = new SelectionBounds()
    this.engine = engine
  }

  onMouseMove = () => {
    const engine = this.engine

    if (this.is_resizing === undefined) {
      const { viewport, currentMouseCoordinates } = engine
      this.updateSelected(viewport, currentMouseCoordinates, true)
      this.bounds.updateResizers()
      return
    }
  }

  onResize = (xDelta: number, yDelta: number) => {
    if (this.is_resizing === undefined) {
      return
    }

    const engine = this.engine
    const { gridSize } = engine

    let normalizedResizing: string | undefined = undefined

    switch (this.is_resizing) {

      case this.bounds.T_resizer.name: {
        if (yDelta !== 0) {
          normalizedResizing = this.bounds.T_resizer.name
        }
        break
      }
      case this.bounds.TL_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.bounds.TL_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.bounds.T_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.bounds.L_resizer.name
        }
        break
      }
      case this.bounds.TR_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.bounds.TR_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.bounds.T_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.bounds.R_resizer.name
        }
        break
      }
      case this.bounds.B_resizer.name: {
        if (yDelta != 0) {
          normalizedResizing = this.bounds.B_resizer.name
        }
        break
      }
      case this.bounds.BL_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.bounds.BL_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.bounds.B_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.bounds.L_resizer.name
        }
        break
      }
      case this.bounds.BR_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.bounds.BR_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.bounds.B_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.bounds.R_resizer.name
        }
        break
      }
      case this.bounds.L_resizer.name: {
        if (xDelta != 0) {
          normalizedResizing = this.bounds.L_resizer.name
        }
        break
      }
      case this.bounds.R_resizer.name: {
        if (xDelta != 0) {
          normalizedResizing = this.bounds.R_resizer.name
        }
        break
      }
    }

    switch (normalizedResizing) {

      case this.bounds.T_resizer.name: {
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const y1 = element.props.y + yDelta * (1 - y_percentage)
          const y2 = element.props.y + element.props.height + yDelta * (1 - (h_percentage + y_percentage))

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y1 += yDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.TL_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (ele_x - this.bounds.x1) / sel_w

          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const x1 = element.props.x + xDelta * (1-x_percentage)
          const x2 = element.props.x + element.props.width + xDelta * (1-(w_percentage + x_percentage))

          element.props.x = x1
          element.props.width = x2 - x1

          const y1 = element.props.y + yDelta * (1-y_percentage)
          const y2 = element.props.y + element.props.height + yDelta * (1-(h_percentage + y_percentage))

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y1 += yDelta * gridSize
        this.bounds.x1 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.TR_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (ele_x - this.bounds.x1) / sel_w

          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const x1 = element.props.x + xDelta * x_percentage
          const x2 = element.props.x + element.props.width + xDelta * (w_percentage + x_percentage)

          element.props.x = x1
          element.props.width = x2 - x1

          const y1 = element.props.y + yDelta * (1-y_percentage)
          const y2 = element.props.y + element.props.height + yDelta * (1-(h_percentage + y_percentage))

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y1 += yDelta * gridSize
        this.bounds.x2 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.B_resizer.name: {
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const y1 = element.props.y + yDelta * y_percentage
          const y2 = element.props.y + element.props.height + yDelta * (h_percentage + y_percentage)

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y2 += yDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.BL_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (ele_x - this.bounds.x1) / sel_w

          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const x1 = element.props.x + xDelta * (1-x_percentage)
          const x2 = element.props.x + element.props.width + xDelta * (1-(w_percentage + x_percentage))

          element.props.x = x1
          element.props.width = x2 - x1

          const y1 = element.props.y + yDelta * y_percentage
          const y2 = element.props.y + element.props.height + yDelta * (h_percentage + y_percentage)

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y2 += yDelta * gridSize
        this.bounds.x1 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.BR_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1
        const sel_h = this.bounds.y2 - this.bounds.y1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (ele_x - this.bounds.x1) / sel_w

          const ele_h = element.props.height * gridSize
          const ele_y = element.props.y * gridSize
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (ele_y - this.bounds.y1) / sel_h

          const x1 = element.props.x + xDelta * x_percentage
          const x2 = element.props.x + element.props.width + xDelta * (w_percentage + x_percentage)

          element.props.x = x1
          element.props.width = x2 - x1

          const y1 = element.props.y + yDelta * y_percentage
          const y2 = element.props.y + element.props.height + yDelta * (h_percentage + y_percentage)

          element.props.y = y1
          element.props.height = y2 - y1
        })
        this.bounds.y2 += yDelta * gridSize
        this.bounds.x2 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.L_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w / sel_w
          const x_percentage = (ele_x - this.bounds.x1) / sel_w

          const x1 = element.props.x + xDelta * (1-x_percentage)
          const x2 = element.props.x + element.props.width + xDelta * (1-(w_percentage + x_percentage))

          element.props.x = x1
          element.props.width = x2 - x1
        })
        this.bounds.x1 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      case this.bounds.R_resizer.name: {
        const sel_w = this.bounds.x2 - this.bounds.x1

        engine.selected.forEach((element: any) => {
          const ele_w = element.props.width * gridSize
          const ele_x = element.props.x * gridSize
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (ele_x - this.bounds.x1) / sel_w

          const x1 = element.props.x + xDelta * x_percentage
          const x2 = element.props.x + element.props.width + xDelta * (w_percentage + x_percentage)

          element.props.x = x1
          element.props.width = x2 - x1
        })
        this.bounds.x2 += xDelta * gridSize
        this.bounds.updateResizers()
        break
      }

      default: {
        break
      }
    }
  }

  onMouseUp = () => {
    this.is_resizing = undefined
  }

  onMouseDown = () => {
    if (this.is_resizing) {
      return
    }
    const engine = this.engine
    const { viewport, currentMouseCoordinates } = engine

    this.bounds.x1 = currentMouseCoordinates.x1 / viewport.z - viewport.x1
    this.bounds.y1 = currentMouseCoordinates.y1 / viewport.z - viewport.y1
    this.bounds.x2 = this.bounds.x1 + (currentMouseCoordinates.x2 - currentMouseCoordinates.x1) / viewport.z
    this.bounds.y2 = this.bounds.y1 + (currentMouseCoordinates.y2 - currentMouseCoordinates.y1) / viewport.z

    this.updateSelected(viewport, currentMouseCoordinates, true)
    this.bounds.updateResizers()
  }

  updateSelected = (viewport: Rectangle, currentMouseCoordinates: Rectangle, clearPrevious: boolean) => {
    this.bounds.x1 = (currentMouseCoordinates.x1 > currentMouseCoordinates.x2
      ? currentMouseCoordinates.x2
      : currentMouseCoordinates.x1) / viewport.z - viewport.x1
    this.bounds.y1 = (currentMouseCoordinates.y1 > currentMouseCoordinates.y2
      ? currentMouseCoordinates.y2
      : currentMouseCoordinates.y1) / viewport.z - viewport.y1
    this.bounds.x2 = this.bounds.x1 + (
      currentMouseCoordinates.x1 > currentMouseCoordinates.x2
        ? (currentMouseCoordinates.x1 - currentMouseCoordinates.x2)
        : (currentMouseCoordinates.x2 - currentMouseCoordinates.x1)
      ) / viewport.z
    this.bounds.y2 = this.bounds.y1 + (
      currentMouseCoordinates.y1 > currentMouseCoordinates.y2
        ? (currentMouseCoordinates.y1 - currentMouseCoordinates.y2)
        : (currentMouseCoordinates.y2 - currentMouseCoordinates.y1)
      ) / viewport.z

    this.engine.updateSelected(this.bounds, clearPrevious)
  }

  selectionCapture = (point: Point) => {
    return point.x >= this.bounds.x1 && point.x <= this.bounds.x2 && point.y >= this.bounds.y1 && point.y <= this.bounds.y2;
  }

  resizerCapture = (point: Point) => {
    const { viewport } = this.engine
    const pointScaled = point.multiply(viewport.z)

    return [
      this.bounds.T_resizer,
      this.bounds.L_resizer,
      this.bounds.TL_resizer,
      this.bounds.B_resizer,
      this.bounds.BL_resizer,
      this.bounds.R_resizer,
      this.bounds.TR_resizer,
      this.bounds.BR_resizer,
    ].some((resizer) => {
      const w = (resizer.x2 - resizer.x1) * viewport.z
      const h = (resizer.y2 - resizer.y1) * viewport.z

      const x1 = (resizer.x1 * viewport.z) + (w - RESIZER_SIZE)/2
      const y1 = (resizer.y1 * viewport.z) + (h - RESIZER_SIZE)/2
      const x2 = x1 + (resizer.x2 - resizer.x1)
      const y2 = y1 + (resizer.y2 - resizer.y1)

      if (pointScaled.x >= x1 && pointScaled.x <= x2 && pointScaled.y >= y1 && pointScaled.y <= y2) {
        this.is_resizing = resizer.name
        return true
      }
    })
  }

  compressSelected = () => {
    const { selected, gridSize } = this.engine

    let x1: number | undefined = undefined
    let y1: number | undefined = undefined
    let x2: number | undefined = undefined
    let y2: number | undefined = undefined
    selected.forEach((element: any) => {
      if (x1 === undefined || x1 > element.props.x) {
        x1 = element.props.x
      }
      if (y1 === undefined || y1 > element.props.y) {
        y1 = element.props.y
      }
      if (x2 === undefined || x2 < (element.props.x + element.props.width)) {
        x2 = (element.props.x + element.props.width)
      }
      if (y2 === undefined || y2 < (element.props.y + element.props.height)) {
        y2 = (element.props.y + element.props.height)
      }
    })
    this.bounds.x1 = (x1 || 0) * gridSize
    this.bounds.y1 = (y1 || 0) * gridSize
    this.bounds.x2 = (x2 || 0) * gridSize
    this.bounds.y2 = (y2 || 0) * gridSize
  }

  drawSelectionBox(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      (viewport.x1 + this.bounds.x1) * viewport.z - 1.5,
      (viewport.y1 + this.bounds.y1) * viewport.z - 1.5,
      (this.bounds.x2 - this.bounds.x1) * viewport.z + 3,
      (this.bounds.y2 - this.bounds.y1) * viewport.z + 3,
    );
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      (viewport.x1 + this.bounds.x1) * viewport.z - 0.5,
      (viewport.y1 + this.bounds.y1) * viewport.z - 0.5,
      (this.bounds.x2 - this.bounds.x1) * viewport.z + 1,
      (this.bounds.y2 - this.bounds.y1) * viewport.z + 1,
    );
    ctx.fillStyle = "rgba(0,0,0,.3)"
    ctx.fillRect(
      (viewport.x1 + this.bounds.x1) * viewport.z,
      (viewport.y1 + this.bounds.y1) * viewport.z,
      (this.bounds.x2 - this.bounds.x1) * viewport.z,
      (this.bounds.y2 - this.bounds.y1) * viewport.z,
    );
  }

  drawSelectedBox(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
    if (this.bounds.x1 === this.bounds.x2 || this.bounds.y1 === this.bounds.y2) {
      return
    }

    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.setLineDash([4 * viewport.z, 4 * viewport.z]);

    const x = (viewport.x1 + this.bounds.x1 - 3) * viewport.z
    const y = (viewport.y1 + this.bounds.y1 - 3) * viewport.z
    const w = (this.bounds.x2 - this.bounds.x1 + 6) * viewport.z
    const h = (this.bounds.y2 - this.bounds.y1 + 6) * viewport.z
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    [
      this.bounds.T_resizer,
      this.bounds.L_resizer,
      this.bounds.TL_resizer,
      this.bounds.B_resizer,
      this.bounds.BL_resizer,
      this.bounds.R_resizer,
      this.bounds.TR_resizer,
      this.bounds.BR_resizer,
    ].forEach((resizer: ResizerHandle) => {
      const w = (resizer.x2 - resizer.x1) * viewport.z
      const h = (resizer.y2 - resizer.y1) * viewport.z

      if (this.is_resizing === resizer.name) {
        ctx.fillRect(
          ((viewport.x1 + resizer.x1) * viewport.z) + (w - RESIZER_SIZE)/2,
          ((viewport.y1 + resizer.y1) * viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      } else {
        ctx.clearRect(
          ((viewport.x1 + resizer.x1) * viewport.z) + (w - RESIZER_SIZE)/2,
          ((viewport.y1 + resizer.y1) * viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )

        ctx.strokeRect(
          ((viewport.x1 + resizer.x1) * viewport.z) + (w - RESIZER_SIZE)/2,
          ((viewport.y1 + resizer.y1) * viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      }
    })

  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { currentMouseEvent, viewport } = this.engine

    if (currentMouseEvent !== MODE_SELECTION) {
      this.drawSelectedBox(ctx, viewport)
    } else {
      this.drawSelectionBox(ctx, viewport)
    }
  }

  cleanup = () => {
    this.bounds.x1 = 0
    this.bounds.y1 = 0
    this.bounds.x2 = 0
    this.bounds.y2 = 0

    this.engine.selected.forEach((element) => {
      try {
        element.setState({
          selected: false,
        })
      } catch (err) {

      }
    })

    this.engine.selected = []
    this.bounds.updateResizers()
    window.dispatchEvent(new Event('canvas-update-composition'));
  }

}

export default SelectionFascade
