
type RenderingContext =
  | CanvasRenderingContext2D
  | WebGLRenderingContext

type RenderingType =
  | '2d'
  | 'webgl'

class Layer {

  width: number;
  height: number;
  dirty: boolean;
  ctx: RenderingContext;

  constructor(element: HTMLCanvasElement, type: RenderingType, opaque: boolean) {
    this.dirty = false
    switch (type) {
      case undefined:
      case '2d': {
        this.ctx = element.getContext('2d', {
          alpha: opaque === undefined ? true : !opaque,
        }) as RenderingContext
        break
      }
      case 'webgl': {
        this.ctx = element.getContext('webgl', {
          alpha: opaque === undefined ? true : !opaque,
          depth: false,
        }) as RenderingContext
        break
      }
      default: {
        throw new TypeError(`unsupported RenderingContext ${type}`)
      }
    }
    this.width = this.ctx.canvas.width
    this.height = this.ctx.canvas.height
  }

  resize = (width: number, height: number): void => {
    this.width = width
    this.height = height
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
    this.dirty = true
  }

}

export default Layer
