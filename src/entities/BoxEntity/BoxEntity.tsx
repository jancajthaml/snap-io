import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import BoxEntityRenderer from './BoxEntityRenderer'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const BoxEntity = React.forwardRef((props: IProps, ref: any) => {
  const [companion] = useState<BoxEntityRenderer>(new BoxEntityRenderer(props))

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
    companion.color = props.color
  }, [props.id, props.color])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return <React.Fragment />
})

export default BoxEntity
