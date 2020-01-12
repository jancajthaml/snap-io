import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import ImageEntityCompation from './ImageEntityCompation'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const ImageEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<ImageEntityCompation | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new ImageEntityCompation(props)
    parent.addNode(id, companion.current)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as ImageEntityCompation
    c.x = props.x
    c.y = props.y
    c.width = props.width
    c.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as ImageEntityCompation
    c.id = props.id
    c.url = props.url
  }, [companion.current, props.id, props.url])

  useEffect(() => {
    if (ref === null || companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default ImageEntity
