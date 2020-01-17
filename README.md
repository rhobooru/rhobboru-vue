[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Frhobooru%2Frhovue%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/rhobooru/rhovue/goto?ref=master)

# rhovue

> Official web frontend for [rhobooru](https://github/com/rhobboru/rhobooru)

rhovue is a Single Page Application built on `Nuxt`->`Vue`->`Vuetify` to offer a beautiful, responsive, statically hosted frontend for any [rhobooru](htps://github/com/rhobboru/rhobooru) server.

rhovue offers 100% feature parity with the official [rhobooru](https://github/com/rhobboru/rhobooru) API and is the most stable way to interact with [rhobooru](https://github/com/rhobboru/rhobooru) services. rhovue and [rhobooru](https://github/com/rhobboru/rhobooru) features are developed in tandem and releases will always have the same [major].[minor] version numbers, according to semantic versioning.

If you're looking for an all-in-one version of [rhobooru](https://github/com/rhobboru/rhobooru) for personal use, check out our docker image, instead: [rhodock](https://github.com/rhobooru/rhodock)

## Development

To develop locally, you'll need `Node.js 12` and `npm` installed. You will also likely need a [rhobooru](https://github/com/rhobboru/rhobooru) server running somewhere to develop against.

Clone the repository
```bash
git clone https://github.com/rhobooru/rhovue
cd rhovue
```

Make sure you're on the dev branch
```branch
git checkout dev
```

Install the project dependencies
``` bash
npm run install
```

Start the hot-reload dev server
```bash
npm run dev
```

Navigate to `http://localhost:3000`. Changes made to the source files will automatically be reflected in the open browser window.

Tests can be run with
```bash
npm run test
```

### Production Build

To build the `/dist` folder for deployment, run
```bash
npm run build
```

Nuxt will automatically build the site in `SPA` mode.

To test the production build, run
```bash
npm run start
```
and navigate to `http://localhost:3000`. Changes to the source files in this mode will not be seen until you run `npm run build` again.

You can then publish the `/dist` folder to a hosting environment online.
