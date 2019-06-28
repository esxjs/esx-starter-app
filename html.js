'use strict'

const { DOMAIN = 'http://localhost:3000' } = process.env
const { NODE_ENV = 'development' } = process.env
const dev = (NODE_ENV === 'development')
const styles = require('./styles')
const css = dev ? 'main.css' : 'main.min.css'
const { inlineState } = require('./lib/use-iso-state')

module.exports = (esx, { match, logger }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My App</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta id="theme-color" name="theme-color" content="#4527A0">
    <link rel="manifest" href="${DOMAIN}/manifest.json">
    <link rel="shortcut icon" href="${DOMAIN}/favicon.png" sizes="144x144" type="image/png">
    <link rel="stylesheet" type="text/css" href="${DOMAIN}/${css}">
  </head>
  <body>
    <div id="app">${esx.renderToString `<Page match=${match} logger=${logger}/>`}</div>
    <script>window._INITIAL_STATE_ = ${inlineState()}</script>
    <script src="${DOMAIN}/main.js"></script>
  </body>
</html>
`

// generate style assets on server start when in dev mode
if (dev) setTimeout(styles, 150)
