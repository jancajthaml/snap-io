import Layer from '../components/Layer'
import Engine from './Engine'

class OverlayLayer extends Layer {
  draw = (engine: Engine) => {
    if (!this.dirty) {
      return
    }

    const ctx = (this.ctx as CanvasRenderingContext2D)

    ctx.clearRect(0, 0, this.width, this.height)

    if (engine.mouse.currentEvent === 'selection') {
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        (engine.viewport.x1 + engine.selection.x1) * engine.scale - 1.5,
        (engine.viewport.y1 + engine.selection.y1) * engine.scale - 1.5,
        (engine.selection.x2 - engine.selection.x1) * engine.scale + 3,
        (engine.selection.y2 - engine.selection.y1) * engine.scale + 3,
      );
      ctx.strokeStyle = "white";
      ctx.strokeRect(
        (engine.viewport.x1 + engine.selection.x1) * engine.scale - 0.5,
        (engine.viewport.y1 + engine.selection.y1) * engine.scale - 0.5,
        (engine.selection.x2 - engine.selection.x1) * engine.scale + 1,
        (engine.selection.y2 - engine.selection.y1) * engine.scale + 1,
      );
      ctx.fillStyle = "rgba(0,0,0,.3)"
      ctx.fillRect(
        (engine.viewport.x1 + engine.selection.x1) * engine.scale,
        (engine.viewport.y1 + engine.selection.y1) * engine.scale,
        (engine.selection.x2 - engine.selection.x1) * engine.scale,
        (engine.selection.y2 - engine.selection.y1) * engine.scale,
      );
    }

    this.dirty = false
  }
}

export default OverlayLayer
