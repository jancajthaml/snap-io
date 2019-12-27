import React, { useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IReduxStore } from '../../store'
import { IEntitySchema } from './reducer'
import { getSchema } from '../Diagram/selectors'

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../BoxEntity'

interface IProps {
  store: IReduxStore;
  schema: IEntitySchema[];
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
      {props.schema.map((entity) => (
        <BoxEntity
          engine={ref.current}
          x={entity.x}
          y={entity.y}
          width={entity.width}
          height={entity.height}
          color="red"
        />
      ))}
    </Composition>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  schema: getSchema(state),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Diagram)
