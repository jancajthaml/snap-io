import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import ImageEntityRenderer from './ImageEntityRenderer'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const ImageEntity = React.forwardRef((props: IProps, ref: any) => {
  const [renderer] = useState<ImageEntityRenderer>(new ImageEntityRenderer(props))

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
    renderer.url = props.url
  }, [props.id, props.url])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = renderer
  }, [ref])

  return <React.Fragment />
})

export default ImageEntity
