'use strict'
const { resolve } = require('path')
const { NODE_ENV } = process.env

// include any development specific plugins here

async function dev (fastify, opts) {
  if (NODE_ENV === 'production') return

  // we statically host the dist folder for convenience
  // in development, in production static hosting should
  // follow whatever operational choices have been made
  // (e.g., S3, nginx, etc.)
  fastify.register(require('fastify-static'), {
    root: resolve(__dirname, '..', 'dist'),
  })


  // we allow origin all in CORS in development, 
  // and leave unconfigured (and thus locked to same domain)
  // in production - this should be configured as necessary
  // for production, either outside the process or inside as preferred
  fastify.register(require('fastify-cors'), {
    origin: '*'
  })
}

module.exports = dev