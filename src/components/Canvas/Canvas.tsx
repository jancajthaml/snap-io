import React, { ReactNode, useEffect, useRef } from 'react';

import { Rectangle } from '../../atoms'

interface IProps {
  viewport: Rectangle;
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
    props.onResize(ref.current.clientLeft, ref.current.clientTop, ref.current.clientWidth, ref.current.clientHeight)
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

  const howMany = 10000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      tabIndex={0}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <g
        transform={`translate(${props.viewport.x1 * props.viewport.z}, ${props.viewport.y1 * props.viewport.z}) scale(${props.viewport.z})`}
      >
        {Array.from(Array(howMany).keys()).map((idx) => (
          <rect
            x={(idx % modulus) * 60}
            y={Math.floor(idx / modulus) * 60}
            width="50"
            height="50"
          />
        ))}
        {props.children}
      </g>
    </svg>
  )
}

export default Canvas
