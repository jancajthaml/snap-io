import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

import TextEntityRenderer from './TextEntityRenderer'
import Resizable from '../../enhancers/Resizable'

import TextLibrary from './TextLibrary'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const TextEntity = React.forwardRef((props: IProps, ref: any) => {
  const [renderer] = useState<TextEntityRenderer>(new TextEntityRenderer(props))

  useEffect(() => {
    const { parent, id, text } = props
    parent.addNode(id, new Resizable(id, renderer, parent))
    return () => {
      TextLibrary.free(text)
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    renderer.x = props.x
    renderer.y = props.y
    renderer.width = props.width
    renderer.height = props.height
    renderer.updateClientCoordinates()
  }, [props.x, props.y, props.width, props.height])

  useEffect(() => {
    renderer.id = props.id
    renderer.text = props.text
  }, [props.id, props.text])

  useEffect(() => {
    if (ref) {
      ref.current = renderer
    }
  }, [ref])

  return <React.Fragment />
})

export default TextEntity
