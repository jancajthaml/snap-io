import React, { useEffect } from 'react';

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../BoxEntity'

import { IReduxStore } from '../../store'

interface IProps {
  store: IReduxStore;
}

const Diagram = (props: IProps) => {
  const engine = new Engine(props.store);

  useEffect(() => {
    engine.bootstrap()
    return () => {
      engine.cleanup();
    }
  }, [])

  // FIXME crashes at
  // const howMany = 100000
  const howMany = 900 //10000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  return (
    <Composition engine={engine}>
      {Array.from(Array(howMany).keys()).map((idx) => (
        <BoxEntity
          key={idx}
          engine={engine}
          x={((idx%modulus)*70)}
          y={(Math.floor(idx/modulus)*70)}
          width={60}
          height={60}
          color={["red", "green", "blue"][idx % 3]}
        />
      ))}
    </Composition>
  )
}

export default Diagram
