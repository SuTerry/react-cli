import 'core-js/es/map'
import 'core-js/es/set'
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

import './index.less'


// import App from './App'

const rootDom = document.getElementById('root')

const env = process.env.WEB_ENV

ReactDom.render(
  <App />
  , rootDom)