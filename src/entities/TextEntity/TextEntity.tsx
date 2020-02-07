import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import { C } from '../../atoms'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const TextEntity = React.forwardRef((props: IProps, ref: any) => {
  return (
    <foreignObject
      ref={ref}
      x={props.x * C.GRID_SIZE}
      y={props.y * C.GRID_SIZE}
      width={props.width * C.GRID_SIZE}
      height={props.height * C.GRID_SIZE}
    >
      <div
        style={{
          fontSize: props.fontSize / 2,
          fontFamily: 'Arial',
          width: '100%',
          height: '100%',
        }}
      >
        {props.text}
      </div>
    </foreignObject>
  )
})

export default TextEntity
