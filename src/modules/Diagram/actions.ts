
import { Rectangle } from '../../atoms'

import { IDiagramSchema, IEntitySchema } from './reducer'

import * as C from './constants'

export const setGridSize = (gridSize: number) => ({
  type: C.SET_GRID_SIZE,
  payload: {
    gridSize,
  },
}) as const

export const patchSchema = (update: { [id: string]: IEntitySchema }) => ({
  type: C.PATCH_SCHEMA,
  payload: {
    update,
  },
}) as const

export const removeFromSchema = (id: string) => ({
  type: C.REMOVE_FROM_SCHEMA,
  payload: {
    id,
  },
}) as const

export const setSchema = (schema: IDiagramSchema) => ({
  type: C.SET_SCHEMA,
  payload: {
    schema,
  },
}) as const

export const setEngineMode = (engineMode: C.EngineMode) => ({
  type: C.SET_ENGINE_MODE,
  payload: {
    engineMode,
  },
}) as const

export const setResolution = (resolution: Rectangle) => ({
  type: C.SET_RESOLUTION,
  payload: {
    resolution,
  },
}) as const

export const setViewPort = (viewport: Rectangle) => ({
  type: C.SET_VIEWPORT,
  payload: {
    viewport,
  },
}) as const

export const zoomIn = (centerX: number, centerY: number, power: number) => ({
  type: C.ZOOM_IN,
  payload: {
    centerX,
    centerY,
    power,
  },
}) as const

export const zoomOut = (centerX: number, centerY: number, power: number) => ({
  type: C.ZOOM_OUT,
  payload: {
    centerX,
    centerY,
    power,
  },
}) as const

export const zoomToFit = () => ({
  type: C.ZOOM_TO_FIT,
  payload: {},
}) as const

export type IAction =
  | ReturnType<typeof setEngineMode>
  | ReturnType<typeof setSchema>
  | ReturnType<typeof patchSchema>
  | ReturnType<typeof removeFromSchema>
  | ReturnType<typeof setViewPort>
  | ReturnType<typeof setResolution>
  | ReturnType<typeof zoomIn>
  | ReturnType<typeof zoomOut>
  | ReturnType<typeof zoomToFit>
  | ReturnType<typeof setGridSize>
