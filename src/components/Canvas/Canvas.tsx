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

const FPS = 30
const INTERVAL = 1000 / FPS

const Canvas = (props: IProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>(0)
  const lastTime = useRef<number>(Date.now())
  //const dirty = useRef<boolean>(true)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

      //this._lastTime = rightNow();


  //const update = () => {
    //dirty.current = true
  //}

  const onResize = () => {
    if (ref.current === null) {
      return
    }
    const wrapper = (ref.current.parentElement as HTMLElement)
    ref.current.width = wrapper.clientWidth
    ref.current.height = wrapper.clientHeight
    props.onResize(wrapper.offsetLeft, wrapper.offsetTop, ref.current.width, ref.current.height)
    //dirty.current = true
  }

  const onMouseDown = (event: any) => {
    if (event.nativeEvent.button === 0) {
      event.preventDefault()
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
    if (event.target == ref.current) {
      event.preventDefault()
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
    //window.removeEventListener(`canvas-update-${props.name}`, update)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('contextmenu', onContextMenu)
  }

  const addListeners = () => {
    window.addEventListener('resize', onResize)
    window.addEventListener('mouseup', onMouseUp)
    //window.addEventListener(`canvas-update-${props.name}`, update)
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
    const now = Date.now();
    const delta = now - lastTime.current
    if (delta > INTERVAL && ctx.current != null) {
      ctx.current.imageSmoothingEnabled = true
      props.draw(ctx.current as CanvasRenderingContext2D)
      lastTime.current = now - (delta % INTERVAL)
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

  return (
    <canvas
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    />
  )
}

export default Canvas
