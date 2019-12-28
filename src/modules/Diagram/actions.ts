
import { IDiagramSchema, IEntitySchema } from './reducer'
import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, PATCH_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, UPDATE_SELECTION, ADD_ELEMENT, REMOVE_ELEMENT } from './constants'

export const patchSchema = (update: IEntitySchema[]) => ({
  type: PATCH_SCHEMA,
  payload: {
    update
  },
}) as const

export const setSchema = (schema: IDiagramSchema) => ({
  type: SET_SCHEMA,
  payload: {
    schema
  },
}) as const

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

export const zoomToFit = () => ({
  type: ZOOM_TO_FIT,
  payload: {},
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
  | ReturnType<typeof setSchema>
  | ReturnType<typeof patchSchema>
  | ReturnType<typeof setViewPort>
  | ReturnType<typeof setResolution>
  | ReturnType<typeof zoomToFit>
  | ReturnType<typeof addElement>
  | ReturnType<typeof removeElement>
  | ReturnType<typeof updateSelection>
