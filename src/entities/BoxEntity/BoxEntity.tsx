import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import BoxEntityRenderer from './BoxEntityRenderer'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const BoxEntity = React.forwardRef((props: IProps, ref: any) => {
  const [renderer] = useState<BoxEntityRenderer>(new BoxEntityRenderer(props))

  useEffect(() => {
    const { parent, id } = props
    parent.addNode(id, renderer)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    renderer.x = props.x
    renderer.y = props.y
    renderer.width = props.width
    renderer.height = props.height
  }, [props.x, props.y, props.width, props.height])

  useEffect(() => {
    renderer.id = props.id
    renderer.color = props.color
  }, [props.id, props.color])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = renderer
  }, [ref])

  return <React.Fragment />
})

export default BoxEntity
