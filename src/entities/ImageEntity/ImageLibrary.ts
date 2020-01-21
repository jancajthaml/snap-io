class ImageLibrary {

  private underlying: {
    [uri: string]: HTMLImageElement | null
  };

  constructor() {
    this.underlying = {}
  }

  alloc = (uri: string) => {
    let ref = this.underlying[uri]
    if (ref) {
      return
    }
    const source = new Image()
    source.src = uri
    source.onload = () => {
      this.underlying[uri] = source
    }
    this.underlying[uri] = null
  }

  get = (uri: string, _timestamp: number) => {
    const ref = this.underlying[uri]
    if (ref === undefined) {
      this.alloc(uri)
      return null
    }
    return ref
  }

}

export default new ImageLibrary()
