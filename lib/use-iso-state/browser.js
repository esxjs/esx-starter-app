'use strict'

const { useState } = require('react')

const { _INITIAL_STATE_ } = window

function useIsoState (initialState, key) {
  const state = _INITIAL_STATE_[key] || initialState
  delete _INITIAL_STATE_[key]
  return useState(state)
}

module.exports = useIsoState