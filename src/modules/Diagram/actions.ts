
import { IDiagramSchema, IEntitySchema } from './reducer'
import Rectangle from '../../atoms/Rectangle'

import { SET_SCHEMA, PATCH_SCHEMA, REMOVE_FROM_SCHEMA, SET_VIEWPORT, SET_RESOLUTION, ZOOM_TO_FIT, SET_GRID_SIZE } from './constants'

export const setGridSize = (gridSize: number) => ({
  type: SET_GRID_SIZE,
  payload: {
    gridSize,
  },
}) as const

export const patchSchema = (update: { [id: string]: IEntitySchema }) => ({
  type: PATCH_SCHEMA,
  payload: {
    update,
  },
}) as const

export const removeFromSchema = (id: string) => ({
  type: REMOVE_FROM_SCHEMA,
  payload: {
    id,
  },
}) as const

export const setSchema = (schema: IDiagramSchema) => ({
  type: SET_SCHEMA,
  payload: {
    schema,
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

export type IAction =
  | ReturnType<typeof setSchema>
  | ReturnType<typeof patchSchema>
  | ReturnType<typeof removeFromSchema>
  | ReturnType<typeof setViewPort>
  | ReturnType<typeof setResolution>
  | ReturnType<typeof zoomToFit>
  | ReturnType<typeof setGridSize>

