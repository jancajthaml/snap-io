import { IRootReduxState } from '../../reducer'

import { COMPONENT_NAME } from './constants'

export const getViewport = (state: IRootReduxState) => state[COMPONENT_NAME].viewport

export const getResolution = (state: IRootReduxState) => state[COMPONENT_NAME].resolution

export const getVisible = (state: IRootReduxState) => state[COMPONENT_NAME].visible

export const getSelected = (state: IRootReduxState) => state[COMPONENT_NAME].selected

export const getElements = (state: IRootReduxState) => state[COMPONENT_NAME].elements
