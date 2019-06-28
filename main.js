'use strict'
if (process.env.NODE_ENV === 'production') {
  require('regenerator-runtime/runtime')
}
const routes = require('./routes/universal')
const container = document.getElementById('app')
routes(container)
