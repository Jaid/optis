import type {Dict as DictType,
  Parameter as ParameterType,
  ProcessedMap as ProcessedMapType,
  Processed as ProcessedType,
  Schema as SchemaType,
  Setup as SetupType,
  ToSetupFromInput,
  TypedFactory as TypedFactoryType} from './optis/types.ts'

import {ProcessedOptionsMap as ProcessedOptionsMapValue} from './optis/ProcessedOptionsMap.ts'
import {RequiredOptionsError as RequiredOptionsErrorValue} from './optis/RequiredOptionsError.ts'
import {attachSchemaBehavior, createSchema, toRuntimeState} from './optis/SchemaRuntime.ts'

function optis(): SchemaType
function optis<InputGeneric extends DictType>(input: InputGeneric): SchemaType<ToSetupFromInput<InputGeneric>>
function optis(input?: DictType) {
  return createSchema(toRuntimeState(input))
}
const ProcessedOptionsMapClass = ProcessedOptionsMapValue
const RequiredOptionsErrorClass = RequiredOptionsErrorValue
namespace optis {
  export type Dict<ValueGeneric = unknown> = DictType<ValueGeneric>
  export type Setup = SetupType
  export type Schema<SetupGeneric extends Setup = {}> = SchemaType<SetupGeneric>
  export type Parameter<InputGeneric> = ParameterType<InputGeneric>
  export type Processed<InputGeneric> = ProcessedType<InputGeneric>
  export type ProcessedMap<InputGeneric> = ProcessedMapType<InputGeneric>
  export const typed = optis as unknown as TypedFactoryType
  export const ProcessedOptionsMap = ProcessedOptionsMapClass
  export const RequiredOptionsError = RequiredOptionsErrorClass
}
attachSchemaBehavior(optis)
Object.freeze(optis)

export default optis
export type {Dict, Parameter, Processed, ProcessedMap, Schema, Setup, TypedFactory} from './optis/types.ts'
export type {
  Dict as OptisDict,
  Parameter as OptisParameter,
  Processed as OptisProcessed,
  ProcessedMap as OptisProcessedMap,
  Schema as OptisSchema,
  Setup as OptisSetup,
  TypedFactory as OptisTypedFactory,
} from './optis/types.ts'
export {optis, ProcessedOptionsMapValue as ProcessedOptionsMap, RequiredOptionsErrorValue as RequiredOptionsError}
