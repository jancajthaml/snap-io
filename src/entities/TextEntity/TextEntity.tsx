import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import TextEntityRenderer from './TextEntityRenderer'
import TextLibrary from './TextLibrary'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const TextEntity = React.forwardRef((props: IProps, ref: any) => {
  const [companion] = useState<TextEntityRenderer>(new TextEntityRenderer(props))

  useEffect(() => {
    const { parent, id, text } = props
    parent.addNode(id, companion)
    return () => {
      TextLibrary.free(text)
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    companion.x = props.x
    companion.y = props.y
    companion.width = props.width
    companion.height = props.height
  }, [props.x, props.y, props.width, props.height])

  useEffect(() => {
    companion.id = props.id
    companion.text = props.text
  }, [props.id, props.text])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return <React.Fragment />
})

export default TextEntity
