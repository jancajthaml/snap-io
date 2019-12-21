import Layer from '../components/Layer'

class ElementsLayer extends Layer {
  draw = (canvas: any) => {
    if (!this.dirty) {
      return
    }
    const ctx = (this.ctx as CanvasRenderingContext2D)
    ctx.clearRect(0, 0, this.width, this.height)
    canvas.elements.forEachVisible((element: any) => {
      element.draw(ctx, canvas)
    })
    canvas.selection.draw(ctx, canvas)
    this.dirty = false
  }
}

export default ElementsLayer
