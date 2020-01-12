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
    if (!companion.current) {
      return
    }
    companion.current.x = props.x
    companion.current.y = props.y
    companion.current.width = props.width
    companion.current.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height])

  useEffect(() => {
    if (!companion.current) {
      return
    }
    companion.current.id = props.id
    companion.current.text = props.text
  }, [companion.current, props.id, props.text])

  useEffect(() => {
    if (!ref || !companion.current) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default TextEntity
