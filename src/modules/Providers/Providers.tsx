import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import configureStore, { IReduxStore } from '../../store'

interface IProps {
  children?: React.ReactNode;
}

interface IState {
  store: IReduxStore
}

class Providers extends React.Component<IProps, IState> {

  state: IState;

  constructor(props: IProps) {
    super(props)
    this.state = {
      store: configureStore(),
    }
  }

  render() {
    return (
      <ReduxProvider store={this.state.store}>
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      </ReduxProvider>
    )
  }
}

export default Providers

