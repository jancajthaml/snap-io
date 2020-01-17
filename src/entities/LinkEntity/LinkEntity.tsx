import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import LinkEntityRenderer from './LinkEntityRenderer'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const LinkEntity = React.forwardRef((props: IProps, ref: any) => {
  const [companion] = useState<LinkEntityRenderer>(new LinkEntityRenderer(props, props.parent.getEntityByID))

  useEffect(() => {
    const { parent, id } = props
    parent.addNode(id, companion)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    companion.id = props.id
    companion.from = props.from
    companion.to = props.to
  }, [props.id, props.from.join(','), props.to.join(','), props.breaks.map((p) => `${p.x},${p.y}`).join(',')])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return <React.Fragment />
})

export default LinkEntity
