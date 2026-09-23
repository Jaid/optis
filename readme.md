<center><a href="https://npmjs.com/package/optis"><img src="https://shieldcn.dev/npm/v/optis.svg?variant=secondary&logo=npm&label=latest+version" alt="Latest version on npm"/></a> <a href="https://github.com/Jaid/optis/raw/HEAD/license.txt"><img src="https://shieldcn.dev/github/license/Jaid/optis.svg?variant=secondary" alt="License"/></a></center>

# optis

minimalistic library for building composable options processors

## minimal example

```ts
import optis from 'optis'

const schema = optis({
  defaults: {
    target: 'world',
  },
})

export default (options: optis.Parameter<typeof schema>) => {
  const processedOptions = schema.process(options)
  return `Hello, ${processedOptions.target}!`
}
```

## installation

<a href="https://npmjs.com/package/optis"><img src="https://shieldcn.dev/badge/npm-optis-C23039.svg?variant=secondary&logo=npm" alt="optis on npm"/></a>

```sh
npm install --save optis
```

## usage

The default export also carries the public type helpers, so `optis.Parameter<typeof schema>`, `optis.Processed<typeof schema>` and `optis.Schema<...>` work without a second `import type`.

If you prefer direct named type imports, the same helpers are also exported as `OptisParameter`, `OptisProcessed`, `OptisProcessedMap`, `OptisSchema`, `OptisSetup` and related aliases.

```ts
import optis, {type OptisParameter} from 'optis'

const schema = optis({
  defaults: {
    target: 'world',
  },
})

export default (options: OptisParameter<typeof schema>) => {
  const processedOptions = schema.process(options)
  return `Hello, ${processedOptions.target}!`
}
```

Type-only and runtime features can be composed by chaining `.extend()` and `.extendTyped()`.

```ts
import optis from 'optis'

const schema = optis({
  defaults: {
    cwd: process.cwd(),
  },
}).extendTyped<{
  optional: {
    user: string
  }
}>()

export default (options: optis.Parameter<typeof schema>) => {
  const processedOptions = schema.process(options)
  if (processedOptions.user) {
    console.log(`USER=${processedOptions.user}`)
  }
}
```

## development

Maintain README content in `docs/tldw`. Do not edit `readme.md` directly.

`bun run readme` regenerates it. `bun run build` regenerates the README before building the package.

### setting up

```sh
git clone git@github.com:Jaid/optis.git
cd optis
bun install
```

### testing

```sh
bun run test
```

## license

[MIT License](https://github.com/Jaid/optis/raw/HEAD/license.txt)<br>
Copyright © 2026, Jaid \<jaid.jsx@gmail.com> (https://github.com/jaid)

<!--
readme generated with tldw v9.7.0 from ./docs/tldw
github.com/Jaid/tldw
-->
