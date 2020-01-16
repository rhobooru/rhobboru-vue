[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Frhobooru%2Frhovue%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/rhobooru/rhovue/goto?ref=master)

# rhovue

> Official web frontend for [rhobooru](htps://github/com/rhobboru/rhobooru) backend servers.


## Development

To develop locally, you'll need `Node.js 12` and `npm` installed.

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

Navigate to `http://localhost:3000`

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

You can then publish the `/dist` folder to a hosting environment online.
