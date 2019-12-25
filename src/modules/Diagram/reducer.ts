import { IAction } from './actions'

export const initialState = {
  bar: false as boolean,
} as const

export type IReduxState = typeof initialState

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

    default: {
      return state
    }

  }
}
