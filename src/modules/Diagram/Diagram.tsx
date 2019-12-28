import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IReduxStore } from '../../store'
import { IDiagramSchema } from './reducer'
import { getSchema } from '../Diagram/selectors'

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../BoxEntity'
import SelectionEntity from '../SelectionEntity'

interface IProps {
  store: IReduxStore;
  schema: IDiagramSchema;
}

const Diagram = (props: IProps) => {
  const [engine, setEngine] = useState<Engine | null>(null)

  useEffect(() => {
    const nextEngine = new Engine(props.store)
    setEngine(nextEngine)
    nextEngine.bootstrap()
    return () => {
      if (engine !== null ){
        engine.cleanup()
      }
    }
  }, [])

  if (engine === null) {
    return null
  }

  return (
    <Composition engine={engine as Engine}>
      {Object.values(props.schema).map((entity, idx) => (
        <BoxEntity
          engine={engine as Engine}
          type={entity.type}
          id={entity.id}
          x={entity.x}
          y={entity.y}
          width={entity.width}
          height={entity.height}
          color={["red", "blue", "green"][(idx % 3)]}
        />
      ))}
      <SelectionEntity
        engine={engine as Engine}
      />
    </Composition>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  schema: getSchema(state),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Diagram)
