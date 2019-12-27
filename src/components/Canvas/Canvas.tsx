import React, { useEffect, useCallback, useRef } from 'react';

interface IProps {
  name: string;
  opaque?: boolean;
  draw: (ctx: CanvasRenderingContext2D) => void;
  onResize: (x: number, y: number, width: number, height: number) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onWheel: (event: WheelEvent) => void;
}

const Canvas = (props: IProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>(0)
  const dirty = useRef<boolean>(true)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  const update = () => {
    dirty.current = true
  }

  const onResize = () => {
    if (ref.current === null) {
      return
    }
    const wrapper = (ref.current.parentElement as HTMLElement)
    ref.current.width = wrapper.clientWidth
    ref.current.height = wrapper.clientHeight
    props.onResize(wrapper.offsetLeft, wrapper.offsetTop, ref.current.width, ref.current.height)
    dirty.current = true
  }

  const onMouseDown = (event: any) => {
    event.preventDefault()
    if (event.nativeEvent.button === 0) {
      props.onMouseDown(event.nativeEvent)
    }
  }

  const onMouseUp = (event: MouseEvent) => {
    props.onMouseUp(event)
  }

  const onMouseMove = (event: any) => {
    props.onMouseMove(event.nativeEvent)
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    if (event.target == ref.current) {
      props.onWheel(event)
    }
  }

  const onContextMenu = (event: MouseEvent) => {
    if (event.button === 0 && event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const removeListeners = () => {
    window.removeEventListener(`canvas-update-${props.name}`, update)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('contextmenu', onContextMenu)
  }

  const addListeners = () => {
    window.addEventListener('resize', onResize)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener(`canvas-update-${props.name}`, update)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('contextmenu', onContextMenu)
  }

  useEffect(() => {
    if (!ref) {
      return
    }
    ctx.current = ((ref.current as HTMLCanvasElement).getContext('2d', {
      alpha: props.opaque === undefined ? true : !props.opaque,
    }))
    onResize()
  }, [ref])

  const delayedRepaint = useCallback(() => {
    if (dirty.current && ctx.current != null) {
      props.draw(ctx.current as CanvasRenderingContext2D)
      dirty.current = false
    }
    animationRef.current = requestAnimationFrame(delayedRepaint);
  }, [])

  useEffect(() => {
    addListeners()
    animationRef.current = requestAnimationFrame(delayedRepaint)
    return () => {
      cancelAnimationFrame(animationRef.current)
      removeListeners()
    }
  }, [])

  //console.log('here in canvas')
  update()

  return (
    <canvas
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    />
  )
}

export default Canvas
