import React, { useEffect } from 'react';

import Loop from '../Loop'
import Engine from '../Engine'
import GridLayer from '../GridLayer'

const Diagram = () => {
  const engine = new Engine();

  const loop = new Loop(() => {
    engine.update()
    engine.draw()
  })


  useEffect(() => {
    //console.log('diagram mount')
    engine.resize();
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
    </React.Fragment>
  )
}

export default Diagram
