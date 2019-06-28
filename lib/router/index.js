'use strict'
const createEsx = require('esx')
const html = require('../../html')

createEsx.ssr.option('hooks-mode', 'stateful')

const esx = createEsx({Page: () => {}})

function router (routes) {
  return async (fastify) => {
    for (const {path, exact, component} of routes) {
      if (exact !== true) {
        throw Error('All server routes should have exact:true to avoid parial matching.')
      }
      // use register to validate each component
      esx.register.one('Page', component) 
      // preinit and hydrate server side state for all routes
      const props = { match: { params: {}, path, url: '', isExact: exact } , logger: fastify.log}
      html(esx, props)

      fastify.get(path, async (request, reply) => {
        const params = request.params
        const props = { match: { params, path, url: request.raw.url, isExact: exact }, logger: request.log }
        // allows for a dynamic <Page> component in html
        // <Page> will be whatever the entry component is
        // for this route, using lax bypasses validation
        esx.register.one.lax('Page', component)
        reply.type('text/html')
        reply.send(html(esx, props))
      })
    }
  }  
}

module.exports = router