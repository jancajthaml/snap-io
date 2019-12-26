import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT } from './constants'

export const initialState = {
  viewport: new Rectangle() as Rectangle,
  resolution: new Rectangle(0, 0, 1, 1) as Rectangle,
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

const calculateOptimalViewport = (elements: any[], resolution: Rectangle): Rectangle | null => {
  const viewport = new Rectangle()

  let x1: number | undefined = undefined
  let y1: number | undefined = undefined
  let x2: number | undefined = undefined
  let y2: number | undefined = undefined

  elements.forEach((element) => {
    if (x1 === undefined || element.bounds.x1 < x1) {
      x1 = element.bounds.x1
    }
    if (x2 === undefined || element.bounds.x2 > x2) {
      x2 = element.bounds.x2
    }
    if (y1 === undefined || element.bounds.y1 < y1) {
      y1 = element.bounds.y1
    }
    if (y2 === undefined || element.bounds.y2 > y2) {
      y2 = element.bounds.y2
    }
  })

  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return null
  }

  const xScale = (resolution.x2 - resolution.x1) / (x2 - x1)
  const yScale = (resolution.y2 - resolution.y1) / (y2 - y1)

  const nextScale = Math.max(Math.min(Math.min(xScale, yScale) / Math.pow(1.03, 2), 8), 0.2)

  const normalizedDiffWidth = (resolution.x2 - resolution.x1) - (x2 - x1) * nextScale
  const normalizedDiffHeight = (resolution.y2 - resolution.y1) - (y2 - y1) * nextScale

  viewport.x1 = -x1 + (normalizedDiffWidth / nextScale) / 2
  viewport.x2 = viewport.x1 + ((resolution.x2 - resolution.x1) / nextScale)
  viewport.y1 = -y1 + (normalizedDiffHeight / nextScale) / 2
  viewport.y2 = viewport.y1 + ((resolution.y2 - resolution.y1) / nextScale)
  viewport.z = nextScale
  return viewport
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

    case ZOOM_TO_FIT: {
      const viewport = calculateOptimalViewport(state.elements, state.resolution)
      if (viewport === null) {
        return state
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
