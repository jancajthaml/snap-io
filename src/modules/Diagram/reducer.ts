import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'
import Point from '../../atoms/Point'

import { SET_VIEWPORT, SET_RESOLUTION, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT } from './constants'

export const initialState = {
  viewport: new Rectangle() as Rectangle,
  resolution: new Point(1, 1) as Point,
  elements: [] as any[],
  visible: [] as any[],
  selected: [] as any[],
} as const

export type IReduxState = typeof initialState

const sortElements = (elements: any[]) => {
  elements.sort(function(x, y) {
    if (x.bounds.z === y.bounds.z) {
      return 0;
    }
    if (x.bounds.z > y.bounds.z) {
      return 1;
    }
    return -1;
  });
  return elements
}

const calculateVisible = (elements: any[], selected: any[], viewport: Rectangle) => {
  const visible: any[] = [...selected]
  elements.forEach((element) => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - element.bounds.x1) < 0
    const outOfLeft = (viewport.x1 + element.bounds.x2) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - element.bounds.y1) < 0
    const outOfUp = (viewport.y1 + element.bounds.y2) < 0
    if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
      visible.push(element)
    }
  })
  return [...new Set(visible)]
}

const calculateSelection = (selected: any[], visible: any[], selection: Rectangle, clearPrevious: boolean) => {
  let nextSelected: any[]
  if (clearPrevious) {
    selected.forEach((element) => {
      if (element.bounds.z >= 1000) {
        element.bounds.z -= 1000
      }
    })
    nextSelected = []
  } else{
    nextSelected = [...selected]
  }
  visible.forEach((element) => {
    if (element.bounds.insideRectangle(selection)) {
      nextSelected.push(element)
      element.bounds.z += 1000
    }
  })
  return nextSelected
}

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

    case SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload.viewport,
        visible: sortElements(calculateVisible(state.elements, state.selected, action.payload.viewport)),
      }
    }

    case SET_RESOLUTION: {
      return {
        ...state,
        resolution: action.payload.resolution,
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
