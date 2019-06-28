'use strict'
const { useEffect } = require('react')
const API = process.env.API || 'http://jsonplaceholder.typicode.com'
const noopLogger = require('pino')({silent: true})
const useIsoState = require('../use-iso-state')

async function request (url, opts) {
  const res = await fetch(url, opts)
  const { status: statusCode, headers } = res
  const body = await res.json()
  return {statusCode, headers, body}
}

async function load (opts, update, mapErrorState) {
  if (opts.path[0] !== '/') opts.path = '/' + opts.path
  const url = `${API}${opts.path}`
  try { 
    const result = await request(url, opts)
    const { statusCode, body } = result
    if (statusCode !== 200) {
      const err = Error(`Not ok: ${statusCode}`)
      err.statusCode = statusCode
      throw err
    }
    console.log('update pleaze', body)
    update(body)
  } catch (err) {
    update(mapErrorState(err))
  }
}

function useApi (fetchOpts, initialState, opts = {}) {
  const {
    mapErrorState = (e) => ({error: e}),
    logger = noopLogger
  } = opts
  if (typeof fetchOpts === 'string') fetchOpts = { path: fetchOpts }
  const [ state, update ] = useIsoState(initialState, fetchOpts.path)

  useEffect(() => {
    load(fetchOpts, (body) => {
      update(body)
    }, mapErrorState)
  }, [fetchOpts.path])

  if (state.error) {
    logger.error(state.error)
    return state
  }
  return state
}

module.exports = useApi