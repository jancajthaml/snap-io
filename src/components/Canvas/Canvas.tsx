import React, { useEffect, useCallback, useRef } from 'react';

interface IProps {
  draw: (ctx: CanvasRenderingContext2D, timestamp: number) => void;
  onResize: (x: number, y: number, width: number, height: number) => void;
  onKeyUp: (event: KeyboardEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onWheel: (event: WheelEvent) => void;
}

const FPS = 60

let wheelEvent: any = null
let resizeEvent: any = null

const Canvas = (props: IProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>(0)
  const lastTime = useRef<number>(performance.now())
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  const onResize = () => {
    if (ref.current === null) {
      return
    }
    const wrapper = (ref.current.parentElement as HTMLElement)
    resizeEvent = wrapper
  }

  const onKeyUp = (event: KeyboardEvent) => {
    event.preventDefault()
    props.onKeyUp(event)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault()
    props.onKeyDown(event.nativeEvent)
  }

  const onDoubleClick = (event: React.MouseEvent) => {
    if (event.nativeEvent.button === 0) {
      event.preventDefault()
      props.onDoubleClick(event.nativeEvent)
    }
  }

  const onMouseDown = (event: React.MouseEvent) => {
    if (event.nativeEvent.button === 0) {
      event.preventDefault()
      props.onMouseDown(event.nativeEvent)
    }
    if (ref.current !== null) {
      ref.current.focus()
    }
  }

  const onMouseUp = (event: MouseEvent) => {
    props.onMouseUp(event)
  }

  const onMouseMove = (event: React.MouseEvent) => {
    // FIXME move event
    props.onMouseMove(event.nativeEvent)
  }

  const onWheel = (event: WheelEvent) => {
    if (event.target == ref.current) {
      event.preventDefault()
      wheelEvent = event
    }
  }

  const onContextMenu = (event: MouseEvent) => {
    if (event.button === 0 && event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const removeListeners = () => {
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('contextmenu', onContextMenu)
  }

  const addListeners = () => {
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('resize', onResize)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('contextmenu', onContextMenu)
  }

  useEffect(() => {
    if (!ref) {
      return
    }
    ctx.current = ((ref.current as HTMLCanvasElement).getContext('2d', {
      alpha: false,
    }))
    onResize()
  }, [ref])

  const delayedRepaint = useCallback((now) => {
    const delta = now - lastTime.current
    const interval = 1000 / FPS
    if (delta > interval && ctx.current !== null) {
      if (resizeEvent !== null) {
        let c = (ref.current as HTMLCanvasElement)
        c.width = Number(resizeEvent.clientWidth * window.devicePixelRatio)
        c.height = Number(resizeEvent.clientHeight * window.devicePixelRatio)
        c.style.width = `${resizeEvent.clientWidth}px`;
        c.style.height = `${resizeEvent.clientHeight}px`;
        props.onResize(resizeEvent.offsetLeft, resizeEvent.offsetTop, c.width, c.height)
        resizeEvent = null
      }
      if (wheelEvent !== null) {
        props.onWheel(wheelEvent)
        wheelEvent = null
      }
      ctx.current.imageSmoothingEnabled = true
      props.draw(ctx.current as CanvasRenderingContext2D, now)
      lastTime.current = now - (delta - ((delta / interval) | 0) * interval)
    }
    animationRef.current = requestAnimationFrame(delayedRepaint);
  }, [])

  useEffect(() => {
    addListeners()
    lastTime.current = performance.now()
    animationRef.current = requestAnimationFrame(delayedRepaint)
    return () => {
      cancelAnimationFrame(animationRef.current)
      removeListeners()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      tabIndex={0}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    />
  )
}

export default Canvas
