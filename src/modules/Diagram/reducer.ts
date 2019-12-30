import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, PATCH_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, /*UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT*/ } from './constants'
import { calculateOptimalViewport /*, calculateVisible, calculateSelection*/ } from './utils'

export interface IEntitySchema {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export interface IDiagramSchema {
  [key: string]: IEntitySchema;
}

export const initialState = {
  schema: {} as IDiagramSchema,
  viewport: new Rectangle() as Rectangle,
  resolution: new Rectangle(0, 0, 1, 1) as Rectangle,
} as const

export type IReduxState = typeof initialState

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

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
      const viewport = calculateOptimalViewport(state.schema, state.resolution)
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
      const schema = { ...state.schema }

      action.payload.update.forEach((update) => {
        schema[update.id] = update
      })

      return {
        ...state,
        schema,
      }
    }

    default: {
      return state
    }

  }
}