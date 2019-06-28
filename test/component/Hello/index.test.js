'use strict'

const { test } = require('tap')
const esx = require('esx')({
  Hello: require('../../../components/Hello')
})

test('Hello Component Snapshot', async ({ matchSnapshot }) => {
  const name = 'test-name'
  const email = 'test-email'
  const phone = 'test-phone'
  const website = 'test-website'
  matchSnapshot(
    esx.ssr `<Hello name=${name} email=${email} phone=${phone} website=${website}/>`,
    'Hello'
  )
})