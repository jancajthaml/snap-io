
class Rectangle {

  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z: number;
  private repr: string;

  constructor(x?: number, y?: number, w?: number, h?: number) {
    this.x1 = x || 0
    this.y1 = y || 0
    this.x2 = this.x1 + (w || 0)
    this.y2 = this.y1 + (h || 0)
    this.z = 1
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}@${this.z}`
  }

  resize(w: number, h: number): void {
    this.x2 = this.x1 + w
    this.y2 = this.y1 + h
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}@${this.z}`
  }

  copy(): Rectangle {
    const clone = new Rectangle()
    clone.x1 = this.x1
    clone.x2 = this.x2
    clone.y1 = this.y1
    clone.y2 = this.y2
    clone.z = this.z
    clone.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}@${this.z}`
    return clone
  }

  translate(x: number, y: number): void {
    this.x1 += x
    this.y1 += y
    this.x2 += x
    this.y2 += y
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}@${this.z}`
  }

  insideRectangle(rect: Rectangle) {
    return !(this.x1 > rect.x2 || rect.x1 > this.x2 || this.y1 > rect.y2 || rect.y1 > this.y2)
  }

  toString(): string {
    return this.repr
  }

}

export default Rectangle
