import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

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
        x={props.x * 12}
        y={props.y * 12}
        width={props.width * 12}
        height={props.height * 12}
      />
      <rect
        ref={ref}
        fill={props.color}
        x={props.x * 12 + 2}
        y={props.y * 12 + 2}
        width={props.width * 12 - 4}
        height={props.height * 12 - 4}
      />
    </g>
  )
})

export default BoxEntity
