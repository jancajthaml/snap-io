import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IReduxStore } from '../../store'
import { IDiagramSchema } from './reducer'
import { getSchema } from '../Diagram/selectors'

import Engine from '../Engine'
import Composition from '../Composition'
import BoxEntity from '../../entities/BoxEntity'
import { IEntitySchema as IBoxEntitySchema } from '../../entities/BoxEntity/types'

import ImageEntity from '../../entities/ImageEntity'
import { IEntitySchema as IImageEntitySchema } from '../../entities/ImageEntity/types'

import TextEntity from '../../entities/TextEntity'
import { IEntitySchema as ITextEntitySchema } from '../../entities/TextEntity/types'

import PortEntity from '../../entities/PortEntity'
import Port from '../../entities/PortEntity/Port'
import { IEntitySchema as IPortEntitySchema, IPortSchema } from '../../entities/PortEntity/types'

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
      if (engine !== null) {
        engine.teardown()
      }
    }
  }, [])

  if (engine === null) {
    return null
  }

  // FIXME factory here

  return (
    <Composition engine={engine as Engine}>
      {Object.values(props.schema.root).map((entity) => {
        if (entity.type === 'box-entity') {
          return (
            <BoxEntity
              engine={engine as Engine}
              type={(entity as IBoxEntitySchema).type}
              id={(entity as IBoxEntitySchema).id}
              x={(entity as IBoxEntitySchema).x}
              y={(entity as IBoxEntitySchema).y}
              width={(entity as IBoxEntitySchema).width}
              height={(entity as IBoxEntitySchema).height}
              color={(entity as IBoxEntitySchema).color}
            />
          )
        } else if (entity.type === 'image-entity') {
          return (
            <ImageEntity
              engine={engine as Engine}
              type={(entity as IImageEntitySchema).type}
              id={(entity as IImageEntitySchema).id}
              x={(entity as IImageEntitySchema).x}
              y={(entity as IImageEntitySchema).y}
              width={(entity as IImageEntitySchema).width}
              height={(entity as IImageEntitySchema).height}
              url={(entity as IImageEntitySchema).url}
            />
          )
        } else if (entity.type === 'text-entity') {
          return (
            <TextEntity
              engine={engine as Engine}
              type={(entity as ITextEntitySchema).type}
              id={(entity as ITextEntitySchema).id}
              x={(entity as ITextEntitySchema).x}
              y={(entity as ITextEntitySchema).y}
              width={(entity as ITextEntitySchema).width}
              height={(entity as ITextEntitySchema).height}
              text={(entity as ITextEntitySchema).text}
            />
          )
        } else if (entity.type === 'port-entity') {
          return (
            <PortEntity
              engine={engine as Engine}
              type={(entity as IPortEntitySchema).type}
              id={(entity as IPortEntitySchema).id}
              x={(entity as IPortEntitySchema).x}
              y={(entity as IPortEntitySchema).y}
              width={(entity as IPortEntitySchema).width}
              height={(entity as IPortEntitySchema).height}
            >
              {(entity as IPortEntitySchema).ports.map((port) => (
                <Port
                  key={(port as IPortSchema).id}
                  engine={engine as Engine}
                  id={(port as IPortSchema).id}
                  x={(port as IPortSchema).x}
                  y={(port as IPortSchema).y}
                  in={(port as IPortSchema).in}
                  out={(port as IPortSchema).out}
                />
              ))}
            </PortEntity>
          )
        } else {
          return null
        }
      })}
    </Composition>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  schema: getSchema(state),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Diagram)
