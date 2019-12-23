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

  const removeListeners = () => {
    window.removeEventListener(`canvas-update-${props.name}`, update)
  }

  const addListeners = () => {
    window.addEventListener(`canvas-update-${props.name}`, update)
  }

  useEffect(() => {
    if (!dirty || ctx == null) {
      return
    }
    console.log('canvas drawing')
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
    if (ref.current !== null && ref.current.parentElement !== null) {
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
