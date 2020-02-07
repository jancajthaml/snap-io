import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'
import { C } from '../../atoms'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const ImageEntity = React.forwardRef((props: IProps, ref: any) => {
  return (
    <image
      ref={ref}
      href={props.url}
      x={props.x * C.GRID_SIZE}
      y={props.y * C.GRID_SIZE}
      width={props.width * C.GRID_SIZE}
      height={props.height * C.GRID_SIZE}
    />
  )
})

export default ImageEntity
