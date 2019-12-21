import Rectangle from '../atoms/Rectangle'

class SelectionEntity extends Rectangle {
  constructor() {
    super()
    this.is_resizing = false
    this.left_resizer = new Rectangle()
    this.right_resizer = new Rectangle()
    this.top_resizer = new Rectangle()
    this.bottom_resizer = new Rectangle()
  }

  mouseDown = (canvas) => {
    if (this.is_resizing) {
      return
    }

    this.x1 = canvas.mouse.coordinates.x1 / canvas.scale - canvas.viewport.x1
    this.y1 = canvas.mouse.coordinates.y1 / canvas.scale - canvas.viewport.y1
    this.x2 = this.x1 + (canvas.mouse.coordinates.x2 - canvas.mouse.coordinates.x1) / canvas.scale
    this.y2 = this.y1 + (canvas.mouse.coordinates.y2 - canvas.mouse.coordinates.y1) / canvas.scale
    this.updateSelected(canvas, true)
    this.updateResizers()
  }

  mouseUp = (canvas) => {
    this.is_resizing = false
  }

  mouseMove = (canvas, xDelta, yDelta) => {
    switch (this.is_resizing) {

      case 'top': {
        if (yDelta !== 0) {
          canvas.elements.forEachSelected((element) => {
            element.y1 += yDelta
          })
          this.y1 += yDelta
          this.updateResizers()
        }
        break
      }

      case 'bottom': {
        if (yDelta !== 0) {
          canvas.elements.forEachSelected((element) => {
            element.y2 += yDelta
          })
          this.y2 += yDelta
          this.updateResizers()
        }
        break
      }

      case 'left': {
        if (xDelta !== 0) {
          canvas.elements.forEachSelected((element) => {
            element.x1 += xDelta
          })
          this.x1 += xDelta
          this.updateResizers()
        }
        break
      }

      case 'right': {
        if (xDelta !== 0) {
          canvas.elements.forEachSelected((element) => {
            element.x2 += xDelta
          })
          this.x2 += xDelta
          this.updateResizers()
        }
        break
      }

      default: {
        this.updateSelected(canvas, true)
        this.updateResizers()
        break
      }
    }
  }

  updateSelected = (canvas, clearPrevious) => {
    this.x1 = (canvas.mouse.coordinates.x1 > canvas.mouse.coordinates.x2 ? canvas.mouse.coordinates.x2 : canvas.mouse.coordinates.x1) / canvas.scale - canvas.viewport.x1
    this.y1 = (canvas.mouse.coordinates.y1 > canvas.mouse.coordinates.y2 ? canvas.mouse.coordinates.y2 : canvas.mouse.coordinates.y1) / canvas.scale - canvas.viewport.y1
    this.x2 = this.x1 + (canvas.mouse.coordinates.x1 > canvas.mouse.coordinates.x2 ? (canvas.mouse.coordinates.x1 - canvas.mouse.coordinates.x2) : (canvas.mouse.coordinates.x2 - canvas.mouse.coordinates.x1)) / canvas.scale
    this.y2 = this.y1 + (canvas.mouse.coordinates.y1 > canvas.mouse.coordinates.y2 ? (canvas.mouse.coordinates.y1 - canvas.mouse.coordinates.y2) : (canvas.mouse.coordinates.y2 - canvas.mouse.coordinates.y1)) / canvas.scale

    canvas.elements.updateSelected(this, clearPrevious)
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

    this.top_resizer.x1 = x + w/2 - s/2
    this.top_resizer.x2 = this.top_resizer.x1 + s
    this.top_resizer.y1 = y - s/2
    this.top_resizer.y2 = this.top_resizer.y1 + s

    this.bottom_resizer.x1 = x + w/2 - s/2
    this.bottom_resizer.x2 = this.bottom_resizer.x1 + s
    this.bottom_resizer.y1 = y + h - s/2
    this.bottom_resizer.y2 = this.bottom_resizer.y1 + s


    this.left_resizer.x1 = x - s/2
    this.left_resizer.x2 = this.left_resizer.x1 + s
    this.left_resizer.y1 = y + h/2 - s/2
    this.left_resizer.y2 = this.left_resizer.y1 + s


    this.right_resizer.x1 = x + w - s/2
    this.right_resizer.x2 = this.right_resizer.x1 + s
    this.right_resizer.y1 = y + h/2 - s/2
    this.right_resizer.y2 = this.right_resizer.y1 + s
  }

