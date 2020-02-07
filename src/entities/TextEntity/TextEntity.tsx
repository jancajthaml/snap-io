import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const TextEntity = React.forwardRef((props: IProps, ref: any) => {
  return (
    <foreignObject
      ref={ref}
      x={props.x * 12}
      y={props.y * 12}
      width={props.width * 12}
      height={props.height * 12}
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
