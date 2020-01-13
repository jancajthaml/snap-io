import React, { useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import PortEntityRenderer from './PortEntityRenderer'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const PortEntity = React.forwardRef((props: IProps, ref: any) => {
  const [companion] = useState<PortEntityRenderer>(new PortEntityRenderer(props, () => props.parent.currentMouseCoordinates.original, props.parent.connectEntities))

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
    const ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      ports.set(port.id, new PortHandle(companion, port.id, port.x, port.y))
    })
    companion.ports = ports
  }, [props.id, props.ports.map((port) => port.id).join(',')])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return <React.Fragment />
})

export default PortEntity
