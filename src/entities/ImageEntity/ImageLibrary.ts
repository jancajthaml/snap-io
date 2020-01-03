// FIXME not ideal pollutes window scope
require('gifuct-js/dist/gifuct-js')

const GIF = 'GIF' as const
const IMAGE = 'IMAGE' as const

class ImageLibrary {

  private underlying: {
    [uri: string]: {
      type: string;
      source: any;
    };
  };

  private nil: any;

  constructor() {
    this.underlying = {}
    this.nil = {
      type: IMAGE,
      source: new Image(),
    }
  }

  alloc = (uri: string) => {
    let ref = this.underlying[uri]
    if (ref) {
      return
    }
    this.underlying[uri] = {
      type: this.nil.type,
      source: this.nil.source,
    }

    if (uri.endsWith('.gif')) {
      fetch(uri)
        .then((resp) => resp.arrayBuffer())
        .then((buff) => new window.GIF(buff))
        .then((gif) => gif.decompressFrames(true))
        .then((data) => {
          this.underlying[uri].source = {
            idx: 0,
            frames: data,
            timestamp: 0,
            buffer: document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D,
          }
          this.underlying[uri].type = GIF
        }).catch(() => {
          const source = new Image()
          source.src = uri
          this.underlying[uri].source = source
          return Promise.resolve(null)
        })
    } else {
      const source = new Image()
      source.src = uri
      this.underlying[uri].source = source
    }
  }

  get = (uri: string, timestamp: number) => {
    const ref = this.underlying[uri]
    if (!ref) {
      this.alloc(uri)
      return this.nil.source
    }
    if (ref.type === GIF && timestamp - ref.source.timestamp > 50) {
      ref.source.timestamp = timestamp
      ref.source.idx = (ref.source.idx + 1) % ref.source.frames.length
      ref.source.buffer.canvas.width = ref.source.frames[ref.source.idx].dims.width as number
      ref.source.buffer.canvas.height = ref.source.frames[ref.source.idx].dims.height as number
      let frameImageData = ref.source.buffer.createImageData(ref.source.buffer.canvas.width, ref.source.buffer.canvas.height);
      frameImageData.data.set(ref.source.frames[ref.source.idx].patch);
      ref.source.buffer.putImageData(frameImageData, 0, 0);
    }
    if (ref.type == GIF) {
      return ref.source.buffer.canvas
    }
    return ref.source
  }

}

export default new ImageLibrary()
