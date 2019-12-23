import React, { useEffect } from 'react';

//import Loop from '../Loop'
import Engine from '../Engine'
//import GridLayer from '../GridLayer'
//import OverlayLayer from '../OverlayLayer'
import Composition from '../Composition'

const Diagram = () => {
  const engine = new Engine();
  /*
  const loop = new Loop(() => {
    engine.update()
    engine.draw()
  })
  */

  useEffect(() => {
    //console.log('diagram mount')
    engine.resize();
    engine.randomPopulate();
    engine.registerListeners();
    //loop.start()
    return () => {
      //console.log('diagram unmount')
      //loop.stop();
      engine.unregisterListeners();
    }
  }, [])

  return (
    <Composition
      engine={engine}
    />
  )
}

export default Diagram
