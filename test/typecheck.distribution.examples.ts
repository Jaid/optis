import type {OptisParameter, OptisProcessed, OptisProcessedMap, ProcessedOptionsMap, RequiredOptionsError} from 'optis'

import optis from 'optis'

const schema = optis({
  defaults: {
    name: 'project',
  },
})
const withNamespaceHelpers = (options: optis.Parameter<typeof schema>) => {
  const processedOptions: optis.Processed<typeof schema> = schema.process(options)
  const processedOptionsMap: optis.ProcessedMap<typeof schema> = schema.processMap(options)
  const processedOptionsMapClass: typeof ProcessedOptionsMap = optis.ProcessedOptionsMap
  const requiredOptionsErrorClass: typeof RequiredOptionsError = optis.RequiredOptionsError
  processedOptionsMapClass
  requiredOptionsErrorClass
  return [processedOptions, processedOptionsMap]
}
const withNamedAliases = (options: OptisParameter<typeof schema>) => {
  const processedOptions: OptisProcessed<typeof schema> = schema.process(options)
  const processedOptionsMap: OptisProcessedMap<typeof schema> = schema.processMap(options)
  return [processedOptions, processedOptionsMap]
}
withNamespaceHelpers
withNamedAliases
