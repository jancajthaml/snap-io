
class Loop {

  lastId?: number;
  private callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback
  }

  stop = (): void => {
    if (this.lastId) {
      cancelAnimationFrame(this.lastId)
    }
  }

  start = (): void => {
    this.callback()
    this.lastId = requestAnimationFrame(this.start)
  }
}

export default Loop
