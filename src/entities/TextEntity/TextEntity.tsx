import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import TextEntityCompation from './TextEntityCompation'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const TextEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<TextEntityCompation | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new TextEntityCompation(props)
    parent.addNode(id, companion.current)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as TextEntityCompation
    c.x = props.x
    c.y = props.y
    c.width = props.width
    c.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as TextEntityCompation
    c.id = props.id
    c.text = props.text
  }, [companion.current, props.id, props.text])

  useEffect(() => {
    if (ref === null || companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default TextEntity
