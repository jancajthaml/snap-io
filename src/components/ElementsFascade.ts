import Rectangle from '../atoms/Rectangle'

class ElementsFascade {

  visible: any[];
  elements: any[];
  selected: any[];

  constructor() {
    this.visible = []
    this.elements = []
    this.selected = []
  }

  add(element: any) {
    this.elements.push(element)
  }

  remove(element: any) {
    this.elements = this.elements.filter(function(value) {
      return value !== element
    });
  }

  forEachVisible(callback: (element: any) => void) {
    for (let i = 0; i < this.visible.length; i++) {
      callback(this.visible[i])
    }
  }

  forEachSelected(callback: (element: any) => void) {
    for (let i = 0; i < this.selected.length; i++) {
      callback(this.selected[i])
    }
  }

  updateVisible = (viewport: Rectangle) => {
    this.visible = []
    this.elements.forEach((element) => {
      const outOfRight = (viewport.x2 - 2 * viewport.x1 - element.bounds.x1) < 0
      const outOfLeft = (viewport.x1 + element.bounds.x2) < 0
      const outOfBottom = (viewport.y2 - 2 * viewport.y1 - element.bounds.y1) < 0
      const outOfUp = (viewport.y1 + element.bounds.y2) < 0
      if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
        this.visible.push(element)
      }
    })

    this.visible.sort(function(x, y) {
      if (x.bounds.z === y.bounds.z) {
        return 0;
      }
      if (x.bounds.z > y.bounds.z) {
        return 1;
      }
      return -1;
    });
  }

  updateSelected = (selection: Rectangle, clearPrevious: boolean) => {
    if (clearPrevious) {
      this.selected.forEach((element) => {
        if (element.bounds.z >= 1000) {
          element.bounds.z -= 1000
        }
      })
      this.selected = []
    }
    this.visible.forEach((element) => {
      if (element.bounds.insideRectangle(selection)) {
        this.selected.push(element)
        element.bounds.z += 1000
      }
    })

    this.visible.sort(function(x, y) {
      if (x.bounds.z === y.bounds.z) {
        return 0;
      }
      if (x.bounds.z > y.bounds.z) {
        return 1;
      }
      return -1;
    });
  }

}

export default ElementsFascade
