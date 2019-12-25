import { IRootReduxState } from '../../reducer'

import { COMPONENT_NAME } from './constants'

export const getViewport = (state: IRootReduxState) => state[COMPONENT_NAME].viewport
