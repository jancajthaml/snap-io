import React from 'react'
import { ICanvasEntityWrapperSchema } from '../../@types/index'
import { IEntitySchema } from './types'

interface IProps extends IEntitySchema {
  parent: ICanvasEntityWrapperSchema;
}

const ImageEntity = React.forwardRef((props: IProps, ref: any) => {
  return (
    <image
      ref={ref}
      href={props.url}
      x={props.x * 12}
      y={props.y * 12}
      width={props.width * 12}
      height={props.height * 12}
    />
  )
})

export default ImageEntity
