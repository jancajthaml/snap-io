import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, PATCH_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, SET_GRID_SIZE } from './constants'
import { calculateOptimalViewport } from './utils'

import { IEntitySchema as IBoxEntitySchema } from '../../entities/BoxEntity/types'
import { IEntitySchema as IImageEntitySchema } from '../../entities/ImageEntity/types'
import { IEntitySchema as ITextEntitySchema } from '../../entities/TextEntity/types'
import { IEntitySchema as IPortEntitySchema } from '../../entities/PortEntity/types'

export type IEntitySchema =
  | IBoxEntitySchema
  | IImageEntitySchema
  | ITextEntitySchema
  | IPortEntitySchema

export interface IDiagramSchema {
  id: string;
  root: { [key: string]: IEntitySchema };
}

export const initialState = {
  schema: {
    id: '',
    root: {}
  } as IDiagramSchema,
  gridSize: 12 as number,
  viewport: new Rectangle() as Rectangle,
  resolution: new Rectangle(0, 0, 1, 1) as Rectangle,
} as const

export type IReduxState = typeof initialState

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

    case SET_GRID_SIZE: {
      return {
        ...state,
        gridSize: action.payload.gridSize,
      }
    }

    case SET_SCHEMA: {
      return {
        ...state,
        schema: action.payload.schema,
      }
    }

    case SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload.viewport,
      }
    }

    case ZOOM_TO_FIT: {
      const viewport = calculateOptimalViewport(state.schema, state.gridSize, state.resolution)
      if (viewport === null) {
        return {
          ...state,
          viewport: new Rectangle(0, 0, state.resolution.x2 - state.resolution.x1, state.resolution.y2 - state.resolution.y1),
        }
      }
      return {
        ...state,
        viewport,
      }
    }

    case SET_RESOLUTION: {
      return {
        ...state,
        resolution: action.payload.resolution,
      }
    }

    case PATCH_SCHEMA: {
      return {
        ...state,
        schema: {
          id: state.schema.id,
          root: {
            ...state.schema.root,
            ...action.payload.update,
          },
        },
      }
    }

    default: {
      return state
    }

  }
}
