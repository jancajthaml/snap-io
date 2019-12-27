import React from 'react'

import Engine from '../Engine'
import Rectangle from '../../atoms/Rectangle'
import Point from '../../atoms/Point'

import { MODE_SELECTION } from '../../global/constants'


const RESIZER_SIZE = 10 as const

interface IProps {
  engine: Engine;
}


class ResizerHandle extends Rectangle {
  name: string;

  constructor(name: string) {
    super()
    this.name = name
  }
}

class SelectionBounds extends Rectangle {

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
    this.L_resizer = new ResizerHandle('left')
    this.TL_resizer = new ResizerHandle('top-left')
    this.BL_resizer = new ResizerHandle('bottom-left')
    this.R_resizer = new ResizerHandle('right')
    this.TR_resizer = new ResizerHandle('top-right')
    this.BR_resizer = new ResizerHandle('bottom-right')
    this.T_resizer = new ResizerHandle('top')
    this.B_resizer = new ResizerHandle('bottom')
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

  updateResizers = () => {
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
}


class SelectionEntity extends React.PureComponent<IProps> {

  bounds: SelectionBounds;
  is_resizing?: string;

  constructor(props: IProps) {
    super(props)
    // FIXME this does not update if entity is recycled, probably better to use a hook here
    this.bounds = new SelectionBounds()

  }

  componentDidMount() {
    this.props.engine.selection = this
    // FIXME this lags application if too many entities are on screen (>10k)
    //this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.selection = undefined
    //this.props.engine.removeEntity(this)
  }


