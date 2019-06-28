'use strict'

const esx = require('esx')()

const NODE_ENV = process.env.NODE_ENV

function Error ({error}) {
  const { message, stack } = error
  if (NODE_ENV !== 'production') {
    return esx `
      <details> 
       <summary>Error: ${message} </summary>
       <pre> ${stack} </pre>
      </details>
    `
  }
  return esx `<div> Error </div>`
}

module.exports = Error



