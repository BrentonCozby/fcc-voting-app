// @flow

import React from 'react'
import ReactDOM from 'react-dom'

// flow-disable-next-line
import './scss/base.scss'

// AppContainer is a necessary wrapper component for HMR
import { AppContainer } from 'react-hot-loader'

import App from './components/App.jsx'

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>, document.getElementById('root'))
}

render(App)

// Hot Module Replacement API
if (module.hot) {
    // flow-disable-next-line
    module.hot.accept('./components/App.jsx', () => {
        render(App)
    })
}
