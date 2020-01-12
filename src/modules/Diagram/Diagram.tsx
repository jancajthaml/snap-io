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

import ImageEntity from '../../entities/ImageEntity'
import { IEntitySchema as IImageEntitySchema } from '../../entities/ImageEntity/types'

import TextEntity from '../../entities/TextEntity'
import { IEntitySchema as ITextEntitySchema } from '../../entities/TextEntity/types'

import PortEntity from '../../entities/PortEntity'
import { IEntitySchema as IPortEntitySchema } from '../../entities/PortEntity/types'

import LinkEntity from '../../entities/LinkEntity'
import { IEntitySchema as ILinkEntitySchema } from '../../entities/LinkEntity/types'

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

  return (
    <Composition engine={engine as Engine}>
      {Object.values(props.schema.entities).map((entity) => {
        if (entity.type === 'box-entity') {
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
        } else if (entity.type === 'image-entity') {
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
        } else if (entity.type === 'text-entity') {
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
        } else if (entity.type === 'port-entity') {
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
      {Object.values(props.schema.links).map((link) => {
        if (link.type === 'link-entity') {
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
