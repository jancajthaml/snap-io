import React, { useEffect, useRef } from 'react';

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
  const ref = useRef<Engine>(new Engine(props.store))

  useEffect(() => {
    ref.current.bootstrap()
    return () => {
      ref.current.cleanup();
    }
  }, [])

  return (
    <Composition engine={ref.current}>
      {Object.values(props.schema).map((entity, idx) => (
        <BoxEntity
          engine={ref.current}
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
        engine={ref.current}
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
