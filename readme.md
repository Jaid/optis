# Optis

Minimalistic library for building composable options processors.

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
