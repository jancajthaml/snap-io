export const COMPONENT_NAME = 'diagram' as const

export const SET_GRID_SIZE = 'SET_GRID_SIZE' as const

export const SET_VIEWPORT = 'SET_VIEWPORT' as const

export const SET_SCHEMA = 'SET_SCHEMA' as const

export const PATCH_SCHEMA = 'PATCH_SCHEMA' as const

export const REMOVE_FROM_SCHEMA = 'REMOVE_FROM_SCHEMA' as const

export const SET_RESOLUTION = 'SET_RESOLUTION' as const

export const SET_ENGINE_MODE = 'SET_ENGINE_MODE' as const

export enum EngineMode {
  VIEW = 'ENGINE_MODE_VIEW',
  EDIT = 'ENGINE_MODE_EDIT',
}

export const ZOOM_TO_FIT = 'ZOOM_TO_FIT' as const

export const ZOOM_IN = 'ZOOM_IN' as const

export const ZOOM_OUT = 'ZOOM_OUT' as const

export const MIN_ZOOM = 0.3 as const

export const MAX_ZOOM = 12 as const
