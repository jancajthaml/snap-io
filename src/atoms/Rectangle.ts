
class Rectangle {

  x1: number;
  x2: number;
  y1: number;
  y2: number;
  private repr: string;

  constructor(x: number, y: number, w: number, h: number) {
    this.x1 = x || 0
    this.y1 = y || 0
    this.x2 = (x + w) || 0
    this.y2 = (y + h) || 0
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}`
  }

  resize(w: number, h: number): void {
    this.x2 = this.x1 + w
    this.y2 = this.y1 + h
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}`
  }

  translate(x: number, y: number): void {
    this.x1 += x
    this.y1 += y
    this.x2 += x
    this.y2 += y
    this.repr = `R${this.x1}|${this.y1}|${this.x2}|${this.y2}`
  }

  toString(): string {
    return this.repr
  }

}

export default Rectangle
