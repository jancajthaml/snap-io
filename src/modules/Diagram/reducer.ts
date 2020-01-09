import { Rectangle } from '../../atoms'

import { IAction } from './actions'

import * as C from './constants'
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

    case C.SET_GRID_SIZE: {
      return {
        ...state,
        gridSize: action.payload.gridSize,
      }
    }

    case C.SET_SCHEMA: {
      return {
        ...state,
        schema: action.payload.schema,
      }
    }

    case C.SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload.viewport,
      }
    }

    case C.ZOOM_TO_FIT: {
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

    case C.SET_RESOLUTION: {
      return {
        ...state,
        resolution: action.payload.resolution,
      }
    }

    case C.REMOVE_FROM_SCHEMA: {
      const root = { ...state.schema.root }
      delete root[action.payload.id]

      return {
        ...state,
        schema: {
          id: state.schema.id,
          root,
        },
      }
    }

    case C.PATCH_SCHEMA: {
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
