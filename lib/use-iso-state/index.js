'use strict'

const { useState } = require('react')

var _INITIAL_STATE_ = {}
const kKey = Symbol('key')

function useIsoState (initialState, key) {
  const [state, update] = useState(initialState)
  if (kKey in state && state[kKey] !== key) {
    return [ initialState, update ]
  }
  state[kKey] = key
  _INITIAL_STATE_[key] = state
  return [ _INITIAL_STATE_[key], update ]
}

useIsoState.inlineState = () => {
  const state = _INITIAL_STATE_
  _INITIAL_STATE_ = {}
  return JSON.stringify(state)
}

module.exports = useIsoState