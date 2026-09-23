import optis from 'optis'

type Equal<LeftGeneric, RightGeneric> = (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2)
  ? (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2)
    ? true
    : false
  : false

type Expect<ConditionGeneric extends true> = ConditionGeneric

const greetingSchema = optis({
  defaults: {
    target: 'world',
  },
})

type _GreetingParameter = Expect<Equal<optis.Parameter<typeof greetingSchema>, {target?: string} | undefined>>
type _GreetingProcessed = Expect<Equal<optis.Processed<typeof greetingSchema>, {target: string}>>

const greet = (options: optis.Parameter<typeof greetingSchema>) => {
  const processedOptions = greetingSchema.process(options)
  const target: string = processedOptions.target
  return `Hello, ${target}!`
}
const apiSchema = optis({
  requiredKeys: ['apiKey'] as const,
})

type _ApiParameter = Expect<Equal<optis.Parameter<typeof apiSchema>, {apiKey: unknown}>>

const withApiKey = (options: optis.Parameter<typeof apiSchema>) => {
  apiSchema.check(options)
  return `API key is ${String(options.apiKey)}`
}

type CompileTimeSchema = optis.Schema<{
  required: {
    target: string
  }
}>

type _CompileTimeParameter = Expect<Equal<optis.Parameter<CompileTimeSchema>, {target: string}>>

const compileOnly = (options: optis.Parameter<CompileTimeSchema>) => {
  const target: string = options.target
  return `Hello, ${target}!`
}
const mapSchema = optis.typed<{
  optional: {
    target: string
  }
}>

type _MapParameter = Expect<Equal<optis.Parameter<typeof mapSchema>, {target?: string} | undefined>>
type _MapProcessed = Expect<Equal<optis.Processed<typeof mapSchema>, {target?: string}>>

const getMessage = (options: optis.ProcessedMap<typeof mapSchema>) => {
  if (!options.has('target')) {
    return 'Hello!'
  }
  const target: string = options.get('target')
  return `Hello, ${target}!`
}
const greetMaybe = (options: optis.Parameter<typeof mapSchema>) => {
  const processedOptions = mapSchema.processMap(options)
  return getMessage(processedOptions)
}
const runtimeFirstSchema = optis({
  defaults: {
    cwd: process.cwd(),
  },
}).extendTyped<{
  optional: {
    user: string
  }
}>()

type _RuntimeFirstProcessed = Expect<Equal<optis.Processed<typeof runtimeFirstSchema>, {
  cwd: string
  user?: string
}>>

const runRuntimeFirst = (options: optis.Parameter<typeof runtimeFirstSchema>) => {
  const processedOptions = runtimeFirstSchema.process(options)
  const cwd: string = processedOptions.cwd
  if (processedOptions.user) {
    const user: string = processedOptions.user
    return `${cwd}:${user}`
  }
  return cwd
}
const typeFirstSchema = optis.typed<{
  optional: {
    user: string
  }
}>().extend({
  defaults: {
    cwd: process.cwd(),
  },
})

type _TypeFirstProcessed = Expect<Equal<optis.Processed<typeof typeFirstSchema>, {
  cwd: string
  user?: string
}>>

const defaults = {
  host: 'example.com',
  protocol: 'https',
  userAgent: `Bun/${Bun.version}`,
}
const apiClientSchema = optis({defaults}).extendTyped<{
  optional: {
    headers: Map<string, string>
    prefix: string
  }
}>()

type _ApiClientProcessed = Expect<Equal<optis.Processed<typeof apiClientSchema>, {
  headers?: Map<string, string>
  host: string
  prefix?: string
  protocol: string
  userAgent: string
}>>

const civitaiSchema = apiClientSchema.extend({
  host: 'civitai.com',
  prefix: 'api/v1',
}).extendTyped<{
  required: {
    key: string
  }
}>()

type _CivitaiParameter = Expect<Equal<optis.Parameter<typeof civitaiSchema>, {
  headers?: Map<string, string>
  host?: string
  key: string
  prefix?: string
  protocol?: string
  userAgent?: string
}>>
type _CivitaiProcessed = Expect<Equal<optis.Processed<typeof civitaiSchema>, {
  headers?: Map<string, string>
  host: string
  key: string
  prefix: string
  protocol: string
  userAgent: string
}>>

const useApiClientSchema = (options: optis.Parameter<typeof apiClientSchema>) => {
  const processedOptions = apiClientSchema.process(options)
  const headers = processedOptions.headers ? Object.fromEntries(processedOptions.headers) : {}
  headers['user-agent'] = processedOptions.userAgent
  const fullPath = processedOptions.prefix ? `${processedOptions.prefix}/models` : 'models'
  return `${processedOptions.protocol}://${processedOptions.host}/${fullPath}`
}
const useCivitaiSchema = (options: optis.Parameter<typeof civitaiSchema>) => {
  const processedOptions = civitaiSchema.process(options)
  const headers = processedOptions.headers ? Object.fromEntries(processedOptions.headers) : {}
  headers['user-agent'] = processedOptions.userAgent
  headers.authorization = `Token ${processedOptions.key}`
  const baseProcessed = apiClientSchema.process(processedOptions)
  return `${baseProcessed.protocol}://${baseProcessed.host}/${processedOptions.prefix}`
}
greet
withApiKey
compileOnly
greetMaybe
runRuntimeFirst
useApiClientSchema
useCivitaiSchema
