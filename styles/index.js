'use strict'
/*
  How to use:

    Use styles/config.js to configure colors and scales

    Use styles/extra.css to add more custom css

    Use styles/guide.html to view the generated style guide
    (will not include additional custom css)

    For production, this module is used in styles/build.js to
    generate the css asset.

    In development this module is instantiated in `html.js` 
    and regenerates styles every time the server starts.
*/

const fs = require('fs')
const { resolve, join } = require('path')
const buildCss = require('tachyons-build-css')
const tachyonsGenerator = require('tachyons-generator')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

const config = require('./config.js')

async function generate ({display} = {}) {
  const warn = console.warn
  console.warn = () => {} // ignore irrelevant postcss warnings
  try {
    const tachy = tachyonsGenerator(config)
    const extraCss = await readFile(join(__dirname, 'extra.css'))
    const minExtraCss = await buildCss(extraCss, {
      minify: true
    })
    try {
      await mkdir(resolve(__dirname, '..', 'dist'))
    } catch (e) {}
    const { css, min, docs} = await tachy.generate()
    writeFile(resolve(__dirname, 'guide.html'), docs)
    if (display) console.log('generated styles/guide.html')
    writeFile(resolve(__dirname, '..', 'dist', 'main.css'), `${css}\n${extraCss}`)
    if (display) console.log('generated dist/main.css')
    writeFile(resolve(__dirname, '..', 'dist', 'main.min.css'), `${min}${minExtraCss}`)
    if (display) console.log('generated dist/main.min.css')
  } catch (e) {
    console.error(e)
  } finally {
    console.warn = warn
  }
}

module.exports = generate