  translate = (x, y) => {
    super.translate(x, y)

    this.left_resizer.x1 += x
    this.left_resizer.x2 += x
    this.left_resizer.y1 += y
    this.left_resizer.y2 += y

    this.right_resizer.x1 += x
    this.right_resizer.x2 += x
    this.right_resizer.y1 += y
    this.right_resizer.y2 += y

    this.top_resizer.x1 += x
    this.top_resizer.x2 += x
    this.top_resizer.y1 += y
    this.top_resizer.y2 += y

    this.bottom_resizer.x1 += x
    this.bottom_resizer.x2 += x
    this.bottom_resizer.y1 += y
    this.bottom_resizer.y2 += y
  }

  compressSelected = (canvas) => {
    let x1 = undefined
    let y1 = undefined
    let x2 = undefined
    let y2 = undefined
    canvas.elements.forEachSelected((element) => {
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
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  selectionCapture = (point) => {
    return point.x >= this.x1 && point.x <= this.x2 && point.y >= this.y1 && point.y <= this.y2;
  }

  resizerCapture = (point) => {
    const left_capture = point.x >= this.left_resizer.x1 && point.x <= this.left_resizer.x2 && point.y >= this.left_resizer.y1 && point.y <= this.left_resizer.y2;
    if (left_capture) {
      this.is_resizing = 'left'
      return true
    }
    const right_capture = point.x >= this.right_resizer.x1 && point.x <= this.right_resizer.x2 && point.y >= this.right_resizer.y1 && point.y <= this.right_resizer.y2;
    if (right_capture) {
      this.is_resizing = 'right'
      return true
    }
    const bottom_capture = point.x >= this.bottom_resizer.x1 && point.x <= this.bottom_resizer.x2 && point.y >= this.bottom_resizer.y1 && point.y <= this.bottom_resizer.y2;
    if (bottom_capture) {
      this.is_resizing = 'bottom'
      return true
    }
    const top_capture = point.x >= this.top_resizer.x1 && point.x <= this.top_resizer.x2 && point.y >= this.top_resizer.y1 && point.y <= this.top_resizer.y2;
    if (top_capture) {
      this.is_resizing = 'top'
      return true
    }

    return false
  }

  draw(ctx, canvas) {
    if (canvas.mouse.currentEvent === 'selection') {
      return
    }

    if (this.x1 === undefined) {
      return
    }

    ctx.strokeStyle = "black";
    ctx.setLineDash([4 * canvas.scale, 4 * canvas.scale]);
    const x = (canvas.viewport.x1 + this.x1 - 3) * canvas.scale
    const y = (canvas.viewport.y1 + this.y1 - 3) * canvas.scale
    const w = (this.x2 - this.x1 + 6) * canvas.scale
    const h = (this.y2 - this.y1 + 6) * canvas.scale
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    [
      [this.top_resizer, 'top'],
      [this.bottom_resizer, 'bottom'],
      [this.left_resizer, 'left'],
      [this.right_resizer, 'right'],
    ].forEach(([resizer, position]) => {
      if (this.is_resizing === position) {
        ctx.fillRect(
          (canvas.viewport.x1 + resizer.x1) * canvas.scale,
          (canvas.viewport.y1 + resizer.y1) * canvas.scale,
          (resizer.x2 - resizer.x1) * canvas.scale,
          (resizer.y2 - resizer.y1) * canvas.scale,
        )
      } else {
        ctx.clearRect(
          (canvas.viewport.x1 + resizer.x1) * canvas.scale,
          (canvas.viewport.y1 + resizer.y1) * canvas.scale,
          (resizer.x2 - resizer.x1) * canvas.scale,
          (resizer.y2 - resizer.y1) * canvas.scale,
        )
        ctx.strokeRect(
          (canvas.viewport.x1 + resizer.x1) * canvas.scale,
          (canvas.viewport.y1 + resizer.y1) * canvas.scale,
          (resizer.x2 - resizer.x1) * canvas.scale,
          (resizer.y2 - resizer.y1) * canvas.scale,
        )
      }
    })

  }
}

export default SelectionEntity
