'use strict'

const router = require('../../lib/router')

// const SomeClientOnlyPage = require('../../pages/some-client-only-page')

// React Router Config model:
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config


const routes = [ /*
  {
    path: "/some-client-only-route",
    component: SomeClientOnlyPage
  }
  */
]

module.exports = router(routes)

// stop fastify from loading this as a server route
module.exports.autoload = false
