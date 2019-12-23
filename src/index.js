import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './modules/Layout'
import { MOUNT_NODE } from './global/constants'

ReactDOM.render(<Layout />, document.getElementById(MOUNT_NODE))

/*
import Loop from './modules/Loop'
import RectangleEntity from './modules/RectangleEntity'
import Engine from './modules/Engine'

document.addEventListener("DOMContentLoaded", () => {
  const engine = new Engine();
  engine.resize();
  engine.registerListeners();

  const loop = new Loop(() => {
    engine.update()
    engine.draw()
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
*/
