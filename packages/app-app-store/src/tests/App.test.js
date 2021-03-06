import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import { composeWithDevTools } from 'redux-devtools-extension'

import App from '../App'
import AppDirectory from '../containers/AppDirectory'
import MyApps from '../containers/MyApps'
import FeaturedApps from '../containers/FeaturedApps'
import NotFoundPage from '../containers/NotFoundPage'
import reducers from '../redux'

const renderWithContext = component => {
  const store = createStore(reducers, composeWithDevTools())
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
    document.createElement('div')
  )
}

describe('Renders without crashing:', () => {
  it('App', () => {
    renderWithContext(<App />)
  })

  describe('Containers', () => {
    it('App Directory', () => {
      renderWithContext(<AppDirectory />)
    })
    it('My Apps', () => {
      renderWithContext(<MyApps />)
    })
    it('Featured Apps', () => {
      renderWithContext(<FeaturedApps />)
    })
    it('404 Not Found', () => {
      renderWithContext(<NotFoundPage />)
    })
  })
})
