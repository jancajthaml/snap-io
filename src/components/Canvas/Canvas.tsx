import React, { useEffect, useCallback, useRef, ReactNode } from 'react';

interface IProps {
  name: string;
  opaque?: boolean;
  children?: ReactNode;
  draw: (ctx: CanvasRenderingContext2D) => void;
  resize: (width: number, height: number) => void;
}

const Canvas = (props: IProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const loop = useRef<number>(0)
  const dirty = useRef<boolean>(true)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  const update = () => {
    dirty.current = true
  }

  const resize = () => {
    if (ref.current === null) {
      return
    }
    ref.current.width = (ref.current.parentElement as HTMLElement).clientWidth
    ref.current.height = (ref.current.parentElement as HTMLElement).clientHeight
    props.resize(ref.current.width, ref.current.height)
    dirty.current = true
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
    if (!ref) {
      return
    }
    ctx.current = ((ref.current as HTMLCanvasElement).getContext('2d', {
      alpha: props.opaque === undefined ? true : !props.opaque,
    }))
    resize()
  }, [ref])

  const delayedRepaint = useCallback(() => {
    if (dirty.current && ctx.current != null) {
      props.draw(ctx.current as CanvasRenderingContext2D)
      dirty.current = false
    }
    loop.current = requestAnimationFrame(delayedRepaint);
  }, [])

  useEffect(() => {
    addListeners()
    loop.current = requestAnimationFrame(delayedRepaint)
    return () => {
      cancelAnimationFrame(loop.current)
      removeListeners()
    }
  }, [])

  useEffect(() => {
    console.log('canvas has following children', props.children)
  }, [props.children])

  return (
    <canvas ref={ref} />
  )
}

export default Canvas
