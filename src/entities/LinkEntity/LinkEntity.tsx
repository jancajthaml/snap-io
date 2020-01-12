import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import LinkEntityCompation from './LinkEntityCompation'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const LinkEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<LinkEntityCompation | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new LinkEntityCompation(props, props.parent.getEntityByID)
    parent.addNode(id, companion.current)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    if (!companion.current) {
      return
    }
    companion.current.id = props.id
    companion.current.from = props.from
    companion.current.to = props.to
  }, [companion.current, props.id, '|', ...props.from, '|', ...props.to])

  useEffect(() => {
    if (!ref || !companion.current) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default LinkEntity
