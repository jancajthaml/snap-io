import React, { useRef, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import PortEntityCompation from './PortEntityCompation'
import PortHandle from './PortHandle'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const PortEntity = React.forwardRef((props: IProps, ref: any) => {
  const companion = useRef<PortEntityCompation | null>()

  useEffect(() => {
    const { parent, id } = props
    companion.current = new PortEntityCompation(props, () => props.parent.currentMouseCoordinates.original, props.parent.connectEntities)
    parent.addNode(id, companion.current)
    return () => {
      parent.removeNode(id)
    }
  }, [])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as PortEntityCompation
    c.x = props.x
    c.y = props.y
    c.width = props.width
    c.height = props.height
  }, [companion.current, props.x, props.y, props.width, props.height])

  useEffect(() => {
    if (companion.current === null) {
      return
    }
    const c = companion.current as PortEntityCompation
    c.id = props.id
    c.ports = new Map<string, PortHandle>()
    props.ports.forEach((port) => {
      c.ports.set(port.id, new PortHandle(c, port.id, port.x, port.y))
    })
  }, [companion.current, props.id, props.ports])

  useEffect(() => {
    if (ref === null || companion.current === null) {
      return
    }
    ref.current = companion.current
  }, [ref, companion.current])

  return <React.Fragment />
})

export default PortEntity
