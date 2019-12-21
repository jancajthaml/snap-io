import Layer from '../components/Layer'

class OverlayLayer extends Layer {
  draw = (canvas: any) => {
    if (!this.dirty) {
      return
    }

    const ctx = (this.ctx as CanvasRenderingContext2D)

    ctx.clearRect(0, 0, this.width, this.height)

    if (canvas.mouse.currentEvent === 'selection') {
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        (canvas.viewport.x1 + canvas.selection.x1) * canvas.scale - 1.5,
        (canvas.viewport.y1 + canvas.selection.y1) * canvas.scale - 1.5,
        (canvas.selection.x2 - canvas.selection.x1) * canvas.scale + 3,
        (canvas.selection.y2 - canvas.selection.y1) * canvas.scale + 3,
      );
      ctx.strokeStyle = "white";
      ctx.strokeRect(
        (canvas.viewport.x1 + canvas.selection.x1) * canvas.scale - 0.5,
        (canvas.viewport.y1 + canvas.selection.y1) * canvas.scale - 0.5,
        (canvas.selection.x2 - canvas.selection.x1) * canvas.scale + 1,
        (canvas.selection.y2 - canvas.selection.y1) * canvas.scale + 1,
      );
      ctx.fillStyle = "rgba(0,0,0,.3)"
      ctx.fillRect(
        (canvas.viewport.x1 + canvas.selection.x1) * canvas.scale,
        (canvas.viewport.y1 + canvas.selection.y1) * canvas.scale,
        (canvas.selection.x2 - canvas.selection.x1) * canvas.scale,
        (canvas.selection.y2 - canvas.selection.y1) * canvas.scale,
      );
    }

    this.dirty = false
  }
}

export default OverlayLayer
