import React, { useEffect } from 'react';

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../BoxEntity'

const Diagram = () => {
  const engine = new Engine();

  useEffect(() => {
    engine.addListeners();
    return () => {
      engine.removeListeners();
    }
  }, [])

  return (
    <Composition engine={engine}>
      {Array.from(Array(100).keys()).map((idx) => (
        <BoxEntity
          key={idx}
          engine={engine}
          x={10 + (idx*70)}
          y={20}
          width={60}
          height={60}
          color="red"
        />
      ))}
    </Composition>
  )
}

export default Diagram
