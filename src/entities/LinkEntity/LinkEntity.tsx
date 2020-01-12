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
    if (companion.current === null) {
      return
    }
    const c = companion.current as LinkEntityCompation
    c.id = props.id
    c.from = props.from
    c.to = props.to
  }, [companion.current, props.id, '|', ...props.from, '|', ...props.to])

  useEffect(() => {
    if (ref === null || companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default LinkEntity
