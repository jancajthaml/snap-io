import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import BoxEntityCompation from './BoxEntityCompation'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const BoxEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<BoxEntityCompation | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new BoxEntityCompation(props)
    parent.addNode(id, companion.current)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const ref = companion.current as BoxEntityCompation
    ref.x = props.x
    ref.y = props.y
    ref.width = props.width
    ref.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height, props.color])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const ref = companion.current as BoxEntityCompation
    ref.id = props.id
    ref.color = props.color
  }, [companion.current, props.id, props.color])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default BoxEntity
