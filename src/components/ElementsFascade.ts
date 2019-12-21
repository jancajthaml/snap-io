import Engine from '../modules/Engine'

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

  updateVisible(engine: Engine) {
    this.visible = []
    this.elements.forEach((element) => {
      const outOfRight = (engine.viewport.x2 - 2 * engine.viewport.x1 - element.x1) < 0
      const outOfLeft = (engine.viewport.x1 + element.x2) < 0
      const outOfBottom = (engine.viewport.y2 - 2 * engine.viewport.y1 - element.y1) < 0
      const outOfUp = (engine.viewport.y1 + element.y2) < 0

      if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
        this.visible.push(element)
      }
    })
    this.visible.sort(function(x, y) {
      if (x.selected === y.selected) {
        return 0;
      }
      if (x.selected && !y.selected) {
        return 1;
      }
      return -1;
    });
  }

  updateSelected(selection: any, clearPrevious: boolean) {
    if (clearPrevious) {
      this.selected.forEach((element) => {
        element.selected = false
      })
      this.selected = []
    }
    this.visible.forEach((element) => {

      if (element.insideRectangle(selection)) {
        this.selected.push(element)
        element.selected = true
      }
    })
    this.visible.sort(function(x, y) {
      if (x.selected === y.selected) {
        return 0;
      }
      if (x.selected && !y.selected) {
        return 1;
      }
      return -1;
    });
  }

}

export default ElementsFascade
