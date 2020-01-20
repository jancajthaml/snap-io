import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import LinkEntityRenderer from './LinkEntityRenderer'
import PointHandle from './PointHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const LinkEntity = React.forwardRef((props: IProps, ref: any) => {
  const [renderer] = useState<LinkEntityRenderer>(new LinkEntityRenderer(props, props.parent.getEntityByID, props.parent))

  useEffect(() => {
    const { parent, id } = props
    parent.addNode(id, renderer)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    renderer.id = props.id
    renderer.from = props.from
    renderer.to = props.to
  }, [props.id, props.from.join(','), props.to.join(',')])


  useEffect(() => {
    const breaks = [] as PointHandle[]
    props.breaks.forEach((point) => {
      breaks.push(new PointHandle(renderer, point.x, point.y))
    })
    renderer.breaks = breaks
  }, [props.breaks.map((p) => `${p.x},${p.y}`).join(',')])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = renderer
  }, [ref])

  return <React.Fragment />
})

export default LinkEntity
