import Layer from '../components/Layer'
import Engine from './Engine'

class ElementsLayer extends Layer {
  draw = (engine: Engine) => {
    if (!this.dirty) {
      return
    }
    const ctx = (this.ctx as CanvasRenderingContext2D)
    ctx.clearRect(0, 0, this.width, this.height)
    engine.elements.forEachVisible((element: any) => {
      element.draw(ctx, engine)
    })
    engine.selection.drawSelectedBox(ctx, engine)
    this.dirty = false
  }
}

export default ElementsLayer
