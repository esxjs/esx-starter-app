'use strict'

const router = require('../../lib/router')

const Index = require('../../pages/index')

// React Router Config model:
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

const routes = [
  {
    path: "/",
    exact: true,
    component: Index
  },
  {
    path: "/id/:id",
    exact: true,
    component: Index
  }
]

module.exports = router(routes)