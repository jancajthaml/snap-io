
import Rectangle from '../../atoms/Rectangle'
import ResizerHandle from './ResizerHandle'
import { RESIZER_SIZE } from './constants'

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

export default SelectionBounds
