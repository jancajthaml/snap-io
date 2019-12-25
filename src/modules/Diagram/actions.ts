
import Rectangle from '../../atoms/Rectangle'

import { SET_VIEWPORT } from './constants'

export const setViewPort = (viewport: Rectangle) => ({
  type: SET_VIEWPORT,
  payload: {
    viewport,
  },
}) as const

export type IAction =
  | ReturnType<typeof setViewPort>
