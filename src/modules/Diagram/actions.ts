
import { Rectangle } from '../../atoms'

import { IDiagramSchema, IEntitySchema, ILinkSchema } from './reducer'

import * as C from './constants'

export const patchEntitySchema = (update: { [id: string]: IEntitySchema }) => ({
  type: C.PATCH_ENTITY_SCHEMA,
  payload: {
    update,
  },
}) as const

export const patchLinkSchema = (update: { [id: string]: ILinkSchema }) => ({
  type: C.PATCH_LINK_SCHEMA,
  payload: {
    update,
  },
}) as const

export const removeEntityFromSchema = (id: string) => ({
  type: C.REMOVE_ENTITY_FROM_SCHEMA,
  payload: {
    id,
  },
}) as const

export const removeLinkFromSchema = (id: string) => ({
  type: C.REMOVE_LINK_FROM_SCHEMA,
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
  | ReturnType<typeof patchEntitySchema>
  | ReturnType<typeof patchLinkSchema>
  | ReturnType<typeof removeEntityFromSchema>
  | ReturnType<typeof removeLinkFromSchema>
  | ReturnType<typeof setViewPort>
  | ReturnType<typeof setResolution>
  | ReturnType<typeof zoomIn>
  | ReturnType<typeof zoomOut>
  | ReturnType<typeof zoomToFit>
