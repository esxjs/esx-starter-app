'use strict'
const { API = 'http://jsonplaceholder.typicode.com' } = process.env
const { finished } = require('stream')
const { Pool } = require('undici')
const useIsoState = require('../use-iso-state')
const noopLogger = require('pino')({silent: true})
const apiClient = new Pool(API, {pipelining: 1000})
const lru = require('hashlru')
const cache = lru(100)

function request(opts, cb) {
  apiClient.request(opts, (err, response) => {
    if (err) {
      cb(err)
      return
    }
    const { statusCode, body } = response

    if (statusCode !== 200) {
      const err = Error(`Not ok: ${statusCode}`)
      err.statusCode = statusCode
      cb(err)
      return
    }
    var chunks = ''
    body.on('data', (chunk) => { chunks += chunk })
    finished(body, (err) => {
      if (err) {
        cb(err)
        return
      }
      try { 
        const result = JSON.parse(chunks)
        cb(null, result)
      } catch (e) {
        cb(e)
      }
    })
  })
}

function useApi (fetchOpts, initialState, opts = {}) {
  const { 
    mapErrorState = (e) => ({error: e}),
    logger = noopLogger
  } = opts

  if (typeof fetchOpts === 'string') fetchOpts = {path: fetchOpts, method: 'GET'}
  const [ state, update] = useIsoState(initialState, fetchOpts.path)
  
  if (fetchOpts.method !== 'GET') {
    // ignore non-idempotent request on the server side
    return state
  }
  const cachedResult = cache.get(fetchOpts.path)

  if (cachedResult !== undefined) { 
    update(cachedResult)  
    request(fetchOpts, (err, result) => {
      if (err) {
        logger.error(err)
        return
      }
      cache.set(fetchOpts.path, result)
    })
    return state
  }

  request(fetchOpts, (err, result) => {
    if (err) {
      update(mapErrorState(err))
      return
    }
    update(result)
    cache.set(fetchOpts.path, result)
  })
  return state
}

module.exports = useApi