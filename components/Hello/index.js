'use strict'

const esx = require('esx')()

function Hello ({name, email, phone, website }) {
  return esx `
    <header className="avenir ph4-ns pt4 pt5-ns">
      <h1 key="1" className="f3 f2-m measure lh-title fw1 mt0 ml4">Hello my name is...</h1>
      <h2 key="2" className="f4 f3-m measure lh-title fw1 mt0 ml4">${name}</h2>
      <dl key="3" className="lh-title pa4 mt0 pt0">
      <dt key="4" className="f6 b">Email</dt>
      <dd key="5" className="ml0">${email}</dd>
      <dt key="6" className="f6 b mt2">Phone</dt>
      <dd key="7" className="ml0">${phone}</dd>
      <dt key="8" className="f6 b mt2">Website</dt>
      <dd key="9" className="ml0">${website}</dd>
    </dl>
    </header>
  `
}

module.exports = Hello