  onMouseMove = (xDelta: number, yDelta: number) => {
    const engine = this.props.engine

    if (this.is_resizing === undefined) {
      const { viewport, currentMouseCoordinates } = engine
      this.updateSelected(viewport, currentMouseCoordinates, true)
      //this.updateSelected(engine, true)
      this.bounds.updateResizers()
      return
    }

    let normalizedResizing: string | undefined = undefined

    switch (this.is_resizing) {

      case this.bounds.T_resizer.name: {
        if (yDelta != 0) {
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
        const sel_h = (this.bounds.y2 - this.bounds.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.bounds.y1 += yDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.TL_resizer.name: {

        const sel_w = (this.bounds.x2 - this.bounds.x1)
        const sel_h = (this.bounds.y2 - this.bounds.y1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.bounds.x1) / sel_w

          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.bounds.y1 += yDelta
        this.bounds.x1 += xDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.TR_resizer.name: {
        const sel_w = (this.bounds.x2 - this.bounds.x1)
        const sel_h = (this.bounds.y2 - this.bounds.y1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.bounds.x1) / sel_w

          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.bounds.y1 += yDelta
        this.bounds.x2 += xDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.B_resizer.name: {
        const sel_h = (this.bounds.y2 - this.bounds.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.bounds.y2 += yDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.BL_resizer.name: {
        const sel_h = (this.bounds.y2 - this.bounds.y1)
        const sel_w = (this.bounds.x2 - this.bounds.x1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.bounds.x1) / sel_w

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.bounds.y2 += yDelta
        this.bounds.x1 += xDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.BR_resizer.name: {
        const sel_w = (this.bounds.x2 - this.bounds.x1)
        const sel_h = (this.bounds.y2 - this.bounds.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.bounds.y1) / sel_h

          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.bounds.x1) / sel_w

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.bounds.y2 += yDelta
        this.bounds.x2 += xDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.L_resizer.name: {
        const sel_w = (this.bounds.x2 - this.bounds.x1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.bounds.x1 - this.bounds.x1) / sel_w

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
        })
        this.bounds.x1 += xDelta
        this.bounds.updateResizers()
        break
      }

      case this.bounds.R_resizer.name: {
        const sel_w = (this.bounds.x2 - this.bounds.x1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.bounds.x1) / sel_w

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
        })
        this.bounds.x2 += xDelta
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
    const engine = this.props.engine
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

    this.props.engine.updateSelected(this.bounds, clearPrevious)
  }

  selectionCapture = (point: Point) => {
    return point.x >= this.bounds.x1 && point.x <= this.bounds.x2 && point.y >= this.bounds.y1 && point.y <= this.bounds.y2;
  }

  resizerCapture = (point: Point) => {
    const { viewport } = this.props.engine
    const data = [
      this.bounds.T_resizer,
      this.bounds.L_resizer,
      this.bounds.TL_resizer,
      this.bounds.B_resizer,
      this.bounds.BL_resizer,
      this.bounds.R_resizer,
      this.bounds.TR_resizer,
      this.bounds.BR_resizer,
    ] as ResizerHandle[]

    const pointScaled = point.multiply(viewport.z)

    for (const resizer of data) {
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
    }
    return false
  }

  compressSelected = () => {
    let x1: number | undefined = undefined
    let y1: number | undefined = undefined
    let x2: number | undefined = undefined
    let y2: number | undefined = undefined
    this.props.engine.selected.forEach((element: any) => {
      if (x1 === undefined || x1 > element.bounds.x1) {
        x1 = element.bounds.x1
      }
      if (y1 === undefined || y1 > element.bounds.y1) {
        y1 = element.bounds.y1
      }
      if (x2 === undefined || x2 < element.bounds.x2) {
        x2 = element.bounds.x2
      }
      if (y2 === undefined || y2 < element.bounds.y2) {
        y2 = element.bounds.y2
      }
    })
    this.bounds.x1 = x1 || 0
    this.bounds.y1 = y1 || 0
    this.bounds.x2 = x2 || 0
    this.bounds.y2 = y2 || 0
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
    const { currentMouseEvent, viewport } = this.props.engine

    if (currentMouseEvent !== MODE_SELECTION) {
      this.drawSelectedBox(ctx, viewport)
    } else {
      this.drawSelectionBox(ctx, viewport)
    }
  }

  render() {
    return <React.Fragment />
  }
}

export default SelectionEntity


/*
import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import Engine from './Engine'
import { MODE_SELECTION } from '../global/constants'

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
    this.x1 = engine.currentMouseCoordinates.x1 / engine.viewport.z - engine.viewport.x1
    this.y1 = engine.currentMouseCoordinates.y1 / engine.viewport.z - engine.viewport.y1
    this.x2 = this.x1 + (engine.currentMouseCoordinates.x2 - engine.currentMouseCoordinates.x1) / engine.viewport.z
    this.y2 = this.y1 + (engine.currentMouseCoordinates.y2 - engine.currentMouseCoordinates.y1) / engine.viewport.z
    this.updateSelected(engine, true)
    this.updateResizers()
  }

  mouseUp = () => {
    this.is_resizing = undefined
  }

  mouseMove = (engine: Engine, xDelta: number, yDelta: number) => {

    if (this.is_resizing === undefined) {
      this.updateSelected(engine, true)
      this.updateResizers()
      return
    }

    let normalizedResizing: string | undefined = undefined

    switch (this.is_resizing) {

      case this.T_resizer.name: {
        if (yDelta != 0) {
          normalizedResizing = this.T_resizer.name
        }
        break
      }
      case this.TL_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.TL_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.T_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.L_resizer.name
        }
        break
      }
      case this.TR_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.TR_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.T_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.R_resizer.name
        }
        break
      }
      case this.B_resizer.name: {
        if (yDelta != 0) {
          normalizedResizing = this.B_resizer.name
        }
        break
      }
      case this.BL_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.BL_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.B_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.L_resizer.name
        }
        break
      }
      case this.BR_resizer.name: {
        if (yDelta != 0 && xDelta != 0) {
          normalizedResizing = this.BR_resizer.name
        } else if (yDelta != 0) {
          normalizedResizing = this.B_resizer.name
        } else if (xDelta != 0) {
          normalizedResizing = this.R_resizer.name
        }
        break
      }
      case this.L_resizer.name: {
        if (xDelta != 0) {
          normalizedResizing = this.L_resizer.name
        }
        break
      }
      case this.R_resizer.name: {
        if (xDelta != 0) {
          normalizedResizing = this.R_resizer.name
        }
        break
      }
    }

    switch (normalizedResizing) {

      case this.T_resizer.name: {
        const sel_h = (this.y2 - this.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.y1 += yDelta
        this.updateResizers()
        break
      }

      case this.TL_resizer.name: {

        const sel_w = (this.x2 - this.x1)
        const sel_h = (this.y2 - this.y1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.x1) / sel_w

          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.y1 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.TR_resizer.name: {
        const sel_w = (this.x2 - this.x1)
        const sel_h = (this.y2 - this.y1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.x1) / sel_w

          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
          element.bounds.y1 += yDelta * (1-y_percentage)
          element.bounds.y2 += yDelta * (1-(h_percentage + y_percentage))
        })
        this.y1 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case this.B_resizer.name: {
        const sel_h = (this.y2 - this.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.updateResizers()
        break
      }

      case this.BL_resizer.name: {
        const sel_h = (this.y2 - this.y1)
        const sel_w = (this.x2 - this.x1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.x1) / sel_w

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.BR_resizer.name: {
        const sel_w = (this.x2 - this.x1)
        const sel_h = (this.y2 - this.y1)

        engine.selected.forEach((element: any) => {
          const ele_h = (element.bounds.y2 - element.bounds.y1)
          const h_percentage = ele_h === 0 ? 1 : ele_h / sel_h
          const y_percentage = ele_h === 0 ? 0 : (element.bounds.y1 - this.y1) / sel_h

          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.x1) / sel_w

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
          element.bounds.y1 += yDelta * y_percentage
          element.bounds.y2 += yDelta * (h_percentage + y_percentage)
        })
        this.y2 += yDelta
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      case this.L_resizer.name: {
        const sel_w = (this.x2 - this.x1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w / sel_w
          const x_percentage = (element.bounds.x1 - this.x1) / sel_w

          element.bounds.x1 += xDelta * (1-x_percentage)
          element.bounds.x2 += xDelta * (1-(w_percentage + x_percentage))
        })
        this.x1 += xDelta
        this.updateResizers()
        break
      }

      case this.R_resizer.name: {
        const sel_w = (this.x2 - this.x1)

        engine.selected.forEach((element: any) => {
          const ele_w = (element.bounds.x2 - element.bounds.x1)
          const w_percentage = ele_w === 0 ? 1 : ele_w / sel_w
          const x_percentage = ele_w === 0 ? 0 : (element.bounds.x1 - this.x1) / sel_w

          element.bounds.x1 += xDelta * x_percentage
          element.bounds.x2 += xDelta * (w_percentage + x_percentage)
        })
        this.x2 += xDelta
        this.updateResizers()
        break
      }

      default: {
        break
      }
    }
  }

  updateSelected = (engine: Engine, clearPrevious: boolean) => {
    this.x1 = (engine.currentMouseCoordinates.x1 > engine.currentMouseCoordinates.x2
      ? engine.currentMouseCoordinates.x2
      : engine.currentMouseCoordinates.x1) / engine.viewport.z - engine.viewport.x1
    this.y1 = (engine.currentMouseCoordinates.y1 > engine.currentMouseCoordinates.y2
      ? engine.currentMouseCoordinates.y2
      : engine.currentMouseCoordinates.y1) / engine.viewport.z - engine.viewport.y1
    this.x2 = this.x1 + (
      engine.currentMouseCoordinates.x1 > engine.currentMouseCoordinates.x2
        ? (engine.currentMouseCoordinates.x1 - engine.currentMouseCoordinates.x2)
        : (engine.currentMouseCoordinates.x2 - engine.currentMouseCoordinates.x1)
      ) / engine.viewport.z
    this.y2 = this.y1 + (
      engine.currentMouseCoordinates.y1 > engine.currentMouseCoordinates.y2
        ? (engine.currentMouseCoordinates.y1 - engine.currentMouseCoordinates.y2)
        : (engine.currentMouseCoordinates.y2 - engine.currentMouseCoordinates.y1)
      ) / engine.viewport.z

    engine.updateSelected(this, clearPrevious)
  }

  updateResizers = () => {
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
    engine.selected.forEach((element: any) => {
      if (x1 === undefined || x1 > element.bounds.x1) {
        x1 = element.bounds.x1
      }
      if (y1 === undefined || y1 > element.bounds.y1) {
        y1 = element.bounds.y1
      }
      if (x2 === undefined || x2 < element.bounds.x2) {
        x2 = element.bounds.x2
      }
      if (y2 === undefined || y2 < element.bounds.y2) {
        y2 = element.bounds.y2
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

    const pointScaled = point.multiply(engine.viewport.z)

    for (const resizer of data) {
      const w = (resizer.x2 - resizer.x1) * engine.viewport.z
      const h = (resizer.y2 - resizer.y1) * engine.viewport.z

      const x1 = (resizer.x1 * engine.viewport.z) + (w - RESIZER_SIZE)/2
      const y1 = (resizer.y1 * engine.viewport.z) + (h - RESIZER_SIZE)/2
      const x2 = x1 + (resizer.x2 - resizer.x1)
      const y2 = y1 + (resizer.y2 - resizer.y1)

      if (pointScaled.x >= x1 && pointScaled.x <= x2 && pointScaled.y >= y1 && pointScaled.y <= y2) {
        this.is_resizing = resizer.name
        return true
      }
    }
    return false
  }

  drawSelectionBox(ctx: CanvasRenderingContext2D, engine: Engine) {
    if (engine.currentMouseEvent !== MODE_SELECTION) {
      return
    }

    ctx.strokeStyle = "black";
    ctx.strokeRect(
      (engine.viewport.x1 + engine.selection.x1) * engine.viewport.z - 1.5,
      (engine.viewport.y1 + engine.selection.y1) * engine.viewport.z - 1.5,
      (engine.selection.x2 - engine.selection.x1) * engine.viewport.z + 3,
      (engine.selection.y2 - engine.selection.y1) * engine.viewport.z + 3,
    );
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      (engine.viewport.x1 + engine.selection.x1) * engine.viewport.z - 0.5,
      (engine.viewport.y1 + engine.selection.y1) * engine.viewport.z - 0.5,
      (engine.selection.x2 - engine.selection.x1) * engine.viewport.z + 1,
      (engine.selection.y2 - engine.selection.y1) * engine.viewport.z + 1,
    );
    ctx.fillStyle = "rgba(0,0,0,.3)"
    ctx.fillRect(
      (engine.viewport.x1 + engine.selection.x1) * engine.viewport.z,
      (engine.viewport.y1 + engine.selection.y1) * engine.viewport.z,
      (engine.selection.x2 - engine.selection.x1) * engine.viewport.z,
      (engine.selection.y2 - engine.selection.y1) * engine.viewport.z,
    );

  }

  drawSelectedBox(ctx: CanvasRenderingContext2D, engine: Engine) {
    if (engine.currentMouseEvent === MODE_SELECTION) {
      return
    }

    if (this.x1 === this.x2 || this.y1 === this.y2) {
      return
    }

    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.setLineDash([4 * engine.viewport.z, 4 * engine.viewport.z]);

    const x = (engine.viewport.x1 + this.x1 - 3) * engine.viewport.z
    const y = (engine.viewport.y1 + this.y1 - 3) * engine.viewport.z
    const w = (this.x2 - this.x1 + 6) * engine.viewport.z
    const h = (this.y2 - this.y1 + 6) * engine.viewport.z
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
      const w = (resizer.x2 - resizer.x1) * engine.viewport.z
      const h = (resizer.y2 - resizer.y1) * engine.viewport.z

      if (this.is_resizing === resizer.name) {
        ctx.fillRect(
          ((engine.viewport.x1 + resizer.x1) * engine.viewport.z) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      } else {
        ctx.clearRect(
          ((engine.viewport.x1 + resizer.x1) * engine.viewport.z) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )

        ctx.strokeRect(
          ((engine.viewport.x1 + resizer.x1) * engine.viewport.z) + (w - RESIZER_SIZE)/2,
          ((engine.viewport.y1 + resizer.y1) * engine.viewport.z) + (h - RESIZER_SIZE)/2,
          (resizer.x2 - resizer.x1),
          (resizer.y2 - resizer.y1),
        )
      }
    })

  }
}

export default SelectionEntity


*/
