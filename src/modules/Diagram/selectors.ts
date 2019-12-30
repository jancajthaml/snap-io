import { IRootReduxState } from '../../reducer'

import { COMPONENT_NAME } from './constants'

export const getViewport = (state: IRootReduxState) => state[COMPONENT_NAME].viewport

export const getResolution = (state: IRootReduxState) => state[COMPONENT_NAME].resolution

export const getSchema = (state: IRootReduxState) => state[COMPONENT_NAME].schema
