import Rectangle from '../atoms/Rectangle'
import Engine from './Engine'

class RectangleEntity extends Rectangle {

  color: string;
  selected: boolean;

  constructor(x: number, y: number, w: number, h: number, color: string) {
    super(x,y,w,h)
    this.color = color
    this.selected = false
  }

  drawSimple(ctx: CanvasRenderingContext2D, engine: Engine, selected: boolean) {
    if (selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.color
    }
    const x = (engine.viewport.x1 + this.x1) * engine.scale
    const y = (engine.viewport.y1 + this.y1) * engine.scale
    const w = (this.x2 - this.x1) * engine.scale
    const h = (this.y2 - this.y1) * engine.scale

    ctx.fillRect(x, y, w, h);
  }

  drawDetail(ctx: CanvasRenderingContext2D, engine: Engine, selected: boolean) {
    if (selected) {
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    } else {
      ctx.fillStyle = this.color
      ctx.strokeStyle = this.color
    }
    const x = (engine.viewport.x1 + this.x1) * engine.scale
    const y = (engine.viewport.y1 + this.y1) * engine.scale
    const w = (this.x2 - this.x1) * engine.scale
    const h = (this.y2 - this.y1) * engine.scale

    const offset = 3 * engine.scale
    ctx.fillRect(x + offset, y + offset, w - 2*offset, h - 2*offset);
    ctx.strokeRect(x, y, w, h);
  }

  draw(ctx: CanvasRenderingContext2D, engine: Engine) {
    if (engine.scale <= 0.4) {
      this.drawSimple(ctx, engine, this.selected)
    } else {
      this.drawDetail(ctx, engine, this.selected)
    }
  }
}

export default RectangleEntity
