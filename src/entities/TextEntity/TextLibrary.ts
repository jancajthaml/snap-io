
class TextLibrary {

  private nil: any;

  private underlying: {
    [text: string]: {
      [aspect: number]: any;
    };
  };

  constructor() {
    this.underlying = {}
    this.nil = new Image()
  }

  alloc = (text: string, fontSize: number, width: number, height: number) => {
    const buffer = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D

    // FIXME try to alloc SVG blob instead to 2d bitmap

    const w = Math.max(1, width) * 2
    const h = Math.max(1, height) * 2
    const size = fontSize * 2

    buffer.canvas.width = w
    buffer.canvas.height = h
    buffer.font = `lighter ${size}px Arial`

    let textPadding = 0.2 * size
    let textW = w - (2*textPadding)
    let textY = size
    let textH = textY + h - (2*textPadding) - size
    let textX = textPadding
    let textHeight = buffer.measureText('m').width * 0.4 + size * 0.6

    text.split("\n").forEach((line) => {
      const words = line.split(' ');
      let printLine = ''

      for (let n = 0; n < words.length; n++) {
        const testLine = `${printLine}${words[n]} `;
        var testWidth = buffer.measureText(testLine).width;
        if (testWidth >= textW && n > 0) {
          if (textY <= textH) {
            buffer.fillText(printLine, textX, textY);
          }
          printLine = `${words[n]} `;
          textY += textHeight;
        } else {
          printLine = testLine;
        }
      }
      if (textY <= textH) {
        buffer.fillText(printLine, textX, textY);
      }
      textY += textHeight;
    })
    if (!this.underlying[text]) {
      this.underlying[text] = {
        [`${width}x${height}`]: {},
      }
    } else if (!(this.underlying[text] as any)[`${width}x${height}`]) {
      (this.underlying[text] as any)[`${width}x${height}`] = {}
    }
    (this.underlying[text] as any)[`${width}x${height}`][fontSize] = buffer
  }

  get = (text: string, fontSize: number, width: number, height: number) => {
    const ref = this.underlying[text]
    if (!ref) {
      this.alloc(text, fontSize, width, height)
      return this.nil
    }
    const aspected = (ref as any)[`${width}x${height}`]
    if (!aspected) {
      this.alloc(text, fontSize, width, height)
      return this.nil
    }
    const result = aspected[fontSize]
    if (!result) {
      this.alloc(text, fontSize, width, height)
      return this.nil
    }
    return result.canvas
  }

}

export default new TextLibrary()
