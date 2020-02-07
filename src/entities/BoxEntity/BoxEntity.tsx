import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import { C } from '../../atoms'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const BoxEntity = React.forwardRef((props: IProps, ref: any) => {
  return (
    <g
      ref={ref}
    >
      <rect
        stroke={props.color}
        fill="transparent"
        x={props.x * C.GRID_SIZE}
        y={props.y * C.GRID_SIZE}
        width={props.width * C.GRID_SIZE}
        height={props.height * C.GRID_SIZE}
      />
      <rect
        ref={ref}
        fill={props.color}
        x={props.x * C.GRID_SIZE + 2}
        y={props.y * C.GRID_SIZE + 2}
        width={props.width * C.GRID_SIZE - 4}
        height={props.height * C.GRID_SIZE - 4}
      />
    </g>
  )
})

export default BoxEntity
