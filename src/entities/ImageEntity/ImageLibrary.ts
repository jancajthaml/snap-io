
class ImageLibrary {

  private underlying: {
    [uri: string]: {
      counter: number;
      source: CanvasImageSource;
    };
  };

  private nil: CanvasImageSource;

  constructor() {
    this.underlying = {}
    this.nil = new Image()
  }

  alloc = (uri: string) => {
    let ref = this.underlying[uri]
    if (ref) {
      ref.counter++;
      return
    }
    // FIXME does not work nicely with gifs
    const source = new Image()
    source.src = uri
    //source.onload = function() {
      //window.dispatchEvent(new Event('canvas-update-composition'));
    //}
    this.underlying[uri] = {
      counter: 1,
      source,
    }
  }

  free = (uri: string) => {
    if (!this.underlying[uri]) {
      return
    }
    this.underlying[uri].counter--
    if (this.underlying[uri].counter <= 0) {
      delete this.underlying[uri]
    }
  }

  get = (uri: string) => {
    const ref = this.underlying[uri]
    if (!ref) {
      return this.nil;
    }
    return ref.source;
  }

}

export default new ImageLibrary()