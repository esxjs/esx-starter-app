'use strict'
const path = require('path')
const AutoLoad = require('fastify-autoload')

function server (fastify, opts, next) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  next()
}

server.options = {
  logger: { level: 'silent' }
}

module.exports = server
