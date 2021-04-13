import 'core-js/es/map'
import 'core-js/es/set'
import React from 'react'
import ReactDom from 'react-dom'

import './index.less'


// import App from './App'

const rootDom = document.getElementById('root')

const env = process.env.WEB_ENV

ReactDom.render(<h1>{env}</h1>, rootDom)


const p = new Promise(resolve => {
  // resolve(1111)
})

// p.then(res => console.log(res))

import('./aa').then(aa => {
  // console.log(aa.default())
})


