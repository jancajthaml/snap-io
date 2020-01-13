import React, { useRef, useState, useEffect } from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import ResizableEntityRenderer from './ResizableEntityRenderer'
import { ICanvasEntitySchema } from '../../@types/index'

interface IProps {
  id: string;
  parent: ICanvasEntityWrapperSchema;
  children: React.ReactElement;
}

const ResizableEntity = React.forwardRef((props: IProps, ref: any) => {
  const child = useRef<ICanvasEntitySchema>()
  const [companion] = useState<ResizableEntityRenderer>(new ResizableEntityRenderer(props.id, child, props.parent))

  useEffect(() => {
    companion.parent.addNode(companion.id, companion)
    return () => {
      companion.parent.removeNode(companion.id)
    }
  }, [])

  useEffect(() => {
    companion.id = props.id
  }, [props.id])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = companion
  }, [ref])

  return (
    <React.Fragment>
      {React.cloneElement(props.children, {
        ref: child,
        parent: companion,
      })}
    </React.Fragment>
  )
})

export default ResizableEntity
