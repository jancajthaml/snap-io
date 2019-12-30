import { createStore, applyMiddleware,compose, Store, AnyAction } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from'redux-saga/effects'
import saga from './saga'
import rootReducer, { IRootReduxState } from './reducer'

const sagaMiddleware = createSagaMiddleware()

export type IReduxStore = Store<IRootReduxState, AnyAction>;

export default function configureStore(initialState = {}): IReduxStore {
  const enhancers = [sagaMiddleware]

  const store = createStore(
    rootReducer,
    initialState,
    compose(...[applyMiddleware(...enhancers)]),
  )

  sagaMiddleware.run(function * rootSaga() {
    yield all(saga.map(fork))
  })

  return store
}
