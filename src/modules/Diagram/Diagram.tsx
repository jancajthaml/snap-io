import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IReduxStore } from '../../store'
import { IDiagramSchema } from './reducer'
import { getEngineMode, getSchema } from '../Diagram/selectors'

//import { ICanvasEntityWrapperSchema } from '../../@types/index'

import { EngineMode } from '../Diagram/constants'

import Engine from '../Engine'
import Composition from '../Composition'

import BoxEntity from '../../entities/BoxEntity'
import { IEntitySchema as IBoxEntitySchema } from '../../entities/BoxEntity/types'
import { ENTITY_TYPE as BOX_ENTITY_TYPE } from '../../entities/BoxEntity/constants'

import ImageEntity from '../../entities/ImageEntity'
import { IEntitySchema as IImageEntitySchema } from '../../entities/ImageEntity/types'
import { ENTITY_TYPE as IMAGE_ENTITY_TYPE } from '../../entities/ImageEntity/constants'

import TextEntity from '../../entities/TextEntity'
import { IEntitySchema as ITextEntitySchema } from '../../entities/TextEntity/types'
import { ENTITY_TYPE as TEXT_ENTITY_TYPE } from '../../entities/TextEntity/constants'

import PortEntity from '../../entities/PortEntity'
import { IEntitySchema as IPortEntitySchema } from '../../entities/PortEntity/types'
import { ENTITY_TYPE as PORT_ENTITY_TYPE } from '../../entities/PortEntity/constants'

import LinkEntity from '../../entities/LinkEntity'
//import { IEntitySchema as ILinkEntitySchema } from '../../entities/LinkEntity/types'
import { ENTITY_TYPE as LINK_ENTITY_TYPE } from '../../entities/LinkEntity/constants'

interface IProps {
  store: IReduxStore;
  schema: IDiagramSchema;
  engineMode: EngineMode;
}

const Diagram = (props: IProps) => {
  const [engine] = useState<Engine>(new Engine(props.store))

  useEffect(() => {
    engine.bootstrap()
    return () => {
      engine.teardown()
    }
  }, [])

  return (
    <Composition engine={engine}>
      {Array.from(props.schema.entities).map(([ _key, entity]) => {
        if (entity.type === BOX_ENTITY_TYPE) {
          return (
            <BoxEntity
              parent={engine}
              type={entity.type}
              id={entity.id}
              x={entity.x}
              y={entity.y}
              width={entity.width}
              height={entity.height}
              color={(entity as IBoxEntitySchema).color}
            />
          )
        } else if (entity.type === IMAGE_ENTITY_TYPE) {
          return (
            <ImageEntity
              parent={engine}
              type={entity.type}
              id={entity.id}
              x={entity.x}
              y={entity.y}
              width={entity.width}
              height={entity.height}
              url={(entity as IImageEntitySchema).url}
            />
          )
        } else if (entity.type === TEXT_ENTITY_TYPE) {
          return (
            <TextEntity
              parent={engine}
              type={entity.type}
              id={entity.id}
              x={entity.x}
              y={entity.y}
              width={entity.width}
              height={entity.height}
              text={(entity as ITextEntitySchema).text}
            />
          )
        } else if (entity.type === PORT_ENTITY_TYPE) {
          return (
            <PortEntity
              parent={engine}
              type={entity.type}
              id={entity.id}
              x={entity.x}
              y={entity.y}
              width={entity.width}
              height={entity.height}
              ports={(entity as IPortEntitySchema).ports}
            />
          )
        } else {
          return null
        }
      })}
      {Array.from(props.schema.links).map(([ _key, link]) => {
        if (link.type === LINK_ENTITY_TYPE) {
          return (
            <LinkEntity
              key={link.id}
              parent={engine}
              type={link.type}
              id={link.id}
              from={link.from}
              to={link.to}
              breaks={link.breaks}
            />
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
  engineMode: getEngineMode(state),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Diagram)
