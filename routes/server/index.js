'use strict'

module.exports = async (fastify, opts) => {
  fastify.get('/api', async (request, reply) => {
    return { hello: 'world' }
  })
}