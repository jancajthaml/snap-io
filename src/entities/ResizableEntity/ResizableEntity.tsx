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
  const [renderer] = useState<ResizableEntityRenderer>(new ResizableEntityRenderer(props.id, child, props.parent))

  useEffect(() => {
    renderer.parent.addNode(renderer.id, renderer)
    return () => {
      renderer.parent.removeNode(renderer.id)
    }
  }, [])

  useEffect(() => {
    renderer.id = props.id
  }, [props.id])

  useEffect(() => {
    if (!ref) {
      return
    }
    ref.current = renderer
  }, [ref])

  return (
    <React.Fragment>
      {React.cloneElement(props.children, {
        ref: child,
        parent: renderer,
      })}
    </React.Fragment>
  )
})

export default ResizableEntity
