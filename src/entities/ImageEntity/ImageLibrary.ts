import { Decoder as GifDecoder } from 'fastgif/fastgif';

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
      fetch(uri, { mode: 'cors' })
        .then((resp) => resp.arrayBuffer())
        .then((buff) => new GifDecoder().decode(buff))
        .then((data) => {
          if (data.length === 0) {
            return Promise.reject(new Error('no frames'))
          }
          const images = [] as {
            source: HTMLImageElement;
            delay: number;
          }[]
          const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D
          data.forEach((frame: any) => {
            ctx.canvas.width = frame.imageData.width as number
            ctx.canvas.height = frame.imageData.height as number
            ctx.putImageData(frame.imageData, 0, 0);
            const image = new Image()
            image.src = ctx.canvas.toDataURL();
            images.push({
              source: image,
              delay: Math.floor(frame.delay * 0.75),
            })
          })
          return images
        })
        .then((frames) => {
          this.underlying[uri].source = {
            idx: 0,
            timestamp: 0,
            frames,
            current: frames[0],
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
    if (ref.type === GIF && timestamp - ref.source.timestamp > ref.source.current.delay) {
      ref.source.timestamp = timestamp
      ref.source.idx = (ref.source.idx + 1) % ref.source.frames.length
      ref.source.current = ref.source.frames[ref.source.idx]
    }
    if (ref.type == GIF) {
      return ref.source.current.source
    }
    return ref.source
  }

}

export default new ImageLibrary()
