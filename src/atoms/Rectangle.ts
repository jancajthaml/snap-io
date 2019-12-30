
class Rectangle {

  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z: number;

  constructor(x?: number, y?: number, w?: number, h?: number) {
    this.x1 = x || 0
    this.y1 = y || 0
    this.x2 = this.x1 + (w || 0)
    this.y2 = this.y1 + (h || 0)
    this.z = 1
  }

  resize(w: number, h: number): void {
    this.x2 = this.x1 + w
    this.y2 = this.y1 + h
  }

  copy(): Rectangle {
    const clone = new Rectangle()
    clone.x1 = this.x1
    clone.x2 = this.x2
    clone.y1 = this.y1
    clone.y2 = this.y2
    clone.z = this.z
    return clone
  }

  translate(x: number, y: number): void {
    this.x1 += x
    this.y1 += y
    this.x2 += x
    this.y2 += y
  }

}

export default Rectangle
