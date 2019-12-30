import { combineReducers } from 'redux'

import { COMPONENT_NAME as DIAGRAM_NAMESPACE } from './modules/Diagram/constants'

import diagramReducer, { IReduxState as IDiagramReduxState } from './modules/Diagram/reducer'

export interface IRootReduxState {
  [DIAGRAM_NAMESPACE]: IDiagramReduxState;
}

const rootReducerShape = {
  [DIAGRAM_NAMESPACE]: diagramReducer,
}

const combinedReducers = combineReducers(rootReducerShape)

export default combinedReducers
