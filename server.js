'use strict'
const path = require('path')
const AutoLoad = require('fastify-autoload')
const { extreme, final } = require('pino')

function server (fastify, opts, next) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  configureLogger(fastify)

  next()
}

server.options = {
  logger: { stream: extreme(1) }
}

module.exports = server

function configureLogger(fastify) {
  // asynchronously flush every 10 seconds to keep 
  // logging the buffer empty in periods of low activity
  setInterval(() => {
    fastify.log.flush()
  }, 10000).unref()

  // use pino.final to create a special logger that
  // guarantees final tick writes
  const handler = final(fastify.log, (err, finalLogger, evt) => {
    finalLogger.info(`${evt} caught`)
    if (err) finalLogger.error(err, 'error caused exit')
    process.exit(err ? 1 : 0)
  })
  // catch all the ways node might exit
  process.on('beforeExit', () => handler(null, 'beforeExit'))
  process.on('exit', () => handler(null, 'exit'))
  process.on('uncaughtException', (err) => handler(err, 'uncaughtException'))
  process.on('SIGINT', () => handler(null, 'SIGINT'))
  process.on('SIGQUIT', () => handler(null, 'SIGQUIT'))
  process.on('SIGTERM', () => handler(null, 'SIGTERM'))


  // flush out the first logger messages after server start
  fastify.ready(() => {
    const { info } = fastify.log
    fastify.log.info = (...args) => {
      const result = info.apply(fastify.log, args)
      fastify.log.flush()
      return result
    }
    setTimeout(() => {
      fastify.log.info = info
    }, 100)
  })
}