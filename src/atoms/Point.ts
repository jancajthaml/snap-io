
class Point {

  x: number;
  y: number;
  private repr: string;

  constructor(x: number, y: number) {
    this.x = x || 0
    this.y = y || 0
    this.repr = `P${this.x}|${this.y}`
  }

  toString(): string {
    return this.repr
  }
}

export default Point
