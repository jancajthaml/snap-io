
import Rectangle from '../../atoms/Rectangle'

import { SET_VIEWPORT, SET_RESOLUTION, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT } from './constants'

export const setResolution = (resolution: Rectangle) => ({
  type: SET_RESOLUTION,
  payload: {
    resolution,
  },
}) as const

export const setViewPort = (viewport: Rectangle) => ({
  type: SET_VIEWPORT,
  payload: {
    viewport,
  },
}) as const

export const updateSelection = (selection: Rectangle, clearPrevious: boolean) => ({
  type: UPDATE_SELECTION,
  payload: {
    selection,
    clearPrevious,
  },
}) as const

export const addElement = (element: any) => ({
  type: ADD_ELEMENT,
  payload: {
    element
  },
}) as const

export const removeElement = (element: any) => ({
  type: REMOVE_ELEMENT,
  payload: {
    element
  },
}) as const

export type IAction =
  | ReturnType<typeof setViewPort>
  | ReturnType<typeof setResolution>
  | ReturnType<typeof addElement>
  | ReturnType<typeof removeElement>
  | ReturnType<typeof updateSelection>
