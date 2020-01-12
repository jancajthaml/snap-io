import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import PortEntityRenderer from './PortEntityRenderer'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const PortEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<PortEntityRenderer | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new PortEntityRenderer(props, () => props.parent.currentMouseCoordinates.original, props.parent.connectEntities)
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
    const ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      ports.set(port.id, new PortHandle(companion.current, port.id, port.x, port.y))
    })
    companion.current.ports = ports
  }, [companion.current, props.id, props.ports])

  useEffect(() => {
    if (!ref || !companion.current) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default PortEntity
