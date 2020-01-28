import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

import PortEntityRenderer from './PortEntityRenderer'
import Resizable from '../../enhancers/Resizable'

import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const PortEntity = React.forwardRef((props: IProps, ref: any) => {
  const [renderer] = useState<PortEntityRenderer>(new PortEntityRenderer(props, () => props.parent.currentMouseCoordinates.original, props.parent.connectEntities))

  useEffect(() => {
    const { parent, id } = props
    parent.addNode(id, new Resizable(id, renderer, parent))
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    renderer.x = props.x
    renderer.y = props.y
    renderer.width = props.width
    renderer.height = props.height
    renderer.updateClientCoordinates()
  }, [props.x, props.y, props.width, props.height])

  useEffect(() => {
    renderer.id = props.id
    const ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      ports.set(port.id, new PortHandle(renderer, port.id, port.x, port.y))
    })
    renderer.ports = ports
  }, [props.id, props.ports.map((port) => port.id).join(',')])

  useEffect(() => {
    if (ref) {
      ref.current = renderer
    }
  }, [ref])

  return <React.Fragment />
})

export default PortEntity
