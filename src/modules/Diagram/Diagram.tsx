import React, { useEffect } from 'react';

import Loop from '../Loop'
import Engine from '../Engine'
import GridLayer from '../GridLayer'
import OverlayLayer from '../OverlayLayer'
import ElementsLayer from '../ElementsLayer'

const Diagram = () => {
  const engine = new Engine();
  const loop = new Loop(() => {
    engine.update()
    engine.draw()
  })

  useEffect(() => {
    //console.log('diagram mount')
    engine.resize();
    engine.randomPopulate();
    engine.registerListeners();
    loop.start()
    return () => {
      //console.log('diagram unmount')
      loop.stop();
      engine.unregisterListeners();
    }
  }, [])

  return (
    <React.Fragment>
      <GridLayer
        engine={engine}
      />
      <OverlayLayer
        engine={engine}
      />
      <ElementsLayer
        engine={engine}
      />
    </React.Fragment>
  )
}

export default Diagram
