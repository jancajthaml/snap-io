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
    const c = companion.current as BoxEntityCompation
    c.x = props.x
    c.y = props.y
    c.width = props.width
    c.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as BoxEntityCompation
    c.id = props.id
    c.color = props.color
  }, [companion.current, props.id, props.color])

  useEffect(() => {
    if (ref === null || companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default BoxEntity
