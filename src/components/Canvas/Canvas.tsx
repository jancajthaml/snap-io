import React, { useEffect, useState, useRef } from 'react';

interface IProps {
  name: string;
  opaque?: boolean;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const Canvas = (props: IProps) => {
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [dirty, setDirty] = useState<boolean>(true)
  const ref = useRef<HTMLCanvasElement | null>(null)

  const update = () => {
    setDirty(true)
  }

  const resize = () => {
    if (ref.current === null) {
      return
    }
    ref.current.width = window.innerWidth
    ref.current.height = window.innerHeight
    setDirty(true)
  }

  const removeListeners = () => {
    window.removeEventListener(`canvas-update-${props.name}`, update)
    window.removeEventListener(`canvas-resize-${props.name}`, resize)
  }

  const addListeners = () => {
    window.addEventListener(`canvas-update-${props.name}`, update)
    window.addEventListener(`canvas-resize-${props.name}`, resize)
  }

  useEffect(() => {
    if (!dirty || ctx == null) {
      return
    }
    props.draw(ctx as CanvasRenderingContext2D)
    setDirty(false)
  }, [dirty, ctx])

  useEffect(() => {
    if (!ref) {
      return
    }
    setContext((ref.current as HTMLCanvasElement).getContext('2d', {
      alpha: props.opaque === undefined ? true : !props.opaque,
    }))
    if (ref.current !== null) {
      ref.current.width = window.innerWidth
      ref.current.height = window.innerHeight
    }
  }, [ref])

  useEffect(() => {
    addListeners()
    return () => {
      removeListeners()
    }
  }, [])

  return (
    <canvas ref={ref} />
  )
}

export default Canvas
