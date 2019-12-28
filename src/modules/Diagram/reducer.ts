import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT, UPDATE_ELEMENTS_SCHEMA } from './constants'
import { calculateOptimalViewport, sortElements, calculateVisible, calculateSelection } from './utils'

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
  elements: [] as any[],
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
        visible: sortElements(calculateVisible(state.elements, state.selected, action.payload.viewport)),
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
        visible: sortElements(calculateVisible(state.elements, state.selected, viewport)),
      }
    }

    case SET_RESOLUTION: {
      return {
        ...state,
        resolution: action.payload.resolution,
      }
    }

    case UPDATE_ELEMENTS_SCHEMA: {
      const schema = { ...state.schema }

      action.payload.update.forEach((update) => {
        schema[update.id] = update
      })

      return {
        ...state,
        schema,
      }
    }

    case ADD_ELEMENT: {
      const elements = [...state.elements, action.payload.element]
      return {
        ...state,
        elements,
        visible: sortElements(calculateVisible(elements, state.selected, state.viewport)),
      }
    }

    case REMOVE_ELEMENT: {
      const elements = state.elements.filter((value) => value !== action.payload.element)
      const selected = state.selected.filter((value) => value !== action.payload.element)
      return {
        ...state,
        elements,
        selected,
        visible: sortElements(calculateVisible(elements, selected, state.viewport)),
      }
    }

    case UPDATE_SELECTION: {
      return {
        ...state,
        selected: calculateSelection(state.selected, state.visible, action.payload.selection, action.payload.clearPrevious),
        visible: sortElements(state.visible),
      }

    }

    default: {
      return state
    }

  }
}
