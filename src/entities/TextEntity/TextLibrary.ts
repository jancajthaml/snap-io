
class TextLibrary {

  private underlying: {
    [text: string]: {
      [aspect: string]: {
        [fontSize: number]: HTMLImageElement;
      };
    };
  };

  constructor() {
    this.underlying = {}
  }

  free = (text: string) => {
    delete this.underlying[text]
  }

  alloc = (text: string, fontSize: number, width: number, height: number) => {
    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize/2}px; font-family: Arial;">${text}</div></foreignObject>
      </svg>
    `;

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
    try {
      return this.underlying[text][`${width}x${height}`][fontSize]
    } catch (_err) {
      this.alloc(text, fontSize, width, height)
      return null
    }
  }

}

export default new TextLibrary()
