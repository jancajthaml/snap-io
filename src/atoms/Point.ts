
class Point {

  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  multiply(factor: number) {
    return new Point(this.x * factor, this.y * factor)
  }

}

export default Point
