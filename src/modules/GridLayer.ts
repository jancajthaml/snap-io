import Layer from '../components/Layer'

class GridLayer extends Layer {
  draw = (canvas: any) => {
    if (!this.dirty) {
      return
    }

    const ctx = (this.ctx as CanvasRenderingContext2D)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.width, this.height);

    const p = 10 * canvas.scale
    const xOffset = (canvas.viewport.x1 * canvas.scale) % p
    const yOffset = (canvas.viewport.y1 * canvas.scale) % p
    ctx.lineWidth = (canvas.scale / 3) + 0.2;

    ctx.beginPath();
    for (let x = xOffset + 0.5; x <= this.width + p; x += p) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = yOffset + 0.5; y <= this.height + p; y += p) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    this.dirty = false
  }
}

export default GridLayer
