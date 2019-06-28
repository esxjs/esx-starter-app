'use strict'
const { hydrate } = require('react-dom')
const { BrowserRouter } = require('react-router-dom')
const { renderRoutes } = require('react-router-config')
const esx = require('esx')({ LoggingRouter, BrowserRouter })
const production = process.env.NODE_ENV === 'production'

// client side logging is silent in production
const logger = require('pino')({
  level: production ? 'silent' : 'info'
})

function LoggingRouter ({history, children}) {
  return esx `
    <BrowserRouter history=${history} logger=${logger}>
      ${children}
    </BrowserRouter>
  `
}

function router (routes = []) {
  return async (mount) => {
    if (routes.length === 0) return
    hydrate(esx `
      <LoggingRouter> ${renderRoutes(routes)} </LoggingRouter>
    `, mount)
  }
}

module.exports = router