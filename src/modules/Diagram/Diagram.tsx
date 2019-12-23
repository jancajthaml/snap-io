import React, { useEffect } from 'react';

import Engine from '../Engine'
import Composition from '../Composition'

const Diagram = () => {
  const engine = new Engine();

  useEffect(() => {
    engine.randomPopulate();  // FIXME debug
    engine.addListeners();
    return () => {
      engine.removeListeners();
    }
  }, [])

  return (
    <Composition engine={engine}>
      <div />
      <span />
    </Composition>
  )
}

export default Diagram
