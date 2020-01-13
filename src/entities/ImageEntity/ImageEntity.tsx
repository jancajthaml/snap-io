import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import ImageEntityRenderer from './ImageEntityRenderer'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const ImageEntity = React.forwardRef((props: IProps, ref: any) => {
  const [companion] = useState<ImageEntityRenderer>(new ImageEntityRenderer(props))

  useEffect(() => {
    const { parent, id } = props
    parent.addNode(id, companion)
    return () => {
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
    companion.url = props.url
  }, [props.id, props.url])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return <React.Fragment />
})

export default ImageEntity
