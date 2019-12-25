import { IAction } from './actions'

import Rectangle from '../../atoms/Rectangle'

import { SET_VIEWPORT } from './constants'

export const initialState = {
  viewport: new Rectangle() as Rectangle,
} as const

export type IReduxState = typeof initialState

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

    case SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload.viewport,
      }
    }

    default: {
      return state
    }

  }
}
