import Point from './atoms/Point'
import Rectangle from './atoms/Rectangle'
import MouseFascade from './components/MouseFascade'
import ElementsFascade from './components/ElementsFascade'
import Layer from './components/Layer'
import GridLayer from './modules/GridLayer'
import ElementsLayer from './modules/ElementsLayer'
import OverlayLayer from './modules/OverlayLayer'
import Loop from './modules/Loop'
import SelectionEntity from './modules/SelectionEntity'
import RectangleEntity from './modules/RectangleEntity'
import Engine from './modules/Engine'

/*
console.log(new Point())
console.log(new Rectangle())
console.log(new MouseFascade())
console.log(new ElementsFascade())
console.log(new Layer(document.getElementById('canvas_layer_0')))
console.log(new ElementsLayer(document.getElementById('canvas_layer_1')))
console.log(new OverlayLayer(document.getElementById('canvas_layer_2')))
console.log(new GridLayer(document.getElementById('canvas_layer_0')))
console.log(SelectionEntity)
console.log(RectangleEntity)
console.log(Engine)
*/
console.log('nothing to do')



document.addEventListener("DOMContentLoaded", () => {
  const canvas = new Engine();
  canvas.resize();
  canvas.registerListeners();

  const loop = new Loop(() => {
    canvas.update()
    canvas.draw()
  })

  loop.start()

  ;


  (async function() {
    const size = 60
    const counts = 10
    const xOffset = (window.innerWidth - size) / 2
    const yOffset = (window.innerHeight - size) / 2

    for (let x = 0; x < counts; x++) {
      for (let y = 0; y < counts; y++) {
        let element
        switch ((x+y) % 3) {
          case 0:
            element = new RectangleEntity(xOffset + (x*size), yOffset + (y*size), size-10, size-10, "red")
            break
          case 1:
            element = new RectangleEntity(xOffset + (x*size), yOffset + (y*size), size-10, size-10, "green")
            break
          case 2:
            element = new RectangleEntity(xOffset + (x*size), yOffset + (y*size), size-10, size-10, "blue")
            break
        }
        //await new Promise(resolve => setTimeout(resolve, 10))
        canvas.elements.add(element)
        canvas.update_visible = true
        canvas.elements_layer.dirty = true
      }
    }
  }());
})
