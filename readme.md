<h1 align="center">esx-starter-app</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

A starter app for high performance React SSR with [ESX](https://github.com/esxjs/esx).

## Status

Experimental

## Philosophy & Goals

* All decisions are driven by achieving the fastest possible SSR
* Low configuration overhead
* Driving towards zero transpilation development environments for both client and server
  * As close as possible
  * Must evolve over time

## Clone

```sh
git clone https://github.com/esxjs/esx-starter-app
```

## Install

```sh
npm install
```


## Development

Use two terminals to run the following commands.

Watch files and rebuild ismorphic code:

```sh
npm run watch
```

Watch files and restart server:

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Production

Build the dist folder, deploy the project. 

Start production server with:

```sh
npm start
```

## Run tests

```sh
npm test
```

## Internal Architecture

Every choice made for the IA of the ESX Server is made in the context of ensuring
the highest performing server as a basis for creating an Ismorphic/Universal SSR React application with ESX.

### Server

The server is set up with the [fastify](https://fastify.io) framework.

The `server.js` file in project root is configured to auto load fastify 
configuration from the `plugins` and `routes` folders.

### Plugins

Drop new [fastify plugin](https://www.fastify.io/docs/latest/Plugins/) files
into the plugin folder and they will be automatically loaded. 

The plugin folder contains a `development.js` file, which configures fastify
with convenient defaults which are not recommended for production. See `plugins/development.js` for more information.

### Universal Routing

The `routes` folder contains three subfolders:

* server
* client
* universal


The `client/index.js` and `universal/index.js` files define route structures
using the [React Router Config data structure](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config). Universal routes are loaded
both into react router on the client, and fastify on the server.

The `server` folder can have additionally files dropped into it with [fastify routes](https://www.fastify.io/docs/latest/Routes/). See `server/index.js` for an example.

See the `lib/router` folder to find out how universal routing is achieved.

### SSR HTML

The Server Side Rendered HTML is generated from the `html.js` file in the 
project root. This is the outer HTML (head, body, and so forth) in which
the react application is nested. See the `html.js` file for more information.

### State Management

The `lib/use-api` folder contains an isomorphic React hook which is stateful
on both the server side and client side – thanks to the [ESX opt-in for
stateful hooks](https://github.com/esxjs/esx#createesxssroptionhooks-mode-compatiblestateful). 

The `useApi` hook depends on the  `useIsoState` hook (`lib/use-iso-state`) which
exposes state generated server side to be rendered inline in the HTML so that
client side hydration can avoid a flash of unstyled content.


### Pages & Components

React components live in the `pages` and `components` folders. Pages are 
components should be referenced by the routers, whereas modules in 
the `components` folder make up the pages.

It's recommended that pages handle state, ideally using [React hooks](https://reactjs.org/docs/hooks-intro.html) while components remain pure, taking props
and outputting ESX.

### CSS

The lightest possible CSS SSR solution is one that requires no server
side generation per request. This starter uses a customizable build
of [tachyons](https://tachyons.io).

This ensures high speed SSR, along with very small CSS payloads.

The trade off is the requirement to understand tachyons class name conventions, 
[tachyons tldr](https://tachyons-tldr.now.sh/#/classes) is a very helpful reference
and way to get started.

In development, the css assets are generated whenever the server restarts.
For production, `npm run build` will generated CSS assets which should be
appropriately deployed (e.g. S3 etc.) and referenced in app.

The `styles/guide.html` is generated every time CSS assets are built. 
This provides a comprehensive style guide. 

The `styles/config.js` file can be used to configure all color alias
and typography and spacing scales.

The `styles/extra.css` can be used to add additional class rules.

### Test Strategy

When creating components we tend to use a visual workflow, because 
of this constant feedback loop the personal need to write tests becomes
lower priority because we're constantly testing with visual checks. 

However, we also want to avoid regressions and ensure we have a
checkpoint for correct component output. We can capture value of
personal visual checks by using snapshot testing. 

When a component is considered ready, run `npm test` making sure
nothing is failing. Then write a snapshot test. Here's an example
from `test/component/Hello/index.test.js`:

```js
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
```

Once complete, run `npm run snapshot`. This will add the snapshot for the component
to the `tap-snapshots` folder. Check all code in `tap-snapshots` into git. If at 
any time a snapshot test fails, it means that the there may be a regression. 
We should know from the diff whether the alteration was deliberate or not.
If not, we can fix our code. If it was deliberate we can run `npm run snapshot`
again to update the snapshots. 

By rendering the component to a string (`esx.ssr` is an alias for `esx.renderToString`)
and making a snapshot we are capturing all html structure and styling.
This allow for high fidelity testing at relatively low cost.

To test the behaviour of components install and use a suitable react testing helper
library. 

To test server routes, use see [Fastify Testing](https://github.com/fastify/fastify/blob/master/docs/Testing.md).


### Build Process

Styles are generated with tachyons tooling in `styles/build.js`, all
other assets are built using [ParcelJs](https://parceljs.org/).

This allows for minimal configuraton workflows. See <https://parceljs.org/>
for more information.


### Dotenv

Two environment variables can be used to configure the server, using
a [dotenv](https://github.com/motdotla/dotenv#readme) configuration file
in the project root:

```sh
DOMAIN = 'http://localhost:3000' # default host
API = 'http://jsonplaceholder.typicode.com' # default api
```

A `.env` file is not included as it's best practice to avoid checking 
in `.env` files.

### Deployment Tips

* Serve dist as a static folder (e.g. with nginx, or deploy to S3 etc.)
* Ensure the dist folder is included on the deployment machine/container volume (e.g. include in your Dockerfile or terraform scripts etc.)
