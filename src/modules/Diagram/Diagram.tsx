import React, { useEffect } from 'react';

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../BoxEntity'

const Diagram = () => {
  const engine = new Engine();

  useEffect(() => {
    //engine.randomPopulate();  // FIXME debug
    engine.addListeners();
    return () => {
      engine.removeListeners();
    }
  }, [])

  return (
    <Composition engine={engine}>
      <BoxEntity
        engine={engine}
        x={10}
        y={20}
        width={60}
        height={60}
        color="orange"
      />
    </Composition>
  )
}

export default Diagram
