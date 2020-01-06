
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
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize/2}px; font-family: Arial;">${text}</div></foreignObject></svg>`;

    const svg = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const url = URL.createObjectURL(svg);
    const image = new Image();
    image.onload = function() {
      URL.revokeObjectURL(url);
    }
    image.src = url;

    if (!this.underlying[text]) {
      this.underlying[text] = {
        [`${width}x${height}`]: {},
      }
    } else if (!(this.underlying[text] as any)[`${width}x${height}`]) {
      (this.underlying[text] as any)[`${width}x${height}`] = {}
    }
    (this.underlying[text] as any)[`${width}x${height}`][fontSize] = image
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
    return result
  }

}

export default new TextLibrary()
