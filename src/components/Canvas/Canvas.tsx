import React, { ReactNode, useEffect, useRef } from 'react';

import { Rectangle } from '../../atoms'

interface IProps {
  viewport: Rectangle;
  resolution: Rectangle;
  children?: ReactNode;
  onResize: (x: number, y: number, width: number, height: number) => void;
  onKeyUp: (event: KeyboardEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onWheel: (event: WheelEvent) => void;
}

const Canvas = (props: IProps) => {
  const ref = useRef<SVGSVGElement | null>(null)

  const onResize = () => {
    if (ref.current === null) {
      return
    }
    const wrapper = ref.current.parentElement as HTMLElement
    props.onResize(wrapper.offsetLeft, wrapper.offsetTop, wrapper.clientWidth, wrapper.clientHeight)
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
  }

  const onMouseUp = (event: MouseEvent) => {
    props.onMouseUp(event)
  }

  const onMouseMove = (event: React.MouseEvent) => {
    props.onMouseMove(event.nativeEvent)
  }

  const onWheel = (event: WheelEvent) => {
    let node = (event.target as Node | null)
    while (node != null) {
      if (node == ref.current) {
        event.preventDefault()
        props.onWheel(event)
        return;
      }
      node = node.parentNode;
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
    onResize()
  }, [ref])

  useEffect(() => {
    addListeners()
    return () => {
      removeListeners()
    }
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${props.resolution.x2 - props.resolution.x1} ${props.resolution.y2 - props.resolution.y1}`}
      ref={ref}
      width={props.resolution.x2 - props.resolution.x1}
      height={props.resolution.y2 - props.resolution.y1}
      tabIndex={0}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <defs>
        <clipPath id="canvas-mask">
          <rect
            x={0}
            y={0}
            width={props.resolution.x2 - props.resolution.x1}
            height={props.resolution.y2 - props.resolution.y1}
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#canvas-mask)"
      >
        <g
          transform={`translate(${props.viewport.x1 * props.viewport.z}, ${props.viewport.y1 * props.viewport.z}) scale(${props.viewport.z})`}
        >
          {props.children}
        </g>
      </g>
    </svg>
  )
}

export default Canvas
