import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, PATCH_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT } from './constants'
import { calculateOptimalViewport, calculateVisible, calculateSelection } from './utils'

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
  elements: {} as { [key: string]: any },
  visible: [] as any[],
  selected: [] as any[],
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
        visible: calculateVisible(state.elements, state.selected, action.payload.viewport),
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
        visible: calculateVisible(state.elements, state.selected, viewport),
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

    // FIXME try to remove this
    case ADD_ELEMENT: {
      const elements = {
        ...state.elements,
        [action.payload.element.props.id]: action.payload.element
      }
      return {
        ...state,
        elements,
        visible: calculateVisible(elements, state.selected, state.viewport),
      }
    }

    // FIXME try to remove this
    case REMOVE_ELEMENT: {
      let elements = { ...state.elements }
      delete elements[action.payload.element.props.id]
      const selected = state.selected.filter((value) => value !== action.payload.element)
      return {
        ...state,
        elements,
        selected,
        visible: calculateVisible(elements, selected, state.viewport),
      }
    }

    case UPDATE_SELECTION: {
      return {
        ...state,
        selected: calculateSelection(state.selected, state.visible, action.payload.selection, action.payload.clearPrevious),
      }

    }

    default: {
      return state
    }

  }
}
