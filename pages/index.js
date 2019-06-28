'use strict'
const { useRef } = require('react')
const esx = require('esx')({
  Hello: require('../components/Hello'),
  Error: require('../components/Error')
})

const useApi = require('../lib/use-api')

function Index ({ match, logger }) {
  const { params } = match
  const { id = "1" } = params
  const l = 'loading...'
  const { error, name, email, phone, website } =  useApi(
    `/users/${id}`,
    {name: l, email: l, phone: l, website: l},
    { logger }
  )
  if (error) {
    logger.error(error)
    return esx `<Error error=${error}/>`
  }
  
  return esx `<div><Hello name=${name} email=${email} phone=${phone} website=${website}/></div>`
}

module.exports = Index