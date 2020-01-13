import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IReduxStore } from '../../store'
import { IDiagramSchema } from './reducer'
import { getEngineMode, getSchema } from '../Diagram/selectors'

import { ICanvasEntityWrapperSchema } from '../../@types/index'

import { EngineMode } from '../Diagram/constants'

import Engine from '../Engine'
import Composition from '../Composition'

import ResizableEntity from '../../entities/ResizableEntity'

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
import { IEntitySchema as ILinkEntitySchema } from '../../entities/LinkEntity/types'
import { ENTITY_TYPE as LINK_ENTITY_TYPE } from '../../entities/LinkEntity/constants'

interface IProps {
  store: IReduxStore;
  schema: IDiagramSchema;
  engineMode: EngineMode;
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

  //console.log(props.schema.entities)

  //let map3 = new Map(function*() { yield* map1; yield* map2; }());


  return (
    <Composition engine={engine as Engine}>
      {Array.from(props.schema.entities).map(([ _key, entity]) => {
        if (entity.type === BOX_ENTITY_TYPE) {
          return (
            <ResizableEntity
              key={(entity as IBoxEntitySchema).id}
              id={(entity as IBoxEntitySchema).id}
              parent={engine as ICanvasEntityWrapperSchema}
            >
              <BoxEntity
                parent={engine as ICanvasEntityWrapperSchema}
                type={(entity as IBoxEntitySchema).type}
                id={(entity as IBoxEntitySchema).id}
                x={(entity as IBoxEntitySchema).x}
                y={(entity as IBoxEntitySchema).y}
                width={(entity as IBoxEntitySchema).width}
                height={(entity as IBoxEntitySchema).height}
                color={(entity as IBoxEntitySchema).color}
              />
            </ResizableEntity>
          )
        } else if (entity.type === IMAGE_ENTITY_TYPE) {
          return (
            <ResizableEntity
              key={(entity as IImageEntitySchema).id}
              id={(entity as IImageEntitySchema).id}
              parent={engine as ICanvasEntityWrapperSchema}
            >
              <ImageEntity
                parent={engine as ICanvasEntityWrapperSchema}
                type={(entity as IImageEntitySchema).type}
                id={(entity as IImageEntitySchema).id}
                x={(entity as IImageEntitySchema).x}
                y={(entity as IImageEntitySchema).y}
                width={(entity as IImageEntitySchema).width}
                height={(entity as IImageEntitySchema).height}
                url={(entity as IImageEntitySchema).url}
              />
            </ResizableEntity>
          )
        } else if (entity.type === TEXT_ENTITY_TYPE) {
          return (
            <ResizableEntity
              key={(entity as ITextEntitySchema).id}
              id={(entity as ITextEntitySchema).id}
              parent={engine as ICanvasEntityWrapperSchema}
            >
              <TextEntity
                parent={engine as ICanvasEntityWrapperSchema}
                type={(entity as ITextEntitySchema).type}
                id={(entity as ITextEntitySchema).id}
                x={(entity as ITextEntitySchema).x}
                y={(entity as ITextEntitySchema).y}
                width={(entity as ITextEntitySchema).width}
                height={(entity as ITextEntitySchema).height}
                text={(entity as ITextEntitySchema).text}
              />
            </ResizableEntity>
          )
        } else if (entity.type === PORT_ENTITY_TYPE) {
          return (
            <ResizableEntity
              key={(entity as IPortEntitySchema).id}
              id={(entity as IPortEntitySchema).id}
              parent={engine as ICanvasEntityWrapperSchema}
            >
              <PortEntity
                parent={engine as ICanvasEntityWrapperSchema}
                type={(entity as IPortEntitySchema).type}
                id={(entity as IPortEntitySchema).id}
                x={(entity as IPortEntitySchema).x}
                y={(entity as IPortEntitySchema).y}
                width={(entity as IPortEntitySchema).width}
                height={(entity as IPortEntitySchema).height}
                ports={(entity as IPortEntitySchema).ports}
              />
            </ResizableEntity>
          )
        } else {
          return null
        }
      })}
      {Array.from(props.schema.links).map(([ _key, link]) => {
        if (link.type === LINK_ENTITY_TYPE) {
          return (
            <LinkEntity
              key={(link as ILinkEntitySchema).id}
              parent={engine as ICanvasEntityWrapperSchema}
              type={(link as ILinkEntitySchema).type}
              id={(link as ILinkEntitySchema).id}
              from={(link as ILinkEntitySchema).from}
              to={(link as ILinkEntitySchema).to}
              breaks={(link as ILinkEntitySchema).breaks}
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
