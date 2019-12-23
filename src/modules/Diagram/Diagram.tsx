import React, { useEffect } from 'react';

import Engine from '../Engine'
import Composition from '../Composition'

const Diagram = () => {
  const engine = new Engine();

  useEffect(() => {
    engine.randomPopulate();
    engine.registerListeners();
    return () => {
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
