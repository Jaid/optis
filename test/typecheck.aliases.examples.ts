import type {OptisDict, OptisParameter, OptisProcessed, OptisProcessedMap, OptisSchema, OptisSetup, OptisTypedFactory} from 'optis'

import optis from 'optis'

type Equal<LeftGeneric, RightGeneric> = (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2)
  ? (<ValueGeneric>() => ValueGeneric extends RightGeneric ? 1 : 2) extends (<ValueGeneric>() => ValueGeneric extends LeftGeneric ? 1 : 2)
    ? true
    : false
  : false

type Expect<ConditionGeneric extends true> = ConditionGeneric

type ExampleSchema = OptisSchema<{
  defaults: {
    target: string
  }
  required: {
    apiKey: string
  }
}>

const schema = optis({
  defaults: {
    target: 'world',
  },
})
const typedFactory: OptisTypedFactory = optis.typed
const typedSchema = typedFactory<{
  optional: {
    target: string
  }
}>()

type _DictAliasIsUsable = Expect<Equal<OptisDict<string>, Record<string, string>>>
type _SetupAliasMatchesNamespace = Expect<Equal<OptisSetup['requiredKeys'], optis.Setup['requiredKeys']>>
type _ParameterAliasMatchesNamespace = Expect<Equal<OptisParameter<typeof schema>, optis.Parameter<typeof schema>>>
type _ProcessedAliasMatchesNamespace = Expect<Equal<OptisProcessed<typeof schema>, optis.Processed<typeof schema>>>
type _ProcessedMapAliasMatchesNamespace = Expect<Equal<OptisProcessedMap<typeof typedSchema>, optis.ProcessedMap<typeof typedSchema>>>
type _SchemaAliasIsUsable = Expect<Equal<OptisParameter<ExampleSchema>, {apiKey: string
  target?: string}>>

const greet = (options: OptisParameter<typeof schema>) => {
  const processedOptions: OptisProcessed<typeof schema> = schema.process(options)
  return processedOptions.target
}
const getMessage = (options: OptisProcessedMap<typeof typedSchema>) => {
  if (!options.has('target')) {
    return 'Hello!'
  }
  const target: string = options.get('target')
  return `Hello, ${target}!`
}
const compileOnly = (options: OptisParameter<ExampleSchema>) => {
  return options.target ? `${options.target}:${options.apiKey}` : options.apiKey
}
void greet
void getMessage
void compileOnly
void typedFactory
